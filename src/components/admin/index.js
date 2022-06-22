
import LayoutAdmin from "../layouts/admin/layout-admin";
import MaterialRoute from "../routes/material";
import DormitoryRoute from "../routes/dormitory";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "./dashboard/dashboard";

const IndexAdmin = () => {
  return (
    <LayoutAdmin>
      <MaterialRoute />
      <DormitoryRoute />
    </LayoutAdmin>
  );
};

export default IndexAdmin;