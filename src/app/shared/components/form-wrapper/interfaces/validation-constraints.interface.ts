type ValueTypes = 'string' | 'number' | 'boolean' | 'list';

export interface ValidationConstraints {
  valueType?: ValueTypes;

  minLength?: number;

  maxLength?: number;

  min?: number;

  max?: number;

  pattern?: RegExp;
}
