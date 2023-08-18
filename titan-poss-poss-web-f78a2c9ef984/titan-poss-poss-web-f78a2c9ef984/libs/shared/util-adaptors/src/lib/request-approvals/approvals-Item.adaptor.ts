
import * as moment from 'moment';
import { RequestApprovalsItems } from '@poss-web/shared/models';

export class ApprovalsItemAdaptor {


  static fromJson(item: any, isSelectedData, studdedProductGroups: string[]=[]): RequestApprovalsItems {

    return {
      id: item.id,
      binCode: item.binCode,
      itemCode: item.itemCode,
      stdValue: item.stdValue,
      stdWeight: item.stdWeight,
      requestedQuantity: item.requestedQuantity ? item.requestedQuantity : 0,
      acceptedQuantity: item.acceptedQuantity ? item.acceptedQuantity : 0,
      approvedQuantity: item.approvedQuantity ? item.approvedQuantity : 0,
      availableQuantity: item.availableQuantity ? item.availableQuantity : 0,
      inventoryId: item.inventoryId,
      totalApprovedQuantity: item.totalApprovedQuantity ? item.totalApprovedQuantity : 0,
      totalReceivedQuantity: item.totalReceivedQuantity ? item.totalReceivedQuantity : 0,
      totalReceivedValue: item.totalReceivedValue ? item.totalReceivedValue : 0,
      totalReceivedWeight: item.totalReceivedWeight ? item.totalReceivedWeight : 0,
      lotNumber: item.lotNumber,
      mfgDate: moment(item.mfgDate),
      status: item.status,
      productGroupDesc: item.productGroupDesc,
      productCategoryDesc: item.productCategoryDesc,
      currencyCode: item.currencyCode,
      weightUnit: item.weightUnit,
      imageURL: item.imageURL,
      thumbnailImageURL: item.thumbnailImageURL,
      binGroupCode: item.binGroupCode,
      productCategory: item.productCategory,
      productGroup: item.productGroup,
      isSelected: isSelectedData.includes(item.id),
      isStudded: studdedProductGroups.includes(item.productGroup),
      isLoadingImage: false,
      isLoadingThumbnailImage: false
    };
  }
}
