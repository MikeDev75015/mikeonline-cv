import {IncompressibleSpacePipe} from './incompressible-space.pipe';

describe('IncompressibleSpacePipe', () => {
  const pipe = new IncompressibleSpacePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return an empty string if value provided is invalid', () => {
      expect(pipe.transform(undefined as any)).toStrictEqual('');
    });

    it('should convert all spaces with &nbsp; html special character and &nbsp;/ with " /"', () => {
      const result = pipe.transform('unit test of toto / tata');
      expect(result).toStrictEqual('unit&nbsp;test&nbsp;of&nbsp;toto /&nbsp;tata');
    });
  });
});
