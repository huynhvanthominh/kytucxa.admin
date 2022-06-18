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
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { uploadFileService } from "../../../apis/upload-file.api";
import { materialService } from "../../../apis/material.api";
import MESSAGE from "../../../consts/message-alert";
import { roomAPI } from "../../../apis/room.api";
import { contractAPI } from "../../../apis/contract.api";
import { userAPI } from "../../../apis/user.api";

export default function ContractAdd() {

    const title = "Thêm hợp đồng";
    const history = useHistory();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false)
    const [contractAdd, setContractAdd] = useState({numberOfElectric: '', numberOfWater: '', term: ''});
    const [listArea, setListArea] = useState([]);
    const [areaSelected, setAreaSelected] = useState({ id: '' });
    const [typeOfRoom, setTypeOfRoom] = useState([]);
    const [typeOfRoomSelected, setTypeOfRoomSelected] = useState({ id: '' });
    const [room, setRoom] = useState([]);
    const [roomSelected, setRoomSelected] = useState({ id: '' });
    const [user, setUser] = useState([]);
    const [userSelected, setUserSelected] = useState({ id: '' });


    const checkValue = () => {

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
        if (!userSelected || userSelected.id?.length === 0) {
            TOAST.WARN("Vui lòng chọn khách !");
            return false
        }
        if (!contractAdd.numberOfElectric) {
            TOAST.WARN("Vui lòng nhập số điện !");
            return false
        }
        if (!contractAdd.numberOfWater) {
            TOAST.WARN("Vui lòng nhập số nước !");
            return false
        }
        if (!contractAdd.term) {
            TOAST.WARN("Vui lòng nhập điều khoản !");
            return false
        }
        return true
    }

    const getDataRoom = async () => {
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
                    getDataContractEdit(data);
                }
                // if (id) {
                //     getTroubleAdd(listRoom, listType, data);
                // }

            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const getDataContractEdit = async (listArea) => {
        try {
            let ASelect = [];
            let TSelect = [];
            let listT = [];
            let R = [];

            await contractAPI.getContractById({ id: id }).then(async data => {
                console.log(id);
                listArea.map(itemA => {
                    itemA.typeofrooms.map(itemT => {
                        itemT.rooms.map(item => R.push(item))
                    })
                })
                setContractAdd(data)
                R = (R.filter(item => item.id === data.roomId))[0];
                console.log("R>>>", R);
                setRoomSelected(R);
                await userAPI.getUserById({ userId: data.userId }).then(data => {
                    setUser([data]);
                    setUserSelected(data);
                    console.log("Us>>>",  data);
                })
                listArea.map(itemA => {
                    itemA.typeofrooms.map(itemT => {
                        listT.push(itemT);
                        if (itemT.id === R.typeOfRoomId) {
                            TSelect = itemT;
                        }
                    });
                })
                setTypeOfRoom(listT);
                setTypeOfRoomSelected(TSelect);
                ASelect = (listArea.filter(item => item.id === TSelect.areaId))[0]
                setAreaSelected(ASelect);
            })

        } catch (error) {
            TOAST.EROR(error.message)
        }
    }


    const handleAdd = async () => {
        try {
            if (checkValue()) {
                setLoading(true);
                let contractData = {
                    ...contractAdd,
                    status: "0",
                    userId: userSelected.id,
                    roomId: roomSelected.id,
                    dayIn: contractAdd.dayIn ? contractAdd.dayIn : new Date(),
                    dateOfPayment: contractAdd.dateOfPayment ? contractAdd.dateOfPayment : new Date(),
                    duration: contractAdd.duration ? contractAdd.duration : new Date(),
                }

                console.log(contractData);

                await contractAPI.addContract(contractData).then(data => {
                    if (data) {
                        TOAST.SUCCESS(MESSAGE.ADD_SUCCESS);
                        history.goBack();
                        setLoading(false);
                    }
                })
                console.log("form =>", contractData);
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
                let contractData = {
                    ...contractAdd,
                    status: "0",
                    userId: userSelected.id,
                    roomId: roomSelected.id,
                }

                await contractAPI.updateContract(contractData,{id: id}).then(data => {
                    if (data) {
                        TOAST.SUCCESS(MESSAGE.ADD_SUCCESS);
                        history.goBack();
                        setLoading(false);
                    }
                })
                console.log("form =>", contractData);
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        getDataRoom();
    }, []);

    const getDataUserByRoom = async (id) => {
        try {
            await contractAPI.getUserByBookTicket({ roomId: id }).then(data => {
                setUser(data);
                console.log("res get User: >>>", data);
            })
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
                                                getDataUserByRoom(e.target.value.id)
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
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Khách thuê</InputLabel>
                                        <Select
                                            value={userSelected}
                                            label="Khách thuê"
                                            onChange={e => {
                                                setUserSelected(e.target.value);
                                            }}
                                        >
                                            {
                                                user.map((u, i) => <MenuItem key={i} value={u}>{u?.name}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                label="Ngày vào"
                                                inputFormat="dd/MM/yyyy"
                                                value={contractAdd?.dayIn}
                                                onChange={e => {
                                                    setContractAdd({
                                                        ...contractAdd,
                                                        dayIn: e
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
                                    <FormControl fullWidth>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                label="Ngày thanh toán"
                                                inputFormat="dd/MM/yyyy"
                                                value={contractAdd?.dateOfPayment}
                                                onChange={e => {
                                                    setContractAdd({
                                                        ...contractAdd,
                                                        dateOfPayment: e
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
                                    <FormControl fullWidth>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                label="Thời hạn"
                                                inputFormat="dd/MM/yyyy"
                                                value={contractAdd?.duration}
                                                onChange={e => {
                                                    setContractAdd({
                                                        ...contractAdd,
                                                        duration: e
                                                    })
                                                }
                                                }
                                                renderInput={(params) => <TextField size="small" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={contractAdd?.numberOfElectric} onChange={e => setContractAdd({
                                            ...contractAdd,
                                            numberOfElectric: e.target.value
                                        })} label="Chỉ số điện" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={contractAdd?.numberOfWater} onChange={e => setContractAdd({
                                            ...contractAdd,
                                            numberOfWater: e.target.value
                                        })} label="Chỉ số nước" variant="standard" />
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
                    <Grid item md={8} sm={16}>
                        <Box>
                            <FormControl fullWidth>
                                <TextField value={contractAdd?.term} onChange={e => setContractAdd({
                                    ...contractAdd,
                                    term: e.target.value
                                })} label="Điều khoản" multiline rows={18} />
                            </FormControl>
                        </Box>
                    </Grid>
                </Grid>
            </div >
        </Loading>
    )
}