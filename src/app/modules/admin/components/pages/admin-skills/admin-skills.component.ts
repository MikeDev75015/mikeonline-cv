import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EXPERTISE_LEVEL_DROPDOWN_LIST, PRIORITY_DROPDOWN_LIST } from '../../../../../core/constants/common.constant';
import { ISkill } from '../../../../../core/interfaces/models/skill.interface';
import { ITag } from '../../../../../core/interfaces/models/tag.interface';
import { selectAllCompetences } from '../../../../../core/ngrx/selectors/competences.selectors';
import { DataService } from '../../../../../shared/services/data/data.service';
import { FormFields } from '../../fragments/form-wrapper/interfaces/form-fields.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
})
export class AdminSkillsComponent implements OnInit {
  @ViewChild('pickListItem', { static: true }) pickListItem: ElementRef | undefined;

  public data: ISkill[] = [];

  public columnList: TableColumn[] = [];

  public formFields: FormFields[] | undefined;

  public crudEndPoint = '/v1/skills';

  public exportCsvFileName = 'Mes Compétences';

  constructor(
    private readonly dataService: DataService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.data = await this.dataService.getStoreData<ISkill[]>(
      { selector: selectAllCompetences, defaultValue: [] },
    );

    this.columnList = [
      {
        field: 'name', header: 'Nom', sortField: true, globalFilterField: true,
        sortable: true, exportable: true, editable: true,
        style: 'width: 30%; min-width: 300px;',
      },
      {
        field: 'expertiseLevel', header: 'Niveau d\'expertise',
        sortable: true, exportable: true, editable: true,
        inputType: 'dropdown', dropdownWrapperOptions: { list: EXPERTISE_LEVEL_DROPDOWN_LIST },
        style: 'width: 200px; min-width: 200px; max-width: 200px;',
      },
      {
        field: 'priority', header: 'Priorité', sortable: true, exportable: true,
        editable: true, inputType: 'dropdown', dropdownWrapperOptions: { list: PRIORITY_DROPDOWN_LIST },
        style: 'width: 160px; min-width: 160px; max-width: 160px;',
      },
      {
        field: 'startDate', header: 'Date de début', sortable: true, exportable: true, editable: true,
        style: 'width: 164.5px; min-width: 164.5px; max-width: 164.5px;',
      },
      {
        field: 'tagList', header: 'Liste des tags', exportable: true,
        overlayPanel: true, pickListWrapperOptions: {
          sourceListEndPoint: '/v1/tags', propertyToDisplay: 'name',
          inlineStyle: { width: '100%' }, inlineClass: 'table-tag-list-pickList',
          sourceHeader: 'Disponible(s)', targetHeader: 'Sélection', showSourceFilter: true,
          sourceFilterPlaceholder: 'Rechercher', showTargetFilter: false, filterBy: 'name',
        },
        style: 'width: 20%; min-width: 250px; cursor: pointer;',
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        { field: 'name', fieldLabel: 'Nom', inputType: 'text' },
        {
          field: 'expertiseLevel', fieldLabel: 'Niveau d\'expertise',
          inputType: 'dropdown', dropdownWrapperOptions: { list: EXPERTISE_LEVEL_DROPDOWN_LIST },
        },
        {
          field: 'priority', fieldLabel: 'Priorité',
          inputType: 'dropdown', dropdownWrapperOptions: { list: PRIORITY_DROPDOWN_LIST },
        },
        { field: 'startDate', fieldLabel: 'Date de début', inputType: 'text' },
      ];
    }
  }

  public onTableDataChanges(event: ITag[]): void {
    console.debug('AdminSkillsComponent onTableDataChanges:', event);
  }
}
