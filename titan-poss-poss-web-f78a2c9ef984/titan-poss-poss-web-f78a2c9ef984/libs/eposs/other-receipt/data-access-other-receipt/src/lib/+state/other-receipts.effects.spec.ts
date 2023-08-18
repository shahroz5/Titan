import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { OtherReceiptsEffect } from './other-receipts.effects';
import { OtherReceiptService } from '../other-receipts.service';
import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import {
  OtherIssuedataModel,
  OtherIssueModel,
  OtherIssueLoadListItemsPayload,
  RequestOtherIssueStockTransferNote,
  OtherIssuesItem,
  ConfirmOtherStockIssueResponse,
  OtherIssuesCreateStockResponse,
  AdjustmentSearchItemPayloadSuccess,
  LoadOtherIssueCreateItemsTotalCountSuccessPayload,
  ProductGroup,
  ProductCategory,
  PSVSearchItemPayload,
  LoadOtherReceiptsSTNCountPayload,
  CustomErrors,
  AdjustmentItem,
  OtherReceiptStockPayLoad,
  OtherReceiptAdjustmentSearchPayload,
  OtherReceiptSearchPendingPayload,
  OtherReceiptLoadListItemsPayload,
  OtherReceiptConfirmAdjustmentItemsPayload,
  OtherReceiptSearchCartItemAdjustmentPayload,
  OtherReceiptUpdateAdjustementItemPayload,
  OtherReceiptUpdateAllItemsPayload,
  OtherReceiptUpdateItemPayload,
  OtherReceiptLoadItemsPayload,
  OtherReceiptItemValidate,
  OtherReceiptsDataModel,
  OtherReceiptsModel,
  OtherReceiptLoadItemsTotalCountSuccessPayload,
  OtherReceiptLoadItemsTotalCountPayload,
  OtherReceiptItem,
  OtherReceiptUpdateItemFailurePayload,
  OtherReceiptItemUpdate,
  ItemSummary,
  LoadOtherReceiptsHistoryPayload,
  LoadOtherReceiptsHistoryItemsPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsSuccess,
  LoadStuddedProductGroupsFailure,
  LoadProductCategories,
  LoadProductCategoriesFailure,
  LoadProductCategoriesSuccess,
  LoadProductGroups,
  LoadProductGroupsFailure,
  LoadProductGroupsSuccess,
  AdjustmentSearch,
  AdjustmentSearchSuccess,
  PSVSearch,
  PSVSearchSuccess,
  LoadRecieptList,
  LoadRecieptListSuccess,
  LoadRecieptListFailure,
  LoadReceiptsSTNCountFailure,
  LoadReceiptsSTNCount,
  LoadReceiptsSTNCountSuccess,
  SearchPendingReceipts,
  SearchPendingReceiptsSuccess,
  LoadItemsTotalCount,
  LoadItemsTotalCountSuccess,
  LoadItemsTotalCountFailure,
  LoadSelectedStock,
  LoadSelectedStockSuccess,
  LoadSelectedStockFailure,
  LoadNonVerifiedItems,
  LoadNonVerifiedItemsSuccess,
  LoadVerifiedItems,
  LoadVerifiedItemsSuccess,
  LoadBinCodes,
  LoadBinCodesSuccess,
  LoadBinCodesFailure,
  VerifyItem,
  VerifyItemSuccess,
  VerifyItemFailure,
  UpdateItem,
  UpdateItemSuccess,
  UpdateItemFailure,
  ConfirmStockReceive,
  ConfirmStockReceiveSuccess,
  ConfirmStockReceiveFailure,
  LoadRemarks,
  LoadRemarksSuccess,
  LoadRemarksFailure,
  VerifyAllItems,
  VerifyAllItemsSuccess,
  VerifyAllItemsFailure,
  AssignBinToAllItems,
  AssignBinToAllItemsSuccess,
  AssignBinToAllItemsFailure,
  LoadRecieptLoanList,
  LoadRecieptLoanListSuccess,
  LoadRecieptLoanListFailure,
  ConfirmAdjustementItems,
  ConfirmAdjustementItemsSuccess,
  ConfirmAdjustementItemsFailure,
  LoadReceiptsADJList,
  LoadReceiptsADJListSuccess,
  LoadReceiptsADJListFailure,
  ConfirmPSVItems,
  ConfirmPSVItemsSuccess,
  ConfirmPSVItemsFailure,
  ValidateNonVerifiedItem,
  ValidateNonVerifiedItemSuccess,
  ValidateNonVerifiedItemFailure,
  ValidateVerifiedItem,
  ValidateVerifiedItemSuccess,
  ValidateVerifiedItemFailure,
  LoadOtherReceiptsHistory,
  LoadOtherReceiptsHistorySuccess,
  LoadSelectedHistory,
  LoadSelectedHistorySuccess,
  LoadSelectedHistoryFailure,
  LoadSelectedHistoryItemsSuccess,
  LoadSelectedHistoryItems,
  LoadSelectedHistoryItemsTotalCountSuccess,
  LoadSelectedHistoryItemsTotalCount
} from './other-receipts.actions';
import { HttpClient } from '@angular/common/http';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  BinDataService,
  ItemDataService,
  LovDataService,
  ProductCategoryDataService,
  ProductGroupDataService} from '@poss-web/shared/masters/data-access-masters';
