import { Component, OnInit } from '@angular/core';
import { JOB_TYPE_DROPDOWN_LIST } from '../../../../../core/constants/common.constant';
import { IExperience } from '../../../../../core/interfaces/models/experience.interface';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllExperiences } from '../../../../../core/ngrx/selectors/experiences.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-esperiences',
  templateUrl: './admin-experiences.component.html',
})
export class AdminExperiencesComponent implements OnInit {
  public data: IExperience[] = [];

  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/experiences';

  public exportCsvFileName = 'Mes Expériences';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<IExperience[]>(
      { selector: selectAllExperiences, defaultValue: [] },
    );

    this.columnList = [
      {
        field: 'title', header: 'Titre', globalFilterField: true, editable: true, exportable: true,
        style: 'width: 30%; min-width: 300px;',
      },
      {
        field: 'beginDate', header: 'Date de début', sortField: true, sortOrder: -1,
        sortable: true, editable: true, exportable: true,
        style: 'width: 164.5px; min-width: 164.5px; max-width: 164.5px;',
      },
      {
        field: 'endDate', header: 'Date de fin',
        sortable: true, editable: true, exportable: true,
        style: 'width: 160px; min-width: 160px; max-width: 160px;',
      },
      { field: 'actualJob', header: 'Actuel', style: 'width: 85px; min-width: 85px; max-width: 85px;' },
      {
        field: 'jobType', header: 'Type', editable: true, exportable: true,
        inputType: 'dropdown', dropdownWrapperOptions: { list: JOB_TYPE_DROPDOWN_LIST, scrollHeight: '200px' },
        style: 'width: 85px; min-width: 85px; max-width: 85px;',
      },
      {
        field: 'society', header: 'Société', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 10%; min-width: 150px; max-width: 200px;',
      },
      {
        field: 'place', header: 'Lieu', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 10%; min-width: 150px; max-width: 200px;',
      },
      {
        field: 'tagList', header: 'Liste des tags', exportable: true,
        overlayPanel: true, style: 'width: 20%; min-width: 250px;',
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        { field: 'title', fieldLabel: 'Titre', inputType: 'text' },
        { field: 'beginDate', fieldLabel: 'Date de début', inputType: 'text' },
        { field: 'endDate', fieldLabel: 'Date de fin', inputType: 'text' },
        {
          field: 'jobType', fieldLabel: 'Type', inputType: 'dropdown', dropdownWrapperOptions: {
            list: JOB_TYPE_DROPDOWN_LIST, scrollHeight: '200px',
          },
        },
        { field: 'society', fieldLabel: 'Société', inputType: 'text' },
        { field: 'place', fieldLabel: 'Lieu', inputType: 'text' },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminExperiencesComponent onTableDataChanges:', event);
  }
}
