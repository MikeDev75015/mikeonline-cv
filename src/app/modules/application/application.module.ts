import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { LoadingComponent } from '../../core/components/loading/loading.component';
import { LoadingDirective } from '../../core/directives/loading/loading.directive';
import { PdfCreatorService } from '../../core/services/pdf-creator/pdf-creator.service';
import { FirstLetterUppercasePipe } from '../../shared/pipes/first-letter-uppercase.pipe';
import { HeaderTitleFormatPipe } from '../../shared/pipes/header-title-format.pipe';
import { IncompressibleSpacePipe } from '../../shared/pipes/incompressible-space.pipe';
import { SharedModule } from '../../shared/shared.module';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import {
  BtnMobileContactComponent,
} from './components/fragments/contact/btn-mobile-contact/btn-mobile-contact.component';
import { ContactComponent } from './components/fragments/contact/contact.component';
import { BottomFooterComponent } from './components/fragments/footer/bottom-footer/bottom-footer.component';
import { FooterComponent } from './components/fragments/footer/footer.component';
import { LeftFooterComponent } from './components/fragments/footer/left-footer/left-footer.component';
import { HeaderComponent } from './components/fragments/header/header.component';
import { ItemDatesComponent } from './components/fragments/item-elements/item-dates/item-dates.component';
import {
  ItemOpenCloseButtonsComponent,
} from './components/fragments/item-elements/item-open-close-buttons/item-open-close-buttons.component';
import { ItemTagListComponent } from './components/fragments/item-elements/item-tag-list/item-tag-list.component';
import { ItemComponent } from './components/fragments/item/item.component';
import { MainComponent } from './components/fragments/main/main.component';
import { SkillsRadarChartComponent } from './components/fragments/skills-radar-chart/skills-radar-chart.component';
import { OneLetterByLinePipe } from './components/fragments/vertical-accordion/pipes/one-letter-by-line.pipe';
import {
  VerticalAccordionItemComponent,
} from './components/fragments/vertical-accordion/vertical-accordion-item/vertical-accordion-item.component';
import { VerticalAccordionComponent } from './components/fragments/vertical-accordion/vertical-accordion.component';
import {
  ExperienceItemDetailComponent,
} from './components/pages/experiences/experience-item-detail/experience-item-detail.component';
import { ExperiencesComponent } from './components/pages/experiences/experiences.component';
import {
  FormationItemDetailComponent,
} from './components/pages/formations/formation-item-detail/formation-item-detail.component';
import { FormationsComponent } from './components/pages/formations/formations.component';
import { HomeComponent } from './components/pages/home/home.component';
import { InterestsComponent } from './components/pages/interests/interests.component';
import { ProjectItemComponent } from './components/pages/portfolio/portfolio-item/project-item.component';
import { PortfolioComponent } from './components/pages/portfolio/portfolio.component';
import { SkillsComponent } from './components/pages/skills/skills.component';
import { PageLayoutComponent } from './layouts/page-layout/page-layout.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    PageLayoutComponent,

    LoadingComponent,
    LoadingDirective,

    MainComponent,
    ContactComponent,
    HeaderComponent,
    FooterComponent,

    HomeComponent,
    SkillsComponent,
    ExperiencesComponent,
    FormationsComponent,
    PortfolioComponent,
    InterestsComponent,

    ItemComponent,
    ItemTagListComponent,
    ItemOpenCloseButtonsComponent,
    ItemDatesComponent,
    ExperienceItemDetailComponent,
    FormationItemDetailComponent,
    ProjectItemComponent,
    BottomFooterComponent,
    LeftFooterComponent,
    VerticalAccordionComponent,
    VerticalAccordionItemComponent,
    BtnMobileContactComponent,
    SkillsRadarChartComponent,

    OneLetterByLinePipe,
    HeaderTitleFormatPipe,
    IncompressibleSpacePipe,
    FirstLetterUppercasePipe,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ApplicationRoutingModule,

    MatTabsModule,
    MatMenuModule,
    MatGridListModule,
    MatButtonModule,
    MatTreeModule,
    MatExpansionModule,
    MatBadgeModule,
  ],
  providers: [
    PdfCreatorService,
  ],
  entryComponents: [
    SkillsComponent,
    ExperiencesComponent,
    FormationsComponent,
    PortfolioComponent,
    InterestsComponent,
  ],
})
export class ApplicationModule {
}
