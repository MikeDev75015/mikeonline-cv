import { HomeComponent } from '../../../modules/application/components/pages/home/home.component';
import { SkillsComponent } from '../../../modules/application/components/pages/skills/skills.component';
import { ExperiencesComponent } from '../../../modules/application/components/pages/experiences/experiences.component';
import { FormationsComponent } from '../../../modules/application/components/pages/formations/formations.component';
import { InterestsComponent } from '../../../modules/application/components/pages/interests/interests.component';
import { PortfolioComponent } from '../../../modules/application/components/pages/portfolio/portfolio.component';

export type ComponentType = typeof HomeComponent
  |typeof SkillsComponent
  | typeof ExperiencesComponent
  | typeof FormationsComponent
  | typeof PortfolioComponent
  | typeof InterestsComponent;
