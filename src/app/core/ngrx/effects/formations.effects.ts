// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs/operators';
import { FormationsActions } from '../ngrx-index';
import { IFormation } from '../../core-index';
import { ApiV0Service, TagsService, UtilsService } from '../../../shared/shared-index';

/**
 * Effects for formations actions
 */
@Injectable()
export class FormationsEffects {
  /**
   * Effect for the fetchFormations action
   */
  fetchFormations$ = createEffect(() => this.actions$.pipe(
    ofType(FormationsActions.fetchFormations),
    mergeMap(() => this.apiV0Service.getData<IFormation[]>('formations')),
    tap((formationList) => {
      if (!formationList || !formationList.length) {
        this.store.dispatch(FormationsActions.fetchFormationsFailure());
        return;
      }

      this.tagsService.getAllTags().then((allTags) => {
        const listWithTags = formationList.map((formation) => ({
          ...formation,
          tagList: this.tagsService.getTagsByIds(formation.tagIdList, allTags),
        }));

        this.store.dispatch(FormationsActions.fetchFormationsSuccess({
          formationList: listWithTags,
        }));
      });
    }),
  ), { dispatch: false });

  /**
   * Effect for the fetchFormationsFailure action
   */
  fetchFormationsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(FormationsActions.fetchFormationsFailure),
    tap(() => {
      console.log('fetch Formations Failure');
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
