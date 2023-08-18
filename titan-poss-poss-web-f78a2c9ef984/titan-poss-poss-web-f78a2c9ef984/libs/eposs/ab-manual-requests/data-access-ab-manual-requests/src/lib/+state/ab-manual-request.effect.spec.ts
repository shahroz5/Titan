import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { DataPersistence } from "@nrwl/angular";
import { CashMemoService } from "@poss-web/poss/cash-memo/data-access-cash-memo";
import { POSS_WEB_API_URL, POSS_WEB_CACHING_STRATEGY } from "@poss-web/shared/util-config";
import { Observable } from "rxjs";
import { hot, cold } from 'jasmine-marbles';
import { provideMockStore } from "@ngrx/store/testing";
import { provideMockActions } from '@ngrx/effects/testing';
import { AbManualRequestService } from "../ab-manual-request.service";
import { AbManualRequestEffects } from './ab-manual-request.effects';
import { AbManualApprovalRequest, AbManualApprovalRequestFailure, AbManualApprovalRequestSuccess, ClearAbManualRequestList, ConfirmManualAbManual, ConfirmManualAbManualFailure, ConfirmManualAbManualSuccess, LoadAbManualProductDetails, LoadAbManualProductDetailsFailure, LoadAbManualProductDetailsSuccess, LoadAbManualProductList, LoadAbManualProductListFailure, LoadAbManualProductListSuccess, LoadAbManualRequestDetails, LoadAbManualRequestDetailsFailure, LoadAbManualRequestDetailsSuccess, LoadAbManualRequestList, LoadAbManualRequestListFailure, LoadAbManualRequestListSuccess, LoadProductDetails, LoadProductDetailsFailure, LoadProductDetailsSuccess } from "./ab-manual-request.actions";
import { CustomErrorAdaptor } from "@poss-web/shared/util-adaptors";
import * as moment from "moment";
import { AbManualApprovalRequestPayload, AbManualItemDetails, AbManualRequestDetailsPayload, AbManualRequestList, AbManualRequestListPayload, ApprovalRequest, CashMemoDetailsRequestPayload, CashMemoDetailsResponse, CashMemoItemDetailsRequestPayload, StatusTypesEnum } from "@poss-web/shared/models";

