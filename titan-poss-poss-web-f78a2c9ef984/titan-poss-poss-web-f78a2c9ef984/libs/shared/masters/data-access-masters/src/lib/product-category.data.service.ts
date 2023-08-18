import { Injectable } from '@angular/core';
import {
  getMasterProductCategoryMasterCacheUrl,
  getMasterProductCategoryUrl,
  getMasterProductCategoryMasterUrl
} from '@poss-web/shared/util-api-service';
import { CacheableApiService } from '@poss-web/shared/util-cacheable-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ProductCategory,
  ProductCategoryMaster
} from '@poss-web/shared/models';
import {
  ProductCategoryHelper,
  ProductCategoryMasterHelper
} from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryDataService {
  constructor(private apiService: CacheableApiService) {}

  getProductCategories(
    isPageable?: boolean,
    pageIndex?: number,
    pageSize?: number,
    sort?: string[]
  ): Observable<ProductCategory[]> {
    const url = getMasterProductCategoryUrl(
      isPageable,
      pageIndex,
      pageSize,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          ProductCategoryHelper.getProductCategorys(data.results)
        )
      );
  }

  getProductCategoriesMaster(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<ProductCategoryMaster[]> {
    const url = getMasterProductCategoryMasterUrl(
      pageIndex,
      pageSize,
      isActive,
      isPageable,
      sort
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          ProductCategoryMasterHelper.getProductCategorysMaster(data.results)
        )
      );
  }

  getProductCategoriesMasterCount(
    pageIndex?: number,
    pageSize?: number,
    isActive?: boolean,
    isPageable?: boolean,
    sort?: string[]
  ): Observable<number> {
    const url = getMasterProductCategoryMasterUrl(
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

  getProductCategoryDescription(): Observable<{}> {
    const url = getMasterProductCategoryMasterCacheUrl();
    return this.apiService.get(url).pipe(map((data: any) => data));
  }
}
