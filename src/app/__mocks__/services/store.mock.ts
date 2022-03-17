import { of } from 'rxjs';

export const storeMock = {
  dispatch: () => of(undefined),
  select: () => of(undefined),
}
