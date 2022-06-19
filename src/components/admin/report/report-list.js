import { useEffect, useState } from "react";
import Table from "../../themes/table/table";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { pink } from "@mui/material/colors";
import { Button } from "@mui/material";
import TableDateCustom from "../../../customs/Table-Date-custom";
import { troubleMaterialAPI } from "../../../apis/trouble-material.api";
import Report from "./report";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
export default function ReportList() {

    const title = "Báo cáo sự cố";
    const [troubles, setTroubles] = useState([]);
    const [openReport, setOpenReport] = useState(false);
    const [selected, setSelected] = useState();
    const fetchTroubles = async () => {
        const { data } = await troubleMaterialAPI.get();
        setTroubles(data);
    }
    const closeReport = () => {
        setSelected()
        setOpenReport(false);
    }
    useEffect(() => {
        fetchTroubles();
    }, []);


    return (
        <div>
            <Report open={openReport} report={selected} close={() => closeReport()} />
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title} ({troubles.length})</h3>
                </div>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={troubles} hover striped>
                    {{
                        columns: [
                            {
                                search: false,
                                title: "#ID",
                                data: "idMaterial",
                                className: "justify-content-center",
                            },
                            {
                                title: "Mô tả",
                                data: "descriptionTroubleMaterial",
                                sort: true,
                                render: (data) => data.length > 50 ? data.substring(0, 47) + "..." : data
                            },
                            {
                                title: "Loại",
                                className: "justify-content-center",
                                data: "label",
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
                                data: "idTroubleMaterial",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-end">
                                            <Button onClick={() => {
                                                setOpenReport(true)
                                                setSelected(row)
                                            }} variant="text"><RemoveRedEyeIcon color="primary" /></Button>
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
