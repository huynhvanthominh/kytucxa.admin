import { LoadingButton } from "@mui/lab"
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import { materialService } from "../../../apis/material.api";
import { TOAST } from "../../../customs/toast-custom";
import { pink } from "@mui/material/colors";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import QRCode from "react-qr-code";
import { toPng } from 'html-to-image';
import Loading from "../../../customs/loading";
import { billMaterialAPI } from "../../../apis/bill-material.api";

const InputMaterial = () => {
    const [loading, setLoading] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const history = useHistory();
    const [materials, setMaterials] = useState([]);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [material, setMaterial] = useState("");
    const [qr, setQr] = useState("");
    const [total, setTotal] = useState(0);
    const QRCodeRef = useRef()

    useEffect(() => {
        let tmp = 0;
        data.forEach(item => {
            tmp += (+item.price * +item.quantity);
        })
        setTotal(tmp);
    }, [data])

    const fetchStatus = async () => {
        try {
            const { data } = await materialService.getStatus();
            setStatuses(data);
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        fetchStatus();
    }, [])

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
        if (status === "") {
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
        const tmp = data.filter(item => item.material === material && item.status === status)
        if (tmp.length > 0) {
            TOAST.WARN("Đã có vật chất và tình trạng này rồi !");
            return false;
        }
        return true
    }

    const handleAdd = () => {
        if (checkValue()) {
            setData([
                ...data,
                {
                    material,
                    status,
                    price,
                    quantity
                }
            ])
            setMaterial("")
            setStatus("")
            setPrice(0)
            setQuantity(0)
        }
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
            const file = new File([u8arr], "text.png", { status: mime });
            console.log(file);
        })
    }

    const createDetailBill = async (idBill) => {
        try {
            data.forEach(async (item) => {
                const detailBill = {
                    idBill: idBill,
                    idMaterial: item.material,
                    idStatusMaterial: item.status,
                    quantity: +item.quantity,
                    price: +item.price,
                }

                await billMaterialAPI.createDetailBill(detailBill).then(rs => {
                    for (let i = 0; i < +item.quantity; i++) {
                        const detailMaterial = {
                            id: `${Date.now()}-${item.material}-${item.status}-${item.quantity}-${item.price}-${i}`,
                            idDetailBill: rs.data.id
                        }
                        materialService.addDetailMaterial(detailMaterial);
                    }
                }).catch(err => {
                    TOAST.EROR(err)
                });


            })

        } catch (error) {
            TOAST.EROR(error.message);
        }
    }

    const submit = async () => {
        setLoading(true)
        try {
            const { data } = await billMaterialAPI.create({ total })
            if (data.id) {
                await createDetailBill(data.id)
                TOAST.SUCCESS("Tạo hóa đơn thành công !");
                history.push("/Admin/Bill-Material/");
            } else {
                console.log(data);
                TOAST.EROR("Tạo hóa đơn thất bại !");
            }
            setTimeout(() => setLoading(false), 500)
        } catch (error) {
            TOAST.EROR(error.message)
            setLoading(false)
        }
    }

    const getTypeByValueType = (status) => {
        return statuses.filter(item => item.id === status)[0]
    }

    const getVatchatByIdVatchat = (id) => {
        return materials.filter(item => item.id === id)[0]
    }

    const removeData = (item) => {
        let tmp = data;
        tmp = tmp.filter(t => t !== item)
        setData(tmp)
    }

    useEffect(() => {
        fetchMaterial();
    }, []);

    return (
        <Loading loading={loading}>
            <div className="mt-4">
                {/* <div style={{ background: 'white', padding: '16px' }} ref={QRCodeRef}>
                <QRCode value={qr} level="H" id="qr" />
            </div> */}
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
                                        materials.map((material, i) => <MenuItem key={i} value={material?.id}>{material?.name}</MenuItem>)
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
                                    value={status || ""}
                                    onChange={e => setStatus(e.target.value)}
                                >
                                    {
                                        statuses.map((status, i) => <MenuItem key={i} value={status?.id}>{status?.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item md={4} sm={20}>
                        <Box>
                            <FormControl fullWidth>
                                <TextField value={quantity} onChange={e => setQuantity(e.target.value)} status={"number"} label="Số lượng" variant="outlined" size="small" />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item md={4} sm={20}>
                        <Box>
                            <FormControl fullWidth>
                                <TextField value={price} onChange={e => setPrice(e.target.value)} status={"number"} label="Đơn giá" variant="outlined" size="small" />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item md={4} sm={20}>
                        <Box>
                            <Button onClick={handleAdd} variant="contained" endIcon={<AddIcon />} >Thêm</Button>
                        </Box>
                    </Grid>
                </Grid>
                {data.length > 0 && (
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
                                                <td>{getVatchatByIdVatchat(item.material).name}</td>
                                                <td>{getTypeByValueType(item.status).name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.price}</td>
                                                <td>{+item.quantity * item.price}</td>
                                                <td>
                                                    <div className="d-flex justify-content-center">
                                                        <Button variant="text" onClick={() => removeData(item)}><DeleteForeverIcon sx={{ color: pink[500] }} /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr className="table-danger">
                                    <td colSpan={3}></td>
                                    <td colSpan={3}>Tổng tiền</td>
                                    <td>{total} VNĐ</td>
                                </tr>
                            </tbody>
                        </table>
                        <Box>
                            <Button variant="contained" endIcon={<AddIcon />} onClick={submit}>Tạo</Button>
                            <Button variant="contained" color='inherit' className="ms-1" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Thoát</Button>
                        </Box>
                    </div>
                )}
            </div>
        </Loading>
    )
}

export default InputMaterial