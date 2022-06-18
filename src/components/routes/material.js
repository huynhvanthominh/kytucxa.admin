import { Route } from "react-router-dom/cjs/react-router-dom.min";
import BillMaterial from "../admin/bill-material/bill-material";
import BillMaterialView from "../admin/bill-material/bill-materila-view";
import DetailMaterial from "../admin/detai-material/detail-material";
import DetailMaterialView from "../admin/detai-material/detail-material-view";
import InputMaterial from "../admin/input-material";
import MaterialTypeAdd from "../admin/material-type/material-type-add";
import MaterialTypeList from "../admin/material-type/material-type-list";
import MaterialTypeView from "../admin/material-type/material-type-view";
import MaterialAdd from "../admin/material/material-add";
import MaterialList from "../admin/material/material-list";
import MaterialView from "../admin/material/material-view";
import MoveMaterial from "../admin/connect/move-material";
import InputMaterialToRoom from "../admin/connect/input-material-to-room";
import StatisticalMaterial from "../admin/statistical/statistical-material";
import { Redirect } from "react-router-dom";
export default function MaterialRoute() {
    return (
        <>
            <Route path="/Admin/Connect/move-material">
                <MoveMaterial />
            </Route>
            <Route path="/Admin/Connect/input-material-to-room">
                <InputMaterialToRoom />
            </Route>
            <Route path="/Admin/Statistical/Material-Type">
                <StatisticalMaterial />
            </Route>
            <Route path="/Admin/Statistical/*">
                <Redirect to={"/Admin/Statistical/Material-Type"} />
            </Route>
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
        </>
    )
}