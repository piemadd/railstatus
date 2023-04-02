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

const Agency = () => {
  const { agency } = useParams();
  const navigate = useNavigate();
  const [lines, setLines] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("Loading data...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const response = await fetch(
        `https://macro.railstat.us/${agencies[agency].endpoint}/vehicles.json`
      );

      const data = await response.json();

      let lineData = {};
      Object.values(data).forEach((vehicle) => {
        lineData[vehicle.routeShortName] = {
          name: vehicle.routeShortName,
          color: vehicle.routeColor,
          textColor: vehicle.routeTextColor,
        };
      });

      setLines(Object.values(lineData));

      console.log(lineData);

      setIsLoading(false);
      //don't need to re-fetch data as we only need the line names
      //setTimeout(() => fetchVehicles, 60000);
    };

    fetchVehicles();
  }, [agency]);

  return (
    <>
      <h1>Railstat.us {agency} Tracker</h1>
      <p>Open source, free, and easy transit tracker.</p>
      <p>Beta 0.0.1</p>
      <h2
        style={{
          marginTop: "4px",
        }}
      >
        Routes
      </h2>
      <p>
        Choose the line you would like to track a {agencies[agency].type} on:
      </p>
      <div className='routes'>
        {isLoading ? (
          <p>{loadingMessage}</p>
        ) : (
          lines.map((line) => (
            <h3 key={line.name}>
              <Link
                to={`/${agency}/${line.name}`}
                className='route'
                style={{
                  backgroundColor: `#${line.color}`,
                  color: `#${line.textColor}`,
                }}
              >
                {line.name}
              </Link>
            </h3>
          ))
        )}
        <h3
          className='route'
          key='backButton'
          style={{
            backgroundColor: agencies[agency].color,
            color: agencies[agency].textColor,
          }}
          onClick={() => {
            if (history.state.idx && history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate("/", { replace: true }); //fallback
            }
          }}
        >
          Choose Another Agency
        </h3>
      </div>
    </>
  );
};

export default Agency;
