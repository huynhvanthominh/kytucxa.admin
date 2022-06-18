import * as React from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from "react-router-dom";

export default function Menu() {
  const [statistical, setStatistical] = React.useState(false);
  const [service, setService] = React.useState(false);
  const [connect, setConnect] = React.useState(false);
  const [material, setMaterial] = React.useState(false);
  const [dormitory, setDormitory] = React.useState(false);

  const clickConnect = () => {
    setConnect(!connect);
    setMaterial(false)
    setDormitory(false)
  }

  const clickService = () => {
    setService(!service);
  };

  const clickStatistical = () => {
    setStatistical(!statistical)
  }

  const clickDormitor = () => {
    setDormitory(!dormitory);
    setConnect(false)
    setMaterial(false)
  }

  const clickMaterial = () => {
    setMaterial(!material);
    setConnect(false)
    setDormitory(false)
  }

  return (
    <div className="component_menu_admin">
      <div className="component_menu_admin_title">
        <p>Quản lý cơ sở vật chất</p>
      </div>
      <ul className="component_menu_admin_menu">
        <li className="component_menu_admin_menu_item">
          <Link to={"#"} onClick={clickDormitor}>Ký túc xá
            <span className="component_menu_admin_menu_item_icon">
              {dormitory ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </span>
          </Link>
        </li>
        {
          dormitory && (
            <ul className="component_menu_admin_menu component_menu_admin_sub_menu">
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Area"}>Khu</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/TypeRoom"}>Loại phòng</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Room"}>Phòng</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"#"} onClick={clickService}>Dịch vụ
                  <span className="component_menu_admin_menu_item_icon">
                    {service ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                  </span>
                </Link>
              </li>
              {
                service && (
                  <ul className="component_menu_admin_menu component_menu_admin_sub_menu">
                    <li className="component_menu_admin_menu_item">
                      <Link to={"/Admin/Service/Paid"}>Có phí</Link>
                    </li>
                    <li className="component_menu_admin_menu_item">
                      <Link to={"/Admin/Service/Free"}>Miễn phí</Link>
                    </li>
                  </ul>
                )
              }
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Trouble/"}>Sự cố</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Bill/"}>Hoá đơn</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Contract/"}>Hợp đồng</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Receipt/"}>Biên nhận</Link>
              </li>
            </ul>
          )
        }
        <li className="component_menu_admin_menu_item">
          <Link to={"#"} onClick={clickMaterial}>Cơ sở vật chất
            <span className="component_menu_admin_menu_item_icon">
              {material ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </span>
          </Link>
        </li>
        {
          material && (
            <ul className="component_menu_admin_menu component_menu_admin_sub_menu">
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Material-Type/"}>Loại vật chất</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Material/"}>Vật chất</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Input/"}>Nhập vật chất</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Bill-Material/"}>Hoá đơn</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"/Admin/Activity"}>Hoạt động</Link>
              </li>
              <li className="component_menu_admin_menu_item">
                <Link to={"#"} onClick={clickStatistical}>Thống kê
                  <span className="component_menu_admin_menu_item_icon">
                    {statistical ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                  </span>
                </Link>
              </li>
              {
                statistical && (
                  <ul className="component_menu_admin_menu component_menu_admin_sub_menu">
                    <li className="component_menu_admin_menu_item">
                      <Link to={"/Admin/Statistical/Material-Type/"}>Loại vật chất</Link>
                    </li>
                    <li className="component_menu_admin_menu_item">
                      <Link to={"/Admin/Statistical/Report/"}>Sự cố</Link>
                    </li>
                  </ul>
                )
              }
            </ul>
          )
        }
        <li className="component_menu_admin_menu_item">
          <Link to={"#"} onClick={clickConnect}>Liên kết
            <span className="component_menu_admin_menu_item_icon">
              {connect ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </span>
          </Link>
        </li>
        {connect && (
          <ul className="component_menu_admin_menu component_menu_admin_sub_menu">
            <li className="component_menu_admin_menu_item">
              <Link to={"/Admin/Connect/input-material-to-room/"}>Nhập vật chất vào phòng</Link>
            </li>
            <li className="component_menu_admin_menu_item">
              <Link to={"/Admin/Connect/view-material-in-room/"}>Xem vật chất trong phòng</Link>
            </li>
          </ul>
        )}
      </ul>
    </div >
  );
}