import { InventoryValidationService,CommonService } from '@poss-web/shared/common/data-access-common';
import { OTHER_RECEIPT_FEATURE_KEY } from './other-receipts.reducer';

const dummyReceiptCount: LoadOtherReceiptsSTNCountPayload = {
  countData: [{ type: '', count: 0 }],
  pendingOtherReceiptsSTNCount: 0
};

const receipt2: OtherReceiptsModel = {
  id: 5260,
  transactionType: 'EXH',

  locationCode: 's',
  status: 'APVL_PENDING',
  weightUnit: 'gms',
  currencyCode: 'INR',
  carrierDetails: null,

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
  totalMeasuredWeight: 321.9
};

const otherReceiptsDataModel: OtherReceiptsDataModel = {
  receiptsData: [receipt2],
  totalElements: 1
};
const adjustmentitem: AdjustmentItem = {
  binCode: 'a',
  binGroupCode: 'a',
  destDocNo: 1,
  imageURL: '',
  itemCode: '',
  measuredQuantity: 1,
  measuredWeight: 2,
  productCategory: '',
  productCategoryId: '',
  productGroup: '',
  productGroupId: '',
  stdValue: 1,
  isStudded: false,
  thumbnailImageURL:'',
  taxDetails:{},
  isLoadingImage:true,
  isLoadingThumbnailImage: true,
  id:''
};

const itemValidate: OtherReceiptItemValidate = {
  availableQuantity: 1,
  availableWeight: 1,
  itemId: '',
  measuredQuantity: 1,
  measuredWeight: 1,
  productGroupCode: ''
};
const item: ItemSummary = {
  itemCode: '',
  productCategoryCode: '',
  productCategoryDesc: '',
  productGroupCode: '',
  productGroupDesc: '',
  stdValue: 1,
  isStudded: true,
  thumbnailImageURL:'',
  taxDetails:{},
  isLoadingImage:true,
  isLoadingThumbnailImage: true,
  id:''
};

