import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
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

import { AutoCompleteWrapperComponent } from './components/auto-complete-wrapper/auto-complete-wrapper.component';
import { DropdownWrapperComponent } from './components/dropdown-wrapper/dropdown-wrapper.component';
import { FormWrapperComponent } from './components/form-wrapper/form-wrapper.component';
import { InputCheckboxComponent } from './components/input-wrapper/input-checkbox/input-checkbox.component';
import { InputNumberComponent } from './components/input-wrapper/input-number/input-number.component';
import { InputPasswordComponent } from './components/input-wrapper/input-password/input-password.component';
import { InputTextComponent } from './components/input-wrapper/input-text/input-text.component';
import { InputTextareaComponent } from './components/input-wrapper/input-textarea/input-textarea.component';
import { InputWrapperComponent } from './components/input-wrapper/input-wrapper.component';
import { MultiSelectWrapperComponent } from './components/multi-select-wrapper/multi-select-wrapper.component';
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
  AutoCompleteModule,
];

const sharedComponents: any[] = [
  LoadingComponent,
  InputWrapperComponent,
  DropdownWrapperComponent,
  FormWrapperComponent,
  InputTextComponent,
  InputPasswordComponent,
  InputNumberComponent,
  InputTextareaComponent,
  InputCheckboxComponent,
  MultiSelectWrapperComponent,
  AutoCompleteWrapperComponent,
];

@NgModule({
  declarations: [
    LoadingDirective,
    DynamicComponentLoaderDirective,

    DateFormatPipe,
    ...sharedComponents,
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

    LoadingDirective,
    DynamicComponentLoaderDirective,

    DateFormatPipe,
    ...sharedComponents,
  ],
})
export class SharedModule {
}
