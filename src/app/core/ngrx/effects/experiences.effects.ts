// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs/operators';
import { ApiService, TagsService } from '../../../shared';
import { ExperienceV1 } from '../../interfaces/models/v1/experience.interface';
import { ExperiencesActions } from '../ngrx-index';

/**
 * Effects for experiences actions
 */
@Injectable()
export class ExperiencesEffects {
  /**
   * Effect for the fetchExperiences action
   */
  fetchExperiences$ = createEffect(() => this.actions$.pipe(
    ofType(ExperiencesActions.fetchExperiences),
    mergeMap(() => this.apiV0Service.getData<ExperienceV1[]>('experiences')),
    tap((experienceList) => {
      if (!experienceList || !experienceList.length) {
        this.store.dispatch(ExperiencesActions.fetchExperiencesFailure());
        return;
      }

      this.store.dispatch(ExperiencesActions.fetchExperiencesSuccess({ experienceList }));
    }),
  ), { dispatch: false });

  /**
   * Effect for the fetchExperiencesFailure action
   */
  fetchExperiencesFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ExperiencesActions.fetchExperiencesFailure),
    tap(() => {
      console.log('fetch Experiences Failure');
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
