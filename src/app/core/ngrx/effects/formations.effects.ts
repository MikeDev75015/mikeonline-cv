// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of, repeat } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ApiService } from '../../../shared';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';
import { FormationV1 } from '../../interfaces/models/v1/formation.interface';
import { appLoadingFailure } from '../actions/application.actions';
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
    mergeMap(() => this.apiV0Service.getData<FormationV1[]>(ApiV1Path.FORMATIONS)),
    map((formationList) => {
      if (!formationList || !formationList.length) {
        return appLoadingFailure();
      }

      return FormationsActions.fetchFormationsSuccess({ formationList });
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
