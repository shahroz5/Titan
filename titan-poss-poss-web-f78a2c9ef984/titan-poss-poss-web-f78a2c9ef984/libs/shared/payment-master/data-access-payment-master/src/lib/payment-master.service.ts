import { Injectable } from '@angular/core';
import {
  ApiService,
  getPaymentMasterUrl,
  getSavePaymentMasterUrl,
  getUpdatePaymentMasterUrl,
  getLoadPaymentMasterByPaymentCodeUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import { PaymentMasterAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class PaymentMasterService {
  constructor(private apiService: ApiService) {}
  getPaymentMasterList(pageIndex: number, pageSize: number) {
    const url = getPaymentMasterUrl(pageIndex, pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PaymentMasterAdaptor.getPaymentMasterList(data)));
  }

  loadPaymentMasterByPaymentCode(paymentCode) {
    const url = getLoadPaymentMasterByPaymentCodeUrl(paymentCode);
    return this.apiService
      .get(url)
      .pipe(
        map(data =>
          PaymentMasterAdaptor.getPaymentMasterDataByPaymentCode(data)
        )
      );
  }
  savePaymentMaster(paymentGroup: string, savePaymentMasterPayload: any) {
    const url = getSavePaymentMasterUrl(paymentGroup);
    return this.apiService.post(url.path, savePaymentMasterPayload, url.params);
  }

  updatePaymentMaster(paymentCode: string, paymentGroup: string, data: any) {
    const url = getUpdatePaymentMasterUrl(paymentCode, paymentGroup);
    return this.apiService.patch(url.path, data, url.params);
  }

  searchPaymentMaster(paymentCode) {
    const url = getLoadPaymentMasterByPaymentCodeUrl(paymentCode);
    return this.apiService
      .get(url)
      .pipe(map(data => PaymentMasterAdaptor.getSearchResult(data)));
  }
}
