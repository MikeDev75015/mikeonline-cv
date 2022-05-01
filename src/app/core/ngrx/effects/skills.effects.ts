// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of, repeat } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ApiService } from '../../../shared';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';
import { SkillV1 } from '../../interfaces/models/v1/skill.interface';
import { appLoadingFailure } from '../actions/application.actions';
import { SkillsActions } from '../ngrx-index';

/**
 * Effects for skills actions
 */
@Injectable()
export class SkillsEffects {
  /**
   * Effect for the fetchSkills action
   */
  fetchSkills$ = createEffect(() => this.actions$.pipe(
    ofType(SkillsActions.fetchSkills),
    mergeMap(() => this.apiV0Service.getData<SkillV1[]>(ApiV1Path.SKILLS)),
    map((skillList) => {
      if (!skillList || !skillList.length) {
        return appLoadingFailure();
      }

      return SkillsActions.fetchSkillsSuccess({ skillList });
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
