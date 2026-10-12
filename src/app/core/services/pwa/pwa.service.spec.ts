import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { SwPush, SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { notificationPayloadMock } from '../../../../../__mocks__/data/notification-payload.mock';
import { alertServiceMock } from '../../../../../__mocks__/services/alert-service.mock';
import { swPushMock, swUpdateMock } from '../../../../../__mocks__/services/pwa-service.mock';
import { waitTimeout } from '../../../../../__mocks__/timeout.mock';
import { AlertService } from '../../modules/alert/services/alert.service';
import { PwaService } from './pwa.service';

export type NotificationPayloadType = { action: string, notification: NotificationOptions & { title: string } };

describe('PwaService', () => {
  let service: PwaService;
  let consoleDebugSpy: any;
  let displayConfirmDialogSpy: any;
  let windowLocationReloadSpy: any;
  let activateUpdateSpy: any;
  let notificationClickSubject = new Subject<NotificationPayloadType>();
  let versionEventSubject = new Subject<VersionEvent>();
  // jsdom's window.location is not configurable, so the service reaches it through the DOCUMENT token.
  const documentMock = { defaultView: { location: { reload: vi.fn() } } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: SwPush, useValue: swPushMock },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: DOCUMENT, useValue: documentMock },
      ],
    });
    service = TestBed.inject(PwaService);

    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    displayConfirmDialogSpy = vi.spyOn(alertServiceMock, 'displayConfirmDialog');
    activateUpdateSpy = vi.spyOn(swUpdateMock, 'activateUpdate');
    windowLocationReloadSpy = vi.spyOn(documentMock.defaultView.location, 'reload');

    swPushMock.notificationClicks = notificationClickSubject.asObservable();
    swUpdateMock.versionUpdates = versionEventSubject.asObservable();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeServiceWorker', () => {
    describe('service worker available', () => {
      beforeEach(() => {
        swPushMock.isEnabled = true;
        service.initializeServiceWorker();
      });

      it('should log notificationPayload on notification click', () => {
        expect(consoleDebugSpy).not.toHaveBeenCalled();
        expect(service['subscriptionList'].length).toBeGreaterThan(0);

        notificationClickSubject.next(notificationPayloadMock);
        expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
        expect(consoleDebugSpy).toHaveBeenCalledWith('notificationPayload:', notificationPayloadMock);
      });

      it('should do nothing on new version detected', () => {
        versionEventSubject.next({ type: 'VERSION_DETECTED', version: { hash: '' } });

        expect(alertServiceMock.displayAlertDialog).not.toHaveBeenCalled();
        expect(displayConfirmDialogSpy).not.toHaveBeenCalled();
      });

      it('should display an error alert on version installation failure', () => {
        versionEventSubject.next({ type: 'VERSION_INSTALLATION_FAILED', version: { hash: '' }, error: '' });

        expect(alertServiceMock.displayAlertDialog).toHaveBeenCalledTimes(1);
      });

      it('should display a confirm dialog on new version ready to install', () => {
        versionEventSubject.next({ type: 'VERSION_READY', currentVersion: { hash: '' }, latestVersion: { hash: '' } });

        expect(displayConfirmDialogSpy).toHaveBeenCalledTimes(1);
      });

      it('should display an error alert on version update failure', async () => {
        displayConfirmDialogSpy.mockImplementationOnce(() => Promise.resolve('update'));
        activateUpdateSpy.mockImplementationOnce(() => Promise.resolve(false));
        versionEventSubject.next({ type: 'VERSION_READY', currentVersion: { hash: '' }, latestVersion: { hash: '' } });
        await waitTimeout(100);

        expect(displayConfirmDialogSpy).toHaveBeenCalledTimes(1);
        expect(alertServiceMock.displayAlertDialog).toHaveBeenCalledTimes(1);
        expect(windowLocationReloadSpy).not.toHaveBeenCalled();
      });

      it('should reload current page on update action', async () => {
        displayConfirmDialogSpy.mockImplementationOnce(() => Promise.resolve('update'));
        activateUpdateSpy.mockImplementationOnce(() => Promise.resolve(true));
        versionEventSubject.next({ type: 'VERSION_READY', currentVersion: { hash: '' }, latestVersion: { hash: '' } });
        await waitTimeout(100);

        expect(displayConfirmDialogSpy).toHaveBeenCalledTimes(1);
        expect(alertServiceMock.displayAlertDialog).not.toHaveBeenCalled();
        expect(windowLocationReloadSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
