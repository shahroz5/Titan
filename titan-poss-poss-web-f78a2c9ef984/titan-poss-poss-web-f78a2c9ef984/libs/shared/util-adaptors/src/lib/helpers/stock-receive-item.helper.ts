import { StockReceiveItem } from '@poss-web/shared/models';
import { StockRecevieItemAdaptor } from '../stock-receive/stock-receive-item.adaptor';

export class StockReceiveItemHelper {
  static getItems(
    data: any,
    studdedProductGroups: string[] = []
  ): { items: StockReceiveItem[]; count: number } {
    const items: StockReceiveItem[] = [];
    for (const item of data.results) {
      items.push(StockRecevieItemAdaptor.fromJson(item, studdedProductGroups));
    }
    return { items, count: data.totalElements };
  }
}
