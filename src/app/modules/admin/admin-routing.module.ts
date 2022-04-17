import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCvInfosComponent } from './components/pages/admin-cv-infos/admin-cv-infos.component';
import { AdminExperiencesComponent } from './components/pages/admin-experiences/admin-experiences.component';
import { AdminFormationsComponent } from './components/pages/admin-formations/admin-formations.component';
import { AdminInterestsComponent } from './components/pages/admin-interests/admin-interests.component';
import { AdminProjectsComponent } from './components/pages/admin-projects/admin-projects.component';
import { AdminSkillsComponent } from './components/pages/admin-skills/admin-skills.component';
import { AdminTagsComponent } from './components/pages/admin-tags/admin-tags.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './services/auth-guard/auth.guard';

const routes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'cv-infos',
        pathMatch: 'full',
      },
      {
        path: 'cv-infos',
        component: AdminCvInfosComponent,
      },
      {
        path: 'tags',
        component: AdminTagsComponent,
      },
      {
        path: 'skills',
        component: AdminSkillsComponent,
      },
      {
        path: 'experiences',
        component: AdminExperiencesComponent,
      },
      {
        path: 'formations',
        component: AdminFormationsComponent,
      },
      {
        path: 'projects',
        component: AdminProjectsComponent,
      },
      {
        path: 'interests',
        component: AdminInterestsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
