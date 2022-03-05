// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs/operators';
import { ApiV0Service } from '../../../shared/services/api-v0/api-v0.service';
import { TagsService } from '../../../shared/services/tags/tags.service';
import { IFormation } from '../../interfaces/models/formation.interface';
import * as FormationsActions from '../actions/formations.actions';

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
        this.store.dispatch(FormationsActions.fetchFormationsSuccess({
          formationList: formationList.map((formation) => ({
            ...formation,
            tagList: this.tagsService.getTagsByIds(formation.tagIdList, allTags),
          })),
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
