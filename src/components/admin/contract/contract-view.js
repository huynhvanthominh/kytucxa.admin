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


export default function ContractView() {
    const { id } = useParams();
    const title = "Chi tiết hợp đồng";
    const history = useHistory();
    const [material, setMaterial] = useState({});
    const [loading, setLoading] = useState(true);

    setTimeout(() => setLoading(false), 500)
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
                                        <TextField size="small" disabled value={material?.name} onChange={e => setMaterial({
                                            ...material,
                                            name: e.target.value
                                        })} label="Họ và tên" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField size="small" disabled value={material?.name} onChange={e => setMaterial({
                                            ...material,
                                            name: e.target.value
                                        })} label="Phòng" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField size="small" disabled value={material?.name} onChange={e => setMaterial({
                                            ...material,
                                            name: e.target.value
                                        })} label="Mã HĐ" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField size="small" disabled value={material?.name} onChange={e => setMaterial({
                                            ...material,
                                            name: e.target.value
                                        })} label="Ngày vào" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField size="small" disabled value={material?.name} onChange={e => setMaterial({
                                            ...material,
                                            name: e.target.value
                                        })} label="Thời hạn" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField size="small" disabled value={material?.name} onChange={e => setMaterial({
                                            ...material,
                                            name: e.target.value
                                        })} label="Ngày thanh toán" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField size="small" disabled value={material?.name} onChange={e => setMaterial({
                                            ...material,
                                            name: e.target.value
                                        })} label="Chỉ số điện" />
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField size="small" disabled value={material?.name} onChange={e => setMaterial({
                                            ...material,
                                            name: e.target.value
                                        })} label="Chỉ số nước" />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={8} sm={16}>
                        <Grid container columns={16}>
                            <Grid item sm={16}>
                                <Box>
                                    <FormControl fullWidth>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Điều khoản:"
                                            multiline
                                            rows={18}
                                            size="small"
                                            disabled
                                        />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <div className="d-flex align-items-center">
                    <Button variant="contained" color="inherit" endIcon={<CloseIcon />} onClick={() => history.goBack()}>Trở về</Button>
                </div>
            </div >
        </Loading>
    )
}
