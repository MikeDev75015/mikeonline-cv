import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { STORAGE_KEYS } from '../../../../core/constants/storage-keys.constant';
import { IUser } from '../../../../core/interfaces/models/user.interface';
import { logoutUser } from '../../../../core/ngrx/actions/auth.actions';
import { StorageService } from '../../../../core/services/storage/storage.service';
import { ThemingService } from '../../../../core/services/theming/theming.service';

interface ExtendedMenuItem extends MenuItem {
  matIcon?: string;
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  providers: [ThemingService],
})
export class AdminLayoutComponent implements OnInit {
  public readonly leftItems: ExtendedMenuItem[] = [
    { label: 'Tags', routerLink: '/admin/tags' },
    { label: 'Skills', routerLink: '/admin/skills' },
    { label: 'Expériences', routerLink: '/admin/experiences' },
    { label: 'Formations', routerLink: '/admin/formations' },
    { label: 'Projets', routerLink: '/admin/projects' },
    { label: 'Centre d\'Intérêts', routerLink: '/admin/interests' },
  ];

  public readonly rightItems: ExtendedMenuItem[] = [
    { label: 'Se déconnecter', command: () => this.store.dispatch(logoutUser()) },
  ];

  public readonly themeList = this.themingService.getThemeList();

  public currentUser: IUser | undefined;

  public selectedTheme = '';

  constructor(
    private readonly store: Store,
    private readonly themingService: ThemingService,
  ) {
  }

  ngOnInit(): void {
    const userSession = StorageService.getItem<IUser>('sessionStorage', STORAGE_KEYS['user']);
    if (!userSession) {
      return;
    }

    this.currentUser = userSession;

    this.selectedTheme = this.themingService.getThemeName();
  }

  public onSelectedThemeChange(): void {
    this.themingService.setTheme(this.selectedTheme);
  }
}
