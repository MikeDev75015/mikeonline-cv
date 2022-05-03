import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { PickListWrapperComponent } from './components/fragments/pick-list-wrapper/pick-list-wrapper.component';
import { FormatValueDisplayPipe } from './components/fragments/table-wrapper/pipes/format-value-display.pipe';
import { TableWrapperComponent } from './components/fragments/table-wrapper/table-wrapper.component';
import { AdminCvInfosComponent } from './components/pages/admin-cv-infos/admin-cv-infos.component';
import { AdminExperiencesComponent } from './components/pages/admin-experiences/admin-experiences.component';
import { AdminFormationsComponent } from './components/pages/admin-formations/admin-formations.component';
import { AdminInterestsComponent } from './components/pages/admin-interests/admin-interests.component';
import { AdminProjectsComponent } from './components/pages/admin-projects/admin-projects.component';
import { AdminSkillsComponent } from './components/pages/admin-skills/admin-skills.component';
import { AdminTagsComponent } from './components/pages/admin-tags/admin-tags.component';
import { SignInComponent } from './components/pages/sign-in/sign-in.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

const primeNgModule: any[] = [
  TabMenuModule,
];

@NgModule({
  declarations: [
    SignInComponent,
    AdminLayoutComponent,
    AdminCvInfosComponent,
    AdminExperiencesComponent,
    AdminFormationsComponent,
    AdminInterestsComponent,
    AdminProjectsComponent,
    AdminSkillsComponent,
    AdminTagsComponent,

    TableWrapperComponent,
    PickListWrapperComponent,

    FormatValueDisplayPipe,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    ...primeNgModule,
  ],
})
export class AdminModule {
}
