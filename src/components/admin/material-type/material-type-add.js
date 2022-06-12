/* eslint-disable jsx-a11y/alt-text */
import { Button, Card, Grid, Input, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useEffect, useState } from "react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { materialTypeService } from "../../../apis/material-type.api";
import { uploadFileService } from "../../../apis/upload-file.api";
import { useHistory } from "react-router-dom";
import Alert from "../../../customs/Alert-custom";
import ALERT from "../../../consts/status-alter";
import MESSAGE from "../../../consts/message-alert"
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { TOAST } from "../../../customs/toast-custom";
import Loading from "../../../customs/loading";

const initMaterialType = {
    name: "",
    media: "",
}

const MaterialTypeAdd = () => {
    const title = "Loại vật chất";
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [materialType, setMaterialType] = useState(initMaterialType);
    const [image, setImage] = useState("")
    const [file, setFile] = useState(null)
    const [loadingImage, setLoadingImage] = useState(false);

    setTimeout(() => setLoading(false), 1000)

    const handleChange = (e) => {
        setLoadingImage(true)
        const reader = new FileReader();
        const file = e.target.files[0]
        if (file.type.split("/")[0] === "image") {
            setFile(file)
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = function () {
                setImage(reader.result)
            };
        }
        setTimeout(() => setLoadingImage(false), 500);
    }

    const uploadImage = async () => {
        if (file) {
            const { data } = await uploadFileService.uploadImage(file);
            return data;
        }
        TOAST.WARN("Vui lòng chọn hình ảnh !")
        return
    }

    const checkValue = () => {
        if (!file) {
            TOAST.WARN("Vui lòng chọn hình ảnh !");
            return false
        }
        if (materialType.name.length === 0) {
            TOAST.WARN("Vui lòng nhập tên !")
            return false
        }
        return true
    }

    const handleAdd = async () => {

        try {
            if (checkValue()) {
                const upload = await uploadImage();
                if (upload?.name) {
                    const { data } = await materialTypeService.add({
                        ...materialType,
                        media: upload?.name
                    })
                    if (data?.error) {
                        setTimeout(() => TOAST.EROR(data.message), 1000);
                        await uploadFileService.removeImage(upload?.name, "material");
                    } else {
                        TOAST.SUCCESS(MESSAGE.ADD_SUCCESS);
                        history.goBack();
                    }
                }
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

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
                                    <FormControl fullWidth>
                                        <TextField value={materialType.name} onChange={e => setMaterialType({
                                            ...materialType,
                                            name: e.target.value
                                        })} label="Tên loại vật chất" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <Button variant="contained" endIcon={<AddIcon />} onClick={handleAdd}>Thêm</Button>
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

export default MaterialTypeAdd;
