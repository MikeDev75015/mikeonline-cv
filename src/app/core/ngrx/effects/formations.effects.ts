import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import { HttpClientService } from '../../services/http-client.service';
import { IFormation } from '../../interfaces/models/formation.interface';
import * as FormationsActions from '../actions/formations.actions';

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
    mergeMap(() => this.httpClientService.get<IFormation[]>(`/v0/formations`)),
    map((formationList) => {
      if (!formationList || !formationList.length) {
        return FormationsActions.fetchFormationsFailure();
      }

      return FormationsActions.fetchFormationsSuccess({ formationList });
    }),
  ));

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
   * @param httpClientService
   */
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly httpClientService: HttpClientService,
  ) {}
}
