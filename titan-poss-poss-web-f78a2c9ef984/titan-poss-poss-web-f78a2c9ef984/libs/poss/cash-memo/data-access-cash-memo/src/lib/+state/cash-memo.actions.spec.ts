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
  CashMemoActionTypes,
  InvokeOrderDetails,
  InvokeOrderDetailsFailure,
  InvokeOrderDetailsSuccess,
  LoadCashMemoHistory,
  LoadCashMemoHistorySuccess,
  LoadCashMemoHistoryFailure,
  LoadItemFromCashMemoHistory,
  LoadItemFromCashMemoHistorySuccess,
  LoadItemFromCashMemoHistoryFailure,
  ResetHistory,
  UpdateHistorySearchParameter,
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
  SetABInvoked,
  SetFocus
} from './cash-memo.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  StatusTypesEnum,
  AdvanceBookingDetailsResponse,
  CashMemoDetailsRequestPayload,
  CreateCashMemoResponse,
  CashMemoHistoryRequestPayload,
  CashMemoHistoryResponse,
  CashMemoItemDetailsRequestPayload,
  CashMemoItemDetails,
  MetalRatesPayload,
  MetalRates,
  FileUploadDownloadPayload,
  TransactionTypeEnum,
  FileUploadLists,
  TcsDataResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';

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

export const cashMemoHistoryRequestPayload: CashMemoHistoryRequestPayload = {
  filterOptions: {
    docNo: 110,
    fiscalYear: 2020,
    fromDocDate: '01/01/2020',
    toDocDate: '01/12/2020',
    fromNetAmount: '100000',
    toNetAmount: '200000',
    searchField: '',
    searchType: ''
  },
  sort: 'asc',
  page: 1,
  size: 10,
  subTxnType: 'NEW_CM',
  txnType: 'NEW_CM'
};
export const cashMemoHistoryResponse: CashMemoHistoryResponse = {
  cashMemoHistoryDetails: [
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
  ],
  totalElements: 1
};

