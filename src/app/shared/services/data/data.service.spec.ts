import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { lastValueFrom, of } from 'rxjs';
import { competenceListMock } from '../../../__mocks__/data/competence-list.mock';
import { contactMock } from '../../../__mocks__/data/contact.mock';
import { cvInfoMock } from '../../../__mocks__/data/cv-info.mock';
import { experienceListMock } from '../../../__mocks__/data/experience-list.mock';
import { formationListMock } from '../../../__mocks__/data/formation-list.mock';
import { projectListMock } from '../../../__mocks__/data/project-list.mock';
import { storeMock } from '../../../__mocks__/services/store.mock';
import { tagListMock } from '../../../__mocks__/data/tag-list.mock';
import { ICvInfos } from '../../../core/interfaces/models/cv-infos.interface';
import { ITag } from '../../../core/interfaces/models/tag.interface';
import { selectAppCvInfosLoaded } from '../../../core/ngrx/selectors/application.selectors';
import { selectAllCompetences, selectCompetencesLoaded } from '../../../core/ngrx/selectors/competences.selectors';
import { selectCvInfos } from '../../../core/ngrx/selectors/cv-infos.selectors';
import { selectAllExperiences, selectExperiencesLoaded } from '../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations, selectFormationsLoaded } from '../../../core/ngrx/selectors/formations.selectors';
import { selectInterestsLoaded } from '../../../core/ngrx/selectors/interests.selectors';
import { selectAllProjects, selectProjectsLoaded } from '../../../core/ngrx/selectors/projects.selectors';
import { selectAllTags } from '../../../core/ngrx/selectors/tags.selectors';
import { ApplicationActions } from '../../../core/ngrx/ngrx-index';

import { DataService } from './data.service';

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
      const allTags = await service.getStoreData<ITag[]>({
        selector: selectAllTags,
        defaultValue: [],
      });
      expect(allTags).toStrictEqual([]);
    });

    it('should return a complete list if no value is provided', async () => {
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

    it('should return default value if a value and a property are invalid', async () => {
      storeSelectSpy.mockImplementationOnce(() => of([undefined]));
      const allTags = await service.getStoreData<ITag[]>({
        selector: selectAllTags,
        defaultValue: [{ id: 0, name: 'invalidTag', weight: 0 }],
        value: 'tag0',
        property: 'name'
      });
      expect(allTags).toStrictEqual([{ id: 0, name: 'invalidTag', weight: 0 }]);
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy).toHaveBeenCalledWith('Cannot get the expected value!', { value: 'tag0', property: 'name' });
    });

    it('should return a full object if no property is provided', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(cvInfoMock));
      const cvInfo = await service.getStoreData<ICvInfos>({
        selector: selectCvInfos,
        defaultValue: {} as ICvInfos,
      });
      expect(cvInfo).toStrictEqual(cvInfoMock);
    });

    it('should return a value if a property is provided', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(cvInfoMock));
      const contact = await service.getStoreData<ICvInfos>({
        selector: selectCvInfos,
        defaultValue: { contact: {} } as ICvInfos,
        property: 'contact'
      });
      expect(contact).toStrictEqual(contactMock);
    });

    it('should return default value if property does not exist', async () => {
      storeSelectSpy.mockImplementationOnce(() => of(cvInfoMock));
      const contact = await service.getStoreData<ICvInfos>({
        selector: selectCvInfos,
        defaultValue: {} as ICvInfos,
        property: 'notFound'
      });
      expect(contact).toStrictEqual({});
    });
  });

  describe('getSummary', () => {
    beforeEach(() => {
      storeSelectSpy.mockImplementation((selector: <T>(state: object) => T) => {
        switch (selector) {
          case selectAllCompetences: return of(competenceListMock);
          case selectAllExperiences: return of(experienceListMock);
          case selectAllFormations: return of(formationListMock);
          case selectAllProjects: return of(projectListMock);
          default: return of([]);
        }
      });
    });

    it('should call the store select method four times', async () => {
      await service.getSummary();

      expect(storeSelectSpy).toHaveBeenCalledTimes(4);
      expect(storeSelectSpy).toHaveBeenNthCalledWith(1, selectAllCompetences);
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
      expect(storeSelectSpy).toHaveBeenNthCalledWith(2, selectCompetencesLoaded);
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
