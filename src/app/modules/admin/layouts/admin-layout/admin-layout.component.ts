import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { logoutUser } from '../../../../core/ngrx/actions/auth.actions';

interface ExtendedMenuItem extends MenuItem {
  matIcon?: string;
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  public items: ExtendedMenuItem[] = [
    { label: 'Tags', routerLink: '/admin/tags' },
    { label: 'Skills', routerLink: '/admin/skills' },
    { label: 'Expériences', routerLink: '/admin/experiences' },
    { label: 'Formations', routerLink: '/admin/formations' },
    { label: 'Projets', routerLink: '/admin/projects' },
    { label: 'Centre d\'Intérêts', routerLink: '/admin/interests' },
    { label: '', matIcon: 'logout', command: () => this.store.dispatch(logoutUser()) },
  ];

  constructor(
    private readonly store: Store,
  ) {
  }
}
