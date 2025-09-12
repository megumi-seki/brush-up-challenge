import { useNavigate } from "react-router-dom";

const ButtonToCorrectionCheck = () => {
  const navigate = useNavigate();
  return (
    <button className="btn" onClick={() => navigate(`/correction-check`)}>
      タイムレコーダー修正確認
    </button>
  );
};

export default ButtonToCorrectionCheck;
