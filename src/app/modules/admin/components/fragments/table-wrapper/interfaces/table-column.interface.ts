import { FormField } from '../../../../../../shared/components/form-wrapper/interfaces/form-field.interface';
import {
  FormInputOptions,
} from '../../../../../../shared/components/form-wrapper/interfaces/form-input-options.interface';
import { InputWrapperType } from '../../../../interfaces/input-wrapper.type';

export interface TableColumn extends FormInputOptions {
  field: string;

  header: string;

  style?: string;

  globalFilterField?: boolean;

  sortField?: boolean;

  sortMode?: 'single' | 'multiple';

  sortOrder?: 1 | -1;

  sortable?: boolean;

  exportable?: boolean;

  editable?: boolean;

  inputType?: InputWrapperType;

  overlayPanelTitle?: string;

  formFields?: FormField[];

  adapter?: (data: any) => any;

  generator?: (data: any) => any;
}
