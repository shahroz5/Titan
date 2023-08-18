import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  AclUrlPermissionRequestBody,
  TransactionCodesModel
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { POSS_WEB_LOAD_ACL_DATA_FROM_DB } from '@poss-web/shared/util-config';
import {
  getHomeUrl,
  homeUrl,
  Routes,
  userProfileUrl
} from '@poss-web/shared/util-site-routes';
import { from, Observable, of } from 'rxjs';
import {
  filter,
  find,
  map,
  mergeMap,
  switchMap,
  take,
  tap
} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthzGuard implements CanActivate {
  resolvedUrl: string = Routes['R0'];

  constructor(
    private router: Router,
    private permissionService: PermissionService,
    private permissionfacade: PermissionFacade,
    private activatedRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    @Inject(POSS_WEB_LOAD_ACL_DATA_FROM_DB) private loadACLDataFromDB
  ) {}

  canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> => {
    console.log('URL 123 :', state.url);
    return this.permissionfacade.getAllowedRoutes().pipe(
      take(1),
      switchMap(allowedRoutes => {
        return allowedRoutes[state.url]
          ? this.evaluateRoutesForUrlWithSuggestedRoutes(
              allowedRoutes[state.url]
            )
          : this.evaluateRoutePermissionForUrlWithoutSuggestedRoutes(
              route,
              state.url
            );
      })
    );
  };

  getResolvedUrlPattern(
    routeConfigPathList: string[],
    actualUrl: string
  ): string {
    let resolvedUrlPattern = '';

    const actualUrlPath = this.getActualUrlPathWithoutQueryParams(actualUrl);
    const actualUrlPathList = actualUrlPath.split('/');
    if (routeConfigPathList.length === actualUrlPathList.length) {
      routeConfigPathList.forEach((routeItem, index) => {
        if (routeItem.startsWith(':_')) {
          actualUrlPathList[index] = routeItem;
        }
      });
    }
    resolvedUrlPattern = actualUrlPathList.join('/');
    return resolvedUrlPattern;
  }

  evaluateRoutePermissionForUrlWithoutSuggestedRoutes(
    route: ActivatedRouteSnapshot,
    url: string
  ): Observable<boolean> {
    const urlPattern = this.getResolvedUrlPattern(
      this.getRouteConfigPath(route),
      url
    );
    if (this.loadACLDataFromDB) {
      const requestBody: AclUrlPermissionRequestBody = {
        urls: [urlPattern]
      };
      this.authFacade
        .getAccessToken()
        .pipe(
          filter(token => token && token.length > 0),
          take(1)
        )
        .subscribe(token => {
          if (token) {
            this.permissionfacade.loadUrlLevelPermissions(requestBody);
          }
        });
    }

    return this.permissionfacade.getURLPermission().pipe(
      filter(data => !!data),
      switchMap(data => {
        const urlTrasactionCodes = this.getAllTransactionCodesForUrl(
          urlPattern,
          data
        );
        return this.evaluateRoutePermission(urlTrasactionCodes, urlPattern);
      })
    );
  }

  getAllTransactionCodesForUrl = (
    inputUrl: string,
    urlObjectList: TransactionCodesModel[]
  ): string[] => {
    let transactionCodes = null;
    if (urlObjectList && urlObjectList.length === 0) {
      transactionCodes = [];
    }
    if (urlObjectList && urlObjectList.length > 0) {
      urlObjectList.forEach((urlItem: TransactionCodesModel) => {
        if (urlItem.url === inputUrl) {
          transactionCodes = urlItem.transactionCodes;
          return false;
        }
      });
    }
    return transactionCodes;
  };

  getRouteConfigPath(route: ActivatedRouteSnapshot): string[] {
    let urlAsPerAppRoute = '';

    while (!!route) {
      if (route.routeConfig.path) {
        urlAsPerAppRoute = urlAsPerAppRoute + route.routeConfig.path + '/';
      }
      route = route.children[0];
    }
    if (!urlAsPerAppRoute.startsWith('/')) {
      urlAsPerAppRoute = `/${urlAsPerAppRoute}`;
    }

    if (urlAsPerAppRoute.charAt(urlAsPerAppRoute.length - 1) === '/') {
      urlAsPerAppRoute = urlAsPerAppRoute.slice(0, urlAsPerAppRoute.length - 1);
    }

    return urlAsPerAppRoute.split('/');
  }

  evaluateRoutePermission(
    transactionCodes: string[],
    urlPattern: string
  ): Observable<boolean> {
    if (transactionCodes && transactionCodes.length !== 0) {
      if (
        transactionCodes.find(key => this.permissionService.hasPermission(key))
      ) {
        this.permissionfacade.loadElementLevelPermissionForURL(urlPattern);
      } else if (urlPattern !== getHomeUrl() && urlPattern !== homeUrl()) {
        // Added for back navigations for few modules when BOD is not done or done without metal rate
        this.router.navigate([getHomeUrl()]);
      } else {
        this.router.navigate([userProfileUrl()]);
      }
    } else {
      //When Transaction codes are not there, if Api fails - Go to User Profile
      this.router.navigate([userProfileUrl()]);
    }

    return of(true);
  }

  getActualUrlPathWithoutQueryParams(actualIncomingUrl: string): string {
    let actualUrlPath = '';
    if (actualIncomingUrl.includes('?')) {
      actualUrlPath = actualIncomingUrl.slice(
        0,
        actualIncomingUrl.indexOf('?')
      );
    } else {
      actualUrlPath = actualIncomingUrl;
    }
    return actualUrlPath;
  }

  // Eg for allowed routes array: [R1, R2, R3]
  evaluateRoutesForUrlWithSuggestedRoutes(
    allowedRoutes: string[]
  ): Observable<boolean> {
    if (this.loadACLDataFromDB) {
      const allowedRouteUrlsList = allowedRoutes.map(allowedRoute => {
        return Routes[allowedRoute].startsWith('/')
          ? Routes[allowedRoute]
          : '/' + Routes[allowedRoute];
      });
      const requestBody: AclUrlPermissionRequestBody = {
        urls: allowedRouteUrlsList
      };
      this.authFacade
        .getAccessToken()
        .pipe(
          filter(token => token && token.length > 0),
          take(1)
        )
        .subscribe(token => {
          if (token) {
            this.permissionfacade.loadUrlLevelPermissions(requestBody);
          }
        });
    }
    let index = 0;
    return from(allowedRoutes).pipe(
      mergeMap(allowedRoute => {
        const allowedRouteWithSlash = Routes[allowedRoute].startsWith('/')
          ? Routes[allowedRoute]
          : '/' + Routes[allowedRoute];
        return this.permissionfacade.getURLPermission().pipe(
          filter(data => !!data),
          map(data => {
            const urlTrasactionCodes = this.getAllTransactionCodesForUrl(
              allowedRouteWithSlash,
              data
            );
            return (
              urlTrasactionCodes &&
              !!urlTrasactionCodes.find(key =>
                this.permissionService.hasPermission(key)
              )
            );
          })
        );
      }),
      find(allowed => {
        if (!allowed) {
          // to navigate to user profile if user is not
          // authorized for any of the allowed routes in allowed routes array
          if (index + 1 === allowedRoutes.length) {
            this.router.navigateByUrl(this.resolvedUrl);
          }
          index++;
        }
        return allowed;
      }),
      tap(allowed => this.router.navigateByUrl(Routes[allowedRoutes[index]]))
    );
  }
}
