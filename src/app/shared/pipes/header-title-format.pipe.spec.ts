import {HeaderTitleFormatPipe} from './header-title-format.pipe';

describe('HeaderTitleFormatPipe', () => {
  const pipe = new HeaderTitleFormatPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return an empty string if value provided is invalid', () => {
      expect(pipe.transform(undefined as any)).toStrictEqual('');
    });

    it('should convert all spaces with &nbsp; html special character', () => {
      expect(pipe.transform('unit test of toto')).toStrictEqual('unit&nbsp;test&nbsp;of&nbsp;toto');
    });
  });
});
