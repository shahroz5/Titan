import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { OtherIssuesEffect } from './other-issues.effects';
import { OtherIssueService } from '../other-issues.service';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import {
  OtherIssuedataModel,
  LoadOtherIssueHistoryPayload,
  OtherIssueModel,
  OtherIssuesHistoryItem,
  LoadOtherIssueHistoryItemsPayload,
  LoadOtherIssuesSTNCountPayload,
  OtherIssueLoadListItemsPayload,
  RequestOtherIssueStockTransferNote,
  OtherIssuesItem,
  ConfirmOtherStockIssueResponse,
  OtherIssuesCreateStockResponse,
  AdjustmentSearchItemPayloadSuccess,
  LoadOtherIssueCreateItemsTotalCountSuccessPayload,
  ProductGroup,
  ProductCategory,
  OtherIssueSearchPendingPayload,
  OtherIssueLoadSelectedPayload,
  LoadOtherIssuesItemPayload,
  CreateOtherStockIssueItemsPayload,
  ConfirmOtherStockIssuePayload,
  OtherIssuesCreateStockResponsePayload,
  LoadAllOtherIssuePayload,
  LoadOtherIssueCreateItemsTotalCountPayload,
  CreateOtherIssueStockRequestItemsPayload,
  UpdateStockRequestItemPayload,
  RemoveOtherIssueStockRequestItemsPayload,
  PrintOtherIssuePayload,
  UpdateStockRequestPayload,
  AdjustmentSearchItemPayload,
  PSVSearchItemPayload,
  CreateStockRequestAdjustmentPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  LoadOtherIssueHistory,
  LoadOtherIssueHistorySuccess,
  LoadOtherIssueHistoryFailure,
  LoadSelectedHistorySuccess,
  LoadSelectedHistory,
  LoadSelectedHistoryFailure,
  LoadSelectedHistoryItems,
  LoadSelectedHistoryItemsSuccess,
  LoadIssuesSTNCount,
  LoadIssuesSTNCountSuccess,
  LoadIssuesSTNCountFailure,
  LoadIssueList,
  LoadIssueListFailure,
  LoadIssueListSuccess,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsSuccess,
  LoadStuddedProductGroupsFailure,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  SearchPendingIssueSuccess,
  SearchPendingIssue,
  LoadSelectedIssueSuccess,
  LoadSelectedIssueFailure,
  LoadSelectedIssue,
  LoadNonVerifiedOtherIssueItemsSuccess,
  LoadNonVerifiedOtherIssueItems,
  CreateOtherStockIssueItemsItemsFailure,
  CreateOtherStockIssueItems,
  CreateOtherStockIssueItemsItemsSuccess,
  ConfirmOtherStockIssueSuccess,
  ConfirmOtherStockIssueFailure,
  ConfirmOtherStockIssue,
  CreateOtherIssueStockRequestFailure,
  CreateOtherIssueStockRequestItemsSuccess,
  CreateOtherIssueStockRequest,
  CreateOtherIssueStockRequestSuccess,
  LoadAllOtherIssueCreateItems,
  LoadSelectedOtherIssueCreateItems,
  LoadSelectedOtherIssueCreateItemsSuccess,
  LoadIssueItemsCreateTotalCountFailure,
  LoadIssueItemsCreateTotalCount,
  LoadIssueItemsCreateTotalCountSuccess,
  CreateOtherIssueStockRequestItems,
  CreateOtherIssueStockRequestItemsFailure,
  UpdateStockRequestCreateItemSuccess,
  UpdateStockRequestCreateItem,
  UpdateStockRequestCreateItemFailure,
  RemoveOtherIssueStockRequestItemsFailure,
  RemoveOtherIssueStockRequestItemsSuccess,
  RemoveOtherIssueStockRequestItems,
  PrintOtherIssues,
  PrintOtherIssuesSuccess,
  PrintOtherIssuesFailure,
  CancelStockRequestSuccess,
  CancelStockRequest,
  CancelStockRequestFailure,
  LoadIssueLoanList,
  LoadIssueLoanListSuccess,
  LoadIssueLoanListFailure,
  LoadIssueLossList,
  LoadIssueLossListFailure,
  LoadIssueLossListSuccess,
  LoadIssueADJListSuccess,
  LoadIssueADJList,
  LoadIssueADJListFailure,
  LoadIssuePSVListSuccess,
  LoadIssuePSVList,
  LoadIssuePSVListFailure,
  UpdateStockRequest,
  UpdateStockRequestSuccess,
  UpdateStockRequestFailure,

  //psv and adjustment
  SearchAdjustment,
  SearchAdjustmentSuccess,
  CreateStockRequestAdjustment,
  CreateStockRequestAdjustmentSuccess,
  CreateStockRequestAdjustmentFailure,
  SearchPSV,
  SearchPSVSuccess,
  CreateStockRequestPSV,
  CreateStockRequestPSVSuccess,
  CreateStockRequestPSVFailure,
  SearchFOC,
  SearchFOCSuccess,
  CreateStockRequestFOC,
  CreateStockRequestFOCSuccess,
  CreateStockRequestFOCFailure,
  LoadIssueFOCList,
  LoadIssueFOCListSuccess,
  LoadIssueFOCListFailure,
  LoadAllOtherIssueCreateItemsSuccess
} from './other-issues.actions';
import { HttpClient } from '@angular/common/http';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import { otherIssueFeatureKey } from './other-issues.reducer';
const dummyIssueCount: LoadOtherIssuesSTNCountPayload = {
  countData: [{ type: '', count: 0 }],
  pendingOtherIssuesSTNCount: 0
};

