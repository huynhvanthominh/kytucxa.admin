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
import { freeServiceAPI } from "../../../apis/freeService.api";
const FreeService = () => {
    const [loading, setLoading] = useState(false);
    const [material, setMaterial] = useState();
    const title = "Dịch vụ miễn phí";
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
    const [freeService, setFreeService] = useState([]);
    const [freeServiceAdd, setFreeServiceAdd] = useState({ name: '' });
    const [fileSrc, setFileSrc] = useState("");
    
    const getFreeService = async () => {
        try {
            await freeServiceAPI.getListFreeService({ userId: 1 }).then(data => {
                setFreeService(data)
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
        // setTimeout(() => setLoading(false), 1000)
    }

    const checkValue = () => {
        if (!file && !freeServiceAdd.image) {
            TOAST.WARN("Vui lòng chọn hình ảnh !");
            return false
        }
        if (freeServiceAdd.name?.length === 0 || !freeServiceAdd?.name) {
            TOAST.WARN("Vui lòng nhập tên dịch vụ !");
            return false
        }
        return true
    }

    const handleAdd = async () => {
        try {
            if (checkValue()) {
                setLoading(true);
                const date = new Date();
                const minutes = date.getMinutes();
                let data = new FormData();
                let freeService = {
                    ...freeServiceAdd,
                    userId: 1
                }
                data.append("image", file);
                data.append("freeService", JSON.stringify(freeService));
                console.log(file)
                await freeServiceAPI.addFreeService(data).then(data => {
                    if (data) {
                        setImage("");
                        setFreeServiceAdd({});
                        setLoading(false);
                        setOpen(false);
                        getFreeService();
                    }
                })
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setLoading(false)
    }

    const openEdit = async (data) => {
        try {
            let freeServiceSelected = freeService.filter(item => item.id === data)
            console.log(freeServiceSelected);
            setFreeServiceAdd(freeServiceSelected[0]);
            setOpen(true)
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const handleUpdate = async () => {
        try {
            if (checkValue()) {
                setLoading(true);
                const date = new Date();
                const minutes = date.getMinutes();
                let data = new FormData();
                let freeService = {
                    ...freeServiceAdd,
                    userId: 1
                }
                data.append("image", file);
                data.append("freeService", JSON.stringify(freeService));
                console.log(file)
                await freeServiceAPI.updateFreeService(data, { id: freeServiceAdd.id }).then(data => {
                    if (data) {
                        setImage("");
                        setFreeServiceAdd({});
                        setLoading(false);
                        setOpen(false);
                        getFreeService();
                    }
                })
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        setFileSrc(e);
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
        getFreeService();
    }, []);

    const confirm = (_, row) => {
        setSelected(row);
        setMessage(`Có chắc muốn xóa "${row.name}"`);
        setIsShow(true);
    }
    const handleDelete = async () => {
        try {
            await freeServiceAPI.deleteFreeservice({ id: selected?.id, image: selected?.image }).then(data => {
                if (data) {
                    TOAST.SUCCESS(MESSAGE.DELETE_SUCCESS)
                    getFreeService();
                } else {
                    TOAST.EROR(MESSAGE.DELETE_ERROR)
                }
            });

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
            <Popup size="sm" title={title} close={() => setOpen(false)} open={open} confirm={freeServiceAdd?.id ? handleUpdate : handleAdd} labelConfirm={freeServiceAdd?.id ? "Cập nhật" : "Thêm"}>
                <Loading loading={loading}>
                    <Grid container spacing={4} columns={16} className="py-4">
                        <Grid item sm={16}>
                            <Box>
                                <FormControl fullWidth>
                                    <TextField value={freeServiceAdd?.name} onChange={e => setFreeServiceAdd({
                                        ...freeServiceAdd,
                                        name: e.target.value
                                    })} label="Tên dịch vụ" variant="standard" />
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item md={16} sm={16}>
                            <Card className="card-file">
                                <label className="input-file">
                                    <Input onChange={e => handleChange(e)} accept="image/*" className="d-none" id="icon-button-file" type="file" />
                                    {
                                        loadingImage ? <CircularProgress /> :
                                            image.length === 0 && !freeServiceAdd ?
                                                <CameraAltIcon color="primary" sx={{ fontSize: 120 }} /> :
                                                <img src={image ? image : (PATH.URL_SERVER.concat(freeServiceAdd.image))} />
                                    }
                                </label>
                            </Card>
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
                <Table dataSource={freeService} hover striped border filter={<Filter />}>
                    {{
                        columns: [
                            {
                                title: "",
                                search: false,
                                data: "image",
                                className: "justify-content-center",
                                render: (data, row) => <div className="table-img"><img src={PATH.URL_SERVER + row.image} alt="" /></div>
                            },
                            {
                                title: "Tên dịch vụ",
                                data: "name",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
                                            <Button onClick={() => { openEdit(data) }} variant="text"><EditIcon color="primary" /></Button>
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

export default FreeService;