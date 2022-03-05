import {IDetail} from '../detail.interface';
import {ILink} from '../link.interface';
import {EJobType} from '../enums/job-type.enum';
import {ITag} from './tag.interface';

export interface IExperience {
  id?: string;
  title: string;
  beginDate: string;
  endDate?: string;
  actualJob?: boolean;
  jobType?: EJobType;
  society?: string;
  place: string;
  tagIdList: number[];
  detailList?: IDetail[];
  linkList?: ILink[];
  tagList?: ITag[];
}
