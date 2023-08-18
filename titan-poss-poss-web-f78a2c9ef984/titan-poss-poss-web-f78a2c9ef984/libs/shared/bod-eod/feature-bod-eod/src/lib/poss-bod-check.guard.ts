import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { SharedBodEodFeatureServiceAbstraction } from '@poss-web/shared/models';
import { getHomeUrl } from '@poss-web/shared/util-site-routes';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PossBodCheckGuard implements CanActivate {
  observableData: Observable<any>;
  constructor(
    private router: Router,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {}

  canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> =>
    this.bodEodFeatureService.getBusinessDayDateForGuard().pipe(
      filter(businessDate => businessDate !== -1),
      map(businessDate => {
        if (!businessDate) {
          this.router.navigate([getHomeUrl()]);
        }
        return true;
      })
    );
}
