import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ClockLogs from "./pages/ClockLogs";
import Home from "./pages/Home";
import Detail from "./pages/Detail";

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/logs" element={<ClockLogs />} />
      </Routes>
    </div>
  );
}

export default App;
