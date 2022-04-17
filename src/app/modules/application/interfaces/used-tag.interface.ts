import { TagV1 } from '../../../core/interfaces/models/v1/tag.interface';

export interface UsedTag extends TagV1 {
  times: number;
}
