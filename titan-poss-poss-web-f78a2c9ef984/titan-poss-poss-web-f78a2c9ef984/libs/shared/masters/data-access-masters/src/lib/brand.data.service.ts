import { Injectable } from '@angular/core';
import {
  getBrandSummaryUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Brand, BrandSummary } from '@poss-web/shared/models';
import {
  getMasterBrandsUrl,
  getMasterBrandsbyBrandCodeUrl
} from '@poss-web/shared/util-api-service';
import { BrandAdaptor, BrandHelper } from '@poss-web/shared/util-adaptors';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';

@Injectable({
  providedIn: 'root'
})
export class BrandDataService {
  constructor(private apiService: CacheableApiService) {}

  getBrands(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<Brand[]> {
    const url = getMasterBrandsUrl(
      pageIndex,
      pageSize,
      isActive,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => BrandHelper.getBrands(data.results)));
  }
  getBrandsCount(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<number> {
    const url = getMasterBrandsUrl(
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
  getBrandByCode(BrandCode: string): Observable<Brand> {
    const url = getMasterBrandsbyBrandCodeUrl(BrandCode);
    return this.apiService
      .get(url)
      .pipe(map((data: any) => BrandAdaptor.brandDataFromJson(data)));
  }

  getBrandSummary(
    isPageable?: boolean,
    parentBrandCode?: string,
    pageIndex?: number,
    pageSize?: number,
    sort?: string[],
    parentBrandCodes?: string[],
  ): Observable<BrandSummary[]> {
    const url = getBrandSummaryUrl(
      isPageable,
      parentBrandCode,
      parentBrandCodes,
      pageIndex,
      pageSize,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => BrandAdaptor.brandSummaryDataFromJson(data)));
  }
}
