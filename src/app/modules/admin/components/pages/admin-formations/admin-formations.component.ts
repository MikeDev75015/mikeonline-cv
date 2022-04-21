import { Component, OnInit } from '@angular/core';
import { DEFAULT_DATA_GENERATORS } from '../../../constants/common-data-converters.config';
import { DEFAULT_FORM_FIELDS_CONFIG } from '../../../constants/common-formFields.config';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common-table-columns.config';
import { FormField } from '../../fragments/form-wrapper/interfaces/form-field.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-formations',
  templateUrl: './admin-formations.component.html',
})
export class AdminFormationsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public crudEndPoint = '/v1/formations';

  public exportCsvFileName = 'Mes Formations';

  public dataGenerator = (data: any) => {
    if (!data) {
      return;
    }

    if (data.tagList) {
      data = DEFAULT_DATA_GENERATORS.tagListGenerator({ ...data });
    }

    return data;
  };

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
        DEFAULT_FORM_FIELDS_CONFIG['title'][0],
        DEFAULT_FORM_FIELDS_CONFIG['beginDate'][0],
        DEFAULT_FORM_FIELDS_CONFIG['endDate'][0],
        { field: 'certificate', inputLabel: 'Certificat', inputType: 'checkbox', defaultValue: false },
        DEFAULT_FORM_FIELDS_CONFIG['society'][0],
        DEFAULT_FORM_FIELDS_CONFIG['place'][0],
        DEFAULT_FORM_FIELDS_CONFIG['tagList'][0],
        DEFAULT_FORM_FIELDS_CONFIG['detailList'][0],
        DEFAULT_FORM_FIELDS_CONFIG['linkList'][0],
      ];
    }
  }
}
