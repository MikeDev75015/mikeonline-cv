import { IContact } from '../../core/interfaces/contact.interface';

export const contactMock: IContact = {
  fullName: 'Toto',
  location: 'Acapulco',
  personalSituation: {
    birthDate: '2012-02-23T00:00:00+01:00',
    drivingLicense: 'Permis A',
    familyStatus: 'Marié'
  },
  emailPartList: { parts: ['unit', 'test.co'], joiner: '@' },
  phoneNumberPartList: { parts: ['0645', '0254'], joiner: '12' },
  webLinkList: [
    { name: 'profil', description: 'en ligne', url: 'https://profil.co' },
  ],
};
