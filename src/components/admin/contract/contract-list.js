import Alert from "../../../customs/Alert-custom";
import ALERT from "../../../consts/status-alter";
import { LinkCustom } from "../../../customs/Link.Custom";
import AddIcon from "@mui/icons-material/Add";
import Table from "../../themes/table/table";
import PATH from "../../../consts/path";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import { TOAST } from "../../../customs/toast-custom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { pink } from "@mui/material/colors";
import { useHistory } from "react-router-dom"
import { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { contractAPI } from "../../../apis/contract.api";
import moment from "moment";
import MESSAGE from "../../../consts/message-alert";


export default function ContractList() {
    const title = "Hợp đồng";
    const history = useHistory();
    const [message, setMessage] = useState("");
    const [isShow, setIsShow] = useState(false)
    const [selected, setSelected] = useState({});
    const [listArea, setListArea] = useState([]);
    const [areaSelected, setAreaSelected] = useState([]);
    const [typeOfRoom, setTypeOfRoom] = useState([]);
    const [typeOfRoomSelected, setTypeOfRoomSelected] = useState([]);
    const [room, setRoom] = useState([]);
    const [roomSelected, setRoomSelected] = useState([]);
    const [contract, setContract] = useState([]);


    const getContractData = async () => {
        try {
            await contractAPI.getContractByArea({ userId: 1 }).then(data => {
                setListArea(data);
                setAreaSelected(-1);
                setTypeOfRoomSelected(-1);
                setRoomSelected(-1);
                const listContract = [];
                data.map(item => {
                    item?.typeofrooms.map(itemType => {
                        itemType.rooms.map(itemRoom => {
                            itemRoom.contracts.map(itemTr => {
                                listContract.push(itemTr)
                            })
                        })
                    })
                })
                setContract(listContract);
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }


    useEffect(() => {
        getContractData();
    }, [])

    useEffect(() => {
        if (areaSelected === -1) {
            const listContract = [];
            listArea.map(item => {
                item?.typeofrooms.map(itemType => {
                    itemType.rooms.map(itemRoom => {
                        itemRoom.contracts.map(itemTr => {
                            listContract.push(itemTr)
                        })
                    })
                })
            })
            setContract(listContract);
            setRoomSelected(-1);
            setTypeOfRoomSelected(-1);
            setTypeOfRoom([]);
            setRoom([]);
        }else{
            const listRoom = [];
            const listType = [];
            const listContract = [];
            listArea.filter(item => item.id === areaSelected.id).map(item => {
                item?.typeofrooms.map(itemType => {
                    listType.push(itemType);
                    itemType.rooms.map(itemRoom => {
                        itemRoom.contracts.map(itemTr => {
                            listContract.push(itemTr)
                        })
                    })
                })
            })
            setTypeOfRoom(listType);
            setContract(listContract);
            setRoomSelected(-1);
            setTypeOfRoomSelected(-1);
        }
    }, [areaSelected])

    useEffect(() => {
        if (typeOfRoomSelected === -1) {
            const listContract = [];
            listArea.map(item => {
                item?.typeofrooms.map(itemType => {
                    itemType.rooms.map(itemRoom => {
                        itemRoom.contracts.map(itemTr => {
                            listContract.push(itemTr)
                        })
                    })
                })
            })         
            setContract(listContract);
            setRoomSelected(-1);
            setRoom([]);
        }else{
            const listRoom = [];
            const listType = [];
            const listContract = [];
            listArea.filter(item => item.id === areaSelected.id).map(item => {
                item?.typeofrooms.filter(item => item.id === typeOfRoomSelected.id).map(itemType => {
                    listType.push(itemType);
                    itemType.rooms.map(itemRoom => {
                        listRoom.push(itemRoom);
                        itemRoom.contracts.map(itemTr => {
                            listContract.push(itemTr)
                        })
                    })
                })
            })
            setRoomSelected(-1);
            setRoom(listRoom);
            setContract(listContract);
        }
    }, [typeOfRoomSelected])

    useEffect(() => {
        if (roomSelected === -1) {
            const listContract = [];
            listArea.map(item => {
                item?.typeofrooms.map(itemType => {
                    itemType.rooms.map(itemRoom => {
                        itemRoom.contracts.map(itemTr => {
                            listContract.push(itemTr)
                        })
                    })
                })
            })         
            setContract(listContract);
        }else{
            const listRoom = [];
            const listType = [];
            const listContract = [];
            listArea.filter(item => item.id === areaSelected.id).map(item => {
                item?.typeofrooms.filter(item => item.id === typeOfRoomSelected.id).map(itemType => {
                    listType.push(itemType);
                    itemType.rooms.filter(item => item.id === roomSelected.id).map(itemRoom => {
                        listRoom.push(itemRoom);
                        itemRoom.contracts.map(itemTr => {
                            listContract.push(itemTr)
                        })
                    })
                })
            })
            setContract(listContract);
        }
    }, [roomSelected])


    const handleDelete = async () => {
        try {
            await contractAPI.deleteContract({ id: selected?.id }).then(data => {
                if (data) {
                    TOAST.SUCCESS(MESSAGE.DELETE_SUCCESS)
                    getContractData();
                } else {
                    TOAST.EROR(MESSAGE.DELETE_ERROR)
                }
            });

        } catch (error) {
            TOAST.EROR(error.message)
        }
    }
    const confirm = async (_, row) => {
        setSelected(row);
        setMessage(`Có chắc muốn xóa mã hợp đồng: "${row.id}" không?`);
        setIsShow(true);
    }
    const Filter = () => {
        return (
            <div className="d-flex">
                <Box>
                    <FormControl fullWidth size="small">
                        <InputLabel>Khu</InputLabel>
                        <Select
                            className="min-width-200"
                            label="Khu"
                            value={areaSelected}
                            onChange={e => setAreaSelected(e.target.value)}
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
                            value={typeOfRoomSelected}
                            onChange={e => setTypeOfRoomSelected(e.target.value)}
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
                            value={roomSelected}
                            onChange={e => setRoomSelected(e.target.value)}
                        >
                            <MenuItem value={-1}>Tất cả</MenuItem>
                            {
                                room.map((r, i) => <MenuItem key={i} value={r}>{r?.roomName}</MenuItem>)
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
                    <h3>{title} ({contract?.length})</h3>
                </div>
                <Button className="ms-auto me-1" variant="contained">
                    <LinkCustom color="white" to={"/Admin/Contract/Add"}>
                        <AddIcon />
                        Thêm
                    </LinkCustom>
                </Button>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={contract} hover striped border filter={<Filter />}>
                    {{
                        columns: [
                            {
                                title: "Mã HĐ",
                                data: "id",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Thời gian vào",
                                data: "dayIn",
                                className: "justify-content-center",
                                sort: true,
                                render: (data, row) => <div><span>{moment(row.dayIn).format("DD-MM-YYYY")}</span></div>
                            },
                            {
                                title: "Thời hạn",
                                data: "duration",
                                className: "justify-content-center",
                                sort: true,
                                render: (data, row) => <div><span>{moment(row.duration).format("DD-MM-YYYY")}</span></div>
                            },
                            {
                                title: "Ngày thanh toán",
                                data: "dateOfPayment",
                                className: "justify-content-center",
                                sort: true,
                                render: (data, row) => <div><span>{moment(row.dateOfPayment).format("DD-MM-YYYY")}</span></div>
                            },
                            {
                                title: "Trạng thái",
                                data: "dateOfPayment",
                                className: "justify-content-center",
                                sort: true,
                                render: (data, row) => <div><span>{row.status === "0" ? "Chưa duyệt" : "Đã duyệt"}</span></div>
                            },
                            {
                                title: "Điều khoản",
                                data: "term",
                                className: "justify-content-center",
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
                                            {/* <Button onClick={() => { history.push("/Admin/Detail-Material/" + data) }} variant="text"><RemoveRedEyeIcon color="success" /></Button> */}
                                            <Button onClick={() => { history.push("/Admin/Contract/Edit/" + data) }} variant="text"><EditIcon color="primary" /></Button>
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