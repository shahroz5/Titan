import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {
  POSS_WEB_API_URL,
  POSS_WEB_BRAND_CODE
} from '@poss-web/shared/util-config';
import { ImageUrlDetails } from '@poss-web/shared/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private hostUrl: string;
  private authroizationHeader: string = null;
  private contentTypeHeader: string = null;
  private fromHeader: string = null;
  private responseContentType: string = null;
  private imageApikeyHeader: string = null;
  private imageUsertokenHeader: string = null;
  private imageHeader = false;
  // private brandCodeHeader: string = null;

  get ContentTypeHeader(): string {
    return this.contentTypeHeader;
  }
  set ContentTypeHeader(value: string) {
    this.contentTypeHeader = value;
  }

  get AuthorizationHeader(): string {
    return this.authroizationHeader;
  }
  set AuthorizationHeader(value: string) {
    this.authroizationHeader = value;
  }

  get ResponseContentType(): any {
    return this.responseContentType;
  }
  set ResponseContentType(value: any) {
    this.responseContentType = value;
  }

  get ImageApikeyHeader(): any {
    return this.imageApikeyHeader;
  }
  set ImageApikeyHeader(value: any) {
    this.imageApikeyHeader = value;
  }

  get ImageUsertokenHeader(): any {
    return this.imageUsertokenHeader;
  }
  set ImageUsertokenHeader(value: any) {
    this.imageUsertokenHeader = value;
  }

  get FromHeader(): string {
    return this.fromHeader;
  }
  set FromHeader(value: string) {
    this.fromHeader = value;
  }
  constructor(
    private http: HttpClient,
    @Inject(POSS_WEB_API_URL) private apiURL: string
  ) {
    // this.brandCodeHeader = brandCode;
    // console.log('DataService Initialized');
  }

  get(url: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${this.apiURL}${url}`, {
        headers: this.headers,
        responseType: this.ResponseContentType,
        params
      })
      .pipe(
        tap(data => {
          this.resetProperties();
        }),
        catchError(async err => {
          this.resetProperties();
          throw err;
        })
      );
  }

  post(
    url: string,
    data: Object = {},
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .post(`${this.apiURL}${url}`, JSON.stringify(data), {
        headers: this.headers,
        params
      })
      .pipe(
        tap(() => {
          this.resetProperties();
        }),
        catchError(err => {
          this.resetProperties();
          throw err;
        })
      );
  }

  postFile(
    url: string,
    data: Object = {},
    params?: HttpParams
  ): Observable<any> {
    return this.http.post(`${this.apiURL}${url}`, data, { params }).pipe(
      tap(() => {
        this.resetProperties();
      })
    );
  }

  postImage(
    url: string,
    data: Object = {},
    responseType: any,
    params?: HttpParams
  ): Observable<any> {
    return this.http
      .post(`${this.apiURL}${url}`, data, {
        responseType: responseType,
        params: params
      })
      .pipe(
        tap(() => {
          this.resetProperties();
        }),
        catchError(async err => {
          const jsonError = await new Response(err.error).json();
          err.error = jsonError;
          this.resetProperties();
          throw err;
        })
      );
  }

  put(
    url: string,
    data: Object = {},
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .put(`${this.apiURL}${url}`, JSON.stringify(data), {
        headers: this.headers,
        params
      })
      .pipe(
        tap(() => {
          this.resetProperties();
        }),
        catchError(err => {
          this.resetProperties();
          throw err;
        })
      );
  }

  patch(
    url: string,
    data: Object = {},
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .patch(`${this.apiURL}${url}`, JSON.stringify(data), {
        headers: this.headers,
        params
      })
      .pipe(
        tap(() => {
          this.resetProperties();
        }),
        catchError(err => {
          this.resetProperties();
          throw err;
        })
      );
  }

  delete(url: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .delete(`${this.apiURL}${url}`, {
        headers: this.headers,
        params
      })
      .pipe(
        tap(() => {
          this.resetProperties();
        }),
        catchError(err => {
          this.resetProperties();
          throw err;
        })
      );
  }

  getBlobResponse(
    url: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .get(`${this.apiURL}${url}`, {
        headers: this.headers,
        responseType: this.ResponseContentType,
        params
      })
      .pipe(
        tap(data => {
          this.resetProperties();
        }),
        catchError(async err => {
          const jsonError = await new Response(err.error).json();
          err.error = jsonError;
          this.resetProperties();
          throw err;
        })
      );
  }

  postBlobResponse(
    url: string,
    data: Object = {},
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.http
      .post(`${this.apiURL}${url}`, JSON.stringify(data), {
        headers: this.headers,
        responseType: this.ResponseContentType,
        params
      })
      .pipe(
        tap(data => {
          this.resetProperties();
        }),
        catchError(async err => {
          const jsonError = await new Response(err.error).json();
          err.error = jsonError;
          this.resetProperties();
          throw err;
        })
      );
  }

  getImageSrcUrl(
    imageUrl: string,
    apikey: string,
    usertoken: string
  ): Observable<any> {
    this.imageHeader = true;
    this.ImageApikeyHeader = apikey;
    this.ImageUsertokenHeader = usertoken;
    //const baseUrl = "https://dev-poss.titanposs.in";
    //const baseUrl = this.apiURL.split('/poss/api').pop();
    return this.http
      .get(`${imageUrl}`, {
        headers: this.headers
      })
      .pipe(
        tap(data => {
          this.resetProperties();
        }),
        catchError(async err => {
          this.resetProperties();
          throw err;
        })
      );
  }
  // getWithoutPossBaseUrl(
  //   url: string,
  //   params: HttpParams = new HttpParams()
  // ): Observable<any> {
  //   return this.http
  //     .get(`${url}`, {
  //       params
  //     })
  //     .pipe(
  //       tap(data => {
  //         this.resetProperties();
  //       }),
  //       catchError(err => {
  //         this.resetProperties();
  //         throw err;
  //       })
  //     );
  // }

  get headers(): HttpHeaders {
    // let headersConfig;
    // if (this.authroizationHeader) {
    //   headersConfig = {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //     From: '',
    //     Authorization: '',
    //     BrandCode: ''
    //   };

    //   if (this.brandCodeHeader !== null) {
    //     headersConfig.BrandCode = this.brandCodeHeader;
    //   }
    // } else {
    //   headersConfig = {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //     From: '',
    //     Authorization: ''
    //   };
    // }

    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      From: '',
      Authorization: ''
    };

    const imageApiTokenConfig = {
      apikey: '',
      usertoken: ''
    };

    if (this.contentTypeHeader !== null) {
      headersConfig['Content-Type'] = this.contentTypeHeader;
    }
    if (this.authroizationHeader !== null) {
      headersConfig.Authorization = this.authroizationHeader;
    }
    if (this.fromHeader !== null) {
      headersConfig.From = this.fromHeader;
    }
    if (this.imageApikeyHeader !== null) {
      imageApiTokenConfig.apikey = this.imageApikeyHeader;
    }
    if (this.imageUsertokenHeader !== null) {
      imageApiTokenConfig.usertoken = this.imageUsertokenHeader;
    }
    if (this.imageHeader === true) {
      this.imageHeader = false;
      return new HttpHeaders(imageApiTokenConfig);
    } else return new HttpHeaders(headersConfig);
  }

  private resetProperties() {
    this.contentTypeHeader = 'application/json';
    this.responseContentType = '';
    this.authroizationHeader = '';
    // this.brandCode = '';
  }
}
