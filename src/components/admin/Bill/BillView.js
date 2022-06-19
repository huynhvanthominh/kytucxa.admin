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
import { uploadFileService } from "../../../apis/upload-file.api";
import { materialService } from "../../../apis/material.api";
import MESSAGE from "../../../consts/message-alert";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { contractAPI } from "../../../apis/contract.api";
import { startOfToday } from "date-fns/esm";
import { billAPI } from "../../../apis/bill.api";
import moment from "moment";
export default function BillView() {

    const history = useHistory();
    const [value, setValue] = useState(new Date());
    const [image, setImage] = useState("")
    const [file, setFile] = useState();
    const { id } = useParams();
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false)
    const [listArea, setListArea] = useState([]);
    const [areaSelected, setAreaSelected] = useState({ id: '' });
    const [typeOfRoom, setTypeOfRoom] = useState([]);
    const [typeOfRoomSelected, setTypeOfRoomSelected] = useState({ id: '' });
    const [room, setRoom] = useState([]);
    const [roomSelected, setRoomSelected] = useState({ id: '' });
    const [contract, setContract] = useState([]);
    const [contractSelected, setContractSelected] = useState({ id: '' });
    const [bill, setBill] = useState([]);
    const [billAdd, setBillAdd] = useState({ discount: '0', forfeit: '0', nameOfBill: '', note: '' });
    const [status, setStatus] = useState([{ id: '0', label: 'Chưa thanh toán' }, { id: '1', label: 'Đã thanh toán' }])
    const [statusSelect, setStatusSelect] = useState({ id: '' });
    const [price, setPrice] = useState('');
    const [countPress, setCountPress] = useState(1);
    const title = id ? "Cập nhật hóa đơn" : "Thêm hoá đơn";



    const uploadFile = async () => {
        const { data } = await uploadFileService.uploadImage(file, "bill");
        return data
    }

    const getContractData = async () => {
        try {
            await contractAPI.getContractByArea({ userId: 1 }).then(data => {
                setListArea(data);
                setAreaSelected(-1);
                setTypeOfRoomSelected(-1);
                const listRoom = [];
                const listType = [];
                const listContract = [];
                const listBill = [];
                data.map(item => {
                    item?.typeofrooms.map(itemType => {
                        listType.push(itemType);
                        itemType.rooms.map(itemRoom => {
                            listRoom.push(itemRoom);
                            itemRoom.contracts.map(itemTr => {
                                listContract.push(itemTr)
                                itemTr.bills.map(itemB => {
                                    listBill.push(itemB);
                                })
                            })
                        })
                    })
                })
                console.log(listRoom);
                setBill(listBill);
                setTypeOfRoom(listType);
                setRoom(listRoom);
                setContract(listContract);
                if (id) {
                    getDataBill(data, listType, listRoom, listContract)
                }
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        const listRoom = [];
        const listType = [];
        const listContract = [];
        const listBill = [];
        listArea.filter(itemF => itemF.id === areaSelected.id).map(item => {
            item?.typeofrooms.map(itemType => {
                listType.push(itemType);
                itemType.rooms.map(itemRoom => {
                    listRoom.push(itemRoom);
                    itemRoom.contracts.map(itemTr => {
                        listContract.push(itemTr)
                        itemTr.bills.map(itemB => {
                            listBill.push(itemB);
                        })
                    })
                })
            })
        })
        console.log(listRoom);
        setBill(listBill);
        setTypeOfRoom(listType);
        setRoom(listRoom);
        setContract(listContract);
    }, [areaSelected])

    const getDataBill = async (listArea, listType, listRoom, listContract) => {
        try {
            await billAPI.getBillById({ id: id }).then(data => {
                setBillAdd(data);
                console.log(data.status);
                let stt = status.filter(item => item.id === data.status);
                setStatusSelect(stt[0])
                setPrice(data.total);


                let ASelect = [];
                let TSelect = [];
                let listT = [];
                let R = [];
                let ctr = [];
                ctr = (listContract.filter(item => item.id === data.contractId))[0];
                R = (listRoom.filter(item => item.id === ctr.roomId))[0];
                console.log(R);
                listArea.map(itemA => {
                    itemA.typeofrooms.map(itemT => {
                        listT.push(itemT);
                        if (itemT.id === R.typeOfRoomId) {
                            TSelect = itemT;
                        }
                    });
                })
                setContractSelected(ctr);
                setRoomSelected(R);
                setTypeOfRoom(listT);
                setTypeOfRoomSelected(TSelect);
                ASelect = (listArea.filter(item => item.id === TSelect.areaId))[0]
                setAreaSelected(ASelect);
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        getContractData();
    }, [])

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
        if (!contractSelected || contractSelected.id?.length === 0) {
            TOAST.WARN("Vui lòng chọn hợp đồng !");
            return false
        }
        if (!billAdd.nameOfBill || billAdd.nameOfBill?.length === 0) {
            TOAST.WARN("Vui lòng nhập tên hóa đơn !");
            return false
        }
        if (billAdd.discount?.length === 0) {
            TOAST.WARN("Vui lòng nhập phần trăm giảm giá !");
            return false
        }
        if (billAdd.forfeit?.length === 0) {
            TOAST.WARN("Vui lòng nhập số tiền phạt !");
            return false
        }
        if (!price || price.length === 0) {
            TOAST.WARN("Vui lòng nhập tổng tiền !");
            return false
        }
        if (!statusSelect || statusSelect.id?.length === 0) {
            TOAST.WARN("Vui lòng chọn tình trạng !");
            return false
        }
        if (!billAdd.note || billAdd.note.length === 0) {
            TOAST.WARN("Vui lòng nhập ghi chú !");
            return false
        }
        if (countPress === 0) {
            TOAST.WARN("Vui lòng nhấn tính tổng !");
            return false
        }
        return true
    }

    const handleAdd = async () => {
        try {
            if (checkValue()) {
                let date = new Date()
                setLoading(true);
                let billData = {
                    ...billAdd,
                    total: String(price),
                    dateOfPayment: billAdd.dateOfPayment ? String(billAdd.dateOfPayment) : String(date),
                    status: statusSelect.id,
                    contractId: contractSelected.id,
                }
                console.log("form =>", billData);
                await billAPI.addBill(billData).then(data => {
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
                let date = new Date()
                setLoading(true);
                let billData = {
                    ...billAdd,
                    contractId: contractSelected.id,
                    total: price,
                    dateOfPayment: billAdd.dateOfPayment ? billAdd.dateOfPayment : date,
                    status: statusSelect.id
                }
                console.log("form =>", billData);
                await billAPI.updateBill(billData, {id: id}).then(data => {
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

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    return (
        <Loading loading={loading}>
            <div>
                <div className="d-flex align-items-center">
                    <div>
                        <h3>{title}</h3>
                    </div>
                </div>
                <div className="border-bottom border-primary border-5" />
                <Grid container spacing={2} columns={16} className="py-4">
                    <Grid item md={8} sm={16}>
                        <Grid container spacing={2} columns={16}>
                            <Grid item sm={8}>
                                <Box>
                                    <Box>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Khu</InputLabel>
                                            <Select
                                                className="min-width-200"
                                                label="Khu"
                                                value={areaSelected}
                                                onChange={e => setAreaSelected(e.target.value)}
                                            >
                                                {
                                                    listArea.map((area, i) => <MenuItem key={i} value={area}>{area?.areaName}</MenuItem>)
                                                }
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Phòng</InputLabel>
                                        <Select
                                            value={roomSelected}
                                            label="Phòng"
                                            onChange={e => setRoomSelected(
                                                e.target.value
                                            )}
                                        >
                                            {
                                                room.map((r, i) => <MenuItem key={i} value={r}>{r?.roomName}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
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
                                                setPrice(e.target.value.priceofrooms[e.target.value.priceofrooms?.length - 1].price)
                                            }}
                                        >
                                            {
                                                typeOfRoom.map((type, i) => <MenuItem key={i} value={type}>{type?.name}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Hợp đồng</InputLabel>
                                        <Select
                                            value={contractSelected}
                                            label="Hợp đồng"
                                            onChange={e => {
                                                setContractSelected(
                                                    e.target.value,
                                                );
                                            }}
                                        >
                                            {
                                                contract.map((ctr, i) => <MenuItem key={i} value={ctr}>Mã HĐ: {ctr?.id}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopDatePicker
                                                label="Ngày thu tiền"
                                                inputFormat="dd/MM/yyyy"
                                                value={billAdd?.dateOfPayment}
                                                onChange={e => setBillAdd({
                                                    ...billAdd,
                                                    dateOfPayment: e
                                                })}
                                                renderInput={(params) => <TextField size="small" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={billAdd?.nameOfBill} onChange={e => setBillAdd({
                                            ...billAdd,
                                            nameOfBill: e.target.value
                                        })} label="Tên hoá đơn" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={billAdd.discount} onChange={e => {
                                            setBillAdd({
                                                ...billAdd,
                                                discount: e.target.value
                                            })
                                            setCountPress(0)
                                        }} label="Giảm giá (%)" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={8}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={billAdd.forfeit} onChange={e => {
                                            setBillAdd({
                                                ...billAdd,
                                                forfeit: e.target.value
                                            })
                                            setCountPress(0)
                                        }} label="Phạt" variant="standard" />
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
                        <Grid container spacing={2} columns={16}>
                            <Grid item sm={10}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={price} onChange={e => setPrice(e.target.value)}
                                            label="Tổng" size="small" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={6}>
                                <Box>
                                    <FormControl fullWidth>
                                        <Button variant="contained" onClick={() => {
                                            setCountPress(countPress + 1)
                                            setPrice(Number(price - ((billAdd?.discount / 100) * price) - billAdd.forfeit))
                                        }}>Tính tổng</Button>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Tình trạng</InputLabel>
                                        <Select
                                            value={statusSelect}
                                            label="Tình trạng"
                                            onChange={e => {
                                                setStatusSelect(
                                                    e.target.value
                                                )
                                            }}
                                        >
                                            {
                                                status.map((stt, i) => <MenuItem key={i} value={stt}>{stt?.label}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={billAdd?.note} onChange={e => setBillAdd({
                                            ...billAdd,
                                            note: e.target.value
                                        })} label="Ghi chú" variant="standard" multiline rows={4} size="small" />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        </Loading>
    )
}