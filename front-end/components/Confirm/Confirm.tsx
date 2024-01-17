import React, {FC, forwardRef} from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { ConfirmProps } from './types';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const Confirm: FC<ConfirmProps> = (
    { title, description, cancel, confirm, cancelStyle, confirmStyle, object, onCancel, onConfirm, open }
) => {

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onCancel}
            aria-describedby="alert-dialog-slide-description"
        >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={cancelStyle || {}} onClick={() => {onCancel(object)}}>{cancel}</Button>
          <Button sx={confirmStyle || {}} onClick={() => {onConfirm(object)}}>{confirm}</Button>
        </DialogActions>
      </Dialog>
    )
}

export default Confirm;