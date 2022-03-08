import {ComponentFactoryResolver, Inject, Injectable, ViewContainerRef} from '@angular/core';
import { CompetencesComponent } from '../../../components/pages/competences/competences.component';
import { ExperiencesComponent } from '../../../components/pages/experiences/experiences.component';
import { FormationsComponent } from '../../../components/pages/formations/formations.component';
import { InterestsComponent } from '../../../components/pages/interests/interests.component';
import { PortfolioComponent } from '../../../components/pages/portfolio/portfolio.component';

@Injectable()
export class AddComponentsService {

  factoryResolver: any;
  rootViewContainer: any;

  components = [
    CompetencesComponent,
    ExperiencesComponent,
    FormationsComponent,
    PortfolioComponent,
    InterestsComponent
  ];

  // @ts-ignore
  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver;
  }

  addDynamicComponent(viewContainerRef: ViewContainerRef, indexEl: number) {
    this.rootViewContainer = viewContainerRef;
    const factory = this.factoryResolver.resolveComponentFactory(this.components[indexEl]);
    const component = factory.create(this.rootViewContainer.parentInjector);
    this.rootViewContainer.insert(component.hostView);
  }
}
