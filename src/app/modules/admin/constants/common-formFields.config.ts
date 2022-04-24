import { ChildFormField, FormField } from '../components/fragments/form-wrapper/interfaces/form-field.interface';
import { DEFAULT_FORM_FIELDS_ADAPTERS, DEFAULT_FORM_FIELDS_GENERATORS } from './common-data-converters.config';

export const DEFAULT_CHILD_FORM_FIELDS_CONFIG: { [key: string]: ChildFormField[]; } = {
  image: [
    { field: 'src', inputLabel: 'Url', inputType: 'text', defaultValue: '' },
    { field: 'alt', inputLabel: 'Texte alternatif', inputType: 'text', defaultValue: '' },
    { field: 'width', inputLabel: 'Width', inputType: 'text', defaultValue: '' },
    { field: 'height', inputLabel: 'Height', inputType: 'text', defaultValue: '' },
  ],
  link: [
    { field: 'title', inputLabel: 'Titre', inputType: 'text', defaultValue: '' },
    { field: 'url', inputLabel: 'Url', inputType: 'text', defaultValue: '' },
    {
      field: 'description', inputLabel: 'Description', inputType: 'textarea', defaultValue: '',
      inputTextareaOptions: { rows: 3 },
    },
  ],
};

export const DEFAULT_FORM_FIELDS_CONFIG: { [key: string]: FormField; } = {
  contact: {
    field: 'contact', inputLabel: 'Contact', inputType: 'form', defaultValue: {},
    childFormFields: [
      { field: 'fullName', inputLabel: 'Nom', inputType: 'text', defaultValue: '' },
      {
        field: 'phoneNumberPartList', inputLabel: 'Téléphone', inputType: 'text', defaultValue: '',
        adapter: DEFAULT_FORM_FIELDS_ADAPTERS['multiPartsAdapter'],
        generator: DEFAULT_FORM_FIELDS_GENERATORS['phoneNumberPartList'],
      },
      {
        field: 'emailPartList', inputLabel: 'Email', inputType: 'text', defaultValue: '',
        adapter: DEFAULT_FORM_FIELDS_ADAPTERS['multiPartsAdapter'],
        generator: DEFAULT_FORM_FIELDS_GENERATORS['emailPartList'],
      },
      { field: 'location', inputLabel: 'Localisation', inputType: 'text', defaultValue: '' },
      {
        field: 'personalSituation', inputLabel: 'Situation personnelle', inputType: 'form', defaultValue: {},
        childFormFields: [
          {
            field: 'birthDate', inputLabel: 'Date de naissance', inputType: 'text', defaultValue: '',
            adapter: DEFAULT_FORM_FIELDS_ADAPTERS['birthDate'],
            generator: DEFAULT_FORM_FIELDS_GENERATORS['birthDate'],
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
  },
  logo: {
    field: 'logo', inputLabel: 'Logo', inputType: 'form', defaultValue: {},
    childFormFields: DEFAULT_CHILD_FORM_FIELDS_CONFIG['image'],
  },
  title: { field: 'title', inputLabel: 'Titre', inputType: 'text', defaultValue: '' },
  subTitle: { field: 'subTitle', inputLabel: 'Sous-titre', inputType: 'text', defaultValue: '' },
  beginDate: { field: 'beginDate', inputLabel: 'Date de début', inputType: 'text', defaultValue: '' },
  createdDate: { field: 'createdDate', inputLabel: 'Date de création', inputType: 'text', defaultValue: '' },
  endDate: { field: 'endDate', inputLabel: 'Date de fin', inputType: 'text', defaultValue: '' },
  society: { field: 'society', inputLabel: 'Société', inputType: 'text', defaultValue: '' },
  place: { field: 'place', inputLabel: 'Lieu', inputType: 'text', defaultValue: '' },
  description: {
    field: 'description', inputLabel: 'Description', inputType: 'textarea', defaultValue: '',
    inputTextareaOptions: { rows: 5 },
  },
  link: {
    field: 'link', inputLabel: 'Lien', inputType: 'form', defaultValue: [],
    childFormFields: DEFAULT_CHILD_FORM_FIELDS_CONFIG['link'],
  },
  tagList: {
    field: 'tagList', inputLabel: 'Liste des tags', inputType: 'multiselect', defaultValue: [],
    adapter: DEFAULT_FORM_FIELDS_ADAPTERS['tagList'],
    multiSelectWrapperOptions: {
      sourceListEndPoint: '/v1/tags',
      sourceAdapter: (data: any[]) => data.map((each) => ({ label: each.name, value: each.id })),
      scrollHeight: '400px',
    },
  },
  detailList: {
    field: 'detailList', inputLabel: 'Missions', inputType: 'form', defaultValue: [], isList: true,
    childFormFields: [
      { field: 'title', inputLabel: 'Titre', inputType: 'text', defaultValue: '' },
      { field: 'url', inputLabel: 'Lien', inputType: 'text', defaultValue: '' },
      {
        field: 'lineList', inputLabel: 'Détails', inputType: 'textarea', inputTextareaOptions: { rows: 10 },
        adapter: DEFAULT_FORM_FIELDS_ADAPTERS['lineList'],
        generator: DEFAULT_FORM_FIELDS_GENERATORS['lineList'],
        defaultValue: '',
      },
    ],
  },
  linkList: {
    field: 'linkList', inputLabel: 'Liens', inputType: 'form', defaultValue: [], isList: true, maxItems: 2,
    childFormFields: DEFAULT_CHILD_FORM_FIELDS_CONFIG['link'],
  },
};
