import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ICvInfos } from '../../interfaces/models/cv-infos.interface';
import { CvInfosState } from '../reducers/cv-infos.reducers';

const cvInfosState = createFeatureSelector<CvInfosState>('cvInfos');

/**
 * Creates the ngrx selector allowing to retrieve the cvInfos in CvInfosState
 */
export const selectCvInfos = createSelector(
  cvInfosState,
  (state: CvInfosState) => state as ICvInfos,
);
