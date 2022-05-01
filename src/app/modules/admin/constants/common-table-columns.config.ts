import { TableColumn } from '../components/fragments/table-wrapper/interfaces/table-column.interface';
import {
  autoCompleteByPropertyAdapterFactory,
  DEFAULT_FORM_FIELDS_ADAPTERS,
  DEFAULT_FORM_FIELDS_GENERATORS,
} from './common-data-converters.config';
import { fullDatePlaceholder, partialDatePlaceholder } from './common-date.config';

export const tablePartialDatePlaceholder = partialDatePlaceholder.split(': ')[1];
export const tableFullDatePlaceholder = fullDatePlaceholder.split(': ')[1];

export const DEFAULT_TABLE_COLUMNS_CONFIG: { [key: string]: TableColumn; } = {
  name: {
    field: 'name', header: 'Nom', globalFilterField: true,
    sortable: true, exportable: true, editable: true,
    style: 'width: 30%; min-width: 300px;',
  },
  title: {
    field: 'title', header: 'Titre', globalFilterField: true, editable: true, exportable: true,
    style: 'width: 30%; min-width: 200px;',
  },
  startDate: {
    field: 'startDate', header: 'Date de début', sortable: true, exportable: true, editable: true,
    style: 'width: 164.5px; min-width: 164.5px; max-width: 164.5px;', inputPlaceholder: tablePartialDatePlaceholder,
    adapter: DEFAULT_FORM_FIELDS_ADAPTERS['partialDate'], generator: DEFAULT_FORM_FIELDS_GENERATORS['partialDate'],
  },
  beginDate: {
    field: 'beginDate', header: 'Date de début',
    sortable: true, editable: true, exportable: true,
    style: 'width: 164.5px; min-width: 164.5px; max-width: 164.5px;', inputPlaceholder: tablePartialDatePlaceholder,
    adapter: DEFAULT_FORM_FIELDS_ADAPTERS['partialDate'], generator: DEFAULT_FORM_FIELDS_GENERATORS['partialDate'],
  },
  endDate: {
    field: 'endDate', header: 'Date de fin',
    sortable: true, editable: true, exportable: true,
    style: 'width: 160px; min-width: 160px; max-width: 160px;', inputPlaceholder: tablePartialDatePlaceholder,
    adapter: DEFAULT_FORM_FIELDS_ADAPTERS['partialDate'], generator: DEFAULT_FORM_FIELDS_GENERATORS['partialDate'],
  },
  society: {
    field: 'society', header: 'Société', globalFilterField: true, sortable: true, editable: true, exportable: true,
    style: 'width: 10%; min-width: 190px; max-width: 200px;', inputType: 'autocomplete', autoCompleteWrapperOptions: {
      sourceProperty: 'society', sourceAdapter: autoCompleteByPropertyAdapterFactory('society'),
    },
  },
  place: {
    field: 'place', header: 'Lieu', globalFilterField: true, sortable: true, editable: true, exportable: true,
    style: 'width: 10%; min-width: 150px; max-width: 200px;', inputType: 'autocomplete', autoCompleteWrapperOptions: {
      sourceProperty: 'place', sourceAdapter: autoCompleteByPropertyAdapterFactory('place'),
    },
  },
  tagList: {
    field: 'tagList', header: 'Liste des tags', exportable: true,
    pickListWrapperOptions: {
      sourceEndPoint: '/v1/tags', propertyToDisplay: 'name',
      inlineStyle: { width: '100%' }, inlineClass: 'table-tag-list-pickList',
      sourceHeader: 'Disponible(s)', selectedHeader: 'Sélection', showSourceFilter: true,
      sourceFilterPlaceholder: 'Rechercher', showSelectedFilter: false, filterBy: 'name',
    },
    style: 'width: 20%; min-width: 250px; cursor: pointer;',
  },
  position: {
    field: 'position', header: 'Position', sortable: true,
    style: 'width: 10%; min-width: 90px; max-width: 120px;',
  },
};
