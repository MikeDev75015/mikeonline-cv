// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs/operators';
import { ApiService, TagsService } from '../../../shared';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';
import { SkillV1 } from '../../interfaces/models/v1/skill.interface';
import { CompetencesActions } from '../ngrx-index';

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
    mergeMap(() => this.apiV0Service.getData<SkillV1[]>(ApiV1Path.SKILLS)),
    tap((competenceList) => {
      if (!competenceList || !competenceList.length) {
        this.store.dispatch(CompetencesActions.fetchCompetencesFailure());
        return;
      }

      this.store.dispatch(CompetencesActions.fetchCompetencesSuccess({ competenceList }));
    }),
  ), { dispatch: false });

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
