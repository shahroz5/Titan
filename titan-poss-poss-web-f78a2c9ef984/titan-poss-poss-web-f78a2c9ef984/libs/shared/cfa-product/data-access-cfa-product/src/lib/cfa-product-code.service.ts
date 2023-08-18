import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getCFAProductsUrl,
  getCFAProductsBasedOnProductGroupCodeUrl,
  getSaveCFAProductsUrl,
  // getProductTypesUrl,
  getUpdateCFAProductsUrl,
  getItemTypeUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadCFAProductCodeListingPayload,
  LoadCFAProductCodeListingSuccessPayload,
  UpdateCFAProductsPayload,
  CFAProductsResponse,
  ItemTypesResponse
} from '@poss-web/shared/models';
import { CFAProductCodeAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class CfaProductCodeService {
  constructor(private apiService: ApiService) {}
  getCFAProducts(
    loadCFAProductCodeListingPaylaod: LoadCFAProductCodeListingPayload
  ): Observable<LoadCFAProductCodeListingSuccessPayload> {
    const url = getCFAProductsUrl(
      loadCFAProductCodeListingPaylaod.pageIndex,
      loadCFAProductCodeListingPaylaod.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CFAProductCodeAdaptor.getCFAProductCodeListing(data)));
  }
  getCFAProductsBasedProductGroupCode(productGroupCode) {
    if (productGroupCode === 'new') {
      return of(CFAProductCodeAdaptor.getCFAProductsBasdedOnProductGroupCode());
    } else {
      const url = getCFAProductsBasedOnProductGroupCodeUrl(productGroupCode);
      return this.apiService
        .get(url)
        .pipe(map(data => CFAProductCodeAdaptor.getProductGroupDetails(data)));
    }
  }
  getCFASearchResult(searchValue): Observable<CFAProductsResponse[]> {
    const url = getCFAProductsBasedOnProductGroupCodeUrl(searchValue);
    return this.apiService
      .get(url)
      .pipe(map(data => CFAProductCodeAdaptor.getCFASearchProduct(data)));
  }
  saveCFAProducts(saveCFAProducts: any) {
    const url = getSaveCFAProductsUrl();
    return this.apiService.post(url, saveCFAProducts);
  }
  updateCFAProducts(updateCFAProductsPayload: UpdateCFAProductsPayload) {
    const url = getUpdateCFAProductsUrl(
      updateCFAProductsPayload.productGroupCode
    );
    return this.apiService.patch(url, updateCFAProductsPayload.data);
  }
  // loadProductTypes(): Observable<ProductType[]> {
  //   const url = getProductTypesUrl();
  //   return this.apiService
  //     .get(url)
  //     .pipe(map(data => CFAProductCodeAdaptor.getProductTypes(data)));
  // }
  loadItemTypes(): Observable<ItemTypesResponse[]> {
    const url = getItemTypeUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CFAProductCodeAdaptor.getItemTypes(data)));
  }
}
