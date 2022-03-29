import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { storeMock } from '../../../__mocks__/services/store.mock';
import { tagListMock } from '../../../__mocks__/tag-list.mock';
import { ITag } from '../../../core/interfaces/models/tag.interface';
import { selectAllTags } from '../../../core/ngrx/selectors/tags.selectors';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let storeSelectSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeMock },
      ],
    });
    service = TestBed.inject(DataService);

    storeSelectSpy = jest.spyOn(storeMock, 'select');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStoreData', () => {
    it('should return default value if store has no data', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(undefined));
      const allTags = await service.getStoreData<ITag[]>({
        selector: selectAllTags,
        defaultValue: [],
      });
      expect(allTags).toStrictEqual([]);
    });

    it('should return a complete list if no value are provided', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(tagListMock));
      const allTags = await service.getStoreData<ITag[]>({
        selector: selectAllTags,
        defaultValue: [],
      });
      expect(allTags).toStrictEqual(tagListMock);
    });

    it('should return a partial list if a value is provided', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(tagListMock));
      const allTags = await service.getStoreData<ITag[]>({
        selector: selectAllTags,
        defaultValue: [],
        value: 14,
      });
      expect(allTags).toStrictEqual([{ id: 14, name: 'tag14', times: 4, weight: 4 }]);
    });

    it('should return a partial list if a value and a property are provided', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(tagListMock));
      const allTags = await service.getStoreData<ITag[]>({
        selector: selectAllTags,
        defaultValue: [],
        value: 'tag22',
        property: 'name'
      });
      expect(allTags).toStrictEqual([{ id: 22, name: 'tag22', times: 2, weight: 2 }]);
    });
  });
});
