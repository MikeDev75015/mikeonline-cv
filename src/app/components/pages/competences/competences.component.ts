import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  EXPERTISE_LEVEL_LABEL,
  ICompetence,
  IExperience,
  IFormation,
  IProject,
  ITag,
  PRIORITY_LABEL,
  WorldCloudOptions,
} from '../../../core/core-index';
import { DataService, UtilsService } from '../../../shared/shared-index';
import { selectAllTags } from '../../../core/ngrx/selectors/tags.selectors';
import { selectAllCompetences, selectCompetencesLoaded } from '../../../core/ngrx/selectors/competences.selectors';
import { selectAllExperiences } from '../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations } from '../../../core/ngrx/selectors/formations.selectors';
import { selectAllProjects } from '../../../core/ngrx/selectors/projects.selectors';

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
  public defaultText = '';

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

  private wordList: [string, number][] = [];

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
      this.dataService.isDataLoaded(selectCompetencesLoaded).subscribe(async (loaded) => {
        if (!loaded) {
          return;
        }
        this.competencesLoaded = true;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((s) => s.unsubscribe());

    const wcCanvas = document.getElementById('wc_canvas');
    if (wcCanvas) {
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
  }

  ngAfterViewChecked(): void {
    if (
      !this.initWordCloud &&
      window.WordCloud.isSupported &&
      document.querySelector('#wc_canvas') &&
      !document.querySelector('.word-in-cloud') &&
      this.competencesLoaded
    ) {
      this.initWordCloud = true;
      this.defaultText = 'Chargement des technos en cours...';

      setTimeout(async () => {
        await this.loadWorldCloud();
      }, 500);
    }
  }

  public pluralize = (value: number): string => this.utilsService.pluralize(value);

  public convertDateToNumber = (value: string): number => this.utilsService.convertDateToNumber(value);

  public getExpertiseLevelLabel(value: number): string {
    return this.expertiseLevelLabel[value];
  }

  public getPriorityLabel(value: number): string {
    return this.priorityLabel[value];
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
    if (!wcElements || !wcElements.length) {
      return;
    }

    for (let element of wcElements) {
      if (!element.getAttribute('init-onclick')) {
        this.addClickActionOnElement(element as HTMLElement);
      }
    }

    this.defaultText = 'Cliquez sur une techno pour en savoir +';
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

  private async loadWorldCloud(): Promise<void> {
    const that = this;
    const wcCanvas = document.getElementById('wc_canvas');
    if (!wcCanvas) {
      console.error('Cannot draw the word cloud, the canvas is missing or invalid!');
      return;
    }

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
    this.wordList = tagList.map(
      tag => ([tag.name, this.policeSize(tag.times as number, tag.weight)]),
    );

    window.WordCloud(wcCanvas, {
      ...this.setWorldCloudOptions(),
      list: this.wordList,
    });
  }

  private async buildCompetencesSummary(competence: string): Promise<void> {
    const [tag] = await this.dataService.getStoreData<ITag[]>({
      selector: selectAllTags,
      defaultValue: [],
      value: competence,
      property: 'name',
    });

    const allRelatedList = await Promise.all([
      { list: this.experienceList, selector: selectAllExperiences },
      { list: this.formationList, selector: selectAllFormations },
      { list: this.portfolioList, selector: selectAllProjects },
      { list: this.competenceList, selector: selectAllCompetences },
    ].map((v) => {
      return this.dataService.getStoreData<typeof v.list>({
        selector: v.selector, defaultValue: [], value: tag.id, property: 'tagIdList',
      });
    }));

    this.experienceList = allRelatedList[0] as IExperience[];
    this.formationList = allRelatedList[1] as IFormation[];
    this.portfolioList = allRelatedList[2].map(s => ({
      ...s,
      technoList: this.utilsService.initTechnoListWithTagList(s.tagList as ITag[]),
    })) as IProject[];
    this.competenceList = allRelatedList[3].map((c) => {
      const comp = c as ICompetence;
      const experienceYearsText = this.utilsService.dateConverter(
        comp.startDate + '-01', 'startOf', 'year', 'fromNow', true,
      );
      return {
        ...comp,
        experienceYears: {
          text: experienceYearsText,
          value: this.utilsService.convertDateToNumber(experienceYearsText),
        },
      };
    }) as ICompetence[];
  }
}
