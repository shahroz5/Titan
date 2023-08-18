import { Injectable } from '@angular/core';
import {
  getCountriesSummaryUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { Country, CountrySummary } from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
import { CountryDataAdaptor } from '@poss-web/shared/util-adaptors';
import {
  getMasterCountriesUrl,
  getMasterCountryByCodeUrl
} from '@poss-web/shared/util-api-service';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';

@Injectable({
  providedIn: 'root'
})
export class CountryDataService {
  constructor(private apiService: CacheableApiService) {}

  getCountries(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<Country[]> {
    const url = getMasterCountriesUrl(
      pageIndex,
      pageSize,
      isActive,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => CountryDataAdaptor.countryDataFromJson(data)));
  }
  getCountriesCount(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<number> {
    const url = getMasterCountriesUrl(
      pageIndex,
      pageSize,
      isActive,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  getCountryByCode(countryCode: string): Observable<Country> {
    const url = getMasterCountryByCodeUrl(countryCode);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => CountryDataAdaptor.countryFromJson(data)));
  }

  getCountrySummary(
    pageIndex?: number,
    pageSize?: number,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<CountrySummary[]> {
    const url = getCountriesSummaryUrl(pageIndex, pageSize, isPageable, sort);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => CountryDataAdaptor.countrySummaryDataFromJson(data))
      );
  }
}
