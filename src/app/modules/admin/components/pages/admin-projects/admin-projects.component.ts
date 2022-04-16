import { Component, OnInit } from '@angular/core';
import { IProject } from '../../../../../core/interfaces/models/project.interface';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllProjects } from '../../../../../core/ngrx/selectors/projects.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { UtilsService } from '../../../../../shared/services/utils/utils.service';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
})
export class AdminProjectsComponent implements OnInit {
  public data: IProject[] = [];

  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/projects';

  public exportCsvFileName = 'Mes Projets';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    const projects = await this.dataService.getStoreData<IProject[]>(
      { selector: selectAllProjects, defaultValue: [] },
    );

    this.data = UtilsService.sortObjectList(projects, 'asc', 'position', 'number');

    this.columnList = [
      {
        field: 'title', header: 'Titre', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 50%; min-width: 250px;',
      },
      {
        field: 'subTitle', header: 'Sous-titre', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 10%; min-width: 180px;',
      },
      {
        field: 'description', header: 'Description', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        inputType: 'textarea', inputTextareaOptions: { rows: 3 },
        style: 'width: 10%; min-width: 150px;',
      },
      {
        field: 'position', header: 'Position', sortField: true,
        sortable: true, editable: true,
        inputType: 'number', inputNumberOptions: { min: 0 },
        style: 'width: 10%; min-width: 90px; max-width: 120px;',
      },
      { field: 'tagList', header: 'Liste des tags', overlayPanel: true, style: 'width: 20%; min-width: 250px;' },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        { field: 'title', fieldLabel: 'Titre', inputType: 'text' },
        { field: 'subTitle', fieldLabel: 'Sous-titre', inputType: 'text' },
        { field: 'description', fieldLabel: 'Description', inputType: 'textarea', inputTextareaOptions: { rows: 3 } },
        { field: 'subTitle', fieldLabel: 'Sous-titre', inputType: 'number', inputNumberOptions: { min: 0 } },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminProjectsComponent onTableDataChanges:', event);
  }
}
