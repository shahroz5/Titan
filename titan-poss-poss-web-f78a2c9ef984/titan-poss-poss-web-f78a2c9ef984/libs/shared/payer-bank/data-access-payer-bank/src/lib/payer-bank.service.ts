import { Injectable } from '@angular/core';
import {
  ApiService,
  loadPayerBanksUrl,
  searchPayerBankUrl,
  getFileUploadCommonUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PayerBanksPayload } from '@poss-web/shared/models';
import { PayerBankAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class PayerBankService {
  constructor(private apiService: ApiService) {}
  fileUpload(file: FormData): Observable<any> {
    const url = getFileUploadCommonUrl('PAYER_BANK');
    return this.apiService
      .postFile(url.path, file, url.params)
      .pipe(map((data: any) => PayerBankAdaptor.getFileResponse(data)));
  }
  loadPayerBanks(payload: PayerBanksPayload) {
    const url = loadPayerBanksUrl(payload.pageIndex, payload.pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PayerBankAdaptor.getPayerBanks(data)));
  }
  searchPayerBanks(payerBankName: string) {
    const url = searchPayerBankUrl(payerBankName);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => PayerBankAdaptor.getSearchResult(data)));
  }
}
