import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng2-mock-component';
import { lastValueFrom, of } from 'rxjs';
import { changeDetectorRefMock } from '../../../__mocks__/services/change-detector-ref.mock';
import { dataServiceMock } from '../../../__mocks__/services/data-service.mock';
import { DataService } from '../../../shared/shared-index';

import { InterestsComponent } from './interests.component';

describe('InterestsComponent', () => {
  let component: InterestsComponent;
  let fixture: ComponentFixture<InterestsComponent>;
  let changeDetectorRefSpy: any;
  const isDataLoadedSpy = jest.spyOn(dataServiceMock, 'isDataLoaded');
  const getStoreDataSpy = jest.spyOn(dataServiceMock, 'getStoreData');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        InterestsComponent,
        MockComponent({
          selector: 'app-vertical-accordion',
          inputs: [
            'verticalAccordionContainerClass',
            'verticalAccordionItemClass',
            'itemList',
            'options',
          ],
        }),
        MockComponent({
          selector: 'app-page-layout',
          inputs: ['pageTitle', 'elementsNumber', 'isLoadingData$', 'scrollSection'],
        }),
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefMock },
      ],
      imports: [
        BrowserAnimationsModule,
        MatExpansionModule,
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestsComponent);
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
    it('should set isLoadingData to true and competencesLoaded to false if data are not loaded', async () => {
      isDataLoadedSpy.mockImplementation(() => of(false));
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData$)).toBeTruthy();
      expect(getStoreDataSpy).not.toHaveBeenCalled();
    });

    it('should set isLoadingData to false and competencesLoaded to true if data are loaded', async () => {
      isDataLoadedSpy.mockImplementation(() => of(true));
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData$)).toBeFalsy();
      expect(getStoreDataSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngAfterContentInit', () => {
    beforeEach(() => {
      changeDetectorRefSpy = jest.spyOn(component['cdRef'], 'detectChanges');
    });

    it('should call ChangeDetectorRef detectChanges method in ngAfterContentInit', () => {
      expect(changeDetectorRefSpy).not.toHaveBeenCalled();

      component.ngAfterContentInit();

      expect(changeDetectorRefSpy).toHaveBeenCalledTimes(1);
    });
  });
});
