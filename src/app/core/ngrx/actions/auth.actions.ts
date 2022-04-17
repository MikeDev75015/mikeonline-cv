import { createAction, props } from '@ngrx/store';
import { UserV1 } from '../../interfaces/models/v1/user.interface';
import { LoginPayloadRequest } from '../../interfaces/requests/login-payload.request';

/**
 * login User
 */
export const loginUser = createAction('[User] Login', props<LoginPayloadRequest>());

/**
 * login User Failure
 */
export const loginUserFailure = createAction('[User] Login Failure');

/**
 * login User Success
 */
export const loginUserSuccess = createAction('[User] Login Success', props<{ user: UserV1; }>());

/**
 * logout User
 */
export const logoutUser = createAction('[User] Logout');
