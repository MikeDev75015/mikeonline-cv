import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MockComponent } from 'ng2-mock-component';
import { KnobModule } from 'primeng/knob';
import { lastValueFrom, of } from 'rxjs';
import { changeDetectorRefMock } from '../../../__mocks__/services/change-detector-ref.mock';
import { dataServiceMock } from '../../../__mocks__/services/data-service.mock';
import { utilsServiceMock } from '../../../__mocks__/services/utils-service.mock';
import { AlertModule } from '../../../core/core-index';
import { DataService } from '../../../shared/services/data/data.service';
import { UtilsService } from '../../../shared/shared-index';
import { CompetencesComponent } from './competences.component';

describe('CompetencesComponent', () => {
  let component: CompetencesComponent;
  let fixture: ComponentFixture<CompetencesComponent>;
  const isDataLoadedSpy = jest.spyOn(dataServiceMock, 'isDataLoaded');
  const canvasMock = document.createElement('div');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatExpansionModule,
        HttpClientTestingModule,
        KnobModule,
        FormsModule,
        AlertModule,
      ],
      declarations: [
        CompetencesComponent,
        MockComponent({ selector: 'app-categorie' }),
        MockComponent({
          selector: 'app-experience-item',
          inputs: ['exp', 'index'],
        }),
        MockComponent({
          selector: 'app-formation-item',
          inputs: ['form', 'index'],
        }),
        MockComponent({
          selector: 'app-portfolio-item',
          inputs: ['siteDemo'],
        }),
        MockComponent({
          selector: 'app-page-layout',
          inputs: ['elementsNumber', 'isLoadingData'],
        }),
      ],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencesComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('getGridForWidth', () => {
    it('should return 12 if the width is greater than 839px', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 840,
      });

      expect(CompetencesComponent['getGridForWidth']()).toStrictEqual(12);
    });

    it('should return 4 if the width is less than or equal to 839px', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 839,
      });

      expect(CompetencesComponent['getGridForWidth']()).toStrictEqual(4);
    });
  });

  describe('ngOnInit', () => {
    it('should set isLoadingData to true and competencesLoaded to false if data are not loaded', async () => {
      isDataLoadedSpy.mockImplementationOnce(() => of(false));
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData)).toBeTruthy();
      expect(component.competencesLoaded).toBeFalsy();
    });

    it('should set isLoadingData to false and competencesLoaded to true if data are loaded', async () => {
      isDataLoadedSpy.mockImplementationOnce(() => of(true));
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData)).toBeFalsy();
      expect(component.competencesLoaded).toBeTruthy();
    });
  });

  describe('ngOnDestroy', () => {
    let getElementSpy: any;
    let removeEventListenerSpy: any;
    let consoleWarnSpy: any;

    beforeEach(() => {
      getElementSpy = jest.spyOn(document, 'querySelector');
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    it('should call removeEventListener 3 times if canvas is found', () => {
      getElementSpy.mockImplementation(() => canvasMock);
      removeEventListenerSpy = jest.spyOn(canvasMock, 'removeEventListener').mockImplementation(() => undefined);
      component.ngOnDestroy();

      expect(removeEventListenerSpy).toBeDefined();
      expect(removeEventListenerSpy).toBeCalledTimes(3);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should warn if canvas is not found', () => {
      getElementSpy.mockImplementation(() => null);
      component.ngOnDestroy();

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Canvas element not found!');
    });
  });

  describe('ngAfterViewChecked', () => {
    let querySelectorSpy: any;

    beforeAll(() => {
      Object.defineProperty(window, 'WordCloud', {
        value: {
          isSupported: true,
        },
      });
    });

    beforeEach(() => {
      querySelectorSpy = jest.spyOn(document, 'querySelector').mockImplementation((cssSelector: string) => {
        if (cssSelector === '#wc_canvas') {
          return canvasMock;
        }
        return null;
      });
      isDataLoadedSpy.mockImplementationOnce(() => of(true));
      fixture.detectChanges();
    });

    it('should initialize wordcloud when canvas is found if not yet initialized', async () => {
      expect(await lastValueFrom(component.isLoadingData)).toBeFalsy();
      expect(component['initWordCloud']).toBeFalsy();
      expect(component.defaultText).not.toBeDefined();
      component.ngAfterViewChecked();

      expect(component['initWordCloud']).toBeTruthy();
      expect(component.defaultText).toStrictEqual('Chargement des technos en cours...');
    });
  });
});
