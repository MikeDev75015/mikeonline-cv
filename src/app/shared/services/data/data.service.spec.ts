import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { lastValueFrom, of } from 'rxjs';
import { storeMock } from '../../../../../__mocks__/services/store.mock';
import cvInfoListMock from '../../../../../__mocks__/v1/json-files/cv-infos.json';
import unsortedExperienceListMock from '../../../../../__mocks__/v1/json-files/experiences.json';
import unsortedFormationListMock from '../../../../../__mocks__/v1/json-files/formations.json';
import unsortedProjectListMock from '../../../../../__mocks__/v1/json-files/projects.json';
import competenceListMock from '../../../../../__mocks__/v1/json-files/skills.json';
import tagListMock from '../../../../../__mocks__/v1/json-files/tags.json';
import { CvInfosV1 } from '../../../core/interfaces/models/v1/cv-infos.interface';
import { TagV1 } from '../../../core/interfaces/models/v1/tag.interface';
import { ApplicationActions } from '../../../core/ngrx/ngrx-index';
import { selectAppCvInfosLoaded } from '../../../core/ngrx/selectors/application.selectors';
import { selectCvInfos } from '../../../core/ngrx/selectors/cv-infos.selectors';
import { selectAllExperiences, selectExperiencesLoaded } from '../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations, selectFormationsLoaded } from '../../../core/ngrx/selectors/formations.selectors';
import { selectInterestsLoaded } from '../../../core/ngrx/selectors/interests.selectors';
import { selectAllProjects, selectProjectsLoaded } from '../../../core/ngrx/selectors/projects.selectors';
import { selectAllSkills, selectSkillsLoaded } from '../../../core/ngrx/selectors/skills.selectors';
import { selectAllTags } from '../../../core/ngrx/selectors/tags.selectors';

import { DataService } from './data.service';

const cvInfoMock = cvInfoListMock[0];
const contactMock = cvInfoMock.contact;

describe('DataService', () => {
  let service: DataService;
  let storeSelectSpy: any;
  let storeDispatchSpy: any;
  let consoleDebugSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeMock },
      ],
    });
    service = TestBed.inject(DataService);

    storeSelectSpy = jest.spyOn(storeMock, 'select');
    storeDispatchSpy = jest.spyOn(storeMock, 'dispatch');
    consoleDebugSpy = jest.spyOn(console, 'debug');
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
      const allTags = await service.getStoreData<TagV1[]>({
        selector: selectAllTags,
        defaultValue: [],
      });
      expect(allTags).toStrictEqual([]);
    });

    it('should return a complete list if no value is provided', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(tagListMock));
      const allTags = await service.getStoreData<TagV1[]>({
        selector: selectAllTags,
        defaultValue: [],
      });
      expect(allTags).toStrictEqual(tagListMock);
    });

    it('should return a partial list if a value is provided', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(tagListMock));
      const allTags = await service.getStoreData<TagV1[]>({
        selector: selectAllTags,
        defaultValue: [],
        value: '3XiDX2mfE9FPgoUMlMQtc',
      });
      expect(allTags).toStrictEqual([{ id: '3XiDX2mfE9FPgoUMlMQtc', name: 'FireBase', weight: 1 }]);
    });

    it('should return a partial list if a value and a property are provided', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(tagListMock));
      const allTags = await service.getStoreData<TagV1[]>({
        selector: selectAllTags,
        defaultValue: [],
        value: 'Angular 2+',
        property: 'name',
      });
      expect(allTags).toStrictEqual([{ id: 'gH73FIaGoHjPwbdPrQ-2w', name: 'Angular 2+', weight: 3 }]);
    });

    it('should return default value if a value and a property are invalid', async () => {
      storeSelectSpy.mockImplementationOnce(() => of([undefined]));
      const allTags = await service.getStoreData<TagV1[]>({
        selector: selectAllTags,
        defaultValue: [{ id: '0', name: 'invalidTag', weight: 0 }],
        value: 'tag0',
        property: 'name',
      });
      expect(allTags).toStrictEqual([{ id: '0', name: 'invalidTag', weight: 0 }]);
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy).toHaveBeenCalledWith('Cannot get the expected value!', { value: 'tag0', property: 'name' });
    });

    it('should return a full object if no property is provided', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(cvInfoMock));
      const cvInfo = await service.getStoreData<CvInfosV1>({
        selector: selectCvInfos,
        defaultValue: {} as CvInfosV1,
      });
      expect(cvInfo).toStrictEqual(cvInfoMock);
    });

    it('should return a value if a property is provided', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(cvInfoMock));
      const contact = await service.getStoreData<CvInfosV1>({
        selector: selectCvInfos,
        defaultValue: { contact: {} } as CvInfosV1,
        property: 'contact',
      });
      expect(contact).toStrictEqual(contactMock);
    });

    it('should return default value if property does not exist', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(cvInfoMock));
      const contact = await service.getStoreData<CvInfosV1>({
        selector: selectCvInfos,
        defaultValue: {} as CvInfosV1,
        property: 'notFound',
      });
      expect(contact).toStrictEqual({});
    });
  });

  describe('getSummary', () => {
    beforeEach(() => {
      storeSelectSpy.mockImplementation((selector: <T>(state: object) => T) => {
        switch (selector) {
          case selectAllSkills:
            return of(competenceListMock);
          case selectAllExperiences:
            return of(unsortedExperienceListMock);
          case selectAllFormations: return of(unsortedFormationListMock);
          case selectAllProjects: return of(unsortedProjectListMock);
          default: return of([]);
        }
      });
    });

    it('should call the store select method four times', async () => {
      await service.getSummary();

      expect(storeSelectSpy).toHaveBeenCalledTimes(4);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(1, selectAllSkills);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(2, selectAllExperiences);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(3, selectAllFormations);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(4, selectAllProjects);
    });
  });

  describe('isAllDataLoaded', () => {
    it('should call the store select method four times and not call store dispatch method if falsy', async () => {
      storeSelectSpy.mockImplementation(() => of(false));
      const result = await lastValueFrom(service.isAllDataLoaded());

      expect(result).toBeFalsy();
      expect(storeSelectSpy).toHaveBeenCalledTimes(6);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(1, selectAppCvInfosLoaded);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(2, selectSkillsLoaded);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(3, selectExperiencesLoaded);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(4, selectFormationsLoaded);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(5, selectProjectsLoaded);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(6, selectInterestsLoaded);

      expect(storeDispatchSpy).not.toHaveBeenCalled();
    });

    it('should call store dispatch method if truthy', async () => {
      storeSelectSpy.mockImplementation(() => of(true));
      const result = await lastValueFrom(service.isAllDataLoaded());

      expect(result).toBeTruthy();
      expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
      expect(storeDispatchSpy).toHaveBeenCalledWith(ApplicationActions.hideHeader());
    });
  });

  describe('isDataLoaded', () => {
    it('should call the store select method once', async () => {
      storeSelectSpy.mockImplementation(() => of(false));
      await lastValueFrom(service.isDataLoaded(selectAppCvInfosLoaded));

      expect(storeSelectSpy).toHaveBeenCalledTimes(1);
      expect(storeSelectSpy).toHaveBeenCalledWith(selectAppCvInfosLoaded);
    });
  });
});
