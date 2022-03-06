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
    const msgParam = this.buildMsgParam(data);
    this.dialog.open(AlertPopupComponent, {
      width: window.innerWidth > 840 ? '600px' : '300px',
      data: {
        title: data.title || 'information',
        msg: data.msg,
        msgParam: msgParam,
        actionsList: [],
        closeBtnLabel: data.closeBtnLabel || 'fermer',
      }
    });
  }

  public displayConfirmDialog(data: DialogData): Promise<string> {
    return new Promise<string>(resolve => {
      const msgParam = this.buildMsgParam(data);
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        width: window.innerWidth > 840 ? '600px' : '300px',
        data: {
          title: data.title || 'confirmation requise',
          msg: data.msg,
          msgParam: msgParam,
          actionsList: data.actionsList,
          closeBtnLabel: data.closeBtnLabel || 'fermer',
        }
      });

      this.dialogSubscription = dialogRef.afterClosed().subscribe(action => {
        this.dialogSubscription?.unsubscribe();
        resolve(action);
      });
    });
  }

  buildMsgParam(data: DialogData): any {
    console.warn('AlertService buildMsgParam data:', data);
    return {};
  }
}
