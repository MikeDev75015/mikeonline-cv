import { IDetail } from '../commons/detail.interface';
import { ILink } from '../commons/link.interface';
import { TagV1 } from './tag.interface';

export interface FormationV1 {
  id: string;

  title: string;

  beginDate: string;

  endDate: string;

  certificate: boolean;

  society: string;

  place: string;

  detailList: IDetail[];

  linkList: ILink[];

  tagList: TagV1[];
}
