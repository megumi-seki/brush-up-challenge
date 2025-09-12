type ClockLogTableTitleProps = {
  selectedDateString: string;
  setSelectedDateString: React.Dispatch<React.SetStateAction<string>>;
  showRoleWithColor: boolean;
  setShowRoleWithColor: React.Dispatch<React.SetStateAction<boolean>>;
  showDiffs: boolean;
  setShowDiffs: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClockLogTableTitle = ({
  selectedDateString,
  setSelectedDateString,
  showRoleWithColor,
  setShowRoleWithColor,
  showDiffs,
  setShowDiffs,
}: ClockLogTableTitleProps) => {
  const today = new Date();

  const handleOnClick = (type: "previous" | "next") => {
    const selectedDate = new Date(selectedDateString);
    if (type === "next") {
      selectedDate.setDate(selectedDate.getDate() + 1);
    } else {
      selectedDate.setDate(selectedDate.getDate() - 1);
    }
    const newSelectedDateString = selectedDate.toISOString().split("T")[0];
    setSelectedDateString(newSelectedDateString);
  };
  const isCurrentSelectedDateToday =
    selectedDateString === today.toISOString().split("T")[0];

  return (
    <div className="flex justify-between align-center">
      <div className="flex gap-medium align-center">
        <div className="flex gap-small align-center">
          <label htmlFor="selectedDate" className="hidden">
            日付を選択
          </label>
          <input
            type="date"
            id="selectedDate"
            value={selectedDateString}
            className="selected-date"
            onChange={(e) => setSelectedDateString(e.target.value)}
          />
        </div>
        <div className="flex gap-small">
          <button
            type="button"
            className="small-btn"
            onClick={() => handleOnClick("previous")}
          >
            前日
          </button>
          <button
            type="button"
            className="small-btn"
            onClick={() => handleOnClick("next")}
            disabled={isCurrentSelectedDateToday}
          >
            翌日
          </button>
        </div>
      </div>
      <div className="flex gap-medium">
        <button
          className="small-btn"
          onClick={() => setShowRoleWithColor(!showRoleWithColor)}
        >
          担当別配色 {showRoleWithColor ? "OFF" : "ON"}
        </button>
        <button className="small-btn" onClick={() => setShowDiffs(!showDiffs)}>
          シフトとの差異表示 {showDiffs ? "OFF" : "ON"}
        </button>
      </div>
    </div>
  );
};

export default ClockLogTableTitle;
