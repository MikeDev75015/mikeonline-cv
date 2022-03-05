import { IImage } from '../image.interface';
import { IContact } from '../contact.interface';

export interface ICvInfos {
  id: string;
  fileName: string;
  contact: IContact;
  title: string;
  technoList: string[];
  logo?: IImage;
  cvType: 'full-cv' | 'partial-cv';

  data?: any
}
