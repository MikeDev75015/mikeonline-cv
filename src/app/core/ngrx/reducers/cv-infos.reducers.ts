import { Action, createReducer, on } from '@ngrx/store';
import { IContact } from '../../interfaces/contact.interface';
import { IImage } from '../../interfaces/image.interface';
import * as CvInfosActions from '../actions/cv-infos.actions';

export interface CvInfosState {
  id: string;
  fileName: string;
  contact: IContact | undefined;
  title: string;
  technoList: string[];
  logo: IImage | undefined;
  cvType: 'full-cv' | 'partial-cv';
}

export const initialState: CvInfosState = {
  id: '',
  fileName: '',
  contact: undefined,
  title: '',
  technoList: [],
  logo: undefined,
  cvType: 'full-cv',
};

const loadCvInfosReducer = createReducer(
  initialState,
  on(CvInfosActions.loadCvInfosSuccess, (state: CvInfosState, { cvInfos }): CvInfosState => ({ ...state, ...cvInfos })),
);

export function reducer(state: CvInfosState | undefined, action: Action): CvInfosState {
  return loadCvInfosReducer(state, action);
}
