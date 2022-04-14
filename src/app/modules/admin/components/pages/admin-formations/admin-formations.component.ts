import { Component, OnInit } from '@angular/core';
import { IFormation } from '../../../../../core/interfaces/models/formation.interface';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllFormations } from '../../../../../core/ngrx/selectors/formations.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { FormFields } from '../../fragments/form-wrapper/form-wrapper.component';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-formations',
  templateUrl: './admin-formations.component.html',
  styleUrls: ['./admin-formations.component.scss'],
})
export class AdminFormationsComponent implements OnInit {
  public data: IFormation[] = [];

  public columnList: TableColumn[] = [
    { field: 'title', header: 'Titre', editable: true, style: 'width: 30%; min-width: 300px;' },
    {
      field: 'beginDate',
      header: 'Date de début',
      editable: true,
      style: 'width: 140px; min-width: 140px; max-width: 140px;',
    },
    {
      field: 'endDate',
      header: 'Date de fin',
      editable: true,
      style: 'width: 140px; min-width: 140px; max-width: 140px;',
    },
    { field: 'certificate', header: 'Certificat', style: 'width: 85px; min-width: 85px; max-width: 85px;' },
    { field: 'society', header: 'Société', editable: true, style: 'width: 10%; min-width: 200px; max-width: 250px;' },
    { field: 'place', header: 'Lieu', editable: true, style: 'width: 10%; min-width: 150px; max-width: 200px;' },
    { field: 'tagList', header: 'Liste des tags', style: 'width: 20%; min-width: 250px;' },
  ];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/formations';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<IFormation[]>(
      { selector: selectAllFormations, defaultValue: [] },
    );

    if (this.crudEndPoint) {
      this.formFields = [
        { name: 'title', label: 'Titre', inputType: 'text' },
        { name: 'beginDate', label: 'Date de début', inputType: 'text' },
        { name: 'endDate', label: 'Date de fin', inputType: 'text' },
        { name: 'society', label: 'Société', inputType: 'text' },
        { name: 'place', label: 'Lieu', inputType: 'text' },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminFormationsComponent onTableDataChanges:', event);
  }
}
