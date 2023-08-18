import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import {
  ApiService,
  getBaseCurrencyUrl,
  getCopyLocationUrl,
  getLocationCFAListUrl,
  getLocationDetailsByLocationCodeUrl,
  getLocationListUrl,
  getLocationStateUrl,
  getLocationTownUrl,
  getMarketCodeListUrl,
  getSaveLocationDetailsUrl,
  getSearchLocationByLocationCode
} from '@poss-web/shared/util-api-service';
import {
  LocationListingPayload,
  LocationMasterDetails,
  LocationMasterDropdownList,
  LovMasterEnum
} from '@poss-web/shared/models';

import {
  LocationAdpator,
  LocationMasterAdpator
} from '@poss-web/shared/util-adaptors';
import {
  BrandDataService,
  LovDataService,
  RegionDataService
} from '@poss-web/shared/masters/data-access-masters';

@Injectable()
export class LocationMasterService {
  constructor(
    private apiService: ApiService,
    private lovService: LovDataService,
    private brandDataService: BrandDataService,
    private regionDataService: RegionDataService
  ) {}

  getLocationListing(
    pageIndex: number,
    pageSize: number
  ): Observable<LocationListingPayload> {
    const url = getLocationListUrl(pageIndex, pageSize);

    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => LocationMasterAdpator.getLocationListingDetails(data)));
  }

  searchLocationByLocationCode(locationCode: string) {
    const url = getSearchLocationByLocationCode(locationCode);

    return this.apiService
      .get(url.path)
      .pipe(map(data => LocationMasterAdpator.getSearchResult(data)));
  }

  copyLocationDetail(
    sourceLocationCode: string,
    destinationLocationCode: string
  ) {
    const url = getCopyLocationUrl(sourceLocationCode, destinationLocationCode);
    return this.apiService.post(url.path, null, url.params);
  }

  getLocationDetails(locationCode: string): Observable<LocationMasterDetails> {
    if (locationCode === 'NEW') {
      return of(LocationMasterAdpator.getNewLocationMasterDetails());
    }
    const url = getLocationDetailsByLocationCodeUrl(locationCode);

    const locationDetals = this.apiService
      .get(url.path)
      .pipe(map(data => LocationMasterAdpator.getLocationMasterDetails(data)));

    return locationDetals;
  }

  saveLocationDetails(
    formData: LocationMasterDetails
  ): Observable<LocationMasterDetails> {
    const url = getSaveLocationDetailsUrl();

    const locationDetals = this.apiService
      .post(url.path, formData)
      .pipe(map(data => LocationMasterAdpator.getLocationMasterDetails(data)));

    return locationDetals;
  }

  updateLocationDetails(
    formData: LocationMasterDetails
  ): Observable<LocationMasterDetails> {
    const url = getLocationDetailsByLocationCodeUrl(formData.locationCode);

    const locationDetals = this.apiService
      .patch(url.path, formData)
      .pipe(map(data => LocationMasterAdpator.getLocationMasterDetails(data)));

    return locationDetals;
  }

  // Dropdown
  getLocationSize() {
    // return of([
    //   { id: 'LF', name: 'LFS (Large format store)' },
    //   { id: 'MF', name: 'RFS (Regular format store)' },
    //   { id: 'SF', name: 'SFS (Small format store)' },
    //   { id: 'MICF', name: 'MICF' }
    // ]);

    const lovType = LovMasterEnum.LOCATIONFORMAT;
    return this.lovService
      .getLocationLovs(lovType)
      .pipe(map(data => LocationAdpator.getLocationFormat(data)));
  }

  getInvoiceType() {
    // return of([
    //   { id: 'RETAIL INVOICE', name: 'Retail Invoice' },
    //   { id: 'TAX INVOICE', name: 'Tax Invoice' }
    // ]);

    const lovType = LovMasterEnum.INVOICE_TYPE;
    return this.lovService
      .getPaymentLovs(lovType)
      .pipe(map(data => LocationAdpator.getLocationFormat(data)));
  }

  getCountryCode() {
    return of([{ id: 'IND', name: 'INDIA' }]);
  }

  getRefundMode() {
    // return of([
    //   { id: 'CHEQUE', name: 'Cheque' },
    //   { id: 'RO', name: 'RO' },
    //   { id: 'CASHBACK OFFER', name: 'Cashback offer' }
    // ]);

    const lovType = LovMasterEnum.REFUND_PAYMENT_MODE;
    return this.lovService
      .getPaymentLovs(lovType)
      .pipe(map(data => LocationAdpator.getLocationFormat(data)));
  }

  getLocationTypes() {
    const lovType = LovMasterEnum.LOCATIONTYPE;
    return this.lovService
      .getLocationLovs(lovType)
      .pipe(map(data => LocationAdpator.getLocationFormat(data)));
  }

  getLocationCFAList() {
    const url = getLocationCFAListUrl();
    const body = {
      locationTypes: ['CFA']
    };
    return this.apiService
      .post(url.path, body, url.params)
      .pipe(map(data => LocationAdpator.getLocationCFAList(data)));
  }

  getPersonalTownsData(stateId?: string) {
    const url = getLocationTownUrl(stateId);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => LocationAdpator.getLocationTowns(data)));
  }

  getPersonalStatesData(countryId?: string) {
    const url = getLocationStateUrl(countryId);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => LocationAdpator.getLocationStates(data)));
  }

  getOwnerTypeList() {
    const lovType = LovMasterEnum.OWNERTYPE;
    return this.lovService
      .getLocationLovs(lovType)
      .pipe(map(data => LocationAdpator.getLocationFormat(data)));
  }

  getMarketCodeData() {
    const url = getMarketCodeListUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => LocationAdpator.getMarketList(data)));
  }

  getBaseCurrencyData() {
    const url = getBaseCurrencyUrl();
    return this.apiService
      .get(url.path)
      .pipe(map(data => LocationAdpator.getBaseCurrency(data)));
  }

  getCurrencyDetails() {
    // const url = getCurrencyDetailsUrl();
    // return this.apiService
    //   .get(url)
    //   .pipe(map(data => LocationAdpator.getCurrency(data)));

    return of([
      {
        id: 'INR',
        name: 'INR',
        selected: true
      }
    ]);
  }

  getRegionSummary(): Observable<LocationMasterDropdownList[]> {
    return this.regionDataService
      .getRegionSummary(false, null)
      .pipe(map(data => LocationMasterAdpator.getRegionList(data)));
  }

  getBrandSummary(): Observable<LocationMasterDropdownList[]> {
    return this.brandDataService
      .getBrandSummary(false)
      .pipe(map(data => LocationMasterAdpator.getBrandList(data)));
  }
}
