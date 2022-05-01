export interface PickListWrapperOptions {
  sourceEndPoint?: string;

  sourceAdapter?: (data: any[]) => any[];

  sourceList?: any[];

  selectedList?: any[];

  selectedAdapter?: (data: any[]) => any[];

  selectionLimit?: number;

  filterBy?: string;

  propertyToDisplay?: string;

  dragdrop?: boolean;

  // styles options
  stripedRows?: boolean;

  inlineClass?: string;

  inlineStyle?: { [key: string]: any };

  // source options
  sourceHeader?: string;

  showSourceFilter?: boolean;

  showSourceControls?: boolean;

  sourceFilterPlaceholder?: string;

  // selected options
  selectedHeader?: string;

  showSelectedFilter?: boolean;

  showSelectedControls?: boolean;

  selectedFilterPlaceholder?: string;
}
