import type { Employee } from "../types";

const getEmpNameById = (id: string) => {
  const storedData = localStorage.getItem("employees");

  if (!storedData) {
    console.error("従業員情報が保存されていません");
    return "";
  }

  const parsedData: Employee[] = JSON.parse(storedData);
  const matchedEmployee = parsedData.find((employee) => employee.id === id);

  if (!matchedEmployee) {
    console.error("IDとマッチする従業員情報が保存されていません");
    return "";
  }

  return matchedEmployee.name;
};

export default getEmpNameById;
