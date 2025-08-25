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
    <span className="ml-auto">
      {colors.map((role, index) => (
        <span className={`color-explain ${role.value}`} key={index}>
          {role.label}
        </span>
      ))}
    </span>
  );
};

export default RoleColorExplanation;
