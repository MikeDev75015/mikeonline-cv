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
import { DEFAULT_ADMIN_TABS } from '../../constants/default-admin-tabs.constant';
import { ExtendedMenuItem } from '../../interfaces/extended-menu-item.interface';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  providers: [ThemingService, MessageService],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  public readonly themeList = this.themingService.getThemeList();

  public tabItems: ExtendedMenuItem[] = [];

  public rightItems: ExtendedMenuItem[] = [];

  public currentUser: UserV1 | undefined;

  public activeItem: ExtendedMenuItem | undefined;

  public selectedTheme = '';

  private readonly defaultTabList: ExtendedMenuItem[] = DEFAULT_ADMIN_TABS;

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly themingService: ThemingService,
  ) {
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

    this.tabItems = this.defaultTabList.map((item) => ({
      ...item,
      command: (event: any) => {
        StorageService.setItem('sessionStorage', STORAGE_KEYS.activeItem, event.item);
      },
    }));

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