const otherReceiptLoadItemsPayload: OtherReceiptLoadItemsPayload = {
  id: 1,
  pageIndex: 0,
  pageSize: 10,
  property: '',
  sortBy: '',
  transactionType: 'EXH'
};
const otherReceiptLoadItemsTotalCountSuccessPayload: OtherReceiptLoadItemsTotalCountSuccessPayload = {
  nonVerifiedItemsTotalCount: 1,
  verifiedItemsTotalCount: 1
};
const otherReceiptItemUpdate: OtherReceiptItemUpdate = {
  binCode: '',
  binGroupCode: '',
  itemDetails: {},
  measuredWeight: 1,
  remarks: ''
};
const otherReceiptUpdateItemPayload: OtherReceiptUpdateItemPayload = {
  actualDetails: {
    binCode: '',
    binGroupCode: '',
    itemDetails: {},
    measuredWeight: 1,
    remarks: ''
  },
  id: 1,
  itemId: '',
  newUpdate: {
    binCode: '',
    binGroupCode: '',
    itemDetails: {},
    measuredWeight: 1,
    remarks: ''
  },
  transactionType: 'EXH'
};
const item1: OtherReceiptItem = {
  id: 'a',
  itemCode: '111AVSW1111',
  lotNumber: '10000AB1',
  productCategory: '',
  productCategoryDesc: '',
  productGroup: '',
  productGroupDesc: '',
  binCode: '',
  binGroupCode: '',
  orderType: null,
  itemValue: 100,

  totalQuantity: 1,
  totalValue: 100,
  totalWeight: 1,
  currencyCode: 'INR',
  weightUnit: 'gms',
  mfgDate: moment(),
  status: 'ISSUED',
  imageURL: '',
  itemDetails: { actualGoldWeight: 1, otherStoneWt: 1 },

  isUpdating: false,
  isUpdatingSuccess: true,

  isValidating: true,
  isValidatingError: false,
  isValidatingSuccess: true,
  remarks: '',
  measuredWeight: 10,
  measuredValue: 1000,
  measuredQuantity: 1,
  availableQuantity: 1,
  availableValue: 1000,
  availableWeight: 10,
  stdWeight: 10,
  stdValue: 100,
  isStudded: false,
  thumbnailImageURL:'',
  taxDetails:{},
  isLoadingImage:true,
  isLoadingThumbnailImage: true,
};
const otherReceiptUpdateAllItemsPayload: OtherReceiptUpdateAllItemsPayload = {
  data: {},
  id: 1,
  transactionType: 'EXH'
};

const otherReceiptConfirmAdjustmentItemsPayload: OtherReceiptConfirmAdjustmentItemsPayload = {
  items: [],
  remarks: '',
  type: 'EXH'
};

const otherReceiptLoadListItemsPayload: OtherReceiptLoadListItemsPayload = {
  pageIndex: 0,
  pageSize: 10,
  type: 'EXH'
};

const otherReceiptSearchPendingPayload: OtherReceiptSearchPendingPayload = {
  srcDocnumber: 12,
  type: 'EXH'
};

const otherReceiptAdjustmentSearchPayload: OtherReceiptAdjustmentSearchPayload = {
  lotNumber: '',
  variantCode: ''
};

const confirmStockReceivePayload = {
  confirmReceive: { remarks: '' },
  id: 1,
  transactionType: 'EXH'
};

const otherReceiptStockPayLoad: OtherReceiptStockPayLoad = {
  id: '1234',
  transactionType: 'EXH'
};

