import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { storeMock } from '../../../__mocks__/services/store.mock';
import { tagListMock } from '../../../__mocks__/tag-list.mock';
import { ITag } from '../../../core/interfaces/models/tag.interface';

import { TagsService } from './tags.service';


describe('TagsService', () => {
  let service: TagsService;
  let storeSelectSpy: jest.SpyInstance<any, any>;
  let consoleWarnSpy: jest.SpyInstance<any, any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeMock },
      ],
    });

    service = TestBed.inject(TagsService);
    storeSelectSpy = jest.spyOn(storeMock, 'select');
    consoleWarnSpy = jest.spyOn(console, 'warn');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTags', () => {
    it('should return an empty list if the store didn\'t return any tags', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(undefined));

      const allTags = await service.getAllTags();
      expect(allTags).toStrictEqual([]);
    });

    it('should return the list of tags if the store loaded them', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(tagListMock) as Observable<ITag[]>);

      const allTags = await service.getAllTags();
      expect(allTags).toStrictEqual(tagListMock);
    });
  });

  describe('getTagsByIds', () => {
    it('should return found tags by their ids', () => {
      expect(service.getTagsByIds([2, 3], tagListMock)).toStrictEqual([
        { id: 2, name: 'tag2', times: 2, weight: 2 },
        { id: 3, name: 'tag3', times: 3, weight: 3 },
      ]);
    });

    it('should return only valid tags found by their ids and warn for unknown reference', () => {
      expect(service.getTagsByIds([0, 4, 5], tagListMock)).toStrictEqual([
        { id: 4, name: 'tag4', times: 4, weight: 4 },
      ]);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenNthCalledWith(1, `Unknown tag id found: 0 at position 0.`);
      expect(consoleWarnSpy).toHaveBeenNthCalledWith(2, `Unknown tag id found: 5 at position 2.`);
    });
  });
});
