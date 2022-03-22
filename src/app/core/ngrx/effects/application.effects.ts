// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { ApplicationActions, CvInfosActions } from '../ngrx-index';
import { ApiV0Service } from '../../../shared/shared-index';

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
      console.log('app Loading Failure');
    }),
    map(() => ApplicationActions.endAppLoading()),
  ));

  /**
   * @ignore
   * @param actions$
   * @param store
   * @param apiV0Service
   */
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly apiV0Service: ApiV0Service,
  ) {
  }
}
