import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactOpenCloseService {
  openContactMobile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  heightIsTooSmall$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  onOpenCloseContactStatusChange(): Subject<boolean> {
    return this.openContactMobile$;
  }

  setOpenCloseContactStatus(requestedStatus: boolean): void {
    this.openContactMobile$.next(requestedStatus);
  }

  onHeightIsTooSmallChange(): Subject<boolean> {
    return this.heightIsTooSmall$;
  }

  setHeightIsTooSmall(updatedStatus: boolean): void {
    this.heightIsTooSmall$.next(updatedStatus);
  }
}
