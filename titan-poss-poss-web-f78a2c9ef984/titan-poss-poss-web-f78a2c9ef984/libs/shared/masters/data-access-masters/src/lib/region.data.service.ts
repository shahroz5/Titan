import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Region, RegionSummary } from '@poss-web/shared/models';
import { RegionHelper ,RegionAdaptor} from '@poss-web/shared/util-adaptors';
import {
  getMasterRegionsUrl,
  getMasterRegionSummaryByCodeUrl
} from '@poss-web/shared/util-api-service';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';
@Injectable({
  providedIn: 'root'
})
export class RegionDataService {
  constructor(private apiService: CacheableApiService) {}

  getRegions(
    regionType: string,
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    isPageable?: boolean,
    parentRegionCode?: string,
    sort?: string[]
  ): Observable<Region[]> {
    const url = getMasterRegionsUrl(
      regionType,
      pageIndex,
      pageSize,
      isActive,
      isPageable,
      parentRegionCode,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => RegionHelper.getRegions(data.results)));
  }

  getRegionsCount(
    regionType: string,
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    isPageable?: boolean,
    parentRegionCode?: string,
    sort?: string[]
  ): Observable<number> {
    const url = getMasterRegionsUrl(
      regionType,
      pageIndex,
      pageSize,
      isActive,
      isPageable,
      parentRegionCode,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }
  getRegionSummary(
    isPageable?: boolean,
    parentRegionCode?: string,
    pageIndex?: number,
    pageSize?: number,
    sort?: string[]
  ): Observable<RegionSummary[]> {
    const url = getMasterRegionSummaryByCodeUrl(
      isPageable,
      parentRegionCode,
      pageIndex,
      pageSize,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => RegionAdaptor.regionSummaryDataFromJson(data)));
  }
}
