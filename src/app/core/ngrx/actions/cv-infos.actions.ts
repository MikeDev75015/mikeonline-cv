import { createAction, props } from '@ngrx/store';
import { CvInfosState } from '../reducers/cv-infos.reducers';

/**
 * load CvInfo
 */
export const loadCvInfos = createAction('[CV Infos] Load CV Infos');

/**
 * load CvInfo Failure
 */
export const loadCvInfosFailure = createAction('[CV Infos] Load CV Infos Failure');

/**
 * load CvInfo Success
 */
export const loadCvInfosSuccess = createAction('[CV Infos] Load CV Infos Success', props<{ cvInfos: CvInfosState; }>());
