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
import { advanceBookingReducer, initialState } from './advance-booking.reducer';
import { AdvanceBookingState } from './advance-booking.state';
import {
  ABRequestStatusDownValues,
  ABRequestStatusList,
  ABSearchResponse,
  ABSearchValues,
  AdvanceBookingDetailsRequestPayload,
  AdvanceBookingDetailsResponse,
  AdvanceBookingSearchPayload,
  CashMemoItemDetailsRequestPayload,
  RequestPayload,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';
import * as moment from 'moment';

describe('AB Reducer Testing Suite', () => {
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
    confirmedTime: moment(),
    hallmarkCharges: 0,
    hallmarkDiscount: 0,
    isRivaah: false,
    isFrozenAmount: 0,
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
    totalWeight: 1,
    txnTime: moment()
  };

  const aBSearchResponse: ABSearchResponse = {
    ABList: [advanceBookingDetailsResponse],
    totalElements: 1
  };

  describe('Testing CreateCashMemo Functionality', () => {
    it('CreateCashMemo should be called', () => {
      const action = new CreateCashMemo(advanceBookingDetailsRequestPayload);
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('CreateCashMemoSuccess should be called', () => {
      const action = new CreateCashMemoSuccess(advanceBookingDetailsResponse);
      const result: AdvanceBookingState = advanceBookingReducer(
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

      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing ViewCashMemo Functionality', () => {
    it('ViewCashMemo should be called', () => {
      const action = new ViewCashMemo(advanceBookingDetailsRequestPayload);
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('ViewCashMemoSuccess should be called', () => {
      const action = new ViewCashMemoSuccess(advanceBookingDetailsResponse);
      const result: AdvanceBookingState = advanceBookingReducer(
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

      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing PartialUpdateCashMemo Functionality', () => {
    it('PartialUpdateCashMemo should be called', () => {
      const action = new PartialUpdateCashMemo(
        advanceBookingDetailsRequestPayload
      );
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('PartialUpdateCashMemoSuccess should be called', () => {
      const action = new PartialUpdateCashMemoSuccess(
        advanceBookingDetailsResponse
      );
      const result: AdvanceBookingState = advanceBookingReducer(
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

      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing FreezeAdvanceBooking Functionality', () => {
    it('FreezeAdvanceBooking should be called', () => {
      const action = new FreezeAdvanceBooking(
        advanceBookingDetailsRequestPayload
      );
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('FreezeAdvanceBookingSuccess should be called', () => {
      const action = new FreezeAdvanceBookingSuccess(
        advanceBookingDetailsResponse
      );
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.freezeAdvanceBookingResponse).toBeTruthy();
    });
    it('FreezeAdvanceBookingFailure should be called', () => {
      const action = new FreezeAdvanceBookingFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing UpdateCashMemo Functionality', () => {
    it('UpdateCashMemo should be called', () => {
      const action = new UpdateCashMemo(advanceBookingDetailsRequestPayload);
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('UpdateCashMemoSuccess should be called', () => {
      const action = new UpdateCashMemoSuccess(advanceBookingDetailsResponse);
      const result: AdvanceBookingState = advanceBookingReducer(
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

      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing DeleteCashMemo Functionality', () => {
    it('DeleteCashMemo should be called', () => {
      const action = new DeleteCashMemo(advanceBookingDetailsRequestPayload);
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('DeleteCashMemoSuccess should be called', () => {
      const action = new DeleteCashMemoSuccess(true);
      const result: AdvanceBookingState = advanceBookingReducer(
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

      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing SearchAB Functionality', () => {
    it('SearchAB should be called', () => {
      const action = new SearchAB(advanceBookingSearchPayload);
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('SearchABSuccess should be called', () => {
      const action = new SearchABSuccess(aBSearchResponse);
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.searhABResponse).toBeTruthy();
    });
    it('SearchABFailure should be called', () => {
      const action = new SearchABFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing LoadRequests Functionality', () => {
    it('LoadRequests should be called', () => {
      const action = new LoadRequests(requestPayload);
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('LoadRequestsSuccess should be called', () => {
      const action = new LoadRequestsSuccess(aBRequestStatusList);
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.ABRequestStatusList).toBeTruthy();
    });
    it('LoadRequestsFailure should be called', () => {
      const action = new LoadRequestsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing UpdatePriceDetails Functionality', () => {
    it('UpdatePriceDetails should be called', () => {
      const action = new UpdatePriceDetails(
        advanceBookingDetailsRequestPayload
      );
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.hasError).toEqual(null);
    });

    it('SearchABSuccess should be called', () => {
      const action = new UpdatePriceDetailsSuccess(
        advanceBookingDetailsResponse
      );
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.viewCashMemoResponse).toBeTruthy();
    });
    it('SearchABFailure should be called', () => {
      const action = new UpdatePriceDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('Some Error'))
      );

      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError.message).toEqual('Some Error');
    });
  });

  describe('Testing Reset Functionality', () => {
    it('ClearSearchProductList should be called', () => {
      const action = new ClearSearchProductList();
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.searchProductListCount).toEqual(0);
      expect(result.searchProductList).toEqual(null);
    });

    it('ResetValues should be called', () => {
      const action = new ResetValues();
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('ResetProductValues should be called', () => {
      const action = new ResetProductValues();
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('ResetLotNumberValues should be called', () => {
      const action = new ResetLotNumberValues();
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
    it('ClearProductDetails should be called', () => {
      const action = new ClearProductDetails();
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });
    it('ClearProductRelatedDetails should be called', () => {
      const action = new ClearProductRelatedDetails();
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('ClearSearchList should be called', () => {
      const action = new ClearSearchList();
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.ABRequestStatusListCount).toEqual(0);
    });
  });

  describe('Testing Set values Functionality', () => {
    it('SetSearchValues should be called', () => {
      const action = new SetSearchValues(aBSearchValues);
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.searchValues).toBeTruthy();
    });

    // it('SetOrderNumber should be called', () => {
    //   const action = new SetOrderNumber(1);
    //   const result: AdvanceBookingState = advanceBookingReducer(
    //     initialState,
    //     action
    //   );
    //   expect(result.isLoading).toEqual(false);
    //   expect(result.hasError).toEqual(null);
    // });

    it('SetDropownValues should be called', () => {
      const action = new SetDropownValues(aBRequestStatusDownValues);
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
    });

    it('ResetLotNumberValues should be called', () => {
      const action = new LoadSelectedLotNumberDetails('test');
      const result: AdvanceBookingState = advanceBookingReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(false);
      expect(result.hasError).toEqual(null);
      expect(result.selectedLotNumber).toBeTruthy();
    });
  });
});
