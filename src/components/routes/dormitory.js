import { Route } from "react-router-dom";
import AreaView from "../admin/area/area-view";
import AreaList from "../admin/area/area-list";
import TypeRoomView from "../admin/typeroom/typeroom-view"
import TypeRoomList from "../admin/typeroom/typeroom-list"
import RoomView from "../admin/room/room-view"
import RoomList from "../admin/room/room-list"
import BillView from "../admin/Bill/BillView"
import BillList from "../admin/Bill/BillList"
import ContractAdd from "../admin/contract/contract-add"
import ContractList from "../admin/contract/contract-list"
import PaidService from "../admin/service/paid-service"
import FreeService from "../admin/service/free-service"
import ReceiptView from "../admin/receipt/receipt-view"
import ReceiptList from "../admin/receipt/receipt-list"
import TroubleView from "../admin/trouble/trouble-view"
import TroubleList from "../admin/trouble/trouble-list"
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
export default function DormitoryRoute() {
  return (
    <Switch>
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
      <Route path="/Admin/Contract/Add">
        <ContractAdd />
      </Route>
      <Route path="/Admin/Contract/Edit/:id">
        <ContractAdd />
      </Route>
      <Route path="/Admin/Contract">
        <ContractList />
      </Route>
      <Route path="/Admin/Service/Paid">
        <PaidService />
      </Route>
      <Route path="/Admin/Service/Free">
        <FreeService />
      </Route>
      <Route path="/Admin/Receipt/Add">
        <ReceiptView />
      </Route>
      <Route path="/Admin/Receipt/View/:id">
        <ReceiptView />
      </Route>
      <Route path="/Admin/Receipt">
        <ReceiptList />
      </Route>
      <Route path="/Admin/Trouble/View/:id">
        <TroubleView />
      </Route>
      <Route path="/Admin/Trouble/Add">
        <TroubleView />
      </Route>
      <Route path="/Admin/Trouble">
        <TroubleList />
      </Route>
    </Switch>
  )
}