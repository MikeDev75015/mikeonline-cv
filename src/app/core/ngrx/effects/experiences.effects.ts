// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs/operators';
import { ApiV0Service } from '../../../shared/services/api-v0/api-v0.service';
import { TagsService } from '../../../shared/services/tags/tags.service';
import { IExperience } from '../../interfaces/models/experience.interface';
import * as ExperiencesActions from '../actions/experiences.actions';

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
    mergeMap(() => this.apiV0Service.getData<IExperience[]>('experiences')),
    tap((experienceList) => {
      if (!experienceList || !experienceList.length) {
        this.store.dispatch(ExperiencesActions.fetchExperiencesFailure());
        return;
      }

      this.tagsService.getAllTags().then((allTags) => {
        this.store.dispatch(ExperiencesActions.fetchExperiencesSuccess({
          experienceList: experienceList.map((experience) => ({
            ...experience,
            tagList: this.tagsService.getTagsByIds(experience.tagIdList, allTags),
          })),
        }));
      });
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
    private readonly apiV0Service: ApiV0Service,
    private readonly tagsService: TagsService,
  ) {
  }
}
