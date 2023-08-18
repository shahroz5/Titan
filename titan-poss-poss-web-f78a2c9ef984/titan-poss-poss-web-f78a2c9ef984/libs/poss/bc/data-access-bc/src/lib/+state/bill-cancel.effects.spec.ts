import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  LovDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  bcHistoryResponse,
  BillCancelPayload,
  CancelResponse,
  CashMemoDetailsRequestPayload,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  CashMemoItemDetailsRequestPayload,
  CmBillList,
  CmBillListPayload,
  ConfirmResponse,
  Lov,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { cold, hot } from 'jasmine-marbles';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { BillCancelService } from '../bill-cancel.service';
import {
  CancelRequest,
  CancelRequestFailure,
  CancelRequestSuccess,
  CancelType,
  CancelTypeFailure,
  CancelTypePayload,
  CancelTypeSuccess,
  ConfirmRequest,
  ConfirmRequestFailure,
  ConfirmRequestSuccess,
  GetItemfromCashMemo,
  GetItemfromCashMemoFailure,
  GetItemfromCashMemoSuccess,
  LoadBCHistory,
  LoadBCHistoryFailure,
  LoadBCHistorySuccess,
  LoadCmBillList,
  LoadCmBillListFailure,
  LoadCmBillListSuccess,
  LoadReasonForCancel,
  LoadReasonForCancelFailure,
  LoadReasonForCancelSuccess,
  LoadRSODetails,
  LoadRSODetailsFailure,
  LoadRSODetailsSuccess,
  ViewCashMemo,
  ViewCashMemoFailure,
  ViewCashMemoSuccess
} from './bill-cancel.actions';
import { BillCancelEffects } from './bill-cancel.effects';
import { BILL_CANCEL_FEATURE_KEY, initialState } from './bill-cancel.reducer';

