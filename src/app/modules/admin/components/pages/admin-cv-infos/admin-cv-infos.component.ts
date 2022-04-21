import { Component, OnInit } from '@angular/core';
import { CV_TYPE_DROPDOWN_LIST } from '../../../../../core/constants/common.constant';
import { DEFAULT_FORM_FIELDS_CONFIG } from '../../../constants/common-formFields.config';
import { FormField } from '../../fragments/form-wrapper/interfaces/form-field.interface';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-cv-infos',
  templateUrl: './admin-cv-infos.component.html',
})
export class AdminCvInfosComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public crudEndPoint = '/v1/cv-infos';

  public exportCsvFileName = 'Infos du CV';

  async ngOnInit(): Promise<void> {
    this.columnList = [
      {
        field: 'cvType', header: 'Type de CV', inputType: 'dropdown',
        sortable: true, editable: true, exportable: true,
        dropdownWrapperOptions: { list: CV_TYPE_DROPDOWN_LIST },
        style: 'width: 145px; min-width: 145px; max-width: 145px;',
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
        field: 'technoList', header: 'Les 3 principales technos', exportable: true,
        pickListWrapperOptions: {
          sourceListEndPoint: '/v1/skills', sourceAdapter: (data: any) => data.name,
          inlineStyle: { width: '100%' }, inlineClass: 'table-techno-list-pickList',
          sourceHeader: 'Disponible(s)', targetHeader: 'Sélection', showSourceFilter: true,
          sourceFilterPlaceholder: 'Rechercher', showTargetFilter: false, filterBy: '',
          selectionLimit: 3,
        },
        style: 'width: 20%; min-width: 200px; max-width: 320px; cursor: pointer;',
      },
      {
        field: 'contact', header: 'Contact', exportable: true,
        style: 'width: 320px; min-width: 320px; max-width: 320px;',
        formFields: DEFAULT_FORM_FIELDS_CONFIG['contact'],
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        {
          field: 'cvType', inputLabel: 'Type de CV', inputType: 'dropdown', defaultValue: 'full-cv',
          dropdownWrapperOptions: { list: CV_TYPE_DROPDOWN_LIST },
        },
        { field: 'fileName', inputLabel: 'Nom du fichier PDF', inputType: 'text', defaultValue: '' },
        DEFAULT_FORM_FIELDS_CONFIG['title'][0],
        {
          field: 'technoList', inputLabel: 'Les 3 principales technos', inputType: 'multiselect', defaultValue: [],
          multiSelectWrapperOptions: {
            sourceListEndPoint: '/v1/skills', selectionLimit: 3,
            sourceAdapter: (data: any[]) => data.map((each: any) => ({ label: each.name, value: each.name })),
          },
        },
        {
          field: 'logo', inputLabel: 'Logo', inputType: 'form', defaultValue: {},
          childFormFields: DEFAULT_FORM_FIELDS_CONFIG['image'],
        },
        {
          field: 'contact', inputLabel: 'Contact', inputType: 'form', defaultValue: {},
          childFormFields: DEFAULT_FORM_FIELDS_CONFIG['contact'],
        },
      ];
    }
  }
}
