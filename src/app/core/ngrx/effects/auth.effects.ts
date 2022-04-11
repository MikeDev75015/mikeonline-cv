// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
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
    mergeMap((payload) => this.authService.login(payload)),
    map((user) => {
      if (!user || !user.id) {
        return AuthActions.loginUserFailure();
      }

      StorageService.setItem('sessionStorage', STORAGE_KEYS['user'], user);
      return AuthActions.loginUserSuccess({ user });
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
    tap(async () => {
      StorageService.removeItem('sessionStorage', STORAGE_KEYS['user']);
      await this.router.navigate(['/admin/sign-in']);
    }),
  ), { dispatch: false });

  loginUserFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginUserFailure),
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
}
