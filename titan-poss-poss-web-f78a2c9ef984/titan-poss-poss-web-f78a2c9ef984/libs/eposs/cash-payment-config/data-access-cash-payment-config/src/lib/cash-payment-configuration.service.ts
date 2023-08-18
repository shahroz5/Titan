import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, getCashPaymentConfigurationUrl, getAddNewCashPaymentConfigurationUrl } from '@poss-web/shared/util-api-service';
import { CashPaymentConfiguration } from '@poss-web/shared/models';
import { CashPaymentConfigurationAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class CashPaymentConfigurationService {

  constructor(private apiService: ApiService) { }

  getCashPaymentConfigurationDetails(ruleId: number): Observable<CashPaymentConfiguration> {
    const url = getCashPaymentConfigurationUrl(ruleId);
    return this.apiService
      .get(url)
      .pipe(
        map(data => CashPaymentConfigurationAdaptor.getCashPaymentConfigurationDetails(data))
      );
  }

  addNewCashPaymentConfigurationDetails(cashPaymentConfigurationForm: CashPaymentConfiguration): Observable<CashPaymentConfiguration> {
    const url = getAddNewCashPaymentConfigurationUrl();

    const formData = {
      isActive: cashPaymentConfigurationForm.isActive,
      ruleDetails: {
        data: cashPaymentConfigurationForm.ruleDetails.data,
        type: cashPaymentConfigurationForm.ruleDetails.type
      }
    };

    return this.apiService
      .post(url, formData)
      .pipe(
        map(data => CashPaymentConfigurationAdaptor.getCashPaymentConfigurationDetails(data))
      );
  }

  editCashPaymentConfigurationDetails(ruleId: number, cashPaymentConfigurationForm: CashPaymentConfiguration): Observable<CashPaymentConfiguration> {
    const url = getCashPaymentConfigurationUrl(ruleId);

    const formData = {
      isActive: cashPaymentConfigurationForm.isActive,
      ruleDetails: {
        data: cashPaymentConfigurationForm.ruleDetails.data,
        type: cashPaymentConfigurationForm.ruleDetails.type
      }
    };

    return this.apiService
      .patch(url, formData)
      .pipe(
        map(data => CashPaymentConfigurationAdaptor.getCashPaymentConfigurationDetails(data))
      );
  }
}
