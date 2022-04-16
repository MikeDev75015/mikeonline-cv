import { InputWrapperType } from '../../../../interfaces/input-wrapper.type';
import { DropdownWrapperOptions } from '../../dropdown-wrapper/interfaces/dropdown-wrapper-options.interface';
import { InputWrapperCheckboxOptions } from '../../input-wrapper/interfaces/checkbox-options.interface';
import { InputWrapperNumberOptions } from '../../input-wrapper/interfaces/number-options.interface';
import { InputWrapperTextareaOptions } from '../../input-wrapper/interfaces/textarea-options.interface';
import { PickListWrapperOptions } from '../../pick-list-wrapper/interfaces/pick-list-wrapper-options.interface';

export interface TableColumn {
  field: string;

  header: string;

  style?: string;

  globalFilterField?: boolean;

  sortField?: boolean;

  sortMode?: 'single' | 'multiple';

  sortOrder?: 1 | -1;

  sortable?: boolean;

  editable?: boolean;

  overlayPanel?: boolean;

  exportable?: boolean;

  inputType?: InputWrapperType;

  inputNumberOptions?: InputWrapperNumberOptions;

  inputTextareaOptions?: InputWrapperTextareaOptions;

  inputCheckboxOptions?: InputWrapperCheckboxOptions;

  dropdownWrapperOptions?: DropdownWrapperOptions;

  pickListWrapperOptions?: PickListWrapperOptions;
}
