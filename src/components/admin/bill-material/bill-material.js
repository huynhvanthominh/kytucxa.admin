import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { billMaterialAPI } from "../../../apis/bill-material.api";
import TableDateCustom from "../../../customs/Table-Date-custom";
import Table from "../../themes/table/table";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { formatMoney } from "../../../helps/formatMoney";
import { Box } from "@mui/system";
import { TOAST } from "../../../customs/toast-custom";

const BillMaterial = () => {
    const title = "Hóa đơn nhập vật chất"
    const [bills, setBills] = useState([]);
    const history = useHistory();
    const [kind, setKind] = useState("")
    const fetchBill = async () => {
        try {
            const { data } = await billMaterialAPI.getAllAdmin();
            setBills(data);
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }
    const fetchBillByKind = async () => {
        try {
            const { data } = await billMaterialAPI.getAllAdminByKind(kind);
            setBills(data);
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }
    useEffect(() => {
        if(kind === ""){
            fetchBill();
        }else{
            fetchBillByKind();
        }
        
    }, [kind])

    const Filter = () => {
        return (
            <Box>
                <FormControl fullWidth size="small">
                    <InputLabel>Loại</InputLabel>
                    <Select
                        className="min-width-200"
                        label="Loại"
                        value={kind}
                        onChange={e => setKind(e.target.value)}
                    >
                        <MenuItem value={""}>Tất cả</MenuItem>
                        <MenuItem value={"import"}>Nhập</MenuItem>
                        <MenuItem value={"export"}>Xuất</MenuItem>
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
                <Table dataSource={bills} hover striped border filter={<Filter />}>
                    {{
                        columns: [
                            {
                                title: "Tổng tiền",
                                data: "total",
                                className: "justify-content-center",
                                render: (data) => formatMoney(data) + " VNĐ"
                            },
                            {
                                title: "Người nhận",
                                data: "name",
                                className: "justify-content-center",
                            },
                            {
                                title: "Số điện thoại",
                                data: "phone",
                                className: "justify-content-center",
                            },
                            {
                                title: "Địa chỉ",
                                data: "address",
                                className: "justify-content-center",
                            },
                            {
                                className: "justify-content-center",
                                title: "Ngày tạo",
                                data: "createdAt",
                                sort: true,
                                render: (data) => <TableDateCustom date={data} />
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
                                            <Button onClick={() => { history.push("/Admin/Bill-Material/" + data) }} variant="text"><RemoveRedEyeIcon color="primary" /></Button>
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

export default BillMaterial;