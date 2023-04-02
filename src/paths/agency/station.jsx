import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const agencies = {
  BART: {
    name: "Bay Area Rapid Transit",
    endpoint: "v1/bart",
    color: "#0099d8",
    textColor: "#ffffff",
    type: "train",
  },
};

const hoursMinutesUntilArrival = (arrivalTime) => {
  const now = new Date();
  const arrival = new Date(arrivalTime);

  const minutes = Math.floor((arrival - now) / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return "Due";
  if (hours === 0) return `${minutes % 60}m`;
  if (minutes % 60 === 0) return `${hours}h`;

  return `${hours}h ${minutes % 60}m`;
};

const Station = () => {
  const { agency, stopID } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState({});
  const [trainDestinations, setTrainDestinations] = useState({});
  const [loadingMessage, setLoadingMessage] = useState("Loading trains...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await fetch(
        `https://macro.railstat.us/v1/bart/stations/${stopID}.json`
      );

      const data = await response.json();

      let destinations = {};

      data.upcomingTrains.forEach((vehicle) => {
        const destination = vehicle.routeLongName.split(" to ")[1];
        destinations[destination] = destinations[destination] ?? [];
        destinations[destination].push(vehicle);
      });

      setTrainDestinations(destinations);
      setStation(data);

      setIsLoading(false);
      setTimeout(() => fetchVehicles, 60000);
    };

    fetchVehicles();
  }, [agency, stopID]);

  return (
    <>
      <h1>Railstat.us {agency} Tracker</h1>
      <p>Open source, free, and easy transit tracker.</p>
      <p>Beta 0.0.1</p>
      <h2
        style={{
          marginTop: "4px",
          marginBottom: "8px"
        }}
      >
        {station.name}
      </h2>
      <div>
        {isLoading ? (
          <p>{loadingMessage}</p>
        ) : (
          Object.keys(trainDestinations)
            .sort()
            .map((destination) => (
              <div key={destination} className='trains'>
                <h3 className='destination'>{destination}</h3>
                {trainDestinations[destination].sort((a, b) => {
                  return a.arr - b.arr
                }).map((train) => {
                  const arr = train.arr * 1000;

                  return (
                    <Link
                      to={`/${agency}/track/${train.tripID}`}
                      key={train.tripID}
                      className='trainLink '
                    >
                      <div
                        className='train '
                        style={{
                          backgroundColor: `#${train.routeColor}`,
                          color: `#${train.routeTextColor}`,
                        }}
                      >
                        <span>
                          <p>
                            {train.routeShortName} trip #{train.tripID} to
                          </p>
                          <h3>{train.routeLongName.split(" to ")[1]}</h3>
                        </span>
                        <span>
                          <h3>{hoursMinutesUntilArrival(arr)}</h3>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))
        )}
        <h3
          className='train'
          key='backButton'
          style={{
            backgroundColor: agencies[agency].color,
            color: agencies[agency].textColor,
            marginTop: "16px",
          }}
          onClick={() => {
            if (history.state.idx && history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate(`/${agency}`, { replace: true }); //fallback
            }
          }}
        >
          Choose Another Train
        </h3>
      </div>
    </>
  );
};

export default Station;
