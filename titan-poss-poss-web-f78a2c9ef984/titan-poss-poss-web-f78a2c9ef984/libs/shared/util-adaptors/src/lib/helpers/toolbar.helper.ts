import {
  MetalPrice,
  TransactionCount,
  TransactionDetails
} from '@poss-web/shared/models';
import { ToolbarAdaptor } from '../toolbar/toolbar.adaptor';

export class ToolbarHelper {
  static getMetalPriceData(data: any) {
    let metals: MetalPrice[] = [];
    metals = data.results;
    return metals;
  }

  static getTransactionDetails(data: any): TransactionDetails[] {
    if (!data) {
      return null;
    }
    const transactionDetails: TransactionDetails[] = [];
    for (const transaction of data.results) {
      transactionDetails.push(
        ToolbarAdaptor.transactionDetailsFromJson(transaction, data)
      );
    }
    return transactionDetails;
  }

  static getTransactionCount(data: any): TransactionCount[] {
    if (!data) {
      return null;
    }
    const transactionCount: TransactionCount[] = [];
    for (const count of data.results) {
      transactionCount.push(ToolbarAdaptor.transactionCountFromJson(count));
    }
    return transactionCount;
  }
}
