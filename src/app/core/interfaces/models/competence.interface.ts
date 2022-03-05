import {IDetail} from '../detail.interface';
import {ILink} from '../link.interface';
import {IDescription} from '../description.interface';
import { ITag } from './tag.interface';

export interface ICompetence {
  id?: string;
  name: string;
  expertiseLevel: 1 | 2 | 3 | 4 | 5;
  priority: 1 | 2 | 3;
  startDate: string;
  experienceYears?: {
    text: string;
    value: number;
  };
  tagIdList: number[];
  subTitle?: string;
  description?: IDescription
  link?: ILink;
  detailList?: IDetail[];
  tagList?: ITag[];
}
