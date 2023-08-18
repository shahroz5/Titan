import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExternalApiService {
  private authroizationHeader: string = null;
  private contentTypeHeader: string = null;
  private fromHeader: string = null;
  private responseContentType: string = null;

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

  get FromHeader(): string {
    return this.fromHeader;
  }
  set FromHeader(value: string) {
    this.fromHeader = value;
  }
  constructor(private http: HttpClient) {}

  get(url: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${url}`, {
        params
      })
      .pipe(
        tap(data => {
          this.resetProperties();
        }),
        catchError(err => {
          this.resetProperties();
          throw err;
        })
      );
  }

  get headers(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      From: '',
      Authorization: ''
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

    return new HttpHeaders(headersConfig);
  }

  private resetProperties() {
    this.contentTypeHeader = 'application/json';
    this.responseContentType = '';
    this.authroizationHeader = '';
  }
}
