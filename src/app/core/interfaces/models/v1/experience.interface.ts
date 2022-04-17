import { IDetail } from '../commons/detail.interface';
import { ILink } from '../commons/link.interface';
import { EJobType } from '../enums/job-type.enum';
import { TagV1 } from './tag.interface';

export interface ExperienceV1 {
  id: string;

  title: string;

  beginDate: string;

  endDate: string;

  actualJob: boolean;

  jobType: EJobType;

  society: string;

  place: string;

  detailList: IDetail[];

  linkList: ILink[];

  tagList: TagV1[];
}
