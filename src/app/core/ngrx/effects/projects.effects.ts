import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import { HttpClientService } from '../../services/http-client.service';
import { IProject } from '../../interfaces/models/project.interface';
import * as ProjectsActions from '../actions/projects.actions';

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
    mergeMap(() => this.httpClientService.get<IProject[]>(`/v0/projects`)),
    map((projectList) => {
      if (!projectList || !projectList.length) {
        return ProjectsActions.fetchProjectsFailure();
      }

      return ProjectsActions.fetchProjectsSuccess({ projectList });
    }),
  ));

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
   * @param httpClientService
   */
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly httpClientService: HttpClientService,
  ) {}
}