describe('Bill Cancel Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BillCancelEffects;

  const billCancelServiceSpy = jasmine.createSpyObj<BillCancelService>([
    'confirm',
    'cancel',
    'viewCashMemo',
    'getItemFromCashMemo',
    'getCmBillList',
    'CancelType',
    'getHistoryItems'
  ]);

  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getSalesLovs'
  ]);

  const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>([
    'getStoreUsers'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BillCancelEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [BILL_CANCEL_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: BillCancelService,
          useValue: billCancelServiceSpy
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(BillCancelEffects);
  });

  describe('viewCashMemo', () => {
    const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM'
    };

    const cashMemoDetailsResponse: CashMemoDetailsResponse = {
      customerId: 1,
      cancelTxnId: 1,
      discountDetails: 0,
      docDate: moment(12345678),
      docNo: 1,
      employeeCode: 'code',
      finalValue: 123,
      firstHoldTime: moment(1610012299519),
      fiscalYear: 2015,
      focDetails: {},
      id: '2',
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
      occasion: 'Wedding',
      txnType: 'MANUAL_GRF',
      otherChargesList: {},
      paidValue: 721,
      refTxnId: null,
      refTxnType: '',
      remarks: 'APPROVING IT',
      roundingVariance: 1,
      status: StatusTypesEnum.APPROVED,
      subTxnType: 'SUB_TXN',
      totalDiscount: 1,
      totalQuantity: 12,
      totalTax: 1800.6,
      totalValue: 826133,
      totalWeight: 269.728,
      txnTime: moment(161111093),
      customerDocDetails: null,
      refSubTxnType: 'MANUAL_AB',
      hallmarkCharges: 0,
      hallmarkDiscount: 0,
      refDocNo: 0,
      refFiscalYear: 0,
      cancelRemarks: ''
    };

    it('should return a ViewCashMemo', () => {
      const action = new ViewCashMemo(cashMemoDetailsRequestPayload);
      const outcome = new ViewCashMemoSuccess(cashMemoDetailsResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: cashMemoDetailsResponse });
      billCancelServiceSpy.viewCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.viewCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ViewCashMemo(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new ViewCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.viewCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.viewCashMemo$).toBeObservable(expected);
    });
  });

  describe('getItemToCashMemo', () => {
    const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM',
      itemId: '741B3399-ED98-44D8-B25D-BBDADCA2F1D2'
    };

    const CmItemDetailsResponse: CashMemoItemDetails = {
      itemCode: '503820DCEABAP1',
      lotNumber: '2EA000011',
      // inventoryWeight: 12.081
      unitWeight: 12.081,
      totalWeight: 12.05,
      totalQuantity: 1,
      inventoryId: 'AAB96E94-3AF9-4ADD-A6FC-0044417CDD67',
      unitValue: 60002.3,
      totalValue: 60002.3,
      totalDiscount: 0.0,
      finalValue: 61802.36,
      totalTax: 1800.06,
      employeeCode: 'rsocpd',
      remarks: 'asd',
      reason: null,
      itemId: '741B3399-ED98-44D8-B25D-BBDADCA2F1D2',
      binCode: 'ZEROBIN',
      rowId: 1,
      refTxnId: null,
      refTxnType: null,
      inventoryWeightDetails: {
        type: 'WEIGHT_DETAILS',
        data: {
          goldWeight: 12.081,
          platinumWeight: 0,
          silverWeight: 0,
          stoneWeight: 0.53,
          materialWeight: 0,
          diamondWeight: 0.0
        }
      },
      measuredWeightDetails: {
        type: 'WEIGHT_DETAILS',
        data: {
          silverWeight: 0.0,
          stoneWeight: 0,
          materialWeight: 0,
          goldWeight: 0.0,
          diamondWeight: 0,
          platinumWeight: 0.0
        }
      },
      priceDetails: {
        isUcp: false,
        netWeight: 3,
        metalPriceDetails: {
          preDiscountValue: 46948.85,
          metalPrices: [
            {
              weightUnit: 'gms',
              netWeight: 12.05,
              metalValue: 46948.85,
              type: 'Gold',
              ratePerUnit: 3896.17,
              karat: 18.0,
              purity: 75.0,
              metalTypeCode: 'J'
            }
          ]
        },
        stonePriceDetails: {
          preDiscountValue: 612.0,
          weightUnit: null,
          stoneWeight: null,
          numberOfStones: null,
          stoneWeightForView: null,
          weightUnitForView: null
        },
        makingChargeDetails: {
          preDiscountValue: 12441.45,
          makingChargePercentage: 26.5,
          makingChargePct: 5,
          makingChargePgram: 6,
          wastagePct: 7,
          isDynamicPricing: true
        },
        itemHallmarkDetails: {
          hallmarkGstPct: 12,
          hallmarkingCharges: 120,
          hmQuantity: 1,
          isFOCForHallmarkingCharges: true,
          isHallmarked: true
        }
      },
      taxDetails: {
        taxType: 'ITEMCHARGES',
        taxClass: 'TC75',
        data: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
        cess: null
      },
      productGroupCode: '75',
      productCategoryCode: 'D',
      discountDetails: null,
      focDetails: {},
      isFoc: true,
      itemInStock: true,
      refSubTxnType: 'NEW_AB',
      hallmarkCharges: 350,
      hallmarkDiscount: 350
    };

    it('should return a GetItemfromCashMemo', () => {
      const action = new GetItemfromCashMemo(cashMemoItemDetailsRequestPayload);
      const outcome = new GetItemfromCashMemoSuccess(CmItemDetailsResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: CmItemDetailsResponse
      });
      billCancelServiceSpy.getItemFromCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.getItemToCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetItemfromCashMemo(cashMemoItemDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new GetItemfromCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.getItemFromCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getItemToCashMemo$).toBeObservable(expected);
    });
  });

  describe('confirm', () => {
    const billCancelPayload: BillCancelPayload = {
      cancelType: 'CANCEL_WITH_CN',
      employeeCode: 'rso',
      reasonForCancellation: 'test',
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      remarks: 'test'
    };

    const confirmResponse: ConfirmResponse = {
      docNo: 12,
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      requestNo: '90'
    };

    it('should return a ConfirmRequest', () => {
      const action = new ConfirmRequest(billCancelPayload);
      const outcome = new ConfirmRequestSuccess(confirmResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: confirmResponse
      });
      billCancelServiceSpy.confirm.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.confirm$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ConfirmRequest(billCancelPayload);
      const error = new Error('some error');
      const outcome = new ConfirmRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.confirm.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirm$).toBeObservable(expected);
    });
  });

  describe('confirm', () => {
    const billCancelPayload: BillCancelPayload = {
      cancelType: 'CANCEL_WITH_CN',
      employeeCode: 'rso',
      reasonForCancellation: 'test',
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      remarks: 'test'
    };

    const cancelResponse: CancelResponse = {
      cndocNos: [234, 235],
      docNo: 12,
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28'
    };

    it('should return a cancelRequest', () => {
      const action = new CancelRequest(billCancelPayload);
      const outcome = new CancelRequestSuccess(cancelResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: cancelResponse
      });
      billCancelServiceSpy.cancel.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.cancel$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CancelRequest(billCancelPayload);
      const error = new Error('some error');
      const outcome = new CancelRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.cancel.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cancel$).toBeObservable(expected);
    });
  });

  describe('cmBillList', () => {
    const cmBillListPayload: CmBillListPayload = {
      subTxnType: 'NEW_CM',
      txnType: 'CM',
      sort: 'docDate, DESC'
      // customerName?: string;
      // refDocNo?: number;
      // pageIndex?: number;
      // pageSize?: number;
    };

    const cmBillList: CmBillList[] = [
      {
        currencyCode: 'INR',
        customerName: 'SREENIVAS',
        refDocDate: moment(1611081000000),
        refDocNo: 54,
        refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
        refTxnTime: moment(1611110936440),
        subTxnType: 'NEW_CM',
        totalValue: 60002.3,
        txnType: 'CM',
        totalElements: 10
      }
    ];

    it('should return a cmBillList', () => {
      const action = new LoadCmBillList(cmBillListPayload);
      const outcome = new LoadCmBillListSuccess(cmBillList);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: cmBillList
      });
      billCancelServiceSpy.getCmBillList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.cmBillList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCmBillList(cmBillListPayload);
      const error = new Error('some error');
      const outcome = new LoadCmBillListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.getCmBillList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cmBillList$).toBeObservable(expected);
    });
  });

  describe('LoadReasonForCancel', () => {
    const LOVCode = 'REASON_FOR_CANCELLATION';

    const dummyReasonForCancelResponse: Lov[] = [
      {
        code: 'CM',
        isActive: true,
        value: 'Cash Memo'
      }
    ];
    it('should return a LoadReasonForCancel', () => {
      const action = new LoadReasonForCancel(LOVCode);
      const outcome = new LoadReasonForCancelSuccess(
        dummyReasonForCancelResponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyReasonForCancelResponse
      });
      lovDataServiceSpy.getSalesLovs.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.reasonForCancel$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadReasonForCancel(LOVCode);
      const error = new Error('some error');
      const outcome = new LoadReasonForCancelFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      lovDataServiceSpy.getSalesLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.reasonForCancel$).toBeObservable(expected);
    });
  });

  describe('LoadRSODetails', () => {
    const RSOCode = 'RSO';

    const RSOResponae = ['RSO'];

    const storeUserResponse = [
      {
        empName: 'RSO',
        employeeCode: 'RSO',
        locationCode: 'CPD',
        mobileNo: '9876543210'
      }
    ];

    it('should return a LoadRSODetails', () => {
      const action = new LoadRSODetails(RSOCode);
      const outcome = new LoadRSODetailsSuccess(RSOResponae);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: storeUserResponse
      });

      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadRSODetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRSODetails(RSOCode);
      const error = new Error('some error');
      const outcome = new LoadRSODetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRSODetails$).toBeObservable(expected);
    });
  });

  describe('CancelType', () => {
    const cancelTypePayload: CancelTypePayload = {
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM'
    };

    const cancelTypeResponse = ['CANCEL_WITH_CN', 'CANCEL_WITH_RETURN'];

    it('should return a CancelType', () => {
      const action = new CancelType(cancelTypePayload);
      const outcome = new CancelTypeSuccess(cancelTypeResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: cancelTypeResponse
      });

      billCancelServiceSpy.CancelType.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.cancelType$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CancelType(cancelTypePayload);
      const error = new Error('some error');
      const outcome = new CancelTypeFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.CancelType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cancelType$).toBeObservable(expected);
    });
  });

  describe('confirm BC History', () => {
    const bcHistoryPayload = {
      docNo: 66,
      fiscalYear: 2020
    };

    const bcHistoryDetails = [
      {
        customerName: 'srinivas',
        createdDate: moment(1611110936440),
        createdBy: 'cpd',
        docNo: 100,
        docDate: moment(1611110936440),
        fiscalYear: 2020,
        netAmount: 100,
        cancelReason: 'cancel',
        cancellationType: 'return',
        page: 1,
        size: 10
      }
    ];

    const dummyHistory: bcHistoryResponse = {
      bcHistoryDetails: bcHistoryDetails,
      totalElements: 22
    };

    it('should return a cancelRequest', () => {
      const action = new LoadBCHistory(bcHistoryPayload);
      const outcome = new LoadBCHistorySuccess(dummyHistory);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: dummyHistory
      });
      billCancelServiceSpy.getHistoryItems.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadBCHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBCHistory(bcHistoryPayload);
      const error = new Error('some error');
      const outcome = new LoadBCHistoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.getHistoryItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBCHistory$).toBeObservable(expected);
    });
  });
});
