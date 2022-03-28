import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { partialIsoDatePattern } from '../../../core/constants/patterns.constant';
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
import { selectAllCompetences, selectCompetencesLoaded } from '../../../core/ngrx/selectors/competences.selectors';
import { selectAllExperiences } from '../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations } from '../../../core/ngrx/selectors/formations.selectors';
import { selectAllProjects } from '../../../core/ngrx/selectors/projects.selectors';
import { selectAllTags } from '../../../core/ngrx/selectors/tags.selectors';
import { DayJsService } from '../../../core/services/dayjs/dayjs.service';
import { DataService, UtilsService } from '../../../shared/shared-index';

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
  public isLoadingData: Observable<boolean> = of(true);

  public defaultText?: string;

  public selectedKeyword?: string;

  public competencesDrawn?: number;

  public expPanelOpenState = false;

  public formPanelOpenState = false;

  public portPanelOpenState = false;

  public competenceList?: ICompetence[];

  public experienceList?: IExperience[];

  public formationList?: IFormation[];

  public portfolioList?: IProject[];

  public competencesLoaded = false;

  private initWordCloud = false;

  private wordList: [string, number][] = [];

  private timeOutToDrawn = 0;

  private readonly wcDefaultPoliceSize = 15;

  private readonly expertiseLevelLabel = EXPERTISE_LEVEL_LABEL;

  private readonly priorityLabel = PRIORITY_LABEL;

  constructor(
    private readonly dataService: DataService,
    private readonly utilsService: UtilsService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  private static getGridForWidth(): number {
    let gridValue = 12;
    if (window.innerWidth < 840) {
      gridValue = 4;
    }
    return gridValue;
  }

  ngOnInit(): void {
    this.isLoadingData = this.dataService.isDataLoaded(selectCompetencesLoaded).pipe(
      tap((loaded) => {
        this.competencesLoaded = loaded;
      }),
      map((loaded) => !loaded),
    );
  }

  ngOnDestroy(): void {
    const wcCanvas = document.getElementById('wc_canvas');
    if (wcCanvas) {
      // @ts-ignore
      wcCanvas.removeEventListener('wordcloudstart', () => {
        this.wordCloudStart();
      });
      // @ts-ignore
      wcCanvas.removeEventListener('wordclouddrawn', () => {
        this.wordCloudDrawn();
      });
      // @ts-ignore
      wcCanvas.removeEventListener('wordcloudstop', () => {
        this.addWorldCloudClick();
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

    this.cdRef.detectChanges();
  }

  public pluralize = (value: number): string => this.utilsService.pluralize(value);

  public getExpertiseLevelLabel(value: number): string {
    return this.expertiseLevelLabel[value];
  }

  public getPriorityLabel(value: number): string {
    return this.priorityLabel[value];
  }

  private wordCloudDrawn() {
    this.timeOutToDrawn += 25;
    setTimeout(() => {
      this.competencesDrawn = this.competencesDrawn !== undefined ? this.competencesDrawn + 1 : 0;
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

    for (const element of wcElements) {
      if (!element.getAttribute('init-onclick')) {
        this.addClickActionOnElement(element as HTMLElement);
      }
    }

    this.defaultText = 'Cliquez sur une techno pour en savoir +';
  }

  private addClickActionOnElement(el: HTMLElement) {
    el.onclick = async (e) => {
      e.preventDefault();
      this.selectedKeyword = el.innerText;
      await this.buildCompetencesSummary(el.innerText);
    };

    el.setAttribute('init-onclick', 'true');
  }

  private async loadWorldCloud(): Promise<void> {
    const wcCanvas = document.getElementById('wc_canvas');
    if (!wcCanvas) {
      console.error('Cannot draw the word cloud, the canvas is missing or invalid!');
      return;
    }

    // @ts-ignore
    wcCanvas.addEventListener('wordcloudstart', () => {
      this.wordCloudStart();
    });
    // @ts-ignore
    wcCanvas.addEventListener('wordclouddrawn', () => {
      this.wordCloudDrawn();
    });
    // @ts-ignore
    wcCanvas.addEventListener('wordcloudstop', () => {
      this.addWorldCloudClick();
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
      { list: [] as IExperience[], selector: selectAllExperiences },
      { list: [] as IFormation[], selector: selectAllFormations },
      { list: [] as IProject[], selector: selectAllProjects },
      { list: [] as ICompetence[], selector: selectAllCompetences },
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
      const compStartDate = comp.startDate.match(partialIsoDatePattern) ? comp.startDate + '-01' : comp.startDate;
      const experienceYearsText = DayJsService.getTimeToNow(compStartDate, true);
      return {
        ...comp,
        experienceYears: {
          text: experienceYearsText,
          value: this.utilsService.convertDateToKnobYearsValue(experienceYearsText),
        },
      };
    }) as ICompetence[];
  }
}
