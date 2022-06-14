/* eslint-disable jsx-a11y/alt-text */
import { Button, Card, CircularProgress, Grid, Input, MenuItem, Select, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from "react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Loading from "../../../customs/loading";
import { materialTypeService } from "../../../apis/material-type.api";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import { TOAST } from "../../../customs/toast-custom";
import { LoadingButton } from "@mui/lab";
import { uploadFileService } from "../../../apis/upload-file.api";
import { materialService } from "../../../apis/material.api";
import MESSAGE from "../../../consts/message-alert";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import EditIcon from '@mui/icons-material/Edit';
import { areaAPI } from "../../../apis/area.api";
import { typeOfRoomAPI } from "../../../apis/typeroom.api";
import { roomAPI } from "../../../apis/room.api";
import Table from "../../themes/table/table";

const initMaterial = {
    idMaterialType: "",
    name: "",
    media: "",
}

const RoomMaterial = () => {

    const title = "Phòng";
    const history = useHistory();
    const { id } = useParams();
    const [image, setImage] = useState("")
    const [file, setFile] = useState();
    const [loadingImage, setLoadingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false)
    const [listArea, setListArea] = useState([]);
    const [listTypeOfRoom, setListTypeOfRoom] = useState([]);
    const [areaSelected, setAreaSelected] = useState({ areaName: '' });
    const [typeOfRoomSelected, setTypeOfRoomSelected] = useState({ name: '' });
    const [room, setRoom] = useState({});
    useEffect(() => {
        if (id) {
            getRoomById();
        }
    }, [id])
    const getRoomById = async () => {
        try {
            await roomAPI.getRoomById({ id: id }).then(data => {
                setRoom(data);
            });
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }


    return (
        <Loading loading={loading}>
            <div>
                <div className="d-flex align-items-center">
                    <div>
                        <h3>{title}{room?.roomName && ": " + room.roomName}</h3>
                    </div>
                </div>
                <div className="border-bottom border-primary border-5" />
                <div className="py-4">
                    <Table dataSource={[]} hover striped border>
                        {{
                            columns: [
                                {
                                    title: "Tên vật chất",
                                    data: "total",
                                    className: "justify-content-center",
                                },
                                {
                                    title: "Tình trạng",
                                    data: "name",
                                    className: "justify-content-center",
                                },
                                {
                                    title: "Số lượng",
                                    data: "phone",
                                    className: "justify-content-center",
                                },
                            ],
                        }}
                    </Table>
                </div>
            </div >
        </Loading>
    )
}

export default RoomMaterial;
