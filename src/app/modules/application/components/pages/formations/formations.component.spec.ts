import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../../../test/ng2-mock-component-compat';
import { lastValueFrom, of } from 'rxjs';
import { addTags } from '../../../../../../../__mocks__/helper';
import { dataServiceMock } from '../../../../../../../__mocks__/services/data-service.mock';
import formationListMock from '../../../../../../../__mocks__/v1/json-files/formations.json';
import { FormationV1 } from '../../../../../core/interfaces/models/v1/formation.interface';
import { DataService, UtilsService } from '../../../../../shared';
import { FormationsComponent } from './formations.component';

const unsortedFormationListMock = addTags(formationListMock);
const withoutEndDateList: FormationV1[] = [];
const withEndDateList: FormationV1[] = unsortedFormationListMock.filter((formation) => {
  if (formation.endDate) {
    return true;
  }
  withoutEndDateList.push(formation);
  return false;
});

const sortedFormationListMock = [
  ...UtilsService.sortObjectList<FormationV1>(withoutEndDateList, 'desc', 'beginDate', 'date'),
  ...UtilsService.sortObjectList<FormationV1>(withEndDateList, 'desc', 'endDate', 'date'),
];

describe('FormationsComponent', () => {
  let component: FormationsComponent;
  let fixture: ComponentFixture<FormationsComponent>;
  const isDataLoadedSpy = jest.spyOn(dataServiceMock, 'isDataLoaded');
  const getStoreDataSpy = jest.spyOn(dataServiceMock, 'getStoreData');
  const sortObjectListSpy = jest.spyOn(UtilsService, 'sortObjectList');
  const addMissingEndDateSpy = jest.spyOn(UtilsService, 'addMissingEndDate');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FormationsComponent,
        MockComponent({
          selector: 'app-formation-item',
          inputs: ['form', 'index'],
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
    fixture = TestBed.createComponent(FormationsComponent);
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
      expect(addMissingEndDateSpy).not.toHaveBeenCalled();
      expect(sortObjectListSpy).not.toHaveBeenCalled();
    });

    it('should call getStoreData DataService method if data are loaded', async () => {
      isDataLoadedSpy.mockImplementation(() => of(true));
      getStoreDataSpy.mockImplementation(() => Promise.resolve(unsortedFormationListMock));
      sortObjectListSpy.mockImplementation(() => sortedFormationListMock);
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData$)).toBeFalsy();
      expect(getStoreDataSpy).toHaveBeenCalledTimes(1);
      expect(sortObjectListSpy).toHaveBeenCalledTimes(2);
    });
  });
});
