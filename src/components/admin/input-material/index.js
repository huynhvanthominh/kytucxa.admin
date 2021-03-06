import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import { materialService } from "../../../apis/material.api";
import { TOAST } from "../../../customs/toast-custom";
import { pink } from "@mui/material/colors";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import QRCode from "qrcode";
import Loading from "../../../customs/loading";
import { billMaterialAPI } from "../../../apis/bill-material.api";
import { uploadFileService } from "../../../apis/upload-file.api";
import { formatMoney } from "../../../helps/formatMoney";
const InputMaterial = () => {
    const [loading, setLoading] = useState(false);
    const [statuses, setStatuses] = useState([]);
    const history = useHistory();
    const [materials, setMaterials] = useState([]);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [material, setMaterial] = useState("");
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

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
            setStatuses(data.slice(0, 2));
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
            TOAST.WARN("Ch???n v???t ch???t !");
            return false
        }
        if (status === "") {
            TOAST.WARN("Ch???n t??nh tr???ng v???t ch???t !");
            return false;
        }
        if (quantity <= 0) {
            TOAST.WARN("Nh???p s??? l?????ng l???n h??n 0 !");
            return false;
        }
        if (price <= 0) {
            TOAST.WARN("Nh???p gi?? l???n h??n 0 !");
            return false;
        }
        const tmp = data.filter(item => item.material === material && item.status === status)
        if (tmp.length > 0) {
            TOAST.WARN("???? c?? v???t ch???t v?? t??nh tr???ng n??y r???i !");
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
                    price: parseFloat(price),
                    quantity: parseInt(quantity)
                }
            ])
            setMaterial("")
            setStatus("")
            setPrice(0)
            setQuantity(0)
        }
    }

    const createDetailBill = async (idBill) => {
        try {
            await data.forEach(async (item) => {
                const detailBill = {
                    idBill: idBill,
                    idMaterial: item.material,
                    idStatusMaterial: item.status,
                    quantity: +item.quantity,
                    price: +item.price,
                }
                const arrTmp = new Array(+item.quantity).fill(0);

                await billMaterialAPI.createDetailBill(detailBill).then(async rs => {
                    let i = 0;
                    arrTmp.forEach(async (_) => {
                        i++;
                        let detailMaterial = {
                            id: `${Date.now()}-${item.material}-${item.status}-${item.quantity}-${item.price}-${i}`,
                            idMaterial: item.material,
                            idDetailBill: rs.data.id,
                            idStatusMaterial: item.status,
                            owner:"",
                            qr: ""
                        }
                        const base64 = await QRCode.toDataURL(detailMaterial.id, {
                            errorCorrectionLevel: 'H',
                        })
                        var arr = base64.split(','),
                            mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]),
                            n = bstr.length,
                            u8arr = new Uint8Array(n);

                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        const file = new File([u8arr], "text.png", { status: mime, type: "image/png" });
                        const { data } = await uploadFileService.uploadImage(file)
                        detailMaterial = { ...detailMaterial, qr: data.name }
                        materialService.addDetailMaterial(detailMaterial);
                    })

                }).catch(err => {
                    TOAST.EROR(err)
                });
            })
            TOAST.SUCCESS("T???o h??a ????n th??nh c??ng !");
            history.push("/Admin/Bill-Material/");
        } catch (error) {
            TOAST.EROR(error.message);
        }
    }

    const checkInfo = () => {
        if (phone === "") {
            TOAST.WARN("Vui l??ng nh???p s??? ??i???n tho???i !");
            return false
        }
        if (address === "") {
            TOAST.WARN("Vui l??ng nh???p ?????a ch??? !");
            return false
        }
        return true
    }

    const submit = async () => {
        setLoading(true)
        try {
            if (checkInfo()) {
                const { data } = await billMaterialAPI.create({ total, address, name, phone, kind: "import" })
                if (data.id) {
                    await createDetailBill(data.id)
                } else {
                    TOAST.EROR("T???o h??a ????n th???t b???i !");
                }
            }
            setLoading(false)
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
            <div>
                <div className="d-flex align-items-center">
                    <div>
                        <h3>Nh???p v???t ch???t</h3>
                    </div>
                </div>
                <div className="border-bottom border-primary border-5" />
                <Grid container columns={20} spacing={2} sx={{ py: 4 }}>
                    <Grid item md={4} sm={20}>
                        <Box>
                            <FormControl fullWidth size="small">
                                <InputLabel>V???t ch???t</InputLabel>
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
                                <InputLabel>T??nh tr???ng</InputLabel>
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
                                <TextField value={quantity} onChange={e => setQuantity(e.target.value)} className="hide-spin" type="number" status={"number"} label="S??? l?????ng" variant="outlined" size="small" />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item md={4} sm={20}>
                        <Box>
                            <FormControl fullWidth>
                                <TextField value={price} onChange={e => setPrice(e.target.value)} className="hide-spin" type="number" status={"number"} label="????n gi??" variant="outlined" size="small" />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item md={4} sm={20}>
                        <Box>
                            <Button onClick={handleAdd} variant="contained" endIcon={<AddIcon />} >Th??m</Button>
                        </Box>
                    </Grid>
                </Grid>
                {data.length > 0 && (
                    <div>
                        <h3>H??a ????n</h3>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>V???t ch???t</th>
                                    <th>T??nh tr???ng</th>
                                    <th>S??? l?????ng</th>
                                    <th>????n gi??</th>
                                    <th>Th??nh ti???n</th>
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
                                                <td>{formatMoney(item.price)}</td>
                                                <td>{formatMoney(+item.quantity * item.price)}</td>
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
                                    <td colSpan={3}>T???ng ti???n</td>
                                    <td>{formatMoney(total)} VN??</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="row">
                            <div className="col-lg-4 my-2">
                                <FormControl fullWidth>
                                    <TextField value={name} onChange={e => setName(e.target.value)} label="H??? v?? t??n" variant="outlined" size="small" />
                                </FormControl>
                            </div>
                            <div className="col-lg-4 my-2">
                                <FormControl fullWidth>
                                    <TextField value={phone} onChange={e => setPhone(e.target.value)} className="hide-spin" type="number" status={"number"} label="S??? ??i???n tho???i" variant="outlined" size="small" />
                                </FormControl>
                            </div>
                            <div className="col-lg-4 my-2">
                                <FormControl fullWidth>
                                    <TextField value={address} onChange={e => setAddress(e.target.value)} label="?????a ch???" variant="outlined" size="small" />
                                </FormControl>
                            </div>
                        </div>
                        <Box>
                            <Button variant="contained" endIcon={<AddIcon />} onClick={submit}>T???o</Button>
                            <Button variant="contained" color='inherit' className="ms-1" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Tho??t</Button>
                        </Box>
                    </div>
                )}
            </div>
        </Loading>
    )
}

export default InputMaterial