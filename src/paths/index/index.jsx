import { Link } from "react-router-dom";
import MoreLinks from "../../components/moreLinks";

const agencies = {
  BART: {
    name: "Bay Area Rapid Transit",
    endpoint: "v1/bart",
    color: "#0099d8",
    textColor: "#ffffff",
  },
};

const Index = () => {
  return (
    <>
      <h1>Railstat.us</h1>
      <p>Open source, free, and easy transit tracker.</p>
      <p>v0.0.2 Beta</p>
      <p>Heads up: this shit will probably break!</p>
      <h2
        style={{
          marginTop: "4px",
        }}
      >
        Agencies
      </h2>
      <div className='agencies'>
        {Object.keys(agencies).map((agency) => {
          return (
            <Link
              to={`/${agency}`}
              className='agency'
              style={{
                backgroundColor: agencies[agency].color,
                color: agencies[agency].textColor,
              }}
            >
              <h3>
                {agencies[agency].name} ({agency})
              </h3>
            </Link>
          );
        })}
      </div>
      <MoreLinks />
    </>
  );
};

export default Index;
