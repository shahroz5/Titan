import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { CommonService } from '@poss-web/shared/common/data-access-common';
import {
  BinDataService,
  ProductGroupDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  BinCode,
  ConversionApprovalDetailsPayload,
  ConversionHistorySuccessPayload,
  ConversionInventoryItem,
  ConversionItemPayload,
  ConversionRequestItems,
  ConversionRequestResponse,
  ConversionRequests,
  ConversionRequestsResponse,
  ConversionResponse,
  ConversionSplitItemDetailsDataPayload,
  ConversionSplitItemPayload,
  ConversionSplitReqItemPayload,
  ConversionSplitReqPayload,
  ConvertedTransactionHistoryPayload,
  LoadConversionRequestsPayload,
  ProductGroup,
  RequestSentHistoryPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { cold, hot } from 'jasmine-marbles';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ConversionService } from '../conversion.service';
import {
  ConfirmConversion,
  ConfirmConversionFailure,
  ConfirmConversionSuccess,
  LoadBinCodes,
  LoadBinCodesFailure,
  LoadBinCodesSuccess,
  LoadConversionRequests,
  LoadConversionRequestsFailure,
  LoadConversionRequestsSuccess,
  LoadConvertedTransactionHistory,
  LoadConvertedTransactionHistorySuccess,
  LoadRequestsCount,
  LoadRequestsCountFailure,
  LoadRequestsCountSuccess,
  LoadRequestSentHistory,
  LoadRequestSentHistorySuccess,
  LoadRsoDetails,
  LoadRsoDetailsFailure,
  LoadRsoDetailsSuccess,
  LoadSelectedRequest,
  LoadSelectedRequestFailure,
  LoadSelectedRequestHistory,
  LoadSelectedRequestHistoryFailure,
  LoadSelectedRequestHistorySuccess,
  LoadSelectedRequestSuccess,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsFailure,
  LoadStuddedProductGroupsSuccess,
  SearchConversionRequests,
  SearchConversionRequestsSuccess,
  SendConversionRequest,
  SendConversionRequestFailure,
  SendConversionRequestSuccess,
  SplitItems,
  SplitItemsFailure,
  SplitItemsSuccess
} from './conversion.actions';
import { ConversionEffect } from './conversion.effects';
import { initialState } from './conversion.reducer';

