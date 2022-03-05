import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as TagsReducers from '../reducers/tags.reducers';
import { TagsState } from '../reducers/tags.reducers';

const tagsState = createFeatureSelector<TagsState>('tags');

/**
 * Creates an ngrx selector allowing to retrieve all tags in TagsState
 */
export const selectTagsState = createSelector(
  tagsState,
  (state: TagsState) => state,
);

/**
 * Get the selectors
 */
const { selectAll } = TagsReducers.adapter.getSelectors(selectTagsState);

/**
 * Selector for all tags
 */
export const selectAllTags = selectAll;
