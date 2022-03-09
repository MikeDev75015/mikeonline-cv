import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ContactOpenCloseService } from '../../../core/services/contact-open-close/contact-open-close.service';
import { CompetencesComponent } from '../../pages/competences/competences.component';
import { ExperiencesComponent } from '../../pages/experiences/experiences.component';
import { FormationsComponent } from '../../pages/formations/formations.component';
import { InterestsComponent } from '../../pages/interests/interests.component';
import { PortfolioComponent } from '../../pages/portfolio/portfolio.component';
import { DynamicComponentLoaderDirective } from './directives/dynamic-component-loader.directive';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterViewInit {
  @Input() hideHeader = false;

  @ViewChild(DynamicComponentLoaderDirective, { static: false }) dynamicComponentLoader!: DynamicComponentLoaderDirective;

  selectedMenu = '';

  openedMenu = false;

  menuTab = false;

  that: any;

  moduleToShowList = [
    { hash: 'competences', name: 'Compétences' },
    { hash: 'experiences', name: 'Expériences' },
    { hash: 'formations', name: 'Formations' },
    { hash: 'portfolio', name: 'Portfolio' },
    { hash: 'interests', name: 'Intérêts' },
  ];

  components: (
    typeof CompetencesComponent | typeof ExperiencesComponent | typeof FormationsComponent |
    typeof PortfolioComponent | typeof InterestsComponent
    )[] = [
    CompetencesComponent,
    ExperiencesComponent,
    FormationsComponent,
    PortfolioComponent,
    InterestsComponent,
  ];

  urlHash = MainComponent.getActualHashOrSetDefault();

  indexTab = this.urlHash ? this.moduleToShowList.findIndex((module) => module.hash === this.urlHash) : 0;

  iconsToAdd: { id: string, icon: string }[] = [
    { id: '#icon-comp', icon: '<i class="material-icons">playlist_add_check</i>' },
    { id: '#icon-exp', icon: '<i class="material-icons">business_center</i>' },
    { id: '#icon-form', icon: '<i class="material-icons">school</i>' },
    { id: '#icon-port', icon: '<i class="material-icons">code</i>' },
    { id: '#icon-int', icon: '<i class="material-icons">whatshot</i>' },
  ];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private readonly contactOpenCloseService: ContactOpenCloseService,
  ) {
  }

  private static isMissingLabelsIcons(): boolean {
    return !document.querySelector('#icon-comp') ||
      !document.querySelector('#icon-form') ||
      !document.querySelector('#icon-form') ||
      !document.querySelector('#icon-port') ||
      !document.querySelector('#icon-int');
  }

  ngOnInit(): void {
    if (window.innerWidth > 840 && !this.menuTab) {
      this.menuTab = true;
    }

    window.location.hash = `#${this.urlHash}`;
    this.selectedMenu = this.urlHash;

    window.addEventListener('resize', () => {
      this.refreshView(this);
    });
  }

  ngAfterViewInit(): void {
    if (this.menuTab && MainComponent.isMissingLabelsIcons()) {
      this.addIconsToLabels();
    }

    if (!this.menuTab) {
      this.loadModules();
    }
  }

  refreshView(that: any, forceRefresh = false) {
    if (window.innerWidth > 840 && (!that.menuTab || forceRefresh)) {
      that.menuTab = true;
      // @ts-ignore
      const moduleToRemove = document.querySelector('app-main').nextElementSibling;
      if (moduleToRemove && moduleToRemove.nodeName !== 'APP-FOOTER') {
        // @ts-ignore
        moduleToRemove.parentElement.removeChild(moduleToRemove);
      }
    } else if (window.innerWidth < 841 && (that.menuTab || forceRefresh)) {
      that.menuTab = false;
      // @ts-ignore
      const moduleToRemove = document.querySelector('app-main').nextElementSibling;
      if (!moduleToRemove || (moduleToRemove && moduleToRemove.nodeName === 'APP-FOOTER')) {
        that.initModules(that);
      }
    }

    if (this.menuTab && MainComponent.isMissingLabelsIcons()) {
      this.addIconsToLabels();
    }
  }

  addIconsToLabels() {
    let ref = 0;

    for (let i = 0; i < this.iconsToAdd.length; i++) {
      setTimeout(() => {
        if (ref === i && !document.querySelector(this.iconsToAdd[i].id)) {
          const el = document.querySelector('#mat-tab-label-0-' + i);
          const icon = document.createElement('span');
          icon.id = this.iconsToAdd[i].id;
          icon.style.pointerEvents = 'none';
          icon.innerHTML = this.iconsToAdd[i].icon;
          if (el) {
            el.insertBefore(icon, el.firstChild);
          }
        }
        ref++;
      }, 500);
    }
  }

  updateHash(select: any) {
    if (
      !select.target.className ||
      (select.target.className === 'mat-tab-labels') ||
      !select.target.className.includes('mat-tab-label')
    ) {
      return;
    }

    const moduleToShow = this.moduleToShowList.find(mod => select.target.innerText.includes(mod.name));

    if (moduleToShow) {
      window.location.hash = `#${moduleToShow.hash}`;
      this.selectedMenu = moduleToShow.hash;
    }
  }

  selectMenu(e: any, hash: string) {
    e.preventDefault();
    this.loadModules(hash);
  }

  loadModules(hash?: string) {
    if (this.selectedMenu) {
      this.dynamicComponentLoader.viewContainerRef.clear();
    }

    this.selectedMenu = hash || MainComponent.getActualHashOrSetDefault();
    window.location.hash = `#${this.selectedMenu}`;
    this.indexTab = this.moduleToShowList.findIndex((module) => module.hash === this.selectedMenu) || 0;

    // @ts-ignore
    this.dynamicComponentLoader.viewContainerRef.createComponent(this.components[this.indexTab]);
  }

  toggleMenu(opened: boolean) {
    this.contactOpenCloseService.setOpenCloseContactStatus(false);
    this.openedMenu = opened;
  }

  private static getActualHashOrSetDefault(): string {
    return decodeURI(window.location.hash.replace('#', '')) &&
    decodeURI(window.location.hash.replace('#', '')) !== 'undefined'
      ? decodeURI(window.location.hash.replace('#', ''))
      : 'competences';
  }

}
