import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { lastValueFrom, take } from 'rxjs';
import { ITag } from '../../../core';
import { selectAllTags } from '../../../core/ngrx/selectors/tags.selectors';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  constructor(
    private readonly store: Store,
  ) {
  }

  public async getAllTags(): Promise<ITag[]> {
    const allTags = await lastValueFrom(this.store.select(selectAllTags).pipe(take(1)), { defaultValue: [] });
    return allTags || [];
  }

  public getTagsByIds(tagIdList: number[], allTags: ITag[]): ITag[] {
    return tagIdList.map((tagId) => allTags.find((tag) => tag.id === tagId)).filter((tag, i) => {
      if (!tag) {
        console.warn(`Unknown tag id found: ${tagIdList[i]} at position ${i}.`);
      }
      return !!tag;
    }) as ITag[];
  }
}
