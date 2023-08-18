import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  LoadComplexityPriceGroupListingPayload,
  LoadComplexityPriceGroupListingSuccessPayload,
  SaveComplexityPriceGroupFormPayload,
  EditComplexityPriceGroupFormPayload,
  ComplexityPriceGroupDetails,
  ComplexityPricegroupFilter
} from '@poss-web/shared/models';
import {
  getComplexityPricegroupListingUrl,
  getSaveComplexityPricegroupListingUrl,
  getLoadComplexityCodeUrl,
  getLoadPricegroupUrl,
  ApiService,
  getComplexityPricegroupDetailsByIdUrl,
  getLoadComplexityFileUploadItemsUrl
} from '@poss-web/shared/util-api-service';

import { ComplexityPricegroupAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class ComplexityPricegroupService {
  constructor(private apiService: ApiService) {}

  getComplexityPricegroupDetails(
    loadComplexityPriceGroupListingPayload: LoadComplexityPriceGroupListingPayload,
    complexityCode?: string,
    priceCode?: string
  ): Observable<LoadComplexityPriceGroupListingSuccessPayload> {
    const url = getComplexityPricegroupListingUrl(
      loadComplexityPriceGroupListingPayload.pageIndex,
      loadComplexityPriceGroupListingPayload.pageSize,
      complexityCode,
      priceCode
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          ComplexityPricegroupAdaptor.getComplexityPricegroupDetailsListing(
            data
          )
        )
      );
  }
  getComplexityPricegroupDetailsById(
    id: string
  ): Observable<ComplexityPriceGroupDetails> {
    const url = getComplexityPricegroupDetailsByIdUrl(id);
    return this.apiService
      .get(url)
      .pipe(
        map(data =>
          ComplexityPricegroupAdaptor.getComplexityPricegroupById(data)
        )
      );
  }

  saveComplexityPricegroupFormDetails(
    saveForm: SaveComplexityPriceGroupFormPayload
  ) {
    const url = getSaveComplexityPricegroupListingUrl();
    return this.apiService
      .post(url, saveForm)
      .pipe(
        map(data =>
          ComplexityPricegroupAdaptor.getComplexityPricegroupById(data)
        )
      );
  }

  editComplexityPricegroupFormDetails(
    editedForm: EditComplexityPriceGroupFormPayload
  ) {
    console.log(editedForm);
    const url = getComplexityPricegroupDetailsByIdUrl(editedForm.id);
    return this.apiService.patch(url, editedForm);
  }
  getComplexityCode() {
    const url = getLoadComplexityCodeUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => ComplexityPricegroupAdaptor.getComplexityCode(data)));
  }
  getPricegroup() {
    const url = getLoadPricegroupUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => ComplexityPricegroupAdaptor.getPriceGroup(data)));
  }

  loadFileUploadItems(
    payload: FormData,
  ): Observable<any> {
    const url = getLoadComplexityFileUploadItemsUrl();

    return this.apiService
      .postFile(url, payload)
      .pipe(
        map(data =>
          data
        )
      );

  }
}
