import { IDetail } from '../commons/detail.interface';
import { ILink } from '../commons/link.interface';
import { TagV1 } from './tag.interface';

export interface SkillV1 {
  id: string;

  name: string;

  expertiseLevel: ExpertiseLevelType;

  priority: PriorityType;

  startDate: string;

  endDate: string;

  subTitle: string;

  description: string;

  link: ILink;

  detailList: IDetail[];

  tagList: TagV1[];
}

type ExpertiseLevelType = 1 | 2 | 3 | 4 | 5;

type PriorityType = 1 | 2 | 3;
