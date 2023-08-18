import { Injectable } from '@angular/core';
import {
  getMasterComplexityUrl,
  getMasterPriceGroupUrl,
  getMasterProductGroupMasterCacheUrl,
  getMasterProductGroupUrl,
  getMasterProductGroupMasterUrl,
  getMasterProductGroupSummaryByCodeUrl
} from '@poss-web/shared/util-api-service';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Complexity,
  PriceGroups,
  ProductGroup,
  ProductGroupMaster
} from '@poss-web/shared/models';
import {
  ProductGroupHelper,
  ProductGroupMasterHelper,
  ProductGroupMasterAdaptor
} from '@poss-web/shared/util-adaptors';
@Injectable({
  providedIn: 'root'
})
export class ProductGroupDataService {
  constructor(private apiService: CacheableApiService) {}

  getProductGroups(
    isPageable?: boolean,
    pageIndex?: number,
    pageSize?: number,
    sort?: string[],
    productType?: string
  ): Observable<ProductGroup[]> {
    let serviceData: Observable<any>;
    const url = getMasterProductGroupUrl(
      isPageable,
      pageIndex,
      pageSize,
      sort,
      productType
    );
    serviceData = this.apiService.get(url.path, url.params);
    return serviceData.pipe(
      map((x: any) => ProductGroupHelper.getProductGroups(x.results))
    );
  }
  getPriceGroups(isPageable?: boolean): Observable<PriceGroups[]> {
    let serviceData: Observable<any>;
    const url = getMasterPriceGroupUrl(isPageable);
    serviceData = this.apiService.get(url.path, url.params);
    return serviceData.pipe(
      map((x: any) => ProductGroupHelper.getPriceGroups(x.results))
    );
  }

  getcomplexityDeatils(isPageable?: boolean): Observable<Complexity[]> {
    let serviceData: Observable<any>;
    const url = getMasterComplexityUrl(isPageable);
    serviceData = this.apiService.get(url.path, url.params);
    return serviceData.pipe(
      map((x: any) => ProductGroupHelper.getComplexity(x.results))
    );
  }

  getProductGroupMaster(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<ProductGroupMaster[]> {
    let serviceData: Observable<any>;
    const url = getMasterProductGroupMasterUrl(
      pageIndex,
      pageSize,
      isActive,
      isPageable,
      sort
    );
    serviceData = this.apiService.get(url.path, url.params);
    return serviceData.pipe(
      map((x: any) =>
        ProductGroupMasterHelper.getProductGroupsMaster(x.results)
      )
    );
  }
  getProductGroupMasterCount(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<number> {
    const url = getMasterProductGroupMasterUrl(
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

  getProductGroupByCode(
    productGroupCode: string
  ): Observable<ProductGroupMaster> {
    const url = getMasterProductGroupSummaryByCodeUrl(productGroupCode);
    return this.apiService
      .get(url)
      .pipe(
        map((data: any) =>
          ProductGroupMasterAdaptor.productGroupMasterDataFromJson(data)
        )
      );
  }

  getProductGroupDescription(): Observable<{}> {
    const url = getMasterProductGroupMasterCacheUrl();
    return this.apiService.get(url).pipe(map((data: any) => data));
  }
}
