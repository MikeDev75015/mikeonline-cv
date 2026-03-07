import { Injectable } from '@angular/core';
import { FormField } from '../interfaces/form-field.interface';
import { ValidationField } from '../interfaces/validation-field.interface';

@Injectable({
  providedIn: 'root',
})
export class FormWrapperService {
  /**
   * isInvalidValue
   * @param value
   * @param isList
   * @private
   */
  private static isInvalidValue(value: any, isList = false): boolean {
    return value === undefined
      || value === ''
      || (typeof value === 'object' && !isList && Object.keys(value).length === 0);
  }

  /**
   * convertValue
   * @param value
   * @param converter
   * @private
   */
  private static convertValue(value: any, converter?: (data: any) => any): any {
    if (converter === undefined || value === undefined) {
      return value;
    }

    return converter(value);
  }

  /**
   * findFormElement
   * @param field
   * @param formFields
   */
  public findFormElement(field: string, formFields: FormField[]): FormField {
    let formElement: FormField;
    formFields.forEach((element: FormField) => {
      if (!formElement && element.field === field) {
        formElement = element;
      } else if (!formElement && element.childFormFields) {
        formElement = this.findFormElement(field, element.childFormFields);
      }
    });

    // @ts-ignore
    return formElement;
  }

  /**
   * getNewElement
   * @param formFields
   */
  public getNewElement(formFields: FormField[]): { [key: string]: any } {
    return this.setFormValues(formFields, undefined, {});

  }

  /**
   * initializeFormValues
   * @param formFieldList
   * @param rowData
   * @private
   */
  public initializeFormValues(formFieldList: FormField[], rowData: { [key: string]: any; }): { [key: string]: any } {
    return this.setFormValues(formFieldList, rowData, { id: rowData['id'] });
  }

  /**
   * convertFormValues
   * @param formFieldList
   * @param formValues
   */
  public convertFormValues(formFieldList: FormField[], formValues: { [key: string]: any; }): { [key: string]: any } {
    return this.generateData(formFieldList, formValues, { id: formValues['id'] });
  }

  /**
   * isValidFormValues
   * @param formFieldList
   * @param formValues
   */
  public isValidFormValues(formFieldList: FormField[], formValues: { [key: string]: any; }): boolean {
    return this.checkValuesValidity(formFieldList, formValues);
  }

  /**
   * setFormValues
   * @param formFieldList
   * @param value
   * @param container
   * @param depth
   * @private
   */
  private setFormValues(formFieldList: FormField[], value: any, container: { [p: string]: any } = {}, depth = 0): { [p: string]: any } {
    formFieldList.forEach((formElement) => {
      const { field, adapter, defaultValue, childFormFields, isList } = formElement;

      if (value === undefined || FormWrapperService.isInvalidValue(value[field], isList)) {
        container[field] = defaultValue;

      } else {
        if (!childFormFields || !childFormFields.length) {
          container[field] = FormWrapperService.convertValue(value[field], adapter);

        } else {
          if (isList) {
            container[field] = value[field].map((eachValue: any) => this.setFormValues(childFormFields, eachValue, {}, depth + 1));

          } else {
            container[field] = this.setFormValues(childFormFields, value[field], {}, depth + 1);
          }
        }
      }
    });

    return container;
  }

  /**
   * generateData
   * @param formFieldList
   * @param value
   * @param container
   * @private
   */
  private generateData(formFieldList: FormField[], value: any, container: { [p: string]: any } = {}): { [p: string]: any } {
    formFieldList.forEach((formElement) => {
      const { field, generator, childFormFields, isList } = formElement;
      if (value === undefined || FormWrapperService.isInvalidValue(value[field], isList)) {
        return;
      }

      if (!childFormFields || !childFormFields.length) {
        container[field] = FormWrapperService.convertValue(value[field], generator);

      } else {
        if (isList) {
          container[field] = value[field].map((eachValue: any) => this.generateData(childFormFields, eachValue, {}));

        } else {
          container[field] = this.generateData(childFormFields, value[field], {});
        }
      }
    });

    return container;
  }

  /**
   * checkValuesValidity
   * @param formFieldList
   * @param value
   * @param parent
   * @private
   */
  private checkValuesValidity(formFieldList: FormField[], value: any, _parent = ''): boolean {
    let isValidValues = true;

    formFieldList.forEach((formElement) => {
      const { field, mandatoryField, validationFieldList, childFormFields, isList } = formElement;

      if (value === undefined || FormWrapperService.isInvalidValue(value[field], isList)) {
        isValidValues = isValidValues && !mandatoryField;

      } else {
        if (validationFieldList && validationFieldList.length) {
          const isValidFieldValue = validationFieldList.reduce((result: boolean, validationField: ValidationField) => {
            const isValid = validationField.method(value[field], validationField.constraints);
            return result && isValid;
          }, true);

          isValidValues = isValidValues && isValidFieldValue;
        }

        if (childFormFields && childFormFields.length) {
          isValidValues = isValidValues && this.checkValuesValidity(childFormFields, value[field], field);
        }
      }
    });
    return isValidValues;
  }
}
