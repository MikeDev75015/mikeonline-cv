import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminTagsComponent } from './components/pages/admin-tags/admin-tags.component';
import { AdminExperiencesComponent } from './components/pages/admin-experiences/admin-experiences.component';
import { AdminFormationsComponent } from './components/pages/admin-formations/admin-formations.component';
import { AdminSkillsComponent } from './components/pages/admin-skills/admin-skills.component';
import { AdminProjectsComponent } from './components/pages/admin-projects/admin-projects.component';
import { AdminInterestsComponent } from './components/pages/admin-interests/admin-interests.component';



@NgModule({
  declarations: [
    SignInComponent,
    AdminLayoutComponent,
    AdminTagsComponent,
    AdminExperiencesComponent,
    AdminFormationsComponent,
    AdminSkillsComponent,
    AdminProjectsComponent,
    AdminInterestsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
  ],
})
export class AdminModule { }
