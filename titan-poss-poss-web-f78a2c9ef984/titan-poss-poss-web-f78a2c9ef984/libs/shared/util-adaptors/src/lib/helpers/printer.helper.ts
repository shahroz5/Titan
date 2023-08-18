import {
  TransactionDetails,
  TransactionIdsResponse
} from '@poss-web/shared/models';
import { Observable } from 'rxjs';
import { ToolbarAdaptor } from '../toolbar/toolbar.adaptor';
export class PrinterHelper {
  static transformData(data: any, printer: any): any {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onload = () => {
      return {
        blob: reader.result.toString().split(',')[1],
        printerName: data[1]
      };
    };
  }

  static readFile(
    data: any,
    printer: any
  ): Observable<{ blob: any; printerName: string }> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = e => {
        observer.next({
          blob: reader.result.toString().split(',')[1],
          printerName: printer
        });

        observer.complete();
      };
      reader.onerror = e => observer.error(e);
      reader.readAsDataURL(data);

      return () => {
        if (reader.readyState === 1) {
          reader.abort();
        }
      };
    });
  }

  static getTransactionDetails(data: any): TransactionDetails {
    if (!data) {
      return null;
    }
    const transactionDetails: TransactionDetails[] = [];
    for (const transaction of data.results) {
      transactionDetails.push(
        ToolbarAdaptor.transactionDetailsFromJson(transaction, data)
      );
    }
    return transactionDetails[0];
  }

  static getTransactionIds(data: any): TransactionIdsResponse {
    if (!data) {
      return null;
    }
    let transactionIdsResponse: TransactionIdsResponse = null;
    const nonHomeBankTransactionIds: string[] = [];
    const homeBankTransactionIds: string[] = [];

    for (const id of data.nonHomeBank.transactionIds) {
      nonHomeBankTransactionIds.push(id);
    }
    for (const id of data.homeBank.transactionIds) {
      homeBankTransactionIds.push(id);
    }

    transactionIdsResponse = {
      homeBankIds: homeBankTransactionIds,
      nonHomeBankIds: nonHomeBankTransactionIds
    };
    return transactionIdsResponse;
  }
}
