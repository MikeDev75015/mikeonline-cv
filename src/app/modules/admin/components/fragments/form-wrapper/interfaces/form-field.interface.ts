import { FormInput } from './form-input.interface';
import { ValidationField } from './validation-field.interface';

export interface FormField extends FormInput {
  field: string;

  mandatoryField?: boolean;

  validationFieldList?: ValidationField[];

  defaultValue: any;

  isList?: boolean;

  maxItems?: number;

  minItems?: number;

  adapter?: (data: any) => any;

  generator?: (data: any) => any;

  childFormFields?: ChildFormField[];
}

export interface ChildFormField extends FormField {
  isChild?: boolean;
}
