import { IContact } from '../commons/contact.interface';
import { IImage } from '../commons/image.interface';

export interface CvInfosV1 {
  id: string;

  cvType: 'full-cv' | 'partial-cv';

  fileName: string;

  title: string;

  technoList: string[];

  contact: IContact;

  logo: IImage;
}
