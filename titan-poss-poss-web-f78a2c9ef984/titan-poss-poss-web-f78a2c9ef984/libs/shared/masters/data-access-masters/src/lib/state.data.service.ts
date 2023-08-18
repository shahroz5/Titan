import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State, StateSummary } from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { StateDataAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getMasterStatesUrl,
  getMasterStateByCodeUrl,
  getLocationMasterStates,
  getMasterStatesSummaryUrl
} from '@poss-web/shared/util-api-service';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';

@Injectable({
  providedIn: 'root'
})
export class StateDataService {
  constructor(private apiService: CacheableApiService) {}

  getStates(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    countryCode?: string,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<State[]> {
    const url = getMasterStatesUrl(
      pageIndex,
      pageSize,
      isActive,
      countryCode,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => StateDataAdaptor.stateDataFromJson(data)));
  }
  getStatesCount(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    countryCode?: string,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<number> {
    const url = getMasterStatesUrl(
      pageIndex,
      pageSize,
      isActive,
      countryCode,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getStateById(stateId: number): Observable<State> {
    const url = getMasterStateByCodeUrl(stateId);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => StateDataAdaptor.stateFromJson(data)));
  }

  getStatesSummary(
    countryCode: string,
    pageIndex?: number,
    pageSize?: number,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<StateSummary[]> {
    const url = getMasterStatesSummaryUrl(
      countryCode,
      pageIndex,
      pageSize,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => StateDataAdaptor.stateDataSummaryFromJson(data))
      );
  }

  getStatesFromLocationMaster(
    countryCode: string,
    regionCodes: string[],
    isPageable: boolean
  ): Observable<StateSummary[]> {
    const url = getLocationMasterStates(countryCode, regionCodes, isPageable);

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => StateDataAdaptor.stateDataSummaryFromJson(data))
      );
  }
}
