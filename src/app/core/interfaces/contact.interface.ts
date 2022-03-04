import {IWebLink} from './web-link.interface';

export interface IContact {
  fullName: string;
  phoneNumberPartList: IMultiPart;
  emailPartList: IMultiPart;
  personalSituation: {
    birthDate: string;
    familyStatus: string;
    drivingLicense: string;
  };
  location: string;
  webLinkList: IWebLink[];
}

interface IMultiPart {
  parts: string[];
  joiner: string;
}
