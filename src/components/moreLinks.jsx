import { Link } from "react-router-dom";

const MoreLinks = () => {
  return (
    <>
      <h2>More Links</h2>
      <div style={{
        display: 'flex',
        gap: '4px',
      }}>
        <p>
          <Link to='/about'>About</Link>
        </p>
        <p>
          <Link to='/settings'>Settings</Link>
        </p>
      </div>
    </>
  );
};

export default MoreLinks;
