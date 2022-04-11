import { Component, OnInit } from '@angular/core';
import { IInterest } from '../../../../../core/interfaces/models/interest.interface';
import { selectAllInterests } from '../../../../../core/ngrx/selectors/interests.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-interests',
  templateUrl: './admin-interests.component.html',
  styleUrls: ['./admin-interests.component.scss'],
})
export class AdminInterestsComponent implements OnInit {
  public data: IInterest[] = [];

  public columnList: TableColumn[] = [
    { field: 'title', header: 'Titre' },
    { field: 'description', header: 'Description' },
  ];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<IInterest[]>(
      { selector: selectAllInterests, defaultValue: [] },
    );
  }
}
