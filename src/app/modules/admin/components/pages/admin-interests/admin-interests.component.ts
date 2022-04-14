import { Component, OnInit } from '@angular/core';
import { IInterest } from '../../../../../core/interfaces/models/interest.interface';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllInterests } from '../../../../../core/ngrx/selectors/interests.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { FormFields } from '../../fragments/form-wrapper/form-wrapper.component';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-interests',
  templateUrl: './admin-interests.component.html',
  styleUrls: ['./admin-interests.component.scss'],
})
export class AdminInterestsComponent implements OnInit {
  public data: IInterest[] = [];

  public columnList: TableColumn[] = [
    { field: 'title', header: 'Titre', editable: true, style: 'width: 30%; min-width: 300px;' },
    {
      field: 'description',
      header: 'Description',
      editable: true,
      inputType: 'textarea',
      rows: 5,
      style: 'width: 30%; min-width: 200px;',
    },
    { field: 'link', header: 'Lien', style: 'width: 40%; min-width: 200px;' },
  ];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/interests';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<IInterest[]>(
      { selector: selectAllInterests, defaultValue: [] },
    );

    if (this.crudEndPoint) {
      this.formFields = [
        { name: 'title', label: 'Titre', inputType: 'text' },
        { name: 'description', label: 'Description', inputType: 'textarea', rows: 5 },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminInterestsComponent onTableDataChanges:', event);
  }
}
