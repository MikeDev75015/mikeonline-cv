import { of } from 'rxjs';

export const dataServiceMock = {
  getCvInfos: () => Promise.resolve(),
  isCompetencesLoaded: () => of(false),
}
