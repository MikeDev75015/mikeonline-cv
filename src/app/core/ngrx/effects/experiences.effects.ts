// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of, repeat } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ApiService } from '../../../shared';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';
import { ExperienceV1 } from '../../interfaces/models/v1/experience.interface';
import { appLoadingFailure } from '../actions/application.actions';
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
    mergeMap(() => this.apiV0Service.getData<ExperienceV1[]>(ApiV1Path.EXPERIENCES)),
    map((experienceList) => {
      if (!experienceList || !experienceList.length) {
        return appLoadingFailure();
      }

      return ExperiencesActions.fetchExperiencesSuccess({ experienceList });
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
