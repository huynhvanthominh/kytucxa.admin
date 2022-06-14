import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { materialService } from "../../../apis/material.api";
import { materialTypeService } from "../../../apis/material-type.api";
import Table from "../../themes/table/table";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import { pink } from "@mui/material/colors";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";
import { LinkCustom } from "../../../customs/Link.Custom";
import { TOAST } from "../../../customs/toast-custom"
import Alert from "../../../customs/Alert-custom";
import ALERT from "../../../consts/status-alter";
import MESSAGE from "../../../consts/message-alert";
import PATH from "../../../consts/path";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { roomAPI } from "../../../apis/room.api";
import { areaAPI } from "../../../apis/area.api";
import { id } from "date-fns/locale";


const RoomList = () => {

    const title = "Phòng";
    const history = useHistory();
    const { path } = useRouteMatch();
    const [message, setMessage] = useState("");
    const [isShow, setIsShow] = useState(false)
    const [selected, setSelected] = useState({});
    const [listArea, setListArea] = useState([]);
    const [areaSelected, setAreaSelected] = useState([]);
    const [typeOfRoom, setTypeOfRoom] = useState([])
    const [typeOfRoomSelected, setTypeOfRoomSelected] = useState([])
    const [room, setRoom] = useState([])


    const getRoomByUser = async () => {
        try {
            await roomAPI.getRoomByUser({ userId: 1 }).then(data => {
                setListArea(data);
                setAreaSelected(-1);
                setTypeOfRoomSelected(-1);
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        getRoomByUser();
    }, []);

    const confirm = (_, row) => {
        setSelected(row);
        setMessage(`Có chắc muốn xóa "${row.name}"`);
        setIsShow(true);
    }
    const handleDelete = async () => {
        try {
            const { data } = await materialService.delete(selected?.id);
            if (data.status) {
                TOAST.SUCCESS(MESSAGE.DELETE_SUCCESS)
                // getDataRoom();
            } else {
                TOAST.EROR(MESSAGE.DELETE_ERROR)
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        if(areaSelected === -1){
            const listRoom = [];
            const listType = [];
            listArea.map(item => {
                item.typeofrooms.map(itemType => {
                    listType.push(itemType);
                    itemType.rooms.map(itemRoom => {
                        listRoom.push(itemRoom)
                    })
                })
            })
            console.log(listRoom);
            setTypeOfRoom(listType);
            setRoom(listRoom);
        }else{
            const listType = [];
            const listRoom = [];
            listArea.filter(item => item.id === areaSelected.id).map(item => {
                item?.typeofrooms.map(itemType => {
                    listType.push(itemType);
                })
            })
            listType.map(itemType => {
                itemType.rooms.map(itemRoom => {
                    listRoom.push(itemRoom);
                })
            })
            setTypeOfRoomSelected(-1);
            setTypeOfRoom(listType);
            setRoom(listRoom);
        }
    }, [areaSelected])


    const setFilterType = (type) => {
        
    }

    const FilterKhu = () => {
        return (
            <div className="d-flex">
                <Box className="ms-2">
                    <FormControl fullWidth size="small">
                        <InputLabel>Khu</InputLabel>
                        <Select
                            className="min-width-200"
                            label="Khu"
                            defaultValue={"Tất cả"}
                            value={areaSelected}
                            onChange={e => {
                                setAreaSelected(e.target.value)
                            }}
                        >
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                listArea.map((area, i) => <MenuItem key={i} value={area}>{area?.areaName}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box className="ms-2">
                    <FormControl fullWidth size="small">
                        <InputLabel>Loại Phòng</InputLabel>
                        <Select
                            className="min-width-200"
                            label="Loại Phòng"
                            defaultValue={"Tất cả"}
                            value={typeOfRoomSelected}
                            onChange={e => {
                                setTypeOfRoomSelected(e.target.value)
                                setRoom(e.target.value.rooms)
                            }}
                        >
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                typeOfRoom.map((type, i) => <MenuItem key={i} value={type}>{type?.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
            </div>
        )
    }
    

    return (
        <div>
            <Alert isShow={isShow} close={() => setIsShow(false)} title={title} confirm={handleDelete} status={ALERT.QUESTION}>{message}</Alert>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title} ({room?.length})</h3>
                </div>
                <Button className="ms-auto me-1" variant="contained">
                    <LinkCustom color="white" to={"/Admin/Room/Add"}>
                        <AddIcon />
                        Thêm
                    </LinkCustom>
                </Button>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={room} hover striped border filter={<FilterKhu />} >
                    {{
                        columns: [
                            {
                                title: "Tên phòng",
                                data: "roomName",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Ghi chú",
                                data: "note",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
                                            <Button onClick={() => { history.push("/Admin/Room/View/" + data) }} variant="text"><EditIcon color="primary" /></Button>
                                            <Button onClick={() => confirm(data, row)} variant="text"><DeleteForeverIcon sx={{ color: pink[500] }} /></Button>
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

export default RoomList;