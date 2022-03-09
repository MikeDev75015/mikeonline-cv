import { of } from 'rxjs';

export const dataServiceMock = {
  getStoreData: () => Promise.resolve(),
  extractUsedTags: () => Promise.resolve(),
  isAllDataLoaded: () => of(false),
  isDataLoaded: () => of(false),
  getSummary: jest.fn(),
};
