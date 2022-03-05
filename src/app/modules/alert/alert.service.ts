import {Injectable} from '@angular/core';
import {AlertPopupComponent, DialogData} from './components/alert-popup/alert-popup.component';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  dialogSubscription: Subscription | undefined;

  constructor(
    public readonly dialog: MatDialog
  ) {}

  displayAlertDialog(data: DialogData) {
    const msgParam = this.buildMsgParam(data);
    this.dialog.open(AlertPopupComponent, {
      width: window.innerWidth > 840 ? '600px' : '300px',
      data: {
        title: data.title ? data.title : 'information',
        msg: data.msg,
        msgParam: msgParam,
        actionsList: [],
        closeBtnLabel: data.closeBtnLabel? data.closeBtnLabel : "fermer"
      }
    });
  }

  displayConfirmDialog(data: DialogData) {
    return new Promise<string>(resolve => {
      const msgParam = this.buildMsgParam(data);
      const dialogRef = this.dialog.open(AlertPopupComponent, {
        width: window.innerWidth > 840 ? '600px' : '300px',
        data: {
          title: data.title ? data.title : 'confirmation requise',
          msg: data.msg,
          msgParam: msgParam,
          actionsList: data.actionsList,
          closeBtnLabel: data.closeBtnLabel? data.closeBtnLabel : "fermer"
        }
      });

      this.dialogSubscription = dialogRef.afterClosed().subscribe(action => {
        this.dialogSubscription?.unsubscribe();
        resolve(action);
      });
    });
  }

  buildMsgParam(data: any) {
    switch (data.status) {
      default: return null;
    }
  }
}
