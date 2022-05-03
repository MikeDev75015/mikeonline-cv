import { ValidationConstraints } from './validation-constraints.interface';
import { ValidationMethod } from './validation-method.type';

export interface ValidationField {
  type: string;

  method: ValidationMethod;

  constraints: ValidationConstraints;

  errorMessage?: string;
}
