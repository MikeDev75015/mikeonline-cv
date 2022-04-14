import { IDetail } from '../detail.interface';
import { IImage } from '../image.interface';
import { ILink } from '../link.interface';
import { ITag } from './tag.interface';

export interface IProject {
  id: string;

  title: string;

  subTitle: string;

  description: string;

  pictureList: IImage[];

  link: ILink;

  detailList: IDetail[];

  tagIdList: number[];

  position: number;

  tagList?: ITag[];

  technoList?: string[];

  styles: {
    classicView: {
      title?: any;
      subTitle?: any;
      description?: any;
      pictureList?: any;
      technoList?: any;
      link?: any;
      detailList?: any;
      tagIdList?: any;
    },
    mobileView: {
      title?: any;
      subTitle?: any;
      description?: any;
      pictureList?: any;
      technoList?: any;
      link?: any;
      detailList?: any;
      tagIdList?: any;
    }
  };
}
