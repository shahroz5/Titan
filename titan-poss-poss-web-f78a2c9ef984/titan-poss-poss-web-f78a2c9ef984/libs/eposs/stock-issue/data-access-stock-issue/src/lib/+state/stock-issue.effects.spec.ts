import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { InventoryValidationService, CommonService } from '@poss-web/shared/common/data-access-common';
import {
  CourierDataService,
  ProductCategoryDataService,
  ProductGroupDataService,
  StoreUserDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  ConfirmIssuePayload,
  IssueInventoryItem,
  ItemToleranceValidate,
  LoadCancelIssuesPayload,
  LoadCancelIssuesSTNPayload,
  LoadCancelIssuetemsPayload,
  LoadHistoryRequestPayload,
  LoadIssueItemPayload,
  LoadIssueItemsTotalCountPayload,
  LoadIssueItemsTotalCountSuccessPayload,
  LoadIssueSTNCountsPayload,
  LoadPendingIssuePayload,
  LoadSelectedPayload,
  LoadStockIssueHistoryItemsPayload,
  MeasuredWeightAndValuePayload,
  ProductCategory,
  ProductGroup,
  RequestList,
  SearchPendingPayload,
  StockIssueAPIRequestTypesEnum,
  StockIssueSelectedHistoryPayload,
  StockRequestNote,
  UpdateAllItemPayload,
  UpdateItemListStatusPayload,
  UpdateItemPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { cold, hot } from 'jasmine-marbles';
import { CommonState } from 'libs/shared/common/data-access-common/src/lib/+state/common.state';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { StockIssueService } from '../stock-issue.service';
import {
  CancelIssueSTN,
  CancelIssueSTNFailure,
  CancelIssueSTNSuccess,
  ConfirmIssue,
  ConfirmIssueFailure,
  ConfirmIssueSuccess,
  LoadBoutiqueIssuePendingSTN,
  LoadBoutiqueIssuePendingSTNFailure,
  LoadBoutiqueIssuePendingSTNSuccess,
  LoadCancelIssueCount,
  LoadCancelIssueCountFailure,
  LoadCancelIssueCountSuccess,
  LoadCancelIssueDetails,
  LoadCancelIssueDetailsFailure,
  LoadCancelIssueDetailsSuccess,
  LoadCancelIssueItems,
  LoadCancelIssueItemsCount,
  LoadCancelIssueItemsCountFailure,
  LoadCancelIssueItemsCountSuccess,
  LoadCancelIssueItemsFailure,
  LoadCancelIssueItemsSuccess,
  LoadCancelIssuePendingSTN,
  LoadCancelIssuePendingSTNFailure,
  LoadCancelIssuePendingSTNSuccess,
  LoadCourierDetails,
  LoadCourierDetailsFailure,
  LoadCourierDetailsSuccess,
  LoadEmployeeDetails,
  LoadEmployeeDetailsFailure,
  LoadEmployeeDetailsSuccess,
  LoadFactoryIssuePendingSTN,
  LoadFactoryIssuePendingSTNFailure,
  LoadFactoryIssuePendingSTNSuccess,
  LoadHistoryItems,
  LoadHistoryItemsSuccess,
  LoadHistoryItemsTotalCount,
  LoadHistoryItemsTotalCountFailure,
  LoadHistoryItemsTotalCountSuccess,
  LoadIssueHistory,
  LoadIssueHistorySuccess,
  LoadIssueItemsTotalCount,
  LoadIssueItemsTotalCountFailure,
  LoadIssueItemsTotalCountSuccess,
  LoadIssueSTNCount,
  LoadIssueSTNCountFailure,
  LoadIssueSTNCountSuccess,
  LoadItems,
  LoadItemsSuccess,
  LoadMerchantIssuePendingSTN,
  LoadMerchantIssuePendingSTNFailure,
  LoadMerchantIssuePendingSTNSuccess,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  LoadSelectedHistory,
  LoadSelectedHistorySuccess,
  LoadSelectedIssue,
  LoadSelectedIssueFailure,
  LoadSelectedIssueSuccess,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsFailure,
  LoadStuddedProductGroupsSuccess,
  LoadTotalMeasuredWeightAndValue,
  LoadTotalMeasuredWeightAndValueFailure,
  LoadTotalMeasuredWeightAndValueSuccess,
  ResetLoadedHistory,
  SearchPendingIssues,
  SearchPendingIssuesSuccess,
  UpdateAllItems,
  UpdateAllItemsFailure,
  UpdateAllItemsSuccess,
  UpdateItem,
  UpdateItemFailure,
  UpdateItemListStatus,
  UpdateItemListStatusFailure,
  UpdateItemListStatusSuccess,
  UpdateItemSuccess,
  ValidateItem,
  ValidateItemFailure,
  ValidateItemSuccess
} from './stock-issue.actions';
import { StockIssueEffect } from './stock-issue.effects';
import { stockIssueFeatureKey } from './stock-issue.reducer';

describe('Stock Issue Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: StockIssueEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const stockIssueServiceSpy = jasmine.createSpyObj<StockIssueService>([
    'getIssues',
    'getCount',
    'searchIssues',
    'getIssue',
    'getItems',
    'getIssueItemsCount',
    'confirmIssue',
    'updateItem',
    'updateAllItem',
    'updateItemListStatus',
    'getWeightAndValue',
    'getHistory',
    'getSelectedHistory',
    'getHistoryItems',
    'getHistoryItemsCount',
    'getIssuesCancelSTN',
    'getCancelSTNCount',
    'getCancelIssueSTNDetails',
    'getCancelIssueItems',
    'getCancelIssueItemsCount',
    'getCancelIssueSTNRes'
  ]);

  const courierDataServiceSpy = jasmine.createSpyObj<CourierDataService>([
    'getCouriersSummary'
  ]);
  const storeUserDataServiceSpy = jasmine.createSpyObj<StoreUserDataService>([
    'getStoreUsers'
  ]);
  const inventoryValidationServiceSpy = jasmine.createSpyObj<
    InventoryValidationService
  >(['validateWeightTolerance']);
  const commonServiceSpy = jasmine.createSpyObj<
    CommonService
  >(['validateWeightTolerance']);
  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);
  const productCategoryDataServiceSpy = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategories']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StockIssueEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [stockIssueFeatureKey]: initialState
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
          provide: StockIssueService,
          useValue: stockIssueServiceSpy
        },
        {
          provide: CourierDataService,
          useValue: courierDataServiceSpy
        },
        {
          provide: StoreUserDataService,
          useValue: storeUserDataServiceSpy
        },
        {
          provide: InventoryValidationService,
          useValue: inventoryValidationServiceSpy
        },
        {
          provide: CommonService,
          useValue: commonServiceSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataServiceSpy
        },
        {
          provide: ProductCategoryDataService,
          useValue: productCategoryDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(StockIssueEffect);
  });
  describe('loadPendingIssueToFactorySTN', () => {
    it('should return a stream with Issue to Factory Requests and count', () => {
      const stockIssueRequestNote: StockRequestNote[] = [
        {
          carrierDetails: {},
          currencyCode: 'INR',
          destDocDate: moment(),
          destDocNo: 222,
          destLocationCode: 'test Loc',
          destLocationDescription: 'test Loc Desc',
          id: 1,
          orderType: null,
          otherDetails: {},
          reqDocDate: moment(),
          reqDocNo: 111,
          reqLocationCode: 'test loc',
          requestType: 'FAC',
          srcDocDate: moment(),
          srcDocNo: 222,
          srcFiscalYear: 2019,
          srcLocationCode: 'test loc',
          srcLocationDescription: 'test loc desc',
          status: 'APPROVED',
          totalAvailableQuantity: 100,
          totalAvailableValue: 10000,
          totalAvailableWeight: 10,
          totalMeasuredQuantity: 100,
          totalMeasuredValue: 10000,
          totalMeasuredWeight: 10,
          weightUnit: 'gms',
          courierReceivedDate: null,
          reasonForDelay: null,
          remarks: null,
          transferType: null
        }
      ];
      const parameters: LoadPendingIssuePayload = {
        requestType: 'FAC',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadFactoryIssuePendingSTN(parameters);
      const outcome = new LoadFactoryIssuePendingSTNSuccess({
        response: stockIssueRequestNote,
        count: 1
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          response: stockIssueRequestNote,
          count: 1
        }
      });
      stockIssueServiceSpy.getIssues.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPendingIssueToFactorySTN$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadPendingIssuePayload = {
        requestType: 'FAC',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadFactoryIssuePendingSTN(parameters);
      const error = new Error('some error');
      const outcome = new LoadFactoryIssuePendingSTNFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.getIssues.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingIssueToFactorySTN$).toBeObservable(expected);
    });
  });

  describe('loadPendingIssueToBoutiqueSTN', () => {
    it('should return a stream with Issue to Boutique Requests and count', () => {
      const stockIssueRequestNote: StockRequestNote[] = [
        {
          carrierDetails: {},
          currencyCode: 'INR',
          destDocDate: moment(),
          destDocNo: 222,
          destLocationCode: 'test Loc',
          destLocationDescription: 'test Loc Desc',
          id: 1,
          orderType: null,
          otherDetails: {},
          reqDocDate: moment(),
          reqDocNo: 111,
          reqLocationCode: 'test loc',
          requestType: 'FAC',
          srcDocDate: moment(),
          srcDocNo: 222,
          srcFiscalYear: 2019,
          srcLocationCode: 'test loc',
          srcLocationDescription: 'test loc desc',
          status: 'APPROVED',
          totalAvailableQuantity: 100,
          totalAvailableValue: 10000,
          totalAvailableWeight: 10,
          totalMeasuredQuantity: 100,
          totalMeasuredValue: 10000,
          totalMeasuredWeight: 10,
          weightUnit: 'gms',
          courierReceivedDate: null,
          reasonForDelay: null,
          remarks: null,
          transferType: null
        }
      ];
      const parameters: LoadPendingIssuePayload = {
        requestType: 'BTQ',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadBoutiqueIssuePendingSTN(parameters);
      const outcome = new LoadBoutiqueIssuePendingSTNSuccess({
        response: stockIssueRequestNote,
        count: 1
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          response: stockIssueRequestNote,
          count: 1
        }
      });
      stockIssueServiceSpy.getIssues.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPendingIssueToBoutiqueSTN$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadPendingIssuePayload = {
        requestType: 'FAC',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadBoutiqueIssuePendingSTN(parameters);
      const error = new Error('some error');
      const outcome = new LoadBoutiqueIssuePendingSTNFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.getIssues.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingIssueToBoutiqueSTN$).toBeObservable(expected);
    });
  });

  describe('loadPendingIssueToMerchantSTN', () => {
    it('should return a stream with Issue by Merchandise Requests and count', () => {
      const stockIssueRequestNote: StockRequestNote[] = [
        {
          carrierDetails: {},
          currencyCode: 'INR',
          destDocDate: moment(),
          destDocNo: 222,
          destLocationCode: 'test Loc',
          destLocationDescription: 'test Loc Desc',
          id: 1,
          orderType: null,
          otherDetails: {},
          reqDocDate: moment(),
          reqDocNo: 111,
          reqLocationCode: 'test loc',
          requestType: 'FAC',
          srcDocDate: moment(),
          srcDocNo: 222,
          srcFiscalYear: 2019,
          srcLocationCode: 'test loc',
          srcLocationDescription: 'test loc desc',
          status: 'APPROVED',
          totalAvailableQuantity: 100,
          totalAvailableValue: 10000,
          totalAvailableWeight: 10,
          totalMeasuredQuantity: 100,
          totalMeasuredValue: 10000,
          totalMeasuredWeight: 10,
          weightUnit: 'gms',
          courierReceivedDate: null,
          reasonForDelay: null,
          remarks: null,
          transferType: null
        }
      ];
      const parameters: LoadPendingIssuePayload = {
        requestType: 'MER',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadMerchantIssuePendingSTN(parameters);
      const outcome = new LoadMerchantIssuePendingSTNSuccess({
        response: stockIssueRequestNote,
        count: 1
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          response: stockIssueRequestNote,
          count: 1
        }
      });
      stockIssueServiceSpy.getIssues.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPendingIssueToMerchantSTN$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadPendingIssuePayload = {
        requestType: 'MER',
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadMerchantIssuePendingSTN(parameters);
      const error = new Error('some error');
      const outcome = new LoadMerchantIssuePendingSTNFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.getIssues.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingIssueToMerchantSTN$).toBeObservable(expected);
    });
  });

  describe('searchPendingIssues', () => {
    it('should return a stream with Searched Issues', () => {
      const stockIssueRequestNote: StockRequestNote[] = [
        {
          carrierDetails: {},
          currencyCode: 'INR',
          destDocDate: moment(),
          destDocNo: 222,
          destLocationCode: 'test Loc',
          destLocationDescription: 'test Loc Desc',
          id: 1,
          orderType: null,
          otherDetails: {},
          reqDocDate: moment(),
          reqDocNo: 111,
          reqLocationCode: 'test loc',
          requestType: 'FAC',
          srcDocDate: moment(),
          srcDocNo: 222,
          srcFiscalYear: 2019,
          srcLocationCode: 'test loc',
          srcLocationDescription: 'test loc desc',
          status: 'APPROVED',
          totalAvailableQuantity: 100,
          totalAvailableValue: 10000,
          totalAvailableWeight: 10,
          totalMeasuredQuantity: 100,
          totalMeasuredValue: 10000,
          totalMeasuredWeight: 10,
          weightUnit: 'gms',
          courierReceivedDate: null,
          reasonForDelay: null,
          remarks: null,
          transferType: null
        }
      ];
      const parameters: SearchPendingPayload = {
        reqDocNo: 111,
        requestType: 'FAC'
      };
      const action = new SearchPendingIssues(parameters);
      const outcome = new SearchPendingIssuesSuccess(stockIssueRequestNote);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: stockIssueRequestNote
      });
      stockIssueServiceSpy.searchIssues.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchPendingIssues$).toBeObservable(expected$);
    });

    it('should fail and return an action with the empty success response', () => {
      const parameters: SearchPendingPayload = {
        reqDocNo: 111,
        requestType: 'FAC'
      };
      const stockIssueRequestNote: StockRequestNote[] = [];
      const action = new SearchPendingIssues(parameters);
      const outcome = new SearchPendingIssuesSuccess(stockIssueRequestNote);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: stockIssueRequestNote
      });
      stockIssueServiceSpy.searchIssues.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchPendingIssues$).toBeObservable(expected$);
    });
  });

  describe('loadSelectedIssue', () => {
    it('should return selected Issue data', () => {
      const stockIssueRequestNote: StockRequestNote = {
        carrierDetails: {},
        currencyCode: 'INR',
        destDocDate: moment(),
        destDocNo: 222,
        destLocationCode: 'test Loc',
        destLocationDescription: 'test Loc Desc',
        id: 1,
        orderType: null,
        otherDetails: {},
        reqDocDate: moment(),
        reqDocNo: 111,
        reqLocationCode: 'test loc',
        requestType: 'FAC',
        srcDocDate: moment(),
        srcDocNo: 222,
        srcFiscalYear: 2019,
        srcLocationCode: 'test loc',
        srcLocationDescription: 'test loc desc',
        status: 'APPROVED',
        totalAvailableQuantity: 100,
        totalAvailableValue: 10000,
        totalAvailableWeight: 10,
        totalMeasuredQuantity: 100,
        totalMeasuredValue: 10000,
        totalMeasuredWeight: 10,
        weightUnit: 'gms',
        courierReceivedDate: null,
        reasonForDelay: null,
        remarks: null,
        transferType: null
      };

      const parameters: LoadSelectedPayload = {
        id: 1,
        requestType: 'FAC'
      };
      const action = new LoadSelectedIssue(parameters);
      const outcome = new LoadSelectedIssueSuccess(stockIssueRequestNote);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: stockIssueRequestNote
      });
      stockIssueServiceSpy.getIssue.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedIssue$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadSelectedPayload = {
        id: 1,
        requestType: 'FAC'
      };
      const action = new LoadSelectedIssue(parameters);
      const error = new Error('some error');
      const outcome = new LoadSelectedIssueFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.getIssue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedIssue$).toBeObservable(expected);
    });
  });

  describe('loadItems', () => {
    it('should return a stream of items', () => {
      const responsePayload: { items: IssueInventoryItem[]; count: number } = {
        items: [],
        count: 10
      };

      const parameters: LoadIssueItemPayload = {
        id: 1,
        itemCode: '1000111112222',
        lotNumber: '1AOB111',
        requestType: 'FAC',
        storeType: 'L1',
        status: 'APPROVED',
        pageIndex: 0,
        pageSize: 10
        // sort?: Map<string, string>;
        // filter?: { key: string; value: any[] }[];
      };
      const action = new LoadItems(parameters);
      const outcome = new LoadItemsSuccess(responsePayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: responsePayload
      });
      stockIssueServiceSpy.getItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadItems$).toBeObservable(expected$);
    });

    it('should fail and return an empty result and count 0', () => {
      const parameters: LoadIssueItemPayload = {
        id: 1,
        itemCode: '1000111112222',
        lotNumber: '1AOB111',
        requestType: 'FAC',
        storeType: 'L1',
        status: 'APPROVED',
        pageIndex: 0,
        pageSize: 10
        // sort?: Map<string, string>;
        // filter?: { key: string; value: any[] }[];
      };
      const action = new LoadItems(parameters);
      const outcome = new LoadItemsSuccess({
        items: [],
        count: 0
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          items: [],
          count: 0
        }
      });
      stockIssueServiceSpy.getItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadItems$).toBeObservable(expected$);
    });
  });

  describe('loadIssueItemsTotalCount', () => {
    it('should return counts', () => {
      const payload: LoadIssueItemsTotalCountPayload = {
        id: 11,
        requestType: 'FAC',
        storeType: 'L1'
      };
      const responsePayload: LoadIssueItemsTotalCountSuccessPayload = {
        approvedItemsTotalCount: 10,
        selectedItemsTotalCount: 5,
        // searchedItemsCount: number;
        historyItemsTotalCount: 0
      };
      const action = new LoadIssueItemsTotalCount(payload);
      const outcome = new LoadIssueItemsTotalCountSuccess(responsePayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: responsePayload });

      stockIssueServiceSpy.getIssueItemsCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadIssueItemsTotalCount$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload: LoadIssueItemsTotalCountPayload = {
        id: 11,
        requestType: 'FAC',
        storeType: 'L1'
      };
      const action = new LoadIssueItemsTotalCount(payload);
      const error = new Error('some error');
      const outcome = new LoadIssueItemsTotalCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.getIssueItemsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadIssueItemsTotalCount$).toBeObservable(expected);
    });
  });

  describe('confirmissue', () => {
    it('should confirm issue ', () => {
      const payload: ConfirmIssuePayload = {
        requestType: 'FAC',
        id: 1,
        data: {
          carrierDetails: {
            data: 'test data',
            type: 'test data'
          },
          remarks: 'remarks'
        }
      };
      const responsePayload: StockRequestNote = {
        carrierDetails: {},
        currencyCode: 'INR',
        destDocDate: moment(),
        destDocNo: 222,
        destLocationCode: 'test Loc',
        destLocationDescription: 'test Loc Desc',
        id: 1,
        orderType: null,
        otherDetails: {},
        reqDocDate: moment(),
        reqDocNo: 111,
        reqLocationCode: 'test loc',
        requestType: 'FAC',
        srcDocDate: moment(),
        srcDocNo: 222,
        srcFiscalYear: 2019,
        srcLocationCode: 'test loc',
        srcLocationDescription: 'test loc desc',
        status: 'APPROVED',
        totalAvailableQuantity: 100,
        totalAvailableValue: 10000,
        totalAvailableWeight: 10,
        totalMeasuredQuantity: 100,
        totalMeasuredValue: 10000,
        totalMeasuredWeight: 10,
        weightUnit: 'gms',
        courierReceivedDate: null,
        reasonForDelay: null,
        remarks: null,
        transferType: null
      };

      const action = new ConfirmIssue(payload);
      const outcome = new ConfirmIssueSuccess(responsePayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: responsePayload });

      stockIssueServiceSpy.confirmIssue.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.confirmIssue$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const payload: ConfirmIssuePayload = {
        requestType: 'FAC',
        id: 1,
        data: {
          carrierDetails: {
            data: 'test data',
            type: 'test data'
          },
          remarks: 'remarks'
        }
      };
      const action = new ConfirmIssue(payload);
      const error = new Error('some error');
      const outcome = new ConfirmIssueFailure(
        CustomErrorAdaptor.fromJson(error)
      );

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.confirmIssue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmIssue$).toBeObservable(expected);
    });
  });

  describe('UpdateAllItem', () => {
    it('should update All items', () => {
      const requestPayload: UpdateAllItemPayload = {
        requestType: 'FAC',
        storeType: 'L1',
        id: 1,
        itemId: '11001111',
        status: 'APPROVED'
      };
      const response = true;
      const action = new UpdateAllItems(requestPayload);
      const outcome = new UpdateAllItemsSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: response
      });
      stockIssueServiceSpy.updateAllItem.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateAllItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload: UpdateAllItemPayload = {
        requestType: 'FAC',
        storeType: 'L1',
        id: 1,
        itemId: '11001111',
        status: 'APPROVED'
      };
      const action = new UpdateAllItems(requestPayload);
      const error = new Error('some error');
      const outcome = new UpdateAllItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.updateAllItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateAllItem$).toBeObservable(expected);
    });
  });

  describe('updateItem', () => {
    it('should return a stream with updated item', () => {
      const serviceReponse: IssueInventoryItem = {
        availableQuantity: 1,
        availableValue: 1000,
        availableWeight: 10,
        binCode: '71',
        binGroupCode: 'Plain Gold',
        currencyCode: 'INR',
        id: '10001',
        imageURL: 'imageurl.com',
        inventoryId: '1234567asdfgh',
        itemCode: '11110000AB1',
        itemDetails: {},
        lotNumber: '1ABOOOO1',
        measuredQuantity: 1,
        measuredValue: 1000,
        measuredWeight: 10,
        mfgDate: moment(),
        orderType: null,
        productCategory: null,
        productCategoryDesc: null,
        productGroup: null,
        productGroupDesc: null,
        status: null,
        stdValue: null,
        stdWeight: null,
        weightUnit: null,
        isUpdating: false,
        isUpdatingSuccess: false,
        isValidating: false,
        isValidatingSuccess: false,
        isValidatingError: false,
        isStudded: false,
        isLoadingImage: false,
        isLoadingThumbnailImage: true,
        taxDetails: {},
        thumbnailImageURL: ''
      };

      const parameter: UpdateItemPayload = {
        requestType: 'FAC',
        storeType: 'L1',
        id: 1,
        itemId: '111000AB11',
        newUpdate: {
          measuredQuantity: 10.1,
          status: 'APPROVED',
          inventoryId: '12345676DFGH',
          measuredWeight: 10.2
        },
        actualDetails: {
          measuredQuantity: 10.1,
          status: 'APPROVED',
          inventoryId: '12345676DFGH',
          measuredWeight: 10.2
        }
      };

      const action = new UpdateItem(parameter);
      const outcome = new UpdateItemSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockIssueServiceSpy.updateItem.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.updateItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: UpdateItemPayload = {
        requestType: 'FAC',
        storeType: 'L1',
        id: 1,
        itemId: '111000AB11',
        newUpdate: {
          measuredQuantity: 10.1,
          status: 'APPROVED',
          inventoryId: '12345676DFGH',
          measuredWeight: 10.2
        },
        actualDetails: {
          measuredQuantity: 10.1,
          status: 'APPROVED',
          inventoryId: '12345676DFGH',
          measuredWeight: 10.2
        }
      };

      const action = new UpdateItem(parameter);
      const error = new Error('some error');
      const outcome = new UpdateItemFailure({
        itemId: parameter.itemId,
        actualDetails: parameter.actualDetails,
        error: CustomErrorAdaptor.fromJson(error)
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueServiceSpy.updateItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateItem$).toBeObservable(expected);
    });
  });

  describe('LoadIssueSTNCount', () => {
    it('should return STN Count', () => {
      const response: LoadIssueSTNCountsPayload = {
        pendingIssueBTQ_BTQ_STNCount: 5,
        pendingIssueBTQ_FAC_STNCount: 5,
        pendingIssueBTQ_MER_STNCount: 5
      };
      const action = new LoadIssueSTNCount();
      const outcome = new LoadIssueSTNCountSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: response
      });
      stockIssueServiceSpy.getCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadIssueStockTransferNoteCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadIssueSTNCount();
      const error = new Error('some error');
      const outcome = new LoadIssueSTNCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.getCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadIssueStockTransferNoteCount$).toBeObservable(expected);
    });
  });
  describe('updateItemListStatus', () => {
    it('should update the ItemListStatus', () => {
      const parameter: UpdateItemListStatusPayload = {
        type: 'BTQ',
        id: 11,
        requestGroup: 'IBT',
        itemIds: [],
        remarks: 'test data'
      };
      const response: RequestList = {
        id: 1,
        reqDocNo: 101,
        srcLocationCode: 'URB',
        destLocationCode: 'HNR',
        totalRequestedQuantity: 2,
        acceptedQuantity: 1,
        approvedQuantity: 2,
        status: 'CANCELLED',
        reqDocDate: moment(),
        requestType: 'BTQ',
        requestRemarks: 'testData',
        totalElements: 5
      };
      const action = new UpdateItemListStatus(parameter);
      const outcome = new UpdateItemListStatusSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });

      stockIssueServiceSpy.updateItemListStatus.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateItemListStatus$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const parameter: UpdateItemListStatusPayload = {
        type: 'BTQ',
        id: 11,
        requestGroup: 'IBT',
        itemIds: [],
        remarks: 'test data'
      };
      const action = new UpdateItemListStatus(parameter);
      const error = new Error('some error');
      const outcome = new UpdateItemListStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.updateItemListStatus.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateItemListStatus$).toBeObservable(expected);
    });
  });

  describe('loadMeasuredWeightAndValue', () => {
    it('should return measured weight and value', () => {
      const parameter: LoadSelectedPayload = {
        id: 1,
        requestType: 'FAC'
      };
      const response: MeasuredWeightAndValuePayload = {
        currencyCode: 'INR',
        totalMeasuredQuantity: 2,
        totalMeasuredValue: 10000,
        totalMeasuredWeight: 10,
        weightUnit: 'gms'
      };
      const action = new LoadTotalMeasuredWeightAndValue(parameter);
      const outcome = new LoadTotalMeasuredWeightAndValueSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });

      stockIssueServiceSpy.getWeightAndValue.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMeasuredWeightAndValue$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const parameter: LoadSelectedPayload = {
        id: 1,
        requestType: 'FAC'
      };
      const action = new LoadTotalMeasuredWeightAndValue(parameter);
      const error = new Error('some error');
      const outcome = new LoadTotalMeasuredWeightAndValueFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.getWeightAndValue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMeasuredWeightAndValue$).toBeObservable(expected);
    });
  });

  describe('loadIssueHistory', () => {
    it('should return a stream with Issue to Factory Requests and count', () => {
      const stockIssueRequestNote: StockRequestNote[] = [
        {
          carrierDetails: {},
          currencyCode: 'INR',
          destDocDate: moment(),
          destDocNo: 222,
          destLocationCode: 'test Loc',
          destLocationDescription: 'test Loc Desc',
          id: 1,
          orderType: null,
          otherDetails: {},
          reqDocDate: moment(),
          reqDocNo: 111,
          reqLocationCode: 'test loc',
          requestType: 'FAC',
          srcDocDate: moment(),
          srcDocNo: 222,
          srcFiscalYear: 2019,
          srcLocationCode: 'test loc',
          srcLocationDescription: 'test loc desc',
          status: 'APPROVED',
          totalAvailableQuantity: 100,
          totalAvailableValue: 10000,
          totalAvailableWeight: 10,
          totalMeasuredQuantity: 100,
          totalMeasuredValue: 10000,
          totalMeasuredWeight: 10,
          weightUnit: 'gms',
          courierReceivedDate: null,
          reasonForDelay: null,
          remarks: null,
          transferType: null
        }
      ];
      const parameters: LoadHistoryRequestPayload = {
        payload: {
          actionType: 'ISSUE',
          dateRangeType: 'TODAY',
          destDocNo: null,
          destFiscalYear: null,
          endDate: null,
          locationCode: null,
          srcDocNo: null,
          srcFiscalYear: null,
          startDate: null,
          statuses: []
        },
        pageSize: 0,
        pageIndex: 10,
        sort: [],
        transferType: 'BTQ_FAC'
      };
      const action = new LoadIssueHistory(parameters);
      const outcome = new LoadIssueHistorySuccess({
        response: stockIssueRequestNote,
        count: 1
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          response: stockIssueRequestNote,
          count: 1
        }
      });
      stockIssueServiceSpy.getHistory.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIssueHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the empty result', () => {
      const parameters: LoadHistoryRequestPayload = {
        payload: {
          actionType: 'ISSUE',
          dateRangeType: 'TODAY',
          destDocNo: null,
          destFiscalYear: null,
          endDate: null,
          locationCode: null,
          srcDocNo: null,
          srcFiscalYear: null,
          startDate: null,
          statuses: []
        },
        pageSize: 0,
        pageIndex: 10,
        sort: [],
        transferType: 'BTQ_FAC'
      };
      const action = new LoadIssueHistory(parameters);
      const outcome = new LoadIssueHistorySuccess({
        response: [],
        count: 1
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          response: [],
          count: 1
        }
      });
      stockIssueServiceSpy.getHistory.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIssueHistory$).toBeObservable(expected$);
    });
  });
  describe('loadSelectedHistory', () => {
    it('should return selected Issue History data', () => {
      const stockIssueRequestNote: StockRequestNote = {
        carrierDetails: {},
        currencyCode: 'INR',
        destDocDate: moment(),
        destDocNo: 222,
        destLocationCode: 'test Loc',
        destLocationDescription: 'test Loc Desc',
        id: 1,
        orderType: null,
        otherDetails: {},
        reqDocDate: moment(),
        reqDocNo: 111,
        reqLocationCode: 'test loc',
        requestType: 'FAC',
        srcDocDate: moment(),
        srcDocNo: 222,
        srcFiscalYear: 2019,
        srcLocationCode: 'test loc',
        srcLocationDescription: 'test loc desc',
        status: 'APPROVED',
        totalAvailableQuantity: 100,
        totalAvailableValue: 10000,
        totalAvailableWeight: 10,
        totalMeasuredQuantity: 100,
        totalMeasuredValue: 10000,
        totalMeasuredWeight: 10,
        weightUnit: 'gms',
        courierReceivedDate: null,
        reasonForDelay: null,
        remarks: null,
        transferType: null
      };

      const parameters: StockIssueSelectedHistoryPayload = {
        actionType: 'ISSUE',
        id: 1,
        type: 'BTW',
        isL1L2Store: true,
        isL3Store: false
      };
      const action = new LoadSelectedHistory(parameters);
      const outcome = new LoadSelectedHistorySuccess(stockIssueRequestNote);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: stockIssueRequestNote
      });
      stockIssueServiceSpy.getSelectedHistory.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: StockIssueSelectedHistoryPayload = {
        actionType: 'ISSUE',
        id: 1,
        type: 'BTW',
        isL1L2Store: true,
        isL3Store: false
      };
      const action = new LoadSelectedHistory(parameters);
      const error = new Error('some error');
      const outcome = new ResetLoadedHistory();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.getSelectedHistory.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedHistory$).toBeObservable(expected);
    });
  });
  describe('loadHistoryItems', () => {
    it('should return a stream of items', () => {
      const responsePayload: { items: IssueInventoryItem[]; count: number } = {
        items: [],
        count: 10
      };

      const parameters: LoadStockIssueHistoryItemsPayload = {
        payload: {
          binCodes: null,
          binGroupCode: null,
          itemCode: '111',
          lotNumber: '111111',
          productCategories: [],
          productGroups: [],
          statuses: []
        },
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: null,
        transferType: 'BTQ_FAC',
        isL1L2Store: true,
        isL3Store: false
      };
      const action = new LoadHistoryItems(parameters);
      const outcome = new LoadHistoryItemsSuccess(responsePayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: responsePayload
      });
      stockIssueServiceSpy.getHistoryItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadHistoryItems$).toBeObservable(expected$);
    });

    it('should fail and return an empty result and count 0', () => {
      const parameters: LoadStockIssueHistoryItemsPayload = {
        payload: {
          binCodes: null,
          binGroupCode: null,
          itemCode: '111',
          lotNumber: '111111',
          productCategories: [],
          productGroups: [],
          statuses: []
        },
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: null,
        transferType: 'BTQ_FAC',
        isL1L2Store: true,
        isL3Store: false
      };
      const action = new LoadHistoryItems(parameters);
      const outcome = new LoadHistoryItemsSuccess({
        items: [],
        count: 0
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          items: [],
          count: 0
        }
      });
      stockIssueServiceSpy.getHistoryItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadHistoryItems$).toBeObservable(expected$);
    });
  });
  describe('loadHistoryItemsCount', () => {
    it('should return selected Issue History items count', () => {
      const parameters: LoadStockIssueHistoryItemsPayload = {
        payload: {
          binCodes: null,
          binGroupCode: null,
          itemCode: '111',
          lotNumber: '111111',
          productCategories: [],
          productGroups: [],
          statuses: []
        },
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: null,
        transferType: 'BTQ_FAC',
        isL1L2Store: true,
        isL3Store: false
      };

      const response = 10;
      const action = new LoadHistoryItemsTotalCount(parameters);
      const outcome = new LoadHistoryItemsTotalCountSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: response
      });
      stockIssueServiceSpy.getHistoryItemsCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadHistoryItemsCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadStockIssueHistoryItemsPayload = {
        payload: {
          binCodes: null,
          binGroupCode: null,
          itemCode: '111',
          lotNumber: '111111',
          productCategories: [],
          productGroups: [],
          statuses: []
        },
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: null,
        transferType: 'BTQ_FAC',
        isL1L2Store: true,
        isL3Store: false
      };
      const action = new LoadHistoryItemsTotalCount(parameters);
      const error = new Error('some error');
      const outcome = new LoadHistoryItemsTotalCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stockIssueServiceSpy.getHistoryItemsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadHistoryItemsCount$).toBeObservable(expected);
    });
  });

  describe('LoadCourierDetails', () => {
    it('should return stream of courier details data', () => {
      const parameters = 'HNR';
      const response = [];
      const action = new LoadCourierDetails(parameters);
      const outcome = new LoadCourierDetailsSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: response
      });
      courierDataServiceSpy.getCouriersSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadCourierDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'HNR';

      const action = new LoadCourierDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadCourierDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      courierDataServiceSpy.getCouriersSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadCourierDetails$).toBeObservable(expected);
    });
  });
  describe('loadEmployeeDetails', () => {
    it('should return stream of courier details data', () => {
      const parameters = '111';
      const response = [];
      const action = new LoadEmployeeDetails(parameters);
      const outcome = new LoadEmployeeDetailsSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: response
      });
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadEmployeeDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = '111';

      const action = new LoadEmployeeDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadEmployeeDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      storeUserDataServiceSpy.getStoreUsers.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadEmployeeDetails$).toBeObservable(expected);
    });
  });

  describe('ValidateItem', () => {
    it('should return a stream with validated item', () => {
      const payload: ItemToleranceValidate = {
        itemId: '11100000AB11',
        productGroupCode: '71',
        availableWeight: 10.1,
        measuredWeight: 10.08,
        measuredQuantity: 2,
        availableQuantity: 2
      };
      const serviceReponse = { itemId: payload.itemId, isSuccess: true };

      const action = new ValidateItem(payload);
      const outcome = new ValidateItemSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      inventoryValidationServiceSpy.validateWeightTolerance.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.validateItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with isSuccess flag as false', () => {
      const payload: ItemToleranceValidate = {
        itemId: '11100000AB11',
        productGroupCode: '71',
        availableWeight: 10.1,
        measuredWeight: 10.08,
        measuredQuantity: 2,
        availableQuantity: 2
      };

      const action = new ValidateItem(payload);
      const error = new HttpErrorResponse({ error: { code: 'ERR-INV-028' } });

      const outcome = new ValidateItemSuccess({
        itemId: payload.itemId,
        isSuccess: false
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      inventoryValidationServiceSpy.validateWeightTolerance.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.validateItem$).toBeObservable(expected);
    });
    it('should fail and return an action with the error', () => {
      const payload: ItemToleranceValidate = {
        itemId: '11100000AB11',
        productGroupCode: '71',
        availableWeight: 10.1,
        measuredWeight: 10.08,
        measuredQuantity: 2,
        availableQuantity: 2
      };

      const action = new ValidateItem(payload);
      const error = new Error('some error');
      const outcome = new ValidateItemFailure({
        itemId: payload.itemId,
        error: CustomErrorAdaptor.fromJson(error)
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      inventoryValidationServiceSpy.validateWeightTolerance.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.validateItem$).toBeObservable(expected);
    });
  });

  describe('LoadStuddedProductGroups', () => {
    it('should return a stream with studded product groups', () => {
      const serviceReponse: ProductGroup[] = [
        {
          productGroupCode: 'Test 1',
          description: 'Test 1'
        },
        {
          productGroupCode: 'Test 2',
          description: 'Test 2'
        }
      ];

      const codes = serviceReponse.map(pg => pg.productGroupCode);

      const action = new LoadStuddedProductGroups();
      const outcome = new LoadStuddedProductGroupsSuccess(codes);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

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
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStuddedProductGroups$).toBeObservable(expected);
    });
  });

  describe('LoadProductGroups', () => {
    it('should return a stream with Product Groups Options', () => {
      const serviceReponse: ProductGroup[] = [
        {
          productGroupCode: 'Test 1',
          description: 'Test 1'
        },
        {
          productGroupCode: 'Test 2',
          description: 'Test 2'
        }
      ];

      const action = new LoadProductGroups();
      const outcome = new LoadProductGroupsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroups();
      const error = new Error('some error');
      const outcome = new LoadProductGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  });

  describe('LoadProductCategories', () => {
    it('should return a stream with Product Category Options', () => {
      const serviceReponse: ProductCategory[] = [
        {
          productCategoryCode: 'Test 1',
          description: 'Test 1'
        },
        {
          productCategoryCode: 'Test 2',
          description: 'Test 2'
        }
      ];

      const action = new LoadProductCategories();
      const outcome = new LoadProductCategoriesSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadProductCategories$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductCategories();
      const error = new Error('some error');
      const outcome = new LoadProductCategoriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductCategories$).toBeObservable(expected);
    });
  });

  // cancel STN

  describe('LoadCancelIssuePendingSTN', () => {
    const payload: LoadCancelIssuesSTNPayload = {
      requestType: 'FAC',
      pageIndex: 0,
      pageSize: 8
    };
    const responsePayload: { response: StockRequestNote[]; count: number } = {
      response: [],
      count: 8
    };
    it('should return a stream with CancelIssuePendingSTN', () => {
      const action = new LoadCancelIssuePendingSTN(payload);
      const outcome = new LoadCancelIssuePendingSTNSuccess(responsePayload);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: responsePayload });
      stockIssueServiceSpy.getIssuesCancelSTN.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadPendingIssueToBoutiqueCancelSTN$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCancelIssuePendingSTN(payload);
      const error = new Error('some error');
      const outcome = new LoadCancelIssuePendingSTNFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueServiceSpy.getIssuesCancelSTN.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingIssueToBoutiqueCancelSTN$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadCancelIssueCount', () => {
    const payload: LoadCancelIssuesPayload = {
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
    };
    const responsePayload = 8;
    it('should return a stream with CancelIssueCount', () => {
      const action = new LoadCancelIssueCount(payload);
      const outcome = new LoadCancelIssueCountSuccess(responsePayload);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: responsePayload });
      stockIssueServiceSpy.getCancelSTNCount.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.LoadCancelIssueStockTransferNoteCount$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCancelIssueCount(payload);
      const error = new Error('some error');
      const outcome = new LoadCancelIssueCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueServiceSpy.getCancelSTNCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadCancelIssueStockTransferNoteCount$).toBeObservable(
        expected
      );
    });
  });

  describe('LoadCancelIssueDetails', () => {
    const payload: LoadCancelIssuesPayload = {
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
    };
    const responsePayload: StockRequestNote = {
      carrierDetails: {},
      currencyCode: 'INR',
      destDocDate: moment(),
      destDocNo: 222,
      destLocationCode: 'test Loc',
      destLocationDescription: 'test Loc Desc',
      id: 1,
      orderType: null,
      otherDetails: {},
      reqDocDate: moment(),
      reqDocNo: 111,
      reqLocationCode: 'test loc',
      requestType: 'FAC',
      srcDocDate: moment(),
      srcDocNo: 222,
      srcFiscalYear: 2019,
      srcLocationCode: 'test loc',
      srcLocationDescription: 'test loc desc',
      status: 'APPROVED',
      totalAvailableQuantity: 100,
      totalAvailableValue: 10000,
      totalAvailableWeight: 10,
      totalMeasuredQuantity: 100,
      totalMeasuredValue: 10000,
      totalMeasuredWeight: 10,
      weightUnit: 'gms',
      courierReceivedDate: null,
      reasonForDelay: null,
      remarks: null,
      transferType: null
    };
    it('should return a stream with CancelIssueDetails', () => {
      const action = new LoadCancelIssueDetails(payload);
      const outcome = new LoadCancelIssueDetailsSuccess(responsePayload);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: responsePayload });
      stockIssueServiceSpy.getCancelIssueSTNDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadCancelIssueDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCancelIssueDetails(payload);
      const error = new Error('some error');
      const outcome = new LoadCancelIssueDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueServiceSpy.getCancelIssueSTNDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCancelIssueDetails$).toBeObservable(expected);
    });
  });

  describe('LoadCancelIssueItems', () => {
    const payload: LoadCancelIssuetemsPayload = {
      id: 1,
      page: 0,
      size: 10,
      sort: [''],
      transferType: 'BTQ_BTQ',
      binCodes: [],
      binGroupCode: '',
      itemCode: '',
      lotNumber: '',
      productCategories: [],
      productGroups: []
    };
    const dummyItemResponse: IssueInventoryItem[] = [
      {
        availableQuantity: 5,
        availableValue: 5000,
        availableWeight: 50,
        binCode: 'TestBinCode',
        binGroupCode: 'TestBinGroupCode',
        currencyCode: 'INR',
        id: '111ew22',
        imageURL: 'http://test.com',
        inventoryId: 'F7D-A3D5',
        itemCode: '5097321AAA4A11',
        itemDetails: {},
        lotNumber: '1BA000001',
        measuredQuantity: 2,
        measuredValue: 2000,
        measuredWeight: 20,
        mfgDate: moment(),
        orderType: null,
        productCategory: 'OTHERS',
        productCategoryDesc: 'OTHERS',
        productGroup: '71',
        productGroupDesc: 'Gold Plain',
        status: 'APPROVED',
        stdValue: 100,
        stdWeight: 10,
        weightUnit: 'gms',
        isUpdating: false,
        isUpdatingSuccess: null,
        isValidating: false,
        isValidatingSuccess: null,
        isValidatingError: false,
        isStudded: false,
        isLoadingImage: true,
        isLoadingThumbnailImage: true,
        taxDetails: {},
        thumbnailImageURL: ''
      }
    ];
    const responsePayload = { items: dummyItemResponse, count: 1 };
    it('should return a stream with CancelIssueItems', () => {
      const action = new LoadCancelIssueItems(payload);
      const outcome = new LoadCancelIssueItemsSuccess(responsePayload);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: responsePayload });
      stockIssueServiceSpy.getCancelIssueItems.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadCancelIssueItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCancelIssueItems(payload);
      const error = new Error('some error');
      const outcome = new LoadCancelIssueItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueServiceSpy.getCancelIssueItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCancelIssueItems$).toBeObservable(expected);
    });
  });

  describe('LoadCancelIssueItemsCount', () => {
    const payload: LoadCancelIssuesPayload = {
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
    };
    const responsePayload = 1;
    it('should return a stream with CancelIssueItemsCount', () => {
      const action = new LoadCancelIssueItemsCount(payload);
      const outcome = new LoadCancelIssueItemsCountSuccess(responsePayload);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: responsePayload });
      stockIssueServiceSpy.getCancelIssueItemsCount.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadCancelIssueItemsCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCancelIssueItemsCount(payload);
      const error = new Error('some error');
      const outcome = new LoadCancelIssueItemsCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueServiceSpy.getCancelIssueItemsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCancelIssueItemsCount$).toBeObservable(expected);
    });
  });

  describe('CancelIssueSTN', () => {
    const payload: LoadCancelIssuesPayload = {
      transferType: StockIssueAPIRequestTypesEnum.BTQ_BTQ
    };
    const responsePayload: StockRequestNote = {
      carrierDetails: {},
      currencyCode: 'INR',
      destDocDate: moment(),
      destDocNo: 222,
      destLocationCode: 'test Loc',
      destLocationDescription: 'test Loc Desc',
      id: 1,
      orderType: null,
      otherDetails: {},
      reqDocDate: moment(),
      reqDocNo: 111,
      reqLocationCode: 'test loc',
      requestType: 'FAC',
      srcDocDate: moment(),
      srcDocNo: 222,
      srcFiscalYear: 2019,
      srcLocationCode: 'test loc',
      srcLocationDescription: 'test loc desc',
      status: 'APPROVED',
      totalAvailableQuantity: 100,
      totalAvailableValue: 10000,
      totalAvailableWeight: 10,
      totalMeasuredQuantity: 100,
      totalMeasuredValue: 10000,
      totalMeasuredWeight: 10,
      weightUnit: 'gms',
      courierReceivedDate: null,
      reasonForDelay: null,
      remarks: null,
      transferType: null
    };
    it('should return a stream with CancelIssueSTN', () => {
      const action = new CancelIssueSTN(payload);
      const outcome = new CancelIssueSTNSuccess(responsePayload);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: responsePayload });
      stockIssueServiceSpy.getCancelIssueSTNRes.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.cancelIssueSTN$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new CancelIssueSTN(payload);
      const error = new Error('some error');
      const outcome = new CancelIssueSTNFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockIssueServiceSpy.getCancelIssueSTNRes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cancelIssueSTN$).toBeObservable(expected);
    });
  });
});
