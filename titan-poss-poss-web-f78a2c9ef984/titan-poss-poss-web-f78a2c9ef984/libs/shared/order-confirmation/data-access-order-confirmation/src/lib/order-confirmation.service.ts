import { Injectable } from '@angular/core';
import {
  CashMemoDetailsResponse,
  UpdateOrderDetails
} from '@poss-web/shared/models';
import { CashMemoAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getorderServiceEndPointUrl,
  getAdvanceBookingActionUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class OrderConfirmationService {
  constructor(private apiService: ApiService) {}

  //confirm cash memo

  updateOrder(
    details: UpdateOrderDetails
  ): Observable<CashMemoDetailsResponse> {
    if (details.actionType) {
      const partialUpdateCashMemoUrl = getAdvanceBookingActionUrl(
        details.transactionType,
        details.subTransactionType,
        details.cashMemoId,
        details.actionType
      );
      return this.apiService
        .patch(
          partialUpdateCashMemoUrl.path,
          details.orderDetails,
          partialUpdateCashMemoUrl.params
        )
        .pipe(
          map((data: any) =>
            CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
          )
        );
    } else {
      const apiPath = getorderServiceEndPointUrl(
        details.transactionType,
        details.subTransactionType,
        details.cashMemoId,
        details.status
      );
      return this.apiService
        .put(apiPath.path, details.orderDetails, apiPath.params)
        .pipe(
          map((data: any) =>
            CashMemoAdaptor.cashMemoDetailsResponseFromJson(data)
          )
        );
    }
  }
}
