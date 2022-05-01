// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of, repeat } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ApiService } from '../../../shared';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';
import { InterestV1 } from '../../interfaces/models/v1/interest.interface';
import { appLoadingFailure } from '../actions/application.actions';
import { InterestsActions } from '../ngrx-index';

/**
 * Effects for interests actions
 */
@Injectable()
export class InterestsEffects {
  /**
   * Effect for the fetchInterests action
   */
  fetchInterests$ = createEffect(() => this.actions$.pipe(
    ofType(InterestsActions.fetchInterests),
    mergeMap(() => this.apiV0Service.getData<InterestV1[]>(ApiV1Path.INTERESTS)),
    map((interestList) => {
      if (!interestList || !interestList.length) {
        return appLoadingFailure();
      }

      return InterestsActions.fetchInterestsSuccess({ interestList: interestList.filter((el) => el.position >= 0) });
    }),
    catchError(() => of(appLoadingFailure())),
    repeat(),
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
