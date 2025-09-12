import { useNavigate } from "react-router-dom";

const ButtonToHome = () => {
  const navigate = useNavigate();
  return (
    <button className="btn ml-auto" onClick={() => navigate("/")}>
      ホーム画面
    </button>
  );
};

export default ButtonToHome;
