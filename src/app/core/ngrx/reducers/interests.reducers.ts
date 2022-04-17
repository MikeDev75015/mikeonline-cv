import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { InterestV1 } from '../../interfaces/models/v1/interest.interface';
import * as InterestsActions from '../actions/interests.actions';

/**
 * Interests State
 */
export interface InterestsState extends EntityState<InterestV1> {
  loaded: boolean;
}

/**
 * Interests Adapter
 */
export const adapter: EntityAdapter<InterestV1> = createEntityAdapter<InterestV1>();

/**
 * Interests Initial State
 */
export const initialState: InterestsState = adapter.getInitialState({
  loaded: false,
});

/**
 * Interests Reducer
 */
const interestsReducer = createReducer(
  initialState,
  on(InterestsActions.fetchInterestsSuccess, (state: InterestsState, { interestList }) => ({
    ...adapter.addMany(interestList, state),
    loaded: true,
  })),
);

/**
 * Interests Reducer
 * @param state
 * @param action
 */
export function reducer(state: InterestsState | undefined, action: Action): InterestsState {
  return interestsReducer(state, action);
}
