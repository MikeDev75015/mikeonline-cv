import { Component, OnInit } from '@angular/core';
import { JOB_TYPE_DROPDOWN_LIST } from '../../../../../core/constants/common.constant';
import { IExperience } from '../../../../../core/interfaces/models/experience.interface';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllExperiences } from '../../../../../core/ngrx/selectors/experiences.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { FormFields } from '../../fragments/form-wrapper/form-wrapper.component';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-esperiences',
  templateUrl: './admin-experiences.component.html',
  styleUrls: ['./admin-experiences.component.scss'],
})
export class AdminExperiencesComponent implements OnInit {
  public data: IExperience[] = [];

  public columnList: TableColumn[] = [
    { field: 'title', header: 'Titre', editable: true, exportable: true, style: 'width: 30%; min-width: 300px;' },
    {
      field: 'beginDate',
      header: 'Date de début',
      editable: true,
      exportable: true,
      style: 'width: 140px; min-width: 140px; max-width: 140px;',
    },
    {
      field: 'endDate',
      header: 'Date de fin',
      editable: true,
      exportable: true,
      style: 'width: 140px; min-width: 140px; max-width: 140px;',
    },
    { field: 'actualJob', header: 'Actuel', style: 'width: 85px; min-width: 85px; max-width: 85px;' },
    {
      field: 'jobType', header: 'Type', editable: true, exportable: true,
      inputType: 'dropdown', list: JOB_TYPE_DROPDOWN_LIST, scrollHeight: '200px',
      style: 'width: 85px; min-width: 85px; max-width: 85px;',
    },
    {
      field: 'society',
      header: 'Société',
      editable: true,
      exportable: true,
      style: 'width: 10%; min-width: 150px; max-width: 200px;',
    },
    {
      field: 'place',
      header: 'Lieu',
      editable: true,
      exportable: true,
      style: 'width: 10%; min-width: 150px; max-width: 200px;',
    },
    { field: 'tagList', header: 'Liste des tags', style: 'width: 20%; min-width: 250px;' },
  ];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/experiences';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<IExperience[]>(
      { selector: selectAllExperiences, defaultValue: [] },
    );

    if (this.crudEndPoint) {
      this.formFields = [
        { name: 'title', label: 'Titre', inputType: 'text' },
        { name: 'beginDate', label: 'Date de début', inputType: 'text' },
        { name: 'endDate', label: 'Date de fin', inputType: 'text' },
        { name: 'jobType', label: 'Type', inputType: 'dropdown', list: JOB_TYPE_DROPDOWN_LIST, scrollHeight: '200px' },
        { name: 'society', label: 'Société', inputType: 'text' },
        { name: 'place', label: 'Lieu', inputType: 'text' },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminExperiencesComponent onTableDataChanges:', event);
  }
}
