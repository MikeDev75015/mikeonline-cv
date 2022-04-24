import { Component, OnInit } from '@angular/core';
import { dataGeneratorListFactory } from '../../../constants/common-data-converters.config';
import {
  DEFAULT_CHILD_FORM_FIELDS_CONFIG,
  DEFAULT_FORM_FIELDS_CONFIG,
} from '../../../constants/common-formFields.config';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common-table-columns.config';
import { FormField } from '../../fragments/form-wrapper/interfaces/form-field.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
})
export class AdminProjectsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public crudEndPoint = '/v1/projects';

  public exportCsvFileName = 'Mes Projets';

  public dataGeneratorList = dataGeneratorListFactory(['tagList']);

  async ngOnInit(): Promise<void> {
    this.columnList = [
      {
        field: 'title', header: 'Titre', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 50%; min-width: 250px;',
      },
      {
        field: 'subTitle', header: 'Sous-titre', globalFilterField: true,
        sortable: true, editable: true, exportable: true,
        style: 'width: 10%; min-width: 180px;',
      },
      {
        field: 'description', header: 'Description', globalFilterField: true,
        editable: true, exportable: true,
        inputType: 'textarea', inputTextareaOptions: { rows: 3 },
        style: 'width: 10%; min-width: 150px;',
      },
      { ...DEFAULT_TABLE_COLUMNS_CONFIG['position'], sortField: true },
      DEFAULT_TABLE_COLUMNS_CONFIG['tagList'],
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        DEFAULT_FORM_FIELDS_CONFIG['title'],
        DEFAULT_FORM_FIELDS_CONFIG['subTitle'],
        DEFAULT_FORM_FIELDS_CONFIG['createdDate'],
        DEFAULT_FORM_FIELDS_CONFIG['tagList'],
        DEFAULT_FORM_FIELDS_CONFIG['description'],
        DEFAULT_FORM_FIELDS_CONFIG['link'],
        {
          field: 'pictureList', inputLabel: 'Les images', inputType: 'form', defaultValue: [], isList: true,
          childFormFields: DEFAULT_CHILD_FORM_FIELDS_CONFIG['image'],
        },
      ];
    }
  }
}
