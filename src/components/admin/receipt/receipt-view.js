import { Button, Card, CircularProgress, Grid, Input, MenuItem, Select, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Loading from "../../../customs/loading";
import { materialTypeService } from "../../../apis/material-type.api";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import PATH from "../../../consts/path";
import { TOAST } from "../../../customs/toast-custom";
import { LoadingButton } from "@mui/lab";
import { uploadFileService } from "../../../apis/upload-file.api";
import { materialService } from "../../../apis/material.api";
import MESSAGE from "../../../consts/message-alert";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { receiptAPI } from "../../../apis/receipt.api";
export default function ReceiptView() {
    const history = useHistory();
    const [materialTypes, setMaterialTypes] = useState([]);
    const [material, setMaterial] = useState([]);
    const [image, setImage] = useState("");
    const { id } = useParams();
    const title = id ? "Cập nhật biên nhận" : "Thêm biên nhận";
    const [file, setFile] = useState();
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false)
    const [listReceipt, setListReceipt] = useState([]);
    const [listBill, setListBill] = useState([]);
    const [billSelect, setBillSelect] = useState([]);
    const [paymentMethod, setpaymentMethod] = useState([{ id: '0', label: 'Thanh toán tiền mặt' }, { id: '1', label: 'Chuyển khoản' }])
    const [paymentMethodSelect, setPaymentMethodSelect] = useState({ id: '' });
    const [status, setStatus] = useState([{ id: '0', label: 'Chưa thanh toán' }, { id: '1', label: 'Đã thanh toán' }])
    const [statusSelect, setStatusSelect] = useState({ id: '' });
    const [receiptAdd, setReceiptAdd] = useState({amountOfMoney: '', dateOfPayment: new Date(), note: ''});



    const getReceipt = async () => {
        await receiptAPI.getBillByArea({userId: 1}).then(data => {
            let listR = [];
            let listB = [];
            data.map(itemArea => {
                itemArea.typeofrooms.map(itemType => {
                    itemType.rooms.map(itemRoom => {
                        itemRoom.contracts.map(itemCtr => {
                            itemCtr.bills.map(itemBill => {
                                listB.push(itemBill)
                                itemBill.receipts.map(itemRe => {
                                    listR.push(itemRe);
                                })
                            })
                        })
                    })
                })
            })
            setListReceipt(listR);
            setListBill(listB);
            if(id){
                getReceiptData(listB);
            }
        })
    }

    const getReceiptData = async (listB) => {
        await receiptAPI.getReceiptById({id: id}).then(data => {
            setReceiptAdd(data);
            console.log(data);
            setPaymentMethodSelect(
                (paymentMethod.filter(item => item.id === data.paymentMethod))[0]
            )
            setStatusSelect(
                (status.filter(item => item.id === data.status))[0]
            )
            setBillSelect(
                (listB.filter(item => item.id === data.billId))[0]
            )
        })
    }
    useEffect(() => {
        getReceipt();
    }, [])


    const uploadFile = async () => {
        const { data } = await uploadFileService.uploadImage(file, "receipt");
        return data
    }

    const checkValue = () => {
        if (!file && !receiptAdd.image) {
            TOAST.WARN("Vui lòng chọn hình ảnh !");
            return false
        }
        if (!receiptAdd?.amountOfMoney) {
            TOAST.WARN("Vui lòng nhập số tiền !");
            return false
        }
        if (!paymentMethodSelect) {
            TOAST.WARN("Vui lòng chọn phương thức thanh toán !");
            return false
        }
        if (!statusSelect) {
            TOAST.WARN("Vui lòng chọn trạng thái !");
            return false
        }
        if (!receiptAdd?.note) {
            TOAST.WARN("Vui lòng nhập ghi chú !");
            return false
        }
        
        return true
    }

    const handleAdd = async () => {
        try {
            if (checkValue()) {
                setLoading(true);
                const date = new Date();
                const minutes = date.getMinutes();
                let data = new FormData();
                let receiptData = {
                    ...receiptAdd,
                    billId: billSelect.id,
                    status: statusSelect.id,
                    paymentMethod: paymentMethodSelect.id,
                }
                data.append("image", file);
                data.append("receipt", JSON.stringify(receiptData));
                console.log(file)
                await receiptAPI.addReceipt(data).then(data => {
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

    const handleUpdate = async () => {
        try {
            if (checkValue()) {
                setLoading(true);
                const date = new Date();
                const minutes = date.getMinutes();
                let data = new FormData();
                let receiptData = {
                    ...receiptAdd,
                    billId: billSelect.id,
                    status: statusSelect.id,
                    paymentMethod: paymentMethodSelect.id,
                }
                data.append("image", file);
                data.append("receipt", JSON.stringify(receiptData));
                await receiptAPI.updateReceipt(data, {id: id}).then(data => {
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
                        <Card className="card-file">
                            <label className="input-file">
                                <Input onChange={e => handleChange(e)} accept="image/*" className="d-none" id="icon-button-file" type="file" />
                                {
                                    loadingImage ? <CircularProgress /> :
                                        image.length === 0 && !receiptAdd.image?
                                            <CameraAltIcon color="primary" sx={{ fontSize: 120 }} /> :
                                            <img src={image ? image : (PATH.URL_SERVER.concat(receiptAdd.image))} />
                                }
                            </label>
                        </Card>
                    </Grid>
                    <Grid item md={8} sm={16}>
                        <Grid container spacing={2} columns={16}>
                        <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Hóa đơn</InputLabel>
                                        <Select
                                            value={billSelect}
                                            label="Hóa đơn"
                                            onChange={e => setBillSelect(e.target.value)}
                                        >
                                            {
                                                listBill.map((bill, i) => <MenuItem key={i} value={bill}>Mã: {bill?.id} - {bill?.nameOfBill}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={receiptAdd.amountOfMoney} onChange={e => setReceiptAdd({
                                            ...receiptAdd,
                                            amountOfMoney: e.target.value
                                        })} label="Tổng tiền" variant="standard"  multiline rows={1}/>
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
                                                value={receiptAdd?.dateOfPayment}
                                                onChange={e => {
                                                    setReceiptAdd({
                                                        ...receiptAdd,
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
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Phương thức thanh toán</InputLabel>
                                        <Select
                                            value={paymentMethodSelect}
                                            label="Phương thức thanh toán"
                                            onChange={e => setPaymentMethodSelect(e.target.value)}
                                        >
                                            {
                                                paymentMethod.map((pay, i) => <MenuItem key={i} value={pay}>{pay?.label}</MenuItem>)
                                            }
                                        </Select>
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
                                            onChange={e => setStatusSelect(e.target.value)}
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
                                        <TextField value={receiptAdd.note} onChange={e => setReceiptAdd({
                                            ...receiptAdd,
                                            note: e.target.value
                                        })} label="Ghi chú" variant="standard"  multiline rows={4}/>
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