const dummmyIssueList: OtherIssuedataModel = {
  issueData: [
    {
      id: 4966,
      srcLocationCode: 'URB',
      destLocationCode: 'URB',
      status: 'APPROVED',
      weightUnit: 'gms',
      currencyCode: 'INR',
      srcDocNo: null,
      srcFiscalYear: null,
      srcDocDate: null,
      destDocNo: null,
      destDocDate: null,
      orderType: null,
      totalAvailableQuantity: 2,
      totalMeasuredQuantity: null,
      totalAvailableValue: 1264123.12,
      totalMeasuredValue: 0,
      totalAvailableWeight: 47.483,
      totalMeasuredWeight: null,
      reqDocDate: moment(1592288081939),
      reqDocNo: 48,
      reqLocationCode: 'URB',
      requestType: 'EXH',
      otherDetails: {
        type: 'approval',
        data: {
          approvalCode: '444',
          approvedBy: 're'
        }
      },
      carrierDetails: {
        type: 'address_exh',
        data: {
          address1: 'ff',
          address2: 'ff',
          city: 'banglore',
          town: 'kar',
          Designation: '',
          contactNo: 8105391994,
          emailId: '',
          employeeId: '',
          employeeName: '',
          pinCode: '123456'
        }
      }
    }
  ],
  totalElements: 1
};

const dummyCreateIssue: OtherIssueModel = {
  id: 5260,
  srcLocationCode: 'URB',
  destLocationCode: 'URB',
  status: 'APVL_PENDING',
  weightUnit: 'gms',
  currencyCode: 'INR',
  carrierDetails: null,
  otherDetails: null,
  reqLocationCode: null,
  remarks: null,
  srcDocNo: 517,
  srcFiscalYear: null,
  srcDocDate: moment(1600692426386),
  destDocNo: null,
  destDocDate: null,
  orderType: null,
  totalAvailableQuantity: 15,
  totalMeasuredQuantity: 15,
  totalAvailableValue: 7631640,
  totalMeasuredValue: 7631640,
  totalAvailableWeight: 321.9,
  totalMeasuredWeight: 321.9,
  reqDocNo: 517,
  reqDocDate: moment(1600692426386),
  requestType: 'FOC'
};

const dummyLoadIssue: RequestOtherIssueStockTransferNote = {
  currencyUnit: '',
  destLocationCode: '',
  id: 1,
  reqDocDate: moment(),
  reqDocNo: 1,
  reqLocationCode: '',
  requestType: '',
  srcLocationCode: '',
  status: '',
  totalAvailableQuantity: 1,
  totalAvailableValue: 1,
  totalAvailableWeight: 1,
  totalQuantity: 1,
  totalValue: 1,
  totalWeight: 1,
  weightUnit: '',
  carrierDetails: null,
  otherDetails: null
};

const dummysearchOtherIssueCreateItems: OtherIssuesItem[] = [
  {
    id: null,
    itemCode: '512219VGGQ2A00',
    lotNumber: '2EB000073',
    mfgDate: moment(1588703400000),
    productCategory: 'V',
    productGroup: '71',
    binCode: 'LOAN',
    binGroupCode: 'LOAN',
    stdValue: 160410,
    stdWeight: 46.186,
    currencyCode: 'INR',
    weightUnit: 'gms',
    status: 'OPEN',
    imageURL: '/productcatalogue/ProductImages/2219VGG.jpg',
    itemDetails: null,
    availableQuantity: 5,
    availableWeight: 230.93,
    availableValue: 802050,
    measuredQuantity: null,
    measuredWeight: null,
    measuredValue: null,
    orderType: null,
    approvedQuantity: null,
    isStudded: null,
    isUpdating: null,
    isUpdatingSuccess: null,
    issuedQuantity: null,
    itemValue: null,
    itemWeight: null,
    productCategoryId: null,
    productGroupId: null,
    requestedQuantity: null,
    totalQuantity: null,
    totalValue: null,
    totalWeight: null,
    totalElements: null,

    inventoryId: 123,
    taxDetails: {}
  }
];

const dummyConfirmIssueResponse: ConfirmOtherStockIssueResponse = {
  id: 8297,
  srcLocationCode: 'URB',
  destLocationCode: 'URB',
  status: 'ISSUED',
  weightUnit: 'gms',
  currencyCode: 'INR',
  srcLocationDescription: null,
  destLocationDescription: null,
  srcDocNo: 231,
  srcFiscalYear: 2020,
  srcDocDate: moment(1600681186289),
  destDocNo: null,
  courierDetails: '',
  destDocDate: null,
  orderType: null,
  totalAvailableQuantity: null,
  totalMeasuredQuantity: 0,
  totalAvailableValue: null,
  totalMeasuredValue: 0,
  totalAvailableWeight: null,
  totalMeasuredWeight: 0,
  transferType: 'ADJ',
  courierReceivedDate: null
};

const dummyCreateStockResponse: OtherIssuesCreateStockResponse = {
  destLocationCode: '',
  id: 1,
  reqDocDate: moment(),
  reqDocNo: 1,
  srcLocationCode: '',
  status: '',
  totalQuantity: 1
};
const dummySearchADJ: AdjustmentSearchItemPayloadSuccess = {
  items: [
    {
      id: 1,
      itemCode: '512313CDYMAA00',
      lotNumber: '2JA005739',
      mfgDate: moment(1558895400000),
      productCategory: 'C',
      productGroup: '71',
      approvedQuantity: 1,
      isStudded: false,
      isUpdating: true,
      isUpdatingSuccess: false,
      issuedQuantity: 1,
      itemValue: 2,
      itemWeight: 3,
      measuredQuantity: 2,
      measuredValue: 1,
      measuredWeight: 1,
      orderType: '',
      productCategoryId: '',
      productGroupId: '',
      requestedQuantity: 3,
      totalQuantity: 3,
      totalValue: 12,
      totalWeight: 2,
      binCode: 'BEST DEAL',
      binGroupCode: 'STN',
      stdValue: 60103.55,
      stdWeight: 19.346,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: null,
      imageURL: '/productcatalogue/ProductImages/2313CDY.jpg',
      itemDetails: {},
      availableWeight: 19.346,
      availableValue: 60103.55,
      availableQuantity: 1,
      taxDetails:{}
    }
  ],
  count: 1
};

