import { StockReceiveStock } from '@poss-web/shared/models';
import { StockReceiveStockAdaptor } from '../stock-receive/stock-receive-stock.adaptor';

export class StockReceiveStockHelper {
  static getStocks(
    data: any,
    typeField: string
  ): { stocks: StockReceiveStock[]; count: number } {
    const stocks: StockReceiveStock[] = [];
    for (const stock of data.results) {
      stocks.push(StockReceiveStockAdaptor.fromJson(stock, typeField));
    }
    return { stocks, count: data.totalElements };
  }
}
