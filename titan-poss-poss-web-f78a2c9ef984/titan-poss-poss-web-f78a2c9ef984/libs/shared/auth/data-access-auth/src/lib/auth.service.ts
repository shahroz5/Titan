import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { Token, User } from '@poss-web/shared/models';
import { UAFacade } from '@poss-web/shared/user-agent/data-access-user-agent';
import { ACLEncoder } from '@poss-web/shared/util-acl-encoder';
import {
  ApiService,
  getActiveAccessTokenEndpointUrl,
  getLoginEndpointUrl,
  getLogoutEndpointUrl,
  getRefreshApiBody,
  getRefreshEndpointUrl,
  getReloadEndpointUrl,
  getSsoLogoutEndpointUrl
} from '@poss-web/shared/util-api-service';
import {
  LocalStorageService,
  StorageFacade
} from '@poss-web/shared/util-cacheable-api-service';
import {
  POSS_WEB_BRAND_CODE,
  POSS_WEB_ENCRYPT_PASSWORD
} from '@poss-web/shared/util-config';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, map } from 'rxjs/operators';
import { CryptoService } from './crypto.service';
import { JwtHelper } from './jwt.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private brandCodeHeader: string;
  private hostNameHeader: string;
  // private sampleHostName =
  //   'JH7DNhh6HuZWdF1LOzx3caf0e9Nzec+8zCPPIhHUedo6YnCVILrfdMzhoCq6es6vzSPH2FT7l4TEo2TOSI5wBGTyQABWO22UKEMWSW/4RprDr1cPcrjmcLI88OcFqZt6xK8r5yZzPtKxOpz+7/kmkR5wSSTUTb+OVmbWsb9zmA2eeFFunTsw2CbiXMdGCEM5oAFqMIrfMgnj2Z/ffl72pZg2FZB/iFk3DwsD6N7wHgvNOYu1XNUhc72XDip9XkZQbTFWP6zHLxUzNYJrDXLSzwk+c/aO6yX4NAjA9bpT3JYO7FDZ6VuEpPXWE7k3x85u8pJKQf2tdbiBtWXteNQkFQ==';

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private storageFacade: StorageFacade,
    private appSettingFacade: AppsettingFacade,
    private userAgentFacade: UAFacade,
    private cryptoService: CryptoService,
    private localStorageService: LocalStorageService,
    @Inject(POSS_WEB_ENCRYPT_PASSWORD) private encryptPassword,
    @Inject('env') private env,
    @Inject(POSS_WEB_BRAND_CODE) private brandCode: string
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.brandCodeHeader = this.brandCode;

    this.userAgentFacade.getEncryptedHostname().subscribe(hostName => {
      this.hostNameHeader = hostName;
    });
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getUrlPathWithQueryParams(
    path: string
  ): {
    url;
    returnParams;
  } {
    let returnUrl = null;
    if (path.includes('?')) {
      const url = path.slice(0, path.indexOf('?'));
      const params = path.slice(path.indexOf('?') + 1);
      const urlParams = new URLSearchParams(params);
      const returnParams = this.paramsToObject(urlParams);
      returnUrl = { url, returnParams };
    } else {
      returnUrl = { url: path, returnParams: null };
    }
    return returnUrl;
  }

  paramsToObject(entries) {
    const result = {};
    for (const [key, value] of entries) {
      result[key] = value;
    }
    return result;
  }

  login(username: string, password: string) {
    this.storageFacade.clearCachedDataForUser();
    return this.evaluateCredentials(username, password);
  }

  evaluateCredentials(username: string, password: string) {
    const loginEndpointURL = getLoginEndpointUrl(this.env);
    this.api.FromHeader = username;
    const body = {
      brandCode: this.brandCodeHeader,
      hostName: this.hostNameHeader
    };
    if (!this.encryptPassword) {
      this.api.AuthorizationHeader = window.btoa(password);
      return this.api.post(loginEndpointURL, body).pipe(
        map(token => this.getUser(token, password))
        // catchError(val => throwError(of(val.error)))
      );
    } else {
      return this.api.get(getActiveAccessTokenEndpointUrl(this.env)).pipe(
        concatMap(key => {
          this.api.AuthorizationHeader = this.cryptoService.encryptPassword(
            key.publicKey,
            password
          );
          return this.api
            .post(loginEndpointURL, body)
            .pipe(map(token => this.getUser(token, password)));
        })
      );
    }
  }

  logout(): Observable<void> {
    const logoutEndpointURL = getLogoutEndpointUrl(this.env);
    this.storageFacade.clearCachedDataForUser();

    return this.api.delete(logoutEndpointURL).pipe(
      // return of(true).pipe(
      map(_ => {
        this.appSettingFacade.changeStoreType('');
      })
      // catchError(err =>{
      //   this.appSettingFacade.changeStoreType('');
      //   this.appSettingFacade.changeLoginStatus('LOGGED_OUT');
      //   throw(err);
      // })
    );
  }

  getSsoLogoutUrl(): Observable<any> {
    return this.api
      .get(getSsoLogoutEndpointUrl(this.env))
      .pipe(map(response => response.logoutUrl));
  }

  // logoutFromSso(ssoLogoutUrl: string): Observable<any> {
  //   console.log('ssoLogoutUrl', ssoLogoutUrl);
  //   return this.http.get(ssoLogoutUrl);
  // }

  reload(): Observable<any> {
    // return of(this.getUser({}, '')).pipe(delay(100));
    return this.api
      .get(getReloadEndpointUrl(this.env))
      .pipe(map(token => this.getUser(token, '')));
  }

  refresh(refreshtoken: string): Observable<any> {
    //this.api.ContentTypeHeader = 'application/x-www-form-urlencoded';
    return this.api
      .post(getRefreshEndpointUrl(this.env), getRefreshApiBody(refreshtoken))
      .pipe(
        map(token => this.getUser(token, '')),
        catchError(err => {
          this.appSettingFacade.changeStoreType('');
          return throwError(err);
        })
      );
  }

  getUser(token: any, password: string): User {
    // token.accessToken =
    //   'eyJhbGciOiJIUzI1NiJ9.eyJhcHAiOiJQT1NTIiwibG9jIjoiQ1BEIiwibW9iIjoiOTk4MDY3MTg3NyIsImFwaUtleSI6ZmFsc2UsIm9yZyI6IlRKRVciLCJpc3MiOiJwb3NzLnRhbmlzaHEuY28uaW4iLCJlbXAiOiJjYXNoaWVyY3BkIiwiYWNsIjpbIkItZitBIiwiUi0vd0EiLCJDLUFBQUFBQUFBQUFBUEFBIiwiUy0vLytBSC8vLy8rLy8vLy8vLy9nIiwiVS02d0EiLCJJLS8vL3YvK0UvLy8vK2dBIiwiTS1BQUFBQUFBQUdBQUFBQUFBWVlBQUFCbUdJQSIsIk4tQkEiXSwidHlwZSI6IkwxIiwiYXVkIjoiMTcyLjMxLjQ4LjcyIiwib2ZmbGluZSI6dHJ1ZSwidXBuIjoiY2FzaGllcmNwZCIsImVtcE5hbWUiOiJjYXNoaWVyY3BkIiwiaXNTc28iOmZhbHNlLCJob3N0IjoiSG9zdE5hbWUiLCJmcGMiOmZhbHNlLCJleHAiOjE2NzM4ODIxNjEsImlhdCI6MTY3Mzg2Nzc2MSwiYnJhbmQiOiJUYW5pc2hxIiwiZW1haWwiOiJjYXNoaWVyY3BkQHRpdGFuLmNvbSJ9.O7g-b8dsiWFNtwsgVG7R4veEEpmmGUgMnVHbDSNtC2I';
    const userData: Token = JwtHelper.decodeToken(token.accessToken);
    this.appSettingFacade.setHostName(userData.host);
    const ACLlist = ACLEncoder.getAllAssignedACL(
      ACLEncoder.getMapFromStringArray(userData.acl)
    );

    console.log('ACLList', ACLlist);
    return {
      username: userData.upn,
      password: password,
      firstName: userData.unique_name,
      lastName: userData.name,
      locationCode: userData.loc,
      storeType: userData.type,
      exptime: new Date(+userData.exp * 1000),
      accessToken: token.accessToken,
      refreshToken: token.refreshTokenId,
      refreshTokenExp: new Date(token.refreshTokenExpiresAt),
      acl: ACLlist,
      isSso: userData.isSso
    };
  }

  getCircuitBreakerCount(key: string): number {
    let circuitBreakerCount = 0;
    const count = this.localStorageService.getDataFromStore(key, key);
    if (!!count) {
      circuitBreakerCount = Number(count);
    }
    return circuitBreakerCount;
  }

  setCircuitBreakerCount(key: string, value: number) {
    this.localStorageService.setCache(key, value, key);
  }
}
