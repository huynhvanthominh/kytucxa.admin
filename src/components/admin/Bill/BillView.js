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
    const [status, setStatus] = useState([{ id: '0', label: 'Ch??a thanh to??n' }, { id: '1', label: '???? thanh to??n' }])
    const [statusSelect, setStatusSelect] = useState({ id: '' });
    const [price, setPrice] = useState('');
    const [priceTemp, setPriceTemp] = useState('');
    const [countPress, setCountPress] = useState(1);
    const title = id ? "C???p nh???t h??a ????n" : "Th??m ho?? ????n";



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
            TOAST.WARN("Vui l??ng ch???n khu !");
            return false
        }
        if (!typeOfRoomSelected || typeOfRoomSelected.id?.length === 0) {
            TOAST.WARN("Vui l??ng ch???n lo???i ph??ng !");
            return false
        }
        if (!roomSelected || roomSelected.id?.length === 0) {
            TOAST.WARN("Vui l??ng ch???n ph??ng !");
            return false
        }
        if (!contractSelected || contractSelected.id?.length === 0) {
            TOAST.WARN("Vui l??ng ch???n h???p ?????ng !");
            return false
        }
        if (!billAdd.nameOfBill || billAdd.nameOfBill?.length === 0) {
            TOAST.WARN("Vui l??ng nh???p t??n h??a ????n !");
            return false
        }
        if (billAdd.discount?.length === 0) {
            TOAST.WARN("Vui l??ng nh???p ph???n tr??m gi???m gi?? !");
            return false
        }
        if (billAdd.forfeit?.length === 0) {
            TOAST.WARN("Vui l??ng nh???p s??? ti???n ph???t !");
            return false
        }
        if (!price || price.length === 0) {
            TOAST.WARN("Vui l??ng nh???p t???ng ti???n !");
            return false
        }
        if (!statusSelect || statusSelect.id?.length === 0) {
            TOAST.WARN("Vui l??ng ch???n t??nh tr???ng !");
            return false
        }
        if (!billAdd.note || billAdd.note.length === 0) {
            TOAST.WARN("Vui l??ng nh???p ghi ch?? !");
            return false
        }
        if (countPress === 0) {
            TOAST.WARN("Vui l??ng nh???n t??nh t???ng !");
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
                await billAPI.updateBill(billData, { id: id }).then(data => {
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
                                        <InputLabel>Ph??ng</InputLabel>
                                        <Select
                                            value={roomSelected}
                                            label="Ph??ng"
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
                                        <InputLabel>Lo???i Ph??ng</InputLabel>
                                        <Select
                                            value={typeOfRoomSelected}
                                            label="Lo???i Ph??ng"
                                            onChange={e => {
                                                setTypeOfRoomSelected(e.target.value);
                                                console.log(e.target.value)
                                                setRoom(e.target.value.rooms);
                                                setPriceTemp(e.target.value.priceofrooms[e.target.value.priceofrooms?.length - 1].price)
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
                                        <InputLabel>H???p ?????ng</InputLabel>
                                        <Select
                                            value={contractSelected}
                                            label="H???p ?????ng"
                                            onChange={e => {
                                                setContractSelected(
                                                    e.target.value,
                                                );
                                                let data = e.target.value;
                                                let dayIn = new Date(data.dayIn);
                                                let duration = new Date(data.duration)
                                                let result = duration.getTime() - dayIn.getTime();
                                                let price = new Date(result).getDate() * Number(priceTemp);
                                                setPrice(price);
                                            }}
                                        >
                                            {
                                                contract.map((ctr, i) => <MenuItem key={i} value={ctr}>M?? H??: {ctr?.id}</MenuItem>)
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
                                                label="Ng??y thu ti???n"
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
                                        })} label="T??n ho?? ????n" variant="standard" />
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
                                        }} label="Gi???m gi?? (%)" variant="standard" />
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
                                        }} label="Ph???t" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <LoadingButton loading={loadingButton} variant="contained" endIcon={<AddIcon />} onClick={id ? handleUpdate : handleAdd}>{id ? "C???p nh???t" : "Th??m"}</LoadingButton>
                                    <Button variant="contained" color='inherit' className="ms-1" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Tho??t</Button>
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
                                            label="T???ng" size="small" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={6}>
                                <Box>
                                    <FormControl fullWidth>
                                        <Button variant="contained" onClick={() => {
                                            setCountPress(countPress + 1)
                                            setPrice(Number(price - ((billAdd?.discount / 100) * price) - billAdd.forfeit))
                                        }}>T??nh t???ng</Button>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>T??nh tr???ng</InputLabel>
                                        <Select
                                            value={statusSelect}
                                            label="T??nh tr???ng"
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
                                        })} label="Ghi ch??" variant="standard" multiline rows={4} size="small" />
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