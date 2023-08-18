import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { Navigation } from '@poss-web/shared/models';
import { HttpClient } from '@angular/common/http';
import { POSS_APP_TYPE } from '@poss-web/shared/util-config';
// import {
//   ApiService,
//   getNotificationEndPointUrl
// } from '@poss-web/shared/util-api-service';

// import {
//   NativeEventSource,
//   EventSourcePolyfill
// } from 'event-source-polyfill/src/eventsource.min.js';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  constructor(
    private http: HttpClient,
    // private ngZone: NgZone,
    // private apiService: ApiService,
    @Inject(POSS_APP_TYPE) private appType //@Inject(POSS_WEB_API_URL) private apiURL: string
  ) {}

  getdata(): Observable<Navigation[]> {
    console.log('Loading sidenav json');
    return this.http.get(`./assets/sidenav-${this.appType}.json`).pipe(
      map(data => data['sidenav']),
      share()
    );
  }

  // Commented following code for SSE notifications - Need to implement service integration
  // getEventsFromServer(url: string, accessToken: any): Observable<MessageEvent> {
  //   return new Observable(observer => {
  //     const eventSource = this.getEventService(url, accessToken);
  //     eventSource.onopen = e => {
  //       this.ngZone.run(() => {
  //         console.log('CONNECTION IS OPEN!!');
  //       });
  //     };
  //     eventSource.onmessage = e => {
  //       this.ngZone.run(() => {
  //         observer.next(e);
  //       });
  //     };
  //     eventSource.onerror = err => {
  //       this.ngZone.run(() => {
  //         observer.error(err);
  //       });
  //     };
  //   });
  // }
  // getEventService(url: string): EventSource {
  //   return new EventSource(url);
  // }
  // getEventService(url: string, accessToken: any): EventSourcePolyfill {
  //   console.log(
  //     'API Service Header :',
  //     this.apiService.headers.get('Authorization')
  //   );
  //   console.log('ACCESS TOKEN :', accessToken);
  //   return new EventSourcePolyfill(this.apiURL + getNotificationEndPointUrl(), {
  //     headers: {
  //       // Authorization: 'bearer 12zew123'
  //       // Authorization:
  //       //   'Bearer eyJhbGciOiJIUzI1NiJ9.eyJsb2MiOiJVUkIiLCJtb2IiOiI5MjM5MTI5NTQ2IiwiYXBpS2V5IjpmYWxzZSwib3JnIjoiVEoiLCJpc3MiOiJwb3NzLnRhbmlzaHEuY28uaW4iLCJlbXAiOiJyc28udXJiLjIiLCJhY2wiOlsiQi13QSIsIlMtLy8rQSJdLCJ0eXBlIjoiTDEiLCJhdWQiOiIxNzIuMzEuNDguNzIiLCJ1cG4iOiJyc28udXJiLjIiLCJuYmYiOjE2MDQ0Njg2NjEsImhvc3QiOiJIb3N0TmFtZSIsImZwYyI6dHJ1ZSwiZXhwIjoxNjA0NDgzMDYxLCJpYXQiOjE2MDQ0Njg2NjEsImJyYW5kIjoiVGFuaXNocSIsImVtYWlsIjoxNjA0NDgzMDYxfQ.4bNR9veMHlzeQfl1QNUe-sjgID_EDI1wDCWPA8oYoqQ'
  //       Authorization: accessToken
  //     }
  //   });
  // }
}
