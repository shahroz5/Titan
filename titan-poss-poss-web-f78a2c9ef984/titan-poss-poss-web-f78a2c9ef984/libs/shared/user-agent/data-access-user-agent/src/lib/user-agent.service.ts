import { Injectable } from '@angular/core';
import {
  ApiService,
  verifyHostNameEndpointUrl,
  getEncrytedptedHostnameUrl,
  ExternalApiService
} from '@poss-web/shared/util-api-service';
import { of, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { UAAdaptor } from '@poss-web/shared/util-adaptors';
import { Hostname } from '@poss-web/shared/models';

@Injectable()
export class UserAgentService {
  constructor(
    private apiService: ApiService,
    private externalApiService: ExternalApiService
  ) {}

  getEncryptedHostName(): Observable<Hostname> {
    const apiUrl = getEncrytedptedHostnameUrl();
    const hostNameData =
      'fgDC6iNJeS1vcjb67XXxuZ1vDFwjW8IE8Q/iRUv/xYvVEXp5tiNe2zrOI+8Kae7YrQRjWZgblQuDdEX/PtTACpfqGwfUndEqPd52aBJJP96mVjF7EbyQPqWQaluZ6IfUfuA6E1AQUMON/EQ86LX+GqI2TBceSQPAat5BqJQxiBpwQ8rnhmAqSOmfMZVYQyvZtWvA69LDUnIYY/7S+MBBwLoJui+EMx2gCzSwSaaDWySZ83QlgDDYjhLmsrp7X/G4M2gc2Xa6v+dvFVt5c5Iu8zdtxLi9rg1LfIqzGDh4316ceO0HiOfohB2+YZHzTSOyEgEg2uDxUMBaFuUndXuecQ==';

    return this.externalApiService.get(apiUrl).pipe(
      tap(),
      map((data: any) => UAAdaptor.getEncryptedHostname(data)),
      catchError(err => {
        return of({
          hostname: hostNameData
        });
      })
    );
  }

  getUnipayConfiguration(): Observable<boolean> {
    const api = verifyHostNameEndpointUrl();
    return this.apiService
      .get(api)
      .pipe(map((data: any) => UAAdaptor.getHostConfiguration(data)));
  }
}
