import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { AlertModule } from '../../../core/modules/alert/alert.module';
import { DayJsService } from '../../../core/services/dayjs/dayjs.service';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AlertModule
      ],
      providers: [
        { provide: Store, useValue: {} },
      ],
    });

    service = TestBed.inject(UtilsService);
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
});
