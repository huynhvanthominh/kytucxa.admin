import { Button, Card, FormControl, Grid, Input, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { materialService } from "../../../apis/material.api";
import { TOAST } from "../../../customs/toast-custom";
import CloseIcon from '@mui/icons-material/Close';
import Loading from "../../../customs/loading";
import PATH from "../../../consts/path";
import { useHistory } from "react-router-dom";
import moment from "moment";

const initValue = {
    createdAt: "",
    id: "",
    idDetailBill: 0,
    nameMaterial: "",
    nameMaterialType: "",
    qr: "",
    status: "",
    updatedAt: "",
}

const DetailMaterialView = () => {

    const { id } = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [detailMaterial, setDetailMaterial] = useState(initValue);
    const fetchDetailMaterial = async () => {
        try {
            const { data } = await materialService.getDetailMaterialById(id);
            if (data) {
                setDetailMaterial(data)
            }
        } catch (error) {
            TOAST.EROR(error.message)
        }
        setLoading(false);
    }
    useEffect(() => {
        if (id) {
            fetchDetailMaterial();
        }
    }, [id])

    return (
        <Loading loading={loading}>
            <div className="mt-4">
                <div className="d-flex align-items-center">
                    <div>
                        <h3>Vật chất: {detailMaterial.nameMaterial}</h3>
                    </div>
                </div>
                <div className="border-bottom border-primary border-5" />
                <Grid container spacing={4} columns={16} className="py-4">
                    <Grid item md={8} sm={16}>
                        <Card className="card-file">
                            <label className="input-file">
                                <img src={PATH.MATERIAL + detailMaterial.qr} />
                            </label>
                        </Card>
                    </Grid>
                    <Grid item md={8} sm={16}>
                        <Grid container spacing={2} columns={16}>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <TextField value={detailMaterial?.nameMaterialType} disabled label="Tên loại vật chất" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={detailMaterial?.nameMaterial} disabled label="Tên vật chất" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={detailMaterial?.status} disabled label="Tình trạng" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField value={moment(detailMaterial.createdAt).format("DD/MM/YYYY HH:mm:ss")} disabled label="Ngày nhập" variant="standard" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <Button variant="contained" color='inherit' className="ms-1" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Thoát</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        </Loading>
    )
}

export default DetailMaterialView;