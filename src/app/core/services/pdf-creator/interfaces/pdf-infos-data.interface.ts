import { ProjectItem } from '../../../../modules/application/interfaces/project-item.interface';
import { UsedTag } from '../../../../modules/application/interfaces/used-tag.interface';
import { CvInfosV1 } from '../../../interfaces/models/v1/cv-infos.interface';
import { ExperienceV1 } from '../../../interfaces/models/v1/experience.interface';
import { FormationV1 } from '../../../interfaces/models/v1/formation.interface';
import { InterestV1 } from '../../../interfaces/models/v1/interest.interface';

export interface PdfInfosData extends CvInfosV1 {
  data: {
    experienceList: ExperienceV1[];
    formationList: FormationV1[];
    projectList: ProjectItem[];
    interestList: InterestV1[];
    competenceList: UsedTag[];
  };
}
