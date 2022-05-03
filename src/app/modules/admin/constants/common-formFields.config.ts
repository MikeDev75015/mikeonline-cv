import { getValidationField } from '../../../shared/components/form-wrapper/constants/validation-field-bundle.constant';
import { ChildFormField, FormField } from '../../../shared/components/form-wrapper/interfaces/form-field.interface';
import { ValidationType } from '../../../shared/components/form-wrapper/interfaces/validation-type.enum';
import {
  autoCompleteByPropertyAdapterFactory,
  DEFAULT_FORM_FIELDS_ADAPTERS,
  DEFAULT_FORM_FIELDS_GENERATORS,
} from './common-data-converters.config';
import { fullDatePattern, fullDatePlaceholder, partialDatePlaceholder } from './common-date.config';

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
      {
        field: 'fullName', inputLabel: 'Nom complet', inputType: 'text', defaultValue: '', mandatoryField: true,
        validationFieldList: [
          getValidationField(ValidationType.required, {}),
        ],
      },
      {
        field: 'phoneNumberPartList', inputLabel: 'Téléphone', inputType: 'text', defaultValue: '',
        adapter: DEFAULT_FORM_FIELDS_ADAPTERS['multiParts'],
        generator: DEFAULT_FORM_FIELDS_GENERATORS['phoneNumberPartList'],
      },
      {
        field: 'emailPartList', inputLabel: 'Email', inputType: 'text', defaultValue: '',
        adapter: DEFAULT_FORM_FIELDS_ADAPTERS['multiParts'],
        generator: DEFAULT_FORM_FIELDS_GENERATORS['emailPartList'],
      },
      { field: 'location', inputLabel: 'Localisation', inputType: 'text', defaultValue: '' },
      {
        field: 'personalSituation', inputLabel: 'Situation personnelle', inputType: 'form', defaultValue: {},
        childFormFields: [
          {
            field: 'birthDate', inputLabel: 'Date de naissance', inputType: 'text', defaultValue: '',
            adapter: DEFAULT_FORM_FIELDS_ADAPTERS['birthDate'], inputPlaceholder: fullDatePlaceholder,
            generator: DEFAULT_FORM_FIELDS_GENERATORS['birthDate'],
            validationFieldList: [
              getValidationField(ValidationType.pattern, { pattern: fullDatePattern }),
            ],
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
  beginDate: {
    field: 'beginDate', inputLabel: 'Date de début', inputType: 'text', inputPlaceholder: partialDatePlaceholder,
    defaultValue: '', adapter: DEFAULT_FORM_FIELDS_ADAPTERS['partialDate'],
    generator: DEFAULT_FORM_FIELDS_GENERATORS['partialDate'],
  },
  startDate: {
    field: 'startDate', inputLabel: 'Date de début', inputType: 'text', inputPlaceholder: partialDatePlaceholder,
    defaultValue: '', adapter: DEFAULT_FORM_FIELDS_ADAPTERS['partialDate'],
    generator: DEFAULT_FORM_FIELDS_GENERATORS['partialDate'],
  },
  createdDate: {
    field: 'createdDate', inputLabel: 'Date de création', inputType: 'text', defaultValue: '',
    inputPlaceholder: partialDatePlaceholder, adapter: DEFAULT_FORM_FIELDS_ADAPTERS['partialDate'],
    generator: DEFAULT_FORM_FIELDS_GENERATORS['partialDate'],
  },
  endDate: {
    field: 'endDate', inputLabel: 'Date de fin', inputType: 'text', defaultValue: '',
    inputPlaceholder: partialDatePlaceholder, adapter: DEFAULT_FORM_FIELDS_ADAPTERS['partialDate'],
    generator: DEFAULT_FORM_FIELDS_GENERATORS['partialDate'],
  },
  society: {
    field: 'society', inputLabel: 'Société', inputType: 'autocomplete', defaultValue: '',
    autoCompleteWrapperOptions: {
      sourceProperty: 'society', sourceAdapter: autoCompleteByPropertyAdapterFactory('society'),
    },
  },
  place: {
    field: 'place', inputLabel: 'Lieu', inputType: 'autocomplete', defaultValue: '',
    autoCompleteWrapperOptions: {
      sourceProperty: 'place', sourceAdapter: autoCompleteByPropertyAdapterFactory('place'),
    },
  },
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
      sourceEndPoint: '/v1/tags',
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
