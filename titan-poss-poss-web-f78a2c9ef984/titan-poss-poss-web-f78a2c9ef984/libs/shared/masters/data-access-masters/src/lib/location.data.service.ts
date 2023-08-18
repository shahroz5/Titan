import { Injectable } from '@angular/core';
import {
  getCountryListUrl,
  getCurrencyListUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import {
  getMasterLocationsUrl,
  getMasterLocationByCodeUrl,
  getMasterIBTLocationsSummaryUrl,
  getMasterLocationDetailsByCodeUrl,
  getMasterLocationSummaryUrl,
  getLocationSummaryUrl
} from '@poss-web/shared/util-api-service';
import {
  Location,
  LocationSummary,
  LocationSummaryList,
  LocationFilter
} from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import {
  LocationDataAdaptor,
  LocationMappingHelper
} from '@poss-web/shared/util-adaptors';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';

@Injectable({
  providedIn: 'root'
})
export class LocationDataService {
  constructor(private apiService: CacheableApiService) {}

  getLocations(
    filter?: LocationFilter,
    isActive?: boolean,
    pageIndex?: number,
    pageSize?: number,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<Location[]> {
    const url = getMasterLocationsUrl(
      filter,
      isActive,
      pageIndex,
      pageSize,
      isPageable,
      sort
    );
    return this.apiService
      .post(url.path, url.body, url.params)
      .pipe(map((data: any) => LocationDataAdaptor.locationDataFromJson(data)));
  }

  getLocationsCount(
    filter?: LocationFilter,
    isActive?: boolean,
    pageIndex?: number,
    pageSize?: number,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<number> {
    const url = getMasterLocationsUrl(
      filter,
      isActive,
      pageIndex,
      pageSize,
      isPageable,
      sort
    );
    return this.apiService
      .post(url.path, url.body, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getLocationByCode(locationCode: string): Observable<Location> {
    const url = getMasterLocationByCodeUrl(locationCode);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => LocationDataAdaptor.locationFromJson(data)));
  }

  getLocationSummary(): Observable<LocationSummary> {
    const url = getMasterLocationSummaryUrl();
    return this.apiService
      .get(url)
      .pipe(
        map((data: any) => LocationDataAdaptor.locationSummaryFromJson(data))
      );
  }

  getIBTLocationsSummary(
    pageIndex?: number,
    pageSize?: number,
    regionType?: string,
    locationType?: string[],
    ownerTypeCode?: string[],
    sort?: string[]
  ): Observable<Location[]> {
    const url = getMasterIBTLocationsSummaryUrl(
      pageIndex,
      pageSize,
      regionType,
      locationType,
      ownerTypeCode,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => LocationDataAdaptor.locationDataFromJson(data)));
  }

  getLocationSummaryByLocationCode(locationCode: string): Observable<Location> {
    const url = getMasterLocationDetailsByCodeUrl(locationCode);
    // const url = getMasterLocationSummaryByCodeUrl(locationCode);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => LocationDataAdaptor.locationFromJson(data)));
  }

  getLocationSummaryList(
    filter: LocationFilter,
    isPageable?: boolean,
    pageIndex?: number,
    pageSize?: number,
    sort?: string[]
  ): Observable<LocationSummaryList[]> {
    const url = getLocationSummaryUrl(
      filter,
      isPageable,
      pageIndex,
      pageSize,
      sort
    );
    return this.apiService
      .post(url.path, url.body, url.params)
      .pipe(
        map((data: any) =>
          LocationDataAdaptor.locationSummaryListFromJson(data)
        )
      );
  }

  getCountryList(isPageable?: boolean) {
    const url = getCountryListUrl(isPageable);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => LocationMappingHelper.getCountryList(data.results))
      );
  }

  getCurrencyList(isPageable?: boolean) {
    const url = getCurrencyListUrl(isPageable);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => LocationMappingHelper.getCurrencyList(data.results))
      );
  }
}
