import { Component, OnInit } from '@angular/core';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common.config';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
})
export class AdminTagsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/tags';

  public exportCsvFileName = 'Tags';

  async ngOnInit(): Promise<void> {
    this.columnList = [
      DEFAULT_TABLE_COLUMNS_CONFIG.name,
      {
        field: 'weight', header: 'Poids', globalFilterField: true, sortable: true, editable: true,
        inputType: 'number', inputNumberOptions: { min: 0.1, max: 9.9, step: 0.1 },
        style: 'width: 120px; min-width: 120px; max-width: 120px;',
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        { field: 'name', fieldLabel: 'Nom', inputType: 'text' },
        {
          field: 'weight', fieldLabel: 'Poids',
          inputType: 'number', inputNumberOptions: { min: 0.1, max: 9.9, step: 0.1 },
        },
      ];
    }
  }

  public onTableDataChanges(event: any[]): void {
    console.debug('AdminTagsComponent onTableDataChanges:', event);
  }
}
