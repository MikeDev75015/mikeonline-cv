import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { lastValueFrom, take } from 'rxjs';
import { TagV1 } from '../../../core/interfaces/models/v1/tag.interface';
import { selectAllTags } from '../../../core/ngrx/selectors/tags.selectors';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  constructor(
    private readonly store: Store,
  ) {
  }

  public async getAllTags(): Promise<TagV1[]> {
    const allTags = await lastValueFrom(this.store.select(selectAllTags).pipe(take(1)), { defaultValue: [] });
    return allTags || [];
  }

  public getTagsByIds(tagIdList: string[], allTags: TagV1[]): TagV1[] {
    return tagIdList.map((tagId) => allTags.find((tag) => tag.id === tagId)).filter((tag, i) => {
      if (!tag) {
        console.warn(`Unknown tag id found: ${tagIdList[i]} at position ${i}.`);
      }
      return !!tag;
    }) as TagV1[];
  }
}
