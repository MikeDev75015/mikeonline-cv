import { Component, OnInit } from '@angular/core';
import { IFormation } from '../../../../../core/interfaces/models/formation.interface';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllFormations } from '../../../../../core/ngrx/selectors/formations.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-formations',
  templateUrl: './admin-formations.component.html',
})
export class AdminFormationsComponent implements OnInit {
  public data: IFormation[] = [];

  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/formations';

  public exportCsvFileName = 'Mes Formations';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<IFormation[]>(
      { selector: selectAllFormations, defaultValue: [] },
    );

    this.columnList = [
      {
        field: 'title', header: 'Titre', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 30%; min-width: 300px;',
      },
      {
        field: 'beginDate', header: 'Date de début',
        sortable: true, editable: true, exportable: true,
        style: 'width: 140px; min-width: 140px; max-width: 140px;',
      },
      {
        field: 'endDate', header: 'Date de fin', sortField: true, sortOrder: -1,
        sortable: true, editable: true, exportable: true,
        style: 'width: 140px; min-width: 140px; max-width: 140px;',
      },
      {
        field: 'certificate', header: 'Certificat',
        sortable: true, editable: true, exportable: true, inputType: 'checkbox',
        style: 'width: 85px; min-width: 85px; max-width: 85px;',
      },
      {
        field: 'society', header: 'Société', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 10%; min-width: 200px; max-width: 250px;',
      },
      {
        field: 'place', header: 'Lieu', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 10%; min-width: 150px; max-width: 200px;',
      },
      {
        field: 'tagList', header: 'Liste des tags', exportable: true, overlayPanel: true,
        style: 'width: 20%; min-width: 250px;',
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        { field: 'title', fieldLabel: 'Titre', inputType: 'text' },
        { field: 'beginDate', fieldLabel: 'Date de début', inputType: 'text' },
        { field: 'endDate', fieldLabel: 'Date de fin', inputType: 'text' },
        { field: 'certificate', fieldLabel: 'Certificat', inputType: 'checkbox' },
        { field: 'society', fieldLabel: 'Société', inputType: 'text' },
        { field: 'place', fieldLabel: 'Lieu', inputType: 'text' },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminFormationsComponent onTableDataChanges:', event);
  }
}
