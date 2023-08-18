import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ApiService,
  getAllPaymentCategoryListingUrl,
  getPaymentCategoryDetailsUrl,
  savePaymentCategoryDetailsUrl,
  getPaymentCategoryMappingUrl
} from '@poss-web/shared/util-api-service';
import {
  CPGProductGroupConfigForQCGCListingResult,
  LoadCPGProductGroupConfigForQCGCListingPayload,
  CPGProductGroupConfigForQCGCDetails,
  CPGProductGroupConfigForQCGCConstants,
  ProductGroupMappingOption,
  CPGProductGroupConfigForQCGCMapping
} from '@poss-web/shared/models';
import { CPGProductGroupConfigForQCGCAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class CPGQCGCMapService {
  constructor(private apiService: ApiService) {}

  getCPGProductGroupConfigurationList(
    params: LoadCPGProductGroupConfigForQCGCListingPayload
  ): Observable<CPGProductGroupConfigForQCGCListingResult> {
    const url = getAllPaymentCategoryListingUrl(
      params.pageIndex,
      params.pageSize,
      params.searchData
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          CPGProductGroupConfigForQCGCAdaptor.getCPGProductGroupConfigForQCGCListing(
            data
          )
        )
      );
  }

  getCPGProductGroupConfigurationDetails(
    params: string
  ): Observable<CPGProductGroupConfigForQCGCDetails> {
    if (params === CPGProductGroupConfigForQCGCConstants.NEW) {
      return of(
        CPGProductGroupConfigForQCGCAdaptor.getCPGProductGroupConfigForQCGCDetailsNew()
      );
    }
    const url = getPaymentCategoryDetailsUrl(params);
    return this.apiService
      .get(url.path)
      .pipe(
        map(data =>
          CPGProductGroupConfigForQCGCAdaptor.getCPGProductGroupConfigForQCGCDetails(
            data
          )
        )
      );
  }
  saveCPGProductGroupConfigurationDetails(
    params: CPGProductGroupConfigForQCGCDetails
  ): Observable<CPGProductGroupConfigForQCGCDetails> {
    const url = savePaymentCategoryDetailsUrl();
    return this.apiService
      .post(url.path, params)
      .pipe(
        map(data =>
          CPGProductGroupConfigForQCGCAdaptor.getCPGProductGroupConfigForQCGCDetails(
            data
          )
        )
      );
  }

  editCPGProductGroupConfigurationDetails(
    params: CPGProductGroupConfigForQCGCDetails
  ): Observable<CPGProductGroupConfigForQCGCDetails> {
    const url = getPaymentCategoryDetailsUrl(params.paymentCategoryName);
    const formData: CPGProductGroupConfigForQCGCDetails = { ...params };
    delete formData.paymentCategoryName;
    return this.apiService
      .patch(url.path, formData)
      .pipe(
        map(data =>
          CPGProductGroupConfigForQCGCAdaptor.getCPGProductGroupConfigForQCGCDetails(
            data
          )
        )
      );
  }

  getCPGProductGroupConfigurationMapping(
    params: string
  ): Observable<ProductGroupMappingOption[]> {
    const url = getPaymentCategoryMappingUrl(params);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          CPGProductGroupConfigForQCGCAdaptor.getCPGProductGroupConfigForQCGCMapping(
            data
          )
        )
      );
  }

  saveCPGProductGroupConfigurationMapping(
    params: CPGProductGroupConfigForQCGCMapping,
    id: string
  ): Observable<ProductGroupMappingOption[]> {
    const url = getPaymentCategoryMappingUrl(id);
    return this.apiService
      .patch(url.path, params)
      .pipe(
        map(data =>
          CPGProductGroupConfigForQCGCAdaptor.getCPGProductGroupConfigForQCGCSaveMapping(
            data
          )
        )
      );
  }
}
