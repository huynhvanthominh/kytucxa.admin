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
import { areaAPI } from "../../../apis/area.api";
import { freeServiceAPI } from "../../../apis/freeService.api";
import { paidServiceAPI } from "../../../apis/paidService.api";
import { MultiSelect } from "react-multi-select-component";
import { typeOfRoomAPI } from "../../../apis/typeroom.api";
const TypeRoomView = () => {

    const title = "Loại phòng";
    const history = useHistory();
    const { id } = useParams();
    const [areaList, setAreaValue] = useState([]);
    const [typeOfRoom, setTypeOfRoom] = useState();
    const [freeService, setFreeService] = useState([]);
    const [freeServiceSelected, setFreeServiceSelected] = useState([]);
    const [paidService, setPaidService] = useState([]);
    const [paidServiceSelected, setPaidServiceSelected] = useState([]);
    const [image, setImage] = useState([])
    const [file, setFile] = useState([]);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false)

    const uploadFile = async () => {
        const { data } = await uploadFileService.uploadImage(file, "typeofroom");
        return data
    }

    const checkValue = () => {
        if (!file) {
            TOAST.WARN("Vui lòng chọn hình ảnh !");
            return false
        }
        
        if (typeOfRoom.areaId?.length === 0) {
            TOAST.WARN("Vui lòng chọn khu !");
            return false
        }
        if (typeOfRoom.name?.length === 0) {
            TOAST.WARN("Vui lòng nhập tên !");
            return false
        }
        if (typeOfRoom.price?.length === 0) {
            TOAST.WARN("Vui lòng nhập giá !");
            return false
        }
        return true
    }

    const handleUpdate = async () => {
        try {
            if (checkValue()) {
                setLoading(true);
                const date = new Date();
                const minutes = date.getMinutes();
                let data = new FormData();
                // let typeOfRoomData = {
                //     ...typeOfRoom,
                // }
                data.append("image", file);
                data.append("typeofroom", JSON.stringify(typeOfRoom));
                console.log(file)
                await typeOfRoomAPI.updateTypeOfRoom(data).then(data => {
                    if (data) {
                        history.goBack()
                    }
                })
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setLoading(false)
    }

    const handleAdd = async () => {
        try {
            if (checkValue()) {
                setLoading(true);
                const date = new Date();
                const minutes = date.getMinutes();
                let data = new FormData();
                // let typeOfRoomData = {
                //     ...typeOfRoom,
                
                // }
                data.append("image", file);
                data.append("typeofroom", JSON.stringify(typeOfRoom));
                console.log(file)
                await typeOfRoomAPI.addTypeOfRoom(data).then(data => {
                    if (data) {
                        history.goBack()
                    }
                })
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        const file = e.files
        setFile(file)
        for (let index = 0; file < file.length; index++) {
            const reader = new FileReader()
            reader.readAsDataURL(file[index]);
            reader.onloadend = function (e) {
                console.log(e.target.result);
            };
        }
        // let a = [];
        // let b = [];
        // a.push(e.target.files)

        // for (let i = 0; i < a[0].length; i++) {
        //     b.push(URL.createObjectURL(a[0][i]))
        // }
        // setImage(b);
        // console.log(b);
    }

    const getListArea = async () => {
        try {
            await areaAPI.getListArea({userId: 1}).then(data => {
                setAreaValue(data);
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
        // setTimeout(() => setLoading(false), 1000)
    }

    const getFreeService = async () => {
        try {
            await freeServiceAPI.getListFreeService({userId: 1}).then(data => {
                setFreeService(data.map((item, index) => ({label: item.name, value: item.id})))
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
        // setTimeout(() => setLoading(false), 1000)
    }

    const getPaidService = async () => {
        try {
            await paidServiceAPI.getListPaidService({userId: 1}).then(data => {
                setPaidService(data.map((item, index) => ({label: item.name, value: item.id})))
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
        // setTimeout(() => setLoading(false), 1000)
    }

    useEffect(() => {
        getListArea();
        getFreeService();
        getPaidService();
    }, []);

    useEffect(() => {
        console.log(freeServiceSelected);
    }, [freeServiceSelected]);

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
                                <input multiple onChange={e => handleChange(e)} accept="image/*" className="d-none" id="icon-button-file" type="file" />
                                {
                                        image.length === 0 ?
                                        <CameraAltIcon color="primary" sx={{ fontSize: 120 }} /> :
                                        <div>
                                            {
                                                image.map(item => {
                                                    <img src={item}/>
                                                })
                                            }
                                        </div>
                                }
                            </label>
                        </Card>
                    </Grid>
                    <Grid item md={8} sm={16}>
                        <Grid container spacing={2.36} columns={16}>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Khu</InputLabel>
                                        <Select
                                            value={typeOfRoom?.areaId}
                                            label="Khu"
                                            onChange={e => setTypeOfRoom({
                                                ...typeOfRoom,
                                                idMaterialType: e.target.value
                                            })}
                                        >
                                            {
                                                areaList.map((area, i) => <MenuItem key={i} value={area?.id}>{area?.areaName}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={typeOfRoom?.name} onChange={e => setTypeOfRoom({
                                            ...typeOfRoom,
                                            name: e.target.value
                                        })} label="Tên loại phòng" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={typeOfRoom?.price} onChange={e => setTypeOfRoom({
                                            ...typeOfRoom,
                                            price: e.target.value
                                        })} label="Giá loại phòng" type={"number"} className="hide-spin" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={typeOfRoom?.typeOfCustomer} onChange={e => setTypeOfRoom({
                                            ...typeOfRoom,
                                            typeOfCustomer: e.target.value
                                        })} label="Đối tượng" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={typeOfRoom?.stretch} onChange={e => setTypeOfRoom({
                                            ...typeOfRoom,
                                            stretch: e.target.value
                                        })} label="Diện tích" type={"number"} className="hide-spin" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={typeOfRoom?.numberOfCustomer} onChange={e => setTypeOfRoom({
                                            ...typeOfRoom,
                                            numberOfCustomer: e.target.value
                                        })} label="Số lượng khách" type={"number"} className="hide-spin" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={typeOfRoom?.note} onChange={e => setTypeOfRoom({
                                            ...typeOfRoom,
                                            note: e.target.value
                                        })} label="Lưu ý"   multiline rows={3}/>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <span style={{color: '#757575'}}>Dịch vụ miễn phí</span>
                                <MultiSelect
                                    options={freeService}
                                    value={freeServiceSelected}
                                    onChange={setFreeServiceSelected}
                                    displayValue="Dịch vụ miễn phí"
                                />
                            </Grid>
                            <Grid item sm={8}>
                                <span style={{color: '#757575'}}>Dịch vụ có phí</span>
                                <MultiSelect
                                    options={paidService}
                                    value={paidServiceSelected}
                                    onChange={setPaidServiceSelected}
                                    displayValue="Dịch vụ có phí"
                                />
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    {id ? <Button loading={loadingButton} variant="contained" endIcon={<AddIcon />} onClick={handleUpdate}>Cập nhật</Button>:
                                    <Button loading={loadingButton} variant="contained" endIcon={<AddIcon />} onClick={handleAdd}>Thêm</Button>}
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
export default TypeRoomView;
