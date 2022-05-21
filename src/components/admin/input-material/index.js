import { LoadingButton } from "@mui/lab"
import { Box, Button, Card, FormControl, Grid, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import { materialService } from "../../../services/material.service";
import { TOAST } from "../../../customs/toast-custom";
import { TYPE_MATERIAL } from "../../../consts/type-material"
import { pink } from "@mui/material/colors";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import QRCode from "react-qr-code";

import { toPng } from 'html-to-image';
const types = [
    {
        label: "Mới",
        value: TYPE_MATERIAL.NEW
    },
    {
        label: "Đã qua sử dụng",
        value: TYPE_MATERIAL.OLD
    }
]
const InputMaterial = () => {
    const title = "Input"
    const [loadingButton, setLoadingButton] = useState(false);
    const history = useHistory();
    const [materials, setMaterials] = useState([]);
    const [data, setData] = useState([]);
    const [type, setType] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [material, setMaterial] = useState("");
    const [qr, setQr] = useState("");
    const QRCodeRef = useRef()
    const fetchMaterial = async () => {
        try {
            const { data } = await materialService.get();
            setMaterials(data);
        } catch (error) {
            TOAST.EROR(error);
        }
    }

    const checkValue = () => {
        if (material === "") {
            TOAST.WARN("Chọn vật chất !");
            return false
        }
        if (type === "") {
            TOAST.WARN("Chọn tình trạng vật chất !");
            return false;
        }
        if (quantity <= 0) {
            TOAST.WARN("Nhập số lượng lớn hơn 0 !");
            return false;
        }
        if (price <= 0) {
            TOAST.WARN("Nhập giá lớn hơn 0 !");
            return false;
        }
        return true
    }

    const handleAdd = () => {
        setLoadingButton(true)
        if (checkValue()) {
            setData([
                ...data,
                {
                    material,
                    type,
                    price,
                    quantity
                }
            ])
            setMaterial("")
            setType("")
            setPrice(0)
            setQuantity(0)
        }
        setTimeout(() => setLoadingButton(false), 500)
    }

    const handleCreate = () => {
        data.forEach(item => {
            console.log(item);
        })
        const qr = QRCodeRef.current.childNodes[0]
        toPng(qr).then(data => {
            var arr = data.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new File([u8arr], "text.png", { type: mime });
            console.log(file);
        })
    }

    const getTypeByValueType = (type) => {
        return types.filter(item => item.value === type)[0]
    }

    const getVatchatByIdVatchat = (idVatchat) => {
        return materials.filter(item => item.idVatchat === idVatchat)[0]
    }

    useEffect(() => {
        fetchMaterial();
    }, []);

    return (
        <div className="mt-4">
            <div style={{ background: 'white', padding: '16px' }} ref={QRCodeRef}>
                <QRCode value={qr} level="H" id="qr" />
            </div>
            <div className="border-bottom border-primary border-5" />
            <Grid container columns={20} spacing={2} sx={{ py: 4 }}>
                <Grid item md={4} sm={20}>
                    <Box>
                        <FormControl fullWidth size="small">
                            <InputLabel>Vật chất</InputLabel>
                            <Select
                                value={material || ""}
                                onChange={e => setMaterial(e.target.value)}
                            >
                                {
                                    materials.map((material, i) => <MenuItem key={i} value={material?.idVatchat}>{material?.tenVatchat}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4} sm={20}>
                    <Box>
                        <FormControl fullWidth size="small">
                            <InputLabel>Tình trạng</InputLabel>
                            <Select
                                value={type || ""}
                                onChange={e => setType(e.target.value)}
                            >
                                {
                                    types.map((type, i) => <MenuItem key={i} value={type?.value}>{type?.label}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4} sm={20}>
                    <Box>
                        <FormControl fullWidth>
                            <TextField value={quantity} onChange={e => setQuantity(e.target.value)} type={"number"} label="Số lượng" variant="outlined" size="small" />
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4} sm={20}>
                    <Box>
                        <FormControl fullWidth>
                            <TextField value={price} onChange={e => setPrice(e.target.value)} type={"number"} label="Đơn giá" variant="outlined" size="small" />
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item md={4} sm={20}>
                    <Box>
                        <LoadingButton onClick={handleAdd} loading={loadingButton} variant="contained" endIcon={<AddIcon />} >Thêm</LoadingButton>
                        <Button variant="contained" color='inherit' className="ms-1" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Thoát</Button>
                    </Box>
                </Grid>
            </Grid>
            <div>
                <h3>Hóa đơn</h3>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Vật chất</th>
                            <th>Tình trạng</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((item, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{getVatchatByIdVatchat(item.material).tenVatchat}</td>
                                        <td>{getTypeByValueType(item.type).label}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price}</td>
                                        <td>{+item.quantity * item.price}</td>
                                        <td>
                                            <div className="d-flex justify-content-center">
                                                <Button variant="text"><DeleteForeverIcon sx={{ color: pink[500] }} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <Box>
                    <LoadingButton onClick={handleAdd} loading={loadingButton} variant="contained" endIcon={<AddIcon />} onClick={handleCreate}>Tạo</LoadingButton>
                    <Button variant="contained" color='inherit' className="ms-1" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Thoát</Button>
                </Box>
            </div>
        </div>
    )
}

export default InputMaterial