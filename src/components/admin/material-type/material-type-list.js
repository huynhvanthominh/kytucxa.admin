import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { LinkCustom } from "../../../customs/Link.Custom";
import Table from "../../themes/table/table";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { pink } from "@mui/material/colors";
import { Button } from "@mui/material";
import { materialTypeService } from "../../../apis/material-type.api"
import Alert from "../../../customs/Alert-custom"
import ALERT from "../../../consts/status-alter"
import MESSAGE from "../../../consts/message-alert"
import { uploadFileService } from "../../../apis/upload-file.api";
import PATH from "../../../consts/path";
import TableDateCustom from "../../../customs/Table-Date-custom";
import { TOAST } from "../../../customs/toast-custom"
const MaterialTypeList = () => {

    const initSelected = {
        id: null,
        name: "",
        media: ""
    }

    const title = "Loại vật chất";
    const history = useHistory();
    const { path } = useRouteMatch();
    const [materialTypes, setMaterialTypes] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [status, setStatus] = useState(ALERT.SUCCESS);
    const [message, setMessage] = useState(MESSAGE.DELETE_SUCCESS);
    const [selected, setSelected] = useState(initSelected);

    const fetchMaterialType = async () => {
        const { data } = await materialTypeService.get();
        setMaterialTypes(data);
    }

    useEffect(() => {
        fetchMaterialType();
    }, []);

    const confirmDelete = (_, row) => {
        setSelected(row)
        setMessage(`Có chắc muốn xóa "${row?.name}"`)
        setStatus(ALERT.QUESTION)
        setIsShow(true);
    }
    const handleDelete = async () => {
        try {
            const { data } = await materialTypeService.delete(selected.id)
            if (data.status) {
                TOAST.SUCCESS(MESSAGE.DELETE_SUCCESS)
                fetchMaterialType();
                uploadFileService.removeImage(selected.media, "materialType")
            } else {
                TOAST.EROR(MESSAGE.DELETE_ERROR)
            }
        } catch (error) {
            console.log(error);
            TOAST.EROR(error.message)
        }
        setSelected(initSelected)
        return false
    }

    return (
        <div className="mt-4">
            <Alert isShow={isShow} title={title} status={status} close={() => setIsShow(false)} confirm={handleDelete} >{message}</Alert>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title} ({materialTypes.length})</h3>
                </div>
                <Button className="ms-auto" variant="contained">
                    <LinkCustom color="white" to={path + "/Add"}>
                        <AddIcon />
                        Thêm
                    </LinkCustom>
                </Button>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={materialTypes} hover striped>
                    {{
                        columns: [
                            {
                                search: false,
                                title: "",
                                data: "media",
                                className: "justify-content-center",
                                render: (data) => <div className="table-img"><img src={PATH.MATERIAL + data} alt="" /></div>
                            },
                            {
                                title: "Tên loại vật chất",
                                data: "name",
                                sort: true,
                            },
                            {
                                title: "Ngày tạo",
                                className: "justify-content-center",
                                data: "createdAt",
                                sort: true,
                                render: (data) => <TableDateCustom date={data} />
                            },
                            {
                                title: "Ngày cập nhật",
                                className: "justify-content-center",
                                data: "updatedAt",
                                sort: true,
                                render: (data) => <TableDateCustom date={data} />
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-end">
                                            <Button onClick={() => { history.push("/Admin/Material-Type/Edit/" + data) }} variant="text"><EditIcon color="primary" /></Button>
                                            <Button onClick={() => confirmDelete(data, row)} variant="text"><DeleteForeverIcon sx={{ color: pink[500] }} /></Button>
                                        </div>
                                    );
                                },
                            },
                        ],
                    }}
                </Table>
            </div >
        </div >
    )
}

export default MaterialTypeList;