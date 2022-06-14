import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import { ListItem } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
// import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { Link, useRouteMatch } from "react-router-dom";

export default function Menu() {
  const { path } = useRouteMatch();
  const materialType = path + "Material-Type";
  const material = path + "Material";
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  const [statistical, setStatistical] = React.useState(false);
  const [service, setService] = React.useState(false);
  const [connect, setConnect] = React.useState(false);
  const clickConnect = () => {
    setConnect(!connect);
  }
  const handleClick = () => {
    setOpen(!open);
  };
  const clickService = () => {
    setService(!service);
  };
  const clickStatistical = () => {
    setStatistical(!statistical)
  }
  return (
    <List
      component="nav"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          QUẢN LÝ KÝ TÚC XÁ
        </ListSubheader>
      }
    >
      <ListItem
        selected={selected === 5}
        onClick={() => setSelected(5)}
        button
        component={React.forwardRef((props, ref) => (
          <Link {...props} ref={ref} to={"/Admin/Area"}></Link>
        ))}
      >
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Khu" />
      </ListItem>
      <ListItem
        selected={selected === 6}
        onClick={() => setSelected(6)}
        button
        component={React.forwardRef((props, ref) => (
          <Link {...props} ref={ref} to={"/Admin/TypeRoom"}></Link>
        ))}
      >
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Loại phòng" />
      </ListItem>
      <ListItem
        selected={selected === 7}
        onClick={() => setSelected(7)}
        button
        component={React.forwardRef((props, ref) => (
          <Link {...props} ref={ref} to={"/Admin/Room"}></Link>
        ))}
      >
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Phòng" />
      </ListItem>
      <ListItemButton onClick={clickService}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Dịch vụ" />
        {service ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={service} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            selected={selected === 8.1} onClick={() => setSelected(8.1)}
            sx={{ pl: 4 }}
            button
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Service/Paid"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Có phí" />
          </ListItem>

          <ListItem
            sx={{ pl: 4 }}
            button
            selected={selected === 8.2}
            onClick={() => setSelected(8.2)}
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Service/Free"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Miễn phí" />
          </ListItem>
        </List>
      </Collapse >
      <ListItem
        selected={selected === 9}
        onClick={() => setSelected(9)}
        button
        component={React.forwardRef((props, ref) => (
          <Link {...props} ref={ref} to={"/Admin/Trouble/"}></Link>
        ))}
      >
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Sự cố" />
      </ListItem>
      <ListItem
        selected={selected === 0}
        onClick={() => setSelected(0)}
        button
        component={React.forwardRef((props, ref) => (
          <Link {...props} ref={ref} to={materialType}></Link>
        ))}
      >
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Loại vật chất" />
      </ListItem>
      <ListItem
        selected={selected === 1}
        onClick={() => setSelected(1)}
        button
        component={React.forwardRef((props, ref) => (
          <Link {...props} ref={ref} to={material}></Link>
        ))}
      >
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Vật chất" />
      </ListItem>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Hóa đơn" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            selected={selected === 3.1} onClick={() => setSelected(3.1)}
            sx={{ pl: 4 }}
            button
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Input"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Nhập" />
          </ListItem>

          <ListItem
            sx={{ pl: 4 }}
            button
            selected={selected === 3.2}
            onClick={() => setSelected(3.2)}
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Bill-Material"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Hóa đơn vật chất" />
          </ListItem>

          <ListItem
            sx={{ pl: 4 }}
            button
            selected={selected === 3.3}
            onClick={() => setSelected(3.3)}
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Contract"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Hợp đồng" />
          </ListItem>

          <ListItem
            sx={{ pl: 4 }}
            button
            selected={selected === 3.4}
            onClick={() => setSelected(3.4)}
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Bill"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Hoá đơn hợp đồng" />
          </ListItem>

          <ListItem
            sx={{ pl: 4 }}
            button
            selected={selected === 3.5}
            onClick={() => setSelected(3.5)}
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Receipt"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Biên nhận" />
          </ListItem>

        </List>
      </Collapse >
      <ListItemButton onClick={clickStatistical}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Thống kê" />
        {statistical ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={statistical} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            sx={{ pl: 4 }}
            button
            selected={selected === 4.1}
            onClick={() => setSelected(4.1)}
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Statistical/Material-Type"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Loại vật chất" />
          </ListItem>

          <ListItem
            sx={{ pl: 4 }}
            button
            selected={selected === 4.2}
            onClick={() => setSelected(4.2)}
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Bill-Material"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Vật chất" />
          </ListItem>
        </List>
      </Collapse >
      <ListItemButton onClick={clickConnect}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Liên kết" />
        {connect ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={connect} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            sx={{ pl: 4 }}
            button
            selected={selected === 11.1}
            onClick={() => setSelected(11.1)}
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Connect/input-material-to-room"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Nhập vật chất vào phòng" />
          </ListItem>

          <ListItem
            sx={{ pl: 4 }}
            button
            selected={selected === 4.2}
            onClick={() => setSelected(4.2)}
            component={React.forwardRef((props, ref) => (
              <Link {...props} ref={ref} to={"/Admin/Bill-Material"}></Link>
            ))}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Vật chất" />
          </ListItem>
        </List>
      </Collapse >
    </List >
  );
}