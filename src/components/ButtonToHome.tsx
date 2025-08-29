import { useNavigate } from "react-router-dom";

const ButtonToHome = () => {
  const navigate = useNavigate();
  return (
    <button className="btn ml-auto" onClick={() => navigate("/")}>
      ホーム画面に戻る
    </button>
  );
};

export default ButtonToHome;
