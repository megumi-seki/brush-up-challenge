import { useNavigate } from "react-router-dom";

const ButtonToClockLogs = () => {
  const navigate = useNavigate();
  return (
    <button className="btn" onClick={() => navigate(`/logs`)}>
      タイムレコーダー履歴
    </button>
  );
};

export default ButtonToClockLogs;
