import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  BillCancellation,
  BillCancellationRequests,
  BillCancelPayload,
  BillCancelStatus,
  BillCancelStatusList,
  CancelResponse,
  CashMemoDetailsRequestPayload,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  CashMemoItemDetailsRequestPayload,
  ConfirmResponse,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { cold, hot } from 'jasmine-marbles';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { BillCancellationRequestsService } from '../bill-cancellation-requests.service';
import {
  ApproveBillCancellationRequests,
  ApproveBillCancellationRequestsFailure,
  ApproveBillCancellationRequestsSuccess,
  ApprovePayload,
  BillCancellationRequestsListPayload,
  BillCancelListPayload,
  CANCELRequest,
  CANCELRequestFailure,
  CANCELRequestSuccess,
  CancelType,
  CancelTypeFailure,
  CancelTypePayload,
  CancelTypeSuccess,
  CONFIRMRequest,
  CONFIRMRequestFailure,
  CONFIRMRequestSuccess,
  DeleteRequest,
  DeleteRequestFailure,
  DeleteRequestSuccess,
  GetItemfromCashMemo,
  GetItemfromCashMemoFailure,
  GetItemfromCashMemoSuccess,
  LoadBillCancellationRequests,
  LoadBillCancellationRequestsFailure,
  LoadBillCancellationRequestsStatus,
  LoadBillCancellationRequestsStatusFailure,
  LoadBillCancellationRequestsStatusSuccess,
  LoadBillCancellationRequestsSuccess,
  LoadCountBillCancellation,
  LoadCountBillCancellationFailure,
  LoadCountBillCancellationSuccess,
  LoadLocation,
  LoadLocationFailure,
  LoadLocationSuccess,
  LoadSelectedDataFailure,
  LoadSelectedDataSucess,
  LoadSeltedData,
  ViewCashMemo,
  ViewCashMemoFailure,
  ViewCashMemoSuccess
} from './bill-cancellation-requests.actions';
import { BillCancellationRequestsEffects } from './bill-cancellation-requests.effects';
import {
  BILL_CANCELLATION_REQUESTS_FEATURE_KEY,
  initialState
} from './bill-cancellation-requests.reducer';