export const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
  txnType: 'NEW_CM',
  subTxnType: 'NEW_CM',
  id: '55793BE7-CDB0-42E5-A915-C7F6F94A6155',
  itemDetails: {},
  itemId: ''
};
export const cashMemoItemDetails: CashMemoItemDetails = {
  employeeCode: 'rso',
  inventoryId: '552812OSZAAAPL',
  itemCode: '552812OSZAAAPL',
  itemId: '552812OSZAAAPL',
  lotNumber: '552812OSZAAAPL',
  binCode: 'ZEROBIN',
  finalValue: 2321,
  remarks: 'OK',
  totalDiscount: 0,
  totalQuantity: 1,
  totalTax: 67.62,
  totalValue: 2254,
  totalWeight: 0.28,
  unitValue: 2254,
  unitWeight: 0.228,
  discountDetails: null,
  focDetails: null,
  priceDetails: null,
  taxDetails: null,
  inventoryWeightDetails: null,
  isFoc: false,
  measuredWeightDetails: null,
  productCategoryCode: 'MIA-Colour Stone-UCP',
  productGroupCode: 'MIA-Colour Stone-UCP',
  refTxnId: null,
  refTxnType: null,
  refSubTxnType: null,
  rowId: 1,
  stdWeight: null,
  itemInStock: true,
  reason: '',
  itemDetails: '',
  orderItemId: '',
  hallmarkCharges: 100,
  hallmarkDiscount: 0
};
const metalRatesPayload: MetalRatesPayload = {
  applicableDate: 1639455052000,
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

describe('Cash Memo Action Testing Suite', () => {
  describe('CreateCashMemo Action Test Cases', () => {
    it('should check correct type is used for  CreateCashMemo  action ', () => {
      const action = new CreateCashMemo(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(CashMemoActionTypes.CREATE_CASH_MEMO);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for CreateCashMemoSuccess action ', () => {
      const action = new CreateCashMemoSuccess(createCashMemoResponse);

      expect(action.type).toEqual(CashMemoActionTypes.CREATE_CASH_MEMO_SUCCESS);
      expect(action.payload).toEqual(createCashMemoResponse);
    });
    it('should check correct type is used for CreateCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateCashMemoFailure(payload);

      expect(action.type).toEqual(CashMemoActionTypes.CREATE_CASH_MEMO_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ViewCashMemo Action Test Cases', () => {
    it('should check correct type is used for  ViewCashMemo  action ', () => {
      const action = new ViewCashMemo(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(CashMemoActionTypes.VIEW_CASH_MEMO);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for ViewCashMemoSuccess action ', () => {
      const action = new ViewCashMemoSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(CashMemoActionTypes.VIEW_CASH_MEMO_SUCCESS);
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });
    it('should check correct type is used for ViewCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ViewCashMemoFailure(payload);

      expect(action.type).toEqual(CashMemoActionTypes.VIEW_CASH_MEMO_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('PartialUpdateCashMemo Action Test Cases', () => {
    it('should check correct type is used for  PartialUpdateCashMemo  action ', () => {
      const action = new PartialUpdateCashMemo(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(CashMemoActionTypes.PARTIAL_UPDATE_CASH_MEMO);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for PartialUpdateCashMemoSuccess action ', () => {
      const action = new PartialUpdateCashMemoSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(
        CashMemoActionTypes.PARTIAL_UPDATE_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });
    it('should check correct type is used for PartialUpdateCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PartialUpdateCashMemoFailure(payload);

      expect(action.type).toEqual(
        CashMemoActionTypes.PARTIAL_UPDATE_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdateCashMemo Action Test Cases', () => {
    it('should check correct type is used for  UpdateCashMemo  action ', () => {
      const action = new UpdateCashMemo(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(CashMemoActionTypes.UPDATE_CASH_MEMO);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for UpdateCashMemoSuccess action ', () => {
      const action = new UpdateCashMemoSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(CashMemoActionTypes.UPDATE_CASH_MEMO_SUCCESS);
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });
    it('should check correct type is used for UpdateCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCashMemoFailure(payload);

      expect(action.type).toEqual(CashMemoActionTypes.UPDATE_CASH_MEMO_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('DeleteCashMemo Action Test Cases', () => {
    it('should check correct type is used for  DeleteCashMemo  action ', () => {
      const action = new DeleteCashMemo(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(CashMemoActionTypes.DELETE_CASH_MEMO);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for DeleteCashMemoSuccess action ', () => {
      const action = new DeleteCashMemoSuccess(true);

      expect(action.type).toEqual(CashMemoActionTypes.DELETE_CASH_MEMO_SUCCESS);
      expect(action.payload).toEqual(true);
    });
    it('should check correct type is used for DeleteCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteCashMemoFailure(payload);

      expect(action.type).toEqual(CashMemoActionTypes.DELETE_CASH_MEMO_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdatePriceDetails Action Test Cases', () => {
    it('should check correct type is used for  UpdatePriceDetails  action ', () => {
      const action = new UpdatePriceDetails(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(CashMemoActionTypes.UPDATE_PRICE_DETAILS);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for UpdatePriceDetailsSuccess action ', () => {
      const action = new UpdatePriceDetailsSuccess({
        data: cashMemoDetailsResponse,
        requestDetails: true
      });

      expect(action.type).toEqual(
        CashMemoActionTypes.UPDATE_PRICE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual({
        data: cashMemoDetailsResponse,
        requestDetails: true
      });
    });
    it('should check correct type is used for UpdatePriceDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdatePriceDetailsFailure(payload);

      expect(action.type).toEqual(
        CashMemoActionTypes.UPDATE_PRICE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('InvokeOrderDetails Action Test Cases', () => {
    it('should check correct type is used for  InvokeOrderDetails  action ', () => {
      const action = new InvokeOrderDetails(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(CashMemoActionTypes.INVOKE_ORDER_DETAILS);

      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for InvokeOrderDetailsSuccess action ', () => {
      const action = new InvokeOrderDetailsSuccess(cashMemoDetailsResponse);

      expect(action.type).toEqual(
        CashMemoActionTypes.INVOKE_ORDER_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoDetailsResponse);
    });
    it('should check correct type is used for InvokeOrderDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new InvokeOrderDetailsFailure(payload);

      expect(action.type).toEqual(
        CashMemoActionTypes.INVOKE_ORDER_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadCashMemoHistory Action Test Cases', () => {
    it('should check correct type is used for  LoadCashMemoHistory  action ', () => {
      const action = new LoadCashMemoHistory(cashMemoHistoryRequestPayload);

      expect(action.type).toEqual(CashMemoActionTypes.LOAD_CASH_MEMO_HISTORY);

      expect(action.payload).toEqual(cashMemoHistoryRequestPayload);
    });
    it('should check correct type is used for LoadCashMemoHistorySuccess action ', () => {
      const action = new LoadCashMemoHistorySuccess(cashMemoHistoryResponse);

      expect(action.type).toEqual(
        CashMemoActionTypes.LOAD_CASH_MEMO_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoHistoryResponse);
    });
    it('should check correct type is used for LoadCashMemoHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCashMemoHistoryFailure(payload);

      expect(action.type).toEqual(
        CashMemoActionTypes.LOAD_CASH_MEMO_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadItemFromCashMemoHistory Action Test Cases', () => {
    it('should check correct type is used for  LoadItemFromCashMemoHistory  action ', () => {
      const action = new LoadItemFromCashMemoHistory(
        cashMemoItemDetailsRequestPayload
      );

      expect(action.type).toEqual(
        CashMemoActionTypes.LOAD_ITEM_FROM_CASH_MEMO_HISTORY
      );

      expect(action.payload).toEqual(cashMemoItemDetailsRequestPayload);
    });
    it('should check correct type is used for LoadItemFromCashMemoHistorySuccess action ', () => {
      const action = new LoadItemFromCashMemoHistorySuccess(
        cashMemoItemDetails
      );

      expect(action.type).toEqual(
        CashMemoActionTypes.LOAD_ITEM_FROM_CASH_MEMO_HISTORY_SUCCESS
      );
      expect(action.payload).toEqual(cashMemoItemDetails);
    });
    it('should check correct type is used for LoadItemFromCashMemoHistoryFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadItemFromCashMemoHistoryFailure(payload);

      expect(action.type).toEqual(
        CashMemoActionTypes.LOAD_ITEM_FROM_CASH_MEMO_HISTORY_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ResetAction Test Cases', () => {
    it('should check correct type is used for  ResetValues action ', () => {
      const action = new ResetValues();

      expect(action.type).toEqual(CashMemoActionTypes.RESET_VALUES);
    });
  });

  describe('ResetHistory Test Cases', () => {
    it('should check correct type is used for  ResetHistory action ', () => {
      const action = new ResetHistory();

      expect(action.type).toEqual(CashMemoActionTypes.RESET_HISTORY);
    });
  });
  describe('UpdateHistorySearchParameter Test Cases', () => {
    it('should check correct type is used for  UpdateHistorySearchParameter action ', () => {
      const action = new UpdateHistorySearchParameter(
        cashMemoHistoryRequestPayload
      );

      expect(action.type).toEqual(
        CashMemoActionTypes.UPDATE_HISTORY_SEARCH_PARAMETER
      );
    });
  });

  describe('GetMaterialPrices Action Test Cases', () => {
    it('should check correct type is used for  GetMaterialPrices  action ', () => {
      const action = new GetMaterialPrices(metalRatesPayload);

      expect(action.type).toEqual(CashMemoActionTypes.GET_MATERIAL_PRICES);

      expect(action.payload).toEqual(metalRatesPayload);
    });
    it('should check correct type is used for GetMaterialPricesSuccess action ', () => {
      const action = new GetMaterialPricesSuccess(metalRates);

      expect(action.type).toEqual(
        CashMemoActionTypes.GET_MATERIAL_PRICES_SUCCESS
      );
      expect(action.payload).toEqual(metalRates);
    });
    it('should check correct type is used for GetMaterialPricesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetMaterialPricesFailure(payload);

      expect(action.type).toEqual(
        CashMemoActionTypes.GET_MATERIAL_PRICES_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('FileUpload Action Test Cases', () => {
    it('should check correct type is used for  FileUpload  action ', () => {
      const action = new FileUpload(fileUploadDownloadPayload);

      expect(action.type).toEqual(CashMemoActionTypes.FILE_UPLOAD);

      expect(action.payload).toEqual(fileUploadDownloadPayload);
    });
    it('should check correct type is used for FileUploadSuccess action ', () => {
      const action = new FileUploadSuccess(fileUploadRes);

      expect(action.type).toEqual(CashMemoActionTypes.FILE_UPLOAD_SUCCESS);
      expect(action.payload).toEqual(fileUploadRes);
    });
    it('should check correct type is used for FileUploadFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileUploadFailure(payload);

      expect(action.type).toEqual(CashMemoActionTypes.FILE_UPLOAD_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('FileUploadList Action Test Cases', () => {
    it('should check correct type is used for  FileUploadList  action ', () => {
      const action = new FileUploadList(fileUploadDownloadPayload);

      expect(action.type).toEqual(CashMemoActionTypes.FILE_UPLOAD_LIST);

      expect(action.payload).toEqual(fileUploadDownloadPayload);
    });
    it('should check correct type is used for FileUploadListSuccess action ', () => {
      const action = new FileUploadListSuccess(fileUploadListRes);

      expect(action.type).toEqual(CashMemoActionTypes.FILE_UPLOAD_LIST_SUCCESS);
      expect(action.payload).toEqual(fileUploadListRes);
    });
    it('should check correct type is used for FileUploadListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileUploadListFailure(payload);

      expect(action.type).toEqual(CashMemoActionTypes.FILE_UPLOAD_LIST_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('FileDownloadUrl Action Test Cases', () => {
    it('should check correct type is used for  FileDownloadUrl  action ', () => {
      const action = new FileDownloadUrl(fileDownloadReq);

      expect(action.type).toEqual(CashMemoActionTypes.FILE_DOWNLOAD_URL);

      expect(action.payload).toEqual(fileDownloadReq);
    });
    it('should check correct type is used for FileDownloadUrlSuccess action ', () => {
      const action = new FileDownloadUrlSuccess(fileDownloadRes);

      expect(action.type).toEqual(
        CashMemoActionTypes.FILE_DOWNLOAD_URL_SUCCESS
      );
      expect(action.payload).toEqual(fileDownloadRes);
    });
    it('should check correct type is used for FileDownloadUrlFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FileDownloadUrlFailure(payload);

      expect(action.type).toEqual(
        CashMemoActionTypes.FILE_DOWNLOAD_URL_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadTcsDetail Action Test Cases', () => {
    it('should check correct type is used for  LoadTcsDetail  action ', () => {
      const action = new LoadTcsDetail(cashMemoDetailsRequestPayload);

      expect(action.type).toEqual(CashMemoActionTypes.LOAD_TCS_DETAIL);
      expect(action.payload).toEqual(cashMemoDetailsRequestPayload);
    });
    it('should check correct type is used for LoadTcsDetailSuccess action ', () => {
      const action = new LoadTcsDetailSuccess(tcsResponse);

      expect(action.type).toEqual(CashMemoActionTypes.LOAD_TCS_DETAIL_SUCCESS);
      expect(action.payload).toEqual(tcsResponse);
    });
    it('should check correct type is used for LoadTcsDetailFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTcsDetailFailure(payload);

      expect(action.type).toEqual(CashMemoActionTypes.LOAD_TCS_DETAIL_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SetABInvoked Test Cases', () => {
    it('should check correct type is used for  SetABInvoked action ', () => {
      const action = new SetABInvoked(false);

      expect(action.type).toEqual(CashMemoActionTypes.SET_AB_INVOKED);
    });
  });

  describe('SetFocus Test Cases', () => {
    it('should check correct type is used for  SetFocus action ', () => {
      const action = new SetFocus(1);

      expect(action.type).toEqual(CashMemoActionTypes.SET_FOCUS);
    });
  });
});
