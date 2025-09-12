import { useNavigate } from "react-router-dom";
import type { Employee } from "../types";
import getRolesText from "../hooks/getRolesText";
import ButtonToClockLogs from "../components/ButtonToClockLogs";
import formatDate from "../hooks/formatDate";

type HomeProps = {
  employees: Employee[];
};

const Home = ({ employees }: HomeProps) => {
  const navigate = useNavigate();
  const today = new Date();

  const pageContent = (
    <div className="container">
      <div className="flex gap-small">
        <span>事業所名称:</span>
        <span>開発用テスト事業所</span>
      </div>
      <div>
        <div className="flex justify-between align-center">
          <h3>従業員一覧</h3>
          <ButtonToClockLogs />
        </div>
        <table border={1}>
          <thead>
            <tr>
              <th className="home-th">従業員番号</th>
              <th className="home-th">名前</th>
              <th className="home-th">役職</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr
                className="with-hover"
                key={emp.id}
                onClick={() =>
                  navigate(
                    `/detail/${emp.id}/${today.toISOString().split("T")[0]}`
                  )
                }
              >
                <td className="home-td">{emp.id}</td>
                <td className="home-td">{emp.name}</td>
                <td className="home-td">
                  {getRolesText({ roles: emp.roles })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return pageContent;
};

export default Home;
