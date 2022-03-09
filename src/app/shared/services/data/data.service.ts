import { Injectable } from '@angular/core';
import { DefaultProjectorFn, MemoizedSelector, Store } from '@ngrx/store';
import { combineLatest, lastValueFrom, Observable, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICompetence, IExperience, IFormation, IProject, ITag } from '../../../core/core-index';
import { selectAppCvInfosLoaded } from '../../../core/ngrx/selectors/application.selectors';
import { selectAllCompetences, selectCompetencesLoaded } from '../../../core/ngrx/selectors/competences.selectors';
import { selectAllExperiences, selectExperiencesLoaded } from '../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations, selectFormationsLoaded } from '../../../core/ngrx/selectors/formations.selectors';
import { selectInterestsLoaded } from '../../../core/ngrx/selectors/interests.selectors';
import { selectAllProjects, selectProjectsLoaded } from '../../../core/ngrx/selectors/projects.selectors';

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
  ) {}

  private static listFilterPredicate(el: { [p: string]: any }, property: string, value: string | number): boolean {
    return Array.isArray(el[property]) ? el[property].includes(value) : el[property] === value;
  }

  public async getStoreData<T>({ selector, defaultValue, value, property }: {
    selector: (state: object) => T, defaultValue: T, value?: string | number, property?: string,
  }): Promise<T> {
    const data: T = await lastValueFrom(this.store.select(selector).pipe(take(1)), { defaultValue });

    if (value !== undefined) {
      if (!property) {
        property = 'id';
      }
      return Array.isArray(data)
        ? data.filter((el: { [key: string]: any }) => DataService.listFilterPredicate(el, property as string, value)) as unknown as T
        : data;
    }

    return data;
  }

  public getSummary(): Promise<ITag[]> {
    return this.extractUsedTags();
  }

  public isAllDataLoaded(): Observable<boolean> {
    return combineLatest<boolean[]>([
      this.isDataLoaded(selectAppCvInfosLoaded),
      this.isDataLoaded(selectCompetencesLoaded),
      this.isDataLoaded(selectExperiencesLoaded),
      this.isDataLoaded(selectFormationsLoaded),
      this.isDataLoaded(selectProjectsLoaded),
      this.isDataLoaded(selectInterestsLoaded),
    ]).pipe(
      map((allDataLoaded) => {
        return allDataLoaded.reduce((result, value) => result && value, true);
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
  private async extractUsedTags(): Promise<ITag[]> {
    const usedTagList: ITag[] = [];

    const skillList = await this.getStoreData<ICompetence[]>({
      selector: selectAllCompetences,
      defaultValue: [],
    });
    const experiences = await this.getStoreData<IExperience[]>({
      selector: selectAllExperiences,
      defaultValue: [],
    });
    const formations = await this.getStoreData<IFormation[]>({
      selector: selectAllFormations,
      defaultValue: [],
    });
    const projects = await this.getStoreData<IProject[]>({
      selector: selectAllProjects,
      defaultValue: [],
    });

    const getTagsAndTagIds = (list: IExperience[] | IFormation[] | IProject[]): {
      tagList: ITag[]; tagIdList: number[];
    }[] => list.map((element) => ({
      tagList: element.tagList as ITag[],
      tagIdList: element.tagIdList,
    }));

    (getTagsAndTagIds(experiences).concat(getTagsAndTagIds(formations), getTagsAndTagIds(projects))).forEach(
      (value) => {
        if (value.tagList && value.tagList.length) {
          value.tagList.forEach((tag, i) => {
            if (!tag || !tag.id) {
              console.warn(value);
              console.error('error with tag at index:', i, ' - tag id was:', value.tagIdList[i]);
              return;
            }

            const usedInSkill = skillList.find((s) => s.tagIdList.includes(tag.id));
            if (usedInSkill) {
              const usedTag = usedTagList.find((t) => t.id === tag.id) as ITag;
              if (!usedTag) {
                usedTagList.push({ ...tag, times: 1 });

              } else {
                // @ts-ignore
                usedTag.times += 1;
              }
            }
          });
        }
      });

    return usedTagList;
  }
}
