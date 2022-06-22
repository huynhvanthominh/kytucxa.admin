import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Card, FormControl, Input, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { TOAST } from '../../../customs/toast-custom';
import { troubleMaterialAPI } from '../../../apis/trouble-material.api';
import { uploadFileService } from '../../../apis/upload-file.api';
import PATH from "../../../consts/path"

const initTrouble = {
    createdAt: "",
    descriptionTroubleMaterial: "",
    idMaterial: "",
    idTroubleMaterial: 1,
    mediaTroubleMaterial: "",
    statusTroubleMaterial: "",
    updatedAt: "",
}

export default function Report({ material, open = false, report, close, maxWidth = "sm", fullWidth = true }) {
    const [src, setSrc] = React.useState("");
    const [file, setFile] = React.useState();
    const [trouble, setTrouble] = React.useState(initTrouble);
    const [types, setTypes] = React.useState([])
    const fetchType = async () => {
        try {
            const { data } = await troubleMaterialAPI.getType();
            setTypes(data);
        } catch (error) {
            TOAST.EROR(error.message);
        }
    }

    React.useEffect(() => {
        fetchType();
    }, [])

    const handleChange = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0]
        setFile(file)
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setSrc(reader.result)
        };
    }

    const fetchReport = async (id) => {
        try {
            const { data } = await troubleMaterialAPI.getOne(id)
            setTrouble(data)
            setSrc(PATH.MATERIAL + data.mediaTroubleMaterial)
        } catch (error) {

        }
    }
    React.useEffect(() => {
        if (report) {
            fetchReport(report.idTroubleMaterial)
        }
    }, [report])
    const uploadFile = async () => {
        const { data } = await uploadFileService.uploadImage(file, "material");
        return data
    }
    const submit = async () => {
        try {
            let tmp = {
                ...trouble,
                idMaterial: material?.id
            }
            if (file) {
                const upload = await uploadFile();
                if (upload?.name) {
                    tmp = {
                        ...tmp,
                        mediaTroubleMaterial: upload?.name
                    }
                }
            }
            const { data } = await troubleMaterialAPI.create(tmp);
            if (data[1] > 0) {
                TOAST.SUCCESS("Report success !");
                close();
            }
        } catch (error) {
            TOAST.EROR(error.message);
        }
    }

    return (
        <React.Fragment>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={close}
            >
                <DialogTitle>Báo cáo sự cố vật chất</DialogTitle>
                <DialogContent>
                    <Box>
                        <Card className="card-file">
                            <label className="input-file">
                                <Input onChange={e => handleChange(e)} accept="image/*" className="d-none" id="icon-button-file" type="file" />
                                {
                                    src.length === 0 ?
                                        <CameraAltIcon color="primary" sx={{ fontSize: 120 }} /> :
                                        <img src={src} alt="" />
                                }
                            </label>
                        </Card>
                    </Box>
                    <Box className='mt-4'>
                        <FormControl fullWidth size="small">
                            <InputLabel>Mức độ</InputLabel>
                            <Select
                                value={trouble.statusTroubleMaterial}
                                label="Mức độ"
                                onChange={e => setTrouble({ ...trouble, statusTroubleMaterial: e.target.value })}
                            >
                                {
                                    types.map((type, i) => <MenuItem key={i} value={type?.value}>{type?.label}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className='mt-4'>
                        <FormControl fullWidth>
                            <TextField
                                label="Mô tả"
                                multiline
                                value={trouble.descriptionTroubleMaterial}
                                onChange={e => setTrouble({
                                    ...trouble,
                                    descriptionTroubleMaterial: e.target.value
                                })}
                                rows={4}
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    {!report && <Button variant='outlined' color='primary' onClick={submit}>Gửi</Button>}
                    <Button onClick={close} variant='outlined' color='inherit'>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
