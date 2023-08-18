import { AdvanceBookingEffects } from './advance-booking.effects';

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
  ClearProductRelatedDetails
} from './advance-booking.actions';
import { hot, cold } from 'jasmine-marbles';
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
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { AdvanceBookingService } from '../advance-booking.service';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { advanceBookingFeatureKey } from './advance-booking.reducer';
import { ErrorEnums } from '@poss-web/shared/util-error';
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
  customerDocDetails: '',
  refSubTxnType: '',
  hallmarkCharges: 0,
  hallmarkDiscount: 0,
  isFrozenAmount: 0,
  isRivaah: false,
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

describe('Advance Booking Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: AdvanceBookingEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  let advanceBookingService = jasmine.createSpyObj<AdvanceBookingService>(
    'AdvanceBookingService',
    [
      'createCashMemo',
      'viewCashMemo',
      'searchAB',
      'partialUpdateCashMemo',
      'updateABActions',
      'updateCashMemo',
      'deleteCashMemo',
      'updatePriceDetails',

      'getloadRequest'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdvanceBookingEffects,
        DataPersistence,
        provideMockStore({
          initialState: {
            [advanceBookingFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },

        {
          provide: HttpClient,
          useValue: httpClientSpy
        },

        {
          provide: AdvanceBookingService,
          useValue: advanceBookingService
        }

        // {
        //   provide: advanceBookingService,
        //   useValue: {
        //     printerList: jasmine.createSpy(),
        //     addPrinter: jasmine.createSpy(),
        //     deletePrinter: jasmine.createSpy()
        //   }
        // }
      ]
    });

    effect = TestBed.inject(AdvanceBookingEffects);
    advanceBookingService = TestBed.inject<any>(AdvanceBookingService);
  });

  describe('createCashMemo', () => {
    it('should return createCashMemo resposne', () => {
      const action = new CreateCashMemo(advanceBookingDetailsRequestPayload);
      const outcome = new CreateCashMemoSuccess(advanceBookingDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: advanceBookingDetailsResponse
      });
      advanceBookingService.createCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.createCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CreateCashMemo(advanceBookingDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new CreateCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      advanceBookingService.createCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createCashMemo$).toBeObservable(expected);
    });
  });

  describe('viewCashMemo', () => {
    it('should return a viewCashMemo resposne', () => {
      const action = new ViewCashMemo(advanceBookingDetailsRequestPayload);
      const outcome = new ViewCashMemoSuccess(advanceBookingDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: advanceBookingDetailsResponse
      });
      advanceBookingService.viewCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.viewCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ViewCashMemo(advanceBookingDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new ViewCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      advanceBookingService.viewCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.viewCashMemo$).toBeObservable(expected);
    });
  });

  describe('searchAB', () => {
    it('should return a stream of searchAB response ', () => {
      const action = new SearchAB(advanceBookingSearchPayload);
      const outcome = new SearchABSuccess(aBSearchResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: aBSearchResponse
      });
      advanceBookingService.searchAB.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.searchAB$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SearchAB(advanceBookingSearchPayload);
      const error = new Error('some error');
      const outcome = new SearchABFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      advanceBookingService.searchAB.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchAB$).toBeObservable(expected);
    });
  });

  describe('partialUpdateCashMemo', () => {
    it('should return a partialUpdateCashMemo resposne', () => {
      const action = new PartialUpdateCashMemo(
        advanceBookingDetailsRequestPayload
      );
      const outcome = new PartialUpdateCashMemoSuccess(
        advanceBookingDetailsResponse
      );

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: advanceBookingDetailsResponse
      });
      advanceBookingService.partialUpdateCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.partialUpdateCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new PartialUpdateCashMemo(
        advanceBookingDetailsRequestPayload
      );
      const error = new Error('some error');
      const outcome = new PartialUpdateCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      advanceBookingService.partialUpdateCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.partialUpdateCashMemo$).toBeObservable(expected);
    });
  });

  describe('freezeRate', () => {
    it('should return a freezeRate resposne', () => {
      const action = new FreezeAdvanceBooking(
        advanceBookingDetailsRequestPayload
      );
      const outcome = new FreezeAdvanceBookingSuccess(
        advanceBookingDetailsResponse
      );

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: advanceBookingDetailsResponse
      });
      advanceBookingService.updateABActions.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.freezeRate$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FreezeAdvanceBooking(
        advanceBookingDetailsRequestPayload
      );
      const error = new Error('some error');
      const outcome = new FreezeAdvanceBookingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      advanceBookingService.updateABActions.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.freezeRate$).toBeObservable(expected);
    });
  });

  describe('updateCashMemo', () => {
    it('should return a updateCashMemo resposne', () => {
      const action = new UpdateCashMemo(advanceBookingDetailsRequestPayload);
      const outcome = new UpdateCashMemoSuccess(advanceBookingDetailsResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: advanceBookingDetailsResponse
      });
      advanceBookingService.updateCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.updateCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateCashMemo(advanceBookingDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new UpdateCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      advanceBookingService.updateCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateCashMemo$).toBeObservable(expected);
    });
  });
  describe('deleteCashMemo', () => {
    it('should return a deleteCashMemo resposne', () => {
      const action = new DeleteCashMemo(advanceBookingDetailsRequestPayload);
      const outcome = new DeleteCashMemoSuccess(true);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: true
      });
      advanceBookingService.deleteCashMemo.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.deleteCashMemo$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new DeleteCashMemo(advanceBookingDetailsRequestPayload);
      const error = new Error('some error');
      const outcome = new DeleteCashMemoFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      advanceBookingService.deleteCashMemo.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.deleteCashMemo$).toBeObservable(expected);
    });
  });

  describe('UpdatePriceDetails', () => {
    it('should return a UpdatePriceDetails resposne', () => {
      const action = new UpdatePriceDetails(
        advanceBookingDetailsRequestPayload
      );
      const outcome = new UpdatePriceDetailsSuccess(
        advanceBookingDetailsResponse
      );

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: advanceBookingDetailsResponse
      });
      advanceBookingService.updatePriceDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.updatePriceDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdatePriceDetails(
        advanceBookingDetailsRequestPayload
      );
      const error = new Error('some error');
      const outcome = new UpdatePriceDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      advanceBookingService.updatePriceDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updatePriceDetails$).toBeObservable(expected);
    });
  });

  describe('billCancelList', () => {
    it('should return a billCancelList resposne', () => {
      const action = new LoadRequests(requestPayload);
      const outcome = new LoadRequestsSuccess(aBRequestStatusList);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: aBRequestStatusList
      });
      advanceBookingService.getloadRequest.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.billCancelList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRequests(requestPayload);
      const error = new Error('some error');
      const outcome = new LoadRequestsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      advanceBookingService.getloadRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.billCancelList$).toBeObservable(expected);
    });
  });
});
