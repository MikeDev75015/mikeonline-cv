import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { KnobModule } from 'primeng/knob';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DateFormatPipe } from './pipes/date-format.pipe';

const primeNgModules: any[] = [
  KnobModule,
  ChartModule,
  ScrollTopModule,
  InputTextModule,
  PasswordModule,
  TableModule,
  ToastModule,
  ToolbarModule,
  ButtonModule,
  RippleModule,
  DialogModule,
  ConfirmDialogModule,
];

@NgModule({
  declarations: [
    DateFormatPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatIconModule,
    ...primeNgModules,
  ],
  exports: [
    FormsModule,
    TranslateModule,
    MatIconModule,
    ...primeNgModules,

    DateFormatPipe,
  ],
})
export class SharedModule {
}
