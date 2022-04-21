import { Component, OnInit } from '@angular/core';
import { DEFAULT_FORM_FIELDS_CONFIG } from '../../../constants/common-formFields.config';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common-table-columns.config';
import { FormField } from '../../fragments/form-wrapper/interfaces/form-field.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-interests',
  templateUrl: './admin-interests.component.html',
})
export class AdminInterestsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public crudEndPoint = '/v1/interests';

  public exportCsvFileName = 'Mes Centres d\'Intérêts';

  async ngOnInit(): Promise<void> {
    this.columnList = [
      DEFAULT_TABLE_COLUMNS_CONFIG['title'],
      {
        field: 'description', header: 'Description', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        inputType: 'textarea', inputTextareaOptions: { rows: 5 },
        style: 'width: 30%; min-width: 200px;',
      },
      { ...DEFAULT_TABLE_COLUMNS_CONFIG['position'], sortField: true },
      {
        field: 'link', header: 'Lien', exportable: true,
        style: 'width: 40%; min-width: 200px;',
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        DEFAULT_FORM_FIELDS_CONFIG['title'][0],
        DEFAULT_FORM_FIELDS_CONFIG['description'][0],
        DEFAULT_FORM_FIELDS_CONFIG['link'][0],
      ];
    }
  }
}
