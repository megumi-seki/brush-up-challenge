import { Link } from "react-router-dom";

const NavBar = () => {
  const today = new Date().toISOString().split("T")[0];
  const content = (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/detail">Detail</Link>
      <Link to={`/logs/${today}`}>ClockLogs</Link>
    </nav>
  );

  return content;
};

export default NavBar;
