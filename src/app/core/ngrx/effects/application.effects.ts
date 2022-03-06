// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { ApiV0Service } from '../../../shared';
import * as ApplicationActions from '../actions/application.actions';
import * as CvInfosActions from '../actions/cv-infos.actions';

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
    tap(() => {
      console.log('app Loading Success');
      this.store.dispatch(ApplicationActions.endAppLoading());
      this.store.dispatch(ApplicationActions.hideHeader());
    }),
  ), { dispatch: false });

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
