import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {AlertPopupComponent} from './components/alert-popup/alert-popup.component';


@NgModule({
  declarations: [AlertPopupComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDialogModule,
    MatDialogModule,
  ],
  entryComponents: [AlertPopupComponent],
  exports: [AlertPopupComponent]
})
export class AlertModule { }
