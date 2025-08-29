import { defaultRoleOptions } from "../components/TimeRecorderForm";

type getRolesTextProps = {
  roles: string[] | undefined;
};

const getRolesText = ({ roles }: getRolesTextProps) => {
  if (!roles) return "";
  const rolesWithLabel = defaultRoleOptions.filter((role) =>
    roles.includes(role.value)
  );
  const text = rolesWithLabel.map((role) => role.label).join(", ");
  return text;
};

export default getRolesText;
