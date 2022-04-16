import { InputWrapperType } from '../../../../interfaces/input-wrapper.type';
import { DropdownWrapperOptions } from '../../dropdown-wrapper/interfaces/dropdown-wrapper-options.interface';
import { InputWrapperCheckboxOptions } from '../../input-wrapper/interfaces/checkbox-options.interface';
import { InputWrapperNumberOptions } from '../../input-wrapper/interfaces/number-options.interface';
import { InputWrapperTextareaOptions } from '../../input-wrapper/interfaces/textarea-options.interface';

export interface FormInputOptions {
  inputType: InputWrapperType;

  fieldLabel: string;

  inputName?: string;

  inputTitle?: string;

  inputPlaceholder?: string;

  inputNumberOptions?: InputWrapperNumberOptions;

  inputTextareaOptions?: InputWrapperTextareaOptions;

  inputCheckboxOptions?: InputWrapperCheckboxOptions;

  dropdownWrapperOptions?: DropdownWrapperOptions;
}
