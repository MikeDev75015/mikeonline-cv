import { Component, OnInit } from '@angular/core';
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
    selector: 'app-admin-formations',
    templateUrl: './admin-formations.component.html',
    standalone: false
})
export class AdminFormationsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public editElementLabel = 'Editer la formation';

  public addElementLabel = 'Ajouter une formation';

  public crudEndPoint = '/v1/formations';

  public exportCsvFileName = 'Mes Formations';

  public dataGeneratorList = dataGeneratorListFactory(['tagList']);

  async ngOnInit(): Promise<void> {
    this.columnList = [
      DEFAULT_TABLE_COLUMNS_CONFIG['title'],
      DEFAULT_TABLE_COLUMNS_CONFIG['beginDate'],
      { ...DEFAULT_TABLE_COLUMNS_CONFIG['endDate'], sortField: true, sortOrder: -1 },
      {
        field: 'certificate', header: 'Certificat',
        sortable: true, editable: true, exportable: true, inputType: 'checkbox',
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
          ...DEFAULT_FORM_FIELDS_CONFIG['beginDate'], validationFieldList: [
            getValidationField(ValidationType.pattern, { pattern: partialDatePattern }),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['endDate'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
            getValidationField(ValidationType.pattern, { pattern: partialDatePattern }),
          ],
        },
        { field: 'certificate', inputLabel: 'Certificat', inputType: 'checkbox', defaultValue: false },
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
