import { HomeComponent } from '../../../components/pages/home/home.component';
import { SkillsComponent } from '../../../components/pages/skills/skills.component';
import { ExperiencesComponent } from '../../../components/pages/experiences/experiences.component';
import { FormationsComponent } from '../../../components/pages/formations/formations.component';
import { InterestsComponent } from '../../../components/pages/interests/interests.component';
import { PortfolioComponent } from '../../../components/pages/portfolio/portfolio.component';

export type ComponentType = typeof HomeComponent
  |typeof SkillsComponent
  | typeof ExperiencesComponent
  | typeof FormationsComponent
  | typeof PortfolioComponent
  | typeof InterestsComponent;
