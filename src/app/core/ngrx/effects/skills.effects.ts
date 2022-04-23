// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs/operators';
import { ApiService, TagsService } from '../../../shared';
import { ApiV1Path } from '../../interfaces/api/api-v1-path.enum';
import { SkillV1 } from '../../interfaces/models/v1/skill.interface';
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
    tap((skillList) => {
      if (!skillList || !skillList.length) {
        this.store.dispatch(SkillsActions.fetchSkillsFailure());
        return;
      }

      this.store.dispatch(SkillsActions.fetchSkillsSuccess({ skillList }));
    }),
  ), { dispatch: false });

  /**
   * Effect for the fetchSkillsFailure action
   */
  fetchSkillsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(SkillsActions.fetchSkillsFailure),
    tap(() => {
      console.log('fetch Skills Failure');
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
