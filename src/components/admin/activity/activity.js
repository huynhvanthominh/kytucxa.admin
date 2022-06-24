import { useEffect, useState } from "react";
import Table from "../../themes/table/table";
import TableDateCustom from "../../../customs/Table-Date-custom";
import { eventMaterialAPI } from "../../../apis/event-material.api"
export default function Activity() {
    const title = "Hoạt động";
    const [events, setEvents] = useState([]);
    const fetchEvents = async () => {
        try {
            const { data } = await eventMaterialAPI.get();
            setEvents(data)
            console.log(data);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchEvents();
    }, [])

    

    return (
        <div>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title}</h3>
                </div>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={events} hover striped border>
                    {{
                        columns: [
                            {
                                title: "Tên hoạt động",
                                search: true,
                                data: "nameEvent",
                                className: "justify-content-center",
                            },
                            {
                                title: "Vật chất",
                                search: true,
                                data: "nameMaterial",
                                className: "justify-content-center",
                            },
                            {
                                title: "Từ",
                                search: true,
                                data: "roomFrom",
                                className: "justify-content-center",
                            },
                            {
                                title: "Đến",
                                search: true,
                                data: "roomTo",
                                className: "justify-content-center",
                            },
                            {
                                title: "Thời gian",
                                search: true,
                                data: "createdAt",
                                className: "justify-content-center",
                                render: (data) => <TableDateCustom date={data}/>
                            },
                        ],
                    }}
                </Table>
            </div>
        </div>
    )
}