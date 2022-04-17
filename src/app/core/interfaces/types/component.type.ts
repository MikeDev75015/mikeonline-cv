import { ExperiencesComponent } from '../../../modules/application/components/pages/experiences/experiences.component';
import { FormationsComponent } from '../../../modules/application/components/pages/formations/formations.component';
import { HomeComponent } from '../../../modules/application/components/pages/home/home.component';
import { InterestsComponent } from '../../../modules/application/components/pages/interests/interests.component';
import { ProjectsComponent } from '../../../modules/application/components/pages/projects/projects.component';
import { SkillsComponent } from '../../../modules/application/components/pages/skills/skills.component';

export type ComponentType = typeof HomeComponent
  | typeof SkillsComponent
  | typeof ExperiencesComponent
  | typeof FormationsComponent
  | typeof ProjectsComponent
  | typeof InterestsComponent;
