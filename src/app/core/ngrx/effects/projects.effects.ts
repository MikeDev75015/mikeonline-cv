// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of, repeat } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ApiService } from '../../../shared';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';
import { ProjectV1 } from '../../interfaces/models/v1/project.interface';
import { appLoadingFailure } from '../actions/application.actions';
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
    mergeMap(() => this.apiV0Service.getData<ProjectV1[]>(ApiV1Path.PROJECTS)),
    map((projectList) => {
      if (!projectList || !projectList.length) {
        return appLoadingFailure();
      }

      return ProjectsActions.fetchProjectsSuccess({ projectList: projectList.filter((el) => el.position >= 0) });
    }),
    catchError(() => of(appLoadingFailure())),
    repeat(),
  ));

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
