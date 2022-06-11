import Header from "./header";
import Menu from "./menu";
import "../../../css/component/layout-admin.scss"
import useMenu from "../../../hooks/useMenu";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const LayoutAdmin = ({ children }) => {
  const history = useHistory();
  useEffect(() => {
    const data = localStorage.getItem("auth")
    if (!data) {
      history.push("/Auth/login")
    }
  }, [])
  const { isShow } = useMenu();
  return (
    <div className="layout-admin">
      {
        isShow && <div className="menu">
          <Menu />
        </div>
      }
      <div className="header-main">
        <div className="header">
          <Header />
        </div>
        <div className="main">{children}</div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
