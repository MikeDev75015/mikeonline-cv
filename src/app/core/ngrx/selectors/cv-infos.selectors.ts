import { createSelector } from '@ngrx/store';
import { CvInfosState } from '../reducers/cv-infos.reducers';

/**
 * Returns the cvInfos
 * @param cvInfos
 */
const cvInfosState = (cvInfos: CvInfosState) => cvInfos;

/**
 * Creates the ngrx selector allowing to retrieve the cvInfos in CvInfosState
 */
export const selectCvInfos = createSelector(
  cvInfosState,
  (cvInfos: CvInfosState) => cvInfos,
);

/**
 * Creates the ngrx selector allowing to retrieve the cvInfos in CvInfosState
 */
export const selectContact = createSelector(
  cvInfosState,
  (cvInfos: CvInfosState) => cvInfos.contact,
);
