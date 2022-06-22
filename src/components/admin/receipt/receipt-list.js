import Alert from "../../../customs/Alert-custom";
import ALERT from "../../../consts/status-alter";
import { LinkCustom } from "../../../customs/Link.Custom";
import AddIcon from "@mui/icons-material/Add";
import Table from "../../themes/table/table";
import PATH from "../../../consts/path";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { pink } from "@mui/material/colors";
import { useHistory } from "react-router-dom"
import { useEffect, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { receiptAPI } from "../../../apis/receipt.api";
import moment from "moment";
import MESSAGE from "../../../consts/message-alert";
import { TOAST } from "../../../customs/toast-custom"



export default function ReceiptList() {
    const title = "Biên nhận";
    const history = useHistory();
    const [materials, setMaterials] = useState([]);
    const [materialType, setMaterialType] = useState(-1)
    const [materialTypes, setMaterialTypes] = useState([])
    const [message, setMessage] = useState("");
    const [isShow, setIsShow] = useState(false)
    const [selected, setSelected] = useState({});
    const [listReceipt, setListReceipt] = useState([]);


    const getReceipt = async () => {
        await receiptAPI.getBillByArea({userId: 1}).then(data => {
            let listR = [];
            data.map(itemArea => {
                itemArea.typeofrooms.map(itemType => {
                    itemType.rooms.map(itemRoom => {
                        itemRoom.contracts.map(itemCtr => {
                            itemCtr.bills.map(itemBill => {
                                itemBill.receipts.map(itemRe => {
                                    listR.push(itemRe);
                                })
                            })
                        })
                    })
                })
            })
            setListReceipt(listR);
        })
    }
    useEffect(() => {
        getReceipt();
    }, [])

    const handleDelete = async () => {
        try {
            await receiptAPI.deleteReceipt({ id: selected?.id, image: selected?.image }).then(data => {
                if (data) {
                    TOAST.SUCCESS(MESSAGE.DELETE_SUCCESS)
                    getReceipt();
                } else {
                    TOAST.EROR(MESSAGE.DELETE_ERROR)
                }
            });

        } catch (error) {
            TOAST.EROR(error.message)
        }
    }
    const confirm = (_, row) => {
        setSelected(row);
        setMessage(`Có chắc muốn xóa biên nhận có mã: "${row.id}" không?`);
        setIsShow(true);
    }
    return (
        <div>
            <Alert isShow={isShow} close={() => setIsShow(false)} title={title} confirm={handleDelete} status={ALERT.QUESTION}>{message}</Alert>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title} ({listReceipt.length})</h3>
                </div>
                <Button className="ms-auto me-1" variant="contained">
                    <LinkCustom color="white" to={"/Admin/Receipt/Add/"}>
                        <AddIcon />
                        Thêm
                    </LinkCustom>
                </Button>
            </div>
            <div className="border-bottom border-primary border-5" />
            <div className="py-4">
                <Table dataSource={listReceipt} hover striped border>
                    {{
                        columns: [
                            {
                                title: "Mã biên nhận",
                                search: false,
                                data: "id",
                                className: "justify-content-center",
                            },
                            {
                                title: "Hình ảnh",
                                data: "image",
                                className: "justify-content-center",
                                sort: true,
                                render: (data) => <div className="table-img"><img src={PATH.URL_SERVER + data} alt="" /></div>
                            },
                            {
                                title: "Tổng tiền",
                                data: "amountOfMoney",
                                className: "justify-content-center",
                                sort: true,
                            },
                            {
                                title: "Ngày thu",
                                data: "dateOfPayment",
                                className: "justify-content-center",
                                sort: true,
                            render: (data, row) => <div><span>{moment(row.dateOfPayment).format("DD-MM-YYYY")}</span></div>
                            },
                            {
                                title: "Phương thức thanh toán",
                                data: "paymentMethod",
                                className: "justify-content-center",
                                sort: true,
                                render: (data) => <div><span>{data === "0" ? "Thanh toán tiền mặt" : "Chuyển khoản"}</span></div>
                            },
                            {
                                title: "Trạng thái",
                                data: "status",
                                className: "justify-content-center",
                                sort: true,
                                render: (data) => <div><span>{data === "0" ? "Chưa thanh toán" : "Đã thanh toán"}</span></div>
                            },
                            {
                                title: "",
                                data: "id",
                                render: function (data, row) {
                                    return (
                                        <div className="d-flex justify-content-center">
                                            {/* <Button onClick={() => { history.push("/Admin/Detail-Material/" + data) }} variant="text"><RemoveRedEyeIcon color="success" /></Button> */}
                                            <Button onClick={() => { history.push("/Admin/Receipt/View/" + data) }} variant="text"><EditIcon color="primary" /></Button>
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