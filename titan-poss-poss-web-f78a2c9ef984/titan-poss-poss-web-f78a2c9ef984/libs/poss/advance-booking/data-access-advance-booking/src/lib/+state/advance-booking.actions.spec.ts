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
  SetSearchValues,
  DeleteCashMemo,
  DeleteCashMemoSuccess,
  DeleteCashMemoFailure,
  SetOrderNumber,
  UpdatePriceDetails,
  UpdatePriceDetailsSuccess,
  UpdatePriceDetailsFailure,
  FreezeAdvanceBooking,
  FreezeAdvanceBookingSuccess,
  ClearSearchList,
  SearchAB,
  SearchABSuccess,
  SearchABFailure,
  SetDropownValues,
  FreezeAdvanceBookingFailure,
  LoadSelectedLotNumberDetails,
  ResetValues,
  LoadRequests,
  LoadRequestsSuccess,
  LoadRequestsFailure,
  ResetLotNumberValues,
  ResetProductValues,
  ClearSearchProductList,
  ClearProductDetails,
  LoadSelectedData,
  ClearProductRelatedDetails,
  AdvanceBookingActionTypes
} from './advance-booking.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ConfigListingPayload,
  CustomErrors,
  PrinterConfigList,
  PrinterConfigDetails,
  Lov,
  StatusTypesEnum,
  ABSearchResponse,
  ABRequestStatusList,
  AdvanceBookingDetailsResponse,
  ABSearchValues,
  ABRequestStatusDownValues,
  AdvanceBookingDetailsRequestPayload,
  AdvanceBookingSearchPayload,
  RequestPayload,
  CashMemoItemDetailsRequestPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';

const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
  id: '',
  subTxnType: '',
  txnType: ''
};

const requestPayload: RequestPayload = {
  httpMethod: 'string',
  relativeUrl: '',
  reqBody: {
    dateRangeType: 'string',
    docNo: 1,
    endDate: moment(),
    fiscalYear: 1,
    startDate: moment()
  },
  requestParams: {
    page: 1,
    size: 0,
    workflowType: 's',
    approvalStatus: 'string',
    sort: 'any'
  }
};

const advanceBookingSearchPayload: AdvanceBookingSearchPayload = {
  docNo: 0,
  page: 0,
  size: 8,
  subTxnType: '',
  txnType: '',
  fiscalYear: 2015
};

const advanceBookingDetailsRequestPayload: AdvanceBookingDetailsRequestPayload = {
  subTxnType: '',
  txnType: '',
  actionType: ''
};

const aBRequestStatusDownValues: ABRequestStatusDownValues = {
  status: '',
  type: ''
};

const aBSearchValues: ABSearchValues = {
  doNo: 0,
  fiscalYear: 2016,
  function: '',
  phNo: 810539193
};

const aBRequestStatusList: ABRequestStatusList = {
  pageNumber: 0,
  pageSize: 8,
  response: {},
  results: [],
  totalElements: 8,
  totalPages: 1
};

const advanceBookingDetailsResponse: AdvanceBookingDetailsResponse = {
  activationDetails: {},
  cancellationDetails: {},
  hallmarkCharges: 0,
  hallmarkDiscount: 0,
  isFrozenAmount: 0,
  confirmedTime: moment(),
  customerId: 1,
  discountDetails: 0,
  docDate: moment(),
  docNo: 1,
  employeeCode: '',
  refSubTxnType: '',
  customerDocDetails: '',
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
  taxDetails: { cess: [], data: [], taxClass: '', taxType: '' },
  totalDiscount: 1,
  totalQuantity: 1,
  totalTax: 1,
  totalValue: 1,
  isRivaah: false,
  totalWeight: 1,
  txnTime: moment()
};

const aBSearchResponse: ABSearchResponse = {
  ABList: [advanceBookingDetailsResponse],
  totalElements: 1
};

