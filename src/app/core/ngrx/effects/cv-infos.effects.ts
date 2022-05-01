// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of, repeat } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from '../../../shared';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';
import { CvInfosV1 } from '../../interfaces/models/v1/cv-infos.interface';
import { appLoadingFailure } from '../actions/application.actions';
import { ApplicationActions, CvInfosActions, TagsActions } from '../ngrx-index';

/**
 * Effects for cv infos actions
 */
@Injectable()
export class CvInfosEffects {
  loadCvInfos$ = createEffect(() => this.actions$.pipe(
    ofType(CvInfosActions.loadCvInfos),
    mergeMap(() => this.apiV0Service.getData<CvInfosV1[]>(ApiV1Path.CV_INFOS)),
    map(([cvInfos]) => {
      if (!cvInfos) {
        return appLoadingFailure();
      }

      return CvInfosActions.loadCvInfosSuccess({ cvInfos });
    }),
    catchError(() => of(appLoadingFailure())),
    repeat(),
  ));

  loadCvInfosSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(CvInfosActions.loadCvInfosSuccess),
    tap(() => {
      this.store.dispatch(ApplicationActions.cvInfosLoaded());
    }),
    map(() => TagsActions.fetchTags()),
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
    private readonly apiV0Service: ApiService,
  ) {
  }
}
