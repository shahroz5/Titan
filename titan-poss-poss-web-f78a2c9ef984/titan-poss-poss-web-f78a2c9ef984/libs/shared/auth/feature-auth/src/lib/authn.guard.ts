import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthnGuard implements CanActivate {
  constructor(private authFacade: AuthFacade) {}

  canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> =>
    this.authFacade.getAccessToken().pipe(
      take(1),
      withLatestFrom(this.authFacade.getRefreshTokenExp()),
      map(([accessToken, refreshTokenExp]) => {
        if (accessToken) {
          if (
            refreshTokenExp &&
            refreshTokenExp.getTime() < new Date().getTime()
          ) {
            this.authFacade.logOut();
            return false;
          }
          return true;
        } else {
          this.authFacade.reload(state.url);
          return false;
        }
      })
    );
}
