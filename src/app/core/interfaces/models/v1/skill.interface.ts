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

  tagList: TagV1[];

  link: ILink;
}

type ExpertiseLevelType = 1 | 2 | 3 | 4 | 5;

type PriorityType = 1 | 2 | 3;
