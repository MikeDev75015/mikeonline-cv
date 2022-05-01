import { createAction, props } from '@ngrx/store';
import { CvInfosV1 } from '../../interfaces/models/v1/cv-infos.interface';

/**
 * load CvInfo
 */
export const loadCvInfos = createAction('[CV Infos] Load CV Infos');

/**
 * load CvInfo Success
 */
export const loadCvInfosSuccess = createAction('[CV Infos] Load CV Infos Success', props<{ cvInfos: CvInfosV1; }>());
