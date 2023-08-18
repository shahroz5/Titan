// Uncomment the code if you need to use fake-backend-service.
// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpResponse,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HTTP_INTERCEPTORS
// } from '@angular/common/http';
// import { Observable, of, throwError } from 'rxjs';
// import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
// import { User } from '@poss-web/shared/models';

// const users: User[] = [
//   {
//     username: 'L1User',
//     password: '',
//     firstName: 'L1USER',
//     lastName: 'L1USER',
//     locationCode: 'URB',
//     exptime: null,
//     storeType: 'L1',
//     refreshToken: '',
//     refreshTokenExp: null,
//     acl: null
//   },
//   {
//     username: 'L3User',
//     password: '',
//     firstName: 'L3USER',
//     lastName: 'L3USER',
//     locationCode: 'PNB',
//     exptime: null,
//     storeType: 'L3',
//     refreshToken: '',
//     refreshTokenExp: null,
//     acl: null
//   }
// ];

// @Injectable()
// export class FakeBackendInterceptor implements HttpInterceptor {
//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const { url, method, headers, body } = request;
//     console.log(url);
//     // wrap in delayed observable to simulate server api call
//     return of(null)
//       .pipe(mergeMap(handleRoute))
//       .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
//       .pipe(delay(500))
//       .pipe(dematerialize());

//     function handleRoute() {
//       switch (true) {
//         case url.endsWith('/v1/login') && method === 'POST':
//           return authenticate();
//         default:
//           // pass through any requests not handled above
//           return next.handle(request);
//       }
//     }

//     // route functions

//     function authenticate() {
//       const userDetail = JSON.parse(body);
//       const username = userDetail.From;
//       const password = userDetail.Authorization;

//       const user = users.find(
//         x => x.username === username && x.password === window.atob(password)
//       );
//       if (!user) return error('Username or password is incorrect');
//       return ok({
//         username: user.username,
//        // password: user.password,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         storeType: user.storeType,
//         accessToken:
//           'eyJhbGciOiJIUzI1NiJ9.eyJzY3AiOltdLCJsb2MiOiJVUkIiLCJhcGlLZXkiOmZhbHNlLCJpc3MiOiJwb3NzLnRhbmlzaHEuY28uaW4iLCJhdWQiOiJlYzItMTMtMjM0LTEyNC0yNTAuYXAtc291dGgtMS5jb21wdXRlLmFtYXpvbmF3cy5jb20iLCJ1cG4iOiJMMVVzZXIiLCJ1bmlxdWVfbmFtZSI6IkwxVXNlciIsIm5iZiI6MTU2NzM1ODIyNCwibmFtZSI6IkwxVXNlciIsImV4cCI6MTU2OTk1MDIyNCwiaWF0IjoxNTY3MzU4MjI0LCJlbWFpbCI6Imthc2lyZWRkeTEwMzNAZ21haWwuY29tIiwic3RhdHVzIjoiQUNUSVZFIn0.1_VbFA4pFmBy4fgQD2e2zrM6jPS5mgcvmwcpOSbiEvA'
//       });
//     }

//     function getUsers() {
//       if (!isLoggedIn()) return unauthorized();
//       return ok(users);
//     }

//     // helper functions

//     function ok(payload: any) {
//       return of(new HttpResponse({ status: 200, body: payload }));
//     }

//     function error(message) {
//       return throwError({ error: { message } });
//     }

//     function unauthorized() {
//       return throwError({ status: 401, error: { message: 'Unauthorised' } });
//     }

//     function isLoggedIn() {
//       return headers.get('Authorization') === 'Bearer fake-jwt-token';
//     }
//   }
// }

// export let fakeBackendProvider = {
//   // use fake backend in place of Http service for backend-less development
//   provide: HTTP_INTERCEPTORS,
//   useClass: FakeBackendInterceptor,
//   multi: true
// };