const otherReceiptLoadItemsTotalCountPayload: OtherReceiptLoadItemsTotalCountPayload = {
  id: 1234,
  transactionType: 'EXH'
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

describe('Other Receipts Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: OtherReceiptsEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let otherReceiptService = jasmine.createSpyObj<OtherReceiptService>(
    'OtherIssuesService',
    [
      'getReceiptsList',
      'getOtherReceiptsSTNCount',
      'getTempSortItems',
      'getOtherReceiveItemsCount',
      'searchRecieptsStocks',
      'verifyOtherReceiptItem',
      'confirmAdjustementItems',
      'getOtherReceiptStock',
      'confirmOtherReceiveStn',
      'updateAllOtherReceiptItems',
      'getHistory',
      'getSelectedHistory',
      'getHistoryItems',
      'getHistoryItemsTotalCount'
    ]
  );
  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);
  const productCategoryDataServiceSpy = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategories']);
  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getInventoryLovs'
  ]);
  const binDataServiceSpy = jasmine.createSpyObj<BinDataService>([
    'getBinDetails'
  ]);
  const commonServiceSpy = jasmine.createSpyObj<CommonService>([
    'commonService'
  ]);
  const itemDataServiceSpy = jasmine.createSpyObj<ItemDataService>([
    'getItemSummaryByCode'
  ]);
  const inventoryValidationServiceSpy = jasmine.createSpyObj<
    InventoryValidationService
  >(['validateWeightTolerance']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OtherReceiptsEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [OTHER_RECEIPT_FEATURE_KEY]: initialState
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
          provide: InventoryValidationService,
          useValue: inventoryValidationServiceSpy
        },
        {
          provide: CommonService,
          useValue: commonServiceSpy
        },
        {
          provide: BinDataService,
          useValue: binDataServiceSpy
        },
        {
          provide: ItemDataService,
          useValue: itemDataServiceSpy
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
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
          provide: OtherReceiptService,
          useValue: otherReceiptService
        }
      ]
    });

    effect = TestBed.inject(OtherReceiptsEffect);
    // otherReceiptService = TestBed.get(OtherReceiptService);
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

  describe('searchItemAdjustment', () => {
    it('should return searchItemAdjustment data', () => {
      const action = new AdjustmentSearch(otherReceiptAdjustmentSearchPayload);
      const completion = new AdjustmentSearchSuccess(item);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      itemDataServiceSpy.getItemSummaryByCode.and.returnValue(of(item));

      expect(effect.adjustmentSearch$).toBeObservable(expected);
    });

    it('should fail and return an action with the error', () => {
      const action = new AdjustmentSearch(otherReceiptAdjustmentSearchPayload);
      const error = new Error('some error');
      const outcome = new AdjustmentSearchSuccess(null);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      itemDataServiceSpy.getItemSummaryByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.adjustmentSearch$).toBeObservable(expected);
    });
  });

  describe('searchItemPSV', () => {
    it('should return searchItemPSV data', () => {
      const action = new PSVSearch(otherReceiptAdjustmentSearchPayload);
      const outcome = new PSVSearchSuccess(item);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: item
      });
      itemDataServiceSpy.getItemSummaryByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.psvSearch$).toBeObservable(expected$);
      //expect(otherReceiptService.searchAdjustmentItem).toHaveBeenCalled();
    });

    it('should fail and return an action with the error', () => {
      const parameters: PSVSearchItemPayload = {
        lotNumber: '',
        productGroups: [],
        variantCode: '',
        rowNumber: 1
      };
      const action = new PSVSearch(parameters);
      const error = new Error('some error');
      const outcome = new PSVSearchSuccess(null);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      itemDataServiceSpy.getItemSummaryByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.psvSearch$).toBeObservable(expected);
    });
  });

  describe('LoadRecieptList', () => {
    it('should return LoadRecieptList data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadRecieptList(otherReceiptLoadListItemsPayload);
      const outcome = new LoadRecieptListSuccess(otherReceiptsDataModel);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: otherReceiptsDataModel
      });
      otherReceiptService.getReceiptsList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReceiptList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadRecieptList(parameters);
      const error = new Error('some error');
      const outcome = new LoadRecieptListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.getReceiptsList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReceiptList$).toBeObservable(expected);
    });
  });

  describe('LoadReceiptsSTNCount', () => {
    it('should return LoadReceiptsSTNCount data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadReceiptsSTNCount();
      const outcome = new LoadReceiptsSTNCountSuccess(dummyReceiptCount);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: dummyReceiptCount
      });
      otherReceiptService.getOtherReceiptsSTNCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadOtherReceiptsCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadReceiptsSTNCount();
      const error = new Error('some error');
      const outcome = new LoadReceiptsSTNCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.getOtherReceiptsSTNCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadOtherReceiptsCount$).toBeObservable(expected);
    });
  });

  describe('loadReceiptLoanList', () => {
    it('should return loadReceiptLoanList data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new LoadRecieptLoanList(otherReceiptLoadListItemsPayload);
      const outcome = new LoadRecieptLoanListSuccess(otherReceiptsDataModel);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: otherReceiptsDataModel
      });
      otherReceiptService.getReceiptsList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReceiptLoanList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRecieptLoanList(otherReceiptLoadListItemsPayload);
      const error = new Error('some error');
      const outcome = new LoadRecieptLoanListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.getReceiptsList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadReceiptLoanList$).toBeObservable(expected);
    });
  });

  describe('searchPendingReceiptsStocks', () => {
    it('should return searchPendingReceiptsStocks data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new SearchPendingReceipts(
        otherReceiptSearchPendingPayload
      );
      const outcome = new SearchPendingReceiptsSuccess([receipt2]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: [receipt2]
      });
      otherReceiptService.searchRecieptsStocks.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchPendingReceiptsStocks$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SearchPendingReceipts(
        otherReceiptSearchPendingPayload
      );
      const error = new Error('some error');
      const outcome = new SearchPendingReceiptsSuccess([]);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: []
      });
      otherReceiptService.searchRecieptsStocks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchPendingReceiptsStocks$).toBeObservable(expected);
    });
  });

  describe('loadItemsTotalCount', () => {
    it('should return loadItemsTotalCount data', () => {
      const action = new LoadItemsTotalCount(
        otherReceiptLoadItemsTotalCountPayload
      );
      const outcome = new LoadItemsTotalCountSuccess(
        otherReceiptLoadItemsTotalCountSuccessPayload
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: otherReceiptLoadItemsTotalCountSuccessPayload
      });
      otherReceiptService.getOtherReceiveItemsCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadItemsTotalCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadItemsTotalCount(
        otherReceiptLoadItemsTotalCountPayload
      );
      const error = new Error('some error');
      const outcome = new LoadItemsTotalCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.getOtherReceiveItemsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadItemsTotalCount$).toBeObservable(expected);
    });
  });

  describe('loadNonVerifiedItems', () => {
    it('should return loadNonVerifiedItems data', () => {
      const action = new LoadNonVerifiedItems(otherReceiptLoadItemsPayload);
      const outcome = new LoadNonVerifiedItemsSuccess({
        items: [item1],
        count: 2
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: { items: [item1], count: 2 }
      });
      otherReceiptService.getTempSortItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadNonVerifiedItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadNonVerifiedItems(otherReceiptLoadItemsPayload);
      const error = new Error('some error');
      const outcome = new LoadNonVerifiedItemsSuccess({
        items: [],
        count: 0
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: { items: [], count: 0 }
      });
      otherReceiptService.getTempSortItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadNonVerifiedItems$).toBeObservable(expected);
    });
  });

  describe('loadVerifiedItems', () => {
    it('should return loadVerifiedItems data', () => {
      const action = new LoadVerifiedItems(otherReceiptLoadItemsPayload);
      const outcome = new LoadVerifiedItemsSuccess({
        items: [item1],
        count: 2
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: { items: [item1], count: 2 }
      });
      otherReceiptService.getTempSortItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadVerifiedItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadVerifiedItems(otherReceiptLoadItemsPayload);
      const error = new Error('some error');
      const outcome = new LoadVerifiedItemsSuccess({
        items: [],
        count: 0
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: { items: [], count: 0 }
      });
      otherReceiptService.getTempSortItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadVerifiedItems$).toBeObservable(expected);
    });
  });

  describe('loadBins', () => {
    it('should return loadBins data', () => {
      const action = new LoadBinCodes('test');
      const outcome = new LoadBinCodesSuccess([]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: []
      });
      binDataServiceSpy.getBinDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBins$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBinCodes('test');
      const error = new Error('some error');
      const outcome = new LoadBinCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      binDataServiceSpy.getBinDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBins$).toBeObservable(expected);
    });
  });

  describe('loadRemarks', () => {
    it('should return loadRemarks data', () => {
      const action = new LoadRemarks();
      const outcome = new LoadRemarksSuccess([
        { code: '', isActive: true, value: '' }
      ]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: [{ code: '', isActive: true, value: '' }]
      });
      lovDataServiceSpy.getInventoryLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadRemarks$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRemarks();
      const error = new Error('some error');
      const outcome = new LoadRemarksFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getInventoryLovs.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.loadRemarks$).toBeObservable(expected);
    });
  });

  describe('verifyItem', () => {
    it('should return verifyItem data', () => {
      const action = new VerifyItem(otherReceiptUpdateItemPayload);
      const outcome = new VerifyItemSuccess(item1);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: item1
      });
      otherReceiptService.verifyOtherReceiptItem.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.verifyItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: OtherReceiptUpdateItemFailurePayload = {
        actualDetails: otherReceiptItemUpdate,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new VerifyItem(otherReceiptUpdateItemPayload);
      const error = new Error('Some Error');
      const outcome = new VerifyItemFailure(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.verifyOtherReceiptItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.verifyItem$).toBeObservable(expected);
    });
  });

  describe('validateNonVerifiedItem', () => {
    it('should return validateNonVerifiedItem data', () => {
      const action = new ValidateNonVerifiedItem(itemValidate);
      const outcome = new ValidateNonVerifiedItemSuccess({
        itemId: '',
        isSuccess: true
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: { itemId: '', isSuccess: true }
      });
      inventoryValidationServiceSpy.validateWeightTolerance.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.validateNonVerifiedItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new ValidateNonVerifiedItem(itemValidate);
      const error = new Error('Some Error');
      const outcome = new ValidateNonVerifiedItemFailure(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      inventoryValidationServiceSpy.validateWeightTolerance.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.validateNonVerifiedItem$).toBeObservable(expected);
    });
  });
  describe('validateVerifiedItem', () => {
    it('should return validateNonVerifiedItem data', () => {
      const action = new ValidateVerifiedItem(itemValidate);
      const outcome = new ValidateVerifiedItemSuccess({
        itemId: '',
        isSuccess: true
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: { itemId: 'test', isSuccess: true }
      });
      inventoryValidationServiceSpy.validateWeightTolerance.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.validateVerifiedItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new ValidateVerifiedItem(itemValidate);
      const error = new Error('Some Error');
      const outcome = new ValidateVerifiedItemFailure(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      inventoryValidationServiceSpy.validateWeightTolerance.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.validateVerifiedItem$).toBeObservable(expected);
    });
  });

  describe('updateItem', () => {
    it('should return updateItem data', () => {
      const action = new UpdateItem(otherReceiptUpdateItemPayload);
      const outcome = new UpdateItemSuccess(item1);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: item1
      });
      otherReceiptService.verifyOtherReceiptItem.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: OtherReceiptUpdateItemFailurePayload = {
        actualDetails: otherReceiptItemUpdate,
        error: CustomErrorAdaptor.fromJson(Error('Some Error')),
        itemId: ''
      };
      const action = new UpdateItem(otherReceiptUpdateItemPayload);
      const error = new Error('Some Error');
      const outcome = new UpdateItemFailure(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.verifyOtherReceiptItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateItem$).toBeObservable(expected);
    });
  });

  describe('verifyAllItems', () => {
    it('should return verifyAllItems data', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new VerifyAllItems(otherReceiptUpdateAllItemsPayload);
      const outcome = new VerifyAllItemsSuccess(true);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: true
      });
      otherReceiptService.updateAllOtherReceiptItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.verifyAllItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: OtherIssueLoadListItemsPayload = {
        pageIndex: 0,
        pageSize: 10,
        type: 'EXH'
      };
      const action = new VerifyAllItems(otherReceiptUpdateAllItemsPayload);
      const error = new Error('some error');
      const outcome = new VerifyAllItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.updateAllOtherReceiptItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.verifyAllItems$).toBeObservable(expected);
    });
  });

  describe('confirmStock', () => {
    it('should return confirmStock data', () => {
      const action = new ConfirmStockReceive(confirmStockReceivePayload);
      const outcome = new ConfirmStockReceiveSuccess([]);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: []
      });
      otherReceiptService.confirmOtherReceiveStn.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.confirmStock$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ConfirmStockReceive(confirmStockReceivePayload);
      const error = new Error('some error');
      const outcome = new ConfirmStockReceiveFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.confirmOtherReceiveStn.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmStock$).toBeObservable(expected);
    });
  });

  describe('assignBinToAllItems', () => {
    it('should return assignBinToAllItems data', () => {
      const action = new AssignBinToAllItems(otherReceiptUpdateAllItemsPayload);
      const outcome = new AssignBinToAllItemsSuccess(true);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: true
      });
      otherReceiptService.updateAllOtherReceiptItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.assignBinToAllItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new AssignBinToAllItems(otherReceiptUpdateAllItemsPayload);
      const error = new Error('some error');
      const outcome = new AssignBinToAllItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.updateAllOtherReceiptItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.assignBinToAllItems$).toBeObservable(expected);
    });
  });

  describe('loadSeletedStock', () => {
    it('should return loadSeletedStock data', () => {
      const action = new LoadSelectedStock(otherReceiptStockPayLoad);
      const outcome = new LoadSelectedStockSuccess(receipt2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: receipt2
      });
      otherReceiptService.getOtherReceiptStock.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSeletedStock$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSelectedStock(otherReceiptStockPayLoad);
      const error = new Error('some error');
      const outcome = new LoadSelectedStockFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.getOtherReceiptStock.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSeletedStock$).toBeObservable(expected);
    });
  });

  describe('adjustmentSearch', () => {
    it('should return adjustmentSearch data', () => {
      const action = new AdjustmentSearch(otherReceiptAdjustmentSearchPayload);
      const outcome = new AdjustmentSearchSuccess(item);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: item
      });
      itemDataServiceSpy.getItemSummaryByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.adjustmentSearch$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new AdjustmentSearch(otherReceiptAdjustmentSearchPayload);
      const error = new Error('some error');
      const outcome = new AdjustmentSearchSuccess(null);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: null
      });
      itemDataServiceSpy.getItemSummaryByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.adjustmentSearch$).toBeObservable(expected);
    });
  });

  describe('confirmAdjustmentItems', () => {
    it('should return confirmAdjustmentItems data', () => {
      const action = new ConfirmAdjustementItems(
        otherReceiptConfirmAdjustmentItemsPayload
      );
      const outcome = new ConfirmAdjustementItemsSuccess(adjustmentitem);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: adjustmentitem
      });
      otherReceiptService.confirmAdjustementItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.confirmAdjustmentItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ConfirmAdjustementItems(
        otherReceiptConfirmAdjustmentItemsPayload
      );
      const error = new Error('some error');
      const outcome = new ConfirmAdjustementItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.confirmAdjustementItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmAdjustmentItems$).toBeObservable(expected);
    });
  });

  describe('loadreceiptsADJList', () => {
    it('should return loadreceiptsADJList data', () => {
      const action = new LoadReceiptsADJList(otherReceiptLoadListItemsPayload);
      const outcome = new LoadReceiptsADJListSuccess(otherReceiptsDataModel);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: otherReceiptsDataModel
      });
      otherReceiptService.getReceiptsList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadreceiptsADJList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadReceiptsADJList(otherReceiptLoadListItemsPayload);
      const error = new Error('some error');
      const outcome = new LoadReceiptsADJListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.getReceiptsList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadreceiptsADJList$).toBeObservable(expected);
    });
  });

  describe('psvSearch', () => {
    it('should return psvSearch data', () => {
      const action = new PSVSearch(otherReceiptAdjustmentSearchPayload);
      const outcome = new PSVSearchSuccess(item);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: item
      });
      itemDataServiceSpy.getItemSummaryByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.psvSearch$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new PSVSearch(otherReceiptAdjustmentSearchPayload);
      const error = new Error('some error');
      const outcome = new PSVSearchSuccess(null);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: null
      });
      itemDataServiceSpy.getItemSummaryByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.psvSearch$).toBeObservable(expected);
    });
  });

  describe('confirmPSVItems', () => {
    it('should return confirmPSVItems data', () => {
      const action = new ConfirmPSVItems(
        otherReceiptConfirmAdjustmentItemsPayload
      );
      const outcome = new ConfirmPSVItemsSuccess(adjustmentitem);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: adjustmentitem
      });
      otherReceiptService.confirmAdjustementItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.confirmPSVItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ConfirmPSVItems(
        otherReceiptConfirmAdjustmentItemsPayload
      );
      const error = new Error('some error');
      const outcome = new ConfirmPSVItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.confirmAdjustementItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmPSVItems$).toBeObservable(expected);
    });
  });

  describe('loadreceiptsADJList', () => {
    it('should return loadreceiptsADJList data', () => {
      const action = new LoadReceiptsADJList(otherReceiptLoadListItemsPayload);
      const outcome = new LoadReceiptsADJListSuccess(otherReceiptsDataModel);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: otherReceiptsDataModel
      });
      otherReceiptService.getReceiptsList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadreceiptsADJList$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadReceiptsADJList(otherReceiptLoadListItemsPayload);
      const error = new Error('some error');
      const outcome = new LoadReceiptsADJListFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.getReceiptsList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadreceiptsADJList$).toBeObservable(expected);
    });
  });

  describe('loadReceiptsHistory', () => {
    it('should return LoadReciept data', () => {
      const payload: LoadOtherReceiptsHistoryPayload = {
        page: 0,
        size: 8,
        sort: '',
        payload: {
          actionType: 'RECEIVE',
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
        transactionType: 'ADJ'
      };

      const action = new LoadOtherReceiptsHistory(payload);
      const outcome = new LoadOtherReceiptsHistorySuccess(
        otherReceiptsDataModel
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: otherReceiptsDataModel
      });
      otherReceiptService.getHistory.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReceiptsHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the empty result and 0 count', () => {
      const resPayload: OtherReceiptsDataModel = {
        receiptsData: [],
        totalElements: 0
      };
      const payload: LoadOtherReceiptsHistoryPayload = {
        page: 0,
        size: 8,
        sort: '',
        payload: {
          actionType: 'RECEIVE',
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
        transactionType: 'ADJ'
      };

      const action = new LoadOtherReceiptsHistory(payload);
      const outcome = new LoadOtherReceiptsHistorySuccess(resPayload);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: {
          receiptsData: [],
          totalElements: 0
        }
      });
      otherReceiptService.getHistory.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadReceiptsHistory$).toBeObservable(expected$);
    });
  });

  describe('loadReceiptsHistory', () => {
    it('should return loadSeletedHistory data', () => {
      const reqPayload: { id: number; transactionType: string } = {
        id: 1,
        transactionType: 'ADJ'
      };
      const action = new LoadSelectedHistory(reqPayload);
      const outcome = new LoadSelectedHistorySuccess(receipt2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: receipt2
      });
      otherReceiptService.getSelectedHistory.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const reqPayload: { id: number; transactionType: string } = {
        id: 1,
        transactionType: 'ADJ'
      };
      const action = new LoadSelectedHistory(reqPayload);
      const error = new Error('some error');
      const outcome = new LoadSelectedHistoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      otherReceiptService.getSelectedHistory.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedHistory$).toBeObservable(expected);
    });
  });

  describe('loadHistoryItems', () => {
    const payload: LoadOtherReceiptsHistoryItemsPayload = {
      id: 111,
      page: 0,
      size: 8,
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
    it('should return loadHistoryItems data', () => {
      const action = new LoadSelectedHistoryItems(payload);
      const outcome = new LoadSelectedHistoryItemsSuccess({
        items: [item1],
        count: 2
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: { items: [item1], count: 2 }
      });
      otherReceiptService.getHistoryItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadHistoryItems$).toBeObservable(expected$);
    });

    it('should fail and return an empty 0 count', () => {
      const action = new LoadSelectedHistoryItems(payload);
      const outcome = new LoadSelectedHistoryItemsSuccess({
        items: [],
        count: 0
      });
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: { items: [], count: 0 }
      });
      otherReceiptService.getHistoryItems.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadHistoryItems$).toBeObservable(expected$);
    });
  });

  describe('loadItemsCount', () => {
    const payload: LoadOtherReceiptsHistoryItemsPayload = {
      id: 111,
      page: 0,
      size: 8,
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
    it('should return loadItemsCount data', () => {
      const action = new LoadSelectedHistoryItemsTotalCount(payload);
      const outcome = new LoadSelectedHistoryItemsTotalCountSuccess(2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: 2
      });
      otherReceiptService.getHistoryItemsTotalCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadItemsCount$).toBeObservable(expected$);
    });

    it('should fail and return  0 count', () => {
      const action = new LoadSelectedHistoryItemsTotalCount(payload);
      const outcome = new LoadSelectedHistoryItemsTotalCountSuccess(0);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: 0
      });
      otherReceiptService.getHistoryItemsTotalCount.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadItemsCount$).toBeObservable(expected$);
    });
  });
});
