import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { TagV1 } from '../../interfaces/models/v1/tag.interface';
import * as TagsActions from '../actions/tags.actions';

/**
 * Tags State
 */
export interface TagsState extends EntityState<TagV1> {
  selectedTagId?: string;
}

/**
 * Tags Adapter
 */
export const adapter: EntityAdapter<TagV1> = createEntityAdapter<TagV1>();

/**
 * Tags Initial State
 */
export const initialState: TagsState = adapter.getInitialState({
  selectedTagId: undefined,
});

/**
 * Tags Reducer
 */
const tagsReducer = createReducer(
  initialState,
  on(TagsActions.fetchTagsSuccess, (state: TagsState, { tagList }) => adapter.addMany(tagList, state)),
);

/**
 * Tags Reducer
 * @param state
 * @param action
 */
export function reducer(state: TagsState | undefined, action: Action): TagsState {
  return tagsReducer(state, action);
}
