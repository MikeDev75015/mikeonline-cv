import { createSelector } from '@ngrx/store';
import { ICvInfos } from '../../interfaces/models/cv-infos.interface';
import { CvInfosState } from '../reducers/cv-infos.reducers';

/**
 * Returns the cvInfos
 * @param cvInfos
 */
const cvInfosState = (cvInfos: ICvInfos) => cvInfos;

/**
 * Creates the ngrx selector allowing to retrieve the cvInfos in CvInfosState
 */
export const selectCvInfos = createSelector(
  cvInfosState,
  (cvInfos: ICvInfos) => cvInfos,
);
