import { Component, OnInit } from '@angular/core';
import { IProject } from '../../../../../core/interfaces/models/project.interface';
import { selectAllProjects } from '../../../../../core/ngrx/selectors/projects.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss'],
})
export class AdminProjectsComponent implements OnInit {
  public data: IProject[] = [];

  public columnList: TableColumn[] = [
    { field: 'title', header: 'Titre' },
    { field: 'subTitle', header: 'Sous-titre' },
    { field: 'description', header: 'Description' },
    { field: 'technoList', header: 'Liste des technos' },
    { field: 'position', header: 'Position' },
  ];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<IProject[]>(
      { selector: selectAllProjects, defaultValue: [] },
    );
  }
}
