import { IMultiPart } from '../../../core/interfaces/models/commons/contact.interface';

export const DEFAULT_DATA_GENERATORS = {
  tagListGenerator: (data: any) => {
    if (!data.tagList) {
      return data;
    }
    const tagIdList: string[] = data.tagList.map((tag: any) => {
      if (typeof tag === 'object') {
        return tag.id;
      }
      if (typeof tag === 'string') {
        return tag;
      }
      return '';
    }).filter((isValid: string) => !!isValid);
    const { tagList, ...adaptedData } = data;
    adaptedData['tagIdList'] = tagIdList;
    return adaptedData;
  },
};

export const DEFAULT_DATA_ADAPTERS = {
  multiPartsAdapter: (data: IMultiPart) => {
    if (!data) {
      return '';
    }
    if (data.parts && data.joiner) {
      return data.parts.join(data.joiner);
    }
    return data;
  },
};
