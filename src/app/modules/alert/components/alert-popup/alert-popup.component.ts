import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogActions {
  name: string;
  action: string;
}

export interface DialogData {
  title?: string;
  msg: string;
  actionsList?: DialogActions[];
  closeBtnLabel?: string;
}

@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<AlertPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCloseBtn(): void {
    this.dialogRef.close();
  }

  onAction(action: string) {
    this.dialogRef.close(action);
  }

}
