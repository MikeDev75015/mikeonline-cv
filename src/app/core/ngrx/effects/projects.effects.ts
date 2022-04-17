// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs/operators';
import { ApiService, TagsService } from '../../../shared';
import { ProjectV1 } from '../../interfaces/models/v1/project.interface';
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
    mergeMap(() => this.apiV0Service.getData<ProjectV1[]>('projects')),
    tap((projectList) => {
      if (!projectList || !projectList.length) {
        this.store.dispatch(ProjectsActions.fetchProjectsFailure());
        return;
      }

      this.store.dispatch(ProjectsActions.fetchProjectsSuccess({ projectList }));
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
    private readonly apiV0Service: ApiService,
    private readonly tagsService: TagsService,
  ) {
  }
}
