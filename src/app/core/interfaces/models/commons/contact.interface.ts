import { IWebLink } from './web-link.interface';

export interface IContact {
  fullName: string;

  location: string;

  phoneNumberPartList: IMultiPart;

  emailPartList: IMultiPart;

  personalSituation: {
    birthDate: string;
    familyStatus: string;
    drivingLicense: string;
  };

  webLinkList: IWebLink[];
}

export interface IMultiPart {
  parts: string[];

  joiner: string;
}
