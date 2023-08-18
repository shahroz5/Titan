import { AbManualRequestReducer, initialState } from "./ab-manual-request.reducer"
import * as actions from './ab-manual-request.actions';
import { AbManualItemDetails, AbManualRequestList, AbManualRequestListPayload, ApprovalRequest, CashMemoDetailsResponse, CustomErrors, FileUploadDownloadPayload, FileUploadLists, StatusTypesEnum, TransactionTypeEnum } from "@poss-web/shared/models";
import { AbManualRequestState } from "./ab-manual-request.state";
import { CustomErrorAdaptor } from "@poss-web/shared/util-adaptors";
import * as moment from "moment";

describe('AbManualRequestReducer Testing Suite', () => {
  const testState = initialState;

  describe('LoadAbManualRequestList', () => {
    beforeEach(() => {});
    it('LoadAbManualRequestList should set proper values in state', () => {
      const payload: AbManualRequestListPayload = {
        approvalStatus: 'PENDING',
        appliedFilters: {},
        pageIndex: 0,
        pageSize: 10,
        workflowType: 'workFlow'
      }
      const action = new actions.LoadAbManualRequestList(payload);

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    })
    it('Load LoadAbManualRequestListFailure should set proper values in state', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );

      const action = new actions.LoadAbManualRequestListFailure(payload);

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.hasError).toBe(payload);
    });
  })

  describe('FileUploadList', () => {
    it('FileUploadList should set proper values in state', () => {
      const payload: FileUploadDownloadPayload = {
        txnType: TransactionTypeEnum.AB,
        id: 'id'
      }
      const action = new actions.FileUploadList(payload);

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    })
    it('FileUploadListSuccess should set proper values in state', () => {
      const payload: FileUploadLists[] = [{
        id: 'id',
        name: 'name'
      }]
      const action = new actions.FileUploadListSuccess(payload);

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.hasError).toBe(null);
    })
  })

  describe('FileDownloadUrl', () => {
    it('FileDownloadUrl should set proper values in state', () => {
      const payload = {
        id: 'id',
        locationCode: 'CPD'
      }
      const action = new actions.FileDownloadUrl(payload);

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.hasError).toBe(null);
    })
    it('FileUploadListSuccess should set proper values in state', () => {
      const action = new actions.FileDownloadUrlSuccess('payload');

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.hasError).toBe(null);
    })
  })

  describe('LoadAbManualRequestList', () => {
    it('LoadAbManualRequestListSuccess should set proper values in state', () => {
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
      const action = new actions.LoadAbManualRequestListSuccess(payload);

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
    })
  })

  describe('LoadAbManualProductList', () => {
    it('LoadAbManualProductListSuccess should set proper values in state', () => {
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
      const action = new actions.LoadAbManualProductListSuccess(payload);

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
    })
  })

  describe('LoadAbManualProductDetails', () => {
    it('LoadAbManualProductDetailsSuccess should set proper values in state', () => {
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
      const action = new actions.LoadAbManualProductDetailsSuccess(payload);

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
    })
  })

  describe('abManualApprovalRequest', () => {
    it('abManualApprovalRequestSuccess should set proper values in state', () => {
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
      const action = new actions.AbManualApprovalRequestSuccess(payload);

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
    })
  })

  describe('ConfirmManualAbManual', () => {
    it('ConfirmManualAbManualSuccess should set proper values in state', () => {
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
      const action = new actions.ConfirmManualAbManualSuccess(payload);

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
    })
  })

  describe('ClearAbManualRequestList', () => {
    it('ClearAbManualRequestList should set proper values in state', () => {
      const action = new actions.ClearAbManualRequestList();

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
    })
  })

  describe('LoadProductDetails', () => {
    it('LoadProductDetailsSuccess should set proper values in state', () => {
      const action = new actions.LoadProductDetailsSuccess('payload');

      const result: AbManualRequestState = AbManualRequestReducer(
        testState,
        action
      );
      expect(result.isLoading).toBe(false);
    })
  })
})
