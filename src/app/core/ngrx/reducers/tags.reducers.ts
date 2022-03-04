import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { ITag } from '../../interfaces/models/tag.interface';
import * as TagsActions from '../actions/tags.actions';

/**
 * Tags State
 */
export interface TagsState extends EntityState<ITag> {
  selectedTagId?: number;
}

/**
 * Tags Adapter
 */
export const adapter: EntityAdapter<ITag> = createEntityAdapter<ITag>();

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
