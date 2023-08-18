import {
  RequestList,
  BoutiqueList,
  ItemList,
  LoadIBTHistoryItemsResponse,
  IBThistoryHeaderPayload
} from '@poss-web/shared/models';
import { InterBoutiqueTransferAdaptor } from '../ibt/inter-boutique-transfer.adaptor';

export class InterBoutiqueTransferHelper {
  static getRequestList(data: any): RequestList[] {
    if (!data && data.results && data.results.length === 0) {
      return null;
    }
    const requestList: RequestList[] = [];
    for (const request of data.results) {
      requestList.push(
        InterBoutiqueTransferAdaptor.requestFromJson(request, data)
      );
    }
    return requestList;
  }

  static getBoutiqueList(data: any): BoutiqueList[] {
    if (!data && data.results && data.results.length === 0) {
      return null;
    }
    const boutiqueList: BoutiqueList[] = [];
    for (const boutique of data.results) {
      boutiqueList.push(
        InterBoutiqueTransferAdaptor.boutiqueFromJson(boutique, data)
      );
    }
    return boutiqueList;
  }

  static getItemList(
    data: any,
    studdedProductGroups: string[] = []
  ): ItemList[] {
    if (!data && data.results && data.results.length === 0) {
      return null;
    }
    const itemList: ItemList[] = [];
    for (const item of data.results) {
      itemList.push(
        InterBoutiqueTransferAdaptor.itemFromJson(item, studdedProductGroups)
      );
    }
    return itemList;
  }
  static getHistoryItemList(
    data: any,
    studdedProductGroups: string[] = []
  ): LoadIBTHistoryItemsResponse {
    const items: IBThistoryHeaderPayload[] = [];
    for (const item of data.results) {
      items.push(InterBoutiqueTransferAdaptor.historyFromJson(item));
    }
    return {
      items: items,
      count: data.totalElements
    };
  }
}
