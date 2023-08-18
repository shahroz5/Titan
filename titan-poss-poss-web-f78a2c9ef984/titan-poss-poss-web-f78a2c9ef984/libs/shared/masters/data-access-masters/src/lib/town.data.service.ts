import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Town, TownSummary } from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { TownDataAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getMasterTownsUrl,
  getMasterTownByCodeUrl,
  getMasterTownsSummaryUrl
} from '@poss-web/shared/util-api-service';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';

@Injectable({
  providedIn: 'root'
})
export class TownDataService {
  constructor(private apiService: CacheableApiService) {}

  getTowns(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    stateCode?: string,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<Town[]> {
    const url = getMasterTownsUrl(
      pageIndex,
      pageSize,
      isActive,
      stateCode,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => TownDataAdaptor.townDataFromJson(data)));
  }
  getTownsCount(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    stateCode?: string,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<number> {
    const url = getMasterTownsUrl(
      pageIndex,
      pageSize,
      isActive,
      stateCode,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }
  getTownByCode(townCode: number): Observable<Town> {
    const url = getMasterTownByCodeUrl(townCode);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => TownDataAdaptor.townFromJson(data)));
  }

  getTownsSummary(
    stateId: string,
    pageIndex?: number,
    pageSize?: number,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<TownSummary[]> {
    const url = getMasterTownsSummaryUrl(
      stateId,
      pageIndex,
      pageSize,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => TownDataAdaptor.townDataSummaryFromJson(data)));
  }
}
