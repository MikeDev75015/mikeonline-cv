import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, forkJoin, lastValueFrom, Observable, take, takeUntil } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ICompetence, ICvInfos, ITag } from '../../../core/core-index';
import { selectAppCvInfosLoaded } from '../../../core/ngrx/selectors/application.selectors';
import { selectAllCompetences, selectCompetencesLoaded } from '../../../core/ngrx/selectors/competences.selectors';
import { selectCvInfos } from '../../../core/ngrx/selectors/cv-infos.selectors';
import { selectAllExperiences, selectExperiencesLoaded } from '../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations, selectFormationsLoaded } from '../../../core/ngrx/selectors/formations.selectors';
import { selectAllInterests, selectInterestsLoaded } from '../../../core/ngrx/selectors/interests.selectors';
import { selectAllProjects, selectProjectsLoaded } from '../../../core/ngrx/selectors/projects.selectors';
import { selectAllTags } from '../../../core/ngrx/selectors/tags.selectors';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(
    private readonly store: Store,
  ) {
  }

  private static listFilterPredicate(el: { [p: string]: any }, property: string, value: string | number): boolean {
    return Array.isArray(el[property]) ? el[property].includes(value) : el[property] === value;
  }

  public getCvInfos(): Promise<ICvInfos> {
    return lastValueFrom(this.store.select(selectCvInfos).pipe(take(1)));
  }

  public async getTags<T>(value?: string | number, property = 'id'): Promise<T> {
    const list = await lastValueFrom(this.store.select(selectAllTags).pipe(take(1)), { defaultValue: [] });
    if (value !== undefined) {
      return list.filter((el: { [key: string]: any }) => el[property] === value) as unknown as T;
    }
    return list as unknown as T;
  }

  public async getCompetences<T>(value?: string | number, property = 'id'): Promise<T> {
    const list = await lastValueFrom(this.store.select(selectAllCompetences).pipe(take(1)), { defaultValue: [] });
    if (value !== undefined) {
      return list.filter((el: { [key: string]: any }) => DataService.listFilterPredicate(el, property, value)) as unknown as T;
    }
    return list as unknown as T;
  }

  public async getExperiences<T>(value?: string | number, property = 'id'): Promise<T> {
    const list = await lastValueFrom(this.store.select(selectAllExperiences).pipe(take(1)), { defaultValue: [] });
    if (value !== undefined) {
      return list.filter((el: { [key: string]: any }) => DataService.listFilterPredicate(el, property, value)) as unknown as T;
    }
    return list as unknown as T;
  }

  public async getFormations<T>(value?: string | number, property = 'id'): Promise<T> {
    const list = await lastValueFrom(this.store.select(selectAllFormations).pipe(take(1)), { defaultValue: [] });
    if (value !== undefined) {
      return list.filter((el: { [key: string]: any }) => DataService.listFilterPredicate(el, property, value)) as unknown as T;
    }
    return list as unknown as T;
  }

  public async getProjects<T>(value?: string | number, property = 'id'): Promise<T> {
    const list = await lastValueFrom(this.store.select(selectAllProjects).pipe(take(1)), { defaultValue: [] });
    if (value !== undefined) {
      return list.filter((el: { [key: string]: any }) => DataService.listFilterPredicate(el, property, value)) as unknown as T;
    }
    return list as unknown as T;
  }

  public async getInterests<T>(value?: string | number, property = 'id'): Promise<T> {
    const list = await lastValueFrom(this.store.select(selectAllInterests).pipe(take(1)), { defaultValue: [] });
    if (value !== undefined) {
      return list.filter((el: { [key: string]: any }) => DataService.listFilterPredicate(el, property, value)) as unknown as T;
    }
    return list as unknown as T;
  }

  public getSummary(): Promise<ITag[]> {
    return this.extractUsedTags();
  }

  public isAllDataLoaded(): Observable<boolean> {
    return combineLatest<boolean[]>([
      this.isCvInfosLoaded(), this.isCompetencesLoaded(), this.isFormationsLoaded(), this.isExperiencesLoaded(),
      this.isProjectsLoaded(), this.isInterestsLoaded(),
    ]).pipe(
      map((allDataLoaded) => {
        return allDataLoaded.reduce((result, v) => result && v, true);
      }),
    );
  }

  public isCvInfosLoaded(): Observable<boolean> {
    return this.store.select(selectAppCvInfosLoaded);
  }

  public isCompetencesLoaded(): Observable<boolean> {
    return this.store.select(selectCompetencesLoaded);
  }

  public isExperiencesLoaded(): Observable<boolean> {
    return this.store.select(selectExperiencesLoaded);
  }

  public isFormationsLoaded(): Observable<boolean> {
    return this.store.select(selectFormationsLoaded);
  }

  public isProjectsLoaded(): Observable<boolean> {
    return this.store.select(selectProjectsLoaded);
  }

  public isInterestsLoaded(): Observable<boolean> {
    return this.store.select(selectInterestsLoaded);
  }

  /**
   * Extract all the tags used in experiences, formations, competences and projects data
   * @returns an array of tags and their number of times used
   */
  private async extractUsedTags(): Promise<ITag[]> {
    const skillList = await this.getCompetences<ICompetence[]>();
    const tagList: ITag[] = [];

    const experiences = await this.getExperiences<{ tagList: ITag[]; tagIdList: number[]; }[]>();
    const formations = await this.getFormations<{ tagList: ITag[]; tagIdList: number[]; }[]>();
    const projects = await this.getProjects<{ tagList: ITag[]; tagIdList: number[]; }[]>();

    (experiences.concat(formations, projects)).forEach(value => {
      if (value.tagList && value.tagList.length) {
        value.tagList.forEach((tag, i) => {
          if (!tag || !tag.id) {
            console.warn(value);
            console.error('error with tag at index:', i, ' - tag id was:', value.tagIdList[i]);
            return;
          }

          const usedInSkill = skillList.find((s) => s.tagIdList.includes(tag.id));
          if (usedInSkill) {
            const usedTag = tagList.find((t) => t.id === tag.id) as ITag;
            if (!usedTag) {
              tagList.push({ ...tag, times: 1 });

            } else {
              // @ts-ignore
              usedTag.times += 1;
            }
          }
        });
      }
    });

    return tagList;
  }
}
