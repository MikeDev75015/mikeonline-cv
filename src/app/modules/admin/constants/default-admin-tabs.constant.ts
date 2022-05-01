import { ExtendedMenuItem } from '../interfaces/extended-menu-item.interface';

export const DEFAULT_ADMIN_TABS: ExtendedMenuItem[] = [
  { label: 'Infos CV', routerLink: '/admin/cv-infos' },
  { label: 'Tags', routerLink: '/admin/tags' },
  { label: 'Compétences', routerLink: '/admin/skills' },
  { label: 'Expériences', routerLink: '/admin/experiences' },
  { label: 'Formations', routerLink: '/admin/formations' },
  { label: 'Projets', routerLink: '/admin/projects' },
  { label: 'Centre d\'Intérêts', routerLink: '/admin/interests' },
];
