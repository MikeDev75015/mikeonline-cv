import { Component, OnInit } from '@angular/core';
import { EXPERTISE_LEVEL_DROPDOWN_LIST, PRIORITY_DROPDOWN_LIST } from '../../../../../core/constants/common.constant';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common.config';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
})
export class AdminSkillsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/skills';

  public exportCsvFileName = 'Mes Compétences';

  public queryAdapter = DEFAULT_TABLE_COLUMNS_CONFIG.tagListQueryAdapter;

  async ngOnInit(): Promise<void> {
    this.columnList = [
      DEFAULT_TABLE_COLUMNS_CONFIG.name,
      {
        field: 'expertiseLevel', header: 'Niveau d\'expertise',
        sortable: true, exportable: true, editable: true,
        inputType: 'dropdown', dropdownWrapperOptions: { list: EXPERTISE_LEVEL_DROPDOWN_LIST },
        style: 'width: 200px; min-width: 200px; max-width: 200px;',
      },
      {
        field: 'priority', header: 'Priorité', sortable: true, exportable: true,
        editable: true, inputType: 'dropdown', dropdownWrapperOptions: { list: PRIORITY_DROPDOWN_LIST },
        style: 'width: 160px; min-width: 160px; max-width: 160px;',
      },
      DEFAULT_TABLE_COLUMNS_CONFIG.startDate,
      DEFAULT_TABLE_COLUMNS_CONFIG.tagList,
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        { field: 'name', fieldLabel: 'Nom', inputType: 'text' },
        {
          field: 'expertiseLevel', fieldLabel: 'Niveau d\'expertise',
          inputType: 'dropdown', dropdownWrapperOptions: { list: EXPERTISE_LEVEL_DROPDOWN_LIST },
        },
        {
          field: 'priority', fieldLabel: 'Priorité',
          inputType: 'dropdown', dropdownWrapperOptions: { list: PRIORITY_DROPDOWN_LIST },
        },
        { field: 'startDate', fieldLabel: 'Date de début', inputType: 'text' },
      ];
    }
  }

  public onTableDataChanges(event: any[]): void {
    console.debug('AdminSkillsComponent onTableDataChanges:', event);
  }
}
