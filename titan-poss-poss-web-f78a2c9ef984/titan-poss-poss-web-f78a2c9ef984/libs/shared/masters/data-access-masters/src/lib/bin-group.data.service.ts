import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  getMasterBinGroupsUrl,
  getMasterBinGroupByCodeUrl
} from '@poss-web/shared/util-api-service';
import { BinGroupDataAdaptor } from '@poss-web/shared/util-adaptors';
import { BinGroup } from '@poss-web/shared/models';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';

@Injectable({
  providedIn: 'root'
})
export class BinGroupDataService {
  constructor(private apiService: CacheableApiService) {}

  getBinGroups(
    pageIndex?: number,
    pageSize?: number,
    locationCode?: string,
    isActive?: boolean,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<BinGroup[]> {
    const url = getMasterBinGroupsUrl(
      pageIndex,
      pageSize,
      locationCode,
      isActive,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => BinGroupDataAdaptor.binGroupDataFromJson(data)));
  }
  getBingroupCount(
    pageIndex?: number,
    pageSize?: number,
    locationCode?: string,
    isActive?: boolean,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<number> {
    const url = getMasterBinGroupsUrl(
      pageIndex,
      pageSize,
      locationCode,
      isActive,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }
  getBinGroupByCode(binGroupCode: string): Observable<BinGroup> {
    const url = getMasterBinGroupByCodeUrl(binGroupCode);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => BinGroupDataAdaptor.binGroupFromJson(data)));
  }
}
