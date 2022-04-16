export interface PickListWrapperOptions {
  sourceListEndPoint?: string;

  sourceList?: any[];

  targetList?: any[];

  sourceHeader?: string;

  targetHeader?: string;

  showSourceFilter?: boolean;

  showTargetFilter?: boolean;

  showSourceControls?: boolean;

  showTargetControls?: boolean;

  sourceFilterPlaceholder?: string;

  targetFilterPlaceholder?: string;

  filterBy?: string;

  propertyToDisplay?: string;

  dragdrop?: boolean;

  stripedRows?: boolean;

  inlineClass?: string;

  inlineStyle?: { [key: string]: any };
}
