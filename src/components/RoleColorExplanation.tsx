import { defaultRoleOptions } from "./TimeRecorderForm";

type color = {
  value: string;
  label: string;
};

type RoleColorExplanationProps = {
  showRoleWithColor: boolean;
};

const RoleColorExplanation = ({
  showRoleWithColor,
}: RoleColorExplanationProps) => {
  let colors: color[] = [
    { value: "break", label: "休憩時間" },
    { value: "none", label: "非労働時間" },
  ];

  if (showRoleWithColor) {
    colors.unshift(...defaultRoleOptions);
  } else {
    colors.unshift({ value: "work", label: "勤務時間" });
  }

  return (
    <>
      {colors.map((role) => (
        <span className={`color-explain ${role.value}`}>{role.label}</span>
      ))}
    </>
  );
};

export default RoleColorExplanation;
