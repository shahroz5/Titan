import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getTaxMasterListingUrl,
  getTaxMasterDetailsUrl,
  getSaveTaxMasterFormUrl,
  getEditTaxMasterFormUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadTaxMasterListingPayload,
  LoadTaxMasterListingSuccessPayload,
  TaxMasterDetails
} from '@poss-web/shared/models';
import { TaxMasterAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class TaxMasterService {
  constructor(private apiService: ApiService) {}

  getTaxMasterList(
    loadTaxMasterListingPayload: LoadTaxMasterListingPayload
  ): Observable<LoadTaxMasterListingSuccessPayload> {
    const url = getTaxMasterListingUrl(
      loadTaxMasterListingPayload.pageIndex,
      loadTaxMasterListingPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => TaxMasterAdaptor.getTaxMasterDetailsListing(data))
      );
  }

  getTaxMasterDetailsByTaxMasterCode(
    taxMasterCode: string
  ): Observable<TaxMasterDetails> {
    const url = getTaxMasterDetailsUrl(taxMasterCode);
    return this.apiService.get(url.path).pipe(
      map(data => TaxMasterAdaptor.getTaxMasterDetails(data))
    );
  }

  saveTaxMasterFormDetails(
    taxMasterForm: TaxMasterDetails
  ): Observable<TaxMasterDetails> {
    const url = getSaveTaxMasterFormUrl();
    return this.apiService.post(url.path, taxMasterForm).pipe(
      map(data => TaxMasterAdaptor.getTaxMasterDetails(data))
    );
  }

  editTaxMasterFormDetails(
    taxMasterForm: TaxMasterDetails
  ): Observable<TaxMasterDetails> {
    const edit = {
      description: taxMasterForm.description,
      isActive: taxMasterForm.isActive
    };
    const url = getEditTaxMasterFormUrl(taxMasterForm.taxCode);
    return this.apiService.patch(url.path, edit).pipe(
      map(data => TaxMasterAdaptor.getTaxMasterDetails(data))
    );
  }





  // getProductCategorySearchResult(productCategoryCode: string): Observable<ProductCategoryDetails[]> {
  //   const url = getProductCategoryByProductCategoryCodeUrl(productCategoryCode);
  //   return this.apiService.get(url).pipe(map(data => ProductCategoryAdaptor.getProductCategoryDetailsSearch(data)));
  // }

  // saveProductCategoryFormDetails(saveForm: SaveProductCategoryFormDetailsPayload) {
  //   const url = getProductCategorySaveFormDetailsUrl();
  //   return this.apiService.post(url, saveForm);
  // }

  // editProductCategoryFormDetails(editedForm: SaveProductCategoryFormDetailsPayload) {
  //   const url = getProductCategoryByProductCategoryCodeUrl(editedForm.productCategoryCode);
  //   return this.apiService.put(url, editedForm);
  // }
}
