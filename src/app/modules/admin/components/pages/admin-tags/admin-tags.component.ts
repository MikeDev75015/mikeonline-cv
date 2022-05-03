import { Component, OnInit } from '@angular/core';
import {
  getValidationField,
} from '../../../../../shared/components/form-wrapper/constants/validation-field-bundle.constant';
import { FormField } from '../../../../../shared/components/form-wrapper/interfaces/form-field.interface';
import { ValidationType } from '../../../../../shared/components/form-wrapper/interfaces/validation-type.enum';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common-table-columns.config';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
})
export class AdminTagsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public editElementLabel = 'Editer le tag';

  public addElementLabel = 'Ajouter un tag';

  public crudEndPoint = '/v1/tags';

  public exportCsvFileName = 'Tags';

  async ngOnInit(): Promise<void> {
    this.columnList = [
      { ...DEFAULT_TABLE_COLUMNS_CONFIG['name'], sortField: true, style: 'width: 70%; min-width: 200px;' },
      {
        field: 'weight', header: 'Poids', globalFilterField: true, sortable: true, editable: true,
        inputType: 'number', inputNumberOptions: { min: 0.1, max: 9.9, step: 0.1 },
        style: 'width: 30%; min-width: 120px; max-width: 300px;',
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        {
          field: 'name', inputLabel: 'Nom', inputType: 'text', defaultValue: '', mandatoryField: true,
          validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        {
          field: 'weight', inputLabel: 'Poids', defaultValue: 1,
          inputType: 'number', inputNumberOptions: { min: 0.1, max: 9.9, step: 0.1 }, mandatoryField: true,
          validationFieldList: [
            getValidationField(ValidationType.required, { valueType: 'number' }),
            getValidationField(ValidationType.min, { min: 0.1 }),
            getValidationField(ValidationType.max, { max: 9.9 }),
          ],
        },
      ];
    }
  }
}
