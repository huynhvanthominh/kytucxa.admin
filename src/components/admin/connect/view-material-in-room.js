import { Button, FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import PATH from "../../../consts/path";
import { TOAST } from "../../../customs/toast-custom";
import Table from "../../themes/table/table";
import { roomAPI } from "../../../apis/room.api";
import { materialService } from "../../../apis/material.api";
import DangerousIcon from '@mui/icons-material/Dangerous';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Report from "../report/report";
import MoveMaterial from "./move-material";
import { useHistory } from "react-router-dom";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
export default function ViewMaterialInRoom() {
    const title = "Xem chi tiết vật chất trong phòng";
    const [room, setRoom] = useState("");
    const [material, setMaterial] = useState("");
    const [materials, setMaterials] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [detailMaterial, setDetailMaterial] = useState([]);
    const [openReport, setOpenReport] = useState(false);
    const [selected, setSelected] = useState();
    const [openMoveMaterial, setOpenMoveMaterial] = useState(false)
    const history = useHistory();
    const fetchRooms = async () => {
        try {
            const { data } = await roomAPI.getRoomAdmin();
            setRooms(data)
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const fetchMaterials = async () => {
        try {
            const { data } = await materialService.get();
            setMaterials(data)
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const fetchDetailMaterials = async () => {
        try {
            const { data } = await materialService.getAllDetailMaterial(room, +material > 0 ? material : undefined);
            setDetailMaterial(data);
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        if (room) {
            fetchDetailMaterials();
        } else {
            setDetailMaterial([]);
        }

    }, [room, material])

    const fetchData = () => {
        fetchRooms();
        fetchMaterials();
    }

    useEffect(() => {
        fetchData()
    }, [])

    const Filter = () => {
        return (
            <div className="d-flex">
                <Box className="me-2">
                    <FormControl fullWidth size="small">
                        <InputLabel>Phòng</InputLabel>
                        <Select
                            className="min-width-200"
                            label="Phòng"
                            value={room}
                            onChange={e => setRoom(e.target.value)}
                        >
                            {
                                rooms.map((room, i) => <MenuItem key={i} value={room?.id}>{room?.roomName}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl fullWidth size="small">
                        <InputLabel>Vật chất</InputLabel>
                        <Select
                            className="min-width-200"
                            label="Phòng"
                            value={material}
                            onChange={e => setMaterial(e.target.value)}
                        >
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                materials.map((material, i) => <MenuItem key={i} value={material?.id}>{material?.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
            </div>
        )
    }

    return (
        <div>
            <Report open={openReport} material={selected} close={() => setOpenReport(false)} />
            <MoveMaterial open={openMoveMaterial} material={selected} close={() => setOpenMoveMaterial(false)} callback={() => fetchDetailMaterials()} />
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title}</h3>
                </div>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={detailMaterial} hover striped border filter={<Filter />}>
                    {{
                        columns: [
                            {
                                title: "",
                                search: false,
                                data: "qr",
                                className: "justify-content-center",
                                render: (data) => <div className="table-img"><img src={PATH.MATERIAL + data} alt="" /></div>
                            },
                            {
                                title: "Tên vật chất",
                                data: "nameMaterial",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "",
                                data: "id",
                                sort: false,
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
                                            <IconButton onClick={() => {
                                                history.push("/Admin/Detail-Material/View/" + data)
                                            }}>
                                                <RemoveRedEyeIcon color="success" />
                                            </IconButton>
                                            <IconButton onClick={() => {
                                                setSelected(row)
                                                setOpenReport(true)
                                            }}>
                                                <DangerousIcon color="error" />
                                            </IconButton>
                                            <IconButton onClick={() => {
                                                setSelected(row)
                                                setOpenMoveMaterial(true)
                                            }}>
                                                <TrendingUpIcon color="secondary" />
                                            </IconButton>
                                        </div>
                                    );
                                },
                            },
                        ],
                    }}
                </Table>
            </div>
        </div>
    )
}