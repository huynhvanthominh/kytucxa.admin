/* eslint-disable jsx-a11y/alt-text */
import { Button, Grid, TextField } from "@mui/material";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from "react-router-dom";
import { TOAST } from "../../../customs/toast-custom";
import { areaAPI } from "../../../apis/area.api";
import MESSAGE from "../../../consts/message-alert";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import EditIcon from '@mui/icons-material/Edit';
import Loading from "../../../customs/loading";

const initMaterial = {
    idMaterialType: "",
    name: "",
    media: "",
}

const AreaView = () => {

    const title = "Khu";
    const history = useHistory();
    const { id } = useParams();
    const [area, setArea] = useState(initMaterial);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData();
        
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }, [id]);

    const getData = async () => {
        if(id) {
            await areaAPI.getAreaById({areaId: id}).then(data => {
                setArea(data);
                console.log(data);
            });
        }
    }


    const handleAdd = async () => {
        if(id){
            try {
                if (checkValue()) {
                    await areaAPI.updateArea(area, {id: id}).then(data => {
                        if (data) {
                            TOAST.SUCCESS(MESSAGE.UPDATE_SUCCESS);
                            history.goBack();
                        } else {
                            TOAST.EROR(data.message);
                        }
                    });
                }
            } catch (error) {
                TOAST.EROR(error.message)
            }
        } else{
            try {
                if (checkValue()) {
                    await areaAPI.addArea({
                        ...area,
                        status: 0,
                        userId: 1
                    }).then(data => {
                        if (data) {
                            TOAST.SUCCESS(MESSAGE.ADD_SUCCESS);
                            history.goBack();
                        } else {
                            TOAST.EROR(data.message);
                        }
                    });
                }
            } catch (error) {
                TOAST.EROR(error.message)
            }
        }
    }

    const checkValue = () => {
        if (!area.areaName) {
            TOAST.WARN("Vui l??ng nh???p t??n khu !");
            return false
        }
        if (!area.address) {
            TOAST.WARN("Vui l??ng nh???p ?????a ch??? !");
            return false
        }
        if (!area.totalRoom) {
            TOAST.WARN("Vui l??ng nh???p s??? ph??ng !");
            return false
        }
        if (!area.time) {
            TOAST.WARN("Vui l??ng nh???p th???i gian ????ng m??? c???a !");
            return false
        }
        if (!area.content) {
            TOAST.WARN("Vui l??ng nh???p n???i dung !");
            return false
        }
        if (!area.description) {
            TOAST.WARN("Vui l??ng nh???p m?? t??? !");
            return false
        }
        return true
    }

    return (
        <Loading loading={loading}>
            <div>
            <div className="d-flex align-items-center">
                <div>
                    <h3>{title}</h3>
                </div>
            </div>
            <div className="border-bottom border-primary border-5" />
            <Grid container spacing={4} columns={16} className="py-4">
                <Grid item md={8} sm={16}>
                    <Grid container spacing={2} columns={16}>
                        <Grid item sm={16}>
                            <Box>
                                <FormControl fullWidth>
                                    <TextField value={area?.areaName} onChange={e => setArea({
                                        ...area,
                                        areaName: e.target.value
                                    })} label="T??n khu" variant="standard" />
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item sm={16}>
                            <Box>
                                <FormControl fullWidth>
                                    <TextField value={area?.address} onChange={e => setArea({
                                        ...area,
                                        address: e.target.value
                                    })} label="?????a ch???" variant="standard" />
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item sm={16}>
                            <Box>
                                <FormControl fullWidth>
                                    <TextField value={area?.totalRoom} onChange={e => setArea({
                                        ...area,
                                        totalRoom: e.target.value
                                    })} label="S??? ph??ng" variant="standard" />
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item sm={16}>
                            <Box>
                                <FormControl fullWidth>
                                    <TextField value={area?.time} onChange={e => setArea({
                                        ...area,
                                        time: e.target.value
                                    })} label="Gi??? ????ng c???a" variant="standard" />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={8} sm={16}>
                    <Grid container spacing={5} columns={16}>
                        <Grid item sm={16}>
                            <Box>
                                <FormControl fullWidth>
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="N???i dung"
                                        multiline
                                        rows={3}
                                        value={area?.content}
                                        onChange={e => setArea({
                                            ...area,
                                            content: e.target.value
                                        })}
                                    />
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item sm={16}>
                            <Box>
                                <FormControl fullWidth>
                                    <TextField
                                        label="M?? t???"
                                        multiline
                                        rows={3}
                                        value={area?.description}
                                        onChange={e => setArea({
                                            ...area,
                                            description: e.target.value
                                        })}
                                    />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <div className="d-flex align-items-center">
                {
                    id ? <Button variant="contained" className="me-1" endIcon={<EditIcon />} onClick={() => {handleAdd()}}>C???p nh???t</Button> :
                        <Button variant="contained" className="me-1" endIcon={<AddIcon />} onClick={() => {handleAdd()}}>Th??m</Button>}
                <Button variant="contained" color="inherit" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Tr??? v???</Button>
            </div>
        </div >
        </Loading>
    )
}

export default AreaView;
