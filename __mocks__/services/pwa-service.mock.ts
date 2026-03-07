import { VersionEvent } from '@angular/service-worker';
import { of } from 'rxjs';
import { notificationPayloadMock } from '../data/notification-payload.mock';

export const pwaServiceMock = {
  initializeServiceWorker: vi.fn(),
};

export const swPushMock = {
  isEnabled: false,
  notificationClicks: of(notificationPayloadMock),
};

export const swUpdateMock = {
  versionUpdates: of('' as unknown as VersionEvent),
  activateUpdate: () => Promise.resolve(false),
};
