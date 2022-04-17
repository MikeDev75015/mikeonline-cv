import { createAction, props } from '@ngrx/store';
import { IInterest } from '../../interfaces/models/v0/interest.interface';

/**
 * Fetch Interests
 */
export const fetchInterests = createAction('[Interests] Fetch Interests');

/**
 * Fetch Interests Failure
 */
export const fetchInterestsFailure = createAction('[Interests] Fetch Interests Failure');

/**
 * Fetch Interests Success
 */
export const fetchInterestsSuccess = createAction(
  '[Interests] Fetch Interests Success', props<{ interestList: IInterest[] }>(),
);
