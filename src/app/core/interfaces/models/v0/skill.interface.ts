import { IDescription } from '../commons/description.interface';
import { IDetail } from '../commons/detail.interface';
import { ILink } from '../commons/link.interface';
import { ITag } from './tag.interface';

export interface ISkill {
  id?: string;

  name: string;

  expertiseLevel: ExpertiseLevelType;

  priority: 1 | 2 | 3;

  startDate: string;

  experienceYears: {
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

type ExpertiseLevelType = 1 | 2 | 3 | 4 | 5;
