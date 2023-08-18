import { Injectable } from '@angular/core';
import {
  ApiService,
  getPendingFocCMUrl,
  confirmPendingFocUrl,
  getPendingFocSchemesUrl,
  getFocItemsDetailsUrl,
  getCurrentConfiguredFOCSchemesUrl,
  getFocSchemesAndItemsUrl,
  getFocToCmUrl,
  getABFocSchemesUrl,
  getSelectedABFocSchemesUrl,
  getDeleteABFocSchemesUrl,
  getManualFocItemUrl,
  validateManualFocUrl,
  getManualFocToCmUrl,
  verifyManualFocUrl,
  getManualFocToCmGetUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadPendingCMPayload,
  LoadFocItemDetailsPayload,
  IssuepPendingFocPayload,
  FocSchemeRequestDto,
  AddFocToCMPayload,
  KeepFocPendingPayload,
  OrderDetailsForFOC,
  ValidateManualFocPayload,
  AddManualFocToCMPayload,
  VerifyManualFocPayload
} from '@poss-web/shared/models';
import { FocAdaptor, FocHelper } from '@poss-web/shared/util-adaptors';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FocService {
  constructor(private apiService: ApiService) {}

  getPendingCM(payload: LoadPendingCMPayload) {
    const url = getPendingFocCMUrl(
      payload.txnType,
      payload.subTxnType,
      payload.fiscalYear,
      payload.customerId,
      payload.docNo,
      payload.transactionId,
      payload.status
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => FocHelper.getPendingCM(data)));
  }

  getFocSchemes(id: string, subTxnType: string, txnType: string) {
    const url = getPendingFocSchemesUrl(txnType, subTxnType, id);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data));
  }

  getFocItemDetails(payload: LoadFocItemDetailsPayload) {
    const url = getFocItemsDetailsUrl();
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map((data: any) => FocHelper.getFOCItemsDetails(data.results)));
  }
  issuePendingFOC(payload: IssuepPendingFocPayload) {
    const url = confirmPendingFocUrl(
      payload.refTxnId,
      payload.subTxnType,
      payload.txnType
    );
    return this.apiService
      .post(url.path, payload.payload, url.params)
      .pipe(map((data: any) => FocAdaptor.issuePendingFOC(data)));
  }

  getConfiguredSchemes() {
    const url = getCurrentConfiguredFOCSchemesUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => FocHelper.getFocConfiguredSchemes(data.results))
      );
  }
  getSchemesAndItems(payload: FocSchemeRequestDto) {
    const url = getFocSchemesAndItemsUrl(payload);
    return this.apiService
      .post(url.path, payload.payload, url.params)
      .pipe(map((data: any) => data.results));
  }

  getManualFocItem(mobileNumber: string) {
    const url = getManualFocItemUrl(mobileNumber);
    return this.apiService
      .post(url.path, null, url.params)
      .pipe(map((data: any) => data.results));
  }

  validateManualFoc(requestPayload: ValidateManualFocPayload) {
    const url = validateManualFocUrl(requestPayload);
    return this.apiService
      .post(url.path, null, url.params)
      .pipe(map((data: any) => data));
  }

  verifyManualFoc(requestPayload: VerifyManualFocPayload) {
    const url = verifyManualFocUrl();
    return this.apiService.post(url.path, requestPayload, url.params);
  }

  addFocToCM(payload: AddFocToCMPayload) {
    const url = getFocToCmUrl(payload.id, payload.subTxnType, payload.txnType);
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map((data: any) => data.results));
  }

  addManualFocToCM(payload: AddManualFocToCMPayload) {
    const url = getManualFocToCmUrl(
      payload.id,
      payload.subTxnType,
      payload.txnType,
      payload.approvedBy,
      payload.manualFocStartDate,
      payload.manualFocEndDate
    );
    return this.apiService
      .post(url.path, payload, url.params)
      .pipe(map((data: any) => data.results));
  }

  deleteFOC(id: string, subTxnType: string, txnType: string) {
    const url = getFocToCmUrl(id, subTxnType, txnType);
    return this.apiService.delete(url.path, url.params);
  }

  getAssignedFOC(id: string, subTxnType: string, txnType: string) {
    const url = getFocToCmUrl(id, subTxnType, txnType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.results));
  }

  getAssignedManualFOC(id: string, subTxnType: string, txnType: string) {
    const url = getManualFocToCmGetUrl(id, subTxnType, txnType);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.results));
  }
  keepFocPending(payload: KeepFocPendingPayload) {
    const url = getPendingFocSchemesUrl(
      payload.txnType,
      payload.subTxnType,
      payload.id
    );
    return this.apiService
      .post(url.path, { focSchemes: payload.focSchemes }, url.params)
      .pipe(map((data: any) => data.focSchemeIds));
  }

  getABFOCSchemes(payload: FocSchemeRequestDto) {
    const url = getABFocSchemesUrl();
    return this.apiService
      .post(url.path, payload.payload, url.params)
      .pipe(
        map((data: any) =>
          FocHelper.getFOCSchemesAndItemsFromJson(data.results)
        )
      );
  }

  getSelectedABFOCSchemes(payload: OrderDetailsForFOC) {
    const url = getSelectedABFocSchemesUrl(
      payload.id,
      payload.txnType,
      payload.subTxnType
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          FocHelper.getABFOCSchemesDetailsFromJson(data.results)
        )
      );
  }

  getSaveABFOCSchemes(payload: OrderDetailsForFOC) {
    const url = getSelectedABFocSchemesUrl(
      payload.id,
      payload.txnType,
      payload.subTxnType
    );
    return this.apiService
      .post(url.path, payload.requestPayload, url.params)
      .pipe(map((data: any) => FocHelper.getABFOCSchemesDetailsFromJson(data)));
  }

  getDeleteABFOCSchemes(payload: OrderDetailsForFOC) {
    const url = getDeleteABFocSchemesUrl(
      payload.txnType,
      payload.subTxnType,
      payload.id,
      payload.focSchemeId
    );
    return this.apiService
      .delete(url.path, url.params)
      .pipe(map((data: any) => data));
  }
}
