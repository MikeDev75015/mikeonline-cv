// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
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
      console.debug('login response:', accessToken);
      if (!accessToken) {
        return AuthActions.loginUserFailure();
      }
      return AuthActions.loginUserSuccess({ accessToken });
    }),
  ));

  loginUserSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginUserSuccess),
    tap(async ({ user }) => {
      await this.router.navigate(['/admin']);
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
      await this.router.navigate(['/admin']);
    }),
  ), { dispatch: false });

  getUserFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.getUserFailure),
    tap(() => {
      console.warn('loginUserFailure$ error: User not found!');
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
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
  }

  private cleanStorageAccessToken(navigateToSignInPage = false): void {
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