const dummySuccessPayload: LoadOtherIssueCreateItemsTotalCountSuccessPayload = {
  allOtherIssueCreateItemsTotalCount: 1,
  selectedOtherIssueCreateItemsTotalCount: 1
};

describe('Other Issue Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: OtherIssuesEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const otherIssueService = jasmine.createSpyObj<OtherIssueService>(
    'OtherIssuesService',
    [
      'getHistory',
      'getSelectedHistory',
      'getHistoryItems',
      'getHistoryItemsTotalCount',
      'getOtherIssuesSTNCount',
      'getIssueList',
      'searchIssueStocks',
      'getOtherStockIssue',
      'getOtherIssuesItems',
      'createOtherStockIssueItems',
      'createOtherIssuesStockRequest',
      'getOtherIssueCreateItems',
      'getOtherIssuesCreateItemsCount',
      'createOtherIssueStockRequestItems',
      'updateStockRequestCreateItem',
      'removeOtherIssueStockRequestItems',
      'printOtherIssue',
      'cancelStockRequest',
      'updateStockRequest',
      'searchAdjustmentItem',
      'createStockRequestAdjustment',
      'confirmOtherStockIssue'
    ]
  );
  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);
  const productCategoryDataServiceSpy = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategories']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OtherIssuesEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [otherIssueFeatureKey]: initialState
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
          provide: ProductGroupDataService,
          useValue: productGroupDataServiceSpy
        },
        {
          provide: ProductCategoryDataService,
          useValue: productCategoryDataServiceSpy
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: OtherIssueService,
          useValue: otherIssueService
        }
      ]
    });

    effect = TestBed.inject(OtherIssuesEffect);
    //otherIssueService = TestBed.get(OtherIssueService);
  });
  describe('LoadHistory', () => {
    it('should return a stream of otherIssueHistory Stns', () => {
      const historyData: OtherIssueModel[] = [
        {
          id: 1,
          srcLocationCode: 'srcLocCode',
          destLocationCode: 'destLocCode',
          status: 'status',
          weightUnit: 'gms',
          currencyCode: 'INR',
          reqDocNo: 11111,
          reqDocDate: moment(),
          reqLocationCode: 'reqLocCode',
          requestType: '',
          carrierDetails: null,
          destDocDate: moment(),
          destDocNo: 12222,
          orderType: null,
          otherDetails: null,
          srcDocDate: moment(),
          srcDocNo: 13333,
          srcFiscalYear: 2019,
          totalAvailableQuantity: 1,
          totalAvailableValue: 1000,
          totalAvailableWeight: 10,
          totalMeasuredQuantity: 2,
          totalMeasuredValue: 2000,
          totalMeasuredWeight: 20,
          remarks: 'remarks'
        }
      ];
      const serviceResponse: OtherIssuedataModel = {
        issueData: historyData,
        totalElements: 1
      };
      const parameters: LoadOtherIssueHistoryPayload = {
        type: 'other-issues',
        page: 0,
        size: 8,
        sort: '',
        payload: {
          actionType: 'ISSUE',
          dateRangeType: 'LAST_YEAR',
          endDate: null,
          issueDocNo: null,
          issueFiscalYear: null,
          receiveDocNo: null,
          receiveFiscalYear: null,
          startDate: null,
          statuses: [],
          transactionType: 'ADJ'
        },
        issueType: 'ADJ'
      };
      const action = new LoadOtherIssueHistory(parameters);
      const outcome = new LoadOtherIssueHistorySuccess(serviceResponse);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: {
          issueData: historyData,
          totalElements: 1
        }
      });
      otherIssueService.getHistory.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadIssueHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadOtherIssueHistoryPayload = {
        type: 'other-issues',
        page: 0,
        size: 8,
        sort: '',
        payload: {
          actionType: 'ISSUE',
          dateRangeType: 'LAST_YEAR',
          endDate: null,
          issueDocNo: null,
          issueFiscalYear: null,
          receiveDocNo: null,
          receiveFiscalYear: null,
          startDate: null,
          statuses: [],
          transactionType: 'ADJ'
        },
        issueType: 'ADJ'
      };
      const action = new LoadOtherIssueHistory(parameters);
      const error = new Error('some error');
      const outcome = new LoadOtherIssueHistorySuccess({
        issueData: [],
        totalElements: 0
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getHistory.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIssueHistory$).toBeObservable(expected);
    });
  });

  describe('loadSelectedHistory', () => {
    it('should return selected History data', () => {
      const serviceResponse: OtherIssueModel = {
        id: 1,
        srcLocationCode: 'srcLoc',
        destLocationCode: 'destLoc',
        status: 'ISSUED',
        weightUnit: 'gms',
        currencyCode: 'INR',
        reqDocNo: 111,
        reqDocDate: moment(),
        reqLocationCode: 'reqLoc',
        requestType: 'ADJ',
        carrierDetails: null,
        destDocDate: moment(),
        destDocNo: 222,
        orderType: null,
        otherDetails: null,
        srcDocDate: moment(),
        srcDocNo: 333,
        srcFiscalYear: 2019,
        totalAvailableQuantity: 10,
        totalAvailableValue: 10000,
        totalAvailableWeight: 100,
        totalMeasuredQuantity: 10,
        totalMeasuredValue: 1000,
        totalMeasuredWeight: 100,
        remarks: 'testing'
      };

      const parameters = {
        type: 'other-issue',
        actionType: 'ISSUE',
        id: 1,
        transactionType: 'ADJ'
      };
      const action = new LoadSelectedHistory(parameters);
      const outcome = new LoadSelectedHistorySuccess(serviceResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: serviceResponse
      });
      otherIssueService.getSelectedHistory.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = {
        type: 'other-issue',
        actionType: 'ISSUE',
        id: 1,
        transactionType: 'ADJ'
      };
      const action = new LoadSelectedHistory(parameters);
      const error = new Error('some error');
      const outcome = new LoadSelectedHistoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getSelectedHistory.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedHistory$).toBeObservable(expected);
    });
  });

  describe('loadOtherIssuesCount', () => {
    it('should return selected loadOtherIssuesCount data', () => {
      const serviceResponse: LoadOtherIssuesSTNCountPayload = {
        countData: [{ count: 1, type: 'EXH' }],
        pendingOtherIssuesSTNCount: 1
      };

      const action = new LoadIssuesSTNCount();
      const outcome = new LoadIssuesSTNCountSuccess(serviceResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: serviceResponse
      });
      otherIssueService.getOtherIssuesSTNCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadOtherIssuesCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadIssuesSTNCount();
      const error = new Error('some error');
      const outcome = new LoadIssuesSTNCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getOtherIssuesSTNCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadOtherIssuesCount$).toBeObservable(expected);
    });
  });

  describe('loadIssueList', () => {
    it('should return loadIssueList data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssueList(parameters);
      const outcome = new LoadIssueListSuccess(dummmyIssueList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummmyIssueList
      });
      otherIssueService.getIssueList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIssueList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssueList(parameters);
      const error = new Error('some error');
      const outcome = new LoadIssueListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getIssueList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIssueList$).toBeObservable(expected);
    });
  });

  describe('loadItemsTotalCount', () => {
    it('shoud return the data of count', () => {
      const payload: LoadOtherIssueHistoryItemsPayload = {
        type: 'other-issues',
        actionType: 'ISSUE',
        id: 1,
        page: 0,
        size: 10,
        sort: [],
        payload: {
          binCodes: [],
          binGroupCode: null,
          itemCode: null,
          lotNumber: null,
          productCategories: [],
          productGroups: []
        },
        transactionType: 'ADJ'
      };
    });
  });

  describe('searchPendingIssuesStocks', () => {
    it('should return searchPendingIssuesStocks data', () => {
      const parameters: OtherIssueSearchPendingPayload = {
        srcDocnumber: 12,
        type: 'EXH'
      };
      const action = new SearchPendingIssue(parameters);
      const outcome = new SearchPendingIssueSuccess([dummyCreateIssue]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: [dummyCreateIssue]
      });
      otherIssueService.searchIssueStocks.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchPendingIssuesStocks$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssueSearchPendingPayload = {
        srcDocnumber: 12,
        type: 'EXH'
      };
      const action = new SearchPendingIssue(parameters);
      const error = new Error('some error');
      const outcome = new SearchPendingIssueSuccess([]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.searchIssueStocks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchPendingIssuesStocks$).toBeObservable(expected);
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

      const action = new LoadProductGroups('EXH');
      const outcome = new LoadProductGroupsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroups('EXH');
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

  describe('LoadSelectedIssue', () => {
    it('should return LoadSelectedIssue data', () => {
      const parameters: OtherIssueLoadSelectedPayload = {
        reqDocNo: 123,
        type: 'EXH'
      };
      const action = new LoadSelectedIssue(parameters);
      const outcome = new LoadSelectedIssueSuccess(dummyLoadIssue);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummyLoadIssue
      });
      otherIssueService.getOtherStockIssue.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedIssue$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssueLoadSelectedPayload = {
        reqDocNo: 123,
        type: 'EXH'
      };
      const action = new LoadSelectedIssue(parameters);
      const error = new Error('some error');
      const outcome = new LoadSelectedIssueFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getOtherStockIssue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedIssue$).toBeObservable(expected);
    });
  });

  describe('loadNonVerifiedOtherIssueItems', () => {
    it('should return loadNonVerifiedOtherIssueItems data', () => {
      const parameters: LoadOtherIssuesItemPayload = {
        id: 1,
        pageIndex: 2,
        pageSize: 1,
        status: '',
        type: '',
        filter: [],
        itemCode: '',
        lotNumber: ''
      };
      const action = new LoadNonVerifiedOtherIssueItems(parameters);
      const outcome = new LoadNonVerifiedOtherIssueItemsSuccess(
        dummysearchOtherIssueCreateItems
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummysearchOtherIssueCreateItems
      });
      otherIssueService.getOtherIssuesItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadNonVerifiedOtherIssueItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadOtherIssuesItemPayload = {
        id: 1,
        pageIndex: 2,
        pageSize: 1,
        status: '',
        type: ''
      };
      const action = new LoadNonVerifiedOtherIssueItems(parameters);
      const error = new Error('some error');
      const outcome = new LoadNonVerifiedOtherIssueItemsSuccess([]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getOtherIssuesItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadNonVerifiedOtherIssueItems$).toBeObservable(expected);
    });
  });

  describe('createOtherStockIssueItems', () => {
    it('should return createOtherStockIssueItems data', () => {
      const parameters: CreateOtherStockIssueItemsPayload = {
        data: '',
        id: 12,
        transferType: 'EXH'
      };
      const action = new CreateOtherStockIssueItems(parameters);
      const outcome = new CreateOtherStockIssueItemsItemsSuccess([]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: []
      });
      otherIssueService.createOtherStockIssueItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.createOtherStockIssueItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: CreateOtherStockIssueItemsPayload = {
        data: '',
        id: 12,
        transferType: 'EXH'
      };
      const action = new CreateOtherStockIssueItems(parameters);
      const error = new Error('some error');
      const outcome = new CreateOtherStockIssueItemsItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.createOtherStockIssueItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createOtherStockIssueItems$).toBeObservable(expected);
    });
  });

  describe('confirmOtherStockIssue', () => {
    it('should return confirmOtherStockIssue data', () => {
      const parameters: ConfirmOtherStockIssuePayload = {
        id: 1,
        carrierDetails: { data: '', type: '' },
        destinationLocationCode: '',
        remarks: '',
        transferType: ''
      };
      const action = new ConfirmOtherStockIssue(parameters);
      const outcome = new ConfirmOtherStockIssueSuccess(
        dummyConfirmIssueResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummyConfirmIssueResponse
      });

      otherIssueService.confirmOtherStockIssue.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });

      expect(effect.confirmOtherStockIssue$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: ConfirmOtherStockIssuePayload = {
        id: 1,
        carrierDetails: { data: '', type: '' },
        destinationLocationCode: '',
        remarks: '',
        transferType: ''
      };
      const action = new ConfirmOtherStockIssue(parameters);
      const error = new Error('some error');
      const outcome = new ConfirmOtherStockIssueFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      otherIssueService.confirmOtherStockIssue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmOtherStockIssue$).toBeObservable(expected);
    });
  });

  describe('createOtherStockIssueItems', () => {
    it('should return createOtherStockIssueItems data', () => {
      const parameters: OtherIssuesCreateStockResponsePayload = {
        reqtype: 'EXH'
      };
      const action = new CreateOtherIssueStockRequest(parameters);
      const outcome = new CreateOtherIssueStockRequestSuccess(
        dummyCreateStockResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummyCreateStockResponse
      });
      otherIssueService.createOtherIssuesStockRequest.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.createOtherIssuesStockRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssuesCreateStockResponsePayload = {
        reqtype: 'EXH'
      };
      const action = new CreateOtherIssueStockRequest(parameters);
      const error = new Error('some error');
      const outcome = new CreateOtherIssueStockRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.createOtherIssuesStockRequest.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.createOtherIssuesStockRequest$).toBeObservable(expected);
    });
  });

  describe('loadAllOtherIssueCreateItems', () => {
    it('should return createOtherStockIssueItems data', () => {
      const parameters: LoadAllOtherIssuePayload = {
        id: 1,
        pageIndex: 2,
        pageSize: 1,
        reqtype: ''
      };
      const action = new LoadAllOtherIssueCreateItems(parameters);
      const outcome = new LoadAllOtherIssueCreateItemsSuccess(
        dummysearchOtherIssueCreateItems
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-b', {
        b: dummysearchOtherIssueCreateItems
      });
      otherIssueService.getOtherIssueCreateItems.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadAllOtherIssueCreateItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadAllOtherIssuePayload = {
        id: 1,
        pageIndex: 2,
        pageSize: 1,
        reqtype: ''
      };
      const action = new LoadAllOtherIssueCreateItems(parameters);
      const error = new Error('some error');
      const outcome = new LoadAllOtherIssueCreateItemsSuccess([]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getOtherIssueCreateItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAllOtherIssueCreateItems$).toBeObservable(expected);
    });
  });

  describe('LoadSelectedOtherIssueCreateItems', () => {
    it('should return LoadSelectedOtherIssueCreateItems data', () => {
      const parameters: LoadAllOtherIssuePayload = {
        id: 1,
        pageIndex: 2,
        pageSize: 1,
        reqtype: ''
      };
      const action = new LoadSelectedOtherIssueCreateItems(parameters);
      const outcome = new LoadSelectedOtherIssueCreateItemsSuccess(
        dummysearchOtherIssueCreateItems
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummysearchOtherIssueCreateItems
      });
      otherIssueService.getOtherIssueCreateItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedCreateItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadAllOtherIssuePayload = {
        id: 1,
        pageIndex: 2,
        pageSize: 1,
        reqtype: ''
      };
      const action = new LoadSelectedOtherIssueCreateItems(parameters);
      const error = new Error('some error');
      const outcome = new LoadSelectedOtherIssueCreateItemsSuccess([]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getOtherIssueCreateItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedCreateItems$).toBeObservable(expected);
    });
  });

  describe('loadOtherIssueItemsCreateTotalCount', () => {
    it('should return loadOtherIssueItemsCreateTotalCount data', () => {
      const parameters: LoadOtherIssueCreateItemsTotalCountPayload = {
        id: 12,
        reqtype: 'EXH'
      };
      const action = new LoadIssueItemsCreateTotalCount(parameters);
      const outcome = new LoadIssueItemsCreateTotalCountSuccess(
        dummySuccessPayload
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummySuccessPayload
      });
      otherIssueService.getOtherIssuesCreateItemsCount.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadOtherIssueItemsCreateTotalCount$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadOtherIssueCreateItemsTotalCountPayload = {
        id: 12,
        reqtype: 'EXH'
      };
      const action = new LoadIssueItemsCreateTotalCount(parameters);
      const error = new Error('some error');
      const outcome = new LoadIssueItemsCreateTotalCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getOtherIssuesCreateItemsCount.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadOtherIssueItemsCreateTotalCount$).toBeObservable(
        expected
      );
    });
  });

  describe('CreateOtherIssueStockRequestItems', () => {
    it('should return CreateOtherIssueStockRequestItems data', () => {
      const parameters: CreateOtherIssueStockRequestItemsPayload = {
        data: {},
        id: 12,
        requestType: 'EXH'
      };
      const action = new CreateOtherIssueStockRequestItems(parameters);
      const outcome = new CreateOtherIssueStockRequestItemsSuccess([]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: []
      });
      otherIssueService.createOtherIssueStockRequestItems.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.createStockIssueItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: CreateOtherIssueStockRequestItemsPayload = {
        data: {},
        id: 12,
        requestType: 'EXH'
      };
      const action = new CreateOtherIssueStockRequestItems(parameters);
      const error = new Error('some error');
      const outcome = new CreateOtherIssueStockRequestItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.createOtherIssueStockRequestItems.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.createStockIssueItems$).toBeObservable(expected);
    });
  });

  describe('UpdateStockRequestCreateItem', () => {
    it('should return UpdateStockRequestCreateItem data', () => {
      const parameters: UpdateStockRequestItemPayload = {
        id: 1,
        itemid: 1,
        reqType: '',
        value: { inventoryId: 0, measuredWeight: 0, quantity: 0, status: '' }
      };

      const action = new UpdateStockRequestCreateItem(parameters);
      const outcome = new UpdateStockRequestCreateItemSuccess([]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: []
      });
      otherIssueService.updateStockRequestCreateItem.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateStockIssueItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: UpdateStockRequestItemPayload = {
        id: 1,
        itemid: 1,
        reqType: '',
        value: { inventoryId: 0, measuredWeight: 0, quantity: 0, status: '' }
      };

      const action = new UpdateStockRequestCreateItem(parameters);
      const error = new Error('some error');
      const outcome = new UpdateStockRequestCreateItemFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.updateStockRequestCreateItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateStockIssueItem$).toBeObservable(expected);
    });
  });

  describe('RemoveOtherIssueStockRequestItems', () => {
    it('should return RemoveOtherIssueStockRequestItems data', () => {
      const parameters: RemoveOtherIssueStockRequestItemsPayload = {
        id: 1,
        data: {},
        requestType: ''
      };

      const action = new RemoveOtherIssueStockRequestItems(parameters);
      const outcome = new RemoveOtherIssueStockRequestItemsSuccess([]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: []
      });
      otherIssueService.removeOtherIssueStockRequestItems.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.removeOtherStockIssueItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: RemoveOtherIssueStockRequestItemsPayload = {
        id: 1,
        data: {},
        requestType: ''
      };

      const action = new RemoveOtherIssueStockRequestItems(parameters);
      const error = new Error('some error');
      const outcome = new RemoveOtherIssueStockRequestItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.removeOtherIssueStockRequestItems.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.removeOtherStockIssueItems$).toBeObservable(expected);
    });
  });

  describe('CancelStockRequest', () => {
    it('should return RemoveOtherIssueStockRequestItems data', () => {
      const parameters: RemoveOtherIssueStockRequestItemsPayload = {
        id: 1,
        data: {},
        requestType: ''
      };

      const action = new CancelStockRequest(parameters);
      const outcome = new CancelStockRequestSuccess([]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: []
      });
      otherIssueService.cancelStockRequest.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.cancelStockRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: RemoveOtherIssueStockRequestItemsPayload = {
        id: 1,
        data: {},
        requestType: ''
      };

      const action = new CancelStockRequest(parameters);
      const error = new Error('some error');
      const outcome = new CancelStockRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.cancelStockRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cancelStockRequest$).toBeObservable(expected);
    });
  });

  describe('PrintOtherIssues', () => {
    it('should return RemoveOtherIssueStockRequestItems data', () => {
      const parameters: PrintOtherIssuePayload = {
        id: 1,
        requestType: ''
      };

      const action = new PrintOtherIssues(parameters);
      const outcome = new PrintOtherIssuesSuccess([]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: []
      });
      otherIssueService.printOtherIssue.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.printOtherIssues$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: PrintOtherIssuePayload = {
        id: 1,
        requestType: ''
      };

      const action = new PrintOtherIssues(parameters);
      const error = new Error('some error');
      const outcome = new PrintOtherIssuesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.printOtherIssue.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.printOtherIssues$).toBeObservable(expected);
    });
  });

  describe('loadIssueLoanList', () => {
    it('should return loadIssueLoanList data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssueLoanList(parameters);
      const outcome = new LoadIssueLoanListSuccess(dummmyIssueList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummmyIssueList
      });
      otherIssueService.getIssueList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIssueLoanList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssueLoanList(parameters);
      const error = new Error('some error');
      const outcome = new LoadIssueLoanListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getIssueList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIssueLoanList$).toBeObservable(expected);
    });
  });

  describe('loadIssueLossList', () => {
    it('should return loadIssueLossList data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssueLossList(parameters);
      const outcome = new LoadIssueLossListSuccess(dummmyIssueList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummmyIssueList
      });
      otherIssueService.getIssueList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIssueLossList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssueLossList(parameters);
      const error = new Error('some error');
      const outcome = new LoadIssueLossListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getIssueList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIssueLossList$).toBeObservable(expected);
    });
  });

  describe('loadIssueADJList', () => {
    it('should return loadIssueADJList data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssueADJList(parameters);
      const outcome = new LoadIssueADJListSuccess(dummmyIssueList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummmyIssueList
      });
      otherIssueService.getIssueList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIssueADJList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssueADJList(parameters);
      const error = new Error('some error');
      const outcome = new LoadIssueADJListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getIssueList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIssueADJList$).toBeObservable(expected);
    });
  });

  describe('loadIssuePSVList', () => {
    it('should return loadIssuePSVList data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssuePSVList(parameters);
      const outcome = new LoadIssuePSVListSuccess(dummmyIssueList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummmyIssueList
      });
      otherIssueService.getIssueList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIssuePSVList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssuePSVList(parameters);
      const error = new Error('some error');
      const outcome = new LoadIssuePSVListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getIssueList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIssuePSVList$).toBeObservable(expected);
    });
  });

  describe('updateStockIssue', () => {
    it('should return updateStockIssue data', () => {
      const parameters: UpdateStockRequestPayload = {
        approvalDetails: { data: '', type: '' },
        carrierDetails: { data: '', type: '' },
        id: 1,
        status: '',
        remarks: '',
        reqType: 'EXH'
      };
      const action = new UpdateStockRequest(parameters);
      const outcome = new UpdateStockRequestSuccess(dummyCreateIssue);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummyCreateIssue
      });
      otherIssueService.updateStockRequest.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateStockIssue$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: UpdateStockRequestPayload = {
        approvalDetails: { data: '', type: '' },
        carrierDetails: { data: '', type: '' },
        id: 1,
        status: '',
        remarks: '',
        reqType: 'EXH'
      };
      const action = new UpdateStockRequest(parameters);
      const error = new Error('some error');
      const outcome = new UpdateStockRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.updateStockRequest.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateStockIssue$).toBeObservable(expected);
    });
  });

  describe('searchItemAdjustment', () => {
    it('should return searchItemAdjustment data', () => {
      const parameters: AdjustmentSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: ''
      };
      // const action = new SearchAdjustment(parameters);
      // const outcome = new SearchAdjustmentSuccess(dummySearchADJ);

      // actions$ = cold('-a', { a: action });

      // const response$ = cold('-b', {
      //   b: dummySearchADJ
      // });
      // otherIssueService.searchAdjustmentItem.and.returnValue(of(dummySearchADJ));

      // const expected$ = cold('--c', { c: outcome });

      // expect(effect.searchItemAdjustment$).toBeObservable(expected$);

      const action = new SearchAdjustment(parameters);
      const completion = new SearchAdjustmentSuccess(dummySearchADJ);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      otherIssueService.searchAdjustmentItem.and.returnValue(
        of(dummySearchADJ)
      );

      expect(effect.searchItemAdjustment$).toBeObservable(expected);
    });

    it('should fail and return an action with the error', () => {
      const parameters: AdjustmentSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: ''
      };
      const action = new SearchAdjustment(parameters);
      const error = new Error('some error');
      const outcome = new SearchAdjustmentSuccess({ items: [], count: 0 });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.searchAdjustmentItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchItemAdjustment$).toBeObservable(expected);
    });
  });

  describe('searchItemPSV', () => {
    it('should return searchItemPSV data', () => {
      const parameters: PSVSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: ''
      };
      const action = new SearchPSV(parameters);
      const outcome = new SearchPSVSuccess(dummySearchADJ);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummySearchADJ
      });
      otherIssueService.searchAdjustmentItem.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchItemPSV$).toBeObservable(expected$);
      //expect(otherIssueService.searchAdjustmentItem).toHaveBeenCalled();
    });

    it('should fail and return an action with the error', () => {
      const parameters: PSVSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: '',
        rowNumber: 1
      };
      const action = new SearchPSV(parameters);
      const error = new Error('some error');
      const outcome = new SearchPSVSuccess({
        items: [],
        count: 0
      });

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.searchAdjustmentItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchItemPSV$).toBeObservable(expected);
    });
  });

  describe('searchItemFOC', () => {
    it('should return updateStockIssue data', () => {
      const parameters: PSVSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: '',
        rowNumber: 1
      };
      const action = new SearchFOC(parameters);
      const outcome = new SearchFOCSuccess({
        count: 0,
        items: [
          {
            id: null,
            itemCode: '512219VGGQ2A00',
            lotNumber: '2EB000073',
            mfgDate: moment(1588703400000),
            productCategory: 'V',
            productGroup: '71',
            binCode: 'LOAN',
            binGroupCode: 'LOAN',
            stdValue: 160410,
            stdWeight: 46.186,
            currencyCode: 'INR',
            weightUnit: 'gms',
            status: 'OPEN',
            imageURL: '/productcatalogue/ProductImages/2219VGG.jpg',
            itemDetails: null,
            availableQuantity: 5,
            availableWeight: 230.93,
            availableValue: 802050,
            measuredQuantity: null,
            measuredWeight: null,
            measuredValue: null,
            orderType: null,
            approvedQuantity: null,
            isStudded: null,
            isUpdating: null,
            isUpdatingSuccess: null,
            issuedQuantity: null,
            itemValue: null,
            itemWeight: null,
            productCategoryId: null,
            productGroupId: null,
            requestedQuantity: null,
            totalQuantity: null,
            totalValue: null,
            totalWeight: null,
            totalElements: null,

            inventoryId: 123,
            taxDetails:{}
          }
        ]
      });

      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          count: 0,
          items: [
            {
              id: null,
              itemCode: '512219VGGQ2A00',
              lotNumber: '2EB000073',
              mfgDate: moment(1588703400000),
              productCategory: 'V',
              productGroup: '71',
              binCode: 'LOAN',
              binGroupCode: 'LOAN',
              stdValue: 160410,
              stdWeight: 46.186,
              currencyCode: 'INR',
              weightUnit: 'gms',
              status: 'OPEN',
              imageURL: '/productcatalogue/ProductImages/2219VGG.jpg',
              itemDetails: null,
              availableQuantity: 5,
              availableWeight: 230.93,
              availableValue: 802050,
              measuredQuantity: null,
              measuredWeight: null,
              measuredValue: null,
              orderType: null,
              approvedQuantity: null,
              isStudded: null,
              isUpdating: null,
              isUpdatingSuccess: null,
              issuedQuantity: null,
              itemValue: null,
              itemWeight: null,
              productCategoryId: null,
              productGroupId: null,
              requestedQuantity: null,
              totalQuantity: null,
              totalValue: null,
              totalWeight: null,
              totalElements: null,

              inventoryId: 123,
              taxDetails: {}
            }
          ]
        }
      });
      otherIssueService.searchAdjustmentItem.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });

      expect(effect.searchItemFOC$).toBeObservable(expected$);
      //expect(otherIssueService.searchAdjustmentItem).toHaveBeenCalled();
    });

    it('should fail and return an action with the error', () => {
      const parameters: PSVSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: '',
        rowNumber: 1
      };
      const action = new SearchFOC(parameters);
      const error = new Error('some error');
      const outcome = new SearchFOCSuccess({ items: [], count: 0 });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.searchAdjustmentItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchItemFOC$).toBeObservable(expected);
    });
  });

  describe('createStockRequestAdjustment', () => {
    it('should return createStockRequestAdjustment data', () => {
      const serviceResponse: OtherIssueModel = {
        id: 1,
        srcLocationCode: 'srcLoc',
        destLocationCode: 'destLoc',
        status: 'ISSUED',
        weightUnit: 'gms',
        currencyCode: 'INR',
        reqDocNo: 111,
        reqDocDate: moment(),
        reqLocationCode: 'reqLoc',
        requestType: 'ADJ',
        carrierDetails: null,
        destDocDate: moment(),
        destDocNo: 222,
        orderType: null,
        otherDetails: null,
        srcDocDate: moment(),
        srcDocNo: 333,
        srcFiscalYear: 2019,
        totalAvailableQuantity: 10,
        totalAvailableValue: 10000,
        totalAvailableWeight: 100,
        totalMeasuredQuantity: 10,
        totalMeasuredValue: 1000,
        totalMeasuredWeight: 100,
        remarks: 'testing'
      };

      const parameters: CreateStockRequestAdjustmentPayload = {
        approvalDetails: { data: '', type: '' },
        items: [],
        remarks: '',
        reqType: ''
      };
      const action = new CreateStockRequestAdjustment(parameters);
      const outcome = new CreateStockRequestAdjustmentSuccess(serviceResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: serviceResponse
      });
      otherIssueService.createStockRequestAdjustment.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.createStockRequestAdjustment$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: CreateStockRequestAdjustmentPayload = {
        approvalDetails: { data: '', type: '' },
        items: [],
        remarks: '',
        reqType: ''
      };
      const action = new CreateStockRequestAdjustment(parameters);
      const error = new Error('some error');
      const outcome = new CreateStockRequestAdjustmentFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.createStockRequestAdjustment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createStockRequestAdjustment$).toBeObservable(expected);
    });
  });

  describe('createStockRequestPSV', () => {
    it('should return createStockRequestPSV data', () => {
      const serviceResponse: OtherIssueModel = {
        id: 1,
        srcLocationCode: 'srcLoc',
        destLocationCode: 'destLoc',
        status: 'ISSUED',
        weightUnit: 'gms',
        currencyCode: 'INR',
        reqDocNo: 111,
        reqDocDate: moment(),
        reqLocationCode: 'reqLoc',
        requestType: 'ADJ',
        carrierDetails: null,
        destDocDate: moment(),
        destDocNo: 222,
        orderType: null,
        otherDetails: null,
        srcDocDate: moment(),
        srcDocNo: 333,
        srcFiscalYear: 2019,
        totalAvailableQuantity: 10,
        totalAvailableValue: 10000,
        totalAvailableWeight: 100,
        totalMeasuredQuantity: 10,
        totalMeasuredValue: 1000,
        totalMeasuredWeight: 100,
        remarks: 'testing'
      };

      const parameters: CreateStockRequestAdjustmentPayload = {
        approvalDetails: { data: '', type: '' },
        items: [],
        remarks: '',
        reqType: ''
      };
      const action = new CreateStockRequestPSV(parameters);
      const outcome = new CreateStockRequestPSVSuccess(serviceResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: serviceResponse
      });
      otherIssueService.createStockRequestAdjustment.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.createStockRequestPSV$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: CreateStockRequestAdjustmentPayload = {
        approvalDetails: { data: '', type: '' },
        items: [],
        remarks: '',
        reqType: ''
      };
      const action = new CreateStockRequestPSV(parameters);
      const error = new Error('some error');
      const outcome = new CreateStockRequestPSVFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.createStockRequestAdjustment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createStockRequestPSV$).toBeObservable(expected);
    });
  });

  describe('createStockRequestFOC', () => {
    it('should return createStockRequestFOC data', () => {
      const serviceResponse: OtherIssueModel = {
        id: 1,
        srcLocationCode: 'srcLoc',
        destLocationCode: 'destLoc',
        status: 'ISSUED',
        weightUnit: 'gms',
        currencyCode: 'INR',
        reqDocNo: 111,
        reqDocDate: moment(),
        reqLocationCode: 'reqLoc',
        requestType: 'ADJ',
        carrierDetails: null,
        destDocDate: moment(),
        destDocNo: 222,
        orderType: null,
        otherDetails: null,
        srcDocDate: moment(),
        srcDocNo: 333,
        srcFiscalYear: 2019,
        totalAvailableQuantity: 10,
        totalAvailableValue: 10000,
        totalAvailableWeight: 100,
        totalMeasuredQuantity: 10,
        totalMeasuredValue: 1000,
        totalMeasuredWeight: 100,
        remarks: 'testing'
      };

      const parameters: CreateStockRequestAdjustmentPayload = {
        approvalDetails: { data: '', type: '' },
        items: [],
        remarks: '',
        reqType: ''
      };
      const action = new CreateStockRequestFOC(parameters);
      const outcome = new CreateStockRequestFOCSuccess(serviceResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: serviceResponse
      });
      otherIssueService.createStockRequestAdjustment.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.createStockRequestFOC$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: CreateStockRequestAdjustmentPayload = {
        approvalDetails: { data: '', type: '' },
        items: [],
        remarks: '',
        reqType: ''
      };
      const action = new CreateStockRequestFOC(parameters);
      const error = new Error('some error');
      const outcome = new CreateStockRequestFOCFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.createStockRequestAdjustment.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createStockRequestFOC$).toBeObservable(expected);
    });
  });

  describe('loadIssueFOCList', () => {
    it('should return loadIssueFOCList data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssueFOCList(parameters);
      const outcome = new LoadIssueFOCListSuccess(dummmyIssueList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummmyIssueList
      });
      otherIssueService.getIssueList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIssueFOCList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadIssueFOCList(parameters);
      const error = new Error('some error');
      const outcome = new LoadIssueFOCListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherIssueService.getIssueList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIssueFOCList$).toBeObservable(expected);
    });
  });
});
