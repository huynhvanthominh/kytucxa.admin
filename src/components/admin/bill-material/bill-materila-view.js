import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { billMaterialAPI } from "../../../apis/bill-material.api";
import TableDateCustom from "../../../customs/Table-Date-custom";
import { TOAST } from "../../../customs/toast-custom";
import Table from "../../themes/table/table";
import { formatMoney } from "../../../helps/formatMoney";

const BillMaterialView = () => {
    const { id } = useParams();
    const [bills, setBills] = useState([]);
    const title = "Chi tiết hóa đơn";
    const fetchBill = async () => {
        try {
            const { data } = await billMaterialAPI.getById(id);
            console.log(data);
            setBills(data)
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }
    useEffect(() => {
        if (id) {
            fetchBill();
        }
    }, [id]);
    return (
        <div className="mt-4">
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title}</h3>
                </div>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={bills} hover striped border>
                    {{
                        columns: [
                            {
                                title: "Tên vật chất",
                                search: false,
                                data: "nameMaterial",
                            },
                            {
                                title: "Tình trạng",
                                data: "status",
                            },
                            {
                                title: "Số lượng",
                                data: "quantity",
                            },
                            {
                                title: "Đơn giá",
                                data: "price",
                                render: (data) => formatMoney(data) + " VNĐ"
                            },
                            {
                                title: "Thành tiền",
                                data: "id",
                                render: (_, row) => formatMoney(+row?.quantity * +row.price) + " VNĐ"
                            },
                            {
                                title: "Ngày tạo",
                                data: "createdAt",
                                render: (data) => <TableDateCustom date={data} />
                            },
                        ],
                    }}
                </Table>
            </div>
        </div>
    )
}

export default BillMaterialView;