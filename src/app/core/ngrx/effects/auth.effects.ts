// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ExtendedMenuItem } from '../../../modules/admin/interfaces/extended-menu-item.interface';
import { AuthService } from '../../../modules/admin/services/auth/auth.service';
import { STORAGE_KEYS } from '../../constants/storage-keys.constant';
import { LoginRequest } from '../../interfaces/requests/login.request';
import { StorageService } from '../../services/storage/storage.service';
import { AuthActions } from '../ngrx-index';

/**
 * Effects for cv infos actions
 */
@Injectable()
export class AuthEffects {
  loginUser$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginUser),
    mergeMap((payload: LoginRequest) => this.authService.login(payload)),
    map(({ accessToken }) => {
      if (!accessToken) {
        return AuthActions.loginUserFailure();
      }
      return AuthActions.loginUserSuccess({ accessToken });
    }),
    catchError(() => of(AuthActions.loginUserFailure())),
  ));

  loginUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginUserSuccess),
    tap(({ accessToken }) => {
      StorageService.setItem('localStorage', STORAGE_KEYS.accessToken, accessToken);
    }),
    map(() => AuthActions.getUser())),
  );

  loginUserFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginUserFailure),
    tap(() => {
      this.cleanStorageAccessToken();
    }),
  ), { dispatch: false });

  logoutUser$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logoutUser),
    mergeMap(() => this.authService.logout()),
    map(() => AuthActions.logoutUserSuccess()),
    catchError(() => of(AuthActions.logoutUserFailure())),
  ));

  logoutUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logoutUserSuccess),
    tap(() => {
      this.cleanStorageAccessToken(true);
    }),
  ), { dispatch: false });

  logoutUserFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logoutUserFailure),
    tap(() => {
      this.cleanStorageAccessToken(true);
    }),
  ), { dispatch: false });

  getUser$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.getUser),
    mergeMap(() => this.authService.getUserAccount()),
    map((user) => {
      if (!user || !user.id) {
        return AuthActions.getUserFailure();
      }
      return AuthActions.getUserSuccess({ user });
    }),
    catchError(() => of(AuthActions.getUserFailure())),
  ));

  getUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.getUserSuccess),
    tap(async () => {
      const activeItem = AuthEffects.getStorageActiveItem();
      await this.router.navigate([activeItem?.routerLink || '/admin']);
    }),
  ), { dispatch: false });

  getUserFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.getUserFailure),
    tap(() => {
      this.cleanStorageAccessToken(true);
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

  private static getStorageActiveItem(): ExtendedMenuItem {
    return StorageService.getItem('sessionStorage', STORAGE_KEYS.activeItem);
  }

  private static removeActiveItemFromStorage(): void {
    StorageService.removeItem('sessionStorage', STORAGE_KEYS.activeItem);
  }

  private cleanStorageAccessToken(navigateToSignInPage = false): void {
    AuthEffects.removeActiveItemFromStorage();
    StorageService.removeItem('localStorage', STORAGE_KEYS.accessToken);
    if (!navigateToSignInPage) {
      console.debug('Access token removed!');
      return;
    }
    this.router.navigate(['/admin/sign-in']).finally(() => {
      console.debug('AuthEffects supposed to have been redirected on the sign in page!');
    });
  }
}
