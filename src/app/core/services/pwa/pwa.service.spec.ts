import { TestBed } from '@angular/core/testing';
import { SwPush, SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { alertServiceMock } from '../../../../../__mocks__/services/alert-service.mock';
import { swPushMock, swUpdateMock } from '../../../../../__mocks__/services/pwa-service.mock';
import { waitTimeout } from '../../../../../__mocks__/timeout.mock';
import { notificationPayloadMock } from '../../../../../__mocks__/v0/data/notification-payload.mock';
import { AlertService } from '../../modules/alert/services/alert.service';
import { PwaService } from './pwa.service';

export type NotificationPayloadType = { action: string, notification: NotificationOptions & { title: string } };

describe('PwaService', () => {
  let service: PwaService;
  let consoleLogSpy: any;
  let consoleWarnSpy: any;
  let displayConfirmDialogSpy: any;
  let windowLocationReloadSpy: any;
  let activateUpdateSpy: any;
  let notificationClickSubject = new Subject<NotificationPayloadType>();
  let versionEventSubject = new Subject<VersionEvent>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: SwPush, useValue: swPushMock },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: AlertService, useValue: alertServiceMock },
      ],
    });
    service = TestBed.inject(PwaService);

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    displayConfirmDialogSpy = jest.spyOn(alertServiceMock, 'displayConfirmDialog');
    activateUpdateSpy = jest.spyOn(swUpdateMock, 'activateUpdate');

    Object.defineProperty(window, 'location', {
      value: {
        reload: jest.fn(),
      },
    });
    windowLocationReloadSpy = jest.spyOn(window.location, 'reload');

    swPushMock.notificationClicks = notificationClickSubject.asObservable();
    swUpdateMock.versionUpdates = versionEventSubject.asObservable();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeServiceWorker', () => {
    it('should warn if service worker is unavailable', () => {
      swPushMock.isEnabled = false;
      service.initializeServiceWorker();

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith('service worker unavailable');
      expect(service['subscriptionList'].length).toStrictEqual(0);
    });

    describe('service worker available', () => {
      beforeEach(() => {
        swPushMock.isEnabled = true;
        service.initializeServiceWorker();
      });

      it('should log notificationPayload on notification click', () => {
        expect(consoleWarnSpy).not.toHaveBeenCalled();
        expect(service['subscriptionList'].length).toBeGreaterThan(0);

        notificationClickSubject.next(notificationPayloadMock);
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith('notificationPayload:', notificationPayloadMock);
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
