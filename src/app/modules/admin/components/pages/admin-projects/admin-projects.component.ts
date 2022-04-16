import { Component, OnInit } from '@angular/core';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common.config';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
})
export class AdminProjectsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/projects';

  public exportCsvFileName = 'Mes Projets';

  public queryAdapter = DEFAULT_TABLE_COLUMNS_CONFIG.tagListQueryAdapter;

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
        sortable: true, editable: true, exportable: true,
        inputType: 'textarea', inputTextareaOptions: { rows: 3 },
        style: 'width: 10%; min-width: 150px;',
      },
      {
        field: 'position', header: 'Position', sortField: true,
        sortable: true, editable: true,
        inputType: 'number', inputNumberOptions: { min: 0 },
        style: 'width: 10%; min-width: 90px; max-width: 120px;',
      },
      DEFAULT_TABLE_COLUMNS_CONFIG.tagList,
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        { field: 'title', fieldLabel: 'Titre', inputType: 'text' },
        { field: 'subTitle', fieldLabel: 'Sous-titre', inputType: 'text' },
        { field: 'description', fieldLabel: 'Description', inputType: 'textarea', inputTextareaOptions: { rows: 3 } },
        { field: 'subTitle', fieldLabel: 'Sous-titre', inputType: 'number', inputNumberOptions: { min: 0 } },
      ];
    }
  }

  public onTableDataChanges(event: any[]): void {
    console.debug('AdminProjectsComponent onTableDataChanges:', event);
  }
}
