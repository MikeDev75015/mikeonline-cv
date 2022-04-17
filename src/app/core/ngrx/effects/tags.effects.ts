// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import {
  CompetencesActions, InterestsActions, TagsActions, ExperiencesActions, FormationsActions, ProjectsActions,
} from '../ngrx-index';
import { ITag } from '../../index';
import { ApiV0Service } from '../../../shared';

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
    mergeMap(() => this.apiV0Service.getData<ITag[]>('tags')),
    map((tagList) => {
      if (!tagList || !tagList.length) {
        return TagsActions.fetchTagsFailure();
      }

      return TagsActions.fetchTagsSuccess({ tagList });
    }),
  ));

  /**
   * Effect for the fetchTagsSuccess action
   */
  fetchTagsSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(TagsActions.fetchTagsSuccess),
    tap(() => {
      this.store.dispatch(CompetencesActions.fetchCompetences());
      this.store.dispatch(ExperiencesActions.fetchExperiences());
      this.store.dispatch(FormationsActions.fetchFormations());
      this.store.dispatch(ProjectsActions.fetchProjects());
      this.store.dispatch(InterestsActions.fetchInterests());
    }),
  ), { dispatch: false });

  /**
   * Effect for the fetchTagsFailure action
   */
  fetchTagsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(TagsActions.fetchTagsFailure),
    tap(() => {
      console.log('fetch Tags Failure');
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
