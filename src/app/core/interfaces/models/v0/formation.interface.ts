import { IDetail } from '../commons/detail.interface';
import { ILink } from '../commons/link.interface';
import { ITag } from './tag.interface';

export interface IFormation {
  id?: string;
  title: string;
  beginDate: string;
  endDate?: string;
  certificate?: boolean;
  society?: string;
  place: string;
  tagIdList: number[];
  detailList?: IDetail[];
  linkList?: ILink[];
  tagList?: ITag[];
}
