import { AfterViewInit, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { AddComponentsService } from '../../../core/services/add-components/add-components.service';
import { ContactOpenCloseService } from '../../../core/services/contact-open-close/contact-open-close.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  @Input() hideHeader = false;
  selectedMenu = '';
  openedMenu = false;
  menuTab = false;
  that: any;

  moduleToShowList = [
    { hash: 'competences', name: 'Compétences'},
    { hash: 'experiences', name: 'Expériences'},
    { hash: 'formations', name: 'Formations'},
    { hash: 'portfolio', name: 'Portfolio'},
    { hash: 'interests', name: 'Intérêts'}
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
    private addComponents: AddComponentsService,
    private viewContainerRef: ViewContainerRef,
    private readonly contactOpenCloseService: ContactOpenCloseService
  ) {}

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
    } else { this.initModules(this); }

    window.addEventListener('resize', () => {
      this.refreshView(this);
    });

    window.location.hash = `#${this.urlHash}`;
    this.selectedMenu = this.urlHash;
  }

  ngAfterViewInit(): void {
    if (this.menuTab && MainComponent.isMissingLabelsIcons()) {
      this.addIconsToLabels();
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
          if (el) { el.insertBefore(icon, el.firstChild); }
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
    ) { return; }

    const moduleToShow = this.moduleToShowList.find(mod => select.target.innerText.includes(mod.name));

    if (moduleToShow) {
      window.location.hash = `#${moduleToShow.hash}`;
      this.selectedMenu = moduleToShow.hash;
    }
  }

  selectMenu(e: any, hash: string) {
    e.preventDefault();
    window.location.hash = `#${hash}`;
    this.selectedMenu = hash;

    // @ts-ignore
    const elToClear = document.querySelector('app-main').nextElementSibling;

    this.indexTab = this.moduleToShowList.findIndex(mod => mod.hash === hash);
    this.addComponents.addDynamicComponent(this.viewContainerRef, this.indexTab);
    if (elToClear && elToClear.nodeName !== 'APP-FOOTER') { // @ts-ignore
      elToClear.parentElement.removeChild(elToClear); }
  }

  initModules(that: any) {
    const urlHash = MainComponent.getActualHashOrSetDefault();
    this.indexTab = urlHash ? that.moduleToShowList.findIndex((mod: any) => mod.hash === urlHash) : 0;
    this.selectedMenu = urlHash;

    that.viewContainerRef.clear();
    that.addComponents.addDynamicComponent(that.viewContainerRef, this.indexTab);
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
