import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { STORAGE_KEYS } from '../../../../core/constants/storage-keys.constant';
import { UserV1 } from '../../../../core/interfaces/models/v1/user.interface';
import { AuthActions } from '../../../../core/ngrx/ngrx-index';
import { selectCurrentUser } from '../../../../core/ngrx/selectors/auth.selectors';
import { StorageService } from '../../../../core/services/storage/storage.service';
import { ThemingService } from '../../../../core/services/theming/theming.service';
import { ExtendedMenuItem } from '../../interfaces/extended-menu-item.interface';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  providers: [ThemingService, MessageService],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  public readonly themeList = this.themingService.getThemeList();

  public leftItems: ExtendedMenuItem[] = [];

  public rightItems: ExtendedMenuItem[] = [];

  public currentUser: UserV1 | undefined;

  public activeItem: ExtendedMenuItem | undefined;

  public selectedTheme = '';

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly themingService: ThemingService,
  ) {
  }

  private static setStorageActiveItem(activeItem: ExtendedMenuItem): void {
    StorageService.setItem('sessionStorage', STORAGE_KEYS.activeItem, activeItem);
  }

  async ngOnInit(): Promise<void> {
    this.subscriptionList.push(
      this.store.pipe(select(selectCurrentUser)).subscribe({
        next: (currentUser) => {
          if (currentUser) {
            this.currentUser = currentUser;
          }
        },
      }),
    );

    this.selectedTheme = this.themingService.getThemeName();

    this.leftItems = [
      {
        label: 'Infos CV', routerLink: '/admin/cv-infos', command: (event: any) => {
          AdminLayoutComponent.setStorageActiveItem(event.item);
        },
      },
      {
        label: 'Tags', routerLink: '/admin/tags', command: (event: any) => {
          AdminLayoutComponent.setStorageActiveItem(event.item);
        },
      },
      {
        label: 'Compétences', routerLink: '/admin/skills', command: (event: any) => {
          AdminLayoutComponent.setStorageActiveItem(event.item);
        },
      },
      {
        label: 'Expériences', routerLink: '/admin/experiences', command: (event: any) => {
          AdminLayoutComponent.setStorageActiveItem(event.item);
        },
      },
      {
        label: 'Formations', routerLink: '/admin/formations', command: (event: any) => {
          AdminLayoutComponent.setStorageActiveItem(event.item);
        },
      },
      {
        label: 'Projets', routerLink: '/admin/projects', command: (event: any) => {
          AdminLayoutComponent.setStorageActiveItem(event.item);
        },
      },
      {
        label: 'Centre d\'Intérêts', routerLink: '/admin/interests', command: (event: any) => {
          AdminLayoutComponent.setStorageActiveItem(event.item);
        },
      },
    ];

    this.rightItems = [
      { label: 'Voir le site', routerLink: '/' },
      {
        label: 'Se déconnecter', matIcon: 'logout',
        command: () => {
          this.store.dispatch(AuthActions.logoutUser());
        },
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  public onSelectedThemeChange(selectedValue: any): void {
    this.selectedTheme = selectedValue;
    this.themingService.setTheme(this.selectedTheme);
  }
}
