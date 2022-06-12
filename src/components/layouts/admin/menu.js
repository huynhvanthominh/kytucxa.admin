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
  const handleClick = () => {
    setOpen(!open);
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
        <ListItemText primary="Hóa đơn vật chất" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            selected={selected === 3.1}
            onClick={() => setSelected(3.1)}
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
            <ListItemText primary="Hóa đơn" />
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
    </List >
  );
}
