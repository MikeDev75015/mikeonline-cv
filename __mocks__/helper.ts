import TagsJsonFile from '../__mocks__/v1/json-files/tags.json';

export const addTags = (list: any[]) => {
  console.debug('addTags');
  return list.map((each) => {
    if (!each.tagIdList) {
      return { ...each };
    }

    const tagList = each.tagIdList.map((id: string) => TagsJsonFile.find((tag) => tag.id === id));
    delete each['tagIdList'];
    return {
      ...each,
      tagList,
    };
  });
};
