/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box, Button, Card, FormControl, Grid, Input, TextField } from "@mui/material";
import Alert from "../../../customs/Alert-custom";
import { useEffect, useState } from "react"
import ALERT from "../../../consts/status-alter";
import MESSAGE from "../../../consts/message-alert";
import { useHistory, useParams } from "react-router-dom";
import { materialTypeService } from "../../../services/material-type.service";
import PATH from "../../../consts/path";
import { LoadingButton } from "@mui/lab";
import CircularProgress from '@mui/material/CircularProgress';
import { uploadFileService } from '../../../services/upload-file.service'
import { TOAST } from "../../../customs/toast-custom";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

const MaterialTypeView = () => {
    const initMaterialType = {
        idLoaivatchat: null,
        tenLoaivatchat: "",
        hinhanh: "",
        createAt: "",
        updateAt: ""
    }
    const title = "Loại vật chất";
    const [status, setStatus] = useState(ALERT.SUCCESS)
    const [message, setMessage] = useState(MESSAGE.ADD_SUCCESS);
    const [materialType, setMaterialType] = useState(initMaterialType);
    const [isShow, setIsShow] = useState(false)
    const [isLoaddingImage, setIsLoaddingImage] = useState(true)
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [image, setImage] = useState("");
    const [file, setFile] = useState();
    const { id } = useParams();
    const history = useHistory();

    const fetchMaterialType = async () => {
        const { data } = await materialTypeService.getById(id);
        setMaterialType(data)
        setIsLoaddingImage(false)
        setImage(PATH.IMAGES + data?.hinhanh)
    }

    useEffect(() => {

        fetchMaterialType()

    }, [id])

    const uploadImage = async () => {
        if (file) {
            const { data } = await uploadFileService.uploadImage(file);
            return data;
        }
        return {
            name: materialType?.hinhanh,
            message: "not upload file",
            change: false,
            status: true
        }
    }

    const handleUpdate = async () => {
        setIsLoadingButton(true)
        const upload = await uploadImage();
        let payload
        if (upload?.change) {
            if (materialType?.hinhanh.length > 0) {
                await uploadFileService.removeImage(materialType?.hinhanh);
            }
            payload = {
                ...materialType,
                hinhanh: upload.name
            }
            setMaterialType(payload);
        }

        const { data } = await materialTypeService.update(payload ? payload : materialType);

        if (data.affectedRows > 0) {
            setMessage(MESSAGE.UPDATE_SUCCESS)
            setStatus(ALERT.SUCCESS)
            setIsShow(true)
        } else {
            setMessage(MESSAGE.UPDATE_FAIL)
            setStatus(ALERT.ERROR)
            setIsShow(true)
        }

        setTimeout(() => setIsLoadingButton(false), 1000)
    }


    const handleChange = async (e: any) => {
        setIsLoaddingImage(true)
        const reader = new FileReader();
        setFile(e.target.files[0])
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = function () {
            setImage(reader.result)
        };
        setIsLoaddingImage(false)
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
                            {isLoaddingImage ? <CircularProgress /> : <img src={image} />}
                        </label>
                    </Card>
                </Grid>
                <Grid item md={8} sm={16}>
                    <Grid container spacing={2} columns={16}>
                        <Grid item sm={16}>
                            <Box>
                                <FormControl fullWidth>
                                    <TextField
                                        value={materialType?.tenLoaivatchat}
                                        onChange={e => setMaterialType({
                                            ...materialType,
                                            tenLoaivatchat: e.target.value
                                        })}
                                        label="Tên vật chất"
                                        variant="standard" />
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item sm={16}>
                            <Box>
                                <LoadingButton loading={isLoadingButton} endIcon={<EditIcon />} variant="contained" onClick={handleUpdate}>Cập nhật</LoadingButton>
                                <Button variant="contained" color='inherit' className="ms-1" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Thoát</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </div >
    )
}

export default MaterialTypeView;