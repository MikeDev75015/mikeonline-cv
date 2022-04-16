import { Component, OnInit } from '@angular/core';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllTags } from '../../../../../core/ngrx/selectors/tags.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
})
export class AdminTagsComponent implements OnInit {
  public data: ITag[] = [];

  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/tags';

  public exportCsvFileName = 'Tags';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<ITag[]>(
      { selector: selectAllTags, defaultValue: [] },
    );

    this.columnList = [
      {
        field: 'name', header: 'Nom', sortField: true, globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 70%; min-width: 300px;',
      },
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

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminTagsComponent onTableDataChanges:', event);
  }
}
