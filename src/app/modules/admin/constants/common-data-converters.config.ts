import { IMultiPart } from '../../../core/interfaces/models/commons/contact.interface';
import { DayJsService } from '../../../core/services/dayjs/dayjs.service';
import { DataConverter } from '../components/fragments/table-wrapper/interfaces/data-converter.interface';

export const DEFAULT_FORM_FIELDS_ADAPTERS: DataConverter = {
  multiPartsAdapter: (data: IMultiPart) => {
    if (!data) {
      return '';
    }

    if (data.parts && data.joiner) {
      return data.parts.join(data.joiner);
    }

    return data;
  },
  birthDate: (data: string) => {
    if (!data) {
      return '';
    }
    if (data.includes('/')) {
      return data;
    }
    return DayJsService.getDate(data, 'DD/MM/YYYY');
  },
  tagList: (data: any[]) => data.map((each: any) => each.id),
  lineList: (data: string[]): string => data?.join('\n') || '',
};

export const DEFAULT_FORM_FIELDS_GENERATORS: DataConverter = {
  phoneNumberPartList: (data: string) => {
    if (!data) {
      return '';
    }
    const joiner = data[5];
    const parts = data.split(joiner);
    return { joiner, parts };
  },
  emailPartList: (data: string) => {
    if (!data) {
      return '';
    }
    const joiner = '@';
    const parts = data?.split(joiner);
    return { joiner, parts };
  },
  birthDate: (data: string) => {
    if (!data) {
      return '';
    }
    const datePartList = data.split('/');
    return DayJsService.getDate(`${datePartList[2]}-${datePartList[1]}-${datePartList[0]}`);
  },
  lineList: (data: string): string[] => data?.split('\n').filter((content) => content) || [],
};

export const dataGeneratorListFactory = (dataKeyList: string[]): DataConverter[] => {
  return dataKeyList.map((dataKey) => {
    if (!DEFAULT_DATA_GENERATORS[dataKey]) {
      throw new Error(`No data generator found for ${dataKey} dataKey!`);
    }
    return { [dataKey]: DEFAULT_DATA_GENERATORS[dataKey] };
  });
};

export const DEFAULT_DATA_GENERATORS: DataConverter = {
  tagList: (data: any) => {
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
