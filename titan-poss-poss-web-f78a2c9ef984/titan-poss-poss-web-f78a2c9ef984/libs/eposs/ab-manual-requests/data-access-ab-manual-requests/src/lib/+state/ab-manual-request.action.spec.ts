import { AbManualApprovalRequestPayload, AbManualItemDetails, AbManualRequestDetailsPayload, AbManualRequestList, AbManualRequestListPayload, ApprovalRequest, CashMemoDetailsRequestPayload, CashMemoDetailsResponse, CashMemoItemDetailsRequestPayload, CustomErrors, StatusTypesEnum } from "@poss-web/shared/models"
import { CustomErrorAdaptor } from "@poss-web/shared/util-adaptors"
import * as moment from "moment"
import { AbManualApprovalRequest, AbManualApprovalRequestFailure, AbManualApprovalRequestSuccess, ClearAbManualRequestDetails, ClearAbManualRequestList, ConfirmManualAbManualFailure, FileDownloadUrl, FileDownloadUrlFailure, FileDownloadUrlSuccess, FileUploadListFailure, LoadAbManualProductDetails, LoadAbManualProductDetailsFailure, LoadAbManualProductDetailsSuccess, LoadAbManualProductList, LoadAbManualProductListFailure, LoadAbManualProductListSuccess, LoadAbManualRequestDetails, LoadAbManualRequestDetailsFailure, LoadAbManualRequestDetailsSuccess, LoadAbManualRequestList, LoadAbManualRequestListFailure, LoadAbManualRequestListSuccess, LoadProductDetails, LoadProductDetailsFailure, LoadProductDetailsSuccess, RESETFILTER } from './ab-manual-request.actions'
import { AbManualRequestActionTypes } from './ab-manual-request.actions'

