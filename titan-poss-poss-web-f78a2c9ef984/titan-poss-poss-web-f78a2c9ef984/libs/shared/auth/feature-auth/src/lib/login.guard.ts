import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authfacade: AuthFacade) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.authfacade
      .getReloadState()
      .pipe(
        take(1),
        filter(status => !status)
      )
      .subscribe(status => this.authfacade.reload(getPossHomeRouteUrl()));
    return true;
  }
}
