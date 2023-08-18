import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getTransactionTypeMasterDetailsUrl,
} from '@poss-web/shared/util-api-service';
import {
  LoadTransactionTypeMasterListingSuccessPayload,
  TransactionTypeMasterDetails
} from '@poss-web/shared/models';
import { TransactionTypeMasterAdaptor } from '@poss-web/shared/util-adaptors';
import { PaymentDataService } from '@poss-web/shared/masters/data-access-masters';

@Injectable()
export class TransactionTypeMasterService {
  constructor(
    private apiService: ApiService,
    private paymentDataService: PaymentDataService
  ) {}

  getTransactionTypeMasterList(): Observable<
    LoadTransactionTypeMasterListingSuccessPayload
  > {
    return this.paymentDataService
      .getPaymentTransactionTypes(null, false)
      .pipe(
        map(data =>
          TransactionTypeMasterAdaptor.getTransactionTypeMasterListing(data)
        )
      );

    // const url = getTransactionTypeMasterListingUrl();
    // return this.apiService
    //   .get(url.path)
    //   .pipe(
    //     map(data =>
    //       TransactionTypeMasterAdaptor.getTransactionTypeMasterListing(data)
    //     )
    //   );

    // const lovType = 'TRANSACTION_TYPE';
    // return this.lovService
    //   .getPaymentLovs(lovType)
    //   .pipe(
    //     map(data =>
    //       TransactionTypeMasterAdaptor.getTransactionTypeMasterListing(data)
    //     )
    //   );
  }

  getTransactionTypeMasterSearch(
    code: string
  ): Observable<LoadTransactionTypeMasterListingSuccessPayload> {
    return this.paymentDataService
      .getPaymentTransactionTypes(code, false)
      .pipe(
        map(data =>
          TransactionTypeMasterAdaptor.getTransactionTypeMasterListing(data)
        )
      );

    // const url = getTransactionTypeMasterSearchUrl(code);
    // return this.apiService
    //   .get(url.path, url.params)
    //   .pipe(
    //     map(data =>
    //       TransactionTypeMasterAdaptor.getTransactionTypeMasterListing(data)
    //     )
    //   );

    // const lovType = 'TRANSACTION_TYPE';
    // const url = getTransactionTypeMasterDetailsUrl(lovType, code);
    // return this.apiService
    //   .get(url.path, url.params)
    //   .pipe(
    //     map(data =>
    //       TransactionTypeMasterAdaptor.getTransactionTypeMasterListing(
    //         data?.values
    //       )
    //     )
    //   );
  }
  getTransactionTypeMasterByCode(
    code: string
  ): Observable<TransactionTypeMasterDetails> {
    const lovType = 'TRANSACTION_TYPE';
    const url = getTransactionTypeMasterDetailsUrl(lovType, code);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          TransactionTypeMasterAdaptor.getTransactionTypeMasterDetails(data)
        )
      );
  }

/*   saveTransactionTypeMasterFormDetails(
    formData: TransactionTypeMasterDetails
  ): Observable<TransactionTypeMasterDetails> {
    const lovType = 'TRANSACTION_TYPE';
    const save = {
      code: formData.code,
      lovType: lovType,
      value: formData.value,
      isActive: formData.isActive
    };
    const url = getSaveTransactionTypeMasterFormUrl();
    return this.apiService
      .post(url.path, save)
      .pipe(
        map(data =>
          TransactionTypeMasterAdaptor.getSavedTransactionTypeMasterDetails(
            data
          )
        )
      );
  }

  editTransactionTypeMasterFormDetails(
    formData: TransactionTypeMasterDetails
  ): Observable<TransactionTypeMasterDetails> {
    const lovType = 'TRANSACTION_TYPE';
    const edit = {
      values: [
        {
          code: formData.code,
          isActive: formData.isActive,
          value: formData.value
        }
      ]
    };
    const url = getTransactionTypeMasterListingUrl();
    return this.apiService
      .patch(url.path, edit)
      .pipe(
        map(data =>
          TransactionTypeMasterAdaptor.getTransactionTypeMasterDetails(data)
        )
      );
  } */
}
