import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getPayeeBankDetailsListingUrl,
  getPayeeBankByBankNameUrl,
  getPayeeBankSaveFormDetailsUrl,
  getPayeeBankGLCodeDetailsUrl,
  savePayeeBankGLCodeDetailsUrl,
  // getLocationCodesUrl,
  getPayeeBankGlCodeDefaults
  // getPayeeGlCodeMappedLocationsUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadPayeeBankListingPayload,
  LoadPayeeBankListingSuccessPayload,
  PayeeBankDetails,
  SavePayeeBankFormPayload,
  SaveGLcodeDetails,
  PayeeBankGLCodePayload,
  PayeeGLCodeDetailsSuccessList,
  GlSelectMappedLocations
} from '@poss-web/shared/models';
import { PayeeBankAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class PayeeBankService {
  constructor(private apiService: ApiService) {}

  getPayeeBankDetails(
    loadPayeeBankListingPayload: LoadPayeeBankListingPayload
  ): Observable<LoadPayeeBankListingSuccessPayload> {
    const url = getPayeeBankDetailsListingUrl(
      loadPayeeBankListingPayload.pageIndex,
      loadPayeeBankListingPayload.pageSize,
      loadPayeeBankListingPayload.description
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PayeeBankAdaptor.getPayeeBankDetailsListing(data)));
  }

  getPayeeBankByBankName(bankName: string): Observable<PayeeBankDetails> {
    if (bankName === 'new') {
      return of(PayeeBankAdaptor.geNewtPayeeBankDetails());
    } else {
      const url = getPayeeBankByBankNameUrl(bankName);
      return this.apiService
        .get(url)
        .pipe(
          map(data => PayeeBankAdaptor.getPayeeBankDetailsBasedOnBankName(data))
        );
    }
  }

  getPayeeBankSearchResult(bankName: string): Observable<PayeeBankDetails[]> {
    const url = getPayeeBankByBankNameUrl(bankName);
    return this.apiService
      .get(url)
      .pipe(map(data => PayeeBankAdaptor.getPayeeBankDetailsSearch(data)));
  }

  savePayeeBankFormDetails(saveForm: SavePayeeBankFormPayload) {
    const url = getPayeeBankSaveFormDetailsUrl();
    return this.apiService.post(url, saveForm);
  }

  editPayeeBankFormDetails(editedForm: SavePayeeBankFormPayload) {
    const url = getPayeeBankByBankNameUrl(editedForm.bankName);
    console.log(editedForm, 'editedForm');

    return this.apiService.patch(url, editedForm);
  }

  getPayeeBankGlCodeDetails(
    payload: PayeeBankGLCodePayload
  ): Observable<PayeeGLCodeDetailsSuccessList> {
    console.log(payload.payloadData.locationCode, 'in service');

    const url = getPayeeBankGLCodeDetailsUrl(
      payload.payloadData.bankName,
      payload.payloadData.paymentCode,
      true,
      payload.pageEvent.pageIndex,
      payload.pageEvent.pageSize
    );
    const locationCodes = { locationCode: payload.payloadData.locationCode };
    console.log(locationCodes, 'locationCodes');

    return this.apiService
      .post(url.path, locationCodes, url.params)
      .pipe(map(data => PayeeBankAdaptor.getGLCodeDetailList(data)));
  }
  savePayeeBankGlCodeDetails(saveData: SaveGLcodeDetails) {
    const url = savePayeeBankGLCodeDetailsUrl(saveData.bankName);
    return this.apiService.patch(url, saveData);
  }
  // getLocationCodes() {
  //   const url = getLocationCodesUrl();
  //   return this.apiService
  //     .post(url)
  //     .pipe(map(data => PayeeBankAdaptor.getLocationCodes(data)));
  // }

  getGlCodeDefaults(payload) {
    console.log(payload, 'payload');
    const url = getPayeeBankGlCodeDefaults();
    return this.apiService
      .post(url, payload)
      .pipe(map(data => PayeeBankAdaptor.getGLCodeDefaultsList(data)));
  }

  getMappedLocations(
    payload: PayeeBankGLCodePayload
  ): Observable<GlSelectMappedLocations[]> {
    const url = getPayeeBankGLCodeDetailsUrl(
      payload.payloadData.bankName,
      payload.payloadData.paymentCode,
      false
    );

    return this.apiService
      .post(url.path, {}, url.params)
      .pipe(map(data => PayeeBankAdaptor.getMappedLocationList(data)));
  }
}
