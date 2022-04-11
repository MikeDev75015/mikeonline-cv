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
    { field: 'name', header: 'Nom' },
    { field: 'weight', header: 'Poids' },
  ];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<ITag[]>(
      { selector: selectAllTags, defaultValue: [] }
    );
  }
}
