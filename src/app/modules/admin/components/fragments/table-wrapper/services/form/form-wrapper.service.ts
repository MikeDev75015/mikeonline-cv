import { Injectable } from '@angular/core';
import { FormField } from '../../../form-wrapper/interfaces/form-field.interface';

@Injectable({
  providedIn: 'root',
})
export class FormWrapperService {
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

      if (
        value === undefined || value[field] === undefined
        || (
          typeof value[field] === 'object'
          && (!isList && Object.keys(value[field]).length === 0) || (isList && value[field].length === 0)
        )
      ) {
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
      if (
        value === undefined || value[field] === undefined
        || (
          typeof value[field] === 'object'
          && (!isList && Object.keys(value[field]).length === 0) || (isList && value[field].length === 0)
        )
      ) {
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
}
