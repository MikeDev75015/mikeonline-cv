import { Component, OnInit } from '@angular/core';
import {
  getValidationField,
} from '../../../../../shared/components/form-wrapper/constants/validation-field-bundle.constant';
import { FormField } from '../../../../../shared/components/form-wrapper/interfaces/form-field.interface';
import { ValidationType } from '../../../../../shared/components/form-wrapper/interfaces/validation-type.enum';
import { dataGeneratorListFactory } from '../../../constants/common-data-converters.config';
import { partialDatePattern } from '../../../constants/common-date.config';
import {
  DEFAULT_CHILD_FORM_FIELDS_CONFIG,
  DEFAULT_FORM_FIELDS_CONFIG,
} from '../../../constants/common-formFields.config';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common-table-columns.config';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
    selector: 'app-admin-projects',
    templateUrl: './admin-projects.component.html',
    standalone: false
})
export class AdminProjectsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public editElementLabel = 'Editer le projet';

  public addElementLabel = 'Ajouter un projet';

  public crudEndPoint = '/v1/projects';

  public exportCsvFileName = 'Mes Projets';

  public dataGeneratorList = dataGeneratorListFactory(['tagList']);

  async ngOnInit(): Promise<void> {
    this.columnList = [
      {
        field: 'title', header: 'Titre', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 50%; min-width: 250px;',
      },
      {
        field: 'subTitle', header: 'Sous-titre', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 10%; min-width: 180px;',
      },
      {
        field: 'description', header: 'Description', globalFilterField: true,
        editable: true, exportable: true,
        inputType: 'textarea', inputTextareaOptions: { rows: 3 },
        style: 'width: 10%; min-width: 150px;',
      },
      { ...DEFAULT_TABLE_COLUMNS_CONFIG['position'], sortField: true },
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
          ...DEFAULT_FORM_FIELDS_CONFIG['subTitle'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['createdDate'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.pattern, { pattern: partialDatePattern }),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['tagList'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
            getValidationField(ValidationType.minLength, { minLength: 1 }),
          ],
        },
        DEFAULT_FORM_FIELDS_CONFIG['description'],
        DEFAULT_FORM_FIELDS_CONFIG['link'],
        {
          field: 'pictureList', inputLabel: 'Les images', inputType: 'form', defaultValue: [], isList: true,
          childFormFields: DEFAULT_CHILD_FORM_FIELDS_CONFIG['image'],
        },
      ];
    }
  }
}
