import { IssueInventoryItem } from '@poss-web/shared/models';
import { IssueItemAdaptor } from '../stock-issue/issueItem.adaptor';

export class IssueItemHelper {
  static getItems(
    data: any,
    studdedProductGroups: string[] = [],
    showAcDetailsAsTax?: boolean
  ): { items: IssueInventoryItem[]; count: number } {
    const items: IssueInventoryItem[] = [];
    for (const item of data.results) {
      items.push(
        IssueItemAdaptor.fromJson(
          item,
          studdedProductGroups,
          showAcDetailsAsTax
        )
      );
    }
    return {
      items,
      count: data.totalElements
    };
  }

  //   static getProductCategories(data: any): Filter[] {
  //     const productCategories: Filter[] = [];
  //     for (const productCategory of data.results) {
  //       productCategories.push(
  //         StockIssueAdaptor.productCategoriesFromJson(productCategory)
  //       );
  //     }
  //     return productCategories;
  //   }

  //   static getProductGroups(data: any): Filter[] {
  //     const productGroups: Filter[] = [];
  //     for (const productGroup of data.results) {
  //       productGroups.push(StockIssueAdaptor.productGroupsFromJson(productGroup));
  //     }
  //     return productGroups;
  //   }
}
