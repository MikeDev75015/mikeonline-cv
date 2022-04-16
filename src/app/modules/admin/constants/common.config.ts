export const DEFAULT_TABLE_COLUMNS_CONFIG = {
  name: {
    field: 'name', header: 'Nom', sortField: true, globalFilterField: true,
    sortable: true, exportable: true, editable: true,
    style: 'width: 30%; min-width: 300px;',
  },
  title: {
    field: 'title', header: 'Titre', globalFilterField: true, editable: true, exportable: true,
    style: 'width: 30%; min-width: 300px;',
  },
  startDate: {
    field: 'startDate', header: 'Date de début', sortable: true, exportable: true, editable: true,
    style: 'width: 164.5px; min-width: 164.5px; max-width: 164.5px;',
  },
  beginDate: {
    field: 'beginDate', header: 'Date de début',
    sortable: true, editable: true, exportable: true,
    style: 'width: 164.5px; min-width: 164.5px; max-width: 164.5px;',
  },
  endDate: {
    field: 'endDate', header: 'Date de fin',
    sortable: true, editable: true, exportable: true,
    style: 'width: 160px; min-width: 160px; max-width: 160px;',
  },
  society: {
    field: 'society', header: 'Société', globalFilterField: true,
    sortable: true, editable: true, exportable: true,
    style: 'width: 10%; min-width: 150px; max-width: 200px;',
  },
  place: {
    field: 'place', header: 'Lieu', globalFilterField: true,
    sortable: true, editable: true, exportable: true,
    style: 'width: 10%; min-width: 150px; max-width: 200px;',
  },
  tagList: {
    field: 'tagList', header: 'Liste des tags', exportable: true,
    overlayPanel: true, pickListWrapperOptions: {
      sourceListEndPoint: '/v1/tags', propertyToDisplay: 'name',
      inlineStyle: { width: '100%' }, inlineClass: 'table-tag-list-pickList',
      sourceHeader: 'Disponible(s)', targetHeader: 'Sélection', showSourceFilter: true,
      sourceFilterPlaceholder: 'Rechercher', showTargetFilter: false, filterBy: 'name',
    },
    style: 'width: 20%; min-width: 250px; cursor: pointer;',
  },
  tagListQueryAdapter: (data: any) => {
    if (!data.tagList) {
      return data;
    }

    const tagIdList = data.tagList.map((tag: any) => tag.id);
    const { tagList, ...adaptedData } = data;
    adaptedData['tagIdList'] = tagIdList;
    return adaptedData;
  },
};
