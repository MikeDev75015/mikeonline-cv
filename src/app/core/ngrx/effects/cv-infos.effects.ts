// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ApiV0Service } from '../../../shared';
import { ICvInfos } from '../../index';
import { ApplicationActions, CvInfosActions, TagsActions } from '../ngrx-index';

/**
 * Effects for cv infos actions
 */
@Injectable()
export class CvInfosEffects {
  loadCvInfos$ = createEffect(() => this.actions$.pipe(
    ofType(CvInfosActions.loadCvInfos),
    mergeMap(() => this.apiV0Service.getData<ICvInfos[]>('cv-infos')),
    map(([cvInfos]) => {
      if (!cvInfos) {
        return CvInfosActions.loadCvInfosFailure();
      }

      return CvInfosActions.loadCvInfosSuccess({ cvInfos });
    }),
  ));

  loadCvInfosSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CvInfosActions.loadCvInfosSuccess),
    tap(() => {
      this.store.dispatch(TagsActions.fetchTags());
    }),
    map(() => ApplicationActions.cvInfosLoaded()),
  ));

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
