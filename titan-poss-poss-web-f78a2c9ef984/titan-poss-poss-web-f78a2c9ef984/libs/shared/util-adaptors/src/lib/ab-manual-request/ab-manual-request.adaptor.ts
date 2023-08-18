import { AbManualItemDetails, ProductDetails } from '@poss-web/shared/models';
import { CashMemoAdaptor } from '../cash-memo/cash-memo.adaptor';

export class AbManulRequestAdaptor {
  static sendWorkFlowDataToIntegration(
    method: any,
    url: any,
    params?: any,
    reqBody?: any
  ): any {
    return {
      httpMethod: method ? method : null,
      relativeUrl: url ? url : null,
      reqBody: reqBody ? reqBody : null,
      requestParams: params ? params : null
    };
  }

  static getItemDetailsResponseFromJson(
    data: any,
    productDetails: any
  ): AbManualItemDetails {
    if (!data) {
      return null;
    }

    let productDetail: ProductDetails;
    productDetails.results.forEach((element: ProductDetails) => {
      if (data.inventoryId === element.inventoryId) {
        productDetail = element;
      }
    });

    return {
      employeeCode: data.employeeCode,
      inventoryId: data.inventoryId,
      itemCode: data.itemCode,
      itemId: (data.itemId as string).toUpperCase(),
      lotNumber: data.lotNumber,
      binCode: data.binCode,
      finalValue: data.finalValue,
      remarks: data.remarks,
      totalDiscount: data.totalDiscount,
      totalQuantity: data.totalQuantity,
      totalTax: data.totalTax,
      totalValue: data.totalValue,
      totalWeight: data.totalWeight,
      unitValue: data.unitValue,
      unitWeight: data.unitWeight,
      discountDetails: data.discountDetails,
      focDetails: data.focDetails,
      priceDetails: CashMemoAdaptor.priceDetails(data.priceDetails),
      taxDetails: CashMemoAdaptor.taxDetails(data.taxDetails),
      inventoryWeightDetails: CashMemoAdaptor.getWeightDetails(
        data.inventoryWeightDetails
      ),
      isFoc: data.isFoc,
      measuredWeightDetails: CashMemoAdaptor.getWeightDetails(
        data.measuredWeightDetails
      ),
      productCategoryCode: data.productCategoryCode,
      productGroupCode: data.productGroupCode,
      refTxnId: data.refTxnId,
      refTxnType: data.refTxnType,
      rowId: data.rowId,
      productCategoryDescription: productDetail?.productCategoryDescription,
      productGroupDescription: productDetail?.productGroupDescription,
      imageUrl: productDetail?.imageUrl
    };
  }

  static getAbManualRequestListFromJson(data: any, totalElements: any): any {
    if (!data) {
      return null;
    }
    return {
      approvedBy: data.approvedBy,
      approvedDate: data.approvedDate,
      approverRemarks: data.approverRemarks,
      docDate: data.docDate,
      docNo: data.docNo,
      fiscalYear: data.fiscalYear,
      headerData: data.headerData,
      locationCode: data.locationCode,
      processId: data.processId,
      requestedBy: data.requestedBy,
      requestedDate: data.requestedDate,
      requestorRemarks: data.requestorRemarks,
      taskId: data.taskId,
      taskName: data.taskName,
      workflowType: data.workflowType,
      totalElements: totalElements,
      approvalLevel: data.approvalLevel,
      approvalStatus: data.approvalStatus
    };
  }

  static getAbManualRequestDetailsFromJson(data: any): any {
    if (!data) {
      return null;
    }

    return {
      approvalLevel: data.approvalLevel,
      approvalStatus: data.approvalStatus,
      approvedData: data.approvedData,
      docNo: data.docNo,
      headerData: data.headerData,
      locationCode: data.locationCode,
      processId: data.processId,
      requestorRemarks: data.requestorRemarks,
      requestorUserName: data.requestorUserName,
      taskId: data.taskId,
      taskName: data.taskName,
      workflowType: data.workflowType,
      approvedDate: data.approvedDate,
      approvedby: data.approvedby,
      approverRemarks: data.approverRemarks,
      fiscalYear: data.fiscalYear
    };
  }

  static getAbManualApprovalRequestFromJson(data: any): any {
    if (!data) {
      return null;
    }

    return {
      approverRemarks: data.approverRemarks,
      approverRoleCode: data.approverRoleCode,
      approverUserName: data.approverUserName,
      level: data.level,
      processId: data.processId,
      requestorUserName: data.requestorUserName,
      taskId: data.taskId,
      taskStatus: data.taskStatus,
      totalApproverLevels: data.totalApproverLevels
    };
  }
}
