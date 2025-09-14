import { DEFAULT_ROLE_OPTIONS } from "../constants/appConfig";

type getRolesTextProps = {
  roles: string[] | undefined;
};

const getRolesText = ({ roles }: getRolesTextProps) => {
  if (!roles) return "";
  const rolesWithLabel = DEFAULT_ROLE_OPTIONS.filter((role) =>
    roles.includes(role.value)
  );
  const text = rolesWithLabel.map((role) => role.label).join(", ");
  return text;
};

export default getRolesText;
