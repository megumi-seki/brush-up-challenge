import { Link } from "react-router-dom";

const NavBar = () => {
  const content = (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/detail">Detail</Link>
      <Link to="/logs">ClockLogs</Link>
    </nav>
  );

  return content;
};

export default NavBar;