describe('Bill Cancel Effect Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BillCancellationRequestsEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );

  const billCancelServiceSpy = jasmine.createSpyObj<
    BillCancellationRequestsService
  >('service', [
    'confirm',
    'cancel',
    'viewCashMemo',
    'getItemFromCashMemo',
    'CancelType',
    'delete',
    'selectedData',
    'getloadBillRequestStatus',
    'getloadBillRequestCount',
    'putBillCancellation',
    'getloadBillRequest'
  ]);

  const locationDataServiceSpy = jasmine.createSpyObj<LocationDataService>(
    'locationService',
    ['getLocationSummaryList']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BillCancellationRequestsEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [BILL_CANCELLATION_REQUESTS_FEATURE_KEY]: initialState
          }
        }),
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
          provide: BillCancellationRequestsService,
          useValue: billCancelServiceSpy
        },
        {
          provide: LocationDataService,
          useValue: locationDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(BillCancellationRequestsEffects);
  });

  describe('viewCashMemo', () => {
    const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      subTxnType: 'NEW_CM',
      txnType: 'CM'
    };

    const cashMemoDetailsResponse: CashMemoDetailsResponse = {
      customerId: 6,
      occasion: 'Wedding/Marriage',
      totalQuantity: 1,
      totalWeight: 12.05,
      totalValue: 60002.3,
      totalTax: 1800.06,
      finalValue: 61802.0,
      totalDiscount: 0.0,
      paidValue: 61802.0,
      remarks: 'Remarks',
      // otherCharges: null,
      otherChargesList: null,
      metalRateList: {
        metalRates: {
          J: {
            metalTypeCode: 'J',
            purity: 91.62,
            ratePerUnit: 4762,
            currency: 'INR',
            applicableDate: 1611081000000,
            karat: 22.0
          },
          L: {
            metalTypeCode: 'L',
            purity: 95.0,
            ratePerUnit: 3473,
            currency: 'INR',
            applicableDate: 1611081000000,
            karat: 0.0
          }
        }
      },
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      status: StatusTypesEnum.CONFIRMED,
      refTxnId: null,
      refTxnType: null,
      docNo: 54,
      docDate: moment(1611081000000),
      fiscalYear: 2020,
      firstHoldTime: moment(1610012299519),
      lastHoldTime: moment(1610012299519),
      roundingVariance: -0.36,
      employeeCode: 'cashiercpd',
      txnType: 'CM',
      subTxnType: 'NEW_CM',
      // confirmedTime: moment(1611110936440),
      manualBillDetails: null,
      taxDetails: {
        // taxes: [
        //   {
        //     taxType: 'ITEMCHARGES',
        //     taxClass: 'TC75',
        //     data: [
        //       { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
        //       { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 900.03 }
        //     ],
        //     cess: []
        //   }
        // ]
        taxType: 'ITEMCHARGES',
        taxClass: 'TC75',
        data: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 900.03 },
        cess: null
      },
      // currencyCode: 'INR',
      // weightUnit: 'gms',
      // manualBillId: null,
      discountDetails: null,
      itemIdList: ['741B3399-ED98-44D8-B25D-BBDADCA2F1D2'],
      focDetails: null,
      txnTime: null,
      refSubTxnType: 'NEW_AB',
      customerDocDetails: null,
      cancelTxnId: 1,
      refDocNo: 1,
      refFiscalYear: 2022,
      hallmarkCharges: 350,
      hallmarkDiscount: 350
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
      actions$ = cold('-a', { a: action });
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
        isUcp: true,
        netWeight: 67,
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
      const action = new CONFIRMRequest(billCancelPayload);
      const outcome = new CONFIRMRequestSuccess(confirmResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: confirmResponse
      });
      billCancelServiceSpy.confirm.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.confirm$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CONFIRMRequest(billCancelPayload);
      const error = new Error('some error');
      const outcome = new CONFIRMRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.confirm.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirm$).toBeObservable(expected);
    });
  });

  describe('cancel', () => {
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
      const action = new CANCELRequest(billCancelPayload);
      const outcome = new CANCELRequestSuccess(cancelResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: cancelResponse
      });
      billCancelServiceSpy.cancel.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.cancel$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CANCELRequest(billCancelPayload);
      const error = new Error('some error');
      const outcome = new CANCELRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.cancel.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cancel$).toBeObservable(expected);
    });
  });

  describe('cancelType', () => {
    const billCancelPayload: CancelTypePayload = {
      txnType: 'CM_CAN',
      subTxnType: 'CM',
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28'
    };

    const cancelResponse = {
      cndocNos: [234, 235],
      docNo: 12,
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28'
    };

    it('should return a cancelRequest', () => {
      const action = new CancelType(billCancelPayload);
      const outcome = new CancelTypeSuccess(cancelResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: cancelResponse
      });
      billCancelServiceSpy.CancelType.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.cancelType$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CancelType(billCancelPayload);
      const error = new Error('some error');
      const outcome = new CancelTypeFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.CancelType.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cancelType$).toBeObservable(expected);
    });
  });

  describe('LoadBillCancellationRequests', () => {
    const billCancellationRequestsListPayload: BillCancellationRequestsListPayload = {
      approvalStatus: 'PENDING',
      workflowType: 'BILL_CANCELLATION',
      body: {}
    };

    const billCancellation: BillCancellation = {
      approvedBy: null,
      approvedDate: null,
      approverRemarks: null,
      docNo: 8,
      fiscalYear: 2022,
      headerData: {},
      processId: 'F17D8C04-CD05-11EC-9F7B-00155DB7A401',
      requestedBy: 'cashiercpd',
      requestedDate: 1651818595489,
      requestorRemarks: null,
      workflowType: 'BILL_CANCELLATION',
      invoiceNo: 2,
      docDate: moment(1651818595489),
      customerName: '353',
      totalAmount: 10000,
      locationCode: 'CPD',
      taskId: '1',
      taskName: null
    };

    const billCancellationRequests: BillCancellationRequests = {
      results: [billCancellation],
      count: 1
    };

    it('should return a LoadBillCancellationRequests', () => {
      const action = new LoadBillCancellationRequests(
        billCancellationRequestsListPayload
      );
      const outcome = new LoadBillCancellationRequestsSuccess(
        billCancellationRequests
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: billCancellationRequests
      });
      billCancelServiceSpy.getloadBillRequest.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.billCancelList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBillCancellationRequests(
        billCancellationRequestsListPayload
      );
      const error = new Error('some error');
      const outcome = new LoadBillCancellationRequestsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.getloadBillRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.billCancelList$).toBeObservable(expected);
    });
  });

  describe('LoadLocation', () => {
    const location = ['CPD'];
    it('should return a LoadLocation', () => {
      const action = new LoadLocation();
      const outcome = new LoadLocationSuccess(location);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: location
      });
      locationDataServiceSpy.getLocationSummaryList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.location$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadLocation();
      const error = new Error('some error');
      const outcome = new LoadLocationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      locationDataServiceSpy.getLocationSummaryList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.location$).toBeObservable(expected);
    });
  });

  describe('LoadSeltedData', () => {
    const selectedDataPayload = {
      workflowType: 'BILL_CANCELLATION',
      processId: 'p1'
    };
    const billCancelStatus: BillCancelStatus = {
      approvalLevel: 1,
      approvalStatus: 'PENDING',
      approvedBy: null,
      approvedDate: null,
      approverRemarks: null,
      docNo: 8,
      fiscalYear: 2022,
      headerData: {},
      processId: 'F17D8C04-CD05-11EC-9F7B-00155DB7A401',
      requestedBy: 'cashiercpd',
      requestedDate: moment(1651818595489),
      requestorRemarks: null,
      workflowType: 'BILL_CANCELLATION'
    };
    const BillCancelStatusList: BillCancelStatusList = {
      response: null,
      pageNumber: 1,
      pageSize: 10,
      results: [billCancelStatus],
      totalElements: 10,
      totalPages: 5
    };
    it('should return a LoadLocation', () => {
      const action = new LoadSeltedData(selectedDataPayload);
      const outcome = new LoadSelectedDataSucess(BillCancelStatusList);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: BillCancelStatusList
      });
      billCancelServiceSpy.selectedData.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.selected$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSeltedData(selectedDataPayload);
      const error = new Error('some error');
      const outcome = new LoadSelectedDataFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.selectedData.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.selected$).toBeObservable(expected);
    });
  });

  describe('DeleteRequest', () => {
    const billCancelPayload: BillCancelPayload = {
      cancelType: 'CANCEL_WITH_CN',
      employeeCode: 'rso',
      reasonForCancellation: 'test',
      refTxnId: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A28',
      remarks: 'test'
    };

    const cancelResponse: any = {
      cndocNos: [234, 235],
      docNo: 12,
      id: '78B06AC4-1EEE-4901-ACAB-4C1C0C5F3A 28'
    };

    it('should return a DeleteRequest', () => {
      const action = new DeleteRequest(billCancelPayload);
      const outcome = new DeleteRequestSuccess(cancelResponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: cancelResponse
      });
      billCancelServiceSpy.delete.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      // expect(effect.delete$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DeleteRequest(billCancelPayload);
      const error = new Error('some error');
      const outcome = new DeleteRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.delete.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.delete$).toBeObservable(expected);
    });
  });

  describe('LoadBillCancellationRequestsStatus', () => {
    const billCancelListPayload: BillCancelListPayload = {
      httpMethod: 'GET',
      relativeUrl: 'http://test.com',
      reqBody: {},
      requestParams: {
        workflowType: 'BILL_CANCELLATION',
        approvalStatus: 'PENDING'
      }
    };

    const billCancelStatus: BillCancelStatus = {
      approvalLevel: 1,
      approvalStatus: 'PENDING',
      approvedBy: null,
      approvedDate: null,
      approverRemarks: null,
      docNo: 8,
      fiscalYear: 2022,
      headerData: {},
      processId: 'F17D8C04-CD05-11EC-9F7B-00155DB7A401',
      requestedBy: 'cashiercpd',
      requestedDate: moment(1651818595489),
      requestorRemarks: null,
      workflowType: 'BILL_CANCELLATION'
    };

    const billCancelStatusList: BillCancelStatusList = {
      response: null,
      pageNumber: 1,
      pageSize: 10,
      results: [billCancelStatus],
      totalElements: 10,
      totalPages: 5
    };

    it('should return a LoadBillCancellationRequestsStatus', () => {
      const action = new LoadBillCancellationRequestsStatus(
        billCancelListPayload
      );
      const outcome = new LoadBillCancellationRequestsStatusSuccess(
        billCancelStatusList
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: billCancelStatusList
      });
      billCancelServiceSpy.getloadBillRequestStatus.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.billCancelStatusList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBillCancellationRequestsStatus(
        billCancelListPayload
      );
      const error = new Error('some error');
      const outcome = new LoadBillCancellationRequestsStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.getloadBillRequestStatus.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.billCancelStatusList$).toBeObservable(expected);
    });
  });

  describe('LoadCountBillCancellation', () => {
    const billCancellationRequestsListPayload: BillCancellationRequestsListPayload = {
      approvalStatus: 'PENDING',
      workflowType: 'BILL_CANCELLATION',
      body: {}
    };

    it('should return a LoadCountBillCancellation', () => {
      const action = new LoadCountBillCancellation(
        billCancellationRequestsListPayload
      );
      const outcome = new LoadCountBillCancellationSuccess(2);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: 2
      });
      billCancelServiceSpy.getloadBillRequestCount.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.billCancelCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCountBillCancellation(
        billCancellationRequestsListPayload
      );
      const error = new Error('some error');
      const outcome = new LoadCountBillCancellationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.getloadBillRequestCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.billCancelCount$).toBeObservable(expected);
    });
  });

  describe('ApproveBillCancellationRequests', () => {
    const approvePayload: ApprovePayload = {
      approved: 'true',
      body: {
        approvedData: {
          data: {},
          type: null
        },
        approverRemarks: 'test'
      },
      processId: 'p1',
      taskId: 't1',
      taskName: 'testName'
    };

    it('should return a ApproveBillCancellationRequests', () => {
      const action = new ApproveBillCancellationRequests(approvePayload);
      const outcome = new ApproveBillCancellationRequestsSuccess(2);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', {
        b: 2
      });
      billCancelServiceSpy.putBillCancellation.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.approveCancel$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ApproveBillCancellationRequests(approvePayload);
      const error = new Error('some error');
      const outcome = new ApproveBillCancellationRequestsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      billCancelServiceSpy.putBillCancellation.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.approveCancel$).toBeObservable(expected);
    });
  });
});
