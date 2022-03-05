import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import { AddComponentsService } from '../../../core/services/add-components/add-components.service';
import { ContactOpenCloseService } from '../../../core/services/contact-open-close/contact-open-close.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
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
    { hash: 'interets', name: 'Intérêts'}
  ];
  urlHash = MainComponent.getActualHashOrSetDefault();
  indexTab = this.urlHash ? this.moduleToShowList.findIndex(mod => mod.hash === this.urlHash) : 0;

  iconesToAdd = [
    {id: '#icone-comp', icone: '<i class="material-icons">playlist_add_check</i>'},
    {id: '#icone-exp', icone: '<i class="material-icons">business_center</i>'},
    {id: '#icone-form', icone: '<i class="material-icons">school</i>'},
    {id: '#icone-port', icone: '<i class="material-icons">code</i>'},
    {id: '#icone-int', icone: '<i class="material-icons">whatshot</i>'}
  ];

  constructor(
    private addComponents: AddComponentsService,
    private viewContainerRef: ViewContainerRef,
    private readonly contactOpenCloseService: ContactOpenCloseService
  ) {}

  ngOnInit() {
    this.that = this;
    if (window.innerWidth > 840 && !this.menuTab) {
      this.menuTab = true;
      if (
        !document.querySelector('#icone-comp') ||
        !document.querySelector('#icone-form') ||
        !document.querySelector('#icone-form') ||
        !document.querySelector('#icone-port') ||
        !document.querySelector('#icone-int')
      ) { this.addIconsToLabels(); }
    } else { this.initModules(this.that); }

    window.addEventListener('resize', () => {
      this.refreshView(this.that);
    });

    window.location.hash = `#${this.urlHash}`;
    this.selectedMenu = this.urlHash;
  }

  refreshView(that: any) {
    if (window.innerWidth > 840 && !that.menuTab) {
      that.menuTab = true;
      // @ts-ignore
      const elToClear = document.querySelector('app-main').nextElementSibling;
      if (elToClear && elToClear.nodeName !== 'APP-FOOTER') {
        // console.log("module à effacer : " + elToClear.nodeName);
        // @ts-ignore
        elToClear.parentElement.removeChild(elToClear);
      }
    } else if (window.innerWidth < 841 && that.menuTab) {
      that.menuTab = false;
      // @ts-ignore
      const elToClear = document.querySelector('app-main').nextElementSibling;
      if (!elToClear || (elToClear && elToClear.nodeName === 'APP-FOOTER')) {
        that.initModules(that);
      }
    }
  }

  addIconsToLabels() {
    let ref = 0;

    for (let i = 0; i < this.iconesToAdd.length; i++) {
      setTimeout(() => {
        if (ref === i && !document.querySelector(this.iconesToAdd[i].id)) {
          const el = document.querySelector('#mat-tab-label-0-' + i);
          const icone = document.createElement('span');
          icone.id = this.iconesToAdd[i].id;
          icone.style.pointerEvents = 'none';
          icone.innerHTML = this.iconesToAdd[i].icone;
          if (el) { el.insertBefore(icone, el.firstChild); }
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
