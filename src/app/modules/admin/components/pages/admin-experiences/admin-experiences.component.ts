import { Component, OnInit } from '@angular/core';
import { IExperience } from '../../../../../core/interfaces/models/experience.interface';
import { selectAllExperiences } from '../../../../../core/ngrx/selectors/experiences.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-esperiences',
  templateUrl: './admin-experiences.component.html',
  styleUrls: ['./admin-experiences.component.scss'],
})
export class AdminExperiencesComponent implements OnInit {
  public data: IExperience[] = [];

  public columnList: TableColumn[] = [
    { field: 'title', header: 'Titre' },
    { field: 'beginDate', header: 'Date de début' },
    { field: 'endDate', header: 'Date de fin' },
    { field: 'actualJob', header: 'Actuel' },
    { field: 'jobType', header: 'Type' },
    { field: 'society', header: 'Société' },
    { field: 'place', header: 'Lieu' },
  ];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<IExperience[]>(
      { selector: selectAllExperiences, defaultValue: [] },
    );
  }
}
