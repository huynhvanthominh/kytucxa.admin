import { Button, Card, CircularProgress, Grid, Input, MenuItem, Select, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from "react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Loading from "../../../customs/loading";
import { materialTypeService } from "../../../apis/material-type.api";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import { TOAST } from "../../../customs/toast-custom";
import { LoadingButton } from "@mui/lab";
import { uploadFileService } from "../../../apis/upload-file.api";
import { materialService } from "../../../apis/material.api";
import MESSAGE from "../../../consts/message-alert";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
const initMaterial = {
    idMaterialType: "",
    name: "",
    media: "",
}

export default function BillView() {

    const title = "Thêm hoá đơn";
    const history = useHistory();
    const [value, setValue] = useState(new Date());
    const [materialTypes, setMaterialTypes] = useState([]);
    const [material, setMaterial] = useState(initMaterial);
    const [image, setImage] = useState("")
    const [file, setFile] = useState();
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false)

    const uploadFile = async () => {
        const { data } = await uploadFileService.uploadImage(file, "material");
        return data
    }

    const checkValue = () => {
        if (!file) {
            TOAST.WARN("Vui lòng chọn hình ảnh !");
            return false
        }
        if (material?.idMaterialType.length === 0) {
            TOAST.WARN("Vui lòng chọn loại vật chất !");
            return false
        }
        if (material?.name.length === 0) {
            TOAST.WARN("Vui lòng nhập tên vật chất !");
            return false
        }
        return true
    }

    const handleAdd = async () => {
        try {
            if (checkValue()) {
                setLoading(true);
                const upload = await uploadFile();

                if (upload?.name) {
                    const { data } = await materialService.add({
                        ...material,
                        media: upload.name
                    });
                    if (data?.error) {
                        console.log(data);
                        TOAST.EROR(data.message)
                        setLoading(false)
                        await uploadFileService.removeImage(upload?.name, "material");
                    } else {
                        TOAST.SUCCESS(MESSAGE.ADD_SUCCESS);
                        history.goBack();
                        setLoading(false);
                    }
                    setLoading(false);
                } else {
                    TOAST.EROR("Upload file thất bại !");
                    setTimeout(() => setLoadingButton(false), 500);
                }
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setLoading(false)
    }

    const fetchMaterialType = async () => {
        try {
            const { data } = await materialTypeService.get();
            setMaterialTypes(data);
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setTimeout(() => setLoading(false), 500)
    }

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        fetchMaterialType();
    }, []);

    return (
        <Loading loading={loading}>
            <div>
                <div className="d-flex align-items-center">
                    <div>
                        <h3>{title}</h3>
                    </div>
                </div>
                <div className="border-bottom border-primary border-5" />
                <Grid container spacing={2} columns={16} className="py-4">
                    <Grid item md={8} sm={16}>
                        <Grid container spacing={2} columns={16}>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Khu</InputLabel>
                                        <Select
                                            value={material?.idMaterialType}
                                            label="Khu"
                                            onChange={e => setMaterial({
                                                ...material,
                                                idMaterialType: e.target.value
                                            })}
                                        >
                                            {
                                                materialTypes.map((materialType, i) => <MenuItem key={i} value={materialType?.id}>{materialType?.name}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Phòng</InputLabel>
                                        <Select
                                            value={material?.x}
                                            label="Phòng"
                                            onChange={e => setMaterial({
                                                ...material,
                                                x: e.target.value
                                            })}
                                        >
                                            {
                                                materialTypes.map((materialType, i) => <MenuItem key={i} value={materialType?.id}>{materialType?.name}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Hợp đồng</InputLabel>
                                        <Select
                                            value={material?.y}
                                            label="Phòng"
                                            onChange={e => setMaterial({
                                                ...material,
                                                y: e.target.value
                                            })}
                                        >
                                            {
                                                materialTypes.map((materialType, i) => <MenuItem key={i} value={materialType?.id}>{materialType?.name}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                label="Ngày thu tiền"
                                                inputFormat="MM/dd/yyyy"
                                                value={value}
                                                onChange={handleChange}
                                                renderInput={(params) => <TextField size="small" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={material?.u} onChange={e => setMaterial({
                                            ...material,
                                            u: e.target.value
                                        })} label="Tên hoá đơn" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={material?.i} onChange={e => setMaterial({
                                            ...material,
                                            i: e.target.value
                                        })} label="Giảm giá (%)" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={material?.p} onChange={e => setMaterial({
                                            ...material,
                                            p: e.target.value
                                        })} label="Phạt" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <LoadingButton loading={loadingButton} variant="contained" endIcon={<AddIcon />} onClick={handleAdd}>Thêm</LoadingButton>
                                    <Button variant="contained" color='inherit' className="ms-1" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Thoát</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={8} sm={16}>
                        <Grid container spacing={2} columns={16}>
                            <Grid item sm={10}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={material?.w} onChange={e => setMaterial({
                                            ...material,
                                            w: e.target.value
                                        })} label="Tổng" size="small"/>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={6}>
                                <Box>
                                    <FormControl fullWidth>
                                        <Button variant="contained">Tính tổng</Button>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Tình trạng</InputLabel>
                                        <Select
                                            value={material?.f}
                                            label="Phòng"
                                            onChange={e => setMaterial({
                                                ...material,
                                                f: e.target.value
                                            })}
                                        >
                                            {
                                                materialTypes.map((materialType, i) => <MenuItem key={i} value={materialType?.id}>{materialType?.name}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={material?.n} onChange={e => setMaterial({
                                            ...material,
                                            n: e.target.value
                                        })} label="Ghi chú" variant="standard" multiline rows={4} size="small"/>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        </Loading>
    )
}