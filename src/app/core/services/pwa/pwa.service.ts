import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { AlertService } from '../../modules/alert/services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class PwaService implements OnDestroy {
  private subscriptionList: Subscription[] = [];

  /**
   * @ignore
   * @param swPush
   * @param swUpdate
   * @param alertService
   */
  constructor(
    private readonly swPush: SwPush,
    private readonly swUpdate: SwUpdate,
    private readonly alertService: AlertService,
  ) {}

  ngOnDestroy(): void {
    this.subscriptionList.forEach(s => s.unsubscribe());
  }

  public initializeServiceWorker(): void {
    if (this.swPush.isEnabled) {
      this.subscriptionList.push(
        this.swPush.notificationClicks.subscribe(notificationPayload => {
          console.log('notificationPayload:', notificationPayload);
        }),
      );

      this.subscriptionList.push(
        this.swUpdate.versionUpdates.subscribe((event) => {
          if (event.type === 'VERSION_DETECTED') {
            return;
          }

          if (event.type === 'VERSION_INSTALLATION_FAILED') {
            this.showUpdateErrorMessage();
            return;
          }

          this.showUpdateInvitation();
        }),
      );

    } else {
      console.warn('service worker unavailable');
    }
  }

  private showUpdateErrorMessage(): void {
    this.alertService.displayAlertDialog({
      title: 'Oups',
      msg: 'Je n\'ai pas réussi à mettre l\'app à jour :(',
      closeBtnLabel: 'fermer',
    });
  }

  private showUpdateInvitation(): void {
    this.alertService.displayConfirmDialog({
      title: 'mise à jour disponible...',
      msg: 'Hey, il existe une version plus récente de cette app ;)',
      actionsList: [
        { name: 'mettre à jour', action: 'update' },
      ],
    }).then(action => {
      if (action === 'update') {
        this.swUpdate.activateUpdate().then((updated) => {
          if (!updated) {
            this.showUpdateErrorMessage();
            return;
          }

          window.location.reload();
        });
      }
    });
  }
}
