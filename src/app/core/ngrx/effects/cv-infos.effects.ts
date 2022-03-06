// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ApiV0Service } from '../../../shared';
import * as CvInfosActions from '../actions/cv-infos.actions';
import * as TagsActions from '../actions/tags.actions';
import { CvInfosState } from '../reducers/cv-infos.reducers';

/**
 * Effects for cv infos actions
 */
@Injectable()
export class CvInfosEffects {
  loadCvInfos$ = createEffect(() => this.actions$.pipe(
    ofType(CvInfosActions.loadCvInfos),
    mergeMap(() => this.apiV0Service.getData<CvInfosState[]>('cv-infos')),
    map(([cvInfos]) => {
      if (!cvInfos) {
        return CvInfosActions.loadCvInfosFailure();
      }

      return CvInfosActions.loadCvInfosSuccess({ cvInfos });
    }),
  ));

  loadCvInfosSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CvInfosActions.loadCvInfosSuccess),
    tap(() => this.store.dispatch(TagsActions.fetchTags())),
  ), { dispatch: false });

  loadCvInfosFailure$ = createEffect(() => this.actions$.pipe(
    ofType(CvInfosActions.loadCvInfosFailure),
    tap(() => {
      console.log('load Cv Infos Failure');
    }),
  ), { dispatch: false });

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
