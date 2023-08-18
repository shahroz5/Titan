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
  ResetValues,
  InvokeOrderDetailsSuccess,
  InvokeOrderDetails,
  InvokeOrderDetailsFailure,
  ResetHistory,
  UpdateHistorySearchParameter,
  LoadCashMemoHistory,
  LoadItemFromCashMemoHistory,
  LoadCashMemoHistorySuccess,
  LoadCashMemoHistoryFailure,
  LoadItemFromCashMemoHistorySuccess,
  LoadItemFromCashMemoHistoryFailure,
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
  LoadTcsDetail,
  LoadTcsDetailSuccess,
  LoadTcsDetailFailure,
  SetFocus,
  SetABInvoked
} from './cash-memo.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  cashMemoReducer,
  initialState
} from './cash-memo.reducer';
import { CashMemoState } from './cash-memo.state';
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
import {
  cashMemoHistoryRequestPayload,
  cashMemoItemDetailsRequestPayload,
  cashMemoHistoryResponse,
  cashMemoItemDetails
} from './cash-memo.actions.spec';
import { itemDetailsAdapter } from './cash-memo.entity';

describe('Cash Memo Reducer Testing Suite', () => {
  const testState = initialState;
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
      manualBillDate: (1625509800000),
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

  it('should return the initial state', () => {
    const action: any = {};
    const state: CashMemoState = cashMemoReducer(
      undefined,
      action
    );

    expect(state).toBe(testState);
  });

  describe('Testing CreateCashMemo Functionality', () => {
    it('CreateCashMemo should be called', () => {
      const action = new CreateCashMemo(cashMemoDetailsRequestPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('CreateCashMemoSuccess should be called', () => {
      const action = new CreateCashMemoSuccess(createCashMemoResponse);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.createCashMemoResponse).toBeTruthy();
    });
    it('CreateCashMemoFailure should be called', () => {
      const action = new CreateCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ViewCashMemo Functionality', () => {
    it('ViewCashMemo should be called', () => {
      const action = new ViewCashMemo(cashMemoDetailsRequestPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('ViewCashMemoSuccess should be called', () => {
      const action = new ViewCashMemoSuccess(cashMemoDetailsResponse);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.viewCashMemoResponse).toBeTruthy();
    });
    it('ViewCashMemoFailure should be called', () => {
      const action = new ViewCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing PartialUpdateCashMemo Functionality', () => {
    it('PartialUpdateCashMemo should be called', () => {
      const action = new PartialUpdateCashMemo(cashMemoDetailsRequestPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('PartialUpdateCashMemoSuccess should be called', () => {
      const action = new PartialUpdateCashMemoSuccess(cashMemoDetailsResponse);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.partialUpdateCashMemoResponse).toBeTruthy();
    });
    it('PartialUpdateCashMemoFailure should be called', () => {
      const action = new PartialUpdateCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing UpdateCashMemo Functionality', () => {
    it('UpdateCashMemo should be called', () => {
      const action = new UpdateCashMemo(cashMemoDetailsRequestPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('UpdateCashMemoSuccess should be called', () => {
      const action = new UpdateCashMemoSuccess(cashMemoDetailsResponse);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.updateCashMemoResponse).toBeTruthy();
    });
    it('UpdateCashMemoFailure should be called', () => {
      const action = new UpdateCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing DeleteCashMemo Functionality', () => {
    it('DeleteCashMemo should be called', () => {
      const action = new DeleteCashMemo(cashMemoDetailsRequestPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('DeleteCashMemoSuccess should be called', () => {
      const action = new DeleteCashMemoSuccess(true);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.deleteCashMemoResponse).toBeTruthy();
    });
    it('DeleteCashMemoFailure should be called', () => {
      const action = new DeleteCashMemoFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing UpdatePriceDetails Functionality', () => {
    it('UpdatePriceDetails should be called', () => {
      const action = new UpdatePriceDetails(cashMemoDetailsRequestPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('UpdatePriceDetailsSuccess should be called', () => {
      const action = new UpdatePriceDetailsSuccess({
        data: cashMemoDetailsResponse,
        requestDetails: true
      });
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.updatePriceDetailsResponse).toBeTruthy();
    });
    it('UpdatePriceDetailsFailure should be called', () => {
      const action = new UpdatePriceDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing InvokeOrderDetails Functionality', () => {
    it('InvokeOrderDetails should be called', () => {
      const action = new InvokeOrderDetails(cashMemoDetailsRequestPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('InvokeOrderDetailsSuccess should be called', () => {
      const action = new InvokeOrderDetailsSuccess(cashMemoDetailsResponse);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.invokeOrderDetailsResponse).toBeTruthy();
    });
    it('InvokeOrderDetailsFailure should be called', () => {
      const action = new InvokeOrderDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing Reset Functionality', () => {
    it('ResetValues should be called', () => {
      const action = new ResetValues();
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
  });

  describe('Testing ResetHistory Functionality', () => {
    it('ResetHistory should be called', () => {
      const action = new ResetHistory();
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.cashMemoHistoryTotalElements).toEqual(null);
      expect(result.cashMemoHistory).toEqual([]);
      expect(result.isHistoryDetailsLoading).toEqual(null);
    });
  });
  describe('Testing UpdateHistorySearchParameter Functionality', () => {
    it('UpdateHistorySearchParameter should be called', () => {
      const action = new UpdateHistorySearchParameter(
        cashMemoHistoryRequestPayload
      );
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.historySearchParameter).toEqual(
        cashMemoHistoryRequestPayload
      );
    });
  });

  describe('Testing LoadCashMemoHistory Functionality', () => {
    it('LoadCashMemoHistory should be called', () => {
      const action = new LoadCashMemoHistory(cashMemoHistoryRequestPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isHistoryDetailsLoading).toEqual(true);
      expect(result.cashMemoHistory).toEqual([]);
    });

    it('LoadCashMemoHistorySuccess should be called', () => {
      const action = new LoadCashMemoHistorySuccess(cashMemoHistoryResponse);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isHistoryDetailsLoading).toEqual(false);
      expect(result.cashMemoHistory).toEqual([
        {
          customerName: 'ABC',
          createdDate: '22/01/2020',
          createdBy: 'RSO',
          docNo: 11,
          docDate: '23/01/2020',
          fiscalYear: 2020,
          netAmount: 10000,
          id: '1',
          status: 'CONFIRMED'
        }
      ]);
      expect(result.cashMemoHistoryTotalElements).toEqual(1);
    });
    it('LoadCashMemoHistoryFailure should be called', () => {
      const action = new LoadCashMemoHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isHistoryDetailsLoading).toEqual(null);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadItemFromCashMemoHistory Functionality', () => {
    it('LoadItemFromCashMemoHistory should be called', () => {
      const action = new LoadItemFromCashMemoHistory(
        cashMemoItemDetailsRequestPayload
      );
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadItemFromCashMemoHistorySuccess should be called', () => {
      const action = new LoadItemFromCashMemoHistorySuccess(
        cashMemoItemDetails
      );
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
    it('LoadItemFromCashMemoHistoryFailure should be called', () => {
      const action = new LoadItemFromCashMemoHistoryFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadItemFromCashMemoHistory Functionality', () => {
    it('LoadItemFromCashMemoHistory should be called', () => {
      const action = new LoadItemFromCashMemoHistory(
        cashMemoItemDetailsRequestPayload
      );
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.productDetails).toEqual(
        itemDetailsAdapter.getInitialState()
      );
    });
  });

  describe('Testing GetMaterialPrices Functionality', () => {
    it('GetMaterialPrices should be called', () => {
      const action = new GetMaterialPrices(metalRatesPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('GetMaterialPricesSuccess should be called', () => {
      const action = new GetMaterialPricesSuccess(metalRates);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.materialPrices).toBeTruthy();
    });
    it('GetMaterialPricesFailure should be called', () => {
      const action = new GetMaterialPricesFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing FileUpload Functionality', () => {
    it('FileUpload should be called', () => {
      const action = new FileUpload(fileUploadDownloadPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('FileUploadSuccess should be called', () => {
      const action = new FileUploadSuccess(fileUploadRes);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.uploadFileResponse).toBeTruthy();
    });
    it('FileUploadFailure should be called', () => {
      const action = new FileUploadFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing FileUploadList Functionality', () => {
    it('FileUploadList should be called', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('FileUploadListSuccess should be called', () => {
      const action = new FileUploadListSuccess(fileUploadListRes);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.uploadFileListResponse).toBeTruthy();
    });
    it('FileUploadListFailure should be called', () => {
      const action = new FileUploadListFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing FileDownloadUrl Functionality', () => {
    it('FileDownloadUrl should be called', () => {
      const action = new FileDownloadUrl(fileDownloadReq);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('FileDownloadUrlSuccess should be called', () => {
      const action = new FileDownloadUrlSuccess(fileDownloadRes);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.downloadFileUrl).toBeTruthy();
    });
    it('FileDownloadUrlFailure should be called', () => {
      const action = new FileDownloadUrlFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadTcsDetail Functionality', () => {
    it('LoadTcsDetail should be called', () => {
      const action = new LoadTcsDetail(cashMemoDetailsRequestPayload);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadTcsDetailSuccess should be called', () => {
      const action = new LoadTcsDetailSuccess(tcsResponse);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.tcsDetails).toBeTruthy();
    });
    it('LoadTcsDetailFailure should be called', () => {
      const action = new LoadTcsDetailFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing SetFocus Functionality', () => {
    it('SetFocus should be called', () => {
      const action = new SetFocus(1);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.setFocus).toEqual(1);
    });
  });

  describe('Testing SetABInvoked Functionality', () => {
    it('SetABInvoked should be called', () => {
      const action = new SetABInvoked(false);
      const result: CashMemoState = cashMemoReducer(
        initialState,
        action
      );
      expect(result.isABInvoked).toEqual(false);
    });
  });
});
