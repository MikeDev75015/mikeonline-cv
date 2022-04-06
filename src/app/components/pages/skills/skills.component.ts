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

/**
 * Allows to use WordCloud js library
 */
declare global {
  interface Window {
    WordCloud: any;
  }
}
window.WordCloud = window.WordCloud || {};

/**
 * The component of the skills page.
 */
@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit, OnDestroy, AfterViewChecked {
  /**
   * An observable allowing to initialize the page when data are loaded.
   */
  public isLoadingData$: Observable<boolean> = of(true);

  /**
   * The text to display under the skills cloud when no skill is selected.
   */
  public defaultText?: string;

  /**
   * Contains the selected skill when clicking on its HTML element.
   */
  public selectedKeyword?: string;

  /**
   * Allows to count how many skills are drawn.
   */
  public skillsDrawn?: number;

  /**
   * A boolean to know if experiences panel is open or not.
   */
  public experiencesPanelOpenState = false;

  /**
   * A boolean to know if formations panel is open or not.
   */
  public formationsPanelOpenState = false;

  /**
   * A boolean to know if projects panel is open or not.
   */
  public projectsPanelOpenState = false;

  /**
   * Contains the skills loaded.
   */
  public skillList?: ICompetence[];

  /**
   * Contains the related experiences found.
   */
  public experienceList?: IExperience[];

  /**
   * Contains the related formations found.
   */
  public formationList?: IFormation[];

  /**
   * Contains the related projects found.
   */
  public portfolioList?: IProject[];

  /**
   * A boolean that inform when the skills are loaded.
   */
  public skillsLoaded = false;

  /**
   * A boolean that inform if word-cloud is initialized or not.
   * @private
   */
  private initWordCloud = false;

  /**
   * Contains the keywords to draw in canvas element.
   * @private
   */
  private wordList: [string, number][] = [];

  /**
   * Allows to draw the keywords list with delay.
   * @private
   */
  private timeOutToDrawn = 0;

  private drawingTimeout: number | undefined;

  /**
   * The default police size of a word to avoid too small size.
   * @private
   */
  private readonly wcDefaultPoliceSize = 15;

  /**
   * Labels of different expertise levels.
   * @private
   */
  private readonly expertiseLevelLabel = EXPERTISE_LEVEL_LABEL;

  /**
   * Labels of different priority levels.
   * @private
   */
  private readonly priorityLabel = PRIORITY_LABEL;

  /**
   * @ignore
   * @param dataService
   * @param utilsService
   * @param cdRef
   */
  constructor(
    private readonly dataService: DataService,
    private readonly utilsService: UtilsService,
    private readonly cdRef: ChangeDetectorRef,
  ) {
  }

  /**
   * Sets the expected grid width.
   * @private
   */
  private static getGridForWidth(): number {
    return window?.innerWidth < 840 ? 4 : 12;
  }

  /**
   * Gets the canvas element in the DOM.
   * @private
   */
  private static getCanvasElement(): HTMLElement | null {
    return document.getElementById('wc_canvas');
  }

  /**
   * Sets skillsLoaded to true when data are loaded.
   */
  ngOnInit(): void {
    this.isLoadingData$ = this.dataService.isDataLoaded(selectCompetencesLoaded).pipe(
      tap((loaded) => {
        this.skillsLoaded = loaded;
      }),
      map((loaded) => !loaded),
    );
  }

  /**
   * Removes event listeners from canvas element.
   * Warn in the console if canvas is not found.
   */
  ngOnDestroy(): void {
    const wcCanvas = SkillsComponent.getCanvasElement();
    if (wcCanvas) {
      // @ts-ignore
      wcCanvas.removeEventListener('wordcloudstart', this.wordCloudStartCallback);
      // @ts-ignore
      wcCanvas.removeEventListener('wordclouddrawn', this.wordCloudDrawnCallback);
      // @ts-ignore
      wcCanvas.removeEventListener('wordcloudstop', this.worldCloudStopCallback);
    } else {
      console.warn('Canvas element not found!');
    }

    window.removeEventListener('resize', this.windowResizeCallback);
  }

  /**
   * Initializes and loads WordCloud when skills are loaded if it is not yet initialized.
   */
  ngAfterViewChecked(): void {
    if (
      !this.initWordCloud &&
      window.WordCloud.isSupported &&
      SkillsComponent.getCanvasElement() &&
      !document.querySelector('.word-in-cloud') &&
      this.skillsLoaded
    ) {
      this.initWordCloud = true;
      this.defaultText = 'Chargement des technos en cours...';

      setTimeout(async () => {
        await this.initializeEvents();
      }, 500);
    }

    this.cdRef.detectChanges();
  }

  /**
   * Pluralizes string if needed.
   * @see UtilsService#pluralize
   * @param value
   */
  public pluralize = (value: number): string => this.utilsService.pluralize(value);

  /**
   * Returns the expertise level label corresponding to the value.
   * @param value The expertise level value of the techno.
   */
  public getExpertiseLevelLabel(value: number): string {
    return this.expertiseLevelLabel[value];
  }

  /**
   * Returns the priority label corresponding to the value.
   * @param value The priority value of the techno.
   */
  public getPriorityLabel(value: number): string {
    return this.priorityLabel[value];
  }

  /**
   * The callback of the wordclouddrawn event.
   */
  private readonly wordCloudDrawnCallback = () => {
    this.timeOutToDrawn += 25;
    setTimeout(() => {
      this.skillsDrawn = this.skillsDrawn !== undefined ? this.skillsDrawn + 1 : 1;
    }, this.timeOutToDrawn);
  }

  /**
   * The callback of the wordcloudstart event.
   */
  private readonly wordCloudStartCallback = () => {
    this.skillsDrawn = 0;
    this.timeOutToDrawn = 0;
  }

  /**
   * The callback of the wordcloudstop event.
   */
  private readonly worldCloudStopCallback = () => {
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

  /**
   * The callback of the window resize event.
   */
  private readonly windowResizeCallback = () => {
    if (this.drawingTimeout) {
      clearTimeout(this.drawingTimeout);
      this.drawingTimeout = undefined;
    }

    this.drawingTimeout = window.setTimeout(async () => {
      const wcCanvas = SkillsComponent.getCanvasElement();
      if (!wcCanvas) {
        return;
      }

      wcCanvas.innerHTML = '';

      this.defaultText = 'Chargement des technos en cours...';
      await this.loadWordCloudInCanvasElement(wcCanvas);
    }, 500);
  }

  /**
   * Returns the WordCloud options.
   * @private
   */
  private setWorldCloudOptions(): WorldCloudOptions {
    return {
      gridSize: SkillsComponent.getGridForWidth(),
      fontFamily: 'Roboto',
      color() {
        return (['#555', '#024873', '#4E7F9D'])[Math.floor(Math.random() * 3)];
      },
      backgroundColor: 'transparent',
      rotateRatio: 0,
      classes: 'word-in-cloud',
    };
  }

  /**
   * Allows to adapt the police size of a skill by its tag values.
   * @param times The number of use of the tag.
   * @param weight The weight of the tag.
   * @private
   */
  private policeSize(times: number, weight: number): number {
    if (!weight) {
      weight = 1;
    }
    return this.wcDefaultPoliceSize + (times * weight);
  }

  /**
   * Adds the onclick method to a skill that allows to find all related experiences, formations and projects of a skill.
   * @param el The HTML element of the skill.
   * @private
   */
  private addClickActionOnElement(el: HTMLElement) {
    el.onclick = async (e) => {
      e.preventDefault();
      this.selectedKeyword = el.innerText;
      await this.buildCompetencesSummary(el.innerText);
    };

    el.setAttribute('init-onclick', 'true');
  }

  /**
   * Initializes events.
   * @private
   */
  private async initializeEvents(): Promise<void> {
    const wcCanvas = SkillsComponent.getCanvasElement();
    if (!wcCanvas) {
      console.warn('Cannot draw the word cloud, the canvas is missing or invalid!');
      return;
    }

    // @ts-ignore
    wcCanvas.addEventListener('wordcloudstart', this.wordCloudStartCallback);
    // @ts-ignore
    wcCanvas.addEventListener('wordclouddrawn', this.wordCloudDrawnCallback);
    // @ts-ignore
    wcCanvas.addEventListener('wordcloudstop', this.worldCloudStopCallback);

    window.addEventListener('resize', this.windowResizeCallback);

    await this.loadWordCloudInCanvasElement(wcCanvas);
  }

  /**
   * Loads WordCloud to the canvas element.
   * @param wcCanvas
   * @private
   */
  private async loadWordCloudInCanvasElement(wcCanvas: HTMLElement): Promise<void> {
    this.skillsDrawn = 0;
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

  /**
   * Finds all related experiences, formations and projects of a skill when clicking on its name.
   * @param skillName
   * @private
   */
  private async buildCompetencesSummary(skillName: string): Promise<void> {
    const [tag] = await this.dataService.getStoreData<ITag[]>({
      selector: selectAllTags,
      defaultValue: [],
      value: skillName,
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
    this.skillList = allRelatedList[3].map((c) => {
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
