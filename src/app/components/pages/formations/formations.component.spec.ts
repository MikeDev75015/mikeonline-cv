import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng2-mock-component';
import { lastValueFrom, of } from 'rxjs';
import { sortedFormationListMock, unsortedFormationListMock } from '../../../__mocks__/data/formation-list.mock';
import { dataServiceMock } from '../../../__mocks__/services/data-service.mock';
import { DataService } from '../../../shared/services/data/data.service';
import { UtilsService } from '../../../shared/services/utils/utils.service';

import { FormationsComponent } from './formations.component';

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
      expect(addMissingEndDateSpy).toHaveBeenCalledTimes(1);
      expect(addMissingEndDateSpy).toHaveBeenCalledWith(unsortedFormationListMock);
      expect(sortObjectListSpy).toHaveBeenCalledTimes(1);
      expect(sortObjectListSpy).toHaveBeenCalledWith(unsortedFormationListMock, 'desc', 'endDate', 'date');
      expect(component.formationList).toStrictEqual(sortedFormationListMock);
    });
  });
});
