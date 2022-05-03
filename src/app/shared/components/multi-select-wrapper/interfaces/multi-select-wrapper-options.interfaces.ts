import { DropdownOption } from '../../dropdown-wrapper/interfaces/dropdown-option.interface';

export interface MultiSelectWrapperOptions {
  sourceEndPoint?: string;

  sourceAdapter: (data: any[]) => DropdownOption[];

  sourceList?: any[];

  list?: DropdownOption[];

  selectedList?: string[];

  selectedAdapter?: (data: any[]) => string[];

  scrollHeight?: string;

  defaultLabel?: string;

  selectionLimit?: number;
}
