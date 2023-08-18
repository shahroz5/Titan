import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor, OnDestroy {
  private authdata;
  destroy$: Subject<null> = new Subject<null>();

  constructor(private authFacade: AuthFacade) {
    this.authFacade
      .getAccessToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe(token => (this.authdata = token));
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //  add authorization header with jwt token if available
    if (this.authdata) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authdata}`
        }
      });
    }

    return next.handle(request);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
