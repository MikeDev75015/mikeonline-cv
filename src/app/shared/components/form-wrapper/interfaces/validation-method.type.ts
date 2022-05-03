import { ValidationConstraints } from './validation-constraints.interface';

export type ValidationMethod = (value: any, constraints: ValidationConstraints) => boolean;
