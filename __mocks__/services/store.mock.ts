import { of } from 'rxjs';

export const storeMock = {
  dispatch: () => undefined,
  select: () => of(undefined),
}
