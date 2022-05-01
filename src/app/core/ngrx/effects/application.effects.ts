// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { ApiService } from '../../../shared';
import { ApplicationActions, CvInfosActions } from '../ngrx-index';

/**
 * Effects for cv infos actions
 */
@Injectable()
export class ApplicationEffects {
  startAppLoading$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.startAppLoading),
    map(() => CvInfosActions.loadCvInfos())
  ));

  appLoadingSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.appLoadingSuccess),
    map(() => ApplicationActions.endAppLoading()),
  ));

  appLoadingFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ApplicationActions.appLoadingFailure),
    tap(() => {
      this.redirectToMaintenancePage();
    }),
    map(() => ApplicationActions.endAppLoading()),
  ));

  /**
   * @ignore
   * @param actions$
   * @param store
   * @param router
   * @param apiV0Service
   */
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router,
    private readonly apiV0Service: ApiService,
  ) {
  }

  private redirectToMaintenancePage(): void {
    this.router.navigate(['/maintenance']).finally(() => {
      console.debug('App Loading Failure');
    });
  }
}
