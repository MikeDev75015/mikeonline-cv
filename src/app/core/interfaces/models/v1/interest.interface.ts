import { ILink } from '../commons/link.interface';

export interface InterestV1 {
  id: string;

  title: string;

  position: number;

  description: string;

  link: ILink;
}
