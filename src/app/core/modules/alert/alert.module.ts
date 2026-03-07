import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertPopupComponent } from './components/alert-popup/alert-popup.component';

@NgModule({
  declarations: [AlertPopupComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [AlertPopupComponent],
})
export class AlertModule {
}
