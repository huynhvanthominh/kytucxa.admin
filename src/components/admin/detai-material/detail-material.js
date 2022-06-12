import { useEffect, useState } from "react";
import { materialService } from "../../../apis/material.api";
import Table from "../../themes/table/table";
import { useParams } from "react-router-dom";
import PATH from "../../../consts/path";
import TableDateCustom from "../../../customs/Table-Date-custom";
import { TOAST } from '../../../customs/toast-custom';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const DetailMaterial = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const { id } = useParams();
    const [datas, setDatas] = useState([]);
    const [status, setStatus] = useState("");
    const [statuses, setStatuses] = useState([]);
    const [total, setTotal] = useState([]);

    const fetchStaus = async () => {
        try {
            const { data } = await materialService.getStatus();
            setStatuses(data);
        } catch (error) {

        }
    }

    useEffect(() => { fetchStaus() }, [])

    const getMaterial = async () => {
        const { data } = await materialService.getById(id)
        setTitle(data.name);
    }

    const fetchData = async () => {
        try {
            if (status === "") {
                const { data } = await materialService.getDetailMaterial(id);
                setDatas(data)
                setTotal(data);
            } else {
                const { data } = await materialService.getDetailMaterialByStatus(id, status);
                setDatas(data)
            }

        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    useEffect(() => {
        fetchData();
    }, [id, status])

    useEffect(() => {
        getMaterial();
    }, [id])

    const Filter = () => {
        return (
            <Box>
                <FormControl fullWidth size="small">
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        className="min-width-200"
                        label="Trạng thái"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <MenuItem value={""}>Tất cả</MenuItem>
                        {
                            statuses.map((status, i) => <MenuItem key={i} value={status?.id}>{status?.name}</MenuItem>)
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
                    <h3>Vật chất: {title}</h3>
                </div>
                <div className="ms-auto d-flex flex-wrap">
                    <h3 className="me-4">Tổng: {total.length}</h3>
                    <h3 className="me-4"> Mới: {total.filter(item => item.idStatus === 1).length}</h3>
                    <h3 className="me-4">Đã qua sử dụng: {total.filter(item => item.idStatus === 2).length}</h3>
                    <h3 className="me-4">Đang sử dụng: {total.filter(item => item.idStatus === 3).length}</h3>
                </div>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={datas} hover striped border filter={<Filter />}>
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
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Ngày tạo",
                                data: "createdAt",
                                className: "justify-content-center",
                                sort: true,
                                render: (data) => <TableDateCustom date={data} />
                            },
                            {
                                data: "id",
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