import { Injectable } from '@angular/core';
import {
  WalkInsCustomerVisitDetails,
  WalkInsDetailsHistoryApiResponse,
  WalkInsDetailsHistoryResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class WalkInsAdaptor {


  // static getConversionCount(
  //   data: ConversionCountResponse
  // ): WalkInsConversionCount {
  //   if (!data) {
  //     return null;
  //   }
  //   return {
  //     conversions: data.conversions
  //   };
  // }
  static getWalkInsHistoryData(
    data: WalkInsDetailsHistoryApiResponse,
    dateFormat: string
  ) {
    if (
      !data ||
      (data && !data.results) ||
      (data && data.results && data.results.length < 1)
    ) {
      return [];
    } else {
      const responseData: WalkInsDetailsHistoryResponse[] = [];
      data.results.forEach(record => {
        responseData.push({
          businessDate: record.businessDate
            ? moment(record.businessDate).format(dateFormat)
            : null,
          noOfInvoice: record.noOfInvoice,
          nonPurchaserCount: record.nonPurchaserCount,
          purchaserCount: record.purchaserCount,
          walkins: record.walkins
        });
      });
      return responseData;
    }
  }

  static getWalkInsCustomerVisitDetails(data): WalkInsCustomerVisitDetails {
    if (!data) {
      return null;
    } else {
      return {
        date: data.date,
        invoices: data.invoices,
        purchasers: data.purchasers
      };
    }
  }
}
