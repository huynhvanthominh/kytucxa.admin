import { useEffect, useState } from "react";
import { materialService } from "../../../apis/material.api";
import Table from "../../themes/table/table";
import { useParams } from "react-router-dom";
import PATH from "../../../consts/path";
import TableDateCustom from "../../../customs/Table-Date-custom";
import { TOAST } from '../../../customs/toast-custom';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Button } from "@mui/material";

const DetailMaterial = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
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
                                    <img src={PATH.MATERIAL + data} alt="" />
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
                            {
                                data: "id",
                                sort: true,
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
                                            <Button onClick={() => { history.push("/Admin/Detail-Material/View/" + data) }} variant="text"><RemoveRedEyeIcon color="primary" /></Button>
                                        </div>
                                    );
                                },
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