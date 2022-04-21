import { InputWrapperType } from '../../../../interfaces/input-wrapper.type';
import { DropdownWrapperOptions } from '../../dropdown-wrapper/interfaces/dropdown-wrapper-options.interface';
import { InputWrapperCheckboxOptions } from '../../input-wrapper/interfaces/checkbox-options.interface';
import { InputWrapperNumberOptions } from '../../input-wrapper/interfaces/number-options.interface';
import { InputWrapperTextareaOptions } from '../../input-wrapper/interfaces/textarea-options.interface';
import {
  MultiSelectWrapperOptions,
} from '../../multi-select-wrapper/interfaces/multi-select-wrapper-options.interfaces';

export interface FormInputOptions {
  inputLabel: string;

  inputType: InputWrapperType;

  inputName?: string;

  inputTitle?: string;

  inputPlaceholder?: string;

  inputNumberOptions?: InputWrapperNumberOptions;

  inputTextareaOptions?: InputWrapperTextareaOptions;

  inputCheckboxOptions?: InputWrapperCheckboxOptions;

  dropdownWrapperOptions?: DropdownWrapperOptions;

  multiSelectWrapperOptions?: MultiSelectWrapperOptions;
}
