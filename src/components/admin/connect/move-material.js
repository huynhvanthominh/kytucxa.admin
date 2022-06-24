import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { TOAST } from '../../../customs/toast-custom';
import { roomAPI } from '../../../apis/room.api';
import { materialService } from '../../../apis/material.api';
import { eventMaterialAPI } from "../../../apis/event-material.api"
const initValue = {
    room: "",
    comment: ""
}

export default function MoveMaterial({ material, open = false, close, maxWidth = "sm", fullWidth = true, callback }) {
    const [value, setValue] = React.useState(initValue)
    const [rooms, setRooms] = React.useState([]);
    const fetchRooms = async () => {
        try {
            const { data } = await roomAPI.getRoomAdmin();
            if(material){
                setRooms(data.filter(item => +item.id !== +material.owner))    
            }else{
                setRooms(data)
            }
         
        } catch (error) {
            TOAST.EROR(error.message)
        }
    }

    React.useEffect(() => {
        fetchRooms();
    }, [material])

    const submit = async () => {
        try {
            if (value.room.length === 0) {
                TOAST.EROR("Vui lòng chọn phòng cần chuyển")
            } else {
                const { data } = await materialService.updateDetailMaterial({ ...material, owner: value.room })
                if (data[0] > 0) {
                    TOAST.SUCCESS("Chuyển thành công !");
                    close();
                    eventMaterialAPI.create({
                        idMaterial: material.id,
                        nameEventMaterial: "moveMaterial",
                        desciptionEvent: value.comment,
                        from: material.owner,
                        to: value.room
                    })
                    if (callback) {
                        callback();
                    }
                } else {
                    TOAST.EROR("Chuyển phòng thất bại")
                }
            }
        } catch (error) {
            TOAST.EROR(error.message);
        }
    }

    return (
        <React.Fragment>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={close}
            >
                <DialogTitle>Di chuyển vật chất</DialogTitle>
                <DialogContent>
                    <Box className='mt-4'>
                        <FormControl fullWidth size="small">
                            <InputLabel>Phòng</InputLabel>
                            <Select
                                value={value.room}
                                onChange={e => setValue({ ...value, room: e.target.value })}
                            >
                                {
                                    rooms.map((room, i) => <MenuItem key={i} value={room?.id}>{room?.roomName}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className='mt-4'>
                        <FormControl fullWidth>
                            <TextField
                                label="Ghi chú"
                                multiline
                                value={value.comment}
                                onChange={e => setValue({
                                    ...value,
                                    comment: e.target.value
                                })}
                                rows={4}
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' color='primary' onClick={submit}>Chuyển</Button>
                    <Button onClick={close} variant='outlined' color='inherit'>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
