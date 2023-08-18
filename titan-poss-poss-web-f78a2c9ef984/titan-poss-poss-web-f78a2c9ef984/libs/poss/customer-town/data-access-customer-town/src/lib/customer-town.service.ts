import { Injectable } from '@angular/core';
import {
  LoadCustomerTownListingPayload,
  LoadCustomerTownListingSuccessPayload,
  SaveTownFormDetailsPayload,
  CustomerTown
} from '@poss-web/shared/models';
import {
  ApiService,
  getCustomerTownListingUrl,
  getCustomerTownDetailsByTownCodeUrl,
  getSaveCustomerTownFormDetailsUrl,
  getCustomerTownEditFormDetailsUrl
} from '@poss-web/shared/util-api-service';
import { CustomerTownAdaptor } from '@poss-web/shared/util-adaptors';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomerTownService {
  constructor(private apiService: ApiService) {}

  getCustomerTownDetails(
    loadCustomerTownDetailsPayload: LoadCustomerTownListingPayload,
    townName
  ): Observable<LoadCustomerTownListingSuccessPayload> {
    const url = getCustomerTownListingUrl(
      loadCustomerTownDetailsPayload.pageIndex,
      loadCustomerTownDetailsPayload.pageSize,
      townName
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CustomerTownAdaptor.getCustomerTownDetailsListing(data))
      );
  }

  // getStateDetails(
  //   loadCustomerTownDetailsPayload: LoadCustomerTownListingPayload
  // ): Observable<LoadStateListingSuccessPayload> {
  //   const url = getStateListingUrl(
  //     loadCustomerTownDetailsPayload.pageIndex,
  //     loadCustomerTownDetailsPayload.pageSize
  //   );
  //   return this.apiService
  //     .get(url)
  //     .pipe(map(data => CustomerTownAdaptor.getStateDetailsListing(data)));
  // }

  getTownDetailsByTownCode(townCode: string): Observable<CustomerTown> {
    const url = getCustomerTownDetailsByTownCodeUrl(townCode);
    return this.apiService.get(url);
  }

  saveTownFormDetails(saveForm: SaveTownFormDetailsPayload) {
    console.log(saveForm, 'saveform');

    const url = getSaveCustomerTownFormDetailsUrl();
    return this.apiService.post(url, saveForm);
  }

  editTownFormDetails(editedForm: CustomerTown) {
    const url = getCustomerTownEditFormDetailsUrl(editedForm.townCode);
    return this.apiService.patch(url, editedForm);
  }

  // getRegionDetails(
  //   loadCustomerTownDetailsPayload: LoadCustomerTownListingPayload
  // ): Observable<LoadRegionDetailsListingSuccessPayload> {
  //   const url = getTownRegionListingUrl(
  //     loadCustomerTownDetailsPayload.pageIndex,
  //     loadCustomerTownDetailsPayload.pageSize
  //   );
  //   return this.apiService
  //     .get(url)
  //     .pipe(map(data => CustomerTownAdaptor.getRegionDetailsListing(data)));
  // }

  // searchCustomerTown(townName) {
  //   const url = getTownSearchData(townName);
  //   return this.apiService
  //     .get(url)
  //     .pipe(map(data => CustomerTownAdaptor.getSearchDetailsListing(data)));
  // }
}
