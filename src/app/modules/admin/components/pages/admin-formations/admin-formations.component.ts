import { Component, OnInit } from '@angular/core';
import { IFormation } from '../../../../../core/interfaces/models/formation.interface';
import { selectAllFormations } from '../../../../../core/ngrx/selectors/formations.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { TableColumn } from '../../fragments/table-wrapper/table-wrapper.component';

@Component({
  selector: 'app-admin-formations',
  templateUrl: './admin-formations.component.html',
  styleUrls: ['./admin-formations.component.scss'],
})
export class AdminFormationsComponent implements OnInit {
  public data: IFormation[] = [];

  public columnList: TableColumn[] = [
    { field: 'title', header: 'Titre' },
    { field: 'beginDate', header: 'Date de début' },
    { field: 'endDate', header: 'Date de fin' },
    { field: 'certificate', header: 'Certificat' },
    { field: 'society', header: 'Société' },
    { field: 'place', header: 'Lieu' },
  ];

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<IFormation[]>(
      { selector: selectAllFormations, defaultValue: [] },
    );
  }
}
