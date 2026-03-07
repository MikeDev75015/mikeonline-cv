import { Component, OnInit } from '@angular/core';
import { CV_TYPE_DROPDOWN_LIST } from '../../../../../core/constants/common.constant';
import {
  getValidationField,
} from '../../../../../shared/components/form-wrapper/constants/validation-field-bundle.constant';
import { FormField } from '../../../../../shared/components/form-wrapper/interfaces/form-field.interface';
import { ValidationType } from '../../../../../shared/components/form-wrapper/interfaces/validation-type.enum';
import { DEFAULT_FORM_FIELDS_CONFIG } from '../../../constants/common-formFields.config';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
    selector: 'app-admin-cv-infos',
    templateUrl: './admin-cv-infos.component.html',
    standalone: false
})
export class AdminCvInfosComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public editElementLabel = 'Editer le CV';

  public addElementLabel = 'Ajouter un CV';

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
          sourceEndPoint: '/v1/skills', sourceAdapter: (data: any) => data.name,
          inlineStyle: { width: '100%' }, inlineClass: 'table-techno-list-pickList',
          sourceHeader: 'Disponible(s)', selectedHeader: 'Sélection', showSourceFilter: true,
          sourceFilterPlaceholder: 'Rechercher', showSelectedFilter: false, filterBy: '',
          selectionLimit: 3,
        },
        style: 'width: 20%; min-width: 200px; max-width: 320px; cursor: pointer;',
      },
      {
        field: 'contact', header: 'Contact', exportable: true,
        style: 'width: 320px; min-width: 320px; max-width: 320px;',
        formFields: DEFAULT_FORM_FIELDS_CONFIG['contact'].childFormFields,
      },
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        {
          field: 'cvType', inputLabel: 'Type de CV', inputType: 'dropdown', defaultValue: 'full-cv',
          dropdownWrapperOptions: { list: CV_TYPE_DROPDOWN_LIST }, mandatoryField: true,
          validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        {
          field: 'fileName', inputLabel: 'Nom du fichier PDF', inputType: 'text', defaultValue: '',
          mandatoryField: true,
          validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['title'],
          mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
            getValidationField(ValidationType.maxLength, { maxLength: 20 }),
          ],
        },
        {
          field: 'technoList', inputLabel: 'Les 3 principales technos', inputType: 'multiselect', defaultValue: [],
          multiSelectWrapperOptions: {
            sourceEndPoint: '/v1/skills', selectionLimit: 3,
            sourceAdapter: (data: any[]) => data.map((each: any) => ({ label: each.name, value: each.name })),
          }, mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
            getValidationField(ValidationType.maxLength, { maxLength: 3 }),
            getValidationField(ValidationType.minLength, { minLength: 3 }),
          ],
        },
        DEFAULT_FORM_FIELDS_CONFIG['logo'],
        DEFAULT_FORM_FIELDS_CONFIG['contact'],
      ];
    }
  }
}
