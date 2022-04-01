import {FirstLetterUppercasePipe} from './first-letter-uppercase.pipe';

describe('FirstLetterUppercasePipe', () => {
  const pipe = new FirstLetterUppercasePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return an empty string if value provided is invalid', () => {
      expect(pipe.transform(undefined as any)).toStrictEqual('');
    });

    it('should call DaysJsService getDate method with passed arguments and format', () => {
      const result = pipe.transform('toto');
      expect(result).toStrictEqual('Toto');
    });
  });
});
