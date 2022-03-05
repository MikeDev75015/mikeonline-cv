// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ApiV0Service } from '../../../shared/services/api-v0/api-v0.service';
import { IInterest } from '../../interfaces/models/interest.interface';
import * as InterestsActions from '../actions/interests.actions';

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
    mergeMap(() => this.apiV0Service.getData<IInterest[]>('interests')),
    map((interestList) => {
      if (!interestList || !interestList.length) {
        return InterestsActions.fetchInterestsFailure();
      }

      return InterestsActions.fetchInterestsSuccess({ interestList });
    }),
  ));

  /**
   * Effect for the fetchInterestsFailure action
   */
  fetchInterestsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(InterestsActions.fetchInterestsFailure),
    tap(() => {
      console.log('fetch Interests Failure');
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
