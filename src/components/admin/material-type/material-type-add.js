/* eslint-disable jsx-a11y/alt-text */
import { Button, Card, Grid, Input, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useState } from "react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { materialTypeService } from "../../../services/material-type.service";
import { uploadFileService } from "../../../services/upload-file.service";
import { useHistory } from "react-router-dom";
import Alert from "../../../customs/Alert-custom";
import ALERT from "../../../consts/status-alter";
import MESSAGE from "../../../consts/message-alert"
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { TOAST } from "../../../customs/toast-custom";

const MaterialTypeAdd = () => {
    const title = "Loại vật chất";
    const history = useHistory();
    const [tenLoaivatchat, setTenvatchat] = useState("");
    const [isShow, setIsShow] = useState(false)
    const [status, setStatus] = useState(ALERT.SUCCESS)
    const [message, setMessage] = useState(MESSAGE.ADD_SUCCESS);
    const [image, setImage] = useState("")
    const [file, setFile] = useState(null)
    const [loadingImage, setLoadingImage] = useState(false);

    const handleChange = (e) => {
        setLoadingImage(true)
        const reader = new FileReader();
        const file = e.target.files[0]
        setFile(file)
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = function () {
            setImage(reader.result)
        };

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

    const handleAdd = async () => {
        if (tenLoaivatchat.length === 0) {
            TOAST.WARN("Vui lòng nhập tên !")
            return
        }
        const upload = await uploadImage();
        if (upload?.status) {
            const { data } = await materialTypeService.add({
                tenLoaivatchat,
                hinhanh: upload.name
            })
            if (data.affectedRows > 0) {
                TOAST.SUCCESS(MESSAGE.ADD_SUCCESS);
            } else {
                TOAST.EROR(MESSAGE.ADD_ERROR);
                setTimeout(() => TOAST.EROR(data.message), 1000);
                await uploadFileService.removeImage(upload.name);
            }
        }
    }

    return (
        <div className="mt-4">
            <Alert title={title} status={status} isShow={isShow} close={() => setIsShow(false)}>{message}</Alert>
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
                                    <TextField value={tenLoaivatchat} onChange={e => setTenvatchat(e.target.value)} label="Tên vật chất" variant="standard" />
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
    )
}

export default MaterialTypeAdd;
