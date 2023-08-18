import {
  OtherReceiptItem,
  OtherReceiptsModel,
  OtherReceiptsDataModel
} from '@poss-web/shared/models';
import { OtherReceiptsAdaptor } from '../other-receipts/other-receipts.adaptors';

export class OtherReceiveItemHelper {
  static getItems(
    data: any,
    studded: string[] = []
  ): { items: OtherReceiptItem[]; count: number } {
    const items: OtherReceiptItem[] = [];
    for (const item of data.results) {
      items.push(OtherReceiptsAdaptor.OtherReceiptItemfromJson(item, studded));
    }

    return { items, count: data.totalElements };
  }
  static getStockTransferNotes(data: any): OtherReceiptsModel[] {
    const stockTransferNotes: OtherReceiptsModel[] = [];
    for (const stockTransferNote of data) {
      stockTransferNotes.push(
        OtherReceiptsAdaptor.OtherReceiptsDatafromJson(stockTransferNote)
      );
    }
    return stockTransferNotes;
  }
  static getOtherReceiptsData(data: any): OtherReceiptsDataModel {
    const otherReceiptsData: OtherReceiptsDataModel = new OtherReceiptsDataModel();
    otherReceiptsData.totalElements = data.totalElements;
    for (const OtherIssue of data.results) {
      otherReceiptsData.receiptsData.push(
        OtherReceiptsAdaptor.OtherReceiptsDatafromJson(OtherIssue)
      );
    }
    return otherReceiptsData;
  }
}
