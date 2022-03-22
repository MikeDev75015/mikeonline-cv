import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactOpenCloseService } from '../../../core/services/contact-open-close/contact-open-close.service';
import { DataService } from '../../../shared/services/data/data.service';
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
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() hideHeader = false;

  @ViewChild(DynamicComponentLoaderDirective, { static: false }) dynamicComponentLoader!: DynamicComponentLoaderDirective;

  public isLoadingData: boolean | undefined;

  public selectedMenu = '';

  public openedMenu = false;

  public menuTab = false;

  public indexTab: number | undefined;

  private iconsToAdd: { id: string, icon: string }[] = [
    { id: '#icon-comp', icon: '<i class="material-icons">playlist_add_check</i>' },
    { id: '#icon-exp', icon: '<i class="material-icons">business_center</i>' },
    { id: '#icon-form', icon: '<i class="material-icons">school</i>' },
    { id: '#icon-port', icon: '<i class="material-icons">code</i>' },
    { id: '#icon-int', icon: '<i class="material-icons">whatshot</i>' },
  ];

  private moduleToShowList = [
    { hash: 'competences', name: 'Compétences' },
    { hash: 'experiences', name: 'Expériences' },
    { hash: 'formations', name: 'Formations' },
    { hash: 'portfolio', name: 'Portfolio' },
    { hash: 'interests', name: 'Intérêts' },
  ];

  private components: (
    typeof CompetencesComponent | typeof ExperiencesComponent | typeof FormationsComponent |
    typeof PortfolioComponent | typeof InterestsComponent
  )[] = [
    CompetencesComponent,
    ExperiencesComponent,
    FormationsComponent,
    PortfolioComponent,
    InterestsComponent,
  ];

  private urlHash: string | undefined;

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private readonly contactOpenCloseService: ContactOpenCloseService,
    private readonly dataService: DataService,
  ) {
  }

  private static getActualHashOrSetDefault(): string {
    return decodeURI(window.location.hash.replace('#', '')) &&
    decodeURI(window.location.hash.replace('#', '')) !== 'undefined'
      ? decodeURI(window.location.hash.replace('#', ''))
      : 'competences';
  }

  private static isMissingLabelsIcons(): boolean {
    return !document.querySelector('#icon-comp') ||
      !document.querySelector('#icon-form') ||
      !document.querySelector('#icon-form') ||
      !document.querySelector('#icon-port') ||
      !document.querySelector('#icon-int');
  }

  ngOnInit(): void {
    this.isLoadingData = true;

    this.subscriptionList.push(
      this.dataService.isAllDataLoaded().subscribe((isLoaded) => {
        if (!isLoaded) {
          return;
        }

        this.isLoadingData = false;
      })
    );

    this.menuTab = window.innerWidth > 840 && !this.menuTab;

    this.urlHash = MainComponent.getActualHashOrSetDefault();
    this.indexTab = this.urlHash ? this.moduleToShowList.findIndex((module) => module.hash === this.urlHash) : 0;
    window.location.hash = `#${this.urlHash}`;
    this.selectedMenu = this.urlHash;

    window.addEventListener('resize', () => {
      this.refreshView();
    });
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    if (this.menuTab && MainComponent.isMissingLabelsIcons()) {
      this.addIconsToLabels();
    }

    if (!this.menuTab) {
      this.loadModules();
    }
  }

  public updateHash(select: { target: { className: string | string[]; innerText: string; } }): void {
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

  public selectMenu(e: MouseEvent, hash: string): void {
    e.preventDefault();
    this.loadModules(hash);
  }

  public toggleMenu(opened: boolean): void {
    this.contactOpenCloseService.setOpenCloseContactStatus(false);
    this.openedMenu = opened;
  }

  private refreshView(): void {
    if (window.innerWidth > 840 && !this.menuTab) {
      this.clearViewContainerRef();
      this.menuTab = true;
    } else if (window.innerWidth < 841 && this.menuTab) {
      this.menuTab = false;
      this.loadModules();
    }

    if (this.menuTab && MainComponent.isMissingLabelsIcons()) {
      this.addIconsToLabels();
    }
  }

  private addIconsToLabels(): void {
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

  private loadModules(hash?: string): void {
    this.clearViewContainerRef();

    this.selectedMenu = hash || MainComponent.getActualHashOrSetDefault();
    this.indexTab = this.moduleToShowList.findIndex((module) => module.hash === this.selectedMenu) || 0;
    window.location.hash = `#${this.selectedMenu}`;

    // @ts-ignore
    this.dynamicComponentLoader.viewContainerRef.createComponent(this.components[this.indexTab]);
  }

  private clearViewContainerRef(): void {
    this.dynamicComponentLoader.viewContainerRef.clear();
  }
}
