import { Component, OnInit } from '@angular/core';
import { JOB_TYPE_DROPDOWN_LIST } from '../../../../../core/constants/common.constant';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common.config';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-experiences',
  templateUrl: './admin-experiences.component.html',
})
export class AdminExperiencesComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/experiences';

  public exportCsvFileName = 'Mes Expériences';

  public queryAdapter = DEFAULT_TABLE_COLUMNS_CONFIG.tagListQueryAdapter;

  async ngOnInit(): Promise<void> {
    this.columnList = [
      DEFAULT_TABLE_COLUMNS_CONFIG.title,
      { ...DEFAULT_TABLE_COLUMNS_CONFIG.beginDate, sortField: true, sortOrder: -1 },
      DEFAULT_TABLE_COLUMNS_CONFIG.endDate,
      { field: 'actualJob', header: 'Actuel', style: 'width: 85px; min-width: 85px; max-width: 85px;' },
      {
        field: 'jobType', header: 'Type', editable: true, exportable: true,
        inputType: 'dropdown', dropdownWrapperOptions: { list: JOB_TYPE_DROPDOWN_LIST, scrollHeight: '200px' },
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
        {
          field: 'jobType', fieldLabel: 'Type', inputType: 'dropdown', dropdownWrapperOptions: {
            list: JOB_TYPE_DROPDOWN_LIST, scrollHeight: '200px',
          },
        },
        { field: 'society', fieldLabel: 'Société', inputType: 'text' },
        { field: 'place', fieldLabel: 'Lieu', inputType: 'text' },
      ];
    }
  }

  public onTableDataChanges(event: any[]): void {
    console.debug('AdminExperiencesComponent onTableDataChanges:', event);
  }
}
