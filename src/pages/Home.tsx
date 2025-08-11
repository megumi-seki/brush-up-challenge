import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Employee = {
  id: string;
  name: string;
  roles: string[];
};

const Home = () => {
  const [employeees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("employees");
    if (storedData) {
      setEmployees(JSON.parse(storedData));
    } else {
      // デモ用に、初期データがない場合はダミーデータを保存
      const initialData: Employee[] = [
        { id: "001", name: "田中太郎", roles: ["釜番"] },
        { id: "002", name: "山田花子", roles: ["サンドイッチ", "麺台"] },
      ];
      localStorage.setItem("employees", JSON.stringify(initialData));
      setEmployees(initialData);
    }
  }, []);

  const pageContent = (
    <div>
      <div>
        <span>事業所名称:</span>
        <span>開発用テスト事業所</span>
      </div>
      <div>
        <h3>従業員一覧</h3>
        <div className="btn-frame">
          <Link to="/logs">本日のタイムレコーダー履歴</Link>
        </div>
        <div></div>
        <table border={1}>
          <thead>
            <th>従業員番号</th>
            <th>名前</th>
            <th>役職</th>
          </thead>
          <tbody>
            {employeees.map((emp) => (
              <tr>
                <td>
                  <Link to={`/detail/${emp.id}/2025-08-11/0`}>{emp.id}</Link>
                </td>
                <td>{emp.name}</td>
                <td>{emp.roles}</td>
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
