// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs/operators';
import { ApiV0Service } from '../../../shared/services/api-v0/api-v0.service';
import { TagsService } from '../../../shared/services/tags/tags.service';
import { ICompetence } from '../../interfaces/models/competence.interface';
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
    mergeMap(() => this.apiV0Service.getData<ICompetence[]>('competences')),
    tap((competenceList) => {
      if (!competenceList || !competenceList.length) {
        this.store.dispatch(CompetencesActions.fetchCompetencesFailure());
        return;
      }

      this.tagsService.getAllTags().then((allTags) => {
        this.store.dispatch(CompetencesActions.fetchCompetencesSuccess({
          competenceList: competenceList.map((competence) => ({
            ...competence,
            tagList: this.tagsService.getTagsByIds(competence.tagIdList, allTags),
          })),
        }));
      });
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
    private readonly apiV0Service: ApiV0Service,
    private readonly tagsService: TagsService,
  ) {
  }
}
