import { IContact } from '../commons/contact.interface';
import { IImage } from '../commons/image.interface';

export interface ICvInfos {
  id?: string;
  fileName: string;
  contact: IContact;
  title: string;
  technoList: string[];
  logo?: IImage;
  cvType: 'full-cv' | 'partial-cv';

  data?: any
}
