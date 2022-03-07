import { Subject } from 'rxjs';
import { IAnimationServiceResponse } from '../../core/interfaces/animation-response.interface';

export const animationServiceMock = {
  watchResponse: (): Subject<IAnimationServiceResponse> => new Subject(),
};
