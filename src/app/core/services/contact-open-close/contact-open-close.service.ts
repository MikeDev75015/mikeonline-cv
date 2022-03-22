import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactOpenCloseService {
  private readonly openContactMobile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly isHeightTooSmall$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public onOpenCloseContactStatusChange(): Subject<boolean> {
    return this.openContactMobile$;
  }

  public setOpenCloseContactStatus(requestedStatus: boolean): void {
    this.openContactMobile$.next(requestedStatus);
  }

  public onHeightIsTooSmallChange(): Subject<boolean> {
    return this.isHeightTooSmall$;
  }

  public setHeightIsTooSmall(updatedStatus: boolean): void {
    this.isHeightTooSmall$.next(updatedStatus);
  }
}
