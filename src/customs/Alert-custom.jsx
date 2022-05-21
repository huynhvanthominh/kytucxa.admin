/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */
import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningIcon from '@mui/icons-material/Warning';
import { yellow, red } from '@mui/material/colors';
import ErrorIcon from '@mui/icons-material/Error';
import ALERT from '../consts/status-alter';
import HelpIcon from '@mui/icons-material/Help';
import CheckIcon from '@mui/icons-material/Check';
import LoadingButton from '@mui/lab/LoadingButton';
import { LinearProgress } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other} >
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

Alert.propTypes = {
    title: PropTypes.string,
    isShow: PropTypes.bool,
    status: PropTypes.string,
    close: PropTypes.func,
    confirm: PropTypes.any,
    children: PropTypes.node
}

function Alert({ title, isShow = false, status, close, confirm, children }) {

    const [loadding, setLoadding] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(confirm ? true : false);
    const [progress, setProgress] = React.useState(0);
    const [timeClose, setTimeClose] = React.useState(false)
    const Icon = () => {
        switch (status) {
            case ALERT.SUCCESS:
                return <CheckCircleOutlineIcon color="success" sx={{
                    fontSize: 40,
                    marginLeft: "1rem"
                }} />
            case ALERT.WARNING:
                return <WarningIcon sx={{
                    fontSize: 40,
                    marginLeft: "1rem",
                    color: yellow[600]
                }} />
            case ALERT.ERROR:
                return <ErrorIcon sx={{
                    fontSize: 40,
                    marginLeft: "1rem",
                    color: red[600]
                }} />
            case ALERT.QUESTION:
                return <HelpIcon color="primary" sx={{
                    fontSize: 40,
                    marginLeft: "1rem",
                }} />
            default: return
        }
    }

    React.useEffect(() => {
        setLoadding(false)
        setShowConfirm(confirm ? true : false)
        setProgress(0)
        setTimeClose(false)
    }, [isShow])

    return (
        <div>
            <BootstrapDialog
                onClose={close}
                aria-labelledby="customized-dialog-title"
                open={isShow}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={close}>
                    {title ? title : "Ký túc xá"}
                    {timeClose && <LinearProgress value={progress} variant="determinate" />}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <div className='d-flex align-items-center'>
                        {children}
                        {status && <Icon />}
                    </div>
                </DialogContent>
                <DialogActions>
                    {
                        showConfirm && <LoadingButton loading={loadding} variant='contained' onClick={() => {
                            confirm();
                            close();
                        }} endIcon={<CheckIcon />}>
                            Confirm
                        </LoadingButton>
                    }
                    <Button variant='contained' color='inherit' onClick={close} endIcon={<CloseIcon />}>
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}

export default Alert