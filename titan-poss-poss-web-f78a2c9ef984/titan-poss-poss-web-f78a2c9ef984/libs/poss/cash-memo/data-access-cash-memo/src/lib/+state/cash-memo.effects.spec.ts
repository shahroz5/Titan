import { CashMemoEffects } from './cash-memo.effects';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  CreateCashMemo,
  CreateCashMemoSuccess,
  CreateCashMemoFailure,
  ViewCashMemo,
  ViewCashMemoSuccess,
  ViewCashMemoFailure,
  PartialUpdateCashMemo,
  PartialUpdateCashMemoSuccess,
  PartialUpdateCashMemoFailure,
  UpdateCashMemo,
  UpdateCashMemoSuccess,
  UpdateCashMemoFailure,
  DeleteCashMemo,
  DeleteCashMemoSuccess,
  DeleteCashMemoFailure,
  UpdatePriceDetails,
  UpdatePriceDetailsSuccess,
  UpdatePriceDetailsFailure,
  InvokeOrderDetails,
  InvokeOrderDetailsSuccess,
  InvokeOrderDetailsFailure,
  LoadCashMemoHistorySuccess,
  LoadCashMemoHistoryFailure,
  LoadCashMemoHistory,
  LoadItemFromCashMemoHistorySuccess,
  LoadItemFromCashMemoHistoryFailure,
  LoadItemFromCashMemoHistory,
  GetMaterialPrices,
  GetMaterialPricesSuccess,
  GetMaterialPricesFailure,
  FileUpload,
  FileUploadSuccess,
  FileUploadFailure,
  FileUploadList,
  FileUploadListSuccess,
  FileUploadListFailure,
  FileDownloadUrl,
  FileDownloadUrlSuccess,
  FileDownloadUrlFailure,
  LoadTcsDetailFailure,
  LoadTcsDetail,
  LoadTcsDetailSuccess
} from './cash-memo.actions';
import { hot, cold } from 'jasmine-marbles';
import {
  AdvanceBookingDetailsResponse,
  CashMemoDetailsRequestPayload,
  CreateCashMemoResponse,
  FileUploadDownloadPayload,
  FileUploadLists,
  MetalRates,
  MetalRatesPayload,
  StatusTypesEnum,
  TcsDataResponse,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CashMemoService } from '../cash-memo.service';
import { Observable } from 'rxjs';
import { cashMemoFeatureKey, initialState } from './cash-memo.reducer';
import {
  cashMemoHistoryRequestPayload,
  cashMemoHistoryResponse,
  cashMemoItemDetailsRequestPayload,
  cashMemoItemDetails
} from './cash-memo.actions.spec';
import { CommonService } from '@poss-web/shared/common/data-access-common';

const cashMemoDetailsRequestPayload: CashMemoDetailsRequestPayload = {
  subTxnType: 'MANUAL_CM',
  txnType: 'CM',
  requestDetails: {
    manualBillDetails: {
      approvedBy: 'cashiercpd',
      manualBillDate: '2021-07-06T00:00:00+05:30',
      manualBillNo: '10AQ',
      manualBillValue: 100000,
      metalRates: {
        J: { metalTypeCode: 'J', ratePerUnit: 46934, totalMetalWeight: 10 }
      },
      password: 'MAzmkyR+',
      remarks: 'test'
    },
    validationType: 'PASSWORD_VALIDATION'
  }
};

const createCashMemoResponse: CreateCashMemoResponse = {
  id: '3A0E5E55-1830-4392-98E6-94D16766B6B2',
  status: StatusTypesEnum.OPEN,
  docNo: 36,
  subTxnType: 'MANUAL_CM',
  txnType: 'CM',
  manualBillDetails: {
    manualBillDate: 1625509800000,
    manualBillNo: '10AQ',
    manualBillValue: 100000,
    remarks: 'test',
    approvedBy: 'cashiercpd',
    password: 'MAzmkyR+',
    metalRates: {
      J: { metalTypeCode: 'J', totalMetalWeight: 10, ratePerUnit: 46934 }
    },
    isFrozenRate: null,
    frozenRateDate: null,
    processId: null,
    requestStatus: null,
    requestNo: null,
    validationType: 'PASSWORD_VALIDATION',
    performedBy: null
  }
};

const cashMemoDetailsResponse: AdvanceBookingDetailsResponse = {
  activationDetails: {},
  cancellationDetails: {},
  confirmedTime: moment(),
  customerId: 1,
  discountDetails: 0,
  docDate: moment(),
  docNo: 1,
  employeeCode: '',
  finalValue: 123,
  firstHoldTime: moment(),
  fiscalYear: 2015,
  focDetails: {},
  id: '',
  isBestRate: true,
  isFrozenRate: true,
  lastHoldTime: moment(),
  metalRateList: {},
  minValue: 1,
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
  taxDetails: {
    taxes: [
      {
        taxType: 'ITEMCHARGES',
        taxClass: 'TC72',
        data: {
          SGST: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 437.42 },
          CGST: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 437.42 }
        },
        cess: {}
      }
    ]
  },
  totalDiscount: 1,
  totalQuantity: 1,
  totalTax: 1,
  totalValue: 1,
  totalWeight: 1,
  txnTime: moment(),
  customerDocDetails: null,
  refSubTxnType: 'NEW_AB',
  isFrozenAmount: 0,
  hallmarkCharges: 100,
  hallmarkDiscount: 0,
  cancelTxnId: 1,
  isRivaah: false,
  refDocNo: 2,
  refFiscalYear: 2022
};

