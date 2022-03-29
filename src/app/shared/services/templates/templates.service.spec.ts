import { TestBed } from '@angular/core/testing';
import { IDetail } from '../../../core/interfaces/detail.interface';
import { IExperience } from '../../../core/interfaces/models/experience.interface';
import { IFormation } from '../../../core/interfaces/models/formation.interface';

import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* afterEach(() => {
    jest.clearAllMocks();
  }); */

  describe('showOpenCloseButtons', () => {
    test.each([
      ['element is invalid', undefined],
      ['detailList is invalid', { detailList: undefined } as IExperience],
      ['detailList length is equal to 0', { detailList: [] } as unknown as IExperience],
      ['total of title and lines is less than or equal to 4', { detailList: [{ lineList: ['1', '2', '3'], title: 'test' }] as IDetail[] } as IExperience],
    ])('should return false if %s', (name: string, element: IExperience | IFormation | undefined) => {
      expect(
        TemplatesService.showOpenCloseButtons(element),
      ).toBeFalsy();
    });

    it('should return true if total of title and lines is greater than or equal to 5', () => {
      expect(
        TemplatesService.showOpenCloseButtons({ detailList: [{ lineList: ['1', '2', '3', '4'], title: 'test' }] as IDetail[] } as IFormation),
      ).toBeTruthy();
    });
  });

  describe('setLineBodyPaddingLeft', () => {
    it('should return 50px if innerWidth is greater then 840px', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 841,
      });

      expect(
        TemplatesService.setLineBodyPaddingLeft(),
      ).toStrictEqual('50px');
    });

    it('should return 30px if innerWidth is less then or equals 840px', () => {
      Object.defineProperty(window, 'innerWidth', {
        value: 840,
      });

      expect(
        TemplatesService.setLineBodyPaddingLeft(),
      ).toStrictEqual('30px');
    });

    describe('invalid window object', () => {
      let initialWindowObject: Window & typeof globalThis;

      beforeAll(() => {
        initialWindowObject = window;
      });

      afterAll(() => {
        Object.defineProperty(global, 'window', {
          value: initialWindowObject,
        });
      });

      test.each([
        ['window object is invalid', undefined],
        ['innerWidth is invalid', { innerWidth: undefined }],
      ])('should return 0 if %s', (name: string, windowObject: any) => {

        Object.defineProperty(global, 'window', {
          value: windowObject,
        });

        expect(
          TemplatesService.setLineBodyPaddingLeft(),
        ).toStrictEqual('0');
      });
    });
  });
});
