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
export default function TroubleView() {
    const [value, setValue] = useState(new Date());
    const title = "Thêm biên nhận";
    const history = useHistory();
    const [materialTypes, setMaterialTypes] = useState([]);
    const [material, setMaterial] = useState(initMaterial);
    const [image, setImage] = useState("")
    const [file, setFile] = useState();
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(true);
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
    const handleChange = (newValue) => {
        setValue(newValue);
    };
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
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Phòng</InputLabel>
                                        <Select
                                            value={material?.idMaterialType}
                                            label="Phòng"
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
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={material?.name} onChange={e => setMaterial({
                                            ...material,
                                            name: e.target.value
                                        })} label="Tên sự cố" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                label="Thời gian xảy ra sự cố"
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
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Mức độ</InputLabel>
                                        <Select
                                            value={material?.idMaterialType}
                                            label="Mức độ"
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
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={material?.name} onChange={e => setMaterial({
                                            ...material,
                                            name: e.target.value
                                        })} label="Tình trạng sự cố" variant="standard" />
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
                </Grid>
            </div >
        </Loading>
    )
}