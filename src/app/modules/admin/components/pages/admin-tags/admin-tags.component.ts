import { Component, OnInit } from '@angular/core';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllTags } from '../../../../../core/ngrx/selectors/tags.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-tags',
  templateUrl: './admin-tags.component.html',
  styleUrls: ['./admin-tags.component.scss'],
})
export class AdminTagsComponent implements OnInit {
  public data: ITag[] = [];

  public columnList: TableColumn[] = [
    {
      field: 'name', header: 'Nom', editable: true, exportable: true,
      style: 'width: 70%; min-width: 300px;',
    },
    {
      field: 'weight', header: 'Poids', editable: true, inputType: 'number', min: 0.1, max: 9.9, step: 0.1,
      style: 'width: 10%; min-width: 50px; max-width: 120px;',
    },
  ];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/tags';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<ITag[]>(
      { selector: selectAllTags, defaultValue: [] },
    );

    if (this.crudEndPoint) {
      this.formFields = [
        { name: 'name', label: 'Nom', inputType: 'text' },
        { name: 'weight', label: 'Poids', inputType: 'number', min: 0.1, max: 9.9, step: 0.1 },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminTagsComponent onTableDataChanges:', event);
  }
}
