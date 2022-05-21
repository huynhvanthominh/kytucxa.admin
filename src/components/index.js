import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import IndexAdmin from "./admin";
import NotFoundPage from "./error/not-found-page";
import "../css/index.scss"

const Index = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/Admin/" />
        </Route>
        <Route path="/Admin/">
          <IndexAdmin />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Index;
