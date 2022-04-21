import { DropdownOption } from '../../dropdown-wrapper/interfaces/dropdown-option.interface';

export interface MultiSelectWrapperOptions {
  sourceListEndPoint?: string;

  sourceList?: any[];

  sourceAdapter: (data: any[]) => DropdownOption[];

  list?: DropdownOption[];

  selectedList?: string[];

  selectedAdapter?: (data: any[]) => string[];

  selectedGenerator?: (data: string[]) => any[];

  scrollHeight?: string;

  defaultLabel?: string;

  selectionLimit?: number;
}
