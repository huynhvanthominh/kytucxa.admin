
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
      <Switch>
        <Route path={"/Admin/Dashboard"}>
          <Dashboard />
        </Route>
        <Route path={"/Admin/**"}>
          <Redirect to={"/Admin/Dashboard"} />
        </Route>
        <Route path={"/Admin"}>
          <Dashboard />
        </Route>
      </Switch>
    </LayoutAdmin>
  );
};

export default IndexAdmin;