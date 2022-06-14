import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { areaAPI } from "../../../apis/area.api";
import Table from "../../themes/table/table";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import { pink } from "@mui/material/colors";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { LinkCustom } from "../../../customs/Link.Custom";
import { TOAST } from "../../../customs/toast-custom"
import Alert from "../../../customs/Alert-custom";
import ALERT from "../../../consts/status-alter";
import MESSAGE from "../../../consts/message-alert";

const AreaList = () => {

    const title = "Khu";
    const history = useHistory();
    const [listArea, setListArea] = useState([]);
    const [message, setMessage] = useState("");
    const [isShow, setIsShow] = useState(false)
    const [selected, setSelected] = useState({});

    const getData = async () => {
        try {
            await areaAPI.getListArea({userId: 1}).then(data => {  
                setListArea(data);
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const confirm = (_, row) => {
        setSelected(row.id);
        setMessage(`Có chắc mún xóa "${row.areaName}"`);
        setIsShow(true);
    }
    const handleDelete = async () => {
        try {
            await areaAPI.deleteArea({id: selected}).then(data => {
                if (data) {
                    TOAST.SUCCESS(MESSAGE.DELETE_SUCCESS)
                    getData();
                } else {
                    TOAST.EROR(MESSAGE.DELETE_ERROR)
                }
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    return (
        <div>
            <Alert isShow={isShow} close={() => setIsShow(false)} title={title} confirm={handleDelete} status={ALERT.QUESTION}>{message}</Alert>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title} ({listArea.length})</h3>
                </div>
                <Button className="ms-auto me-1" variant="contained">
                    <LinkCustom color="white" to={"/Admin/Area/Add"}>
                        <AddIcon />
                        Thêm
                    </LinkCustom>
                </Button>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={listArea} hover striped border >
                    {{
                        columns: [
                            {
                                title: "Tên khu",
                                data: "areaName",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Địa chỉ",
                                data: "address",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Số phòng",
                                data: "totalRoom",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Nội dung",
                                data: "content",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Mô tả",
                                data: "description",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
                                            <Button onClick={() => { history.push("/Admin/Area/View/" + data) }} variant="text"><EditIcon color="primary" /></Button>
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

export default AreaList;