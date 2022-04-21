import { DayJsService } from '../../../core/services/dayjs/dayjs.service';
import { FormField } from '../components/fragments/form-wrapper/interfaces/form-field.interface';
import { DEFAULT_DATA_ADAPTERS } from './common-data-converters.config';

export const DEFAULT_FORM_FIELDS_CONFIG: { [key: string]: FormField[]; } = {
  contact: [
    { field: 'fullName', inputLabel: 'Nom', inputType: 'text', defaultValue: '' },
    {
      field: 'phoneNumberPartList', inputLabel: 'Téléphone', inputType: 'text', defaultValue: '',
      adapter: DEFAULT_DATA_ADAPTERS.multiPartsAdapter,
      generator: (data: string) => {
        if (!data) {
          return '';
        }
        const joiner = data[5];
        const parts = data.split(joiner);
        return { joiner, parts };
      },
    },
    {
      field: 'emailPartList', inputLabel: 'Email', inputType: 'text', defaultValue: '',
      adapter: DEFAULT_DATA_ADAPTERS.multiPartsAdapter,
      generator: (data: string) => {
        if (!data) {
          return '';
        }
        const joiner = '@';
        const parts = data?.split(joiner);
        return { joiner, parts };
      },
    },
    { field: 'location', inputLabel: 'Localisation', inputType: 'text', defaultValue: '' },
    {
      field: 'personalSituation', inputLabel: 'Situation personnelle', inputType: 'form', defaultValue: {},
      childFormFields: [
        {
          field: 'birthDate', inputLabel: 'Date de naissance', inputType: 'text', defaultValue: '',
          adapter: (data: string) => {
            if (!data) {
              return '';
            }
            if (data.includes('/')) {
              return data;
            }
            return DayJsService.getDate(data, 'DD/MM/YYYY');
          },
          generator: (data: string) => {
            if (!data) {
              return '';
            }
            const datePartList = data.split('/');
            return DayJsService.getDate(`${datePartList[2]}-${datePartList[1]}-${datePartList[0]}`);
          },
        },
        { field: 'familyStatus', inputLabel: 'Statut familial', inputType: 'text', defaultValue: '' },
        { field: 'drivingLicense', inputLabel: 'Permis de conduire', inputType: 'text', defaultValue: '' },
      ],
    },
    {
      field: 'webLinkList', inputLabel: 'Liens web', inputType: 'form', defaultValue: [], isList: true,
      childFormFields: [
        { field: 'name', inputLabel: 'Nom', inputType: 'text', defaultValue: '' },
        {
          field: 'description', inputLabel: 'Description', inputType: 'textarea', defaultValue: '',
          inputTextareaOptions: { rows: 3 },
        },
        { field: 'url', inputLabel: 'Url', inputType: 'text', defaultValue: '' },
        { field: 'icon', inputLabel: 'Icône', inputType: 'text', defaultValue: '' },
        {
          field: 'image', inputLabel: 'Image', inputType: 'form', defaultValue: {},
          childFormFields: [
            { field: 'src', inputLabel: 'Url source', inputType: 'text', defaultValue: '' },
            { field: 'alt', inputLabel: 'Texte alternatif', inputType: 'text', defaultValue: '' },
            { field: 'width', inputLabel: 'Width', inputType: 'text', defaultValue: '' },
            { field: 'height', inputLabel: 'Height', inputType: 'text', defaultValue: '' },
          ],
        },
      ],
    },
  ],
  image: [
    { field: 'src', inputLabel: 'Url', inputType: 'text', defaultValue: '' },
    { field: 'alt', inputLabel: 'Texte alternatif', inputType: 'text', defaultValue: '' },
    { field: 'width', inputLabel: 'Width', inputType: 'text', defaultValue: '' },
    { field: 'height', inputLabel: 'Height', inputType: 'text', defaultValue: '' },
  ],
  title: [{ field: 'title', inputLabel: 'Titre', inputType: 'text', defaultValue: '' }],
  subTitle: [{ field: 'subTitle', inputLabel: 'Sous-titre', inputType: 'text', defaultValue: '' }],
  beginDate: [{ field: 'beginDate', inputLabel: 'Date de début', inputType: 'text', defaultValue: '' }],
  createdDate: [{ field: 'createdDate', inputLabel: 'Date de création', inputType: 'text', defaultValue: '' }],
  endDate: [{ field: 'endDate', inputLabel: 'Date de fin', inputType: 'text', defaultValue: '' }],
  society: [{ field: 'society', inputLabel: 'Société', inputType: 'text', defaultValue: '' }],
  place: [{ field: 'place', inputLabel: 'Lieu', inputType: 'text', defaultValue: '' }],
  description: [{
    field: 'description', inputLabel: 'Description', inputType: 'textarea', defaultValue: '',
    inputTextareaOptions: { rows: 5 },
  }],
  link: [{
    field: 'link', inputLabel: 'Lien', inputType: 'form', defaultValue: [],
    childFormFields: [
      { field: 'title', inputLabel: 'Titre', inputType: 'text', defaultValue: '' },
      { field: 'url', inputLabel: 'Url', inputType: 'text', defaultValue: '' },
      {
        field: 'description', inputLabel: 'Description', inputType: 'textarea', defaultValue: '',
        inputTextareaOptions: { rows: 3 },
      },
    ],
  }],
  tagList: [{
    field: 'tagList', inputLabel: 'Liste des tags', inputType: 'multiselect', defaultValue: [],
    adapter: (data: any[]) => data.map((each) => each.id),
    multiSelectWrapperOptions: {
      sourceListEndPoint: '/v1/tags',
      sourceAdapter: (data: any[]) => data.map((each) => ({ label: each.name, value: each.id })),
      scrollHeight: '400px',
    },
  }],
  detailList: [{
    field: 'detailList', inputLabel: 'Missions', inputType: 'form', defaultValue: [], isList: true,
    childFormFields: [
      { field: 'title', inputLabel: 'Titre', inputType: 'text', defaultValue: '' },
      { field: 'url', inputLabel: 'Lien', inputType: 'text', defaultValue: '' },
      {
        field: 'lineList', inputLabel: 'Détails', inputType: 'textarea', inputTextareaOptions: { rows: 10 },
        adapter: (data: string[]): string => data?.join('\n') || '',
        generator: (data: string): string[] => data?.split('\n').filter((content) => content) || [],
        defaultValue: '',
      },
    ],
  }],
  linkList: [{
    field: 'linkList', inputLabel: 'Liens', inputType: 'form', defaultValue: [], isList: true, maxItems: 2,
    childFormFields: [
      { field: 'title', inputLabel: 'Titre', inputType: 'text', defaultValue: '' },
      { field: 'url', inputLabel: 'Lien', inputType: 'text', defaultValue: '' },
      {
        field: 'description', inputLabel: 'Description', inputType: 'textarea',
        inputTextareaOptions: { rows: 5 }, defaultValue: '',
      },
    ],
  }],
};
