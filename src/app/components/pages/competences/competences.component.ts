import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import {
  EXPERTISE_LEVEL_LABEL,
  ICompetence,
  IExperience,
  IFormation,
  IProject,
  ITag,
  PRIORITY_LABEL,
} from '../../../core/core-index';
import { DataService, UtilsService } from '../../../shared/shared-index';

moment.locale('fr');

declare global {
  interface Window {
    WordCloud: any;
  }
}
window.WordCloud = window.WordCloud || {};

@Component({
  selector: 'app-competences',
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.scss'],
})
export class CompetencesComponent implements OnInit, OnDestroy, AfterViewChecked {
  public defaultText = 'Cliquez sur une techno pour en savoir +';

  public selectedKeyword = '';

  public competencesDrawn = 0;

  public expPanelOpenState = false;

  public formPanelOpenState = false;

  public portPanelOpenState = false;

  public experienceList: IExperience[] = [];

  public formationList: IFormation[] = [];

  public portfolioList: IProject[] = [];

  public competenceList: ICompetence[] = [];

  private expertiseLevelLabel = EXPERTISE_LEVEL_LABEL;

  private priorityLabel = PRIORITY_LABEL;

  private initWordCloud = false;

  private competencesLoaded = false;

  private competencesList: [string, number][] = [];

  private skillDetails = {
    expertiseLevel: 4, experienceYears: 2, priority: 2,
  };

  private wcDefaultPoliceSize = 15;

  private timeOutToDrawn = 0;

  private subscriptionList: Subscription[] = [];

  constructor(
    private readonly dataService: DataService,
    private readonly utilsService: UtilsService,
  ) {}

  private static getGridForWidth(): number {
    let gridValue = 12;
    if (window.innerWidth < 840) {
      gridValue = 4;
    }
    return gridValue;
  }

  ngOnInit(): void {
    this.subscriptionList.push(
      this.dataService.isCompetencesLoaded().subscribe(async (loaded) => {
        if (!loaded) {
          return;
        }
        this.competencesLoaded = true;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());

    const that = this;
    // @ts-ignore
    wcCanvas.removeEventListener('wordcloudstart', () => {
      that.wordCloudStart();
    });
    // @ts-ignore
    wcCanvas.removeEventListener('wordclouddrawn', () => {
      that.wordCloudDrawn();
    });
    // @ts-ignore
    wcCanvas.removeEventListener('wordcloudstop', () => {
      that.addWorldCloudClick();
    });
  }

  async ngAfterViewChecked(): Promise<void> {
    if (
      !this.initWordCloud &&
      window.WordCloud.isSupported &&
      document.querySelector('#wc_canvas') &&
      !document.querySelector('.word-in-cloud') &&
      this.competencesLoaded
    ) {
      this.initWordCloud = true;

      setTimeout(async () => {
        await this.loadWorldCloud();
      }, 500);
    }
  }

  public pluralize = (value: number) => this.utilsService.pluralize(value);

  public convertDateToNumber = (value: string) => this.utilsService.convertDateToNumber(value);

  public getExpertiseLevelLabel(value: number): string {
    return this.expertiseLevelLabel[value];
  }

  public getPriorityLabel(value: number): string {
    return this.priorityLabel[value];
  }

  private async loadWorldCloud(): Promise<void> {
    const that = this;
    const wcCanvas = document.getElementById('wc_canvas');

    // @ts-ignore
    wcCanvas.addEventListener('wordcloudstart', () => {
      that.wordCloudStart();
    });
    // @ts-ignore
    wcCanvas.addEventListener('wordclouddrawn', () => {
      that.wordCloudDrawn();
    });
    // @ts-ignore
    wcCanvas.addEventListener('wordcloudstop', () => {
      that.addWorldCloudClick();
    });

    this.competencesDrawn = 0;
    this.timeOutToDrawn = 0;

    const tagList = await this.dataService.getSummary();
    this.competencesList = tagList.map(
      tag => ([tag.name, this.policeSize(tag.times as number, tag.weight)]),
    );

    window.WordCloud(wcCanvas, {
      ...this.setWorldCloudOptions(),
      list: this.competencesList,
    });
  }

  private wordCloudDrawn() {
    this.timeOutToDrawn += 25;
    setTimeout(() => {
      this.competencesDrawn++;
    }, this.timeOutToDrawn);
  }

  private wordCloudStart() {
    this.competencesDrawn = 0;
    this.timeOutToDrawn = 0;
  }

  private setWorldCloudOptions(): WorldCloudOptions {
    return {
      gridSize: CompetencesComponent.getGridForWidth(),
      fontFamily: 'Roboto',
      color() {
        return (['#555', '#024873', '#4E7F9D'])[Math.floor(Math.random() * 3)];
      },
      backgroundColor: 'transparent',
      rotateRatio: 0,
      classes: 'word-in-cloud',
    };
  }

  private policeSize(times: number, weight: number): number {
    if (!weight) {
      weight = 1;
    }
    return this.wcDefaultPoliceSize + (times * weight);
  }

  private addWorldCloudClick(): void {
    const wcElements = Array.from(document.getElementsByClassName('word-in-cloud'));
    // tslint:disable-next-line:prefer-for-of
    for (let element of wcElements) {
      if (!element.getAttribute('init-onclick')) {
        this.addClickActionOnElement(element as HTMLElement);
      }
    }
  }

  private addClickActionOnElement(el: HTMLElement) {
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    el.onclick = function () {
      that.selectedKeyword = el.innerText;
      that.buildCompetencesSummary(el.innerText).then(() => {
        /**/
      });
    };

    el.setAttribute('init-onclick', 'true');
  }

  private async buildCompetencesSummary(competence: string): Promise<void> {
    const [tag] = await this.dataService.getTags<ITag[]>(competence, 'name');

    await this.getRelatedExperiences(tag.id);
    await this.getRelatedFormations(tag.id);
    await this.getRelatedProjects(tag.id);
    await this.getRelatedCompetences(tag.id);
  }

  private async getRelatedExperiences(tagId: number): Promise<void> {
    this.experienceList = await this.dataService.getExperiences<IExperience[]>(tagId, 'tagIdList');
  }

  private async getRelatedFormations(tagId: number): Promise<void> {
    this.formationList = await this.dataService.getFormations<IFormation[]>(tagId, 'tagIdList');
  }

  private async getRelatedProjects(tagId: number): Promise<void> {
    this.portfolioList = (await this.dataService.getProjects<IProject[]>(tagId, 'tagIdList')).map(s => ({
      ...s,
      technoList: this.utilsService.initTechnoListWithTagList(s.tagList as ITag[]),
    }));
  }

  private async getRelatedCompetences(tagId: number): Promise<void> {
    this.competenceList = (await this.dataService.getCompetences<ICompetence[]>(tagId, 'tagIdList')).map(c => {
      const experienceYearsText = this.utilsService.dateConverter(
        c.startDate + '-01', 'startOf', 'year', 'fromNow', true,
      );
      return {
        ...c,
        experienceYears: {
          text: experienceYearsText,
          value: this.utilsService.convertDateToNumber(experienceYearsText),
        },
      };
    });
  }
}
