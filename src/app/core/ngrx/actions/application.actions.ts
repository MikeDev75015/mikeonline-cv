import { createAction } from '@ngrx/store';

/**
 * Start App Loading
 */
export const startAppLoading = createAction('[App] Start App Loading');

/**
 * End App Loading
 */
export const endAppLoading = createAction('[App] End App Loading');

/**
 * App Loading Success
 */
export const appLoadingSuccess = createAction('[App] App Loading Success');

/**
 * App Loading Failure
 */
export const appLoadingFailure = createAction('[App] App Loading Failure');

/**
 * Show Header
 */
export const showHeader = createAction('[App] Show Header');

/**
 * Cv Infos Loaded
 */
export const cvInfosLoaded = createAction('[App] Cv Infos Loaded');

/**
 * Hide Header
 */
export const hideHeader = createAction('[App] Hide Header');