describe('Advance Booking  Action Testing Suite', () => {
  describe('CreateCashMemo Action Test Cases', () => {
    it('should check correct type is used for  CreateCashMemo  action ', () => {
      const action = new CreateCashMemo(advanceBookingDetailsRequestPayload);

      expect(action.type).toEqual(AdvanceBookingActionTypes.CREATE_CASH_MEMO);

      expect(action.payload).toEqual(advanceBookingDetailsRequestPayload);
    });
    it('should check correct type is used for CreateCashMemoSuccess action ', () => {
      const action = new CreateCashMemoSuccess(advanceBookingDetailsResponse);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.CREATE_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual(advanceBookingDetailsResponse);
    });
    it('should check correct type is used for CreateCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateCashMemoFailure(payload);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.CREATE_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('ViewCashMemo Action Test Cases', () => {
    it('should check correct type is used for  ViewCashMemo  action ', () => {
      const action = new ViewCashMemo(advanceBookingDetailsRequestPayload);

      expect(action.type).toEqual(AdvanceBookingActionTypes.VIEW_CASH_MEMO);

      expect(action.payload).toEqual(advanceBookingDetailsRequestPayload);
    });
    it('should check correct type is used for ViewCashMemoSuccess action ', () => {
      const action = new ViewCashMemoSuccess(advanceBookingDetailsResponse);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.VIEW_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual(advanceBookingDetailsResponse);
    });
    it('should check correct type is used for ViewCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ViewCashMemoFailure(payload);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.VIEW_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });
  describe('PartialUpdateCashMemo Action Test Cases', () => {
    it('should check correct type is used for  PartialUpdateCashMemo  action ', () => {
      const action = new PartialUpdateCashMemo(
        advanceBookingDetailsRequestPayload
      );

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.PARTIAL_UPDATE_CASH_MEMO
      );

      expect(action.payload).toEqual(advanceBookingDetailsRequestPayload);
    });
    it('should check correct type is used for PartialUpdateCashMemoSuccess action ', () => {
      const action = new PartialUpdateCashMemoSuccess(
        advanceBookingDetailsResponse
      );

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.PARTIAL_UPDATE_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual(advanceBookingDetailsResponse);
    });
    it('should check correct type is used for PartialUpdateCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PartialUpdateCashMemoFailure(payload);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.PARTIAL_UPDATE_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('FreezeAdvanceBooking Action Test Cases', () => {
    it('should check correct type is used for  FreezeAdvanceBooking  action ', () => {
      const action = new FreezeAdvanceBooking(
        advanceBookingDetailsRequestPayload
      );

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.FREEZE_ADVANCE_BOOKING
      );

      expect(action.payload).toEqual(advanceBookingDetailsRequestPayload);
    });
    it('should check correct type is used for FreezeAdvanceBookingSuccess action ', () => {
      const action = new FreezeAdvanceBookingSuccess(
        advanceBookingDetailsResponse
      );

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.FREEZE_ADVANCE_BOOKING_SUCCESS
      );
      expect(action.payload).toEqual(advanceBookingDetailsResponse);
    });
    it('should check correct type is used for FreezeAdvanceBookingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FreezeAdvanceBookingFailure(payload);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.FREEZE_ADVANCE_BOOKING_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdateCashMemo Action Test Cases', () => {
    it('should check correct type is used for  UpdateCashMemo  action ', () => {
      const action = new UpdateCashMemo(advanceBookingDetailsRequestPayload);

      expect(action.type).toEqual(AdvanceBookingActionTypes.UPDATE_CASH_MEMO);

      expect(action.payload).toEqual(advanceBookingDetailsRequestPayload);
    });
    it('should check correct type is used for UpdateCashMemoSuccess action ', () => {
      const action = new UpdateCashMemoSuccess(advanceBookingDetailsResponse);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.UPDATE_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual(advanceBookingDetailsResponse);
    });
    it('should check correct type is used for UpdateCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCashMemoFailure(payload);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.UPDATE_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('DeleteCashMemo Action Test Cases', () => {
    it('should check correct type is used for  DeleteCashMemo  action ', () => {
      const action = new DeleteCashMemo(advanceBookingDetailsRequestPayload);

      expect(action.type).toEqual(AdvanceBookingActionTypes.DELETE_CASH_MEMO);

      expect(action.payload).toEqual(advanceBookingDetailsRequestPayload);
    });
    it('should check correct type is used for DeleteCashMemoSuccess action ', () => {
      const action = new DeleteCashMemoSuccess(true);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.DELETE_CASH_MEMO_SUCCESS
      );
      expect(action.payload).toEqual(true);
    });
    it('should check correct type is used for DeleteCashMemoFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new DeleteCashMemoFailure(payload);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.DELETE_CASH_MEMO_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('SearchAB Action Test Cases', () => {
    it('should check correct type is used for  SearchAB  action ', () => {
      const action = new SearchAB(advanceBookingSearchPayload);

      expect(action.type).toEqual(AdvanceBookingActionTypes.SEARCH_AB);

      expect(action.payload).toEqual(advanceBookingSearchPayload);
    });
    it('should check correct type is used for SearchABSuccess action ', () => {
      const action = new SearchABSuccess(aBSearchResponse);

      expect(action.type).toEqual(AdvanceBookingActionTypes.SEARCH_AB_SUCCESS);
      expect(action.payload).toEqual(aBSearchResponse);
    });
    it('should check correct type is used for SearchABFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchABFailure(payload);

      expect(action.type).toEqual(AdvanceBookingActionTypes.SEARCH_AB_FAILURE);
      expect(action.payload).toEqual(payload);
    });
  });

  describe('LoadRequests Action Test Cases', () => {
    it('should check correct type is used for  LoadRequests  action ', () => {
      const action = new LoadRequests(requestPayload);

      expect(action.type).toEqual(AdvanceBookingActionTypes.LOAD_REQUESTS);

      expect(action.payload).toEqual(requestPayload);
    });
    it('should check correct type is used for LoadRequestsSuccess action ', () => {
      const action = new LoadRequestsSuccess(aBRequestStatusList);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.LOAD_REQUESTS_SUCCESS
      );
      expect(action.payload).toEqual(aBRequestStatusList);
    });
    it('should check correct type is used for LoadRequestsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRequestsFailure(payload);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.LOAD_REQUESTS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('UpdatePriceDetails Action Test Cases', () => {
    it('should check correct type is used for  UpdatePriceDetails  action ', () => {
      const action = new UpdatePriceDetails(
        advanceBookingDetailsRequestPayload
      );

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.UPDATE_PRICE_DETAILS
      );

      expect(action.payload).toEqual(advanceBookingDetailsRequestPayload);
    });
    it('should check correct type is used for UpdatePriceDetailsSuccess action ', () => {
      const action = new UpdatePriceDetailsSuccess(
        advanceBookingDetailsResponse
      );

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.UPDATE_PRICE_DETAILS_SUCCESS
      );
      expect(action.payload).toEqual(advanceBookingDetailsResponse);
    });
    it('should check correct type is used for UpdatePriceDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdatePriceDetailsFailure(payload);

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.UPDATE_PRICE_DETAILS_FAILURE
      );
      expect(action.payload).toEqual(payload);
    });
  });

  describe('Reset Action Test Cases', () => {
    it('should check correct type is used for  ClearSearchProductList action ', () => {
      const action = new ClearSearchProductList();

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.CLEAR_SEARCH_PRODUCT_LIST
      );
    });

    it('should check correct type is used for  ResetValues action ', () => {
      const action = new ResetValues();

      expect(action.type).toEqual(AdvanceBookingActionTypes.RESET_VALUES);
    });

    it('should check correct type is used for  ResetLotNumberValues action ', () => {
      const action = new ResetLotNumberValues();

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.RESET_LOTNUMBER_VALUES
      );
    });

    it('should check correct type is used for  ResetProductValues action ', () => {
      const action = new ResetProductValues();

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.RESET_PRODUCT_VALUES
      );
    });

    it('should check correct type is used for  ClearProductDetails action ', () => {
      const action = new ClearProductDetails();

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.CLEAR_PRODUCT_DETAILS
      );
    });

    it('should check correct type is used for  ClearProductRelatedDetails action ', () => {
      const action = new ClearProductRelatedDetails();

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.CLEAR_PRODUCT_RELATED_DETAILS
      );
    });

    it('should check correct type is used for  ClearSearchList action ', () => {
      const action = new ClearSearchList();

      expect(action.type).toEqual(AdvanceBookingActionTypes.CLEAR_SEARCH_LIST);
    });
  });

  describe('set values Action Test Cases', () => {
    it('should check correct type is used for  ResetResponse action ', () => {
      const action = new SetSearchValues(aBSearchValues);

      expect(action.type).toEqual(AdvanceBookingActionTypes.SET_SEARCH_VALUES);
      expect(action.payload).toEqual(aBSearchValues);
    });

    // it('should check correct type is used for  SetOrderNumber action ', () => {
    //   const action = new SetOrderNumber(1);

    //   expect(action.type).toEqual(AdvanceBookingActionTypes.SET_ORDER_NUMBER);
    //   expect(action.payload).toEqual(1);
    // });

    it('should check correct type is used for  SetDropownValues action ', () => {
      const action = new SetDropownValues(aBRequestStatusDownValues);

      expect(action.type).toEqual(AdvanceBookingActionTypes.SET_DROPDOWN_VALUE);
      expect(action.payload).toEqual(aBRequestStatusDownValues);
    });

    it('should check correct type is used for  LoadSelectedLotNumberDetails action ', () => {
      const action = new LoadSelectedLotNumberDetails('');

      expect(action.type).toEqual(
        AdvanceBookingActionTypes.LOAD_SELECTED_LOTNUMBER_DETAILS
      );
      expect(action.payload).toEqual('');
    });
  });
});
