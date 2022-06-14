import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { billMaterialAPI } from "../../../apis/bill-material.api";
import TableDateCustom from "../../../customs/Table-Date-custom";
import Table from "../../themes/table/table";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { formatMoney } from "../../../helps/formatMoney";

const BillInputMaterialToRoom = () => {
    const title = "Hóa đơn nhập vật chất vào phòng"
    const [bills, setBills] = useState([]);
    const history = useHistory();
    const fetchBill = async () => {
        try {
            const { data } = await billMaterialAPI.getAllAdmin();
            setBills(data);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchBill();
    }, [])

    return (
        <div>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title} ({bills.length})</h3>
                </div>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={bills} hover striped border>
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

export default BillInputMaterialToRoom;