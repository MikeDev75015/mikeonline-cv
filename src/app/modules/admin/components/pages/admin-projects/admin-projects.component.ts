import { Component, OnInit } from '@angular/core';
import { IProject } from '../../../../../core/interfaces/models/project.interface';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllProjects } from '../../../../../core/ngrx/selectors/projects.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { UtilsService } from '../../../../../shared/services/utils/utils.service';
import { FormFields } from '../../fragments/form-wrapper/form-wrapper.component';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss'],
})
export class AdminProjectsComponent implements OnInit {
  public data: IProject[] = [];

  public columnList: TableColumn[] = [
    { field: 'title', header: 'Titre', editable: true, style: 'width: 50%; min-width: 250px;' },
    { field: 'subTitle', header: 'Sous-titre', editable: true, style: 'width: 10%; min-width: 180px;' },
    {
      field: 'description',
      header: 'Description',
      editable: true,
      inputType: 'textarea',
      rows: 5,
      style: 'width: 10%; min-width: 150px;',
    },
    {
      field: 'position',
      header: 'Position',
      editable: true,
      inputType: 'number',
      style: 'width: 10%; min-width: 90px; max-width: 120px;',
    },
    { field: 'tagList', header: 'Liste des tags', style: 'width: 20%; min-width: 250px;' },
  ];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/projects';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    const projects = await this.dataService.getStoreData<IProject[]>(
      { selector: selectAllProjects, defaultValue: [] },
    );

    this.data = UtilsService.sortObjectList(projects, 'asc', 'position', 'number');

    if (this.crudEndPoint) {
      this.formFields = [
        { name: 'title', label: 'Titre', inputType: 'text' },
        { name: 'subTitle', label: 'Sous-titre', inputType: 'text' },
        { name: 'description', label: 'Description', inputType: 'textarea', rows: 5 },
        { name: 'subTitle', label: 'Sous-titre', inputType: 'number' },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminFormationsComponent onTableDataChanges:', event);
  }
}
