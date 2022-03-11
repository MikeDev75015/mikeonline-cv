import { BehaviorSubject } from 'rxjs';
import { IAnimationServiceResponse } from '../../core/interfaces/animation-response.interface';

export const animationServiceMock = {
  watchResponse: (): BehaviorSubject<IAnimationServiceResponse> => new BehaviorSubject<IAnimationServiceResponse>({
    type: '',
    params: {},
  }),
  onPhase: jest.fn(),
};
