import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {AlertPopupComponent, DialogData} from './components/alert-popup/alert-popup.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  dialogSubscription: Subscription | undefined;

  constructor(
    public readonly dialog: MatDialog
  ) {}

  public displayAlertDialog(data: DialogData): void {
    this.dialog.open(AlertPopupComponent, {
      width: window.innerWidth > 840 ? '600px' : '300px',
      data: {
        title: data.title || 'information',
        msg: data.msg,
        actionsList: [],
        closeBtnLabel: data.closeBtnLabel || undefined,
      }
    });
  }

  public displayConfirmDialog(data: DialogData): Promise<string> {
    return new Promise<string>(resolve => {
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        width: window.innerWidth > 840 ? '600px' : '300px',
        data: {
          title: data.title || 'confirmation requise',
          msg: data.msg,
          actionsList: data.actionsList,
          closeBtnLabel: data.closeBtnLabel || undefined,
        }
      });

      this.dialogSubscription = dialogRef.afterClosed().subscribe(action => {
        this.dialogSubscription?.unsubscribe();
        resolve(action);
      });
    });
  }
}
