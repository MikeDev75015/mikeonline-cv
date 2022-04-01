import { DayJsService } from '../../core/services/dayjs/dayjs.service';
import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  const pipe = new DateFormatPipe();
  let getDateSpy: any;

  beforeEach(() => {
    getDateSpy = jest.spyOn(DayJsService, 'getDate');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return an empty string if value provided is invalid', () => {
      expect(pipe.transform(undefined as any, 'DD/MM/YYYY')).toStrictEqual('');
    });

    it('should call DaysJsService getDate method with passed arguments and format', () => {
      const formattedDate = pipe.transform('2020-03-01', 'DD/MM/YYYY')
      expect(getDateSpy).toHaveBeenCalledTimes(1);
      expect(getDateSpy).toHaveBeenCalledWith('2020-03-01', 'DD/MM/YYYY');
      expect(formattedDate).toStrictEqual('01/03/2020');
    });
  });
});
