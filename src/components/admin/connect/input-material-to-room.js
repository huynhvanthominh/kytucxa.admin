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
    const [rooms, setRooms] = useState([]);
    const [roomsSelected, setRoomsSelected] = useState([]);
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
    const fetchRoom = async () => {
        try {
            const { data } = await roomAPI.getRoomAdmin();
            let tmp = [];
            data.forEach(item => {
                tmp.push({
                    label: item.roomName,
                    value: item.id
                })
            })
            setRooms(tmp);
        } catch (error) {
            setLoading(false);
            TOAST.EROR(error.message);
        }
    }
    const handleAdd = () => { }
    const submit = () => { }
    const removeData = () =>{}
    useEffect(() => {
        fetchRoom();
    })

    return (
        <Loading loading={loading}>
            <div>
                <div className="d-flex align-items-center">
                    <div>
                        <h3>Nhập vật chất</h3>
                    </div>
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
                                <TextField value={quantity} onChange={e => setQuantity(e.target.value)} className="hide-spin" type="number" status={"number"} label="Số lượng" variant="outlined" size="small" />
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid item md={4} sm={20}>
                        <Box>
                            <FormControl fullWidth>
                                <TextField value={price} onChange={e => setPrice(e.target.value)} className="hide-spin" type="number" status={"number"} label="Đơn giá" variant="outlined" size="small" />
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
                                                <td>{(item.material).name}</td>
                                                <td>{(item.status).name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{(item.price)}</td>
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
                                    <td colSpan={3}>Tổng tiền</td>
                                    <td>{formatMoney(total)} VNĐ</td>
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