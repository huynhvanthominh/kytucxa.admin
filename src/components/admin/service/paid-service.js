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
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PATH from "../../../consts/path";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Popup from "../../themes/popup/popup";
import { Card, CircularProgress, Grid, Input, TextField } from "@mui/material";
import Loading from "../../../customs/loading";
const PaidService = () => {
    const [loading, setLoading] = useState(false);
    const [material, setMaterial] = useState();
    const title = "Dịch vụ có phí";
    const history = useHistory();
    const { path } = useRouteMatch();
    const [materials, setMaterials] = useState([]);
    const [materialType, setMaterialType] = useState(-1)
    const [materialTypes, setMaterialTypes] = useState([])
    const [message, setMessage] = useState("");
    const [isShow, setIsShow] = useState(false)
    const [selected, setSelected] = useState({});
    const [open, setOpen] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [file, setFile] = useState();
    const [image, setImage] = useState("")
    const [paidService, setPaidService] = useState([
        {
            image: "https://cafefcdn.com/2019/11/1/photo-4-1572573804043806864838.jpg",
            name: "Thức ăn",
            unit: "vnd/phần",
            price: 100000
        },
        {
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoahKd2vmM-Mv3SYb0WRTBYfcx569D6AaT1Q&usqp=CAU",
            name: "Thức uống",
            unit: "vnd/phần",
            price: 50000
        }
    ]);
    const handleChange = (e) => {
        setLoadingImage(true)
        const reader = new FileReader();
        const file = e.target.files[0]
        setFile(file)
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result)
        };
        setTimeout(() => setLoadingImage(false), 500)
    }

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
            <Popup size="lg" title={title} close={() => setOpen(false)} open={open} confirm={() => { }} labelConfirm={"Cập nhật"}>
                <Loading loading={loading}>
                    <Grid container spacing={4} columns={16} className="py-4">
                        <Grid item md={8} sm={16}>
                            <Card className="card-file">
                                <label className="input-file">
                                    <Input onChange={e => handleChange(e)} accept="image/*" className="d-none" id="icon-button-file" type="file" />
                                    {
                                        loadingImage ? <CircularProgress /> :
                                            image.length === 0 ?
                                                <CameraAltIcon color="primary" sx={{ fontSize: 120 }} /> :
                                                <img src={image} />
                                    }
                                </label>
                            </Card>
                        </Grid>
                        <Grid item md={8} sm={16}>
                            <Grid container spacing={2} columns={16}>
                                <Grid item sm={16}>
                                    <Box>
                                        <FormControl fullWidth>
                                            <TextField value={material?.name} onChange={e => setMaterial({
                                                ...material,
                                                name: e.target.value
                                            })} label="Tên dịch vụ" variant="standard" />
                                        </FormControl>
                                    </Box>
                                </Grid>
                                <Grid item sm={16}>
                                    <Box>
                                        <FormControl fullWidth>
                                            <TextField value={material?.unit} onChange={e => setMaterial({
                                                ...material,
                                                unit: e.target.value
                                            })} label="Đơn vị tính" variant="standard" />
                                        </FormControl>
                                    </Box>
                                </Grid>
                                <Grid item sm={16}>
                                    <Box>
                                        <FormControl fullWidth>
                                            <TextField value={material?.price} onChange={e => setMaterial({
                                                ...material,
                                                price: e.target.value
                                            })} label="Giá dịch vụ" variant="standard" type={"number"} className="hide-spin" />
                                        </FormControl>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Loading>
            </Popup>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title} ({materials.length})</h3>
                </div>
                <Button className="ms-auto me-1" variant="contained" onClick={() => setOpen(true)}>
                    <LinkCustom color="white" to={"#"}>
                        <AddIcon />
                        Thêm
                    </LinkCustom>
                </Button>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={paidService} hover striped border filter={<Filter />}>
                    {{
                        columns: [
                            {
                                title: "",
                                search: false,
                                data: "media",
                                className: "justify-content-center",
                                render: (data, row) => <div className="table-img"><img src={row.image} alt="" /></div>
                            },
                            {
                                title: "Tên dịch vụ",
                                data: "name",
                                className: "justify-content-center",
                                sort: true,
                            },
                            
                            {
                                title: "Giá",
                                data: "price",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Đơn vị tính",
                                data: "unit",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
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

export default PaidService;