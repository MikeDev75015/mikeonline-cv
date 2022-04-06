import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng2-mock-component';
import { lastValueFrom, of } from 'rxjs';
import { sortedExperienceListMock, unsortedExperienceListMock } from '../../../__mocks__/data/experience-list.mock';
import { dataServiceMock } from '../../../__mocks__/services/data-service.mock';
import { DataService } from '../../../shared/services/data/data.service';
import { UtilsService } from '../../../shared/shared-index';

import { ExperiencesComponent } from './experiences.component';

describe('ExperiencesComponent', () => {
  let component: ExperiencesComponent;
  let fixture: ComponentFixture<ExperiencesComponent>;
  const isDataLoadedSpy = jest.spyOn(dataServiceMock, 'isDataLoaded');
  const getStoreDataSpy = jest.spyOn(dataServiceMock, 'getStoreData');
  const sortObjectListSpy = jest.spyOn(UtilsService, 'sortObjectList');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExperiencesComponent,
        MockComponent({
          selector: 'app-experience-item',
          inputs: ['exp', 'index'],
        }),
        MockComponent({
          selector: 'app-page-layout',
          inputs: ['pageTitle', 'elementsNumber', 'isLoadingData$'],
        }),
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperiencesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should not call getStoreData DataService method if data are not loaded', async () => {
      isDataLoadedSpy.mockImplementation(() => of(false));
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData$)).toBeTruthy();
      expect(getStoreDataSpy).not.toHaveBeenCalled();
      expect(sortObjectListSpy).not.toHaveBeenCalled();
    });

    it('should call getStoreData DataService method if data are loaded', async () => {
      isDataLoadedSpy.mockImplementation(() => of(true));
      getStoreDataSpy.mockImplementation(() => Promise.resolve(unsortedExperienceListMock));
      sortObjectListSpy.mockImplementation(() => sortedExperienceListMock);
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData$)).toBeFalsy();
      expect(getStoreDataSpy).toHaveBeenCalledTimes(1);
      expect(sortObjectListSpy).toHaveBeenCalledTimes(1);
      expect(sortObjectListSpy).toHaveBeenCalledWith(unsortedExperienceListMock, 'desc', 'beginDate', 'date');
      expect(component.experienceList).toStrictEqual(sortedExperienceListMock);
    });
  });
});
