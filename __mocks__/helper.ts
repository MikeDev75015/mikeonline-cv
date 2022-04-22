import { TagV1 } from '../src/app/core/interfaces/models/v1/tag.interface';

export const addTags = (list: any[], tags: TagV1[]) => {
  return list.map((each) => {
    const tagList = each.tagIdList.map((id: string) => tags.find((tag) => tag.id === id));
    delete each['tagIdList'];
    return {
      ...each,
      tagList,
    };
  });
};
