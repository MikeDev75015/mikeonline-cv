import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { EXPERTISE_LEVEL_LABEL, PRIORITY_LABEL, WorldCloudOptions } from '../../../../../core';
import { partialIsoDatePattern } from '../../../../../core/constants/patterns.constant';
import { ExperienceV1 } from '../../../../../core/interfaces/models/v1/experience.interface';
import { FormationV1 } from '../../../../../core/interfaces/models/v1/formation.interface';
import { ProjectV1 } from '../../../../../core/interfaces/models/v1/project.interface';
import { SkillV1 } from '../../../../../core/interfaces/models/v1/skill.interface';
import { selectAllExperiences } from '../../../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations } from '../../../../../core/ngrx/selectors/formations.selectors';
import { selectAllProjects } from '../../../../../core/ngrx/selectors/projects.selectors';
import { selectAllSkills, selectSkillsLoaded } from '../../../../../core/ngrx/selectors/skills.selectors';
import { DayJsService } from '../../../../../core/services/dayjs/dayjs.service';
import { DataService, UtilsService } from '../../../../../shared';
import { FormField } from '../../../../../shared/components/form-wrapper/interfaces/form-field.interface';
import { TemplatesService } from '../../../../../shared/services/templates/templates.service';
import { KnobSkill } from '../../../interfaces/knob-skill.interface';
import { ProjectItem } from '../../../interfaces/project-item.interface';

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
   * The skills filter form config
   */
  public formFields: FormField[] | undefined;

  /**
   * The filter value used
   */
  public filterValue = '';

  /**
   * Contains the filter input value
   */
  public formValues: { filterInputValue: string; } = {
    filterInputValue: '',
  };

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
  public skillList: SkillV1[] | undefined;

  /**
   * Contains the skills adapted for the knobs.
   */
  public knobSkill?: KnobSkill;

  /**
   * Contains the related experiences found.
   */
  public experienceList?: ExperienceV1[];

  /**
   * Contains the related formations found.
   */
  public formationList?: FormationV1[];

  /**
   * Contains the related projects found.
   */
  public projectItemList?: ProjectItem[];

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
    this.isLoadingData$ = this.dataService.isDataLoaded(selectSkillsLoaded).pipe(
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

  public onFormValuesChange({ filterInputValue }: { filterInputValue: string; }): void {
    this.filterValue = filterInputValue.toLowerCase();

    const wcElements: HTMLSpanElement[] = Array.from(document.querySelectorAll('span.word-in-cloud'));
    wcElements.forEach((element) => {
      const text = element.innerText.toLowerCase();
      if (this.filterValue && !text.includes(this.filterValue)) {
        element.style.opacity = '0.1';
        element.style.pointerEvents = 'none';
        return;
      }

      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    });
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
  };

  /**
   * The callback of the wordcloudstart event.
   */
  private readonly wordCloudStartCallback = () => {
    this.skillsDrawn = 0;
    this.timeOutToDrawn = 0;
  };

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
        this.addAttributesOnWcElement(element as HTMLElement);
      }
    }

    this.defaultText = 'Cliquez sur une techno pour en savoir +';
  };

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
  };

  /**
   * Returns the WordCloud options.
   * @private
   */
  private setWorldCloudOptions(): WorldCloudOptions {
    return {
      gridSize: SkillsComponent.getGridForWidth(),
      fontFamily: 'Roboto',
      color: () => (
        ['#555', '#024873', '#4E7F9D']
      )[Math.floor((window.crypto.getRandomValues(new Uint8Array(1))[0] / 256) * 3)],
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
  private addAttributesOnWcElement(el: HTMLElement) {
    el.onclick = async (e) => {
      e.preventDefault();
      this.selectedKeyword = el.innerText;
      await this.buildSkillsSummary(el.innerText);
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

    this.skillList = await this.dataService.getStoreData({
      selector: selectAllSkills, defaultValue: [],
    });

    if (!this.skillList || this.skillList.length === 0) {
      console.debug('No skills found!');
      return;
    }

    this.formFields = [
      {
        field: 'filterInputValue', inputType: 'text', defaultValue: '', inputLabel: '',
        inputPlaceholder: 'filtrer les technos',

      },
    ];

    this.wordList = this.skillList.map(
      (skill) => ([skill.name, this.policeSize(skill.expertiseLevel, skill.priority)]),
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
  private async buildSkillsSummary(skillName: string): Promise<void> {
    // @ts-ignore
    const selectedSkill = this.skillList.find((skill) => skill.name === skillName) as SkillV1;

    const allRelatedList = await Promise.all([
      { list: [] as ExperienceV1[], selector: selectAllExperiences },
      { list: [] as FormationV1[], selector: selectAllFormations },
      { list: [] as ProjectV1[], selector: selectAllProjects },
    ].map((v) => {
      return this.dataService.getStoreData<typeof v.list>({
        selector: v.selector, defaultValue: [], property: 'tagList.id',
        value: selectedSkill.tagList.map((tag) => tag.id),
      });
    }));

    this.experienceList = TemplatesService.reorderItemListByEndDate<ExperienceV1>(allRelatedList[0] as ExperienceV1[]);
    this.formationList = TemplatesService.reorderItemListByEndDate<FormationV1>(allRelatedList[1] as FormationV1[]);
    this.projectItemList = UtilsService.sortObjectList<ProjectItem>(allRelatedList[2].map(s => ({
      ...s, technoList: this.utilsService.initTechnoListWithTagList(s.tagList),
    }) as ProjectItem), 'asc', 'position', 'number');

    const selectedSkillStartDate = selectedSkill.startDate.match(partialIsoDatePattern) ? selectedSkill.startDate + '-01' : selectedSkill.startDate;
    let experienceYearsText: string;
    if (selectedSkill.endDate) {
      const selectedSkillEndDate = selectedSkill.endDate.match(partialIsoDatePattern) ? selectedSkill.endDate + '-01' : selectedSkill.endDate;
      experienceYearsText = DayJsService.getTimeToX(selectedSkillStartDate, selectedSkillEndDate, true);
    } else {
      experienceYearsText = DayJsService.getTimeToNow(selectedSkillStartDate, true);
    }

    this.knobSkill = {
      ...selectedSkill,
      experienceYears: {
        text: experienceYearsText,
        value: this.utilsService.convertDateToKnobYearsValue(experienceYearsText),
      },
    };
  }
}
