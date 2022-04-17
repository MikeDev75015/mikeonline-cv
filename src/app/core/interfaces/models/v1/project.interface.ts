import { IDetail } from '../commons/detail.interface';
import { IImage } from '../commons/image.interface';
import { ILink } from '../commons/link.interface';
import { TagV1 } from './tag.interface';

export interface ProjectV1 {
  id: string;

  title: string;

  subTitle: string;

  position: number;

  description: string;

  createdDate: string;

  link: ILink;

  pictureList: IImage[];

  detailList: IDetail[];

  tagList: TagV1[];
}
