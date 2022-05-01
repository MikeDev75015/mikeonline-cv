// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of, repeat } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ApiService } from '../../../shared';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';
import { TagV1 } from '../../interfaces/models/v1/tag.interface';
import { appLoadingFailure } from '../actions/application.actions';
import {
  ExperiencesActions,
  FormationsActions,
  InterestsActions,
  ProjectsActions,
  SkillsActions,
  TagsActions,
} from '../ngrx-index';

/**
 * Effects for tags actions
 */
@Injectable()
export class TagsEffects {
  /**
   * Effect for the fetchTags action
   */
  fetchTags$ = createEffect(() => this.actions$.pipe(
    ofType(TagsActions.fetchTags),
    mergeMap(() => this.apiV0Service.getData<TagV1[]>(ApiV1Path.TAGS)),
    map((tagList) => {
      if (!tagList || !tagList.length) {
        return appLoadingFailure();
      }

      return TagsActions.fetchTagsSuccess({ tagList });
    }),
    catchError(() => of(appLoadingFailure())),
    repeat(),
  ));

  /**
   * Effect for the fetchTagsSuccess action
   */
  fetchTagsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TagsActions.fetchTagsSuccess),
    tap(() => {
      this.store.dispatch(SkillsActions.fetchSkills());
      this.store.dispatch(ExperiencesActions.fetchExperiences());
      this.store.dispatch(FormationsActions.fetchFormations());
      this.store.dispatch(ProjectsActions.fetchProjects());
      this.store.dispatch(InterestsActions.fetchInterests());
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
    private readonly apiV0Service: ApiService,
  ) {
  }
}
