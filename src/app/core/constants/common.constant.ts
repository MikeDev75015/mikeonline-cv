import { DropdownOption } from '../../shared/components/dropdown-wrapper/interfaces/dropdown-option.interface';

export const APP_CREDITS = {
  copyright: 'Copyright © 2018-2022',
  owner: 'MIKEONLINE',
  fullName: 'Mickaël NODANCHE',
  title: 'Développeur FullStack TS CV en ligne',
  subTitle: 'Angular 2+, Nest.js, Node.js',
  webAppUrl: 'https://cv-mikeonline.web.app',
};

export const CV_TYPE_DROPDOWN_LIST: DropdownOption[] = [
  { label: 'Complet', value: 'full-cv' },
  { label: 'Partiel', value: 'partial-cv' },
];

export const JOB_TYPE_DROPDOWN_LIST: DropdownOption[] = [
  { label: 'Freelance', value: 0 },
  { label: 'Founder', value: 1 },
  { label: 'CDI', value: 2 },
  { label: 'CDD', value: 3 },
  { label: 'Interim', value: 4 },
  { label: 'Stage', value: 5 },
  { label: 'Alternance', value: 6 },
];

export const EXPERTISE_LEVEL_DROPDOWN_LIST: DropdownOption[] = [
  { label: 'Débutant', value: 1 },
  { label: 'Averti', value: 2 },
  { label: 'Bon', value: 3 },
  { label: 'Très bon', value: 4 },
  { label: 'Expert', value: 5 },
];

export const PRIORITY_DROPDOWN_LIST: DropdownOption[] = [
  { label: 'Au besoin', value: 1 },
  { label: 'Normal', value: 2 },
  { label: 'Maximum', value: 3 },
];

export const EXPERTISE_LEVEL_LABEL: { [key: string]: string } = {
  1: 'débutant',
  2: 'averti',
  3: 'bon',
  4: 'très bon',
  5: 'expert',
};

export const PRIORITY_LABEL: { [key: string]: string } = {
  1: 'au besoin',
  2: 'normal',
  3: 'maximum',
};

export const isLoadingDisplayTimeout = 1500;
