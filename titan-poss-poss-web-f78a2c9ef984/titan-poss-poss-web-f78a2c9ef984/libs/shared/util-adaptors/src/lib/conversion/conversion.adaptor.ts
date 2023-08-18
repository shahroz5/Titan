import {
  ConversionInventoryItem,
  ConversionRequests,
  ConversionRequestItems,
  ConversionItem,
  ConversionRequestResponse,
  ConversionResponse,
  ConversionRsoDetailsPayload,
  ConversionHistorySuccessPayload,
  ConversionHistoryItems,
  ConversionHistoryItemsSuccessPayload,
  ConversionHistory,
  ConversionApprovalListingResponsePayload,
  ConversionApprovalsItem,
  SelectedRequestDetailsResponse,
  SelectedRequestDataResponse,
  ConversionRequestsResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class ConversionAdaptor {
  static inventoryItemFromJson(
    data: any,
    studdedProductGroups: string[] = []
  ): ConversionInventoryItem[] {
    const searchedItems: ConversionInventoryItem[] = [];
    if (data.results && data.results.items && data.results.items.length > 0) {
      for (const searchedItem of data.results.items) {
        searchedItems.push({
          availableQuantity: searchedItem.availableQuantity,
          availableValue: searchedItem.availableValue,
          availableWeight: searchedItem.availableWeight,
          binCode: searchedItem.binCode,
          binGroupCode: searchedItem.binGroupCode,
          currencyCode: searchedItem.currencyCode,
          id: searchedItem.id,
          imageURL: searchedItem.imageURL,
          thumbnailImageURL: searchedItem.thumbnailImageURL,
          itemCode: searchedItem.itemCode,
          itemDetails: searchedItem.itemDetails,
          lotNumber: searchedItem.lotNumber,
          mfgDate: searchedItem.mfgDate ? moment(searchedItem.mfgDate) : null,
          productCategory: searchedItem.productCategory,
          productCategoryDesc: searchedItem.productCategoryDesc,
          productGroup: searchedItem.productGroup,
          productGroupDesc: searchedItem.productGroupDesc,
          status: searchedItem.status,
          stdValue: searchedItem.stdValue,
          stdWeight: searchedItem.stdWeight,
          weightUnit: searchedItem.weightUnit,
          isStudded: studdedProductGroups.includes(searchedItem.productGroup),
          studded: searchedItem.studded,
          isLoadingImage: false,
          isLoadingThumbnailImage: false
        });
      }
    }
    return searchedItems;
  }
  static requestsFromJson(data: any): ConversionRequests[] {
    const conversionRequests: ConversionRequests[] = [];
    for (const conversionRequest of data.results) {
      conversionRequests.push({
        id: conversionRequest.id,
        srcDocNo: conversionRequest.srcDocNo,
        status: conversionRequest.status,
        createdDate: conversionRequest.createdDate
          ? moment(conversionRequest.createdDate)
          : null,
        totalQuantity: conversionRequest.totalQuantity,
        totalWeight: conversionRequest.totalWeight,
        totalValue: conversionRequest.totalValue
      });
    }
    return conversionRequests;
  }
  static conversionRequestsWithCount(data: any): ConversionRequestsResponse {
    return {
      conversionRequestsList: this.requestsFromJson(data),
      count: data.totalElements ? data.totalElements : 0
    };
  }

  static getSelectedRequestDetails(data: any): ConversionRequests {
    let selectedRequestDetails: ConversionRequests;
    selectedRequestDetails = {
      createdDate: data.createdDate ? moment(data.createdDate) : null,
      id: data.id ? data.id : null,
      otherDetails: this.getOtherChildItems(
        data.otherDetails?.data?.childItems
      ),
      srcDocNo: data.srcDocNo ? data.srcDocNo : null,
      status: data.status ? data.status : null,
      totalQuantity: data.totalQuantity ? data.totalQuantity : null,
      totalValue: data.totalValue ? data.totalValue : null,
      totalWeight: data.totalWeight ? data.totalWeight : null,
      approvalRemarks: data.approvalRemarks ? data.approvalRemarks : null
    };
    return selectedRequestDetails;
  }

  static requestSentHistory(data: any): ConversionHistorySuccessPayload {
    let requestSentHistorySuccessPayload: ConversionHistorySuccessPayload;
    const conversionRequests: ConversionHistory[] = [];
    for (const conversionRequest of data.results) {
      conversionRequests.push({
        id: conversionRequest.id,
        srcLocationCode: conversionRequest.srcLocationCode,
        destLocationCode: conversionRequest.destLocationCode,
        status: conversionRequest.status,
        weightUnit: conversionRequest.weightUnit,
        currencyCode: conversionRequest.currencyCode,
        srcLocationDescription: conversionRequest.srcLocationDescription,
        destLocationDescription: conversionRequest.destLocationDescription,
        srcDocNo: conversionRequest.srcDocNo,
        srcFiscalYear: conversionRequest.srcFiscalYear,
        srcDocDate: conversionRequest.srcDocDate
          ? moment(conversionRequest.srcDocDate)
          : null,
        destDocNo: conversionRequest.destDocNo,
        destDocDate: conversionRequest.destDocDate
          ? moment(conversionRequest.destDocDate)
          : null,
        totalAvailableQuantity: conversionRequest.totalAvailableQuantity,
        totalMeasuredQuantity: conversionRequest.totalMeasuredQuantity,
        totalAvailableValue: conversionRequest.totalAvailableValue,
        totalMeasuredValue: conversionRequest.totalMeasuredValue,
        totalAvailableWeight: conversionRequest.totalAvailableWeight,
        totalMeasuredWeight: conversionRequest.totalMeasuredWeight,
        reqDocDate: conversionRequest.reqDocDate
          ? moment(conversionRequest.reqDocDate)
          : null,
        reqDocNo: conversionRequest.reqDocNo,
        reqLocationCode: conversionRequest.reqLocationCode,
        requestType: conversionRequest.requestType,
        remarks: conversionRequest.remarks,
        rsoName: conversionRequest.otherDetails.rsoName
      });
    }
    requestSentHistorySuccessPayload = {
      requestSentHistory: conversionRequests,
      count: data.totalElements
    };
    return requestSentHistorySuccessPayload;
  }
  static selectedRequestSentHistory(data: any): ConversionHistory {
    const selectedRequestHistory: ConversionHistory = {
      id: data.id,
      srcLocationCode: data.srcLocationCode,
      destLocationCode: data.destLocationCode,
      status: data.status,
      weightUnit: data.weightUnit,
      currencyCode: data.currencyCode,
      srcLocationDescription: data.srcLocationDescription,
      destLocationDescription: data.destLocationDescription,
      srcDocNo: data.srcDocNo,
      srcFiscalYear: data.srcFiscalYear,
      srcDocDate: data.srcDocDate ? moment(data.srcDocDate) : null,
      destDocNo: data.destDocNo,
      destDocDate: data.destDocDate ? moment(data.destDocDate) : null,
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
      remarks: data.remarks,
      prevTransaction: data.prevTransaction,
      rsoName: data.otherDetails.rsoName,
      otherDetails: data.otherDetails
    };
    return selectedRequestHistory;
  }
  static conversionHistoryItems(
    data: any,
    studdedProductGroups: string[] = []
  ): ConversionHistoryItemsSuccessPayload {
    console.log('data', data.results);
    let conversionHistoryItemsData: ConversionHistoryItemsSuccessPayload;
    const conversionHistoryItems: ConversionHistoryItems[] = [];
    for (const conversionRequest of data.results) {
      conversionHistoryItems.push({
        id: conversionRequest.id,
        itemCode: conversionRequest.itemCode,
        lotNumber: conversionRequest.lotNumber,
        mfgDate: conversionRequest.mfgDate
          ? moment(conversionRequest.mfgDate)
          : null,
        productCategory: conversionRequest.productCategory,
        productGroup: conversionRequest.productGroup,
        productCategoryDesc: conversionRequest.productCategoryDesc,
        productGroupDesc: conversionRequest.productGroupDesc,
        binCode: conversionRequest.binCode,
        binGroupCode: conversionRequest.binGroupCode,
        stdValue: conversionRequest.stdValue,
        stdWeight: conversionRequest.stdWeight,
        currencyCode: conversionRequest.currencyCode,
        weightUnit: conversionRequest.weightUnit,
        status: conversionRequest.status,
        imageURL: conversionRequest.imageURL,
        thumbnailImageURL: conversionRequest.thumbnailImageURL,
        itemDetails: {
          remarks: conversionRequest.itemDetails.remarks,
          itemCode: conversionRequest.itemDetails.itemCode,
          netWeight: conversionRequest.itemDetails.netWeight,
          stonePrice: conversionRequest.itemDetails.stonePrice,
          complexityCode: conversionRequest.itemDetails.complexityCode,
          sold: conversionRequest.itemDetails.sold,
          itemType: conversionRequest.itemDetails.itemType
        },
        availableQuantity: conversionRequest.availableQuantity,
        availableWeight: conversionRequest.availableWeight,
        availableValue: conversionRequest.availableValue,
        measuredQuantity: conversionRequest.measuredQuantity,
        measuredWeight: conversionRequest.measuredWeight,
        measuredValue: conversionRequest.measuredValue,
        orderType: conversionRequest.orderType,
        inventoryId: conversionRequest.inventoryId,
        isStudded: studdedProductGroups.includes(
          conversionRequest.productGroup
        ),
        studded: conversionRequest.studded,
        isLoadingImage: false,
        isLoadingThumbnailImage: false
      });
    }
    conversionHistoryItemsData = {
      items: conversionHistoryItems,
      count: data.totalElements
    };
    return conversionHistoryItemsData;
  }
  static conversionHistoryTransactionItems(
    childItems: any,
    parentItem: any,
    studdedProductGroups: string[] = []
  ): ConversionHistoryItemsSuccessPayload {
    let conversionHistoryItemsData: ConversionHistoryItemsSuccessPayload;
    const conversionHistoryItems: ConversionHistoryItems[] = [];
    for (const childItem of childItems.results) {
      conversionHistoryItems.push({
        id: childItem.id,
        itemCode: childItem.itemCode,
        lotNumber: childItem.lotNumber,
        mfgDate: childItem.mfgDate ? moment(childItem.mfgDate) : null,
        productCategory: childItem.productCategory,
        productGroup: childItem.productGroup,
        productCategoryDesc: childItem.productCategoryDesc,
        productGroupDesc: childItem.productGroupDesc,
        binCode: childItem.binCode,
        binGroupCode: childItem.binGroupCode,
        stdValue: childItem.stdValue,
        stdWeight: childItem.stdWeight,
        currencyCode: childItem.currencyCode,
        weightUnit: childItem.weightUnit,
        status: childItem.status,
        imageURL: childItem.imageURL,
        thumbnailImageURL: childItem.thumbnailImageURL,
        itemDetails: {
          remarks: null,
          itemCode: null,
          netWeight: null,
          stonePrice: null,
          complexityCode: null,
          sold: null,
          itemType: 'Child'
        },
        availableQuantity: childItem.availableQuantity,
        availableWeight: childItem.availableWeight,
        availableValue: childItem.availableValue,
        measuredQuantity: childItem.measuredQuantity,
        measuredWeight: childItem.measuredWeight,
        measuredValue: childItem.measuredValue,
        orderType: childItem.orderType,
        inventoryId: childItem.inventoryId,
        destBinCode: childItem?.destBinCode,
        receivedWeight: childItem?.receivedWeight,
        isStudded: studdedProductGroups.includes(childItem.productGroup),
        studded: childItem?.studded,
        isLoadingImage: false,
        isLoadingThumbnailImage: false
      });
    }
    conversionHistoryItems.push({
      id: parentItem.id,
      itemCode: parentItem.itemCode,
      lotNumber: parentItem.lotNumber,
      mfgDate: parentItem.mfgDate ? moment(parentItem.mfgDate) : null,
      productCategory: parentItem.productCategory,
      productGroup: parentItem.productGroup,
      productCategoryDesc: parentItem.productCategoryDesc,
      productGroupDesc: parentItem.productGroupDesc,
      binCode: parentItem.binCode,
      binGroupCode: parentItem.binGroupCode,
      stdValue: parentItem.stdValue,
      stdWeight: parentItem.stdWeight,
      currencyCode: parentItem.currencyCode,
      weightUnit: parentItem.weightUnit,
      status: parentItem.status,
      imageURL: parentItem.imageURL,
      thumbnailImageURL: parentItem.thumbnailImageURL,
      itemDetails: {
        remarks: null,
        itemCode: null,
        netWeight: null,
        stonePrice: null,
        complexityCode: null,
        sold: null,
        itemType: 'Parent'
      },
      availableQuantity: parentItem.availableQuantity,
      availableWeight: parentItem.availableWeight,
      availableValue: parentItem.availableValue,
      measuredQuantity: parentItem.measuredQuantity,
      measuredWeight: parentItem.measuredWeight,
      measuredValue: parentItem.measuredValue,
      orderType: parentItem.orderType,
      inventoryId: parentItem.inventoryId,
      isStudded: studdedProductGroups.includes(parentItem.productGroup),
      studded: parentItem.studded,
      isLoadingImage: false,
      isLoadingThumbnailImage: false
    });
    conversionHistoryItemsData = {
      items: conversionHistoryItems,
      count: 3
    };
    return conversionHistoryItemsData;
  }

  static conversionRequestHistoryTransactionItems(
    childItems: any,
    parentItem: any,
    studdedProductGroups: string[] = []
  ): ConversionHistoryItemsSuccessPayload {
    let conversionHistoryItemsData: ConversionHistoryItemsSuccessPayload;
    const conversionHistoryItems: ConversionHistoryItems[] = [];
    for (const child of childItems) {
      conversionHistoryItems.push({
        id: child.id ? child.id : null,
        itemCode: child.itemCode ? child.itemCode : null,
        lotNumber: child.lotNumber ? child.lotNumber : null,
        mfgDate: child.mfgDate ? child.mfgDate : null,
        productCategory: child.productCategory ? child.productCategory : null,
        productGroup: child.productGroup ? child.productGroup : null,
        productCategoryDesc: child.productCategoryDesc
          ? child.productCategoryDesc
          : null,
        productGroupDesc: child.productGroupDesc
          ? child.productGroupDesc
          : null,
        binCode: child.binCode ? child.binCode : null,
        binGroupCode: child.binGroupCode ? child.binGroupCode : null,
        stdValue: child.stdValue ? child.stdValue : null,
        stdWeight: child.stdWeight ? child.stdWeight : null,
        currencyCode: child.currencyCode ? child.currencyCode : null,
        weightUnit: child.weightUnit ? child.weightUnit : 'gms',
        status: child.status ? child.status : null,
        imageURL: child.imageURL ? child.imageURL : null,
        thumbnailImageURL: child.thumbnailImageURL
          ? child.thumbnailImageURL
          : null,
        itemDetails: {
          remarks: child.itemDetails?.data?.remarks
            ? child.itemDetails.data.remarks
            : null,
          itemCode: child.itemDetails?.data?.itemCode
            ? child.itemDetails.data.itemCode
            : null,
          netWeight: child.itemDetails?.data?.netWeight
            ? child.itemDetails.data.netWeight
            : null,
          stonePrice: child.itemDetails?.data?.stonePrice
            ? child.itemDetails.data.stonePrice
            : null,
          complexityCode: child.itemDetails?.data?.complexityCode
            ? child.itemDetails.data.complexityCode
            : null,
          sold: child.itemDetails?.data?.sold
            ? child.itemDetails.data.sold
            : null,
          itemType: 'Child'
        },
        requestedQuantity: child.quantity ? child.quantity : null,
        requestedWeight: child.measuredWeight ? child.measuredWeight : null,
        availableQuantity: null,
        measuredValue: child.measuredValue ? child.measuredValue : null,
        inventoryId: child.inventoryId ? child.inventoryId : null,
        isLoadingImage: false,
        isLoadingThumbnailImage: false
      });
    }
    conversionHistoryItems.push({
      id: parentItem.id,
      itemCode: parentItem.itemCode,
      lotNumber: parentItem.lotNumber,
      mfgDate: parentItem.mfgDate ? moment(parentItem.mfgDate) : null,
      productCategory: parentItem.productCategory,
      productGroup: parentItem.productGroup,
      productCategoryDesc: parentItem.productCategoryDesc,
      productGroupDesc: parentItem.productGroupDesc,
      binCode: parentItem.binCode,
      binGroupCode: parentItem.binGroupCode,
      stdValue: parentItem.stdValue,
      stdWeight: parentItem.stdWeight,
      currencyCode: parentItem.currencyCode,
      weightUnit: parentItem.weightUnit,
      status: parentItem.status,
      imageURL: parentItem.imageURL,
      thumbnailImageURL: parentItem.thumbnailImageURL,
      itemDetails: {
        remarks: null,
        itemCode: null,
        netWeight: null,
        stonePrice: null,
        complexityCode: null,
        sold: parentItem.itemDetails?.sold
          ? parentItem.itemDetails?.sold
          : null,
        itemType: 'Parent'
      },
      availableQuantity: parentItem.availableQuantity,
      availableWeight: parentItem.availableWeight,
      availableValue: parentItem.availableValue,
      measuredQuantity: parentItem.measuredQuantity,
      measuredWeight: parentItem.measuredWeight,
      measuredValue: parentItem.measuredValue,
      orderType: parentItem.orderType,
      inventoryId: parentItem.inventoryId,
      isStudded: studdedProductGroups.includes(parentItem.productGroup),
      studded: parentItem.studded,
      isLoadingImage: false,
      isLoadingThumbnailImage: false
    });
    conversionHistoryItemsData = {
      items: conversionHistoryItems,
      count: 3
    };
    return conversionHistoryItemsData;
  }

  static SelectedRequestFromJson(data: any): ConversionRequests {
    if (!data) {
      return null;
    }
    const conversionRequest: ConversionRequests = {
      id: data.id,
      srcDocNo: data.srcDocNo,
      status: data.status,
      createdDate: data.createdDate ? moment(data.createdDate) : null,
      totalQuantity: data.totalQuantity,
      totalWeight: data.totalWeight,
      totalValue: data.totalValue
    };
    return conversionRequest;
  }

  static SelectedRequestDataFromJson(
    conversionRequestItem: any,
    studdedProductGroups: string[] = []
  ): ConversionRequestItems[] {
    const conversionRequestItems: ConversionRequestItems[] = [];
    for (const conversionRequestData of conversionRequestItem) {
      conversionRequestItems.push({
        binCode: conversionRequestData.binCode,
        inventoryId: conversionRequestData.inventoryId,
        imageURL: conversionRequestData.imageURL,
        thumbnailImageURL: conversionRequestData.thumbnailImageURL,
        itemCode: conversionRequestData.itemCode,
        itemDetails: {
          complexityCode: conversionRequestData.itemDetails.complexityCode,
          itemCode: conversionRequestData.itemDetails.itemCode,
          itemType: conversionRequestData.itemDetails.itemType,
          netWeight: conversionRequestData.itemDetails.netWeight,
          remarks: conversionRequestData.itemDetails.remarks,
          sold: conversionRequestData.itemDetails.sold,
          stonePrice: conversionRequestData.itemDetails.stonePrice
        },
        lotNumber: conversionRequestData.lotNumber,
        mfgDate: conversionRequestData.mfgDate
          ? moment(conversionRequestData.mfgDate)
          : null,
        productCategory: conversionRequestData.productCategory,
        productCategoryDesc: conversionRequestData.productCategoryDesc,
        productGroup: conversionRequestData.productGroup,
        productGroupDesc: conversionRequestData.productGroupDesc,
        stdValue: conversionRequestData.stdValue,
        stdWeight: conversionRequestData.stdWeight,
        weightUnit: conversionRequestData.weightUnit
          ? conversionRequestData.weightUnit
          : 'gms',
        isStudded: studdedProductGroups.includes(
          conversionRequestData.productGroup
        ),
        studded: conversionRequestData?.studded,
        isLoadingImage: false,
        isLoadingThumbnailImage: false
      });
    }
    return conversionRequestItems;
  }

  static SelectedRequestData(
    conversionRequestItem: any,
    studdedProductGroups: string[] = []
  ): SelectedRequestDataResponse {
    const itemIds: string[] = [];
    const conversionRequestItems: ConversionRequestItems[] = this.SelectedRequestDataFromJson(
      conversionRequestItem,
      studdedProductGroups
    );

    for (const conversionRequestData of conversionRequestItem) {
      itemIds.push(conversionRequestData.id);
    }
    return { conversionRequestItems: conversionRequestItems, itemIds: itemIds };
  }

  static ItemsFromJson(
    data: any,
    studdedProductGroups: string[] = []
  ): ConversionItem {
    data = data.results;
    if (data == null) {
      return;
    }
    const childItems: ConversionItem[] = [];
    for (const childItem of data[0].childItems) {
      childItems.push({
        autoApproved: childItem.autoApproved,
        binCode: childItem.binCode,
        childItems: childItem.childItems,
        complexityCode: childItem.complexityCode,
        currencyCode: childItem.currencyCode,
        imageURL: childItem.imageURL,
        thumbnailImageURL: childItem.thumbnailImageURL,
        inventoryId: childItem.inventoryId,
        itemCode: childItem.itemCode,
        itemDescription: childItem.itemDescription,
        lotNumber: childItem.lotNumber,
        productCategory: childItem.productCategoryCode,
        productCategoryDesc: childItem.productCategoryDesc,
        productGroup: childItem.productGroupCode,
        productGroupDesc: childItem.productGroupDesc,
        productType: childItem.productType,
        stdValue: childItem.stdValue,
        stdWeight: childItem.stdWeight,
        stoneValue: childItem.stoneValue,
        weightUnit: childItem.weightUnit,
        isStudded: studdedProductGroups.includes(childItem.productGroup),
        studded: childItem.studded,
        isLoadingImage: false,
        isLoadingThumbnailImage: false
      });
    }
    const conversionItems: ConversionItem = {
      autoApproved: data[0].autoApproved,
      binCode: data[0].binCode,
      childItems: childItems,
      complexityCode: data[0].complexityCode,
      currencyCode: data[0].currencyCode,
      imageURL: data[0].imageURL,
      thumbnailImageURL: data[0].thumbnailImageURL,
      inventoryId: data[0].inventoryId,
      itemCode: data[0].itemCode,
      itemDescription: data[0].itemDescription,
      lotNumber: data[0].lotNumber,
      productCategory: data[0].productCategoryCode,
      productCategoryDesc: data[0].productCategoryDesc,
      productGroup: data[0].productGroupCode,
      productGroupDesc: data[0].productGroupDesc,
      productType: data[0].productType,
      stdValue: data[0].stdValue,
      stdWeight: data[0].stdWeight,
      stoneValue: data[0].stoneValue,
      weightUnit: data[0].weightUnit,
      isStudded: studdedProductGroups.includes(data[0].productGroup),
      studded: data[0].studded,
      isLoadingImage: false,
      isLoadingThumbnailImage: false
    };

    return conversionItems;
  }
  static conversionRequestResponseFromJson(data: any) {
    const conversionRequestResponse: ConversionRequestResponse = {
      currencyCode: data.currencyCode,
      destDocDate: data.destDocDate ? moment(data.destDocDate) : null,
      destDocNo: data.destDocNo,
      destLocationCode: data.destLocationCode,
      id: data.id,
      orderType: data.orderType,
      reqDocDate: data.reqDocDate ? moment(data.reqDocDate) : null,
      reqDocNo: data.reqDocNo,
      requestType: data.requestType,
      srcDocDate: data.srcDocDate ? moment(data.srcDocDate) : null,
      srcDocNo: data.srcDocNo,
      srcFiscalYear: data.srcFiscalYear,
      srcLocationCode: data.srcLocationCode,
      status: data.status,
      totalAvailableQuantity: data.totalAvailableQuantity,
      totalAvailableValue: data.totalAvailableValue,
      totalAvailableWeight: data.totalAvailableWeight,
      totalMeasuredQuantity: data.totalMeasuredQuantity,
      totalMeasuredValue: data.totalMeasuredValue,
      totalMeasuredWeight: data.totalMeasuredWeight,
      weightUnit: data.weightUnit
    };
    return conversionRequestResponse;
  }
  static conversionResponseFromJson(data: any): ConversionResponse {
    const conversionResponse: ConversionResponse = {
      currencyCode: data[0].currencyCode,
      destDocDate: data.destDocDate ? moment(data.destDocDate) : null,
      destDocNo: data[0].destDocNo,
      destLocationCode: data[0].destLocationCode,
      id: data.id,
      orderType: data[0].orderType,
      srcDocDate: data.srcDocDate ? moment(data.srcDocDate) : null,
      srcDocNo: data[0].srcDocNo,
      srcFiscalYear: data[0].srcFiscalYear,
      srcLocationCode: data[0].srcLocationCode,
      status: data[0].status,
      totalQuantity: data[0].totalQuantity,
      totalValue: data[0].totalValue,
      totalWeight: data[0].totalWeight,
      weightUnit: data[0].weightUnit
    };
    return conversionResponse;
  }
  static rsoDetailsFromJson(data: any): ConversionRsoDetailsPayload {
    const empName: string[] = [];
    const employeeCode: string[] = [];
    let rsoDetails: ConversionRsoDetailsPayload;
    for (const details of data.results) {
      empName.push(details.empName);
      employeeCode.push(details.employeeCode);
    }
    rsoDetails = {
      empName: empName,
      employeeCode: employeeCode
    };
    return rsoDetails;
  }

  // Conversion Approvals
  static getApprovalRequestsList(
    data: any
  ): ConversionApprovalListingResponsePayload {
    const approvalRequestsList: ConversionApprovalsItem[] = [];
    if (data && data.results) {
      for (const approvalRequest of data.results) {
        approvalRequestsList.push({
          id: approvalRequest.id,
          reqDocNo: approvalRequest.reqDocNo,
          requestDate: approvalRequest.reqDocDate
            ? moment(approvalRequest.reqDocDate)
            : null,
          locationCode: approvalRequest.srcLocationCode,
          variantCode: null,
          productDescription: null,
          currencyCode: approvalRequest.currencyCode,
          totalQuantity: approvalRequest.totalRequestedQuantity,
          totalValue: approvalRequest.totalRequestedValue,
          totalWeight: approvalRequest.totalRequestedWeight,
          weightUnit: approvalRequest.weightUnit,
          status: approvalRequest.status
        });
      }
    }

    return {
      approvalRequestsList: approvalRequestsList,
      approvalRequestsLength: data.totalElements
    };
  }

  static getSelectedRequestItemDetails(
    data: any
  ): SelectedRequestDetailsResponse {
    let selectedRequestItemDetails: SelectedRequestDetailsResponse;
    if (data) {
      selectedRequestItemDetails = {
        id: data.id,
        reqDocNo: data.reqDocNo,
        status: data.status,
        createdDate: data.reqDocDate ? moment(data.reqDocDate) : null,
        totalRequestedQuantity: data.totalRequestedQuantity,
        totalRequestedWeight: data.totalRequestedWeight,
        totalRequestedValue: data.totalRequestedValue,
        otherDetails: this.getOtherChildItems(
          data.otherDetails?.data?.childItems
        ),
        locationCode: data.srcLocationCode,
        requestRemarks: data.requestRemarks ? data.requestRemarks : null,
        approvalRemarks: data.approvalRemarks ? data.approvalRemarks : null
      };
    }
    return selectedRequestItemDetails;
  }

  static getOtherChildItems(childItems: any[]): ConversionRequestItems[] {
    let otherChildItems = [];
    for (let child of childItems) {
      otherChildItems.push({
        id: child.id ? child.id : null,
        itemCode: child.itemCode ? child.itemCode : null,
        lotNumber: child.lotNumber ? child.lotNumber : null,
        mfgDate: child.mfgDate ? child.mfgDate : null,
        productCategory: child.productCategory ? child.productCategory : null,
        productGroup: child.productGroup ? child.productGroup : null,
        productCategoryDesc: child.productCategoryDesc
          ? child.productCategoryDesc
          : null,
        productGroupDesc: child.productGroupDesc
          ? child.productGroupDesc
          : null,
        binCode: child.binCode ? child.binCode : null,
        binGroupCode: child.binGroupCode ? child.binGroupCode : null,
        stdValue: child.binGroupCode ? child.binGroupCode : null,
        stdWeight: child.measuredWeight ? child.measuredWeight : null,
        currencyCode: child.currencyCode ? child.currencyCode : null,
        weightUnit: child.weightUnit ? child.weightUnit : 'gms',
        status: child.status ? child.status : null,
        imageURL: child.imageURL ? child.imageURL : null,
        thumbnailImageURL: child.thumbnailImageURL
          ? child.thumbnailImageURL
          : null,
        itemDetails: {
          remarks: child.itemDetails?.data?.remarks
            ? child.itemDetails.data.remarks
            : null,
          itemCode: child.itemDetails?.data?.itemCode
            ? child.itemDetails.data.itemCode
            : null,
          netWeight: child.itemDetails?.data?.netWeight
            ? child.itemDetails.data.netWeight
            : null,
          stonePrice: child.itemDetails?.data?.stonePrice
            ? child.itemDetails.data.stonePrice
            : null,
          complexityCode: child.itemDetails?.data?.complexityCode
            ? child.itemDetails.data.complexityCode
            : null,
          sold: child.itemDetails?.data?.sold
            ? child.itemDetails.data.sold
            : null,
          itemType: child.itemDetails?.data?.itemType
            ? child.itemDetails.data.itemType
            : null
        },
        requestedQuantity: child.quantity ? child.quantity : null,
        requestedWeight: child.measuredWeight ? child.measuredWeight : null,
        acceptedQuantity: null,
        approvedQuantity: null,
        availableQuantity: null,
        inventoryId: child.inventoryId ? child.inventoryId : null,
        totalApprovedQuantity: null,
        isLoadingImage: false,
        isLoadingThumbnailImage: false
      });
    }

    return this.SelectedRequestDataFromJson(otherChildItems);
  }
}
