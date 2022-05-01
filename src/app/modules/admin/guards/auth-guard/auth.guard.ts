import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { STORAGE_KEYS } from '../../../../core/constants/storage-keys.constant';
import { getUser } from '../../../../core/ngrx/actions/auth.actions';
import { selectCurrentUser } from '../../../../core/ngrx/selectors/auth.selectors';
import { StorageService } from '../../../../core/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(selectCurrentUser).pipe(
      map((currentUser) => {
        if (!currentUser) {
          const accessToken = StorageService.getItem<string>('localStorage', STORAGE_KEYS.accessToken);
          if (accessToken) {
            this.store.dispatch(getUser());
          } else {
            this.router.navigate(['/admin/sign-in']).finally(() => {
              console.debug('No currentUser or accessToken found, AuthGuard supposed to have been redirected on the sign in page!');
            });
          }
          return false;
        }

        return true;
      }),
    );
  }
}
