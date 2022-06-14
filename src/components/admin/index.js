import { Redirect, Route, Switch } from "react-router-dom";
import NotFoundPage from "../error/not-found-page";
import LayoutAdmin from "../layouts/admin/layout-admin";
import AreaList from "./area/area-list";
import AreaView from "./area/area-view";
import BillMaterial from "./bill-material/bill-material";
import BillMaterialView from "./bill-material/bill-materila-view";
import DetailMaterial from "./detai-material/detail-material";
import DetailMaterialView from "./detai-material/detail-material-view";
import InputMaterial from "./input-material";
import MaterialTypeAdd from "./material-type/material-type-add";
import MaterialTypeList from "./material-type/material-type-list";
import MaterialTypeView from "./material-type/material-type-view";
import MaterialAdd from "./material/material-add";
import MaterialList from "./material/material-list";
import MaterialView from "./material/material-view";
import RoomList from "./room/room-list";
import RoomView from "./room/room-view";
import FreeService from "./service/free-service";
import PaidService from "./service/paid-service";
import StatisticalMaterial from "./statistical/statistical-material";
import TypeRoomList from "./typeroom/typeroom-list";
import TypeRoomView from "./typeroom/typeroom-view";
import BillView from "./Bill/BillView";
import BillList from "./Bill/BillList";
import ContractList from "./contract/contract-list";
import ContractView from "./contract/contract-view";
import ContractAdd from "./contract/contract-add";
import ReceiptList from "./receipt/receipt-list";
import ReceiptView from "./receipt/receipt-view";
import TroubleList from "./trouble/trouble-list";
import TroubleView from "./trouble/trouble-view";
import InputMaterialToRoom from "./connect/input-material-to-room";

const IndexAdmin = () => {
  return (
    <LayoutAdmin>
      <Switch>
        <Route path="/Admin/Material-Type/Edit/:id">
          <MaterialTypeView />
        </Route>
        <Route path="/Admin/Material-Type/Add">
          <MaterialTypeAdd />
        </Route>
        <Route path="/Admin/Material-Type">
          <MaterialTypeList />
        </Route>
        <Route path="/Admin/Detail-Material/View/:id">
          <DetailMaterialView />
        </Route>
        <Route path="/Admin/Detail-Material/:id">
          <DetailMaterial />
        </Route>
        <Route path="/Admin/Material/:id">
          <MaterialView />
        </Route>
        <Route path="/Admin/Material">
          <MaterialList />
        </Route>
        <Route path="/Admin/MaterialAdd">
          <MaterialAdd />
        </Route>
        <Route path="/Admin/Bill-Material/:id">
          <BillMaterialView />
        </Route>
        <Route path="/Admin/Bill-Material">
          <BillMaterial />
        </Route>
        <Route path="/Admin/Input">
          <InputMaterial />
        </Route>
        <Route path="/Admin/Area/View/:id">
          <AreaView />
        </Route>
        <Route path="/Admin/Area/Add">
          <AreaView />
        </Route>
        <Route path="/Admin/Area">
          <AreaList />
        </Route>
        <Route path="/Admin/TypeRoom/Add">
          <TypeRoomView />
        </Route>
        <Route path="/Admin/TypeRoom/View/:id">
          <TypeRoomView />
        </Route>
        <Route path="/Admin/TypeRoom">
          <TypeRoomList />
        </Route>
        <Route path="/Admin/Room/Add">
          <RoomView />
        </Route>
        <Route path="/Admin/Room/View/:id">
          <RoomView />
        </Route>
        <Route path="/Admin/Room">
          <RoomList />
        </Route>
        <Route path="/Admin/Bill/View/:id">
          <BillView />
        </Route>
        <Route path="/Admin/Bill/Add">
          <BillView />
        </Route>
        <Route path="/Admin/Bill">
          <BillList />
        </Route>
        <Route path="/Admin/Contract/Edit/:id">
          <ContractAdd />
        </Route>
        <Route path="/Admin/Contract/Add">
          <ContractView />
        </Route>
        <Route path="/Admin/Contract">
          <ContractList />
        </Route>
        <Route path="/Admin/Statistical/Material-Type">
          <StatisticalMaterial />
        </Route>
        <Route path="/Admin/Statistical/*">
          <Redirect to={"/Admin/Statistical/Material-Type"} />
        </Route>
        <Route path="/Admin/Service/Paid">
          <PaidService/>
        </Route>
        <Route path="/Admin/Service/Free">
          <FreeService/>
        </Route>
        <Route path="/Admin/Receipt/Add">
          <ReceiptView/>
        </Route>
        <Route path="/Admin/Receipt/View/:id">
          <ReceiptView/>
        </Route>
        <Route path="/Admin/Receipt">
          <ReceiptList/>
        </Route>
        <Route path="/Admin/Trouble/View/:id">
          <TroubleView/>
        </Route>
        <Route path="/Admin/Trouble/Add">
          <TroubleView/>
        </Route>
        <Route path="/Admin/Trouble">
          <TroubleList/>
        </Route>
        <Route path="/Admin/Connect/input-material-to-room">
          <InputMaterialToRoom/>
        </Route>
        <Route path="/">
          <Redirect to="/Admin/Material-Type" />
        </Route>
      </Switch>
    </LayoutAdmin>
  );
};

export default IndexAdmin;