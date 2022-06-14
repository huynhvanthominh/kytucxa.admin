import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { TOAST } from "../../../customs/toast-custom";
import Loading from "../../../customs/loading";
import { roomAPI } from "../../../apis/room.api";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import { materialService } from "../../../apis/material.api";
import { pink } from "@mui/material/colors";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import QRCode from "qrcode";
import { billMaterialAPI } from "../../../apis/bill-material.api";
import { uploadFileService } from "../../../apis/upload-file.api";
import { formatMoney } from "../../../helps/formatMoney";
export default function InputMaterialToRoom() {
    const title = "Nhập vật chất vào phòng"
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState("");
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
    const fetchRoom = async () => {
        try {
            const { data } = await roomAPI.getRoomAdmin();
            setRooms(data);
        } catch (error) {
            setLoading(false);
            TOAST.EROR(error.message);
        }
    }
    const fetchMaterial = async () => {
        const { data } = await materialService.get();
        setMaterials(data);
    }
    const fetchStatus = async () => {
        try {
            const { data } = await materialService.getStatus();
            setStatuses(data.slice(0, 2));
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const checkValue = () => {
        if (room === "") {
            TOAST.WARN("Chọn phòng !");
            return false
        }
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
        const tmp = data.filter(item => item.material === material && item.status === status && item.room === room)
        if (tmp.length > 0) {
            TOAST.WARN("Đã có vật chất và tình trạng vật chất trong phòng này rồi !");
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
                    quantity: parseInt(quantity),
                    room: room
                }
            ])
            setMaterial("")
            setStatus("")
            setPrice(0)
            setQuantity(0)
            setRoom("");
        }
    }

    const checkInfo = () => {
        if (phone === "") {
            TOAST.WARN("Vui lòng nhập số điện thoại !");
            return false
        }
        if (address === "") {
            TOAST.WARN("Vui lòng nhập địa chỉ !");
            return false
        }
        return true
    }
    const createDetailBill = async (idBill) => {
        try {
            data.forEach(async (item) => {
                const detailBill = {
                    idBill: idBill,
                    idRoom: item.room,
                    idMaterial: item.material,
                    idStatusMaterial: item.status,
                    quantity: +item.quantity,
                    price: +item.price,
                }
                await billMaterialAPI.createDetailBill(detailBill).then(async rs => {
                    if (rs.status) {
                        materialService.getDetailMaterialByStatus(detailBill.idMaterial, detailBill.idStatusMaterial).then(async (result) => {
                            console.log(+result.data.length);
                            console.log(detailBill.quantity);
                            console.log(+result.data.length < +detailBill.quantity);

                            if (+result.data.length < +detailBill.quantity) {
                                await TOAST.EROR(`Số lượng vật chất "${result.data[0].name} chỉ còn ${result.data.length} !"`);
                            } else {
                                const detailMaterials = result.data.slice(0, detailBill.quantity);
                                detailMaterials.forEach(async (item) => {
                                    await materialService.updateDetailMaterial({ id: item.id, idStatusMaterial: 3, owner: detailBill.idRoom })
                                })
                            }
                        });
                    }
                }).catch(err => {
                    TOAST.EROR(err)
                });
            })
            TOAST.SUCCESS("Tạo hóa đơn thành công !");
            history.push("/Admin/Bill-Material/");
        } catch (error) {
            TOAST.EROR(error.message);
        }
    }

    const submit = async () => {
        setLoading(true)
        try {
            if (checkInfo()) {
                const { data } = await billMaterialAPI.create({ total, address, name, phone, kind: "export" })
                if (data.id) {
                    await createDetailBill(data.id)
                } else {
                    TOAST.EROR("Tạo hóa đơn thất bại !");
                }
            }
            setLoading(false)
        } catch (error) {
            TOAST.EROR(error.message)
            setLoading(false)
        }
    }
    const removeData = (item) => {
        let tmp = data;
        tmp = tmp.filter(t => t !== item)
        setData(tmp)
    }
    useEffect(() => {
        fetchRoom();
        fetchMaterial();
        fetchStatus();
    }, [])
    const getVatchatByIdVatchat = (id) => {
        return materials.filter(item => item.id === id)[0]
    }
    const getTypeByValueType = (status) => {
        return statuses.filter(item => item.id === status)[0]
    }
    const getRoomByValueRoom = (room) => {
        return rooms.filter(item => item.id === room)[0].roomName
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
                <div className="row">
                    <div className="col-lg-4 my-2">
                        <FormControl fullWidth size="small">
                            <InputLabel>Phòng</InputLabel>
                            <Select
                                value={room || ""}
                                onChange={e => setRoom(e.target.value)}
                            >
                                {
                                    rooms.map((room, i) => <MenuItem key={i} value={room?.id}>{room?.roomName}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-lg-4 my-2">
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
                    </div>
                    <div className="col-lg-4 my-2">
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
                    </div>
                    <div className="col-lg-4 my-2">
                        <FormControl fullWidth>
                            <TextField value={quantity} onChange={e => setQuantity(e.target.value)} className="hide-spin" type="number" status={"number"} label="Số lượng" variant="outlined" size="small" />
                        </FormControl>
                    </div>
                    <div className="col-lg-4 my-2">
                        <FormControl fullWidth>
                            <TextField value={price} onChange={e => setPrice(e.target.value)} className="hide-spin" type="number" status={"number"} label="Đơn giá" variant="outlined" size="small" />
                        </FormControl>
                    </div>
                    <div className="col-lg-4 my-2">

                        <Grid item md={4} sm={20}>
                            <Box>
                                <Button onClick={handleAdd} variant="contained" endIcon={<AddIcon />} >Thêm</Button>
                            </Box>
                        </Grid>
                    </div>
                </div>
                {data.length > 0 && (
                    <div>
                        <h3>Hóa đơn</h3>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Phòng</th>
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
                                    data.map((item, i) => (
                                        <tr key={i}>
                                            <td>{getRoomByValueRoom(item?.room)}</td>
                                            <td>{(getVatchatByIdVatchat(item?.material).name)}</td>
                                            <td>{getTypeByValueType(item?.status).name}</td>
                                            <td>{item?.quantity}</td>
                                            <td>{(item?.price)} VNĐ</td>
                                            <td>{formatMoney(+item.quantity * item.price)} VNĐ</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <Button variant="text" onClick={() => removeData(item)}><DeleteForeverIcon sx={{ color: pink[500] }} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                <tr className="table-danger">
                                    <td colSpan={3}></td>
                                    <td colSpan={3}>Tổng tiền</td>
                                    <td>{formatMoney(total)} VNĐ</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="row">
                            <div className="col-lg-4 my-2">
                                <FormControl fullWidth>
                                    <TextField value={name} onChange={e => setName(e.target.value)} label="Họ và tên" variant="outlined" size="small" />
                                </FormControl>
                            </div>
                            <div className="col-lg-4 my-2">
                                <FormControl fullWidth>
                                    <TextField value={phone} onChange={e => setPhone(e.target.value)} className="hide-spin" type="number" status={"number"} label="Số điện thoại" variant="outlined" size="small" />
                                </FormControl>
                            </div>
                            <div className="col-lg-4 my-2">
                                <FormControl fullWidth>
                                    <TextField value={address} onChange={e => setAddress(e.target.value)} label="Địa chỉ" variant="outlined" size="small" />
                                </FormControl>
                            </div>
                        </div>
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