const metalRatesPayload: MetalRatesPayload = {
  applicableDate: 1625509800000,
  locationCode: 'CPD'
};

const metalRates: MetalRates[] = [
  {
    metalTypeCode: 'J',
    priceType: 'D',
    ratePerUnit: 46934
  }
];

const fileUploadDownloadPayload: FileUploadDownloadPayload = {
  txnType: TransactionTypeEnum.CM,
  id: '3A0E5E55-1830-4392-98E6-94D16766B6B2'
};

const fileUploadRes = true;
const fileUploadListRes: FileUploadLists[] = [
  {
    id: '1234567',
    name: 'file1'
  }
];

const fileDownloadReq = { id: '1234567', locationCode: 'CPD' };

const fileDownloadRes = 'http://downloadedurl.com';
const tcsResponse: TcsDataResponse = {
  tcsToBeCollected: 100,
  tcsCollected: 10,
  tcsEligibleAmount: 1000
};

describe('Cash Memo Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CashMemoEffects;

  const cashMemoServiceSpy = jasmine.createSpyObj<CashMemoService>(
    'cashMemoService',
    [
      'createCashMemo',
      'viewCashMemo',
      'partialUpdateCashMemo',
      'updateCashMemo',
      'deleteCashMemo',
      'updatePriceDetails',
      'invokeOrderDetails',
      'loadCashMemoHistory',
      'getItemFromCashMemo',
      'uploadFile',
      'uploadFileList',
      'downloadFile',
      'getTcsAmount'
    ]
  );

  const commonServiceSpy = jasmine.createSpyObj<CommonService>([
    'getStandardMaterialPriceDetailsHistory'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CashMemoEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [cashMemoFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),
        {
          provide: CashMemoService,
          useValue: cashMemoServiceSpy
        },
        {
          provide: CommonService,
          useValue: commonServiceSpy
        }
      ]
    });

    effect = TestBed.inject(CashMemoEffects);
  });

  describe('createCashMemo', () => {
    it('should return createCashMemo response', () => {
      const action = new CreateCashMemo(cashMemoDetailsRequestPayload);
      const outcome = new CreateCashMemoSuccess(createCashMemoResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: createCashMemoResponse
      });
      cashMemoServiceSpy.createCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.createCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CreateCashMemo(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new CreateCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.createCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createCashMemo$).toBeObservable(expected);
    });
  });

  describe('viewCashMemo', () => {
    it('should return a viewCashMemo response', () => {
      const action = new ViewCashMemo(cashMemoDetailsRequestPayload);
      const outcome = new ViewCashMemoSuccess(cashMemoDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoDetailsResponse
      });
      cashMemoServiceSpy.viewCashMemo.and.returnValue(response$);

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
      cashMemoServiceSpy.viewCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.viewCashMemo$).toBeObservable(expected);
    });
  });

  describe('partialUpdateCashMemo', () => {
    it('should return a partialUpdateCashMemo response', () => {
      const action = new PartialUpdateCashMemo(cashMemoDetailsRequestPayload);
      const outcome = new PartialUpdateCashMemoSuccess(cashMemoDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoDetailsResponse
      });
      cashMemoServiceSpy.partialUpdateCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.partialUpdateCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new PartialUpdateCashMemo(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new PartialUpdateCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.partialUpdateCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.partialUpdateCashMemo$).toBeObservable(expected);
    });
  });

  describe('updateCashMemo', () => {
    it('should return a updateCashMemo response', () => {
      const action = new UpdateCashMemo(cashMemoDetailsRequestPayload);
      const outcome = new UpdateCashMemoSuccess(cashMemoDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoDetailsResponse
      });
      cashMemoServiceSpy.updateCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.updateCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateCashMemo(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new UpdateCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.updateCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateCashMemo$).toBeObservable(expected);
    });
  });

  describe('deleteCashMemo', () => {
    it('should return a deleteCashMemo response', () => {
      const action = new DeleteCashMemo(cashMemoDetailsRequestPayload);
      const outcome = new DeleteCashMemoSuccess(true);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: true
      });
      cashMemoServiceSpy.deleteCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.deleteCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DeleteCashMemo(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new DeleteCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.deleteCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.deleteCashMemo$).toBeObservable(expected);
    });
  });

  describe('UpdatePriceDetails', () => {
    it('should return a UpdatePriceDetails response', () => {
      const action = new UpdatePriceDetails(cashMemoDetailsRequestPayload);
      const outcome = new UpdatePriceDetailsSuccess({
        data: cashMemoDetailsResponse,
        requestDetails: cashMemoDetailsRequestPayload.requestDetails
      });

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoDetailsResponse
      });
      cashMemoServiceSpy.updatePriceDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.updatePriceDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdatePriceDetails(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new UpdatePriceDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.updatePriceDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updatePriceDetails$).toBeObservable(expected);
    });
  });

  describe('invokeOrderDetails', () => {
    it('should return a invokeOrderDetails response', () => {
      const action = new InvokeOrderDetails(cashMemoDetailsRequestPayload);
      const outcome = new InvokeOrderDetailsSuccess(cashMemoDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoDetailsResponse
      });
      cashMemoServiceSpy.invokeOrderDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.invokeOrderDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new InvokeOrderDetails(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new InvokeOrderDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.invokeOrderDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.invokeOrderDetails$).toBeObservable(expected);
    });
  });

  describe('loadCashMemoHistory', () => {
    it('should return a loadCashMemoHistory response', () => {
      const action = new LoadCashMemoHistory(cashMemoHistoryRequestPayload);
      const outcome = new LoadCashMemoHistorySuccess(cashMemoHistoryResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoHistoryResponse
      });
      cashMemoServiceSpy.loadCashMemoHistory.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadCashMemoHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCashMemoHistory(cashMemoHistoryRequestPayload);
      const error = new Error('some error');
      const outcome = new LoadCashMemoHistoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.loadCashMemoHistory.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCashMemoHistory$).toBeObservable(expected);
    });
  });

  describe('loadItemFromCashMemoHistory', () => {
    it('should return a loadItemFromCashMemoHistory response', () => {
      const action = new LoadItemFromCashMemoHistory(
        cashMemoItemDetailsRequestPayload
      );
      const outcome = new LoadItemFromCashMemoHistorySuccess(
        cashMemoItemDetails
      );

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: cashMemoItemDetails
      });
      cashMemoServiceSpy.getItemFromCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadItemFromCashMemoHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadItemFromCashMemoHistory(
        cashMemoItemDetailsRequestPayload
      );
      const error = new Error('some error');
      const outcome = new LoadItemFromCashMemoHistoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.getItemFromCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadItemFromCashMemoHistory$).toBeObservable(expected);
    });
  });

  describe('GetMaterialPrices', () => {
    it('should return a GetMaterialPrices response', () => {
      const action = new GetMaterialPrices(metalRatesPayload);
      const outcome = new GetMaterialPricesSuccess(metalRates);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: metalRates
      });
      commonServiceSpy.getStandardMaterialPriceDetailsHistory.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });
      expect(effect.getMaterialPrices$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetMaterialPrices(metalRatesPayload);
      const error = new Error('some error');
      const outcome = new GetMaterialPricesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      commonServiceSpy.getStandardMaterialPriceDetailsHistory.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.getMaterialPrices$).toBeObservable(expected);
    });
  });

  describe('FileUpload', () => {
    it('should return a FileUpload response', () => {
      const action = new FileUpload(fileUploadDownloadPayload);
      const outcome = new FileUploadSuccess(fileUploadRes);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: fileUploadRes
      });
      cashMemoServiceSpy.uploadFile.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.getFileUpload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FileUpload(fileUploadDownloadPayload);
      const error = new Error('some error');
      const outcome = new FileUploadFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.uploadFile.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getFileUpload$).toBeObservable(expected);
    });
  });

  describe('FileUploadList', () => {
    it('should return a FileUploadList response', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);
      const outcome = new FileUploadListSuccess(fileUploadListRes);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: fileUploadListRes
      });
      cashMemoServiceSpy.uploadFileList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.getFileUploadList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);
      const error = new Error('some error');
      const outcome = new FileUploadListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.uploadFileList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getFileUploadList$).toBeObservable(expected);
    });
  });

  describe('FileDownloadUrl', () => {
    it('should return a FileDownloadUrl response', () => {
      const action = new FileDownloadUrl(fileDownloadReq);
      const outcome = new FileDownloadUrlSuccess(fileDownloadRes);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: fileDownloadRes
      });
      cashMemoServiceSpy.downloadFile.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.getFileDownload$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FileDownloadUrl(fileDownloadReq);
      const error = new Error('some error');
      const outcome = new FileDownloadUrlFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.downloadFile.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getFileDownload$).toBeObservable(expected);
    });
  });

  describe('getTcsAmount', () => {
    it('should return getTcsAmount response', () => {
      const action = new LoadTcsDetail(cashMemoDetailsRequestPayload);
      const outcome = new LoadTcsDetailSuccess(tcsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: tcsResponse
      });
      cashMemoServiceSpy.getTcsAmount.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadTcsDetail$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadTcsDetail(cashMemoDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new LoadTcsDetailFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      cashMemoServiceSpy.getTcsAmount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTcsDetail$).toBeObservable(expected);
    });
  });
});
