import { StatusTypesEnum, TransactionTypeEnum } from "libs/shared/models/src/lib/cash-memo/cash-memo.enum";
import {
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  FileUploadDownloadPayload,
  FileUploadLists
} from "libs/shared/models/src/lib/cash-memo/cash-memo.model";
import { ApprovalRequest, GRFRequestList, grfRequestListPayload } from "libs/shared/models/src/lib/manual-cm-request/cm-request.model";
import { CustomErrorAdaptor } from "libs/shared/util-adaptors/src/lib/error.adaptors";
import * as moment from "moment";
import {
  ClearGrfRequestDetails,
  FileUploadList,
  FileUploadListSuccess,
  GrfApprovalRequestSuccess,
  LoadGrfProductDetailsSuccess,
  LoadGrfProductListSuccess,
  LoadGrfRequestList,
  LoadGrfRequestListFailure,
  LoadGrfRequestListSuccess
} from "./grf-request.actions";
import { cmRequestReducer, initialState } from "./grf-request.reducer";
import { CmRequestState } from "./grf-request.state";

describe('GRF Manual Request Reducer Testing Suite', () => {
  const cashMemoDetailsResponse: CashMemoDetailsResponse = {
    customerId: 1,
    cancelTxnId: 1,
    discountDetails: 0,
    docDate: moment(),
    docNo: 1,
    employeeCode: '',
    finalValue: 123,
    firstHoldTime: moment(),
    fiscalYear: 2015,
    focDetails: {},
    id: '',
    taxDetails: {
      cess: {
        cessCode: 'cess code',
        cessOnTax: false,
        cessPercentage: 3,
        cessValue: 3400
      },
      data: {
        taxCode: 'CGST',
        taxPercentage: 1.5,
        taxValue: 437.47
      },
      taxClass: 'TC72',
      taxType: 'ITEMCHARGES'
    },
    lastHoldTime: moment(),
    metalRateList: {},
    occasion: '',
    txnType: '',
    otherChargesList: {},
    paidValue: 1,
    refTxnId: '',
    refTxnType: '',
    remarks: '',
    roundingVariance: 1,
    status: StatusTypesEnum.APPROVED,
    subTxnType: '',
    totalDiscount: 1,
    totalQuantity: 1,
    totalTax: 1,
    totalValue: 1,
    totalWeight: 1,
    txnTime: moment(),
    customerDocDetails: null,
    refSubTxnType: 'MANUAL_AB',
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    refDocNo: 0,
    refFiscalYear: 0,
    cancelRemarks: '',
  };

  it('should return the initial state', () => {
    const action: any = {};
    const state: CmRequestState = cmRequestReducer(null, action);

    expect(initialState).toBe(initialState);
  })
  describe('Testing LoadGrfRequestList Functionality', () => {
    it('LoadGrfRequestList should be called', () => {
      const payload: grfRequestListPayload = {
        approvalStatus: 'PENDING',
        appliedFilters: {},
        pageIndex: 0,
        pageSize: 10,
        workflowType: 'MANUAL_BILL'
      }
      const action = new LoadGrfRequestList(payload);
      const result: CmRequestState = cmRequestReducer(null, action);
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    })
    it('LoadGrfRequestListSuccess should be called', () => {
      const payload: GRFRequestList[] = [{
        approvalStatus: 'PENDING',
        approvedBy: null,
        approvedDate: null,
        approverRemarks: null,
        docDate: moment(1625582616979),
        docNo: 23,
        fiscalYear: 2020,
        headerData: { type: 'MANUAL_BILL_HEADER' },
        locationCode: 'CPD',
        processId: '8BDAA81B-DE68-11EB-BBE7-00155DDE1995',
        requestedBy: 'cashiercpd',
        requestedDate: moment(1625582616979),
        requestorRemarks: 'remarks',
        taskId: '8be44538-de68-11eb-bbe7-00155dde1995',
        taskName: 'REQUEST_APPROVER_L1',
        workflowType: 'MANUAL_BILL'
      }]
      const action = new LoadGrfRequestListSuccess(payload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.cmRequestList).toBeTruthy();
    })
    it('LoadGrfRequestListFailure should be called', () => {
      const action = new LoadGrfRequestListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CmRequestState = cmRequestReducer(null, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  })

  describe('Testing FileUploadList Functionality', () => {
    it('FileUploadList should be called', () => {
      const payload:  FileUploadDownloadPayload = {
        txnType: TransactionTypeEnum.GRF,
        id: '1'
      }
      const action = new FileUploadList(payload);
      const result: CmRequestState = cmRequestReducer(null, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    })
    it('FileUploadListSuccess should be called', () => {
      const payload:  FileUploadLists[] = [{
        id: '1',
        name: 'file'
      }]
      const action = new FileUploadListSuccess(payload);
      const result: CmRequestState = cmRequestReducer(null, action);
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    })
  })

  describe('Testing LoadGrfProductList Functionality', () => {
    it('LoadGrfProductListSuccess should be called', () => {
      const action = new LoadGrfProductListSuccess(cashMemoDetailsResponse);
      const result: CmRequestState = cmRequestReducer(null, action);
      expect(result.isLoading).toEqual(false);
    })
  })

  describe('Testing LoadGrfProductDetails Functionality', () => {
    it('LoadGrfProductDetailsSuccess should be called', () => {
      const payload: CashMemoItemDetails[] = [{
        itemCode: '123',
          lotNumber: 'LOTNUMBER',
          binCode: 'CHAIN',
          inventoryId: 'TestId',
          finalValue: 123,
          remarks: 'remarks',
          totalDiscount: 1,
          totalQuantity: 12,
          totalTax: 1,
          totalValue: 826133,
          totalWeight: 269.728,
          unitValue: 60002.3,
          unitWeight: 12.081,
          employeeCode: 'code',
          discountDetails: {},
          focDetails: {},
          taxDetails: {
            cess: {
              cessCode: 'cess code',
              cessOnTax: false,
              cessPercentage: 3,
              cessValue: 3400
            },
            data: {
              taxCode: 'CGST',
              taxPercentage: 1.5,
              taxValue: 437.47
            },
            taxClass: 'TC72',
            taxType: 'ITEMCHARGES'
          },
          priceDetails: {
            isUcp: true,
            makingChargeDetails: {
              isDynamicPricing: false,
              makingChargePercentage: 26.5,
              preDiscountValue: 612.0,
              makingChargePct: 0,
              makingChargePgram: 0,
              wastagePct: 12.5
            },
            metalPriceDetails: {
              metalPrices: [{
                karat: 0,
                metalTypeCode: 'J',
                metalValue: 46948.85,
                netWeight: 3.123,
                purity: 12,
                ratePerUnit: 4762,
                type: 'type',
                weightUnit: 'gms'
              }],
              preDiscountValue: 67
            },
            stonePriceDetails: {
              numberOfStones: null,
              stoneWeight: 0,
              weightUnit: 'gms',
              preDiscountValue: 612.0,
              stoneWeightForView: null,
              weightUnitForView: null
            },
            itemHallmarkDetails: {
              hallmarkGstPct: 12,
              hallmarkingCharges: 120,
              hmQuantity: 1,
              isFOCForHallmarkingCharges: false,
              isHallmarked: true
            },
            netWeight: 67
          },
          inventoryWeightDetails: {
            type: 'type',
            data: {
              goldWeight: 12.081,
              materialWeight: 0,
              platinumWeight: 0.0,
              silverWeight: 0.0,
              stoneWeight: null,
              diamondWeight: 0
            }
          },
          isFoc: false,
          measuredWeightDetails: {
            type: '5',
            data: {
              goldWeight: 12.081,
              materialWeight: 0,
              platinumWeight: 0,
              silverWeight: 0.0,
              stoneWeight: 12.33,
              diamondWeight: 0.0
          }
        },
        productCategoryCode: 'Test1',
        productGroupCode: 'Test2',
        refTxnId: 'RefTxnId',
        refTxnType: 'RefTxnType',
        refSubTxnType: 'SubTxnType',
        hallmarkCharges: 23,
        hallmarkDiscount: 4,
        rowId: 1,
        reason: 'reason'
      }]
      const action = new LoadGrfProductDetailsSuccess(payload);
      const result: CmRequestState = cmRequestReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
    })

    describe('Testing GrfApprovalRequest Functionality', () => {
      it('GrfApprovalRequestSuccess should be called', () => {
        const payload: ApprovalRequest = {
          approverRemarks: 'APPROVING IT',
          approverRoleCode: 'A1',
          approverUserName: 'Approver1',
          level: 1,
          processId: '1',
          requestorUserName: 'Requestor1',
          taskId: '123',
          taskStatus: 'APPROVED',
          totalApproverLevels: 3
        }
        const action = new GrfApprovalRequestSuccess(payload);
        const result: CmRequestState = cmRequestReducer(null, action);
        expect(result.isLoading).toEqual(false);
      })
    })

    describe('Testing ClearGrfRequestDetails Functionality', () => {
      it('ClearGrfRequestDetails should be called', () => {
        const action = new ClearGrfRequestDetails();
        const result: CmRequestState = cmRequestReducer(initialState, action);
        expect(result.isLoading).toEqual(false);
      })
    })
  })
})
