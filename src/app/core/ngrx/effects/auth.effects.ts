// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of, repeat } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { DEFAULT_ADMIN_TABS } from '../../../modules/admin/constants/default-admin-tabs.constant';
import { ExtendedMenuItem } from '../../../modules/admin/interfaces/extended-menu-item.interface';
import { AuthService } from '../../../modules/admin/services/auth/auth.service';
import { STORAGE_KEYS } from '../../constants/storage-keys.constant';
import { StorageService } from '../../services/storage/storage.service';
import { AuthActions } from '../ngrx-index';

/**
 * Effects for cv infos actions
 */
@Injectable()
export class AuthEffects {
  loginUser$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginUser),
    mergeMap(({ username, password }) => this.authService.login({ username, password })),
    map(({ accessToken, refreshToken }) => AuthActions.loginUserSuccess({ accessToken, refreshToken })),
    catchError(() => of(AuthActions.loginUserFailure())),
    repeat(),
  ));

  loginUserFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginUserFailure),
    tap(() => {
      this.cleanStorageItems();
    }),
  ), { dispatch: false });

  loginUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginUserSuccess),
    tap(({ accessToken, refreshToken }) => {
      this.authService.setTokens({ accessToken, refreshToken });
    }),
    map(() => AuthActions.getUser()),
  ));

  getUser$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.getUser),
    mergeMap(() => this.authService.getUserAccount()),
    map((user) => AuthActions.getUserSuccess({ user })),
    catchError(() => of(AuthActions.getUserFailure())),
    repeat(),
  ));

  getUserFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.getUserFailure),
    tap(() => {
      this.cleanStorageItems(true);
    }),
  ), { dispatch: false });

  getUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.getUserSuccess),
    tap(async () => {
      const activeItem = StorageService.getItem<ExtendedMenuItem>('sessionStorage', STORAGE_KEYS.activeItem);
      await this.router.navigate([activeItem?.routerLink || DEFAULT_ADMIN_TABS[0].routerLink]);
    }),
  ), { dispatch: false });

  logoutUser$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logoutUser),
    mergeMap(() => this.authService.logout()),
    map(() => AuthActions.logoutUserSuccess()),
    catchError(() => of(AuthActions.logoutUserFailure())),
    repeat(),
  ));

  logoutUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logoutUserSuccess),
    tap(() => {
      this.cleanStorageItems(true);
    }),
  ), { dispatch: false });

  logoutUserFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logoutUserFailure),
    tap(() => {
      this.cleanStorageItems(true);
    }),
  ), { dispatch: false });

  /**
   * @ignore
   * @param actions$
   * @param store
   * @param authService
   * @param router
   */
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
  }

  private cleanStorageItems(navigateToSignInPage = false): void {
    StorageService.removeItem('sessionStorage', STORAGE_KEYS.activeItem);
    this.authService.removeTokens();

    if (!navigateToSignInPage) {
      return;
    }

    console.debug('Storage items removed, redirection to sign-in page!');
    this.router.navigate(['/admin/sign-in']).finally(() => undefined);
  }
}
