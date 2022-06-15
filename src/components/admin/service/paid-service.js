import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
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
import { paidServiceAPI } from "../../../apis/paidService.api";

const PaidService = () => {
    const [loading, setLoading] = useState(true);
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
    const [paidService, setPaidService] = useState([]);
    const [paidServiceAdd, setPaidServiceAdd] = useState({name: '', unit: '', price: ''});


    const checkValue = () => {
        if (!file && !paidServiceAdd.image) {
            TOAST.WARN("Vui lòng chọn hình ảnh !");
            return false
        }
        if (paidServiceAdd.name?.length === 0 || !paidServiceAdd?.name) {
            TOAST.WARN("Vui lòng nhập tên dịch vụ !");
            return false
        }
        if (paidServiceAdd.unit?.length === 0 || !paidServiceAdd?.unit) {
            TOAST.WARN("Vui lòng nhập đơn vị tính !");
            return false
        }
        if (paidServiceAdd.price?.length === 0 || !paidServiceAdd?.price) {
            TOAST.WARN("Vui lòng nhập giá dịch vụ !");
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
                let paidService = {
                    ...paidServiceAdd,
                    userId: 1
                }
                data.append("image", file);
                data.append("paidService", JSON.stringify(paidService));
                console.log(paidServiceAdd)
                await paidServiceAPI.addPaidService(data).then(async data => {
                    if (data) {
                        await paidServiceAPI.addPriceofservice({ price: paidServiceAdd.price, paidServiceId: data }).then(dataPrice => {
                            if (dataPrice) {
                                setImage("");
                                setPaidServiceAdd({});
                                setLoading(false);
                                setOpen(false);
                                getPaidService();
                            }
                        })
                    }
                })
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setLoading(false)
    }

    const handleUpdate = async () => {
        try {
            if (checkValue()) {
                setLoading(true);
                const date = new Date();
                const minutes = date.getMinutes();
                let data = new FormData();
                let paidService = {
                    ...paidServiceAdd,
                    userId: 1
                }
                data.append("image", file ? file : paidServiceAdd.image);
                data.append("paidService", JSON.stringify(paidService));
                await paidServiceAPI.updatePaidService(data, { id: paidServiceAdd.id }).then(async data => {
                    if (data) {
                        await paidServiceAPI.addPriceofservice({ price: paidServiceAdd.price, paidServiceId: paidServiceAdd.id }).then(dataPrice => {
                            if (dataPrice) {
                                setImage("");
                                setPaidServiceAdd({});
                                setLoading(false);
                                setOpen(false);
                                getPaidService();
                            }
                        })
                    }
                })
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setLoading(false)
    }


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

    const getPaidService = async () => {
        try {
            await paidServiceAPI.getListPaidService({ userId: 1 }).then(data => {
                console.log(data);
                data.map(item => {
                    return item.price = item?.priceofservices[item.priceofservices?.length - 1].price
                })
                setPaidService(data)
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
        // setTimeout(() => setLoading(false), 1000)
    }

    useEffect(() => {
        getPaidService();
        setTimeout(() => {
            setLoading(false);
        }, 1000)
    }, []);

    const confirm = (_, row) => {
        setSelected(row);
        setMessage(`Có chắc mún xóa "${row.name}"`);
        setIsShow(true);
    }

    const openEdit = async (data) => {
        try {
            let paidServiceSelected = paidService.filter(item => item.id === data)
            console.log(paidServiceSelected);
            setPaidServiceAdd(paidServiceSelected[0]);
            setOpen(true)
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }
    const handleDelete = async () => {
        try {
            await paidServiceAPI.deletePaidservice({ id: selected?.id, image: selected?.image }).then(data => {
                if (data) {
                    TOAST.SUCCESS(MESSAGE.DELETE_SUCCESS)
                    getPaidService();
                } else {
                    TOAST.EROR(MESSAGE.DELETE_ERROR)
                }
            })

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
        // <Loading loading={loading}>
        <div>
            <Alert isShow={isShow} close={() => setIsShow(false)} title={title} confirm={handleDelete} status={ALERT.QUESTION}>{message}</Alert>
            <Popup size="lg" title={title} close={() => setOpen(false)} open={open} confirm={paidServiceAdd?.id ? handleUpdate : handleAdd} labelConfirm={paidServiceAdd?.id ? "Cập nhật" : "Thêm"}>
                <Loading loading={loading}>
                    <Grid container spacing={4} columns={16} className="py-4">
                        <Grid item md={8} sm={16}>
                            <Card className="card-file">
                                <label className="input-file">
                                    <Input onChange={e => handleChange(e)} accept="image/*" className="d-none" id="icon-button-file" type="file" />
                                    {
                                        loadingImage ? <CircularProgress /> :
                                            image.length === 0 && !paidServiceAdd.image ?
                                                <CameraAltIcon color="primary" sx={{ fontSize: 120 }} /> :
                                                <img src={image ? image : (PATH.URL_SERVER.concat(paidServiceAdd.image))} />
                                    }
                                </label>
                            </Card>
                        </Grid>
                        <Grid item md={8} sm={16}>
                            <Grid container spacing={2} columns={16}>
                                <Grid item sm={16}>
                                    <Box>
                                        <FormControl fullWidth>
                                            <TextField value={paidServiceAdd?.name} onChange={e => setPaidServiceAdd({
                                                ...paidServiceAdd,
                                                name: e.target.value
                                            })} label="Tên dịch vụ" variant="standard" />
                                        </FormControl>
                                    </Box>
                                </Grid>
                                <Grid item sm={16}>
                                    <Box>
                                        <FormControl fullWidth>
                                            <TextField value={paidServiceAdd?.unit} onChange={e => setPaidServiceAdd({
                                                ...paidServiceAdd,
                                                unit: e.target.value
                                            })} label="Đơn vị tính" variant="standard" />
                                        </FormControl>
                                    </Box>
                                </Grid>
                                <Grid item sm={16}>
                                    <Box>
                                        <FormControl fullWidth>
                                            <TextField value={paidServiceAdd?.price} onChange={e => setPaidServiceAdd({
                                                ...paidServiceAdd,
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
                                render: (data, row) => <div className="table-img"><img src={PATH.URL_SERVER + row.image} alt="" /></div>
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
        // </Loading>
    )

}

export default PaidService;