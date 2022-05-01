import { Component, OnInit } from '@angular/core';
import {
  DEFAULT_CHILD_FORM_FIELDS_CONFIG,
  DEFAULT_FORM_FIELDS_CONFIG,
} from '../../../constants/common-formFields.config';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common-table-columns.config';
import { getValidationField } from '../../fragments/form-wrapper/constants/validation-field-bundle.constant';
import { FormField } from '../../fragments/form-wrapper/interfaces/form-field.interface';
import { ValidationType } from '../../fragments/form-wrapper/interfaces/validation-type.enum';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-interests',
  templateUrl: './admin-interests.component.html',
})
export class AdminInterestsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public editElementLabel = 'Editer le centre d\'intérêt';

  public addElementLabel = 'Ajouter un centre d\'intérêt';

  public crudEndPoint = '/v1/interests';

  public exportCsvFileName = 'Mes Centres d\'Intérêts';

  async ngOnInit(): Promise<void> {
    this.columnList = [
      DEFAULT_TABLE_COLUMNS_CONFIG['title'],
      {
        field: 'description', header: 'Description', globalFilterField: true,
        editable: true, exportable: true,
        inputType: 'textarea', inputTextareaOptions: { rows: 5 },
        style: 'width: 30%; min-width: 200px;',
      },
      { ...DEFAULT_TABLE_COLUMNS_CONFIG['position'], sortField: true },
      {
        field: 'link', header: 'Lien', exportable: true,
        style: 'width: 40%; min-width: 200px;',
        formFields: DEFAULT_CHILD_FORM_FIELDS_CONFIG['link'],
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['title'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['description'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        DEFAULT_FORM_FIELDS_CONFIG['link'],
      ];
    }
  }
}
