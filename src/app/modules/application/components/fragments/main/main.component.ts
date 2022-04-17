import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComponentType } from '../../../../../core/interfaces/types/component.type';
import { ContactOpenCloseService } from '../../../../../core/services/contact-open-close/contact-open-close.service';
import { DataService } from '../../../../../shared';
import {
  DynamicComponentLoaderDirective,
} from '../../../../../shared/directives/dynamic-component-loader/dynamic-component-loader.directive';
import { ExperiencesComponent } from '../../pages/experiences/experiences.component';
import { FormationsComponent } from '../../pages/formations/formations.component';
import { HomeComponent } from '../../pages/home/home.component';
import { InterestsComponent } from '../../pages/interests/interests.component';
import { ProjectsComponent } from '../../pages/projects/projects.component';
import { SkillsComponent } from '../../pages/skills/skills.component';

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

  public tabsMenu = false;

  public indexTab: number | undefined;

  private urlHash: string | undefined;

  private readonly iconsToAdd: { id: string, iconName: string }[] = [
    { id: '#icon-home', iconName: 'home' },
    { id: '#icon-skill', iconName: 'playlist_add_check' },
    { id: '#icon-exp', iconName: 'business_center' },
    { id: '#icon-form', iconName: 'school' },
    { id: '#icon-port', iconName: 'code' },
    { id: '#icon-int', iconName: 'whatshot' },
  ];

  private readonly moduleToShowList = [
    { hash: 'home', name: 'Accueil' },
    { hash: 'skills', name: 'Compétences' },
    { hash: 'experiences', name: 'Expériences' },
    { hash: 'formations', name: 'Formations' },
    { hash: 'portfolio', name: 'Portfolio' },
    { hash: 'interests', name: 'Intérêts' },
  ];

  private readonly components: ComponentType[] = [
    HomeComponent,
    SkillsComponent,
    ExperiencesComponent,
    FormationsComponent,
    ProjectsComponent,
    InterestsComponent,
  ];

  private readonly subscriptionList: Subscription[] = [];

  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly dataService: DataService,
  ) {
  }

  private static getActualHashOrSetDefault(): string {
    return decodeURI(window.location.hash.replace('#', '')) &&
    decodeURI(window.location.hash.replace('#', '')) !== 'undefined'
      ? decodeURI(window.location.hash.replace('#', ''))
      : 'home';
  }

  private static isMissingLabelsIcons(): boolean {
    return !document.querySelector('#icon-skill') ||
      !document.querySelector('#icon-exp') ||
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

    this.tabsMenu = window.innerWidth > 840 && !this.tabsMenu;

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
    if (this.tabsMenu && MainComponent.isMissingLabelsIcons()) {
      this.addIconsToLabels();
    }

    if (!this.tabsMenu) {
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
    ContactOpenCloseService.setOpenCloseContactStatus(false);
    this.openedMenu = opened;
  }

  private refreshView(): void {
    if (window.innerWidth > 840 && !this.tabsMenu) {
      this.clearViewContainerRef();
      this.tabsMenu = true;
    } else if (window.innerWidth < 841 && this.tabsMenu) {
      this.tabsMenu = false;
      this.loadModules();
    }

    if (this.tabsMenu && MainComponent.isMissingLabelsIcons()) {
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
          icon.innerHTML = `<i class="material-icons">${this.iconsToAdd[i].iconName}</i>`;
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
