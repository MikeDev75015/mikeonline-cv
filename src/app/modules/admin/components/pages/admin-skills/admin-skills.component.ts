import { Component, OnInit } from '@angular/core';
import { ICompetence } from '../../../../../core/interfaces/models/competence.interface';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllCompetences } from '../../../../../core/ngrx/selectors/competences.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { FormFields } from '../../fragments/form-wrapper/form-wrapper.component';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrls: ['./admin-skills.component.scss'],
})
export class AdminSkillsComponent implements OnInit {
  public data: ICompetence[] = [];

  public columnList: TableColumn[] = [
    { field: 'name', header: 'Nom', editable: true, style: 'width: 30%; min-width: 300px;' },
    {
      field: 'expertiseLevel', header: 'Niveau d\'expertise', editable: true, inputType: 'number', min: 1, max: 5,
      style: 'width: 170px; min-width: 170px; max-width: 170px;',
    },
    {
      field: 'priority', header: 'Priorité', editable: true, inputType: 'number', min: 1, max: 3,
      style: 'width: 85px; min-width: 85px; max-width: 85px;',
    },
    {
      field: 'startDate', header: 'Date de début', editable: true,
      style: 'width: 140px; min-width: 140px; max-width: 140px;',
    },
    { field: 'tagList', header: 'Liste des tags', style: 'width: 20%; min-width: 250px;' },
  ];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/skills';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<ICompetence[]>(
      { selector: selectAllCompetences, defaultValue: [] },
    );

    if (this.crudEndPoint) {
      this.formFields = [
        { name: 'name', label: 'Nom', inputType: 'text' },
        { name: 'expertiseLevel', label: 'Niveau d\'expertise', inputType: 'number', min: 1, max: 5 },
        { name: 'priority', label: 'Priorité', inputType: 'number', min: 1, max: 3 },
        { name: 'startDate', label: 'Date de début', inputType: 'text' },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminSkillsComponent onTableDataChanges:', event);
  }
}
