import Header from "./header";
import Menu from "./menu";
import "../../../css/component/layout-admin.scss"

const LayoutAdmin = ({ children }) => {
  return (
    <div className="layout-admin">
      <div className="menu">
        <Menu />
      </div>
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
