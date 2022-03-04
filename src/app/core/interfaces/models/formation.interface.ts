import {IDetail} from '../detail.interface';
import {ILink} from '../link.interface';
import {ITag} from './tag.interface';

export interface IFormation {
  id?: string;
  title: string;
  beginDate: string;
  endDate?: string;
  certificate?: boolean;
  society?: string;
  place: string;
  detailList?: IDetail[];
  tagIdList?: number[];
  tagList?: ITag[];
  linkList?: ILink[];
}
