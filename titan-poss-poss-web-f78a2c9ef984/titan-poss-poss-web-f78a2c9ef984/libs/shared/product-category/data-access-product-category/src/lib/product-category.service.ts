import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getProductCategoryDetailsListingUrl,
  getProductCategoryByProductCategoryCodeUrl,
  getProductCategorySaveFormDetailsUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadProductCategoryListingPayload,
  LoadProductCategoryListingSuccessPayload,
  ProductCategoryDetails,
  SaveProductCategoryFormDetailsPayload
} from '@poss-web/shared/models';
import { ProductCategoryAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class ProductCategoryService {
  constructor(private apiService: ApiService) {}

  getProductCategoryDetails(
    loadProductCategoryListingPayload: LoadProductCategoryListingPayload
  ): Observable<LoadProductCategoryListingSuccessPayload> {
    const url = getProductCategoryDetailsListingUrl(
      loadProductCategoryListingPayload.pageIndex,
      loadProductCategoryListingPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          ProductCategoryAdaptor.getProductCategoryDetailsListing(data)
        )
      );
  }

  getProductCategoryByProductCategoryCode(
    productCategoryCode: string
  ): Observable<ProductCategoryDetails> {
    const url = getProductCategoryByProductCategoryCodeUrl(productCategoryCode);
    return this.apiService.get(url.path).pipe(
      map(data => ProductCategoryAdaptor.getProductCategoryDetails(data))
    );


  }

  getProductCategorySearchResult(
    productCategoryCode: string
  ): Observable<ProductCategoryDetails[]> {
    const url = getProductCategoryByProductCategoryCodeUrl(productCategoryCode);
    return this.apiService.get(url.path).pipe(map(data => ProductCategoryAdaptor.getProductCategoryDetailsSearch(data)));
  }

  saveProductCategoryFormDetails(
    saveForm: SaveProductCategoryFormDetailsPayload
  ) {
    const url = getProductCategorySaveFormDetailsUrl();
    return this.apiService.post(url.path, saveForm);
  }

  editProductCategoryFormDetails(editedForm: SaveProductCategoryFormDetailsPayload) {
    const url = getProductCategoryByProductCategoryCodeUrl(editedForm.productCategoryCode);
    return this.apiService.patch(url.path, editedForm);
  }
}
