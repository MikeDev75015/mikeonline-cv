import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { STORAGE_KEYS } from '../../../../core/constants/storage-keys.constant';
import { StorageService } from '../../../../core/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly router: Router,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userItem = StorageService.getItem('sessionStorage', STORAGE_KEYS['user']);
    if (!userItem) {
      this.router.navigate(['/admin/sign-in']).catch(async (error) => {
        console.debug('Cannot navigate to sign-in path!', error);
        await this.router.navigate(['/']);
      });
      return false;
    }

    return true;
  }
}
