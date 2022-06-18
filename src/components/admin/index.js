
import LayoutAdmin from "../layouts/admin/layout-admin";
import MaterialRoute from "../routes/material";
import DormitoryRoute from "../routes/dormitory";
import { Redirect, Route, Switch } from "react-router-dom";

const IndexAdmin = () => {
  return (
    <LayoutAdmin>
      <Switch>
        <MaterialRoute />
        <DormitoryRoute />
        <Route path="/">
          <Redirect to="/Admin/Area" />
        </Route>
      </Switch>
    </LayoutAdmin>
  );
};

export default IndexAdmin;