describe('Conversion Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ConversionEffect;

  const conversionServiceSpy = jasmine.createSpyObj<ConversionService>([
    'getSearchedItems',
    'getRequests',
    'getConversionRequests',
    'getCount',
    'getRequest',
    'getSelectedRequestDetails',
    'getSelectedRequestItems',
    'getConversionItems',
    'sendConversionsRequest',
    'conversionrequestConfirm',
    'getRsoDetails',
    'getRequestSentHistory',
    'getConvertedTransactionHistory',
    'getSelectedRequestHistory',
    'getConvesionHistoryItems'
  ]);
  const binDataServiceSpy = jasmine.createSpyObj<BinDataService>([
    'getBinDetails'
  ]);
  const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>([
    'getStoreUsers'
  ]);
  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getStoreUsers', 'getProductGroups']);
  const commonServiceSpy = jasmine.createSpyObj<
  CommonService
  >(['getThumbnailImageUrl', 'getImageUrl'])
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConversionEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),

        {
          provide: ConversionService,
          useValue: conversionServiceSpy
        },
        {
          provide: BinDataService,
          useValue: binDataServiceSpy
        },
        {
          provide: CommonService,
          useValue: commonServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataServiceSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataServiceSpy
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        }
      ]
    });

    effect = TestBed.inject(ConversionEffect);
  });
  const requestPayload: RequestSentHistoryPayload = {
    requestSentPayload: {
      actionType: 'REQUEST_SENT',
      dateRangeType: 'CUSTOM',
      endDate: '12312321321',
      locationCode: '123123213',
      reqDocNo: 12,
      reqFiscalYear: '2021',
      startDate: '123123213',
      statuses: []
    },
    pageIndex: 0,
    pageSize: 10,
    requestType: 'REQUEST'
  };
  const conversionHistory = {
    id: 12,
    srcLocationCode: 'CPD',
    destLocationCode: 'CPD',
    status: 'PENDING',
    weightUnit: '12',
    currencyCode: 'INR',
    srcLocationDescription: 'CPD',
    destLocationDescription: '123',
    srcDocNo: 12,
    srcFiscalYear: 12,
    srcDocDate: moment(123),
    destDocNo: '12',
    destDocDate: moment(456),
    totalAvailableQuantity: 12,
    totalMeasuredQuantity: 12,
    totalAvailableValue: 12,
    totalMeasuredValue: 12,
    totalAvailableWeight: 12,
    totalMeasuredWeight: 12,
    reqDocDate: moment(123),
    reqDocNo: 123,
    reqLocationCode: 'CPD',
    requestType: 'REQUEST',
    remarks: 'good',
    prevTransaction: 12,
    rsoName: 'RSO'
  };
  const response: ConversionHistorySuccessPayload = {
    requestSentHistory: [conversionHistory],
    count: 10
  };
  const itemCode = '501090FGALAP70';
  const conversionInventoryItem: ConversionInventoryItem = {
    availableQuantity: 1,
    availableValue: 166396,
    availableWeight: 3.905,
    binCode: 'AREPLNISH',
    binGroupCode: 'STN',
    currencyCode: 'INR',
    id: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    imageURL: '/productcatalogue/ProductImages/1090FGA.jpg',
    isLoadingImage: true,
    isLoadingThumbnailImage: false,
    thumbnailImageURL: 'abcdefg',
    itemCode: '501090FGALAP70',
    itemDetails: {
      type: 'ITEM_DETAILS',
      data: {
        stoneValue: 141200.0,
        hallMarkRemarks1: '',
        hallMarkingCode: '',
        hallMarkingCentreName: '',
        hallMarkRemarks: '',
        hallMarkedDate: null,
        isHallMarking: true
      }
    },
    lotNumber: '3IH005125',
    mfgDate: moment(1636309800000),
    productCategory: 'F',
    productCategoryDesc: 'FINGER RING',
    productGroup: '77',
    productGroupDesc: 'Studded - Solitaire',
    status: null,
    stdValue: 166396,
    stdWeight: 3.905,
    weightUnit: 'gms',
    isStudded: false
  };
  const loadConversionRequestsPayload: LoadConversionRequestsPayload = {
    pageIndex: 0,
    pageSize: 8
  };
  const conversionRequestsResponse: ConversionRequestsResponse = {
    conversionRequestsList: [
      {
        id: 12,
        srcDocNo: 12,
        status: 'PENDING',
        createdDate: moment(123),
        totalQuantity: 12,
        totalWeight: 12,
        totalValue: 12,
        otherDetails: null,
        approvalRemarks: 'approved'
      }
    ],
    count: 2
  };
  const conversionRequests: ConversionRequests = {
    id: 12,
    srcDocNo: 12,
    status: 'PENDING',
    createdDate: moment(123),
    totalQuantity: 12,
    totalWeight: 12,
    totalValue: 12,
    otherDetails: null,
    approvalRemarks: 'approved'
  };
  const conversionRequestItems: ConversionRequestItems = {
    binCode: 'AREPLNISH',
    imageURL: '/productcatalogue/ProductImages/1090FGA.jpg',
    isLoadingImage: true,
    isLoadingThumbnailImage: false,
    thumbnailImageURL: 'abcdefg',
    inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    itemCode: '501090FGALAP70',
    itemDetails: {
      complexityCode: '123',
      itemCode: '123',
      itemType: 'AB',
      netWeight: '3.123',
      remarks: 'good',
      sold: 'yes',
      stonePrice: '12345'
    },
    lotNumber: '3IH005125',
    mfgDate: moment(123),
    productCategory: 'F',
    productCategoryDesc: 'FINGER RING',
    productGroup: '77',
    productGroupDesc: 'Studded - Solitaire',
    stdValue: 166396,
    stdWeight: 3.905,
    weightUnit: 'gms',
    isStudded: false
  };

  const conversionApprovalDetailsPayload: ConversionApprovalDetailsPayload = {
    data: null,
    type: 'ITEM_DETAILS'
  };
  const conversionSplitItemDetailsDataPayload: ConversionSplitItemDetailsDataPayload = {
    remarks: 'good',
    itemCode: '123',
    netWeight: 3.123,
    stonePrice: 12345,
    complexityCode: 123,
    sold: 'yes',
    itemType: 'AB'
  };
  const conversionSplitReqItemPayload: ConversionSplitReqItemPayload = {
    binCode: 'AREPLNISH',
    inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    itemCode: '501090FGALAP70',
    itemDetails: {
      type: 'ITEM_DETAILS',
      data: conversionSplitItemDetailsDataPayload
    },
    lotNumber: '3IH005125',
    measuredWeight: 3.905,
    quantity: 1
  };
  const conversionSplitReqPayload: ConversionSplitReqPayload = {
    otherDetails: conversionApprovalDetailsPayload,
    items: [conversionSplitReqItemPayload],
    remarks: null
  };
  const conversionRequestResponse: ConversionRequestResponse = {
    currencyCode: 'INR',
    destDocDate: moment(456),
    destDocNo: 12,
    destLocationCode: 'CPD',
    id: 12,
    orderType: 'CM',
    reqDocDate: moment(123),
    reqDocNo: 123,
    requestType: 'REQUEST',
    srcDocDate: moment(123),
    srcDocNo: 12,
    srcFiscalYear: 12,
    srcLocationCode: 'CPD',
    status: 'PENDING',
    totalAvailableQuantity: 12,
    totalMeasuredQuantity: 12,
    totalAvailableValue: 12,
    totalMeasuredValue: 12,
    totalAvailableWeight: 12,
    totalMeasuredWeight: 12,
    weightUnit: 'gms'
  };
  const conversionItemPayload: ConversionItemPayload = {
    binCode: 'AREPLNISH',
    inventoryId: 'CB45B857-57A4-467C-A97E-BCF7193585F1',
    itemCode: '501090FGALAP70',
    lotNumber: '3IH005125',
    measuredWeight: 3.905
  };
  const conversionSplitItemPayload: ConversionSplitItemPayload = {
    issueItems: [conversionItemPayload],
    receiveItems: [conversionItemPayload],
    rsoName: ''
  };
  const conversionResponse: ConversionResponse = {
    currencyCode: 'INR',
    destDocDate: moment(456),
    destDocNo: 12,
    destLocationCode: 'CPD',
    id: 12,
    orderType: 'CM',
    srcDocDate: moment(123),
    srcDocNo: 12,
    srcFiscalYear: 12,
    srcLocationCode: 'CPD',
    status: null,
    totalValue: 166396,
    totalWeight: 3.905,
    weightUnit: 'gms',
    totalQuantity: 1
  };
  const binCode: BinCode = { binCode: 'ONE', description: 'One' };

  // describe('LoadSearchVarient', () => {
  //   it('should return a stream LoadSearchVarient', () => {
  //     jasmine.createSpy('studdedProductGroups').and.callThrough();
  //     const action = new ConversionActions.LoadSearchVarient(itemCode);
  //     const outcome = new ConversionActions.LoadSearchVarientSuccess([
  //       conversionInventoryItem
  //     ]);
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-a|', { a: [conversionInventoryItem] });
  //     conversionServiceSpy.getSearchedItems.and.returnValue(response$);
  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.searchedItems$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     jasmine.createSpy('studdedProductGroups').and.callThrough();
  //     const action = new ConversionActions.LoadSearchVarient(itemCode);
  //     const error = new Error('some error');
  //     const outcome = new ConversionActions.LoadSearchVarientFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#', {}, error);
  //     conversionServiceSpy.getSearchedItems.and.returnValue(response$);
  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.searchedItems$).toBeObservable(expected$);
  //   });
  // });

  describe('LoadConversionRequests', () => {
    it('should return a stream LoadConversionRequests', () => {
      const action = new LoadConversionRequests(loadConversionRequestsPayload);
      const outcome = new LoadConversionRequestsSuccess(
        conversionRequestsResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: conversionRequestsResponse });
      conversionServiceSpy.getConversionRequests.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadConversionRequests$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadConversionRequests(loadConversionRequestsPayload);
      const error = new Error('some error');
      const outcome = new LoadConversionRequestsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      conversionServiceSpy.getConversionRequests.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadConversionRequests$).toBeObservable(expected$);
    });
  });

  describe('LoadRequestsCount', () => {
    it('should return a stream LoadRequestsCount', () => {
      const action = new LoadRequestsCount();
      const outcome = new LoadRequestsCountSuccess(10);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: 10 });
      conversionServiceSpy.getCount.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadConversionRequestsCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRequestsCount();
      const error = new Error('some error');
      const outcome = new LoadRequestsCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      conversionServiceSpy.getCount.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadConversionRequestsCount$).toBeObservable(expected$);
    });
  });

  describe('SearchConversionRequests', () => {
    it('should return a stream SearchConversionRequests', () => {
      const action = new SearchConversionRequests(12);
      const outcome = new SearchConversionRequestsSuccess([conversionRequests]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: [conversionRequests] });
      conversionServiceSpy.getRequest.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchConversionRequests$).toBeObservable(expected$);
    });

    it('should fail and return an success action with the empty response', () => {
      const action = new SearchConversionRequests(12);
      const error = new Error('some error');
      const outcome = new SearchConversionRequestsSuccess([]);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      conversionServiceSpy.getRequest.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchConversionRequests$).toBeObservable(expected$);
    });
  });

  describe('LoadSelectedRequest', () => {
    it('should return a stream LoadSelectedRequest', () => {
      const action = new LoadSelectedRequest(12);
      const outcome = new LoadSelectedRequestSuccess(conversionRequests);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: conversionRequests });
      conversionServiceSpy.getSelectedRequestDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSelectedRequest(12);
      const error = new Error('some error');
      const outcome = new LoadSelectedRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      conversionServiceSpy.getSelectedRequestDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedRequest$).toBeObservable(expected$);
    });
  });

  // describe('LoadSelectedRequestData', () => {
  //   it('should return a stream LoadSelectedRequestData', () => {
  //     jasmine.createSpy('studdedProductGroups').and.callThrough();
  //     const action = new LoadSelectedRequestData(12);
  //     const outcome = new LoadSelectedRequestDataSuccess([
  //       conversionRequestItems
  //     ]);
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-a|', { a: conversionRequests });
  //     conversionServiceSpy.getSelectedRequestItems.and.returnValue(response$);
  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.loadSelectedRequestItems$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     jasmine.createSpy('studdedProductGroups').and.callThrough();
  //     const action = new LoadSelectedRequestData(12);
  //     const error = new Error('some error');
  //     const outcome = new LoadSelectedRequestDataFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#', {}, error);
  //     conversionServiceSpy.getSelectedRequestItems.and.returnValue(response$);
  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.loadSelectedRequestItems$).toBeObservable(expected$);
  //   });
  // });

  describe('SendConversionRequest', () => {
    it('should return a stream SendConversionRequest', () => {
      const action = new SendConversionRequest(conversionSplitReqPayload);
      const outcome = new SendConversionRequestSuccess(
        conversionRequestResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: conversionRequestResponse });
      conversionServiceSpy.sendConversionsRequest.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.sendConversionRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SendConversionRequest(conversionSplitReqPayload);
      const error = new Error('some error');
      const outcome = new SendConversionRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      conversionServiceSpy.sendConversionsRequest.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.sendConversionRequest$).toBeObservable(expected$);
    });
  });
  describe('SplitItems', () => {
    it('should return a stream SplitItems', () => {
      const action = new SplitItems(conversionSplitItemPayload);
      const outcome = new SplitItemsSuccess(conversionResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: conversionResponse });
      conversionServiceSpy.conversionrequestConfirm.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.splitItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SplitItems(conversionSplitItemPayload);
      const error = new Error('some error');
      const outcome = new SplitItemsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      conversionServiceSpy.conversionrequestConfirm.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.splitItems$).toBeObservable(expected$);
    });
  });
  describe('ConfirmConversion', () => {
    it('should return a stream ConfirmConversion', () => {
      const action = new ConfirmConversion(conversionSplitItemPayload);
      const outcome = new ConfirmConversionSuccess(conversionResponse);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: conversionResponse });
      conversionServiceSpy.conversionrequestConfirm.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.conversion$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ConfirmConversion(conversionSplitItemPayload);
      const error = new Error('some error');
      const outcome = new ConfirmConversionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      conversionServiceSpy.conversionrequestConfirm.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.conversion$).toBeObservable(expected$);
    });
  });
  describe('LoadRsoDetails', () => {
    it('should return a stream LoadRsoDetails', () => {
      const action = new LoadRsoDetails();
      const outcome = new LoadRsoDetailsSuccess(['rso']);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: [
          {
            empName: 'rso',
            employeeCode: 'rso',
            locationCode: 'cpd',
            mobileNo: '9876543210'
          }
        ]
      });
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRsoDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRsoDetails();
      const error = new Error('some error');
      const outcome = new LoadRsoDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRsoDetails$).toBeObservable(expected$);
    });
  });
  describe('LoadBinCodes', () => {
    it('should return a stream LoadBinCodes', () => {
      const action = new LoadBinCodes('STN');
      const outcome = new LoadBinCodesSuccess([binCode]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: [binCode] });
      binDataServiceSpy.getBinDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBinCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBinCodes('STN');
      const error = new Error('some error');
      const outcome = new LoadBinCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binDataServiceSpy.getBinDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBinCodes$).toBeObservable(expected$);
    });
  });

  // History Related
  describe('LoadRequestSentHistory', () => {
    it('should return a stream LoadRequestSentHistory', () => {
      const action = new LoadRequestSentHistory(requestPayload);
      const outcome = new LoadRequestSentHistorySuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      conversionServiceSpy.getRequestSentHistory.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadRequestSentHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRequestSentHistory(requestPayload);
      const outcome = new LoadRequestSentHistorySuccess({
        requestSentHistory: [],
        count: 0
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold(
        '-#',
        {},
        {
          requestSentHistory: [],
          count: 0
        }
      );
      conversionServiceSpy.getRequestSentHistory.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRequestSentHistory$).toBeObservable(expected);
    });
  });

  describe('LoadConvertedTransactionHistory', () => {
    const convertedTransactionPayload: ConvertedTransactionHistoryPayload = {
      convertedTransaction: {
        actionType: 'REQUEST',
        dateRangeType: 'CUSTOM',
        endDate: 12222,
        issueDocNo: 13,
        issueFiscalYear: 2020,
        receiveDocNo: 12,
        receiveFiscalYear: 2021,
        startDate: 12312312,
        statuses: []
      },
      pageIndex: 0,
      pageSize: 12,
      transactionType: 'TRANACTION'
    };
    it('should return a stream LoadConvertedTransactionHistory', () => {
      const action = new LoadConvertedTransactionHistory(
        convertedTransactionPayload
      );
      const outcome = new LoadConvertedTransactionHistorySuccess(response);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: response });
      conversionServiceSpy.getConvertedTransactionHistory.and.returnValue(
        response$
      );
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadConvertedTransactionHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadConvertedTransactionHistory(
        convertedTransactionPayload
      );
      const outcome = new LoadConvertedTransactionHistorySuccess({
        requestSentHistory: [],
        count: 0
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold(
        '-#',
        {},
        {
          requestSentHistory: [],
          count: 0
        }
      );
      conversionServiceSpy.getConvertedTransactionHistory.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadConvertedTransactionHistory$).toBeObservable(expected);
    });
  });

  describe('LoadSelectedRequestHistory', () => {
    const convertedTransactionPayload: ConvertedTransactionHistoryPayload = {
      convertedTransaction: {
        actionType: 'REQUEST',
        dateRangeType: 'CUSTOM',
        endDate: 12222,
        issueDocNo: 13,
        issueFiscalYear: 2020,
        receiveDocNo: 12,
        receiveFiscalYear: 2021,
        startDate: 12312312,
        statuses: []
      },
      pageIndex: 0,
      pageSize: 12,
      transactionType: 'TRANACTION'
    };
    it('should return a stream LoadSelectedRequestHistory', () => {
      const action = new LoadSelectedRequestHistory({
        reqDocNo: 123,
        requestType: 'ABC'
      });
      const outcome = new LoadSelectedRequestHistorySuccess(conversionHistory);
      actions$ = cold('-a', { a: action });
      const response$ = cold('-b', { b: conversionHistory });
      conversionServiceSpy.getSelectedRequestHistory.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadSelectedRequestHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const error = new Error('some error');
      const action = new LoadSelectedRequestHistory({
        reqDocNo: 123,
        requestType: 'ABC'
      });
      const outcome = new LoadSelectedRequestHistoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      conversionServiceSpy.getSelectedRequestHistory.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedRequestHistory$).toBeObservable(expected);
    });
  });
  describe('LoadStuddedProductGroups', () => {
    it('should return a stream LoadStuddedProductGroups', () => {
      const productGroups: ProductGroup[] = [
        {
          description: 'description',
          productGroupCode: 'code'
        }
      ];

      const action = new LoadStuddedProductGroups();
      const outcome = new LoadStuddedProductGroupsSuccess(
        productGroups.map(p => p.productGroupCode)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: productGroups });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadStuddedProductGroups();
      const error = new Error('some error');
      const outcome = new LoadStuddedProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected$);
    });
  });

  // describe('LoadConversionHistoryItems', () => {
  //   const conversionHistoryPayload: ConversionHistoryItemsPayload = {
  //     historyItemsPaylod: {
  //       binCodes: [],
  //       binGroupCode: '123',
  //       itemCode: '123',
  //       lotNumber: '123',
  //       productCategories: [],
  //       productGroups: []
  //     },
  //     pageIndex: 0,
  //     pageSize: 10,
  //     id: 123,
  //     requestType: 'ICT',
  //     preTransactionId: 12
  //   };
  //   const conversionHistoryItems: ConversionHistoryItems = {
  //     id: '123',
  //     itemCode: '123',
  //     lotNumber: '123',
  //     mfgDate: moment(123),
  //     productCategory: '123',
  //     productGroup: '123',
  //     productCategoryDesc: '123',
  //     productGroupDesc: '12',
  //     binCode: '123',
  //     binGroupCode: '123',
  //     stdValue: 123,
  //     stdWeight: 123,
  //     currencyCode: 'INR',
  //     weightUnit: 'gms',
  //     status: 'PENDING',
  //     imageURL: 'abcdef',
  //     itemDetails: {
  //       remarks: 'good',
  //       itemCode: '123',
  //       netWeight: 'gms',
  //       stonePrice: '12',
  //       complexityCode: '123',
  //       sold: 'yes',
  //       itemType: 'AB'
  //     },
  //     availableQuantity: 12,
  //     availableWeight: 12,
  //     availableValue: 12,
  //     measuredQuantity: 12,
  //     measuredWeight: 12,
  //     measuredValue: 12,
  //     orderType: 'CM',
  //     inventoryId: '123',
  //     isStudded: true
  //   };
  //   const itemsResponse: ConversionHistoryItemsSuccessPayload = {
  //     items: [conversionHistoryItems],
  //     count: 10
  //   };
  //   it('should return a stream LoadConversionHistoryItems', () => {
  //     const action = new LoadConversionHistoryItems(conversionHistoryPayload);
  //     const outcome = new LoadConversionHistoryItemsSuccess(itemsResponse);
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-a|', { a: itemsResponse });
  //     conversionServiceSpy.getConvesionHistoryItems.and.returnValue(response$);
  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.loadConversionHistoryItems$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     const action = new LoadConversionHistoryItems(conversionHistoryPayload);
  //     const error = new Error('some error');
  //     const outcome = new LoadConversionHistoryItemsFailure(
  //       CustomErrorAdaptor.fromJson(error)
  //     );
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#', {}, error);
  //     conversionServiceSpy.getConvesionHistoryItems.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.loadConversionHistoryItems$).toBeObservable(expected);
  //   });
  // });
});
