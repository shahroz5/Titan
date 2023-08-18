import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BankDetailsReqPayload, BoutiqueBankDepositResponse, CashDenomition, PendingDatesPayload } from '@poss-web/shared/models';
import { BoutiqueBankDepositAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getBankDepositDetailsUrl,
  getDepositAmountByPifNo,
  getPendingDatesUrl,
  getSaveBoutiqueBankDepositDetails,
  getSaveDenomitionUrl,
  getServicePossPendingDatesUrl
} from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

@Injectable()
export class BoutiqueBankDepositService {
  constructor(private apiService: ApiService) { }
  loadBankDepositDetails(payload: BankDetailsReqPayload): Observable<BoutiqueBankDepositResponse> {
    let url: { path: string; params: HttpParams };
    url = getBankDepositDetailsUrl(
      payload.pageIndex, 
      payload.pageSize, 
      payload.paymentMode,
      payload.sort
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          BoutiqueBankDepositAdaptor.getBoutiqueBankDepositDetails(data, payload.selectedRowId)
        )
      );
  }
  saveBankDepostDetails(payload: any) {
    const url = getSaveBoutiqueBankDepositDetails();
    return this.apiService
      .patch(url, payload)
      .pipe(
        map(data =>
          BoutiqueBankDepositAdaptor.getSaveDepositDetailsResponse(data)
        )
      );
  }
  saveCashDenomiton(savePayload: CashDenomition) {
    const url = getSaveDenomitionUrl();
    return this.apiService.post(url, savePayload);
  }
  loadPendingGHSDates(payload: PendingDatesPayload) {
    let ghsPendingDates;
    if(payload.isGHSMandatory === 'true'){
      const url = getPendingDatesUrl();
      return this.apiService
        .get(url)
        .pipe(map(data => (ghsPendingDates = data.ghsPendingUploadDates)))
        .pipe(
          concatMap(data =>{
            if(payload.isServiceMandatory === 'true'){
              const url = getServicePossPendingDatesUrl();
              return this.apiService
                  .get(url)
                  .pipe(map(data => BoutiqueBankDepositAdaptor.getPendingDates(ghsPendingDates, data.servicePendingUploadDates)));
            } else {
              return of(BoutiqueBankDepositAdaptor.getPendingDates(ghsPendingDates));
            }
          })
      )
    } else {
      if(payload.isServiceMandatory === 'true'){
        const url = getServicePossPendingDatesUrl();
        return this.apiService
          .get(url)
          .pipe(map(data => BoutiqueBankDepositAdaptor.getPendingDates(null, data.servicePendingUploadDates)));
      } else{
        return null;
      }
    }
  }
  loadDepositAmountByPifNo(payload: any) {
    const url = getDepositAmountByPifNo();
    return this.apiService
      .post(url, payload)
      .pipe(
        map(data =>
          BoutiqueBankDepositAdaptor.getDepositAmountByPifNo(data)
        )
      );
  }
}
