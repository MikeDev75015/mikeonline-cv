import { Component, OnInit } from '@angular/core';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-cv-infos',
  templateUrl: './admin-cv-infos.component.html',
})
export class AdminCvInfosComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/cv-infos';

  public exportCsvFileName = 'Infos du CV';

  async ngOnInit(): Promise<void> {
    this.columnList = [
      {
        field: 'cvType', header: 'Type', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 100px; min-width: 100px; max-width: 100px;',
      },
      {
        field: 'fileName', header: 'Nom du fichier PDF', sortField: true, globalFilterField: true,
        sortable: true, exportable: true, editable: true,
        style: 'width: 320px; min-width: 320px; max-width: 320px;',
      },
      {
        field: 'title', header: 'Titre', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 10%; min-width: 150px; max-width: 200px;',
      },
      {
        field: 'technoList', header: 'Liste des technos', exportable: true,
        overlayPanel: true, pickListWrapperOptions: {
          sourceListEndPoint: '/v1/skills', sourceAdapter: (data: any) => data.name,
          inlineStyle: { width: '100%' }, inlineClass: 'table-techno-list-pickList',
          sourceHeader: 'Disponible(s)', targetHeader: 'Sélection', showSourceFilter: true,
          sourceFilterPlaceholder: 'Rechercher', showTargetFilter: false, filterBy: '',
        },
        style: 'width: 20%; min-width: 200px; cursor: pointer;',
      },
      {
        field: 'contact', header: 'contact', exportable: true,
        style: 'width: 320px; min-width: 320px; max-width: 320px;',
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [];
    }
  }

  public onTableDataChanges(event: any[]): void {
    console.debug('AdminCvInfosComponent onTableDataChanges:', event);
  }
}
