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
import { troubleAPI } from "../../../apis/trouble.api";
import { roomAPI } from "../../../apis/room.api";

export default function () {
    const title = "Sự cố";
    const history = useHistory();
    const { path } = useRouteMatch();
    const [message, setMessage] = useState("");
    const [isShow, setIsShow] = useState(false)
    const [selected, setSelected] = useState({});
    const [trouble, setTrouble] = useState([]);
    const [listArea, setListArea] = useState([]);
    const [areaSelected, setAreaSelected] = useState([]);
    const [typeOfRoom, setTypeOfRoom] = useState([]);
    const [typeOfRoomSelected, setTypeOfRoomSelected] = useState([]);
    const [room, setRoom] = useState([]);
    const [roomSelected, setRoomSelected] = useState([]);

    const getDataTrouble = async () => {
        try {
            await troubleAPI.getTrouble({ userId: 1 }).then(data => {
                setListArea(data);
                setAreaSelected(-1);
                setTypeOfRoomSelected(-1);
                setRoomSelected(-1);
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        getDataTrouble();
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
                getDataTrouble();
            } else {
                TOAST.EROR(MESSAGE.DELETE_ERROR)
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        if (areaSelected === -1 && typeOfRoomSelected === -1 && roomSelected === -1) {
            const listRoom = [];
            const listType = [];
            const listTrouble = [];
            listArea.map(item => {
                item?.typeofrooms.map(itemType => {
                    listType.push(itemType);
                    itemType.rooms.map(itemRoom => {
                        listRoom.push(itemRoom);
                        itemRoom.troubles.map(itemTr => {
                            listTrouble.push(itemTr)
                        })
                    })
                })
            })
            console.log(listRoom);
            setTypeOfRoom(listType);
            setRoom(listRoom);
            setTrouble(listTrouble);
        } else if (areaSelected !== -1 && typeOfRoomSelected === -1 && roomSelected === -1) {
            let listRoom = [];
            let listTrouble = [];
            listArea.filter(itemA => itemA.id === areaSelected.id).map(itemAr => {
                itemAr.typeofrooms.map(item => {
                    item.rooms.map(itemT => {
                        listRoom.push(itemT);
                        itemT.troubles.map(itemTr => {
                            listTrouble.push(itemTr);
                        })
                    })
                })
            })
            setRoom(listRoom);
            setTrouble(listTrouble);
        } else if (areaSelected !== -1 && typeOfRoomSelected !== -1 && roomSelected === -1) {
            let listRoom = [];
            let listTrouble = [];
            typeOfRoom.filter(item => item.id === typeOfRoomSelected.id).map(itemT => {
                listRoom.push(itemT);
                itemT.troubles.map(itemTr => {
                    listTrouble.push(itemTr);
                })
            })
            setRoom(listRoom);
            setTrouble(listTrouble);
        }else if(areaSelected === -1 && typeOfRoomSelected !== -1 && roomSelected === -1){

            let listRoom = [];
            let listTrouble = [];
            listArea.map(item => {
                item?.typeofrooms.filter(itemType => itemType.id === typeOfRoomSelected.id).map(itemT => {
                    itemT.rooms.map(itemRoom => {
                        listRoom.push(itemRoom);
                        itemRoom.troubles.map(itemTr => {
                            listTrouble.push(itemTr)
                        })
                    })
                })
            })

            setRoom(listRoom);
            setTrouble(listTrouble);
        }else if(roomSelected !== -1){
            let listTrouble = [];
            room.filter(item => item.id === roomSelected.id).map(itemR => {
                itemR.troubles.map(item => {
                    listTrouble.push(item);
                })
            })
            setTrouble(listTrouble);
        }
    }, [areaSelected, typeOfRoomSelected, roomSelected])

    // useEffect(() => {
    //     if (typeOfRoomSelected === -1) {

    //     } else {

    //     }
    // }, [typeOfRoomSelected])


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
                            }}
                        >
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                typeOfRoom.map((type, i) => <MenuItem key={i} value={type}>{type?.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box className="ms-2">
                    <FormControl fullWidth size="small">
                        <InputLabel>Phòng</InputLabel>
                        <Select
                            className="min-width-200"
                            label="Phòng"
                            defaultValue={"Tất cả"}
                            value={roomSelected}
                            onChange={e => {
                                setRoomSelected(e.target.value)
                            }}
                        >
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                room.map((type, i) => <MenuItem key={i} value={type}>{type?.roomName}</MenuItem>)
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
                    <h3>{title} ({trouble?.length})</h3>
                </div>
                <Button className="ms-auto me-1" variant="contained">
                    <LinkCustom color="white" to={"/Admin/Trouble/Add"}>
                        <AddIcon />
                        Thêm
                    </LinkCustom>
                </Button>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={trouble} hover striped border filter={<FilterKhu />}>
                    {{
                        columns: [
                            {
                                title: "",
                                search: false,
                                data: "media",
                                className: "justify-content-center",
                                render: (data, row) => <div className="table-img"><img src={PATH.URL_SERVER + row.image} alt="" /></div>
                            },
                            {
                                title: "Tên sự cố",
                                data: "name",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Trạng thái",
                                data: "status",
                                className: "justify-content-center",
                                sort: true,
                                render: (data, row) => <div><span>{row.status === "0" ? "Chưa giải quyết" : "Đã giải quyết"}</span></div>
                            },
                            {
                                title: "Ngày tạo",
                                data: "describe",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Mô tả",
                                data: "createdAt",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
                                            <Button onClick={() => { history.push("/Admin/Trouble/View/" + data) }} variant="text"><EditIcon color="primary" /></Button>
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
