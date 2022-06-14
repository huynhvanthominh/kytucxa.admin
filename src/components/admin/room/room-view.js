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
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import { TOAST } from "../../../customs/toast-custom";
import { LoadingButton } from "@mui/lab";
import { uploadFileService } from "../../../apis/upload-file.api";
import { materialService } from "../../../apis/material.api";
import MESSAGE from "../../../consts/message-alert";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import EditIcon from '@mui/icons-material/Edit';
import { areaAPI } from "../../../apis/area.api";
import { typeOfRoomAPI } from "../../../apis/typeroom.api";
import { roomAPI } from "../../../apis/room.api";

const initMaterial = {
    idMaterialType: "",
    name: "",
    media: "",
}

const RoomView = () => {

    const title = "Phòng";
    const history = useHistory();
    const { id } = useParams();
    const [image, setImage] = useState("")
    const [file, setFile] = useState();
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false)
    const [listArea, setListArea] = useState([]);
    const [listTypeOfRoom, setListTypeOfRoom] = useState([]);
    const [areaSelected, setAreaSelected] = useState({areaName: ''});
    const [typeOfRoomSelected, setTypeOfRoomSelected] = useState({name: ''});
    const [roomAdd, setRoomAdd] = useState({roomName: '', note: ''});
    const uploadFile = async () => {
        const { data } = await uploadFileService.uploadImage(file, "material");
        return data
    }

    const checkValue = () => {
        // if (!file) {
        //     TOAST.WARN("Vui lòng chọn hình ảnh !");
        //     return false
        // }
        if (areaSelected.areaName.length === 0) {
            TOAST.WARN("Vui lòng chọn khu !");
            return false
        }
        if (typeOfRoomSelected.name.length === 0) {
            TOAST.WARN("Vui lòng chọn loại phòng !");
            return false
        }
        if (!roomAdd.roomName) {
            TOAST.WARN("Vui lòng nhập tên phòng !");
            return false
        }
        if (!roomAdd.note) {
            TOAST.WARN("Vui lòng nhập lưu ý !");
            return false
        }
        return true
    }

    const getDataArea = async () => {
        try {
            await areaAPI.getListArea({ userId: 1 }).then(data => {
                setListArea(data);
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    
    const getRoomById = async (areaId) => {
        try {
            await roomAPI.getRoomById({ id: id }).then(data => {
                setRoomAdd(data);
                
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }
    

    const getDataTypeOfRoom = async (areaId) => {
        try {
            await typeOfRoomAPI.getTypeOfRoomByArea({ areaId: areaId }).then(data => {
                setListTypeOfRoom(data);
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const handleAdd = async () => {
        try {
            if (checkValue()) {
                setLoading(true)
                await roomAPI.addRoom({
                    ...roomAdd,
                    status: 0,
                    typeOfRoomId: typeOfRoomSelected.id
                }).then(data => {
                    if (data?.error) {
                        console.log(data);
                        TOAST.EROR(data.message)
                        setLoading(false)
                    } else {
                        TOAST.SUCCESS(MESSAGE.ADD_SUCCESS);
                        history.goBack();
                        setLoading(false);
                    }
                });
                setLoading(false);
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setLoading(false)
    }

    // useEffect(() => {
    //     getDataTypeOfRoom(areaSelected.id);
    // }, [areaSelected]);

    useEffect(() => {
        getDataArea();
    }, []);

    useEffect(() => {
        getDataArea();
        if(id){
            getRoomById()
        }
    }, [id]);

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
                        <Grid container spacing={4} columns={16}>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Khu</InputLabel>
                                        <Select
                                            defaultValue={""}
                                            value={listArea?.areaName}
                                            label="Khu"
                                            onChange={e => {
                                                setAreaSelected(e.target.value)
                                                getDataTypeOfRoom(
                                                    e.target.value.id
                                                );
                                            }}
                                        >
                                            {
                                                listArea?.map((area, i) => <MenuItem key={i} value={area}>{area?.areaName}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Loại phòng</InputLabel>
                                        <Select
                                            defaultValue={""}
                                            value={listTypeOfRoom?.name}
                                            label="Loại phòng"
                                            onChange={e => setTypeOfRoomSelected(
                                                e.target.value
                                            )}
                                        >
                                            {
                                                listTypeOfRoom?.map((typeOfRoom, i) => <MenuItem key={i} value={typeOfRoom}>{typeOfRoom?.name}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField size="small" value={roomAdd.roomName} onChange={e => setRoomAdd({
                                            ...roomAdd,
                                            roomName: e.target.value
                                        })} label="Tên phòng" />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={8} sm={16}>
                        <Grid container columns={16}>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField
                                            value={roomAdd.note}
                                            id="outlined-multiline-static"
                                            label="Lưu ý:"
                                            multiline
                                            rows={8}
                                            size="small"
                                            onChange={e => setRoomAdd({
                                                ...roomAdd,
                                                note: e.target.value
                                            })}
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <div className="d-flex align-items-center">
                    {
                        // id ? <Button variant="contained" className="me-1" endIcon={<EditIcon />}>Thêm</Button> :
                            <Button onClick={handleAdd} variant="contained" className="me-1" endIcon={<AddIcon />}>{roomAdd.id ? "Cập nhật" : "Thêm"}</Button>
                    }
                    <Button variant="contained" color="inherit" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Trở về</Button>
                </div>
            </div >
        </Loading>
    )
}

export default RoomView;
