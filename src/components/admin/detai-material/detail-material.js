import { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { materialService } from "../../../apis/material.api";
import { materialTypeService } from "../../../apis/material-type.api";
import Table from "../../themes/table/table";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import { pink } from "@mui/material/colors";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { LinkCustom } from "../../../customs/Link.Custom";
import { TOAST } from "../../../customs/toast-custom"
import Alert from "../../../customs/Alert-custom";
import ALERT from "../../../consts/status-alter";
import MESSAGE from "../../../consts/message-alert";
import PATH from "../../../consts/path";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TableDateCustom from "../../../customs/Table-Date-custom";

const DetailMaterial = () => {

    const [title, setTitle] = useState("");
    const history = useHistory();
    const { id } = useParams();
    const [datas, setDatas] = useState([]);

    const getMaterial = async () => {
        const { data } = await materialService.getById(id)
        setTitle(data.name);
    }

    const fetchData = async () => {
        try {
            const { data } = await materialService.getDetailMaterial(id);
            setDatas(data)
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        getMaterial();
        fetchData()
    }, [id])

    return (
        <div className="mt-4">
            <div className="d-flex align-items-center">
                <div>
                    <h3>Vật chất: {title}</h3>
                </div>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={datas} hover striped border >
                    {{
                        columns: [
                            {
                                title: "",
                                data: "qr",
                                render: data => <div className="table-img">
                                    <img src={PATH.MATERIAL + data} />
                                </div>
                            },
                            {
                                title: "Tình trạng",
                                data: "status",
                                sort: true,
                            },
                            {
                                title: "Ngày tạo",
                                data: "createdAt",
                                sort: true,
                                render: (data) => <TableDateCustom date={data} />
                            },
                        ],
                        limit: [10, 20, 50, 100, -1]
                    }}
                </Table>
            </div>
        </div>
    )

}

export default DetailMaterial;