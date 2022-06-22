import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { materialService } from "../../../apis/material.api";
import Table from "../../themes/table/table";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import { pink } from "@mui/material/colors";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useHistory } from "react-router-dom";
import { LinkCustom } from "../../../customs/Link.Custom";
import { TOAST } from "../../../customs/toast-custom"
import Alert from "../../../customs/Alert-custom";
import ALERT from "../../../consts/status-alter";
import MESSAGE from "../../../consts/message-alert";
import PATH from "../../../consts/path";
import { areaAPI } from "../../../apis/area.api";
import { typeOfRoomAPI } from "../../../apis/typeroom.api";

const TypeRoomList = () => {

    const title = "Loại phòng";
    const history = useHistory();
    const [area, setListArea] = useState([]);
    const [areaValue, setAreaValue] = useState(-1)
    const [typeOfRoom, setTypeOfRoom] = useState([])
    const [typeOfRoomBackup, setTypeOfRoomBackup] = useState([])
    const [message, setMessage] = useState("");
    const [isShow, setIsShow] = useState(false)
    const [selected, setSelected] = useState({});

    useEffect(() => {
        getData();
        getTypeOfRoom();
    }, [])

    const getData = async () => {
        try {
            try {
                await areaAPI.getListArea({userId: 1}).then(data => {  
                    setListArea(data);
                });
            } catch (error) {
                TOAST.EROR(error.message)
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const getTypeOfRoom = async () => {
        try {
            try {
                await typeOfRoomAPI.getListTypeofroom({userId: 1}).then(data => {
                    setTypeOfRoom(data);
                    setTypeOfRoomBackup(data);
                });
            } catch (error) {
                TOAST.EROR(error.message)
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    const confirm = (_, row) => {
        setSelected(row);
        setMessage(`Có chắc mún xóa "${row.name}"`);
        setIsShow(true);
    }
    const handleDelete = async () => {
        try {
            const { data } = await materialService.delete(selected?.id);
            if (data.status) {
                TOAST.SUCCESS(MESSAGE.DELETE_SUCCESS)
                getData();
            } else {
                TOAST.EROR(MESSAGE.DELETE_ERROR)
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        let tamp = [];
        if(areaValue === -1){
            tamp = typeOfRoomBackup;
        } else{
            typeOfRoomBackup.map((item, index) => {
                if(item.areaId === areaValue){
                    tamp.push(item);
                }
            })
        }
        setTypeOfRoom(tamp);
    }, [areaValue]);

    const Filter = () => {
        return (
            <Box>
                <FormControl fullWidth size="small">
                    <InputLabel>Khu</InputLabel>
                    <Select
                        className="min-width-200"
                        label="Khu"
                        value={areaValue}
                        onChange={e => setAreaValue(e.target.value)}
                    >
                        <MenuItem value={-1}>Tất cả</MenuItem>
                        {
                            area.map((area, i) => <MenuItem key={i} value={area?.id}>{area?.areaName}</MenuItem>)
                        }
                    </Select>
                </FormControl>
            </Box>
        )
    }


    return (
        <div>
            <Alert isShow={isShow} close={() => setIsShow(false)} title={title} confirm={handleDelete} status={ALERT.QUESTION}>{message}</Alert>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title} ({typeOfRoom.length})</h3>
                </div>
                <Button className="ms-auto me-1" variant="contained">
                    <LinkCustom color="white" to={"/Admin/TypeRoom/Add"}>
                        <AddIcon />
                        Thêm
                    </LinkCustom>
                </Button>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={typeOfRoom} hover striped border filter={<Filter />}>
                    {{
                        columns: [
                            {
                                title: "",
                                search: false,
                                data: 'id',
                                className: "justify-content-center",
                                render: (data, row) => <div className="table-img"><img src={PATH.URL_SERVER + row.imageofrooms[0]?.image} alt="" /></div>
                            },
                            {
                                title: "Tên loại phòng",
                                data: "name",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Diện tích (m2)",
                                data: "stretch",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Số khách",
                                data: "numberOfCustomer",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Đối tượng",
                                data: "typeOfCustomer",
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
                                title: "Giá loại phòng",
                                data: "priceofrooms",
                                className: "justify-content-center",
                                sort: true,
                                render: (data, row) => row.priceofrooms[row.priceofrooms.length - 1].price
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (    
                                        <div className="d-flex justify-content-center">
                                            <Button onClick={() => { history.push("/Admin/TypeRoom/View/" + data) }} variant="text"><EditIcon color="primary" /></Button>
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

export default TypeRoomList;