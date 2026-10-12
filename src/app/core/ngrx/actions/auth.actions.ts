import { createAction, props } from '@ngrx/store';
import { UserV1 } from '../../interfaces/models/v1/user.interface';
import { LoginRequest } from '../../interfaces/requests/login.request';

/**
 * login User
 */
export const loginUser = createAction('[Auth] Login', props<LoginRequest>());

/**
 * login User Failure
 */
export const loginUserFailure = createAction('[Auth] Login Failure');

/**
 * login User Success
 */
export const loginUserSuccess = createAction('[Auth] Login Success', props<{ accessToken: string; refreshToken: string; }>());

/**
 * logout User
 */
export const logoutUser = createAction('[Auth] Logout');

/**
 * login User Failure
 */
export const logoutUserFailure = createAction('[Auth] Logout Failure');

/**
 * login User Success
 */
export const logoutUserSuccess = createAction('[Auth] Logout Success');

/**
 * get User
 */
export const getUser = createAction('[User] Get User');

/**
 * get User Failure
 */
export const getUserFailure = createAction('[User] Get User Failure');

/**
 * get User Success
 */
export const getUserSuccess = createAction('[User] Get User Success', props<{ user: UserV1; }>());
