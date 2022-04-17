// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs/operators';
import { ApiV0Service, TagsService } from '../../../shared';
import { IProject } from '../../index';
import { ProjectsActions } from '../ngrx-index';

/**
 * Effects for projects actions
 */
@Injectable()
export class ProjectsEffects {
  /**
   * Effect for the fetchProjects action
   */
  fetchProjects$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.fetchProjects),
    mergeMap(() => this.apiV0Service.getData<IProject[]>('projects')),
    tap((projectList) => {
      if (!projectList || !projectList.length) {
        this.store.dispatch(ProjectsActions.fetchProjectsFailure());
        return;
      }

      this.tagsService.getAllTags().then((allTags) => {
        this.store.dispatch(ProjectsActions.fetchProjectsSuccess({
          projectList: projectList.map((project) => ({
            ...project,
            tagList: this.tagsService.getTagsByIds(project.tagIdList, allTags),
          })),
        }));
      });
    }),
  ), { dispatch: false });

  /**
   * Effect for the fetchProjectsFailure action
   */
  fetchProjectsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(ProjectsActions.fetchProjectsFailure),
    tap(() => {
      console.log('fetch Projects Failure');
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
