import { ValidationConstraints } from '../interfaces/validation-constraints.interface';
import { ValidationField } from '../interfaces/validation-field.interface';
import { ValidationMethod } from '../interfaces/validation-method.type';
import { ValidationType } from '../interfaces/validation-type.enum';

const requiredValidation = (value: any, { valueType }: ValidationConstraints): boolean => {
  const isDefined = value !== undefined;
  if (!valueType) {
    return isDefined && value !== '';
  }

  if (valueType === 'list') {
    return isDefined && Array.isArray(value) && value.length > 0;
  }

  if (valueType === 'number' || valueType === 'boolean') {
    return isDefined;
  }

  return isDefined;
};

const maxLengthValidation = (value: string | any[], { maxLength }: ValidationConstraints): boolean => {
  if (maxLength === undefined || maxLength <= 0) {
    throw new Error(`Missing or invalid maxLength constraint!`);
  }
  return value?.length <= maxLength;
};

const minLengthValidation = (value: string | any[], { minLength }: ValidationConstraints): boolean => {
  if (minLength === undefined || minLength <= 0) {
    throw new Error(`Missing or invalid minLength constraint!`);
  }
  return value?.length >= minLength;
};

const maxValidation = (value: number, { max }: ValidationConstraints): boolean => {
  if (max === undefined || max <= 0) {
    throw new Error(`Missing or invalid max constraint!`);
  }
  return value <= max;
};

const minValidation = (value: number, { min }: ValidationConstraints): boolean => {
  if (min === undefined || min < 0) {
    throw new Error(`Missing or invalid min constraint!`);
  }
  return value >= min;
};

const patternValidation = (value: string, { pattern }: ValidationConstraints): boolean => {
  if (pattern === undefined) {
    throw new Error(`Missing or invalid pattern constraint!`);
  }

  return !!value?.match(pattern)?.length;
};

const validationsBundle = new Map<ValidationType, ValidationMethod>([
  [ValidationType.required, requiredValidation],
  [ValidationType.maxLength, maxLengthValidation],
  [ValidationType.minLength, minLengthValidation],
  [ValidationType.max, maxValidation],
  [ValidationType.min, minValidation],
  [ValidationType.pattern, patternValidation],
]);

export const getValidationField = (type: ValidationType, constraints: ValidationConstraints): ValidationField => {
  const validationMethod = validationsBundle.get(type);
  if (!validationMethod) {
    throw new Error(`No validation found for ${type} type!`);
  }

  return { type, method: validationMethod, constraints };
};
