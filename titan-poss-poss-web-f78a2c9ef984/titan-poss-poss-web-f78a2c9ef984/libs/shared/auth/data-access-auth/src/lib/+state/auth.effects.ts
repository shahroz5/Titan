import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { AuthState, CustomErrors } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { POSS_WEB_MAX_LIMIT_TO_BREAK_API_LOOP } from '@poss-web/shared/util-config';
import { LoggerService } from '@poss-web/shared/util-logger';
import { loginUrl } from '@poss-web/shared/util-site-routes';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { AuthenticationService } from '../auth.service';
import * as AuthActions from './auth.actions';
import { AuthActionTypes } from './auth.actions';

@Injectable()
export class AuthEffect {
  refreshCheck: boolean;
  loginStatus = false;
  isSsoLogin = false;

  constructor(
    private authService: AuthenticationService,
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private router: Router,
    private actions$: Actions,
    @Inject(POSS_WEB_MAX_LIMIT_TO_BREAK_API_LOOP)
    private maxRetryLimit: number
  ) {}

  @Effect()
  login = this.dataPersistence.pessimisticUpdate(AuthActionTypes.LOGIN, {
    run: (a: AuthActions.Login, state: AuthState) => {
      return this.authService
        .login(a.payload.userName, a.payload.authorizationCode)
        .pipe(
          tap(response => {
            this.refreshCheck = true;
            this.loginStatus = true;
            this.isSsoLogin = response.isSso;
            this.authService.setCircuitBreakerCount('value', 0);
          }),
          mergeMap(response => [new AuthActions.LoginSuccess(response)])
        );
    },
    onError: (a: AuthActions.Login, e: any) => {
      return new AuthActions.LoginFailure(this.errorHandler(e));
    }
  });

  @Effect()
  logout$ = this.dataPersistence.pessimisticUpdate(AuthActionTypes.LOGOUT, {
    run: (a: AuthActions.Logout, state: AuthState) => {
      return this.authService.logout().pipe(
        tap(response => (this.refreshCheck = false)),
        map(response => {
          return new AuthActions.LogoutSuccess();
        })
      );
    },
    onError: (a: AuthActions.Logout, e: any) => {
      this.reloadPage();
      return new AuthActions.LogoutFailure(this.errorHandler(e));
    }
  });

  @Effect()
  ssoLogoutUrl$ = this.dataPersistence.pessimisticUpdate(
    AuthActionTypes.GET_SSO_LOGOUT_URL,
    {
      run: (action: AuthActions.GetSsoLogoutUrl, state: AuthState) => {
        return this.authService.getSsoLogoutUrl().pipe(
          map((logoutUrl: string) => {
            // If AD Logout should not be done from other Window, then dont launch this window.open.
            // Instead from navigation component, dispatch logoutFromSso action, this needs CORS issue fix from server
            if (logoutUrl && logoutUrl.length > 0) {
              window.open(logoutUrl, '_blank');
            }
            return new AuthActions.GetSsoLogoutUrlSuccess(logoutUrl);
          })
        );
      },
      onError: (
        action: AuthActions.GetSsoLogoutUrl,
        error: HttpErrorResponse
      ) => {
        return new AuthActions.GetSsoLogoutUrlFailure(this.errorHandler(error));
      }
    }
  );

  // @Effect()
  // logoutFromSso$ = this.dataPersistence.pessimisticUpdate(
  //   AuthActionTypes.LOGOUT_FROM_SSO,
  //   {
  //     run: (action: AuthActions.LogoutFromSso, state: AuthState) => {
  //       return this.authService.logoutFromSso(action.payload).pipe(
  //         map((response: string) => {
  //           return new AuthActions.LogoutFromSsoSuccess();
  //         })
  //       );
  //     },
  //     onError: (
  //       action: AuthActions.LogoutFromSso,
  //       error: HttpErrorResponse
  //     ) => {
  //       return new AuthActions.LogoutFromSsoFailure(this.errorHandler(error));
  //     }
  //   }
  // );

  @Effect()
  reload$ = this.dataPersistence.fetch(AuthActionTypes.RELOAD, {
    run: (action: AuthActions.Reload) => {
      return this.authService.reload().pipe(
        tap(response => {
          this.refreshCheck = true;
          this.isSsoLogin = response.isSso;

          const urlPath = this.authService.getUrlPathWithQueryParams(
            action.payload
          );

          if (!!urlPath.returnParams) {
            this.router.navigate([urlPath.url], {
              queryParams: urlPath.returnParams
            });
          } else {
            this.router.navigate([urlPath.url]);
          }
        }),
        mergeMap(response => [new AuthActions.ReloadSuccess(response)])
      );
    },
    onError: (action: AuthActions.Reload, error: HttpErrorResponse) => {
      this.router.navigate([loginUrl()], {
        queryParams: { returnUrl: action.payload }
      });
      return new AuthActions.ReloadFailure(this.errorHandler(error));
    }
  });

  @Effect()
  refresh$ = this.dataPersistence.fetch(AuthActionTypes.REFRESH, {
    run: (action: AuthActions.Refresh) => {
      return this.authService.refresh(action.payload).pipe(
        tap(_ => {
          this.authService.setCircuitBreakerCount('value', 0);
        }),
        mergeMap(response => {
          this.reloadPage();
          return [new AuthActions.RefreshSuccess(response)];
        })
      );
    },
    onError: (action: AuthActions.Refresh, error: HttpErrorResponse) => {
      let circuitBreaker = this.authService.getCircuitBreakerCount('value');
      circuitBreaker++;
      if (circuitBreaker <= this.maxRetryLimit) {
        this.authService.setCircuitBreakerCount('value', circuitBreaker);

        this.reloadPage();
      } else {
        circuitBreaker = 0;
        this.authService.setCircuitBreakerCount('value', circuitBreaker);
        return new AuthActions.Logout();
      }

      return new AuthActions.RefreshFailure(this.errorHandler(error));
    }
  });

  @Effect() topNavToggle = this.actions$.pipe(
    ofType('@ngrx/router-store/navigated'),
    filter(_ => this.loginStatus),
    map(action => {
      this.loginStatus = false;
      return new AuthActions.ChangeLoginStatus(true);
    })
  );

  @Effect() getSsoLogoutUrl = this.actions$.pipe(
    ofType(AuthActionTypes.LOGOUT),
    filter(_ => this.isSsoLogin),
    map(action => {
      this.isSsoLogin = false;
      return new AuthActions.GetSsoLogoutUrl();
    })
  );

  reloadPage() {
    window.location.reload();
  }

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
