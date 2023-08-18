import { ConversionRequestItems, ProductPriceDetails } from '@poss-web/shared/models';
import { CashMemoAdaptor } from '../cash-memo/cash-memo.adaptor';

export class ConversionHelper {
  static getSelectedRequestData(data: any): ConversionRequestItems[] {
    const itemsData: ConversionRequestItems[] = [];
    for (const item of data) {
      // itemsData.push(ConversionAdaptor.SelectedRequestDataFromJson(item))
    }
    return itemsData;
  }
  static getPriceDetails(data: any): ProductPriceDetails[] {
    const response: ProductPriceDetails[] = []
    for (const priceDetails of data) {
      response.push(CashMemoAdaptor.priceDetailsFromJson(priceDetails));
    }
    return response;
  }
}
