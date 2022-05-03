import {
  PickListWrapperOptions,
} from '../../../../modules/admin/components/fragments/pick-list-wrapper/interfaces/pick-list-wrapper-options.interface';
import {
  AutoCompleteWrapperOptions,
} from '../../auto-complete-wrapper/interfaces/auto-complete-wrapper-options.interface';
import { DropdownWrapperOptions } from '../../dropdown-wrapper/interfaces/dropdown-wrapper-options.interface';
import { InputWrapperCheckboxOptions } from '../../input-wrapper/interfaces/checkbox-options.interface';
import { InputWrapperNumberOptions } from '../../input-wrapper/interfaces/number-options.interface';
import { InputWrapperTextareaOptions } from '../../input-wrapper/interfaces/textarea-options.interface';
import {
  MultiSelectWrapperOptions,
} from '../../multi-select-wrapper/interfaces/multi-select-wrapper-options.interfaces';

export interface FormInputOptions {
  inputName?: string;

  inputTitle?: string;

  inputPlaceholder?: string;

  inputNumberOptions?: InputWrapperNumberOptions;

  inputTextareaOptions?: InputWrapperTextareaOptions;

  inputCheckboxOptions?: InputWrapperCheckboxOptions;

  dropdownWrapperOptions?: DropdownWrapperOptions;

  multiSelectWrapperOptions?: MultiSelectWrapperOptions;

  pickListWrapperOptions?: PickListWrapperOptions;

  autoCompleteWrapperOptions?: AutoCompleteWrapperOptions;
}
