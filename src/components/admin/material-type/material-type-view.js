/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box, Button, Card, FormControl, Grid, Input, TextField } from "@mui/material";
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { materialTypeService } from "../../../apis/material-type.api";
import PATH from "../../../consts/path";
import { LoadingButton } from "@mui/lab";
import CircularProgress from '@mui/material/CircularProgress';
import { uploadFileService } from '../../../apis/upload-file.api'
import { TOAST } from "../../../customs/toast-custom";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Loading from "../../../customs/loading";

const MaterialTypeView = () => {
    const initMaterialType = {
        id: null,
        name: "",
        nameOld: "",
        media: "",
        createdAt: "",
        updatedAt: ""
    }
    const title = "Loại vật chất";
    const [materialType, setMaterialType] = useState(initMaterialType);
    const [isChangeFile, setIsChangeFile] = useState(false);
    const [isLoaddingImage, setIsLoaddingImage] = useState(true)
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [image, setImage] = useState("");
    const [file, setFile] = useState();
    const { id } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    const fetchMaterialType = async () => {
        try {
            const { data } = await materialTypeService.getById(id);
            setMaterialType({
                ...data,
                nameOld: data.name
            })
            setIsLoaddingImage(false)
            setImage(PATH.MATERIAL + data?.media)
            setTimeout(() => setLoading(false), 500)
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        fetchMaterialType()
    }, [id])

    const uploadImage = async () => {
        try {
            if (file) {
                const { data } = await uploadFileService.uploadImage(file, "materialType");
                return data;
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const removeImage = (name) => {
        uploadFileService.removeImage(name, "materialType");
    }

    const handleUpdate = async () => {
        setIsLoadingButton(true)
        try {
            if (checkValue()) {
                let payload = { ...materialType }
                if (isChangeFile) {
                    const upload = await uploadImage();
                    if (upload?.name) {
                        removeImage(materialType.media)
                        payload = { ...payload, media: upload?.name }
                    }
                }
                payload = { ...payload, updatedAt: new Date() }
                const { data } = await materialTypeService.update(payload);
                if (data?.error) {
                    TOAST.EROR(data?.message);
                } else {
                    TOAST.SUCCESS("Cập nhật thành công !");
                    history.goBack();

                }
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setTimeout(() => setIsLoadingButton(false), 1000)
    }

    const checkValue = () => {
        if (materialType.name.length === 0) {
            TOAST.WARN("Vui lòng nhập tên !")
            return false
        }
        return true
    }

    const handleChange = async (e) => {
        setIsLoaddingImage(true)
        const reader = new FileReader();
        setFile(e.target.files[0])
        reader.readAsDataURL(e.target.files[0]);
        setIsChangeFile(true)
        reader.onloadend = function () {
            setImage(reader.result)
        };
        setIsLoaddingImage(false)
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
                                            value={materialType?.name}
                                            onChange={e => setMaterialType({
                                                ...materialType,
                                                name: e.target.value
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
        </Loading>
    )
}

export default MaterialTypeView;