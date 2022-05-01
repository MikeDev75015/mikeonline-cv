export interface ValidationConstraints {
  valueType?: 'string' | 'number' | 'boolean' | 'list';

  minLength?: number;

  maxLength?: number;

  min?: number;

  max?: number;

  pattern?: RegExp;
}
