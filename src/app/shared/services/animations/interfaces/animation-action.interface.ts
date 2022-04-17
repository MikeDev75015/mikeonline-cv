export interface IAnimationAction {
  style?: {
    selector: string;
    classList?: {
      name: string;
      method: string;
    }[];
    propertyList?: {
      name: string;
      value: string;
    }[];
  };
}
