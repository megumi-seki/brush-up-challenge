import type { Employee } from "../types";

const getEmployeeById = (empId: string): Employee | null => {
  const storedData = localStorage.getItem("employees");
  if (!storedData) return null;
  const employees: Employee[] = JSON.parse(storedData);
  return employees.find((emp) => emp.id === empId) || null;
};

export default getEmployeeById;
