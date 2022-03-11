import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DialogData } from '../../interfaces/dialog-data.interface';

@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent {
  /**
   * @ignore
   * @param dialogRef
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<AlertPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  public onCloseBtn(): void {
    this.dialogRef.close();
  }

  public onAction(action: string): void {
    this.dialogRef.close(action);
  }
}