describe('AbManualRequestActions Testing Suite', () => {
  describe('LoadAbManualRequestList', () => {
    it('should check correct type is used for LoadAbManualRequestList', () => {
      const payload: AbManualRequestListPayload = {
        approvalStatus: 'PENDING',
        appliedFilters: {},
        pageIndex: 0,
        pageSize: 10,
        workflowType: 'workFlow'
      }
      const action = new LoadAbManualRequestList(payload);
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.LOAD_AbManual_REQUEST_LIST,
        payload
      });
    })
    it('should check correct type is used for LoadAbManualRequestListSuccess', () => {
      const payload: AbManualRequestList[] = [{
        approvedBy: 'Admin',
        approvedDate: moment(16321145),
        approverRemarks: 'remarks',
        docDate: moment(16321146),
        docNo: 6,
        fiscalYear: 2022,
        headerData: {},
        processId: 'processId',
        requestedBy: 'Customer',
        requestedDate: moment(16321148),
        requestorRemarks: 'requestorRemarks',
        workflowType: 'workFlowType',
      }]
      const action = new LoadAbManualRequestListSuccess(payload);
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.LOAD_AbManual_REQUEST_LIST_SUCCESS,
        payload
      });
    })
    it('should check correct type is used for  LoadOrderPaymentsConfigListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAbManualRequestListFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AbManualRequestActionTypes.LOAD_AbManual_REQUEST_LIST_FAILURE,
        payload
      });
    });
  })

  describe('LoadAbManualRequestDetails', () => {
    it('should check correct type is used for LoadAbManualRequestDetails', () => {
      const payload: AbManualRequestDetailsPayload = {
        processId: 'id',
        workFlowType: 'workFlow'
      }
      const action = new LoadAbManualRequestDetails(payload);
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.LOAD_AbManual_REQUEST_DETAILS,
        payload
      });
    })
    it('should check correct type is used for LoadAbManualRequestDetailsSuccess', () => {

      const action = new LoadAbManualRequestDetailsSuccess('payload');
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.LOAD_AbManual_REQUEST_DETAILS_SUCCESS,
        payload: 'payload'
      });
    })
    it('should check correct type is used for LoadAbManualRequestDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAbManualRequestDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AbManualRequestActionTypes.LOAD_AbManual_REQUEST_DETAILS_FAILURE,
        payload
      });
    });
  })

  describe('LoadAbManualProductList', () => {
    it('should check correct type is used for LoadAbManualProductList', () => {
      const payload: CashMemoDetailsRequestPayload = {
        txnType: 'txnType',
        subTxnType: 'subTxnType'
      }
      const action = new LoadAbManualProductList(payload);
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_LIST,
        payload
      });
    })
    it('should check correct type is used for LoadAbManualProductListSuccess', () => {
      const payload: CashMemoDetailsResponse = {
        customerId: 1,
        cancelTxnId: 6,
        metalRateList: {},
        finalValue: 7,
        occasion: 'Birthday',
        otherChargesList: {},
        paidValue: 1000,
        discountDetails: {},
        focDetails: {},
        refTxnId: 'refTxnId',
        refTxnType: 'refTxnType',
        remarks: 'remarks',
        taxDetails: {
          cess: {
            cessCode: 'cessCode',
            cessOnTax: true,
            cessPercentage: 70,
            cessValue: 5
          },
          data: {
            taxCode: 'taxCode',
            taxPercentage: 10,
            taxValue: 7
          },
          taxClass: 'taxClass',
          taxType: 'taxType'
        },
        totalDiscount: 10,
        totalQuantity: 5,
        totalTax: 15,
        totalValue: 1000,
        totalWeight: 2345,
        docNo: 5,
        firstHoldTime: moment(16543211),
        fiscalYear: 2022,
        id: 'Id',
        lastHoldTime: moment(16543212),
        roundingVariance: 4,
        status: StatusTypesEnum.APPROVAL_PENDING,
        txnType: 'txnType',
        subTxnType: 'subTxnType',
        docDate: moment(16543222),
        employeeCode: 'empCode',
        txnTime: moment(16543216),
        customerDocDetails: 'docDetails',
        hallmarkCharges: 678,
        hallmarkDiscount: 15,
        refDocNo: 5,
        refFiscalYear: 2022,
        cancelRemarks: 'remarks',
        refSubTxnType: "refSubTxnType"
      }
      const action = new LoadAbManualProductListSuccess(payload);
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_LIST_SUCCESS,
        payload
      });
    })
    it('should check correct type is used for LoadAbManualProductListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAbManualProductListFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_LIST_FAILURE,
        payload
      });
    });
  })

  describe('LoadAbManualProductDetails', () => {
    it('should check correct type is used for LoadAbManualProductDetails', () => {
      const payload: CashMemoItemDetailsRequestPayload = {
        txnType: 'txnType',
        subTxnType: 'subTxnType',
        id: 'id'
      }
      const action = new LoadAbManualProductDetails(payload);
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_DETAILS,
        payload
      });
    })
    it('should check correct type is used for LoadAbManualProductDetailsSuccess', () => {
      const payload: AbManualItemDetails[] = [{
        itemCode: 'itemCode',
        lotNumber: 'Lot123',
        binCode: 'binCode',
        inventoryId: 'inventoryId',
        finalValue: 789,
        remarks: 'remarks',
        totalDiscount: 5,
        totalQuantity: 24,
        totalTax: 15,
        totalValue: 2300,
        totalWeight: 2,
        unitValue: 4,
        unitWeight: 56,
        employeeCode: 'empCode',
        discountDetails: {},
        focDetails: {},
        taxDetails: {
          cess: {
            cessCode: 'cessCode',
            cessOnTax: true,
            cessPercentage: 70,
            cessValue: 5
          },
          data: {
            taxCode: 'taxCode',
            taxPercentage: 10,
            taxValue: 7
          },
          taxClass: 'taxClass',
          taxType: 'taxType'
        },
        priceDetails: {
          isUcp: false,
          makingChargeDetails: {
            isDynamicPricing: false,
            makingChargePercentage: 3,
            preDiscountValue: 6,
            makingChargePct: 8,
            makingChargePgram: 9,
            wastagePct: 10
          },
          metalPriceDetails: {
            metalPrices: [{
              karat: 24,
              metalTypeCode: 'Gold',
              metalValue: 5,
              netWeight: 67,
              purity: 20,
              ratePerUnit: 45,
              type: 'type',
              weightUnit: '12'
            }],
            preDiscountValue: 1000
          },
          stonePriceDetails: {
            numberOfStones: 34,
            stoneWeight: 2,
            weightUnit: '34',
            preDiscountValue: 78,
            stoneWeightForView: 23,
            weightUnitForView: '12'
          },
          itemHallmarkDetails: {
            hallmarkGstPct: 2,
            hallmarkingCharges: 3,
            hmQuantity: 34,
            isFOCForHallmarkingCharges: false,
            isHallmarked: false
          },
          netWeight: 1200
        },
        inventoryWeightDetails: {
          type: 'Type',
          data: {
            goldWeight: 4,
            materialWeight: 7,
            platinumWeight: 9,
            silverWeight: 7,
            stoneWeight: 10,
            diamondWeight: 11
          }
        },
        isFoc: false,
        measuredWeightDetails: {
          type: 'Type',
          data: {
            goldWeight: 4,
            materialWeight: 7,
            platinumWeight: 9,
            silverWeight: 7,
            stoneWeight: 10,
            diamondWeight: 11
          }
        },
        productCategoryCode: 'prodCategory',
        productGroupCode: 'prodGroup',
        refTxnId: 'refTxn',
        refTxnType: 'refTxnType',
        rowId: 1,
        productCategoryDescription: 'prodCategoryDescription',
        productGroupDescription: 'prodGroupDescription',
        imageUrl: 'imageUrl'
      }]
      const action = new LoadAbManualProductDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_DETAILS_SUCCESS,
        payload
      });
    })
    it('should check correct type is used for LoadAbManualProductDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAbManualProductDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_DETAILS_FAILURE,
        payload
      });
    });
  })
  describe('LoadProductDetails', () => {
    it('should check correct type is used for LoadProductDetails', () => {
      const action = new LoadProductDetails('payload');
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.LOAD_PRODUCT_DETAILS,
        payload: 'payload'
      });
    })
    it('should check correct type is used for LoadProductDetailsSuccess', () => {
      const action = new LoadProductDetailsSuccess('payload');
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.LOAD_PRODUCT_DETAILS_SUCCESS,
        payload: 'payload'
      });
    })
    it('should check correct type is used for  LoadProductDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProductDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AbManualRequestActionTypes.LOAD_PRODUCT_DETAILS_FAILURE,
        payload
      });
    });
  })

  describe('FileDownloadUrl', () => {
    it('should check correct type is used for FileDownloadUrl', () => {
      const payload = {
        id: 'id',
        locationCode: 'CPD'
      }
      const action = new FileDownloadUrl(payload);
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.FILE_DOWNLOAD_URL,
        payload: payload
      });
    })
    it('should check correct type is used for FileDownloadUrlSuccess', () => {
      const action = new FileDownloadUrlSuccess('payload');
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.FILE_DOWNLOAD_URL_SUCCESS,
        payload: 'payload'
      });
    })
    it('should check correct type is used for FileDownloadUrlFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileDownloadUrlFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AbManualRequestActionTypes.FILE_DOWNLOAD_URL_FAILURE,
        payload
      });
    });
  })

  describe('AbManualApprovalRequest', () => {
    it('should check correct type is used for AbManualApprovalRequest', () => {
      const payload: AbManualApprovalRequestPayload = {
        isApprove: false,
        requestBody: {},
        processId: 'processId',
        taskId: 'taskId',
        taskName: 'taskName'
      }
      const action = new AbManualApprovalRequest(payload);
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.AbManual_APPROVAL_REQUEST,
        payload: payload
      });
    })
    it('should check correct type is used for AbManualApprovalRequestSuccess', () => {
      const payload: ApprovalRequest = {
        approverRemarks: 'approved',
        approverRoleCode: 'roleCode',
        approverUserName: 'name',
        level: 2,
        processId: 'processId',
        requestorUserName: 'customer',
        taskId: 'taskId',
        taskStatus: 'PENDING',
        totalApproverLevels: 4
      }
      const action = new AbManualApprovalRequestSuccess(payload);
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.AbManual_APPROVAL_REQUEST_SUCCESS,
        payload: payload
      });
    })
    it('should check correct type is used for AbManualApprovalRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AbManualApprovalRequestFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AbManualRequestActionTypes.AbManual_APPROVAL_REQUEST_FAILURE,
        payload
      });
    });
  })

  describe('ClearAbManualRequestList', () => {
    it('should check correct type is used for ClearAbManualRequestList', () => {
      const action = new ClearAbManualRequestList();
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.CLEAR_AbManual_REQUEST_LIST,
      });
    })
  })

  describe('ClearAbManualRequestDetails', () => {
    it('should check correct type is used for ClearAbManualRequestDetails', () => {
      const action = new ClearAbManualRequestDetails();
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.CLEAR_AbManual_REQUEST_DETAILS,
      });
    })
  })

  describe('RESETFILTER', () => {
    it('should check correct type is used for RESETFILTER', () => {
      const action = new RESETFILTER();
      expect({ ...action }).toEqual({
        type: AbManualRequestActionTypes.RESET_FILTER,
      });
    })
  })

  describe('FileUploadListFailure', () => {
    it('should check correct type is used for FileUploadListFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileUploadListFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AbManualRequestActionTypes.FILE_UPLOAD_LIST_FAILURE,
        payload
      });
    })
  })

  describe('ConfirmManualAbManualFailure', () => {
    it('should check correct type is used for ConfirmManualAbManualFailure', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ConfirmManualAbManualFailure(payload);

      expect({ ...action }).toEqual({
        type:
        AbManualRequestActionTypes.CONFIRM_MANUAL_AbManual_FAILURE,
        payload
      });
    })
  })
})
