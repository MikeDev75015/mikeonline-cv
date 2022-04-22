import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng2-mock-component';
import { lastValueFrom, of } from 'rxjs';
import { addTags } from '../../../../../../../__mocks__/helper';
import { dataServiceMock } from '../../../../../../../__mocks__/services/data-service.mock';
import experienceListMock from '../../../../../../../__mocks__/v1/json-files/experiences.json';
import tagListMock from '../../../../../../../__mocks__/v1/json-files/tags.json';
import { ExperienceV1 } from '../../../../../core/interfaces/models/v1/experience.interface';
import { DataService, UtilsService } from '../../../../../shared';
import { ExperiencesComponent } from './experiences.component';

const unsortedExperienceListMock = addTags(experienceListMock, tagListMock);
const withoutEndDateList: ExperienceV1[] = [];
const withEndDateList: ExperienceV1[] = unsortedExperienceListMock.filter((experience) => {
  if (experience.endDate) {
    return true;
  }
  withoutEndDateList.push(experience);
  return false;
});

const sortedExperienceListMock = [
  ...UtilsService.sortObjectList<ExperienceV1>(withoutEndDateList, 'desc', 'beginDate', 'date'),
  ...UtilsService.sortObjectList<ExperienceV1>(withEndDateList, 'desc', 'endDate', 'date'),
];

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
      expect(sortObjectListSpy).toHaveBeenCalledTimes(2);
    });
  });
});
