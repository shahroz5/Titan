import * as moment from 'moment';
import {
  RequestList,
  ItemList,
  BoutiqueList,
  IBThistoryHeaderPayload
} from '@poss-web/shared/models';

export class InterBoutiqueTransferAdaptor {
  /**
   * The function maps the json data to respective model type
   */

  static requestFromJson(request: any, data?: any): RequestList {
    if (!request) {
      return null;
    }
    return {
      id: request.id,
      reqDocNo: request.reqDocNo,
      srcLocationCode: request.srcLocationCode,
      destLocationCode: request.destLocationCode,
      totalRequestedQuantity: request.totalRequestedQuantity,
      acceptedQuantity: request.acceptedQuantity,
      approvedQuantity: request.approvedQuantity,
      status: request.status,
      reqDocDate: moment(request.reqDocDate),
      requestType: request.requestType,
      requestRemarks: request.requestRemarks,
      totalElements: data ? data.totalElements : 0,
      createdDate: moment(request.createdDate)
    };
  }

  static boutiqueFromJson(boutique: any, data: any): BoutiqueList {
    if (!data) {
      return null;
    }
    return {
      locationCode: boutique.locationCode,
      address: boutique.address,
      contactNo: boutique.contactNo,
      phoneNo: boutique.phoneNo,
      description: boutique.description
    };
  }

  static itemFromJson(
    data: any,
    studdedProductGroups: string[] = []
  ): ItemList {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      itemCode: data.itemCode,
      lotNumber: data.lotNumber,
      mfgDate: data.mfgDate ? moment(data.mfgDate) : null,
      productCategory: data.productCategory,
      productGroup: data.productGroup,
      binCode: data.binCode,
      binGroupCode: data.binGroupCode,
      stdValue: data.stdValue,
      stdWeight: data.stdWeight,
      currencyCode: data.currencyCode,
      weightUnit: data.weightUnit,
      status: data.status,
      imageURL: data.imageURL,
      thumbnailImageURL: data.thumbnailImageURL,
      itemDetails: data.itemDetails,
      requestedQuantity: data.requestedQuantity,
      requestedWeight: data.requestedWeight,
      acceptedQuantity: data.acceptedQuantity,
      approvedQuantity: data.approvedQuantity,
      availableQuantity: data.availableQuantity,
      inventoryId: data.inventoryId,
      totalAcceptedQuantity: data.totalAcceptedQuantity,
      productCategoryDesc: data.productCategoryDesc,
      productGroupDesc: data.productGroupDesc,
      measuredValue: data.measuredValue,
      measuredQuantity: data.measuredQuantity,
      isStudded: studdedProductGroups.includes(data.productGroup),
      isLoadingImage: false,
      isLoadingThumbnailImage: false,
      taxDetails: data.taxDetails
    };
  }

  static historyFromJson(data: any): IBThistoryHeaderPayload {
    if (!data) {
      return null;
    }
    return {
      id: data.id,
      srcLocationCode: data.srcLocationCode,
      destLocationCode: data.destLocationCode,
      status: data.status,
      dateType : data.dateType,
      weightUnit: data.weightUnit,
      currencyCode: data.currencyCode,
      srcLocationDescription: data.srcLocationDescription,
      destLocationDescription: data.destLocationDescription,
      srcFiscalYear: data.srcFiscalYear,
      srcDocDate: data.srcDocDate ? moment(data.srcDocDate) : null,
      destDocNo: data.destDocNo,
      destDocDate: data.destDocDate ? moment(data.destDocDate) : null,
      orderType: data.orderType,
      totalAvailableQuantity: data.totalAvailableQuantity,
      totalMeasuredQuantity: data.totalMeasuredQuantity,
      totalAvailableValue: data.totalAvailableValue,
      totalMeasuredValue: data.totalMeasuredValue,
      totalAvailableWeight: data.totalAvailableWeight,
      totalMeasuredWeight: data.totalMeasuredWeight,
      reqDocDate: data.reqDocDate ? moment(data.reqDocDate) : null,
      reqDocNo: data.reqDocNo,
      reqLocationCode: data.reqLocationCode,
      requestType: data.requestType,
      otherDetails: data.otherDetails,
      carrierDetails: data.carrierDetails,
      remarks: data.remarks
    };
  }
}
