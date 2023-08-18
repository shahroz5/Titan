import { IssueInventoryItem, IssueItem } from '@poss-web/shared/models';

import * as moment from 'moment';
import { IssueItemAdaptor } from './issueItem.adaptor';

export class IssueItemsAdaptor {
  /**
   * The function maps the json data to respective model type
   */
  static fromJson(
    data: any,
    studdedProductGroups: string[]
  ): IssueInventoryItem[] {
    const items: IssueInventoryItem[] = [];
    for (const item of data) {
      items.push(IssueItemAdaptor.fromJson(item, studdedProductGroups));
    }
    return items;
  }

  static fromIssueJson(data: any): IssueItem[] {
    const items: IssueItem[] = [];
    for (const issueItem of data.results) {
      items.push({
        approvedQuantity: issueItem.approvedQuantity,
        // availableQuantity: issueItem.availableQuantity,
        binCode: issueItem.binCode,
        binGroupCode: issueItem.binGroupCode,
        currencyCode: issueItem.currencyCode,
        id: issueItem.id,
        imageURL: issueItem.imageURL,
        thumbnailImageURL: issueItem.thumbnailImageURL,
        issuedQuantity: issueItem.issuedQuantity,
        itemCode: issueItem.itemCode,
        itemDetails: {},
        stdWeight: issueItem.stdWeight,
        stdValue: issueItem.stdValue,
        lotNumber: issueItem.lotNumber,
        mfgDate: moment(issueItem.mfgDate),
        orderType: issueItem.orderType,
        productCategory: issueItem.productCategory,
        productGroup: issueItem.productGroup,
        requestedQuantity: issueItem.requestedQuantity,
        status: issueItem.status,
        availableQuantity: issueItem.availableQuantity,
        availableValue: issueItem.availableValue,
        availableWeight: issueItem.availableWeight,
        weightUnit: issueItem.weightUnit,
        selectedQuantity: issueItem.selectedQuantity,
        measuredWeight: issueItem.measuredWeight,
        inventoryId: issueItem.inventoryId,
        totalElements: data.totalElements,
        isUpdating: null,
        isUpdatingSuccess: null,
        isLoadingImage: false,
        isLoadingThumbnailImage: false
      });
    }

    return items;
  }
}
