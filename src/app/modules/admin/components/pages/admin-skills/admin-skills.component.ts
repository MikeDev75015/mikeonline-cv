import { Component, OnInit } from '@angular/core';
import { EXPERTISE_LEVEL_DROPDOWN_LIST, PRIORITY_DROPDOWN_LIST } from '../../../../../core/constants/common.constant';
import { dataGeneratorListFactory } from '../../../constants/common-data-converters.config';
import { partialDatePattern } from '../../../constants/common-date.config';
import { DEFAULT_FORM_FIELDS_CONFIG } from '../../../constants/common-formFields.config';
import { DEFAULT_TABLE_COLUMNS_CONFIG } from '../../../constants/common-table-columns.config';
import { getValidationField } from '../../fragments/form-wrapper/constants/validation-field-bundle.constant';
import { FormField } from '../../fragments/form-wrapper/interfaces/form-field.interface';
import { ValidationType } from '../../fragments/form-wrapper/interfaces/validation-type.enum';
import { TableColumn } from '../../fragments/table-wrapper/interfaces/table-column.interface';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
})
export class AdminSkillsComponent implements OnInit {
  public columnList: TableColumn[] = [];

  public formFields: FormField[] | undefined;

  public editElementLabel = 'Editer la compétence';

  public addElementLabel = 'Ajouter une compétence';

  public crudEndPoint = '/v1/skills';

  public exportCsvFileName = 'Mes Compétences';

  public dataGeneratorList = dataGeneratorListFactory(['tagList']);

  async ngOnInit(): Promise<void> {
    this.columnList = [
      { ...DEFAULT_TABLE_COLUMNS_CONFIG['name'], sortField: true },
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
      DEFAULT_TABLE_COLUMNS_CONFIG['startDate'],
      DEFAULT_TABLE_COLUMNS_CONFIG['endDate'],
      DEFAULT_TABLE_COLUMNS_CONFIG['tagList'],
    ];

    if (this.crudEndPoint) {
      this.formFields = [
        {
          field: 'name', inputLabel: 'Nom', inputType: 'text', defaultValue: '', mandatoryField: true,
          validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        {
          field: 'expertiseLevel', inputLabel: 'Niveau d\'expertise', defaultValue: 1,
          inputType: 'dropdown', dropdownWrapperOptions: { list: EXPERTISE_LEVEL_DROPDOWN_LIST }, mandatoryField: true,
          validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        {
          field: 'priority', inputLabel: 'Priorité', defaultValue: 1,
          inputType: 'dropdown', dropdownWrapperOptions: { list: PRIORITY_DROPDOWN_LIST }, mandatoryField: true,
          validationFieldList: [
            getValidationField(ValidationType.required, {}),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['startDate'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
            getValidationField(ValidationType.pattern, { pattern: partialDatePattern }),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['endDate'], validationFieldList: [
            getValidationField(ValidationType.pattern, { pattern: partialDatePattern }),
          ],
        },
        {
          ...DEFAULT_FORM_FIELDS_CONFIG['tagList'], mandatoryField: true, validationFieldList: [
            getValidationField(ValidationType.required, {}),
            getValidationField(ValidationType.minLength, { minLength: 1 }),
          ],
        },
      ];
    }
  }
}
