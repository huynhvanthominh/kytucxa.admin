import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import PATH from "../../../consts/path";
import { TOAST } from "../../../customs/toast-custom";
import Table from "../../themes/table/table";
import { roomAPI } from "../../../apis/room.api";
import { materialService } from "../../../apis/material.api";
import { eventMaterialAPI } from "../../../apis/event-material.api"
export default function Activity() {
    const title = "Hoạt động";
    const [room, setRoom] = useState("");
    const [material, setMaterial] = useState("");
    const [materials, setMaterials] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [events, setEvents] = useState([]);
    const fetchEvents = async () => {
        try {
            const { data } = await eventMaterialAPI.get();
            setEvents(data)
            console.log(data);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchEvents();
    }, [])
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


    const fetchData = () => {
        fetchRooms();
        fetchMaterials();
    }

    useEffect(() => {
        fetchData()
    }, [])

    const Filter = () => {
        return (
            <Box>
                <FormControl fullWidth size="small">
                    <InputLabel>Loại hoạt động</InputLabel>
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
        )
    }


    return (
        <div>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title}</h3>
                </div>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={events} hover striped border filter={<Filter />}>
                    {{
                        columns: [
                            {
                                title: "",
                                search: false,
                                data: "nameEventMaterial",
                                className: "justify-content-center",
                                render: (data) => <div className="table-img"><img src={PATH.MATERIAL + data} alt="" /></div>
                            },
                            {
                                title: "Tinh trạng",
                                data: "nameEventMaterial",
                                className: "justify-content-center",
                                sort: true,
                            },
                        ],
                    }}
                </Table>
            </div>
        </div>
    )
}