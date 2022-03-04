import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ICompetence } from '../../interfaces/models/competence.interface';
import { HttpClientService } from '../../services/http-client.service';
import * as CompetencesActions from '../actions/competences.actions';

/**
 * Effects for competences actions
 */
@Injectable()
export class CompetencesEffects {
  /**
   * Effect for the fetchCompetences action
   */
  fetchCompetences$ = createEffect(() => this.actions$.pipe(
    ofType(CompetencesActions.fetchCompetences),
    mergeMap(() => this.httpClientService.get<ICompetence[]>(`/v0/competences`)),
    map((competenceList) => {
      if (!competenceList || !competenceList.length) {
        return CompetencesActions.fetchCompetencesFailure();
      }

      return CompetencesActions.fetchCompetencesSuccess({ competenceList });
    }),
  ));

  /**
   * Effect for the fetchCompetencesFailure action
   */
  fetchCompetencesFailure$ = createEffect(() => this.actions$.pipe(
    ofType(CompetencesActions.fetchCompetencesFailure),
    tap(() => {
      console.log('fetch Competences Failure');
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
