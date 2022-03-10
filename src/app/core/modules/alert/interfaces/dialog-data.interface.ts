import { DialogActions } from './dialog-actions.interface';

export interface DialogData {
  title?: string;
  msg: string;
  actionsList?: DialogActions[];
  closeBtnLabel?: string;
}
