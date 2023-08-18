import { StockIssueItem } from '@poss-web/shared/models';
import { StockIssueTEPGEPAdaptor } from '../stock-issue-tep-gep/stock-issue-tep-gep.adaptor';

export class StockIssueTEPGEPHelper {
  static getStockIssueItems(
    data: any,
    studdedProductGroups: string[] = []
  ): StockIssueItem[] {
    const stockIssueItems: StockIssueItem[] = [];
    if (!data && data.results && data.results.length === 0) {
      return null;
    }
    for (const stockIssueItem of data.results) {
      stockIssueItems.push(
        StockIssueTEPGEPAdaptor.stockIssueItemFromJson(
          stockIssueItem,
          data,
          studdedProductGroups
        )
      );
    }
    return stockIssueItems;
  }

  static getLocationCodes(
    data: any,
  ): string[] {
    const locationcodes: string[] = [];
    if (!data) {
      return null;
    }
    for (const location of data) {
      locationcodes.push(
        location.locationCode
      );
    }
    return locationcodes;
  }

}
