/* eslint-disable jsx-a11y/alt-text */
import { Button, Card, CircularProgress, Grid, Input, MenuItem, Select, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from "react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Loading from "../../../customs/loading";
import { materialTypeService } from "../../../apis/material-type.api";
import CloseIcon from '@mui/icons-material/Close';
import { useHistory, useParams } from "react-router-dom";
import { TOAST } from "../../../customs/toast-custom";
import { uploadFileService } from "../../../apis/upload-file.api";
import { materialService } from "../../../apis/material.api";
import MESSAGE from "../../../consts/message-alert";
import PATH from "../../../consts/path";
import EditIcon from '@mui/icons-material/Edit';
const initMaterial = {
    id: "",
    idMaterialType: "",
    name: "",
    nameOld: "",
    media: "",
    createdAt: "",
    updatedAt: "",
}

const MaterialView = () => {
    const { id } = useParams();
    const history = useHistory();
    const [materialTypes, setMaterialTypes] = useState([]);
    const [material, setMaterial] = useState(initMaterial);
    const [image, setImage] = useState("")
    const [file, setFile] = useState();
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isChangeFile, setIsChangeFile] = useState(false);

    const fetchMaterial = async () => {
        try {
            const { data } = await materialService.getById(id);
            setMaterial({
                ...data,
                nameOld: data.name
            })

            setImage(PATH.MATERIAL + data.media)
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        fetchMaterial();
    }, [id])

    const uploadFile = async () => {
        const { data } = await uploadFileService.uploadImage(file, "material");
        return data
    }

    const checkValue = () => {
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

    const submit = async () => {
        setLoading(true)
        try {
            if (checkValue()) {
                let payload = material;
                if (isChangeFile) {
                    const upload = await uploadFile();
                    if (upload?.name) {
                        uploadFileService.removeImage(material.media, "material");
                        payload = { ...payload, media: upload.name };
                    }
                }
                payload = { ...payload, updatedAt: new Date() }
                const { data } = await materialService.update(payload);
                if (data?.error) {
                    TOAST.EROR(data.message)
                } else {
                    TOAST.SUCCESS(MESSAGE.UPDATE_SUCCESS);
                    history.goBack()
                }
            }
            setTimeout(() => { setLoading(false) }, 500)
        } catch (error) {
            setTimeout(() => { setLoading(false) }, 500)
        }
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

    const handleChange = (e) => {
        setLoadingImage(true)
        const reader = new FileReader();
        const file = e.target.files[0]
        setFile(file)
        setIsChangeFile(true)
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result)
        };
        setTimeout(() => setLoadingImage(false), 500)
    }

    return (
        <Loading loading={loading}>
            <div>
                <div className="d-flex align-items-center">
                    <div>
                        <h3>Vật chất</h3>
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
                                        <InputLabel>Loại vật chất</InputLabel>
                                        <Select
                                            value={material?.idMaterialType}
                                            label="Loại vật chất"
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
                                        })} label="Tên vật chất" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <Button endIcon={<EditIcon />} variant="contained" onClick={submit}>Cập nhật</Button>
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

export default MaterialView;
