import { ICvInfos } from '../../../src/app/core';
import { contactMock } from './contact.mock';

export const cvInfoMock: ICvInfos = {
  id: '1234',
  title: 'unit test',
  technoList: ['1', '2', '3'],
  cvType: 'full-cv',
  fileName: 'test.pdf',
  contact: contactMock,
};
