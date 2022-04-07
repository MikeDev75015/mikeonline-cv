import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactOpenCloseService {
  private static readonly openContactMobile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private static readonly isHeightTooSmall$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public static onOpenCloseContactStatusChange(): Subject<boolean> {
    return this.openContactMobile$;
  }

  public static setOpenCloseContactStatus(requestedStatus: boolean): void {
    this.openContactMobile$.next(requestedStatus);
  }

  public static onHeightIsTooSmallChange(): Subject<boolean> {
    return this.isHeightTooSmall$;
  }

  public static setHeightIsTooSmall(updatedStatus: boolean): void {
    this.isHeightTooSmall$.next(updatedStatus);
  }
}
