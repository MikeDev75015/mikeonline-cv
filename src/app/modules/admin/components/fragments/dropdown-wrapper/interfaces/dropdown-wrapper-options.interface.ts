import { DropdownOption } from './dropdown-option.interface';

export interface DropdownWrapperOptions {
  sourceEndPoint?: string;

  sourceAdapter?: (data: any[]) => DropdownOption[];

  sourceList?: any[];

  list?: DropdownOption[];

  stringList?: string[];

  scrollHeight?: string;
}
