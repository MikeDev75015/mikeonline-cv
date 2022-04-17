import { ProjectV1 } from '../../../core/interfaces/models/v1/project.interface';

export interface ProjectItem extends ProjectV1 {
  technoList: string[];

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
