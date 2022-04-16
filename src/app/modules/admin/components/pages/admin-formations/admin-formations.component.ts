import { Component, OnInit } from '@angular/core';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common.config';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-formations',
  templateUrl: './admin-formations.component.html',
})
export class AdminFormationsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/formations';

  public exportCsvFileName = 'Mes Formations';

  public queryAdapter = DEFAULT_TABLE_COLUMNS_CONFIG.tagListQueryAdapter;

  async ngOnInit(): Promise<void> {
    this.columnList = [
      DEFAULT_TABLE_COLUMNS_CONFIG.title,
      DEFAULT_TABLE_COLUMNS_CONFIG.beginDate,
      { ...DEFAULT_TABLE_COLUMNS_CONFIG.endDate, sortField: true, sortOrder: -1 },
      {
        field: 'certificate', header: 'Certificat',
        sortable: true, editable: true, exportable: true, inputType: 'checkbox',
        style: 'width: 85px; min-width: 85px; max-width: 85px;',
      },
      DEFAULT_TABLE_COLUMNS_CONFIG.society,
      DEFAULT_TABLE_COLUMNS_CONFIG.place,
      DEFAULT_TABLE_COLUMNS_CONFIG.tagList,
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        { field: 'title', fieldLabel: 'Titre', inputType: 'text' },
        { field: 'beginDate', fieldLabel: 'Date de début', inputType: 'text' },
        { field: 'endDate', fieldLabel: 'Date de fin', inputType: 'text' },
        { field: 'certificate', fieldLabel: 'Certificat', inputType: 'checkbox' },
        { field: 'society', fieldLabel: 'Société', inputType: 'text' },
        { field: 'place', fieldLabel: 'Lieu', inputType: 'text' },
      ];
    }
  }

  public onTableDataChanges(event: any[]): void {
    console.debug('AdminFormationsComponent onTableDataChanges:', event);
  }
}
