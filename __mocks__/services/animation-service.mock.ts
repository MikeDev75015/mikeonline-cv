import { BehaviorSubject } from 'rxjs';
import { IAnimationServiceResponse } from '../../src/app/shared';

export const animationServiceMock = {
  watchResponse: (): BehaviorSubject<IAnimationServiceResponse> => new BehaviorSubject<IAnimationServiceResponse>({
    type: '',
    params: {},
  }),
  onPhase: jest.fn(),
};
