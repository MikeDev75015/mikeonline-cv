import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { alertServiceMock } from '../../../../../__mocks__/services/alert-service.mock';
import { httpClientMock } from '../../../../../__mocks__/services/http-client.mock';
import { waitTimeout } from '../../../../../__mocks__/timeout.mock';
import tagListMock from '../../../../../__mocks__/v1/json-files/tags.json';
import { AlertModule } from '../../../core';
import { IShareData } from '../../../core/interfaces/models/commons/share-data.interface';
import { AlertService } from '../../../core/modules/alert/services/alert.service';
import { DayJsService } from '../../../core/services/dayjs/dayjs.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AlertModule,
      ],
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        { provide: HttpClient, useValue: httpClientMock },
      ],
    });

    service = TestBed.inject(UtilsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sortList', () => {
    const unsortedList = [
      { stringType: 'b', numberType: 3, dateType: '2021-12-19' },
      { stringType: 'c', numberType: 1, dateType: '2022-01-09' },
      { stringType: 'a', numberType: 2, dateType: '2022-03' },
    ];

    const sortedLists = {
      ascendingWay: {
        byStringProperty: [
          { stringType: 'a', numberType: 2, dateType: '2022-03' },
          { stringType: 'b', numberType: 3, dateType: '2021-12-19' },
          { stringType: 'c', numberType: 1, dateType: '2022-01-09' },
        ],
        byNumberProperty: [
          { stringType: 'c', numberType: 1, dateType: '2022-01-09' },
          { stringType: 'a', numberType: 2, dateType: '2022-03' },
          { stringType: 'b', numberType: 3, dateType: '2021-12-19' },
        ],
        byDateProperty: [
          { stringType: 'b', numberType: 3, dateType: '2021-12-19' },
          { stringType: 'c', numberType: 1, dateType: '2022-01-09' },
          { stringType: 'a', numberType: 2, dateType: '2022-03' },
        ],
      },
      descendingWay: {
        byStringProperty: [
          { stringType: 'c', numberType: 1, dateType: '2022-01-09' },
          { stringType: 'b', numberType: 3, dateType: '2021-12-19' },
          { stringType: 'a', numberType: 2, dateType: '2022-03' },
        ],
        byNumberProperty: [
          { stringType: 'b', numberType: 3, dateType: '2021-12-19' },
          { stringType: 'a', numberType: 2, dateType: '2022-03' },
          { stringType: 'c', numberType: 1, dateType: '2022-01-09' },
        ],
        byDateProperty: [
          { stringType: 'a', numberType: 2, dateType: '2022-03' },
          { stringType: 'c', numberType: 1, dateType: '2022-01-09' },
          { stringType: 'b', numberType: 3, dateType: '2021-12-19' },
        ],
      },
    };

    it('should throw', () => {
      expect(
        () => UtilsService.sortObjectList(unsortedList, 'asc', 'key'),
      ).toThrow(new Error('One of values to compare is undefined, cannot sort object list!'));
    });

    test.each([
      ['string', 'stringType', sortedLists.ascendingWay.byStringProperty],
      ['number', 'numberType', sortedLists.ascendingWay.byNumberProperty],
      ['date', 'dateType', sortedLists.ascendingWay.byDateProperty],
      // @ts-ignore
    ])('should sort list from property of type %s in ascending order', (
      mode: 'string' | 'number' | 'date', key, expected: any[],
    ) => {
      expect(
        UtilsService.sortObjectList(unsortedList, 'asc', key, mode),
      ).toStrictEqual(expected);
    });

    test.each([
      ['string', 'stringType', sortedLists.descendingWay.byStringProperty],
      ['number', 'numberType', sortedLists.descendingWay.byNumberProperty],
      ['date', 'dateType', sortedLists.descendingWay.byDateProperty],
      // @ts-ignore
    ])('should sort list from property of type %s in descending order', (
      mode: 'string' | 'number' | 'date', key, expected: any[],
    ) => {
      expect(
        UtilsService.sortObjectList(unsortedList, 'desc', key, mode),
      ).toStrictEqual(expected);
    });
  });

  describe('mergeTwoListWithoutDuplications', () => {
    const list1 = ['a', 'c', 'e', 'f', 't'];
    const list2 = ['a', 'b', 'c', 'd', 'f', 'z'];

    it('should throw an error if the type is not a string list', () => {
      expect(
        () => UtilsService.mergeTwoListWithoutDuplications<number>([0, 2], [1, 2, 3], 'number'),
      ).toThrow(new Error('Not Implemented'));
    });

    it('should merge lists without duplicates', () => {
      expect(
        UtilsService.mergeTwoListWithoutDuplications<string>(list1, list2),
      ).toStrictEqual(['a', 'c', 'e', 'f', 't', 'b', 'd', 'z']);
    });
  });

  describe('addMissingEndDate', () => {
    const withEndDate = [{ startDate: 'unit', endDate: 'test' }];
    const withoutEndDate = [{ startDate: 'toto' }];

    beforeEach(() => {
      jest.spyOn(DayJsService, 'getDate').mockImplementationOnce(() => 'tata');
    });

    it('should do nothing if endDate is present', () => {
      expect(
        UtilsService.addMissingEndDate<{ startDate: string; endDate?: string; }>(withEndDate),
      ).toStrictEqual(withEndDate);
    });

    it('should add missing endDate', () => {
      expect(
        UtilsService.addMissingEndDate<{ startDate: string; endDate?: string; }>(withoutEndDate),
      ).toStrictEqual([{ startDate: 'toto', endDate: 'tata' }]);
    });
  });

  describe('uppercaseFirstLetter', () => {
    expect(UtilsService.uppercaseFirstLetter('unit test')).toStrictEqual('Unit test');
  });

  describe('getElementId', () => {
    function createElement(depth: number): any {
      const stringElement: string = '{' + '"parentElement":{'.repeat(depth) + '"id": "toto"' + '}'.repeat(depth) + '}';
      return JSON.parse(stringElement);
    }

    it('should return an empty string if element is invalid', () => {
      expect(service.getElementId(undefined)).toStrictEqual('');
    });

    it('should return an empty string if no id is found', () => {
      expect(service.getElementId({})).toStrictEqual('');
    });

    it('should return the element id if it exists', () => {
      expect(service.getElementId({ id: 'toto' })).toStrictEqual('toto');
    });

    test.each([
      [1, { parentElement: { id: 'toto' } }],
      [2, { parentElement: { parentElement: { id: 'toto' } } }],
      [3, { parentElement: { parentElement: { parentElement: { id: 'toto' } } } }],
      [4, { parentElement: { parentElement: { parentElement: { parentElement: { id: 'toto' } } } } }],
    ])('should return the id if depth is %d', (depth: number, expectedElement: any) => {
      const element = createElement(depth);
      expect(element).toStrictEqual(expectedElement);
      expect(service.getElementId(element)).toStrictEqual('toto');
    });

    it('should return an empty string if depth is more than 4', () => {
      const element = createElement(5);
      const expectedElement = { parentElement: { parentElement: { parentElement: { parentElement: { parentElement: { id: 'toto' } } } } } };
      expect(element).toStrictEqual(expectedElement);
      expect(service.getElementId(element)).toStrictEqual('');
    });
  });

  describe('pluralize', () => {
    it('should pluralize if length is greater than 1', () => {
      expect(service.pluralize(2)).toStrictEqual('s');
    });

    it('should not pluralize if length is equal to 1', () => {
      expect(service.pluralize(1)).toStrictEqual('');
    });
  });

  describe('convertDateToKnobYearsValue', () => {
    test.each([
      ['3 ans', 3],
      ['5 mois', 0.42],
      ['12 mois', 1],
      ['un an', 1],
    ])('should return %s as knob value in year', (name: string, expected: number) => {
      expect(service.convertDateToKnobYearsValue(name)).toBe(expected);
    });
  });

  describe('getComputedProperty', () => {
    let getComputedStyleSpy: any;
    const divElement = document.createElement('div');

    beforeEach(() => {
      getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({ getPropertyValue: jest.fn() } as unknown as CSSStyleDeclaration));
    });

    it('should call window getComputedStyle method', () => {
      service.getComputedProperty(divElement, 'height');
      expect(getComputedStyleSpy).toHaveBeenCalledTimes(1);
      expect(getComputedStyleSpy).toHaveBeenCalledWith(divElement);
    });
  });

  describe('convertPixelsToNumber', () => {
    it('should convert a css value to its corresponding number', () => {
      expect(service.convertPixelsToNumber('200px')).toStrictEqual(200);
    });

    it('should convert a css value to its corresponding number', () => {
      expect(service.convertPixelsToNumber('10.5px', true)).toStrictEqual(11);
    });
  });

  describe('initTechnoListWithTagList', () => {
    it('should return a techno list', () => {
      expect(service.initTechnoListWithTagList(tagListMock.slice(0, 6))).toStrictEqual([
        'Bootstrap', 'Jira', 'Swagger', 'Html', 'FireBase', 'Angular 2+', ' ',
      ]);
    });

    it('should return a limited techno list', () => {
      expect(service.initTechnoListWithTagList(tagListMock, false)).toStrictEqual([
        'Bootstrap', 'Jira', 'Swagger', 'Html', 'FireBase', 'Angular 2+', 'et 65 autres...',
      ]);
    });

    it('should return a full techno list', () => {
      expect(service.initTechnoListWithTagList(tagListMock, true)).toStrictEqual([
        'Bootstrap',
        'Jira',
        'Swagger',
        'Html',
        'FireBase',
        'Angular 2+',
        'jQuery',
        'JavaScript',
        'Html 5',
        'Android Studio',
        'TypeScript',
        'Node.js',
        'CALMS',
        'CircleCI',
        'NGRX',
        'React.js',
        'Jwt',
        'Nest.js',
        'BitBucket',
        'Css',
        'Google Tag Manager',
        'Php',
        'SEO',
        'Pixel FB',
        'Docker',
        'i18n',
        'Ionic 5',
        'Jest',
        'Progressive Web App',
        'Microservices',
        'AWS Cloud',
        'Socket.io',
        'Flash Professional',
        'DevOps',
        'Event Sourcing',
        'Netlify',
        'Pug',
        'SASS',
        'Stuart',
        'MongoDb',
        'Heroku',
        'Deliver.ee',
        'Vue.js',
        'CQRS',
        'Compodoc',
        'Angular Material',
        'MySQL',
        'Stripe',
        'WordPress',
        'GitHub',
        'GitLab',
        'Express',
        'Prometheus',
        'PowerPoint',
        'Google Analytics',
        'NPM',
        'Vuex',
        'Css 3',
        'Mongoose',
        'Fastify',
        'SDK manager',
        'Photoshop',
        'Pdf',
        'Trello',
        'Word',
        'SRE',
        'Angular 13',
        'Cypress',
        'PrimeNg',
        'Angular 7',
        'Angular 11',
      ]);
    });
  });

  describe('formatPhoneNumber', () => {
    test.each([
      ['0607080910', '+33 6 07 08 09 10'],
      ['05 02 04 06 03', '+33 5 02 04 06 03'],
      ['+33678984565', '+33 6 78 98 45 65'],
      ['+33 6789845 65', '+33 6 78 98 45 65'],
      ['+336 789 84 565', '+33 6 78 98 45 65'],
      ['+356 789 84 565 4565', '+356 789 84 565 4565'],
    ])('should convert %s to %s', (test: string, expected) => {
      expect(service.formatPhoneNumber(test)).toBe(expected);
    });
  });

  describe('uppercaseFirstLetter', () => {
    it('should uppercase the first letter', () => {
      expect(service.uppercaseFirstLetter('toto')).toStrictEqual('Toto');
    });
  });

  describe('openURL', () => {
    let displayConfirmDialogSpy: any, windowOpenSpy: any;

    beforeEach(() => {
      displayConfirmDialogSpy = jest.spyOn(alertServiceMock, 'displayConfirmDialog');
      windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    });

    it('should open a confirmation dialog if openingUrl is false', () => {
      expect(service['openingUrl']).toBeFalsy();

      displayConfirmDialogSpy.mockImplementationOnce(() => Promise.resolve(''));
      service.openURL('https://toto.fr');

      expect(displayConfirmDialogSpy).toHaveBeenCalledTimes(1);
      expect(windowOpenSpy).not.toHaveBeenCalled();
    });

    it('should open url if passed action in confirmation dialog response', async () => {
      expect(service['openingUrl']).toBeFalsy();

      displayConfirmDialogSpy.mockImplementationOnce(() => Promise.resolve('tata'));
      service.openURL('https://toto.fr');
      await waitTimeout(600);

      expect(displayConfirmDialogSpy).toHaveBeenCalledTimes(1);
      expect(windowOpenSpy).toHaveBeenCalledTimes(1);
      expect(windowOpenSpy).toHaveBeenCalledWith('https://toto.fr', 'tata');
    });

    it('should not open the confirmation dialog if one is already open', () => {
      expect(service['openingUrl']).toBeFalsy();
      service['openingUrl'] = true;

      displayConfirmDialogSpy.mockImplementationOnce(() => Promise.resolve(''));
      service.openURL('https://toto.fr');

      expect(displayConfirmDialogSpy).not.toHaveBeenCalled();
      expect(windowOpenSpy).not.toHaveBeenCalled();
    });
  });

  describe('convertImageToBase64', () => {
    let getSpy: any;

    const blob = new Blob();

    beforeEach(() => {
      getSpy = jest.spyOn(httpClientMock, 'get').mockImplementation(() => of(blob));
    });

    it('should convert', async () => {
      const result = await service.convertImageToBase64('toto');

      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledWith('toto', { responseType: 'blob' });
      expect(result).toStrictEqual('data:application/octet-stream;base64,');
    });
  });

  describe('share', () => {
    let
      windowNavigatorShareSpy: any,
      onClipboardCopySpy: any,
      displayAlertDialogSpy: any;

    const shareData: IShareData = {
      title: 'test', text: 'toto', url: 'https://toto.test',
    };

    beforeEach(() => {
      Object.defineProperty(window, 'navigator', {
        value: {
          share: () => Promise.resolve(),
        },
      });

      windowNavigatorShareSpy = jest.spyOn(window.navigator, 'share');
      onClipboardCopySpy = jest.spyOn(ClipboardService, 'onClipboardCopy');
      displayAlertDialogSpy = jest.spyOn(alertServiceMock, 'displayAlertDialog');
    });

    it('should share', async () => {
      windowNavigatorShareSpy.mockImplementationOnce(() => Promise.resolve());
      await service.share(shareData);

      expect(onClipboardCopySpy).not.toHaveBeenCalled();
      expect(displayAlertDialogSpy).not.toHaveBeenCalled();
    });

    it('should do nothing if share is canceled', async () => {
      const errorMessage = 'Share canceled';
      windowNavigatorShareSpy.mockImplementation(() => Promise.reject(errorMessage));

      await service.share(shareData);
      expect(onClipboardCopySpy).not.toHaveBeenCalled();
      expect(displayAlertDialogSpy).not.toHaveBeenCalled();
    });

    it('should copy the link to the clipboard', async () => {
      const errorMessage = 'window.navigator.share is not a function';
      windowNavigatorShareSpy.mockImplementation(() => Promise.reject(errorMessage));
      onClipboardCopySpy.mockImplementation(() => Promise.resolve());

      await service.share(shareData);
      expect(onClipboardCopySpy).toHaveBeenCalledTimes(1);
      expect(onClipboardCopySpy).toHaveBeenCalledWith(shareData.url);
      expect(displayAlertDialogSpy).toHaveBeenCalledTimes(1);
    });

    it('should display an error alert on clipboard failure', async () => {
      const errorMessage = 'window.navigator.share is not a function';
      windowNavigatorShareSpy.mockImplementation(() => Promise.reject(errorMessage));
      onClipboardCopySpy.mockImplementation(() => Promise.reject('failed to copy!'));

      await service.share(shareData);
      expect(onClipboardCopySpy).toHaveBeenCalledTimes(1);
      expect(onClipboardCopySpy).toHaveBeenCalledWith(shareData.url);
      expect(displayAlertDialogSpy).toHaveBeenCalledTimes(1);
    });

    it('should display an error alert on failure', async () => {
      const errorMessage = 'unknown error';
      windowNavigatorShareSpy.mockImplementation(() => Promise.reject(errorMessage));

      await service.share(shareData);
      expect(onClipboardCopySpy).not.toHaveBeenCalled();
      expect(displayAlertDialogSpy).toHaveBeenCalledTimes(1);
    });
  });
});
