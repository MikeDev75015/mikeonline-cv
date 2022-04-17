import { FormInputOptions } from './form-inputs-options.interface';

export interface FormFields extends FormInputOptions {
  field: string;
  childFormFieldList?: FormFields[];
}
