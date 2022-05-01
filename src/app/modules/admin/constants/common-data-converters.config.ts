import { IMultiPart } from '../../../core/interfaces/models/commons/contact.interface';
import { DayJsService } from '../../../core/services/dayjs/dayjs.service';
import { UtilsService } from '../../../shared';
import { DropdownOption } from '../components/fragments/dropdown-wrapper/interfaces/dropdown-option.interface';
import { DataConverter } from '../components/fragments/table-wrapper/interfaces/data-converter.interface';

export const autoCompleteByPropertyAdapterFactory = (property: string) => {
  return (data: any[]) => {
    const suggestionList: DropdownOption[] = [];
    data.forEach((each: any) => {
      if (!each[property]) {
        return;
      }
      const eachValue = each[property].toLowerCase();
      const foundInList = suggestionList.find((suggest) => suggest.value === eachValue);
      if (!foundInList) {
        suggestionList.push({ label: each[property], value: eachValue });
      }
    });

    return UtilsService.sortObjectList(suggestionList, 'asc', 'label');
  };
};

export const DEFAULT_FORM_FIELDS_ADAPTERS: DataConverter = {
  multiParts: (data: IMultiPart) => {
    if (!data) {
      return '';
    }

    if (data.parts && data.joiner) {
      return data.parts.join(data.joiner);
    }

    return data;
  },
  birthDate: (date: string) => {
    if (!date) {
      return '';
    }
    if (date.includes('/')) {
      return date;
    }
    return DayJsService.getDate(date, 'DD/MM/YYYY');
  },
  tagList: (data: any[]) => data.map((each: any) => each.id),
  lineList: (data: string[]): string => data?.join('\n') || '',
  partialDate: (date: string): string => {
    if (!date) {
      return '';
    }
    return DayJsService.getDate(date, 'MM/YYYY');
  },
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
  birthDate: (date: string) => {
    if (!date) {
      return '';
    }
    const datePartList = date.split('/');
    return DayJsService.getDate(`${datePartList[2]}-${datePartList[1]}-${datePartList[0]}`, 'YYYY-MM-DD');
  },
  lineList: (data: string): string[] => data?.split('\n').filter((content) => content) || [],
  partialDate: (date: string): string => {
    if (!date) {
      return '';
    }
    const datePartList = date.split('/');
    return DayJsService.getDate(`${datePartList[1]}-${datePartList[0]}-01`, 'YYYY-MM');
  },
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
