import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { AlertService } from '../../modules/alert/services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class PwaService implements OnDestroy {
  private readonly subscriptionList: Subscription[] = [];

  /**
   * @ignore
   * @param swPush
   * @param swUpdate
   * @param alertService
   * @param document
   */
  constructor(
    private readonly swPush: SwPush,
    private readonly swUpdate: SwUpdate,
    private readonly alertService: AlertService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach(s => s.unsubscribe());
  }

  public initializeServiceWorker(): void {
    if (!this.swPush.isEnabled) {
      return;
    }
    this.subscriptionList.push(
      this.swPush.notificationClicks.subscribe(notificationPayload => {
        console.debug('notificationPayload:', notificationPayload);
      }),
    );

    this.subscriptionList.push(
      this.swUpdate.versionUpdates.subscribe(async (event) => {
        if (event.type === 'VERSION_DETECTED') {
          return;
        }

        if (event.type === 'VERSION_INSTALLATION_FAILED') {
          this.showUpdateErrorMessage();
          return;
        }

        await this.showUpdateInvitation();
      }),
    );
  }

  private showUpdateErrorMessage(): void {
    this.alertService.displayAlertDialog({
      title: 'Oups',
      msg: 'Je n\'ai pas réussi à mettre l\'app à jour :(',
      closeBtnLabel: 'fermer',
    });
  }

  private async showUpdateInvitation(): Promise<void> {
    const action = await this.alertService.displayConfirmDialog({
      title: 'mise à jour disponible...',
      msg: 'Hey, il existe une version plus récente de cette app ;)',
      actionsList: [
        { name: 'mettre à jour', action: 'update' },
      ],
    });

    if (action === 'update') {
      const updated = await this.swUpdate.activateUpdate();
      if (!updated) {
        this.showUpdateErrorMessage();
        return;
      }

      this.document.defaultView?.location.reload();
    }
  }
}
