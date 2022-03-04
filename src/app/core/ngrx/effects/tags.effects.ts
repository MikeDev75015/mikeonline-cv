import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, tap } from 'rxjs/operators';
import { HttpClientService } from '../../services/http-client.service';
import { ITag } from '../../interfaces/models/tag.interface';
import * as TagsActions from '../actions/tags.actions';

/**
 * Effects for tags actions
 */
@Injectable()
export class TagsEffects {
  /**
   * Effect for the fetchTags action
   */
  fetchTags$ = createEffect(() => this.actions$.pipe(
    ofType(TagsActions.fetchTags),
    mergeMap(() => this.httpClientService.get<ITag[]>(`/v0/tags`)),
    map((tagList) => {
      if (!tagList || !tagList.length) {
        return TagsActions.fetchTagsFailure();
      }

      return TagsActions.fetchTagsSuccess({ tagList });
    }),
  ));

  /**
   * Effect for the fetchTagsFailure action
   */
  fetchTagsFailure$ = createEffect(() => this.actions$.pipe(
    ofType(TagsActions.fetchTagsFailure),
    tap(() => {
      console.log('fetch Tags Failure');
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
