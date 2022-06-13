import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Popup({ size = "sm", open, close, title, children, labelConfirm, confirm }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={size}
        onClose={close}
        aria-describedby="alert-dialog-slide-description"
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          {confirm && <Button onClick={confirm} variant="contained">{labelConfirm ? labelConfirm : "Done"}</Button>}
          <Button onClick={close}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
