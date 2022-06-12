import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { materialService } from "../../../apis/material.api";
import { materialTypeService } from "../../../apis/material-type.api";
import Table from "../../themes/table/table";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import { pink } from "@mui/material/colors";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";
import { LinkCustom } from "../../../customs/Link.Custom";
import { TOAST } from "../../../customs/toast-custom"
import Alert from "../../../customs/Alert-custom";
import ALERT from "../../../consts/status-alter";
import MESSAGE from "../../../consts/message-alert";
import PATH from "../../../consts/path";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const RoomList = () => {

    const title = "Phòng";
    const history = useHistory();
    const { path } = useRouteMatch();
    const [materials, setMaterials] = useState([]);
    const [materialType, setMaterialType] = useState(-1)
    const [materialTypes, setMaterialTypes] = useState([])
    const [message, setMessage] = useState("");
    const [isShow, setIsShow] = useState(false)
    const [selected, setSelected] = useState({});

    useEffect(() => {
        const fetchMaterialType = async () => {
            const { data } = await materialTypeService.get();
            setMaterialTypes(data)
        }
        fetchMaterialType()
    }, [])

    const getData = async () => {
        try {
            if (materialType === -1) {
                const { data } = await materialService.get();
                setMaterials(data);
            } else {
                const { data } = await materialService.getByIdLoaivatchat(materialType);
                setMaterials(data);
            }

        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        getData();
    }, [materialType]);

    const confirm = (_, row) => {
        setSelected(row);
        setMessage(`Có chắc mún xóa "${row.name}"`);
        setIsShow(true);
    }
    const handleDelete = async () => {
        try {
            const { data } = await materialService.delete(selected?.id);
            if (data.status) {
                TOAST.SUCCESS(MESSAGE.DELETE_SUCCESS)
                getData();
            } else {
                TOAST.EROR(MESSAGE.DELETE_ERROR)
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const Filter = () => {
        return (
            <Box>
                <FormControl fullWidth size="small">
                    <InputLabel>Loại vật chất</InputLabel>
                    <Select
                        className="min-width-200"
                        label="Loại vật chất"
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
                    <LinkCustom color="white" to={"/Admin/Room/Add"}>
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
                                title: "",
                                search: false,
                                data: "media",
                                className: "justify-content-center",
                                render: (data) => <div className="table-img"><img src={PATH.MATERIAL + data} alt="" /></div>
                            },
                            {
                                title: "Tên vật chất",
                                data: "name",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Tên loại vật chất",
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

export default RoomList;