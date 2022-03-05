import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { lastValueFrom, take } from 'rxjs';
import { ITag } from '../../../core/interfaces/models/tag.interface';
import { selectAllTags } from '../../../core/ngrx/selectors/tags.selectors';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  constructor(
    private readonly store: Store,
  ) {
  }

  public getAllTags(): Promise<ITag[]> {
    return lastValueFrom(this.store.select(selectAllTags).pipe(take(1)), { defaultValue: [] });
  }

  public getTagsByIds(tagIdList: number[], allTags: ITag[]): ITag[] {
    return tagIdList.map((tagId) => allTags.find((tag) => tag.id === tagId)) as ITag[]
  }
}
