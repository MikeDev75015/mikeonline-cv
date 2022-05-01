import { createAction, props } from '@ngrx/store';
import { InterestV1 } from '../../interfaces/models/v1/interest.interface';

/**
 * Fetch Interests
 */
export const fetchInterests = createAction('[Interests] Fetch Interests');

/**
 * Fetch Interests Success
 */
export const fetchInterestsSuccess = createAction(
  '[Interests] Fetch Interests Success', props<{ interestList: InterestV1[] }>(),
);
