import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { RippleModule } from 'primeng/ripple';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { LoadingComponent } from '../core/directives/loading/component/loading.component';
import { LoadingDirective } from '../core/directives/loading/loading.directive';
import {
  DynamicComponentLoaderDirective,
} from './directives/dynamic-component-loader/dynamic-component-loader.directive';
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
  DropdownModule,
  MenuModule,
  InputNumberModule,
  InputTextareaModule,
  CheckboxModule,
  OverlayPanelModule,
  PickListModule,
  MultiSelectModule,
];

@NgModule({
  declarations: [
    DateFormatPipe,
    LoadingComponent,
    LoadingDirective,
    DynamicComponentLoaderDirective,
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

    LoadingDirective,
    DynamicComponentLoaderDirective,
  ],
})
export class SharedModule {
}
