import { FormInputOptions } from './form-input-options.interface';

export interface FormField extends FormInputOptions {
  field: string;

  defaultValue: any;

  isList?: boolean;

  maxItems?: number;

  minItems?: number;

  adapter?: (data: any) => any;

  generator?: (data: any) => any;

  validationFieldBundle?: { [field: string]: (value: any) => boolean };

  childFormFields?: ChildFormField[];
}

export interface ChildFormField extends FormField {
  isChild?: boolean;
}
