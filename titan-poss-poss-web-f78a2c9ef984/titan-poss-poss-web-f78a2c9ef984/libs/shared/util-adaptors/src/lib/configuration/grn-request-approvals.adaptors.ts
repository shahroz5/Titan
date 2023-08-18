import { GrnRequestApprovalListResponse } from '@poss-web/shared/models';
import * as moment from 'moment';
export class GrnRequestApprovalsAdaptors {
  static getGrnRequestList(data: any): GrnRequestApprovalListResponse[] {
    const grnRequestApprovalListResponse: GrnRequestApprovalListResponse[] = [];
    for (const req of data.results) {
      grnRequestApprovalListResponse.push({
        srcBoutiqueCode: req.headerData.data.srcLocationCode,
        destBoutiqueCode: req.headerData.data.destLocationCode,
        fiscalYear: req.fiscalYear,
        variantCode: req?.headerData?.data?.items[0].itemCode,
        lotNumber: req?.headerData?.data?.items[0].lotNumber,
        remarks: req.approverRemarks,
        pricePerUnit: req?.headerData?.data?.items[0].unitValue,
        itemWeight: req.headerData.data.totalWeight,
        cmDocNumber: req.headerData.data.refDocNo,
        isCmGoldRate: req?.approvedData?.data?.isCMGoldRate
          ? req?.approvedData?.data?.isCMGoldRate
          : '',
        grnComments: req.requestorRemarks,
        grnReasons: req.headerData.data.reasonForCancellation,
        approvedBy: req.headerData.data.approverRoleCode,
        approvalCode: req.headerData.data.approvalCode,
        approvalMailDated: req.headerData.data.approvalDate
          ? moment(req.headerData.data.approvalDate)
          : '',
        requestedDate: req.requestedDate
          ? moment(req.requestedDate)
          : '',
        id: req.headerData.data.id,
        refId: req.headerData.data.refId,
        returnedQty: req.headerData.data.totalQuantity,
        grnTotalPrice: req.headerData.data.totalValue,
        grnNumber: req.headerData.data.docNo,
        processId: req.processId,
        taskId: req.taskId,
        taskName: req.taskName,
        cancelType: req.headerData.data.cancelType,
        totalElements: data.totalElements
      });
    }
    return grnRequestApprovalListResponse;
  }
}