const abManualRequestList: AbManualRequestList[] = [{
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

const abManualRequestListPayload: AbManualRequestListPayload = {
  approvalStatus: 'PENDING',
  appliedFilters: {},
  pageIndex: 0,
  pageSize: 10,
  workflowType: 'Ab manual request'
}

const abManualRequestDetailsPayload: AbManualRequestDetailsPayload = {
  processId: 'id',
  workFlowType: 'workFlow'
}

const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
  txnType: 'txnType',
  subTxnType: 'subTxnType'
}

const cashMemoDetailsResponse: CashMemoDetailsResponse = {
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

const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
  txnType: 'txnType',
  subTxnType: 'subTxnType',
  id: 'id'
}

const abManualItemDetails: AbManualItemDetails = {
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
}

const abManualApprovalRequestPayload: AbManualApprovalRequestPayload = {
  isApprove: false,
  requestBody: {},
  processId: 'processId',
  taskId: 'taskId',
  taskName: 'taskName'
}

const approvalRequest: ApprovalRequest = {
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





describe('AbManualRequestEffects Testing Suite', () => {
let actions$: Observable<any>;
let effect: AbManualRequestEffects;
const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
  'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let abManualRequestService = jasmine.createSpyObj<AbManualRequestService>(
    'AbManualRequestService',
    [
      'getAbManualRequestList',
      'getAbManualRequestDetails',
      'getAbManualProductList',
      'getAbManualProductDetails',
      'getProductDetails',
      'getAbManualApprovalRequest',
      'uploadFileList',
      'downloadFile'
    ]
  )
  let cashMemoService = jasmine.createSpyObj<CashMemoService>(
    'CashMemoService',
    [
      'updateCashMemo'
    ]
  )
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AbManualRequestEffects,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: AbManualRequestService,
          useValue: {
            getAbManualRequestList: jasmine.createSpy(),
            getAbManualRequestDetails: jasmine.createSpy(),
            getAbManualProductList: jasmine.createSpy(),
            getAbManualProductDetails: jasmine.createSpy(),
            getProductDetails: jasmine.createSpy(),
            getAbManualApprovalRequest: jasmine.createSpy(),
            uploadFileList: jasmine.createSpy(),
            downloadFile: jasmine.createSpy(),
          }
        },
        {
          provide: CashMemoService,
          useValue: {
            updateCashMemo: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(AbManualRequestEffects);
    cashMemoService = TestBed.inject<any>(CashMemoService);
    abManualRequestService = TestBed.inject<any>(AbManualRequestService)
  })

  describe('loadAbManualRequestList', () => {
    it('should return loadAbManualRequestList response', () => {
      const action = new LoadAbManualRequestList(abManualRequestListPayload);
      const outcome = new LoadAbManualRequestListSuccess(abManualRequestList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: abManualRequestList
      })

      abManualRequestService.getAbManualRequestList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadAbManualRequestList$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new LoadAbManualRequestList(abManualRequestListPayload);
      const outcome = new ClearAbManualRequestList();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {});
      abManualRequestService.getAbManualRequestList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAbManualRequestList$).toBeObservable(expected);
    });
  })

  describe('loadAbManualRequestDetails', () => {
    it('should return loadAbManualRequestDetails response', () => {
      const action = new LoadAbManualRequestDetails(abManualRequestDetailsPayload);
      const outcome = new LoadAbManualRequestDetailsSuccess('response');

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: 'response'
      })

      abManualRequestService.getAbManualRequestDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadAbManualRequestDetails$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new LoadAbManualRequestDetails(abManualRequestDetailsPayload);
      const error = new Error('some error');
      const outcome = new LoadAbManualRequestDetailsFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      abManualRequestService.getAbManualRequestDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAbManualRequestDetails$).toBeObservable(expected);
    });
  })

  describe('loadAbManualProductList', () => {
    it('should return loadAbManualProductList response', () => {
      const action = new LoadAbManualProductList(cashMemoDetailsRequestPayload);
      const outcome = new LoadAbManualProductListSuccess(cashMemoDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoDetailsResponse
      })

      abManualRequestService.getAbManualProductList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadAbManualProductList$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new LoadAbManualProductList(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new LoadAbManualProductListFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      abManualRequestService.getAbManualProductList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAbManualProductList$).toBeObservable(expected);
    });
  })

  describe('loadAbManualProductDetails', () => {
    /* it('should return loadAbManualProductDetails response', () => {
      const action = new LoadAbManualProductDetails(cashMemoItemDetailsRequestPayload);
      const outcome = new LoadAbManualProductDetailsSuccess(abManualItemDetails);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: abManualItemDetails
      })
      abManualRequestService.getAbManualProductDetails.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadAbManualProductDetails$).toBeObservable(expected$);
    }) */
    it('should fail and return an action with the error', () => {
      const action = new LoadAbManualProductDetails(cashMemoItemDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new LoadAbManualProductDetailsFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      abManualRequestService.getAbManualProductDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAbManualProductDetails$).toBeObservable(expected);
    });
  })

  describe('loadProductDetails', () => {
    it('should return loadProductDetails response', () => {
      const action = new LoadProductDetails('LoadProductDetails');
      const outcome = new LoadProductDetailsSuccess([ 'LoadProductDetailsSuccess' ]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: 'LoadProductDetailsSuccess'
      })
      abManualRequestService.getProductDetails.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadProductDetails$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new LoadProductDetails(cashMemoItemDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new LoadProductDetailsFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      abManualRequestService.getProductDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductDetails$).toBeObservable(expected);
    });
  })

  describe('abmanualApprovalRequest', () => {
    it('should return abmanualApprovalRequest response', () => {
      const action = new AbManualApprovalRequest(abManualApprovalRequestPayload);
      const outcome = new AbManualApprovalRequestSuccess(approvalRequest);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: approvalRequest
      })

      abManualRequestService.getAbManualApprovalRequest.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.abmanualApprovalRequest$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new AbManualApprovalRequest(abManualApprovalRequestPayload);
      const error = new Error('some error');
      const outcome = new AbManualApprovalRequestFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      abManualRequestService.getAbManualApprovalRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.abmanualApprovalRequest$).toBeObservable(expected);
    });
  })

  describe('confirmManualAbManual', () => {
    it('should return confirmManualAbManual response', () => {
      const action = new ConfirmManualAbManual(cashMemoDetailsRequestPayload);
      const outcome = new ConfirmManualAbManualSuccess(cashMemoDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoDetailsResponse
      })

      cashMemoService.updateCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.confirmManualAbManual$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new ConfirmManualAbManual(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new ConfirmManualAbManualFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoService.updateCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmManualAbManual$).toBeObservable(expected);
    });
  })
})
