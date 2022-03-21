import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { alertServiceMock } from '../../../__mocks__/services/alert-service.mock';
import { waitTimeout } from '../../../__mocks__/timeout.mock';
import { ITag } from '../../../core/interfaces/models/tag.interface';
import { AlertModule } from '../../../core/modules/alert/alert.module';
import { AlertService } from '../../../core/modules/alert/services/alert.service';
import { DayJsService } from '../../../core/services/dayjs/dayjs.service';

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
        { provide: Store, useValue: {} },
        { provide: AlertService, useValue: alertServiceMock },
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
      { stringType: 'b', numberType: 3, dateType: '2021-12-19'},
      { stringType: 'c', numberType: 1, dateType: '2022-01-09'},
      { stringType: 'a', numberType: 2, dateType: '2022-03-19'},
    ];

    const sortedLists = {
      ascendingWay: {
        byStringProperty: [
          { stringType: 'a', numberType: 2, dateType: '2022-03-19'},
          { stringType: 'b', numberType: 3, dateType: '2021-12-19'},
          { stringType: 'c', numberType: 1, dateType: '2022-01-09'},
        ],
        byNumberProperty: [
          { stringType: 'c', numberType: 1, dateType: '2022-01-09'},
          { stringType: 'a', numberType: 2, dateType: '2022-03-19'},
          { stringType: 'b', numberType: 3, dateType: '2021-12-19'},
        ],
        byDateProperty: [
          { stringType: 'b', numberType: 3, dateType: '2021-12-19'},
          { stringType: 'c', numberType: 1, dateType: '2022-01-09'},
          { stringType: 'a', numberType: 2, dateType: '2022-03-19'},
        ],
      },
      descendingWay: {
        byStringProperty: [
        { stringType: 'c', numberType: 1, dateType: '2022-01-09'},
        { stringType: 'b', numberType: 3, dateType: '2021-12-19'},
        { stringType: 'a', numberType: 2, dateType: '2022-03-19'},
      ],
        byNumberProperty: [
        { stringType: 'b', numberType: 3, dateType: '2021-12-19'},
        { stringType: 'a', numberType: 2, dateType: '2022-03-19'},
        { stringType: 'c', numberType: 1, dateType: '2022-01-09'},
      ],
        byDateProperty: [
        { stringType: 'a', numberType: 2, dateType: '2022-03-19'},
        { stringType: 'c', numberType: 1, dateType: '2022-01-09'},
        { stringType: 'b', numberType: 3, dateType: '2021-12-19'},
      ],
      }
    };

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
        () => UtilsService.mergeTwoListWithoutDuplications<number>([0, 2], [1, 2, 3], 'number')
      ).toThrow(new Error('Not Implemented'));
    });

    it('should merge lists without duplicates', () => {
      expect(
        UtilsService.mergeTwoListWithoutDuplications<string>(list1, list2, 'string')
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
        UtilsService.addMissingEndDate<{ startDate: string; endDate?: string; }>(withEndDate)
      ).toStrictEqual(withEndDate);
    });

    it('should add missing endDate', () => {
      expect(
        UtilsService.addMissingEndDate<{ startDate: string; endDate?: string; }>(withoutEndDate)
      ).toStrictEqual([{ startDate: 'toto', endDate: 'tata' }]);
    });
  });

  describe('uppercaseFirstLetter', () => {
    expect(UtilsService.uppercaseFirstLetter('unit test')).toStrictEqual('Unit test');
  });

  describe('getElementId', () => {
    function createElement(depth: number): any {
      const stringElement: string = '{' + '"parentElement":{'.repeat(depth) + '"id": "toto"'+ '}'.repeat(depth) + '}';
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
    ])('should return %s as knob value in year', (name: string, expected: number) => {
      expect(service.convertDateToKnobYearsValue(name)).toBe(expected);
    });
  });

  describe('convertPixelsToNumber', () => {
    it('should convert a css value to its corresponding number', () => {
      expect(service.convertPixelsToNumber('200px')).toStrictEqual(200);
    });
  });

  describe('initTechnoListWithTagList', () => {
    const tagList: ITag[] = [
      { id: 1, name: 'tag1', times: 1, weight: 1 },
      { id: 2, name: 'tag2', times: 2, weight: 2 },
      { id: 3, name: 'tag3', times: 3, weight: 3 },
      { id: 4, name: 'tag4', times: 4, weight: 4 },
      { id: 11, name: 'tag11', times: 1, weight: 1 },
      { id: 12, name: 'tag12', times: 2, weight: 2 },
      { id: 13, name: 'tag13', times: 3, weight: 3 },
      { id: 14, name: 'tag14', times: 4, weight: 4 },
      { id: 21, name: 'tag21', times: 1, weight: 1 },
      { id: 22, name: 'tag22', times: 2, weight: 2 },
      { id: 23, name: 'tag23', times: 3, weight: 3 },
      { id: 24, name: 'tag24', times: 4, weight: 4 },
    ];

    it('should return a limited techno list', () => {
      expect(service.initTechnoListWithTagList(tagList, false)).toStrictEqual([
        'tag1', 'tag2', 'tag3', 'tag4', 'tag11', 'tag12', 'et 6 autres...',
      ]);
    });

    it('should return a full techno list', () => {
      expect(service.initTechnoListWithTagList(tagList, true)).toStrictEqual([
        'tag1', 'tag2', 'tag3', 'tag4', 'tag11', 'tag12', 'tag13', 'tag14', 'tag21', 'tag22', 'tag23', 'tag24',
      ]);
    });
  });

  describe('formatPhoneNumber', () => {
    test.each([
      ['0607080910', '+33 6 07 08 09 10', ],
      ['05 02 04 06 03', '+33 5 02 04 06 03', ],
      ['+33678984565', '+33 6 78 98 45 65', ],
      ['+33 6789845 65', '+33 6 78 98 45 65', ],
      ['+336 789 84 565', '+33 6 78 98 45 65', ],
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
});
