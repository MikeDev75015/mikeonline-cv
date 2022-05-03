import { InputWrapperType } from '../../../../modules/admin/interfaces/input-wrapper.type';
import { FormInputOptions } from './form-input-options.interface';

export interface FormInput extends FormInputOptions {
  inputLabel: string;

  inputType: InputWrapperType;
}
