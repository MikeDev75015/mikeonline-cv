import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { vi } from 'vitest';
import { storeMock } from '../../../../../__mocks__/services/store.mock';
import tagListMock from '../../../../../__mocks__/v1/json-files/tags.json';
import { TagV1 } from '../../../core/interfaces/models/v1/tag.interface';

import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;
  let storeSelectSpy: any;
  let consoleWarnSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeMock },
      ],
    });

    service = TestBed.inject(TagsService);
    storeSelectSpy = vi.spyOn(storeMock, 'select');
    consoleWarnSpy = vi.spyOn(console, 'warn');
  });

  afterEach(() => {
    vi.clearAllMocks();
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
      storeSelectSpy.mockImplementationOnce(() => of(tagListMock) as Observable<TagV1[]>);

      const allTags = await service.getAllTags();
      expect(allTags).toStrictEqual(tagListMock);
    });
  });

  describe('getTagsByIds', () => {
    it('should return found tags by their ids', () => {
      expect(service.getTagsByIds(['jldY670FZCPQWIE-8l0nl', 'c65M5kAUL3MZFZGdGu5un'], tagListMock)).toStrictEqual([
        { id: 'jldY670FZCPQWIE-8l0nl', name: 'jQuery', weight: 0.4 },
        { id: 'c65M5kAUL3MZFZGdGu5un', name: 'Html 5', weight: 0.5 },
      ]);
    });

    it('should return only valid tags found by their ids and warn for unknown reference', () => {
      expect(service.getTagsByIds(['jldY670FZCPQWIE-8l0nl', '10', '8'], tagListMock)).toStrictEqual([
        { id: 'jldY670FZCPQWIE-8l0nl', name: 'jQuery', weight: 0.4 },
      ]);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenNthCalledWith(1, `Unknown tag id found: 10 at position 1.`);
      expect(consoleWarnSpy).toHaveBeenNthCalledWith(2, `Unknown tag id found: 8 at position 2.`);
    });
  });
});
