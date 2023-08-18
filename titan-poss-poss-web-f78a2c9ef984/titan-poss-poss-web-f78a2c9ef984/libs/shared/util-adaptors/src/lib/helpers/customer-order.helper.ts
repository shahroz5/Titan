import { COItemDetailsResponse, COMOrders } from '@poss-web/shared/models';
import { COAdaptor } from '../customer-order/co.adaptor';

export class CustomerOrderHelper {
  static getCOMOrdersList(data: any): COMOrders[] {
    if (!data) {
      return null;
    }
    const COMOrdersList: COMOrders[] = [];
    for (const order of data) {
      COMOrdersList.push(COAdaptor.comOrdersFromJson(order));
    }
    return COMOrdersList;
  }

  static getCOItemDetails(data: any): COItemDetailsResponse[] {
    if (!data) {
      return null;
    }
    const itemDetails: COItemDetailsResponse[] = [];
    for (const itemDetail of data) {
      itemDetails.push(COAdaptor.COItemDetailsResponseFromJson(itemDetail));
    }

    return itemDetails;
  }

  static getViewCOItemDetails(
    itemData: any,
    headerData: any
  ): COItemDetailsResponse[] {
    if (!itemData) {
      return null;
    }
    const itemDetails: COItemDetailsResponse[] = [];
    for (const itemDetail of itemData) {
      itemDetails.push(
        COAdaptor.getCOItemDetailsResponseFromJson(itemDetail, headerData)
      );
    }

    return itemDetails;
  }
}
