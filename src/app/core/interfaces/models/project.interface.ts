import {IImage} from '../image.interface';
import {IDetail} from '../detail.interface';
import {ILink} from '../link.interface';
import {IDescription} from '../description.interface';
import { ITag } from './tag.interface';

export interface IProject {
  id: string;
  title: string;
  subTitle: string;
  description: IDescription
  pictureList: IImage[];
  technoList: string[];
  link: ILink;
  detailList: IDetail[];
  tagIdList: number[];
  tagList?: ITag[];
  position?: number;
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
