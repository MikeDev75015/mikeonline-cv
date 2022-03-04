import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import { HttpClientService } from '../../services/http-client.service';
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
    mergeMap(() => this.httpClientService.get<IExperience[]>(`/v0/experiences`)),
    map((experienceList) => {
      if (!experienceList || !experienceList.length) {
        return ExperiencesActions.fetchExperiencesFailure();
      }

      return ExperiencesActions.fetchExperiencesSuccess({ experienceList });
    }),
  ));

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
   * @param httpClientService
   */
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly httpClientService: HttpClientService,
  ) {}
}
