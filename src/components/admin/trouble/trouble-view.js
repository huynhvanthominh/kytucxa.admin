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
import { roomAPI } from "../../../apis/room.api";
import { troubleAPI } from "../../../apis/trouble.api";
import moment from "moment";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import PATH from "../../../consts/path";
import { set } from "date-fns";


const initMaterial = {
    idMaterialType: "",
    name: "",
    media: "",
}
export default function TroubleView() {
    const [value, setValue] = useState(new Date());
    const title = "Sự cố";
    const { id } = useParams();
    const history = useHistory();
    const [materialTypes, setMaterialTypes] = useState([]);
    const [image, setImage] = useState("")
    const [file, setFile] = useState();
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const [listArea, setListArea] = useState([]);
    const [areaSelected, setAreaSelected] = useState({id: ''});
    const [typeOfRoom, setTypeOfRoom] = useState([]);
    const [typeOfRoomSelected, setTypeOfRoomSelected] = useState({id: ''});
    const [room, setRoom] = useState([]);
    const [roomSelected, setRoomSelected] = useState({id: ''});
    const [troubleAdd, setTroubleAdd] = useState({ name: '', status: '' });
    const [level, setLevel] = useState([{ id: 0, label: 'Thấp' }, { id: 1, label: 'Trung bình' }, { id: 2, label: 'Cao' }])
    const [levelSelect, setLevelSelect] = useState({id: ''});
    const [status, setStatus] = useState([{ id: 0, label: 'Chưa giải quyết' }, { id: 1, label: 'Đã giải quyết' }])
    const [statusSelect, setStatusSelect] = useState({id: ''});


    const uploadFile = async () => {
        const { data } = await uploadFileService.uploadImage(file, "material");
        return data
    }

    const getDataTrouble = async () => {
        try {
            await roomAPI.getRoomByUser({ userId: 1 }).then(data => {
                setListArea(data);
                const listRoom = [];
                const listType = [];
                const listTrouble = [];
                data.map(item => {
                    item?.typeofrooms.map(itemType => {
                        listType.push(itemType);
                        itemType.rooms.map(itemR => {
                            listRoom.push(itemR);
                        })
                    })
                })
                setTypeOfRoom(listType);
                setRoom(listRoom);
                if (id) {
                    getTroubleAdd(listRoom, listType, data);
                }
                
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const checkValue = () => {
        if (!file && !troubleAdd.image) {
            TOAST.WARN("Vui lòng chọn hình ảnh !");
            return false
        }
        if (!areaSelected || areaSelected.id?.length === 0) {
            TOAST.WARN("Vui lòng chọn khu !");
            return false
        }
        if (!typeOfRoomSelected || typeOfRoomSelected.id?.length === 0) {
            TOAST.WARN("Vui lòng chọn loại phòng !");
            return false
        }
        if (!roomSelected || roomSelected.id?.length === 0) {
            TOAST.WARN("Vui lòng chọn phòng !");
            return false
        }
        if (troubleAdd.name?.length === 0 || !troubleAdd?.name) {
            TOAST.WARN("Vui lòng nhập tên sự cố !");
            return false
        }
        if (!levelSelect || levelSelect.id?.length === 0) {
            TOAST.WARN("Vui lòng chọn mức độ sự cố !");
            return false
        }
        if (!statusSelect || statusSelect.id?.length === 0) {
            TOAST.WARN("Vui lòng chọn tình trạng sự cố !");
            return false
        }
        return true
    }

    const handleAdd = async () => {
        try {
            if (checkValue()) {
                setLoading(true);
                const date = new Date();
                if (!troubleAdd.dateOfTrouble) {
                    setTroubleAdd({
                        ...troubleAdd,
                        dateOfTrouble: date
                    })
                } else {
                    setTroubleAdd({
                        ...troubleAdd,
                        dateOfTrouble: moment(troubleAdd.dateOfTrouble).format("YYYY-MM-DD HH:mm:ss")
                    })
                }
                const minutes = date.getMinutes();
                let data = new FormData();
                let troubleData = {
                    ...troubleAdd,
                    status: statusSelect.id,
                    level: levelSelect.id,
                    roomId: roomSelected.id,
                    dateOfSolve: Number(statusSelect.id) === 0 ? '' : new Date()
                }
                data.append("image", file);
                data.append("trouble", JSON.stringify(troubleData));
                console.log(data)
                await troubleAPI.addTrouble(data).then(async data => {
                    if (data) {
                        TOAST.SUCCESS(MESSAGE.ADD_SUCCESS);
                        history.goBack();
                        setLoading(false);
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
                let troubleData = {
                    ...troubleAdd,
                    dateOfTrouble: moment(troubleAdd.dateOfTrouble).format("YYYY-MM-DD HH:mm:ss"),
                    level: levelSelect.id,
                    roomId: roomSelected.id,
                    status: statusSelect.id,
                    dateOfSolve: Number(statusSelect.id) === 0 ? '' : new Date()
                }
                data.append("image", file ? file : troubleAdd.image);
                data.append("trouble", JSON.stringify(troubleData));
                console.log(data.get('image'));
                await troubleAPI.updateTrouble(data, {id: troubleAdd.id}).then(data => {
                    if (data) {
                        TOAST.SUCCESS(MESSAGE.UPDATE_SUCCESS);
                        history.goBack();
                        setLoading(false);
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

    const getTroubleAdd = async (listRoom, listType, listArea) => {
        await roomAPI.getTroubleById({ id: id }).then(data => {
            console.log(data);
            let roomSl = (listRoom.filter(item => item.id === data.roomId))[0];
            let typeSl = (listType.filter(item => item.id === roomSl.typeOfRoomId))[0];
            let areaSl = (listArea.filter(item => item.id === typeSl.areaId))[0];
            let lvSl = (level.filter(item => item.id === Number(data.level)))[0];
            let stSl = (status.filter(item => item.id === Number(data.status)))[0];
            setStatusSelect(stSl);
            setLevelSelect(lvSl);
            setRoomSelected(roomSl);
            setTypeOfRoomSelected(typeSl);
            setAreaSelected(areaSl);
            setTroubleAdd(data);
        })
    }

    useEffect(() => {
        getDataTrouble();
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
                                        image.length === 0 && !troubleAdd.image ?
                                            <CameraAltIcon color="primary" sx={{ fontSize: 120 }} /> :
                                            <img src={image ? image : (PATH.URL_SERVER.concat(troubleAdd.image))} />
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
                                            value={areaSelected}
                                            label="Khu"
                                            onChange={e => {
                                                setAreaSelected(e.target.value);
                                                setTypeOfRoom(e.target.value.typeofrooms);
                                            }}
                                        >
                                            {
                                                listArea.map((area, i) => <MenuItem key={i} value={area}>{area?.areaName}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Loại Phòng</InputLabel>
                                        <Select
                                            value={typeOfRoomSelected}
                                            label="Loại Phòng"
                                            onChange={e => {
                                                setTypeOfRoomSelected(e.target.value);
                                                console.log(e.target.value.rooms)
                                                setRoom(e.target.value.rooms);
                                            }}
                                        >
                                            {
                                                typeOfRoom.map((type, i) => <MenuItem key={i} value={type}>{type?.name}</MenuItem>)
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
                                            value={roomSelected}
                                            label="Phòng"
                                            onChange={e => {
                                                setRoomSelected(e.target.value);
                                                console.log(e.target.value);
                                            }}
                                        >
                                            {
                                                room.map((room, i) => <MenuItem key={i} value={room}>{room?.roomName}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={troubleAdd?.name} onChange={e => setTroubleAdd({
                                            ...troubleAdd,
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
                                                value={troubleAdd?.dateOfTrouble}
                                                onChange={e => {
                                                    setTroubleAdd({
                                                        ...troubleAdd,
                                                        dateOfTrouble: e
                                                    })
                                                }
                                                }
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
                                            value={levelSelect}
                                            label="Mức độ"
                                            onChange={e => {
                                                setLevelSelect(e.target.value);
                                                console.log(e.target.value);
                                            }}
                                        >
                                            {
                                                level.map((level, i) => <MenuItem key={i} value={level}>{level?.label}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Tình trạng sự cố</InputLabel>
                                        <Select
                                            value={statusSelect}
                                            label="Tình trạng sự cố"
                                            onChange={e => {
                                                setStatusSelect(e.target.value);
                                            }}
                                        >
                                            {
                                                status.map((status, i) => <MenuItem key={i} value={status}>{status?.label}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <LoadingButton loading={loadingButton} variant="contained" endIcon={<AddIcon />} onClick={id ? handleUpdate : handleAdd}>{id ? "Cập nhật" : "Thêm"}</LoadingButton>
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