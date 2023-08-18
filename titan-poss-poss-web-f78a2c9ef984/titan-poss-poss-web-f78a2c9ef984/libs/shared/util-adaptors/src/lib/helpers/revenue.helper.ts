import { RevenueDataAdaptor } from '../revenue/revenue.adaptor';
import {
  BankDepositResponse,
  BankDepositResult,
  RevenueResponse,
  RevenueResult,
  TodayRevenueResponse,
  TodayRevenueResult,
  TransactionIds
} from '@poss-web/shared/models';
import { BankDepositAdaptor } from '../bank-deposit/bank-deposit.adaptor';

export class RevenueHelper {
  static getDaywiseRevenue(data: any): RevenueResponse {
    const revenues: RevenueResult[] = [];
    for (const item of data.results) {
      revenues.push(RevenueDataAdaptor.dayWiseRevenueFromJson(item));
    }
    return { revenues, totalRevenues: data.totalElements };
  }

  static getTodayRevenue(data: any): TodayRevenueResponse {
    const results: TodayRevenueResult[] = [];
    for (const item of data.results) {
      results.push(RevenueDataAdaptor.todayRevenueFromJson(item));
    }

    return { results };
  }
  
  static getBankDeposit(data: any): BankDepositResponse {
    const results: BankDepositResult[] = [];
    for (const item of data.results) {
      results.push(BankDepositAdaptor.BankDepositFromJson(item));
    }
    return { results, totalElements: data.totalElements };
  }

  static getTransactionIds(data: any): any {
    if (!data) {
      return null;
    }
    const transacionIdDetails: TransactionIds[] = [];

    for (const transactionIds of data.result) {
      transacionIdDetails.push(transactionIds);
    }
    return transacionIdDetails;
  }
}
