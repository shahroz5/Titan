import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Courier } from '@poss-web/shared/models';
import { CourierHelper } from '@poss-web/shared/util-adaptors';
import {
  getMasterCourierUrl,
  getMasterCourierSummaryUrl
} from '@poss-web/shared/util-api-service';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';
@Injectable({
  providedIn: 'root'
})
export class CourierDataService {
  constructor(private apiService: CacheableApiService) {}

  getCouriers(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    locationCode?: string,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<Courier[]> {
    const url = getMasterCourierUrl(
      pageIndex,
      pageSize,
      isActive,
      locationCode,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => CourierHelper.getCouriers(data.results)));
  }
  getCouriersCount(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    locationCode?: string,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<number> {
    const url = getMasterCourierUrl(
      pageIndex,
      pageSize,
      isActive,
      locationCode,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getCouriersSummary(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    sort?: string[]
  ): Observable<Courier[]> {
    const url = getMasterCourierSummaryUrl(pageIndex, pageSize, isActive, sort);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => CourierHelper.getCouriers(data.results)));
  }
}
