import { DropdownOption } from '../../dropdown-wrapper/interfaces/dropdown-option.interface';

export interface AutoCompleteWrapperOptions {
  sourceProperty?: string;

  sourceEndPoint?: string;

  sourceAdapter?: (data: any[]) => DropdownOption[];

  sourceList?: any[];

  list?: DropdownOption[];

  scrollHeight?: string;
}
