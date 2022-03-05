import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { lastValueFrom, take } from 'rxjs';
import { ICompetence } from '../../../core/interfaces/models/competence.interface';
import { ICvInfos } from '../../../core/interfaces/models/cv-infos.interface';
import { ITag } from '../../../core/interfaces/models/tag.interface';
import { selectAllCompetences } from '../../../core/ngrx/selectors/competences.selectors';
import { selectCvInfos } from '../../../core/ngrx/selectors/cv-infos.selectors';
import { selectAllExperiences } from '../../../core/ngrx/selectors/experiences.selectors';
import { selectAllFormations } from '../../../core/ngrx/selectors/formations.selectors';
import { selectAllInterests } from '../../../core/ngrx/selectors/interests.selectors';
import { selectAllProjects } from '../../../core/ngrx/selectors/projects.selectors';
import { selectAllTags } from '../../../core/ngrx/selectors/tags.selectors';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(
    private readonly store: Store,
  ) {
  }

  public getCvInfos(): Promise<ICvInfos> {
    // @ts-ignore
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
      return list.filter((el: { [key: string]: any }) => el[property] === value) as unknown as T;
    }
    return list as unknown as T;
  }

  public async getExperiences<T>(value?: string | number, property = 'id'): Promise<T> {
    const list = await lastValueFrom(this.store.select(selectAllExperiences).pipe(take(1)), { defaultValue: [] });
    if (value !== undefined) {
      return list.filter((el: { [key: string]: any }) => el[property] === value) as unknown as T;
    }
    return list as unknown as T;
  }

  public async getFormations<T>(value?: string | number, property = 'id'): Promise<T> {
    const list = await lastValueFrom(this.store.select(selectAllFormations).pipe(take(1)), { defaultValue: [] });
    if (value !== undefined) {
      return list.filter((el: { [key: string]: any }) => el[property] === value) as unknown as T;
    }
    return list as unknown as T;
  }

  public async getProjects<T>(value?: string | number, property = 'id'): Promise<T> {
    const list = await lastValueFrom(this.store.select(selectAllProjects).pipe(take(1)), { defaultValue: [] });
    if (value !== undefined) {
      return list.filter((el: { [key: string]: any }) => el[property] === value) as unknown as T;
    }
    return list as unknown as T;
  }

  public async getInterests<T>(value?: string | number, property = 'id'): Promise<T> {
    const list = await lastValueFrom(this.store.select(selectAllInterests).pipe(take(1)), { defaultValue: [] });
    if (value !== undefined) {
      return list.filter((el: { [key: string]: any }) => el[property] === value) as unknown as T;
    }
    return list as unknown as T;
  }

  public getSummary(): Promise<ITag[]> {
    return this.extractUsedTags();
  }

  /**
   * Extract all the tags used in experiences, formations, competences and projects data
   * @returns an array of tags and their number of times used
   */
  private async extractUsedTags(): Promise<ITag[]> {
    const skillList = await this.getCompetences<ICompetence[]>();
    const tagList: ITag[] = [];

    const experiences = await this.getExperiences<{ tagList: ITag[] }[]>();
    const formations = await this.getFormations<{ tagList: ITag[] }[]>();
    const projects = await this.getProjects<{ tagList: ITag[] }[]>();

    (experiences.concat(formations, projects)).forEach(value => {
      if (value.tagList && value.tagList.length) {
        value.tagList.forEach((tag) => {
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
