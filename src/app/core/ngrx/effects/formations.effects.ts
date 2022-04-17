// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs/operators';
import { ApiService, TagsService } from '../../../shared';
import { FormationV1 } from '../../interfaces/models/v1/formation.interface';
import { FormationsActions } from '../ngrx-index';

/**
 * Effects for formations actions
 */
@Injectable()
export class FormationsEffects {
  /**
   * Effect for the fetchFormations action
   */
  fetchFormations$ = createEffect(() => this.actions$.pipe(
    ofType(FormationsActions.fetchFormations),
    mergeMap(() => this.apiV0Service.getData<FormationV1[]>('formations')),
    tap((formationList) => {
      if (!formationList || !formationList.length) {
        this.store.dispatch(FormationsActions.fetchFormationsFailure());
        return;
      }

      this.store.dispatch(FormationsActions.fetchFormationsSuccess({ formationList }));
    }),
  ), { dispatch: false });

  /**
   * Effect for the fetchFormationsFailure action
   */
  fetchFormationsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(FormationsActions.fetchFormationsFailure),
    tap(() => {
      console.log('fetch Formations Failure');
    }),
  ), { dispatch: false });

  /**
   * @ignore
   * @param actions$
   * @param store
   * @param apiV0Service
   * @param tagsService
   */
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly apiV0Service: ApiService,
    private readonly tagsService: TagsService,
  ) {
  }
}
