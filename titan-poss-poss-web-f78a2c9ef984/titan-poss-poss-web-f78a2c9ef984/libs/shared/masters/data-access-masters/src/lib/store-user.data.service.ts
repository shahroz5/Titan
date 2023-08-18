import { Injectable } from '@angular/core';
import { StoreUser } from '@poss-web/shared/models';
import { StoreUserHelper } from '@poss-web/shared/util-adaptors';
import { getMasterStoreUserUrl } from '@poss-web/shared/util-api-service';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreUserDataService {
  constructor(private apiService: CacheableApiService) {}

  getStoreUsers(
    pageIndex?: number,
    pageSize?: number,
    employeeCode?: string,
    locationCodes?: string[],
    roleCodes?: string[],
    sort?: string[]
  ): Observable<StoreUser[]> {
    const url = getMasterStoreUserUrl(
      pageIndex,
      pageSize,
      employeeCode,
      locationCodes,
      roleCodes,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => StoreUserHelper.getStoreUsers(data.results)));
  }
  getStoreUsersCount(
    pageIndex?: number,
    pageSize?: number,
    employeeCode?: string,
    locationCodes?: string[],
    roleCodes?: string[],
    sort?: string[]
  ): Observable<number> {
    const url = getMasterStoreUserUrl(
      pageIndex,
      pageSize,
      employeeCode,
      locationCodes,
      roleCodes,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }
}
