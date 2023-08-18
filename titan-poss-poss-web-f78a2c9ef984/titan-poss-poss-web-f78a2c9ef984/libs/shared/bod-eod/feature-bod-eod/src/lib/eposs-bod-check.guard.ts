import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { SharedBodEodFeatureServiceAbstraction } from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { getHomeUrl } from '@poss-web/shared/util-site-routes';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EpossBodCheckGuard implements CanActivate {
  constructor(
    private router: Router,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private profileDataFacade: ProfileDataFacade
  ) {}

  canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> =>
    this.profileDataFacade.isBTQUser().pipe(
      filter(isBTQUser => isBTQUser !== null),
      mergeMap(isBTQUser =>
        this.bodEodFeatureService.getBusinessDayDateForGuard().pipe(
          filter(businessDate => !isBTQUser || businessDate !== -1),
          map(businessDate => {
            if (!!isBTQUser && !businessDate) {
              this.router.navigate([getHomeUrl()]);
            }
            return true;
          })
        )
      )
    );
}
