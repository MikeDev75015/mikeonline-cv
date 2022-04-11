import { Component, OnInit } from '@angular/core';
import { ICompetence } from '../../../../../core/interfaces/models/competence.interface';
import { selectAllCompetences } from '../../../../../core/ngrx/selectors/competences.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrls: ['./admin-skills.component.scss'],
})
export class AdminSkillsComponent implements OnInit {
  public data: ICompetence[] = [];

  public columnList: TableColumn[] = [
    { field: 'name', header: 'Nom' },
    { field: 'expertiseLevel', header: 'Niveau d\'expertise' },
    { field: 'priority', header: 'Priorité' },
    { field: 'startDate', header: 'Date de début' },
  ];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<ICompetence[]>(
      { selector: selectAllCompetences, defaultValue: [] },
    );
  }
}
