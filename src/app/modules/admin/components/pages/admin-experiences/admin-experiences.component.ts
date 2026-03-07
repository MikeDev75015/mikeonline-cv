import { Component, OnInit } from '@angular/core';
import { JOB_TYPE_DROPDOWN_LIST } from '../../../../../core/constants/common.constant';
import {
  getValidationField,
} from '../../../../../shared/components/form-wrapper/constants/validation-field-bundle.constant';
import { FormField } from '../../../../../shared/components/form-wrapper/interfaces/form-field.interface';
import { ValidationType } from '../../../../../shared/components/form-wrapper/interfaces/validation-type.enum';
import { dataGeneratorListFactory } from '../../../constants/common-data-converters.config';
import { partialDatePattern } from '../../../constants/common-date.config';
import { DEFAULT_FORM_FIELDS_CONFIG } from '../../../constants/common-formFields.config';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common-table-columns.config';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
    selector: 'app-admin-experiences',
    templateUrl: './admin-experiences.component.html',
    standalone: false
})
export class AdminExperiencesComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public editElementLabel = 'Editer l\'expérience';

  public addElementLabel = 'Ajouter une expérience';

  public crudEndPoint = '/v1/experiences';

  public exportCsvFileName = 'Mes Expériences';

  public dataGeneratorList = dataGeneratorListFactory(['tagList']);

  async ngOnInit(): Promise<void> {
    this.columnList = [
      DEFAULT_TABLE_COLUMNS_CONFIG['title'],
      DEFAULT_TABLE_COLUMNS_CONFIG['beginDate'],
      { ...DEFAULT_TABLE_COLUMNS_CONFIG['endDate'], sortField: true, sortOrder: -1 },
      {
        field: 'actualJob', header: 'Actuel', editable: true, inputType: 'checkbox',
        style: 'width: 85px; min-width: 85px; max-width: 85px;',
      },
      {
        field: 'jobType', header: 'Type', editable: true, exportable: true,
        inputType: 'dropdown', dropdownWrapperOptions: { list: JOB_TYPE_DROPDOWN_LIST, scrollHeight: '200px' },
        style: 'width: 85px; min-width: 85px; max-width: 85px;',
      },
      DEFAULT_TABLE_COLUMNS_CONFIG['society'],
      DEFAULT_TABLE_COLUMNS_CONFIG['place'],
      DEFAULT_TABLE_COLUMNS_CONFIG['tagList'],
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['title'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['beginDate'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
            getValidationField(ValidationType.pattern, { pattern: partialDatePattern }),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['endDate'], validationFieldList: [
            getValidationField(ValidationType.pattern, { pattern: partialDatePattern }),
          ],
        },
        { field: 'actualJob', inputLabel: 'Actuel', inputType: 'checkbox', defaultValue: false },
        {
          field: 'jobType', inputLabel: 'Type', inputType: 'dropdown', defaultValue: 0, dropdownWrapperOptions: {
            list: JOB_TYPE_DROPDOWN_LIST, scrollHeight: '200px',
          }, mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, { valueType: 'number' }),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['society'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['place'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        DEFAULT_FORM_FIELDS_CONFIG['tagList'],
        DEFAULT_FORM_FIELDS_CONFIG['detailList'],
        DEFAULT_FORM_FIELDS_CONFIG['linkList'],
      ];
    }
  }
}
