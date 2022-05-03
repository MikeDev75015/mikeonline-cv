import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MockComponent } from 'ng2-mock-component';
import { KnobModule } from 'primeng/knob';
import { lastValueFrom, of } from 'rxjs';
import { formWrapperComponentMock } from '../../../../../../../__mocks__/components/form-wrapper-component.mock';
import { addTags } from '../../../../../../../__mocks__/helper';
import { changeDetectorRefMock } from '../../../../../../../__mocks__/services/change-detector-ref.mock';
import { dataServiceMock } from '../../../../../../../__mocks__/services/data-service.mock';
import { utilsServiceMock } from '../../../../../../../__mocks__/services/utils-service.mock';
import { waitTimeout } from '../../../../../../../__mocks__/timeout.mock';
import skillListMock from '../../../../../../../__mocks__/v1/json-files/skills.json';
import tagListMock from '../../../../../../../__mocks__/v1/json-files/tags.json';
import { AlertModule } from '../../../../../core';
import { DataService, UtilsService } from '../../../../../shared';
import { SkillsComponent } from './skills.component';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;
  let getElementSpy: any;
  let changeDetectorRefSpy: any;
  let isDataLoadedSpy: any;
  let getSummarySpy: any;
  let getStoreDataSpy: any;
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
        SkillsComponent,
        MockComponent(formWrapperComponentMock),
        MockComponent({
          selector: 'app-item',
          inputs: [],
        }),
        MockComponent({
          selector: 'app-project-item',
          inputs: [],
        }),
        MockComponent({
          selector: 'app-page-layout',
          inputs: ['pageTitle', 'elementsNumber', 'isLoadingData$'],
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
    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    isDataLoadedSpy = jest.spyOn(dataServiceMock, 'isDataLoaded');
    getStoreDataSpy = jest.spyOn(dataServiceMock, 'getStoreData');
    getSummarySpy = jest.spyOn(dataServiceMock, 'getSummary');
    getElementSpy = jest.spyOn(document, 'getElementById');
    changeDetectorRefSpy = jest.spyOn(component['cdRef'], 'detectChanges');
  });

  beforeAll(() => {
    Object.defineProperty(window, 'crypto', {
      value: { getRandomValues: jest.fn(() => [200]) },
    });
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

      expect(SkillsComponent['getGridForWidth']()).toStrictEqual(12);
    });

    it('should return 4 if the width is less than or equal to 839px', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 839,
      });

      expect(SkillsComponent['getGridForWidth']()).toStrictEqual(4);
    });
  });

  describe('ngOnInit', () => {
    it('should set isLoadingData to true and skillsLoaded to false if data are not loaded', async () => {
      isDataLoadedSpy.mockImplementationOnce(() => of(false));
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData$)).toBeTruthy();
      expect(component.skillsLoaded).toBeFalsy();
    });

    it('should set isLoadingData to false and skillsLoaded to true if data are loaded', async () => {
      isDataLoadedSpy.mockImplementationOnce(() => of(true));
      fixture.detectChanges();

      expect(await lastValueFrom(component.isLoadingData$)).toBeFalsy();
      expect(component.skillsLoaded).toBeTruthy();
    });
  });

  describe('ngOnDestroy', () => {
    let removeEventListenerSpy: any;
    let consoleWarnSpy: any;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    it('should call removeEventListener 3 times if canvas is found', () => {
      getElementSpy.mockImplementation(() => canvasMock);
      removeEventListenerSpy = jest.spyOn(canvasMock, 'removeEventListener').mockImplementation(() => undefined);
      component.ngOnDestroy();

      expect(removeEventListenerSpy).toBeDefined();
      expect(removeEventListenerSpy).toBeCalledTimes(3);
      expect(removeEventListenerSpy).toHaveBeenNthCalledWith(1, 'wordcloudstart', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenNthCalledWith(2, 'wordclouddrawn', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenNthCalledWith(3, 'wordcloudstop', expect.any(Function));
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
    beforeAll(() => {
      Object.defineProperty(window, 'WordCloud', {
        value: {
          isSupported: true,
        },
      });
    });

    beforeEach(() => {
      getElementSpy.mockImplementation(() => canvasMock);
      isDataLoadedSpy.mockImplementationOnce(() => of(true));
      fixture.detectChanges();
    });

    it('should initialize wordcloud when canvas is found if not yet initialized', async () => {
      expect(await lastValueFrom(component.isLoadingData$)).toBeFalsy();
      expect(component['initWordCloud']).toBeFalsy();
      expect(component.defaultText).not.toBeDefined();
      component.ngAfterViewChecked();

      expect(component['initWordCloud']).toBeTruthy();
      expect(component.defaultText).toStrictEqual('Chargement des technos en cours...');
      expect(changeDetectorRefSpy).toHaveBeenCalled();
    });
  });

  describe('loadWorldCloud', () => {
    let addEventListenerSpy: any;
    let consoleWarnSpy: any;

    beforeAll(() => {
      Object.defineProperty(window, 'WordCloud', {
        value: jest.fn(),
      });
    });

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      addEventListenerSpy = jest.spyOn(canvasMock, 'addEventListener').mockImplementation(() => undefined);
      getSummarySpy.mockImplementation(() => Promise.resolve(tagListMock));
    });

    it('should not load if canvas is not found', async () => {
      getElementSpy.mockImplementation(() => null);
      await component['initializeEvents']();

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Cannot draw the word cloud, the canvas is missing or invalid!');
    });

    it('should add addEventListener method to canvas element if found', async () => {
      getStoreDataSpy.mockImplementation(() => Promise.resolve(addTags(skillListMock)));
      getElementSpy.mockImplementation(() => canvasMock);
      addEventListenerSpy = jest.spyOn(canvasMock, 'addEventListener').mockImplementation(() => undefined);
      await component['initializeEvents']();

      expect(addEventListenerSpy).toBeDefined();
      expect(addEventListenerSpy).toBeCalledTimes(3);
      expect(addEventListenerSpy).toHaveBeenNthCalledWith(1, 'wordcloudstart', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenNthCalledWith(2, 'wordclouddrawn', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenNthCalledWith(3, 'wordcloudstop', expect.any(Function));

      expect(component['wordList']).toHaveLength(skillListMock.length);

      expect(window.WordCloud).toHaveBeenCalledTimes(1);
    });
  });

  describe('getExpertiseLevelLabel', () => {
    test.each([
      ['débutant', 1],
      ['averti', 2],
      ['bon', 3],
      ['très bon', 4],
      ['expert', 5],
    ])('should return "%s" if value is %d', (expected: string, value: number) => {
      expect(component.getExpertiseLevelLabel(value)).toStrictEqual(expected);
    });
  });

  describe('getPriorityLabel', () => {
    test.each([
      ['au besoin', 1],
      ['normal', 2],
      ['maximum', 3],
    ])('should return "%s" if value is %d', (expected: string, value: number) => {
      expect(component.getPriorityLabel(value)).toStrictEqual(expected);
    });
  });

  describe('wordCloudStartCallback', () => {
    it('should initialize timeout to drawn and skills drawn counter', () => {
      expect(component['timeOutToDrawn']).toStrictEqual(0);
      expect(component.skillsDrawn).not.toBeDefined();

      component['timeOutToDrawn'] = 25;

      component['wordCloudStartCallback']();
      expect(component['timeOutToDrawn']).toStrictEqual(0);
      expect(component.skillsDrawn).toStrictEqual(0);
    });
  });

  describe('wordCloudDrawnCallback', () => {
    it('should initialize the counter if it is not yet initialized, increase it on each call and increment skillsDrawn', async () => {
      expect(component['timeOutToDrawn']).toStrictEqual(0);
      expect(component.skillsDrawn).not.toBeDefined();

      // 1st time
      component['wordCloudDrawnCallback']();
      expect(component['timeOutToDrawn']).toStrictEqual(25);
      await waitTimeout(component['timeOutToDrawn']);
      expect(component.skillsDrawn).toStrictEqual(1);

      // 2nd time
      component['wordCloudDrawnCallback']();
      expect(component['timeOutToDrawn']).toStrictEqual(50);
      await waitTimeout(component['timeOutToDrawn']);
      expect(component.skillsDrawn).toStrictEqual(2);

      // 3rd time
      component['wordCloudDrawnCallback']();
      expect(component['timeOutToDrawn']).toStrictEqual(75);
      await waitTimeout(component['timeOutToDrawn']);
      expect(component.skillsDrawn).toStrictEqual(3);
    });
  });

  describe('worldCloudStopCallback', () => {
    const getElementsByClassNameSpy = jest.spyOn(document, 'getElementsByClassName');
    const wcElementMock = document.createElement('span');
    const wcElementMockWithInitOnclickAttribute = document.createElement('span');
    wcElementMockWithInitOnclickAttribute.setAttribute('init-onclick', 'true');

    it('should do nothing if no element is found', () => {
      getElementsByClassNameSpy.mockImplementation((): any => []);
      expect(component.defaultText).not.toBeDefined();

      component['worldCloudStopCallback']();

      expect(component.defaultText).not.toBeDefined();
    });

    it('should change defaultText when all element are initialized', () => {
      getElementsByClassNameSpy.mockImplementation((): any => [wcElementMock, wcElementMockWithInitOnclickAttribute]);
      expect(component.defaultText).not.toBeDefined();

      component['worldCloudStopCallback']();

      expect(component.defaultText).toStrictEqual('Cliquez sur une techno pour en savoir +');
    });
  });

  describe('windowResizeCallback', () => {
    let setTimeoutSpy: any;
    let clearTimeoutSpy: any;

    beforeEach(() => {
      getElementSpy.mockImplementation(() => canvasMock);
      setTimeoutSpy = jest.spyOn(window, 'setTimeout').mockImplementation(jest.fn());
      clearTimeoutSpy = jest.spyOn(window, 'clearTimeout').mockImplementation(jest.fn());
    });

    it('should set timeout and not call clearTimeout if undefined', () => {
      component['windowResizeCallback']();

      expect(clearTimeoutSpy).not.toHaveBeenCalled();
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    });

    it('should set timeout and call clearTimeout if a previous was set', () => {
      component['drawingTimeout'] = 7;
      component['windowResizeCallback']();

      expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
      expect(clearTimeoutSpy).toHaveBeenCalledWith(7);
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setWorldCloudOptions', () => {
    it('should return the word-cloud options object', () => {
      const options = component['setWorldCloudOptions']();

      expect(options).toHaveProperty('gridSize');
      expect(options).toHaveProperty('fontFamily');
      expect(options).toHaveProperty('color');
      expect(options).toHaveProperty('backgroundColor');
      expect(options).toHaveProperty('rotateRatio');
      expect(options).toHaveProperty('classes');
      expect(options.color()).toMatch(/^#[A-Za-z0-9]{3,6}$/);
    });
  });

  describe('policeSize', () => {
    it('should set the font size with the number of uses multiplied by the weight passed as argument added the default size', () => {
      const times = 5;
      const weight = 3;
      const expectedSize = component['wcDefaultPoliceSize'] + (times * weight);
      expect(component['policeSize'](times, weight)).toStrictEqual(expectedSize);
    });
  });

  describe('addClickActionOnElement', () => {
    const wcElementMock = document.createElement('span');
    wcElementMock.innerText = 'toto';

    it('should add onclick method and set attribute', () => {
      expect(wcElementMock.onclick).toStrictEqual(null);
      expect(wcElementMock.getAttribute('init-onclick')).toStrictEqual(null);

      component['addAttributesOnWcElement'](wcElementMock);

      expect(wcElementMock.onclick).toBeDefined();
      expect(wcElementMock.getAttribute('init-onclick')).toStrictEqual('true');
    });
  });
});
