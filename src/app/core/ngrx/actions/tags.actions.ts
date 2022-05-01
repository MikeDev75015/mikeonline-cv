import { createAction, props } from '@ngrx/store';
import { TagV1 } from '../../interfaces/models/v1/tag.interface';

/**
 * Fetch Tags
 */
export const fetchTags = createAction('[Tags] Fetch Tags');

/**
 * Fetch Tags Success
 */
export const fetchTagsSuccess = createAction(
  '[Tags] Fetch Tags Success', props<{ tagList: TagV1[] }>(),
);
