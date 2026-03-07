import { Injectable } from '@angular/core';
import { DefaultProjectorFn, MemoizedSelector, Store } from '@ngrx/store';
import { combineLatest, lastValueFrom, Observable, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExperienceV1 } from '../../../core/interfaces/models/v1/experience.interface';
import { FormationV1 } from '../../../core/interfaces/models/v1/formation.interface';
import { ProjectV1 } from '../../../core/interfaces/models/v1/project.interface';
import { SkillV1 } from '../../../core/interfaces/models/v1/skill.interface';
import { TagV1 } from '../../../core/interfaces/models/v1/tag.interface';
import { ApplicationActions } from '../../../core/ngrx/ngrx-index';
import { selectAppCvInfosLoaded } from '../../../core/ngrx/selectors/application.selectors';
import { selectAllExperiences, selectExperiencesLoaded } from '../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations, selectFormationsLoaded } from '../../../core/ngrx/selectors/formations.selectors';
import { selectInterestsLoaded } from '../../../core/ngrx/selectors/interests.selectors';
import { selectAllProjects, selectProjectsLoaded } from '../../../core/ngrx/selectors/projects.selectors';
import { selectAllSkills, selectSkillsLoaded } from '../../../core/ngrx/selectors/skills.selectors';
import { UsedTag } from '../../../modules/application/interfaces/used-tag.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  /**
   * @ignore
   * @param store
   */
  constructor(
    private readonly store: Store,
  ) {
  }

  private static listFilterPredicate(element: { [p: string]: any }, property: string, value: string | string[]): boolean {
    const listName = property.includes('.') ? property.split('.')[0] : property;
    const subProperty = property.includes('.') ? property.split('.')[1] : undefined;
    if (!subProperty) {
      return element[listName].includes(value);
    }

    return !!element[listName].find((obj: { [p: string]: any }) => {
      if ((Array.isArray(value) && value.includes(obj[subProperty])) || obj[subProperty] === value) {
        return obj;
      }
      return null;
    });
  }

  /**
   *
   * @param selector
   * @param defaultValue
   * @param value
   * @param property
   */
  public async getStoreData<T>({ selector, defaultValue, value, property }: {
    selector: (state: object) => T, defaultValue: T, value?: string | string[], property?: string,
  }): Promise<T> {
    const data: T = await lastValueFrom(this.store.select(selector).pipe(take(1)), { defaultValue });
    if (!data) {
      return defaultValue;
    }

    if (value === undefined && !property) {
      return data;
    }

    try {
      const selected = Array.isArray(data) && value
        ? data.filter((el: { [key: string]: any }) => DataService.listFilterPredicate(el, property || 'id', value)) as unknown as T
        : (data as { [key: string]: any; })[property as string];

      return selected || defaultValue;
    } catch {
      console.debug('Cannot get the expected value!', { value, property });
      return defaultValue;
    }
  }

  public getSummary(): Promise<UsedTag[]> {
    return this.extractUsedTags();
  }

  public isAllDataLoaded(): Observable<boolean> {
    return combineLatest<boolean[]>([
      this.isDataLoaded(selectAppCvInfosLoaded),
      this.isDataLoaded(selectSkillsLoaded),
      this.isDataLoaded(selectExperiencesLoaded),
      this.isDataLoaded(selectFormationsLoaded),
      this.isDataLoaded(selectProjectsLoaded),
      this.isDataLoaded(selectInterestsLoaded),
    ]).pipe(
      map((allDataLoaded) => {
        const status: boolean = allDataLoaded.reduce((result, value) => result && value, true);
        if (status) {
          this.store.dispatch(ApplicationActions.hideHeader());
        }
        return status;
      }),
    );
  }

  public isDataLoaded(selector: MemoizedSelector<object, boolean, DefaultProjectorFn<boolean>>): Observable<boolean> {
    return this.store.select(selector);
  }

  /**
   * Extract all the tags used in experiences, formations, competences and projects data
   * @returns an array of tags and their number of times used
   */
  private async extractUsedTags(): Promise<UsedTag[]> {
    const usedTagList: UsedTag[] = [];

    const skillList = await this.getStoreData<SkillV1[]>({
      selector: selectAllSkills,
      defaultValue: [],
    });
    const experiences = await this.getStoreData<ExperienceV1[]>({
      selector: selectAllExperiences,
      defaultValue: [],
    });
    const formations = await this.getStoreData<FormationV1[]>({
      selector: selectAllFormations,
      defaultValue: [],
    });
    const projects = await this.getStoreData<ProjectV1[]>({
      selector: selectAllProjects,
      defaultValue: [],
    });

    const getTagList = (list: ExperienceV1[] | FormationV1[] | ProjectV1[]): {
      tagList: TagV1[];
    }[] => list.map((element) => ({ tagList: element.tagList }));

    (getTagList(experiences).concat(getTagList(formations), getTagList(projects))).forEach(
      (value) => {
        if (value.tagList && value.tagList.length) {
          value.tagList.forEach((tag, i) => {
            if (!tag || !tag.id) {
              console.debug(value);
              console.debug('error with tag at index:', i, ' - tag was:', value.tagList[i]);
              return;
            }

            const usedInSkill = skillList.find((s) => s.tagList.find((t) => t.id === tag.id));
            if (usedInSkill) {
              const usedTagFound = usedTagList.find((usedTag) => usedTag.id === tag.id);

              if (!usedTagFound) {
                usedTagList.push({ ...tag, times: 1 });
              } else {
                usedTagFound.times += 1;
              }
            }
          });
        }
      });

    return usedTagList;
  }
}
