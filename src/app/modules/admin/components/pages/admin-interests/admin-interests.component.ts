import { Component, OnInit } from '@angular/core';
import { IInterest } from '../../../../../core/interfaces/models/interest.interface';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllInterests } from '../../../../../core/ngrx/selectors/interests.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-interests',
  templateUrl: './admin-interests.component.html',
})
export class AdminInterestsComponent implements OnInit {
  public data: IInterest[] = [];

  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/interests';

  public exportCsvFileName = 'Mes Centres d\'Intérêts';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<IInterest[]>(
      { selector: selectAllInterests, defaultValue: [] },
    );

    this.columnList = [
      {
        field: 'title', header: 'Titre', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 30%; min-width: 300px;',
      },
      {
        field: 'description', header: 'Description', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        inputType: 'textarea', inputTextareaOptions: { rows: 5 },
        style: 'width: 30%; min-width: 200px;',
      },
      {
        field: 'link', header: 'Lien', exportable: true,
        style: 'width: 40%; min-width: 200px;',
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        { field: 'title', fieldLabel: 'Titre', inputType: 'text' },
        { field: 'description', fieldLabel: 'Description', inputType: 'textarea', inputTextareaOptions: { rows: 5 } },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminInterestsComponent onTableDataChanges:', event);
  }
}
