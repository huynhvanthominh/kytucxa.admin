import Alert from "../../../customs/Alert-custom";
import ALERT from "../../../consts/status-alter";
import { LinkCustom } from "../../../customs/Link.Custom";
import AddIcon from "@mui/icons-material/Add";
import Table from "../../themes/table/table";
import PATH from "../../../consts/path";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { pink } from "@mui/material/colors";
import { useHistory } from "react-router-dom"
import { useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
export default function BillList() {
    const title = "Hoá đơn hợp đồng";
    const history = useHistory();
    const [materials, setMaterials] = useState([]);
    const [materialType, setMaterialType] = useState(-1)
    const [materialTypes, setMaterialTypes] = useState([])
    const [message, setMessage] = useState("");
    const [isShow, setIsShow] = useState(false)
    const [selected, setSelected] = useState({});
    const handleDelete = async () => { }
    const confirm = () => { }
    const Filter = () => {
        return (
            <div className="d-flex">
                <Box>
                    <FormControl fullWidth size="small">
                        <InputLabel>Khu</InputLabel>
                        <Select
                            className="min-width-200"
                            label="Khu"
                            value={materialType}
                            onChange={e => setMaterialType(e.target.value)}
                        >
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                materialTypes.map((materialType, i) => <MenuItem key={i} value={materialType?.id}>{materialType?.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box className="ms-2">
                    <FormControl fullWidth size="small">
                        <InputLabel>Phòng</InputLabel>
                        <Select
                            className="min-width-200"
                            label="Phòng"
                            value={materialType}
                            onChange={e => setMaterialType(e.target.value)}
                        >
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                materialTypes.map((materialType, i) => <MenuItem key={i} value={materialType?.id}>{materialType?.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box className="ms-2">
                    <FormControl fullWidth size="small">
                        <InputLabel>Hợp đồng</InputLabel>
                        <Select
                            className="min-width-200"
                            label="Hợp đồng"
                            value={materialType}
                            onChange={e => setMaterialType(e.target.value)}
                        >
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                materialTypes.map((materialType, i) => <MenuItem key={i} value={materialType?.id}>{materialType?.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
            </div>
        )
    }

    return (
        <div>
            <Alert isShow={isShow} close={() => setIsShow(false)} title={title} confirm={handleDelete} status={ALERT.QUESTION}>{message}</Alert>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title} ({materials.length})</h3>
                </div>
                <Button className="ms-auto me-1" variant="contained">
                    <LinkCustom color="white" to={"/Admin/Bill/Add"}>
                        <AddIcon />
                        Thêm
                    </LinkCustom>
                </Button>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={materials} hover striped border filter={<Filter />}>
                    {{
                        columns: [
                            {
                                title: "Hoá đơn",
                                sort:true,
                                data: "media",
                                className: "justify-content-center",
                                render: (data) => <div className="table-img"><img src={PATH.MATERIAL + data} alt="" /></div>
                            },
                            {
                                title: "Ngày thu",
                                data: "name",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Trạng thái",
                                data: "nameMaterialtype",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
                                            <Button onClick={() => { history.push("/Admin/Detail-Material/" + data) }} variant="text"><RemoveRedEyeIcon color="success" /></Button>
                                            <Button onClick={() => { history.push("/Admin/Material/" + data) }} variant="text"><EditIcon color="primary" /></Button>
                                            <Button onClick={() => confirm(data, row)} variant="text"><DeleteForeverIcon sx={{ color: pink[500] }} /></Button>
                                        </div>
                                    );
                                },
                            },
                        ],
                    }}
                </Table>
            </div>
        </div>
    )
}