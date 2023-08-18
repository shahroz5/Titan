import { Injectable } from '@angular/core';
import {
  ApiService,
  getGenerateBoutiquePasswordForManualBillUrl,
  getGenerateBoutiquePasswordForGoldRateUrl,
  getGenerateCashDepostPasswordUrl
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PasswordConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  GenerateBoutiquePasswordForGoldRateResponse,
  GenerateBoutiquePasswordForManualBillRequest,
  GenerateBoutiquePasswordForManualBillResponse,
  GenerateBoutiquePasswordForGoldRateRequest,
  GenerateCashDepositPasswordRequest,
  GenerateCashDepositPasswordResponse
} from '@poss-web/shared/models';

@Injectable()
export class PasswordConfigService {
  constructor(private apiService: ApiService) {}

  generateBoutiquePasswordForManualBill(
    generateBoutiquePasswordDetails: GenerateBoutiquePasswordForManualBillRequest
  ): Observable<GenerateBoutiquePasswordForManualBillResponse> {
    const generateBoutiquePasswordForManualBillUrl = getGenerateBoutiquePasswordForManualBillUrl();
    return this.apiService
      .post(
        generateBoutiquePasswordForManualBillUrl,
        generateBoutiquePasswordDetails
      )
      .pipe(
        map((data: any) =>
          PasswordConfigAdaptor.generateBoutiquePasswordResponseForManualBillFromJson(
            data
          )
        )
      );
  }

  generateBoutiquePasswordForGoldRate(
    generateBoutiquePasswordDetails: GenerateBoutiquePasswordForGoldRateRequest
  ): Observable<GenerateBoutiquePasswordForGoldRateResponse> {
    const generateBoutiquePasswordForGoldRateUrl = getGenerateBoutiquePasswordForGoldRateUrl();
    return this.apiService
      .post(
        generateBoutiquePasswordForGoldRateUrl,
        generateBoutiquePasswordDetails
      )
      .pipe(
        map((data: any) =>
          PasswordConfigAdaptor.generateBoutiquePasswordResponseForGoldRateFromJson(
            data
          )
        )
      );
  }

  generateCashDepositPassword(
    generateCashDepostPasswordDetails: GenerateCashDepositPasswordRequest
  ): Observable<GenerateCashDepositPasswordResponse> {
    const generateCashDepositPasswordUrl = getGenerateCashDepostPasswordUrl();
    return this.apiService
      .post(generateCashDepositPasswordUrl, generateCashDepostPasswordDetails)
      .pipe(
        map((data: any) =>
          PasswordConfigAdaptor.generateCashDepositPasswordResponseFromJson(
            data
          )
        )
      );
  }
}
