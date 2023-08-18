import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import * as moment from 'moment';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StockReceiveEffect } from './stock-receive.effect';
import { initialState } from './stock-receive.reducer';
import {
  BinCode,
  ProductGroup,
  ProductCategory,
  Lov,
  StockReceiveStock,
  StockReceiveLoadPendingPayload,
  StockReceiveSearchPendingPayload,
  StockReceiveLoadItemsTotalCountPayload,
  StockReceiveLoadItemsTotalCountSuccessResponse,
  StockReceiveLoadItemsPayload,
  StockReceiveItem,
  StockReceiveHistoryItemsPayload,
  StockReceiveHistoryPayload,
  StockReceiveUpdateItemPayload,
  StockReceiveUpdateAllItemsPayload,
  StockReceiveConfirmStockReceivePayload,
  StockReceiveItemValidate,
  CustomErrors,
  StockReceiveTotalMeasuredWeightPayload,
  StockReceiveAPITypesEnum
} from '@poss-web/shared/models';
import { StockReceiveService } from '../stock-receive.service';
import { DataPersistence } from '@nrwl/angular';
import * as StockReceiveActions from './stock-receive.actions';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ProductCategoryDataService,
  BinDataService,
  ProductGroupDataService,
  LovDataService,
} from '@poss-web/shared/masters/data-access-masters';
import { CommonService, InventoryValidationService } from '@poss-web/shared/common/data-access-common';
import { stockReceiveFeatureKey } from './stock-receive.state';
import { HttpErrorResponse } from '@angular/common/http';

const stockData1: StockReceiveStock = {
  id: 111,
  srcDocNo: 111,
  srcLocationCode: 'TestLocation',
  type: 'courier',
  courierDetails: {
    type: 'TEST',
    data: {
      companyName: 'Test',
      docketNumber: 'Test',
      lockNumber: 'Test',
      roadPermitNumber: 'Test',
      employeeId: 'Test',
      employeeMobileNumber: 'Test',
      employeeName: 'Test'
    }
  },
  orderType: 'R',
  courierReceivedDate: moment(),
  totalAvailableValue: 10,
  totalAvailableWeight: 10,
  totalAvailableQuantity: 10,
  totalMeasuredQuantity: 10,
  totalMeasuredValue: 10,
  totalMeasuredWeight: 10,
  srcDocDate: moment(),
  currencyCode: 'INR',
  weightUnit: 'gms',
  status: 'issued',
  srcFiscalYear: 2020,
  destDocDate: moment(),
  destDocNo: 111,
  destLocationCode: 'TestCode',
  srcLocationDescription: 'Description',
  destLocationDescription: 'Description'
};

const stockData2: StockReceiveStock = {
  id: 112,
  srcDocNo: 112,
  srcLocationCode: 'TestLocation',
  type: 'courier',
  courierDetails: {
    type: 'TEST',
    data: {
      companyName: 'Test',
      docketNumber: 'Test',
      lockNumber: 'Test',
      roadPermitNumber: 'Test',
      employeeId: 'Test',
      employeeMobileNumber: 'Test',
      employeeName: 'Test'
    }
  },
  orderType: 'R',
  courierReceivedDate: moment(),
  totalAvailableValue: 10,
  totalAvailableWeight: 10,
  totalAvailableQuantity: 10,
  totalMeasuredQuantity: 10,
  totalMeasuredValue: 10,
  totalMeasuredWeight: 10,
  srcDocDate: moment(),
  currencyCode: 'INR',
  weightUnit: 'gms',
  status: 'issued',
  srcFiscalYear: 2020,
  destDocDate: moment(),
  destDocNo: 111,
  destLocationCode: 'TestCode',
  srcLocationDescription: 'Description',
  destLocationDescription: 'Description'
};

const itemData1: StockReceiveItem = {
  id: '23SW22',
  binCode: 'TestBinCode',
  itemCode: '1233NXB992',
  itemDetails: {},
  stdValue: 10,
  stdWeight: 10,
  lotNumber: '121212',
  mfgDate: moment(),
  status: 'issued',
  availableValue: 10,
  availableWeight: 10,
  currencyCode: 'INR',
  weightUnit: 'gms',
  imageURL: 'http://test.com',
  measuredQuantity: 10,
  measuredWeight: 10,
  binGroupCode: 'TestBinGroupCode',
  availableQuantity: 10,
  orderType: 'P',
  productCategory: 'TestProductCategory',
  productGroup: 'TestProductGroup',
  productCategoryDesc: 'TestProductCategoryDesc',
  productGroupDesc: 'TestProductGroupDesc',
  remarks: 'TestRemarks',
  isUpdating: false,
  isUpdatingSuccess: null,
  isValidating: false,
  isValidatingSuccess: null,
  isValidatingError: false,
  isStudded: true,
  thumbnailImageURL: 'dummy',
  isLoadingImage: true,
  isLoadingThumbnailImage: true
};

const itemData2: StockReceiveItem = {
  id: '23SW23',
  binCode: 'TestBinCode',
  itemCode: '1233NXB992',
  itemDetails: {},
  stdValue: 10,
  stdWeight: 10,
  lotNumber: '121212',
  mfgDate: moment(),
  status: 'issued',
  availableValue: 10,
  availableWeight: 10,
  currencyCode: 'INR',
  weightUnit: 'gms',
  imageURL: 'http://test.com',
  measuredQuantity: 10,
  measuredWeight: 10,
  binGroupCode: 'TestBinGroupCode',
  availableQuantity: 10,
  orderType: 'P',
  productCategory: 'TestProductCategory',
  productGroup: 'TestProductGroup',
  productCategoryDesc: 'TestProductCategoryDesc',
  productGroupDesc: 'TestProductGroupDesc',
  remarks: 'TestRemarks',
  isUpdating: false,
  isUpdatingSuccess: null,
  isValidating: false,
  isValidatingSuccess: null,
  isValidatingError: false,
  isStudded: true,
  thumbnailImageURL: 'dummy',
  isLoadingImage: true,
  isLoadingThumbnailImage: true
};

describe('Stock Receive Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: StockReceiveEffect;

  const stockReceiveServiceSpy = jasmine.createSpyObj<StockReceiveService>([
    'getStocks',
    'getInvoices',
    'searchStocks',
    'searchInovices',
    'getStock',
    'getInvoice',
    'getItemsCount',
    'getItems',
    'getHistoryItems',
    'getStockReceiveHistory',
    'getStockReceiveInvoiceHistory',
    'verifyItem',
    'updateAllItems',
    'confirmStn',
    'fetchInvoiceFromOracle',
    'fetchSTNFromOracle'
  ]);

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
    'getThumbnailImageUrl',
    'getImageUrl'
  ]);

  const inventoryValidationServiceSpy = jasmine.createSpyObj<
    InventoryValidationService
  >(['validateWeightTolerance']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StockReceiveEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [stockReceiveFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: StockReceiveService,
          useValue: stockReceiveServiceSpy
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
          provide: LovDataService,
          useValue: lovDataServiceSpy
        },
        {
          provide: BinDataService,
          useValue: binDataServiceSpy
        },

        {
          provide: InventoryValidationService,
          useValue: inventoryValidationServiceSpy
        },
        {
          provide: CommonService,
          useValue: commonServiceSpy
        }
      ]
    });

    effect = TestBed.inject(StockReceiveEffect);
  });

  describe('LoadBins', () => {
    it('should return a stream with bins', () => {
      const serviceReponse: BinCode[] = [
        {
          binCode: 'Test 1',
          description: 'Test 1'
        },
        {
          binCode: 'Test 2',
          description: 'Test 2'
        }
      ];

      const parameter = 'STN';

      const action = new StockReceiveActions.LoadBinCodes(parameter);
      const outcome = new StockReceiveActions.LoadBinCodesSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binDataServiceSpy.getBinDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadBins$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = 'STN';

      const action = new StockReceiveActions.LoadBinCodes(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadBinCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binDataServiceSpy.getBinDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBins$).toBeObservable(expected);
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

      const action = new StockReceiveActions.LoadStuddedProductGroups();
      const outcome = new StockReceiveActions.LoadStuddedProductGroupsSuccess(
        codes
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadStuddedProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new StockReceiveActions.LoadStuddedProductGroups();
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadStuddedProductGroupsFailure(
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

      const action = new StockReceiveActions.LoadProductGroups();
      const outcome = new StockReceiveActions.LoadProductGroupsSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new StockReceiveActions.LoadProductGroups();
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadProductGroupsFailure(
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

      const action = new StockReceiveActions.LoadProductCategories();
      const outcome = new StockReceiveActions.LoadProductCategoriesSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadProductCategories$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new StockReceiveActions.LoadProductCategories();
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadProductCategoriesFailure(
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

  describe('loadRemarks', () => {
    it('should return a stream with Remarks', () => {
      const serviceReponse: Lov[] = [
        {
          code: 'Test 1',
          value: 'Test 1',
          isActive: true
        },
        {
          code: 'Test 2',
          value: 'Test 2',
          isActive: true
        }
      ];

      const action = new StockReceiveActions.LoadRemarks();
      const outcome = new StockReceiveActions.LoadRemarksSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      lovDataServiceSpy.getInventoryLovs.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadRemarks$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new StockReceiveActions.LoadRemarks();
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadRemarksFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      lovDataServiceSpy.getInventoryLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRemarks$).toBeObservable(expected);
    });
  });

  describe('loadPendingFactorySTN', () => {
    it('should return a stream with Factory STN List', () => {
      const serviceReponse: StockReceiveStock[] = [stockData1, stockData2];

      const parameter: StockReceiveLoadPendingPayload = {
        pageIndex: 10,
        pageSize: 20
      };

      const action = new StockReceiveActions.LoadPendingFactorySTN(parameter);
      const outcome = new StockReceiveActions.LoadPendingFactorySTNSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getStocks.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadPendingFactorySTN$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveLoadPendingPayload = {
        pageIndex: 10,
        pageSize: 20
      };
      const action = new StockReceiveActions.LoadPendingFactorySTN(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadPendingFactorySTNFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getStocks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingFactorySTN$).toBeObservable(expected);
    });
  });

  describe('LoadPendingBoutiqueSTN', () => {
    it('should return a stream with Boutique STN List', () => {
      const serviceReponse: StockReceiveStock[] = [stockData1, stockData2];

      const parameter: StockReceiveLoadPendingPayload = {
        pageIndex: 10,
        pageSize: 20
      };

      const action = new StockReceiveActions.LoadPendingBoutiqueSTN(parameter);
      const outcome = new StockReceiveActions.LoadPendingBoutiqueSTNSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getStocks.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadPendingBoutiqueSTN$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveLoadPendingPayload = {
        pageIndex: 10,
        pageSize: 20
      };
      const action = new StockReceiveActions.LoadPendingBoutiqueSTN(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadPendingBoutiqueSTNFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getStocks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingBoutiqueSTN$).toBeObservable(expected);
    });
  });

  describe('LoadPendingMerchandiseSTN', () => {
    it('should return a stream with Merchandise STN List', () => {
      const serviceReponse: StockReceiveStock[] = [stockData1, stockData2];

      const parameter: StockReceiveLoadPendingPayload = {
        pageIndex: 10,
        pageSize: 20
      };

      const action = new StockReceiveActions.LoadPendingMerchandiseSTN(
        parameter
      );
      const outcome = new StockReceiveActions.LoadPendingMerchandiseSTNSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getStocks.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadPendingMerchandiseSTN$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveLoadPendingPayload = {
        pageIndex: 10,
        pageSize: 20
      };
      const action = new StockReceiveActions.LoadPendingMerchandiseSTN(
        parameter
      );
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadPendingMerchandiseSTNFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getStocks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingMerchandiseSTN$).toBeObservable(expected);
    });
  });

  describe('LoadPendingCFAInvoice', () => {
    it('should return a stream with CFA Invoice List', () => {
      const serviceReponse: StockReceiveStock[] = [stockData1, stockData2];

      const parameter: StockReceiveLoadPendingPayload = {
        pageIndex: 10,
        pageSize: 20
      };

      const action = new StockReceiveActions.LoadPendingCFAInvoice(parameter);
      const outcome = new StockReceiveActions.LoadPendingCFAInvoiceSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getInvoices.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadPendingCFSInvoice$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveLoadPendingPayload = {
        pageIndex: 10,
        pageSize: 20
      };
      const action = new StockReceiveActions.LoadPendingCFAInvoice(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadPendingCFAInvoiceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getInvoices.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPendingCFSInvoice$).toBeObservable(expected);
    });
  });

  describe('SearchPendingStocks', () => {
    it('should return a stream with Searched stocks', () => {
      const serviceReponse: StockReceiveStock[] = [stockData1, stockData2];

      const parameter: StockReceiveSearchPendingPayload = {
        srcDocnumber: '123',
        type: 'FAC_BTQ'
      };

      const action = new StockReceiveActions.SearchPendingStocks(parameter);
      const outcome = new StockReceiveActions.SearchPendingStocksSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.searchStocks.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.searchPendingStocks$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveSearchPendingPayload = {
        srcDocnumber: '123',
        type: 'FAC_BTQ'
      };

      const action = new StockReceiveActions.SearchPendingStocks(parameter);
      const outcome = new StockReceiveActions.SearchPendingStocksSuccess([]);
      const error = new Error('some error');

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);

      stockReceiveServiceSpy.searchStocks.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchPendingStocks$).toBeObservable(expected);
    });
  });

  describe('SearchPendingInvoices', () => {
    it('should return a stream with searched invoices', () => {
      const serviceReponse: StockReceiveStock[] = [stockData1, stockData2];

      const parameter: StockReceiveSearchPendingPayload = {
        srcDocnumber: '123',
        type: 'FAC_BTQ'
      };

      const action = new StockReceiveActions.SearchPendingInvoices(parameter);
      const outcome = new StockReceiveActions.SearchPendingInvoicesSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.searchInovices.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.searchPendingInvoices$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveSearchPendingPayload = {
        srcDocnumber: '123',
        type: 'FAC_BTQ'
      };

      const action = new StockReceiveActions.SearchPendingInvoices(parameter);
      const outcome = new StockReceiveActions.SearchPendingInvoicesSuccess([]);
      const error = new Error('some error');

      actions$ = hot('-a', { a: action });

      const response$ = cold('-#', {}, error);

      stockReceiveServiceSpy.searchInovices.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchPendingInvoices$).toBeObservable(expected);
    });
  });

  describe('LoadSeletedStock', () => {
    it('should return a stream with selected stock', () => {
      const serviceReponse: StockReceiveStock = stockData1;

      const parameter = {
        id: 'TESTID',
        type: 'FAC_BTQ'
      };

      const action = new StockReceiveActions.LoadSelectedStock(parameter);
      const outcome = new StockReceiveActions.LoadSelectedStockSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getStock.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadSeletedStock$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = {
        id: 'TESTID',
        type: 'FAC_BTQ'
      };
      const action = new StockReceiveActions.LoadSelectedStock(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadSelectedStockFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getStock.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSeletedStock$).toBeObservable(expected);
    });
  });

  describe('LoadSelectedInvoice', () => {
    it('should return a stream with selected invoice', () => {
      const serviceReponse: StockReceiveStock = stockData1;

      const parameter = {
        id: 'TESTID',
        type: 'CFA_BTQ'
      };

      const action = new StockReceiveActions.LoadSelectedInvoice(parameter);
      const outcome = new StockReceiveActions.LoadSelectedInvoiceSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getInvoice.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadSeletedInvoice$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = {
        id: 'TESTID',
        type: 'CFA_BTQ'
      };
      const action = new StockReceiveActions.LoadSelectedInvoice(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadSelectedInvoiceFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getInvoice.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSeletedInvoice$).toBeObservable(expected);
    });
  });

  describe('LoadItemsTotalCount', () => {
    it('should return a stream with selected stocks item total count', () => {
      const serviceReponse: StockReceiveLoadItemsTotalCountSuccessResponse = {
        nonVerifiedItemsTotalCount: 10,
        verifiedItemsTotalCount: 13
      };

      const parameter: StockReceiveLoadItemsTotalCountPayload = {
        id: 12,
        type: 'CFA_BTQ',
        storeType: 'L1'
      };

      const action = new StockReceiveActions.LoadItemsTotalCount(parameter);
      const outcome = new StockReceiveActions.LoadItemsTotalCountSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getItemsCount.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadItemsTotalCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveLoadItemsTotalCountPayload = {
        id: 12,
        type: 'CFA_BTQ',
        storeType: 'L1'
      };
      const action = new StockReceiveActions.LoadItemsTotalCount(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadItemsTotalCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getItemsCount.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadItemsTotalCount$).toBeObservable(expected);
    });
  });

  describe('LoadItems', () => {
    it('should return a stream with selected stocks items', () => {
      const serviceReponse: {
        items: StockReceiveItem[];
        count: number;
        status: string;
      } = {
        items: [itemData1, itemData2],
        count: 2,
        status: 'OPEN'
      };

      const parameter: StockReceiveLoadItemsPayload = {
        storeType: 'L1',
        type: 'FAC_BTQ',
        id: 123,
        status: 'OPEN',
        itemCode: 'TEST_ITEM_CODE',
        lotNumber: 'TEST_LOT_NUM',
        pageIndex: 10,
        pageSize: 20,
        sortBy: 'weight',
        sortOrder: 'ASC',
        filter: []
      };

      const action = new StockReceiveActions.LoadItems(parameter);
      const outcome = new StockReceiveActions.LoadItemsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getItems.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveLoadItemsPayload = {
        storeType: 'L1',
        type: 'FAC_BTQ',
        id: 123,
        status: 'OPEN',
        itemCode: 'TEST_ITEM_CODE',
        lotNumber: 'TEST_LOT_NUM',
        pageIndex: 10,
        pageSize: 20,
        sortBy: 'weight',
        sortOrder: 'ASC',
        filter: []
      };
      const action = new StockReceiveActions.LoadItems(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadItemsSuccess({
        items: [],
        count: 0,
        status: parameter.status
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadItems$).toBeObservable(expected);
    });
  });

  describe('LoadStockReceiveHistoryItems', () => {
    it('should return a stream with selected history items', () => {
      const serviceReponse: {
        items: StockReceiveItem[];
        count: number;
        status: string;
      } = {
        items: [itemData1, itemData2],
        count: 2,
        status: 'OPEN'
      };

      const parameter: StockReceiveHistoryItemsPayload = {
        StockReceiveHistoryItem: {
          binCodes: 'BIN_CODE',
          binGroupCode: 'BIN_GROUP',
          itemCode: 'ITEM_CODE',
          lotNumber: 'LOT_NUMBER',
          productCategories: [],
          productGroups: [],
          statuses: null
        },
        pageIndex: 10,
        pageSize: 50,
        id: 'ID',
        isL1L2Store: true,
        isL3Store: false,
        sort: [],
        sortOrder: 'ASC',
        historyAPIType: 'FAC_BTQ'
      };

      const action = new StockReceiveActions.LoadStockReceiveHistoryItems(
        parameter
      );
      const outcome = new StockReceiveActions.LoadStockReceiveHistoryItemsSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getHistoryItems.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadHistoryItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveHistoryItemsPayload = {
        StockReceiveHistoryItem: {
          binCodes: 'BIN_CODE',
          binGroupCode: 'BIN_GROUP',
          itemCode: 'ITEM_CODE',
          lotNumber: 'LOT_NUMBER',
          productCategories: [],
          productGroups: [],
          statuses: null
        },
        pageIndex: 10,
        pageSize: 50,
        id: 'ID',
        isL1L2Store: true,
        isL3Store: false,
        sort: [],
        sortOrder: 'ASC',
        historyAPIType: 'FAC_BTQ'
      };
      const action = new StockReceiveActions.LoadStockReceiveHistoryItems(
        parameter
      );
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadStockReceiveHistoryItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getHistoryItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadHistoryItems$).toBeObservable(expected);
    });
  });

  describe('LoadStockReceiveHistory', () => {
    it('should return a stream with selected stock history', () => {
      const serviceReponse: {
        stocks: StockReceiveStock[];
        count: number;
      } = {
        stocks: [stockData1, stockData2],
        count: 2
      };

      const parameter: StockReceiveHistoryPayload = {
        data: null,
        transferType: 'FAC_BTQ',
        pageIndex: 10,
        pageSize: 50
      };

      const action = new StockReceiveActions.LoadStockReceiveHistory(parameter);
      const outcome = new StockReceiveActions.LoadStockReceiveHistorySuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getStockReceiveHistory.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadStockReceiveHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveHistoryPayload = {
        data: null,
        transferType: 'FAC_BTQ',
        pageIndex: 10,
        pageSize: 50
      };
      const action = new StockReceiveActions.LoadStockReceiveHistory(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadStockReceiveHistorySuccess({
        stocks: [],
        count: 0
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getStockReceiveHistory.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStockReceiveHistory$).toBeObservable(expected);
    });
  });

  describe('LoadStockReceiveInvoiceHistory', () => {
    it('should return a stream with selected invoice history', () => {
      const serviceReponse: {
        stocks: StockReceiveStock[];
        count: number;
      } = {
        stocks: [stockData1, stockData2],
        count: 2
      };

      const parameter: StockReceiveHistoryPayload = {
        data: null,
        transferType: 'FAC_BTQ',
        pageIndex: 10,
        pageSize: 50
      };

      const action = new StockReceiveActions.LoadStockReceiveInvoiceHistory(
        parameter
      );
      const outcome = new StockReceiveActions.LoadStockReceiveInvoiceHistorySuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.getStockReceiveInvoiceHistory.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadStockReceiveInvoiceHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveHistoryPayload = {
        data: null,
        transferType: 'FAC_BTQ',
        pageIndex: 10,
        pageSize: 50
      };
      const action = new StockReceiveActions.LoadStockReceiveInvoiceHistory(
        parameter
      );
      const error = new Error('some error');
      const outcome = new StockReceiveActions.LoadStockReceiveInvoiceHistorySuccess(
        {
          stocks: [],
          count: 0
        }
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.getStockReceiveInvoiceHistory.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStockReceiveInvoiceHistory$).toBeObservable(expected);
    });
  });

  describe('VerifyItem', () => {
    it('should return a stream with verified item', () => {
      const serviceReponse = itemData1;

      const parameter: StockReceiveUpdateItemPayload = {
        type: 'P',
        storeType: 'L3',
        id: 1,
        itemId: '1',
        newUpdate: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        actualDetails: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        loadItemsPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1,
          status: 'received',
          itemCode: 'STK',
          lotNumber: '1',
          pageIndex: 1,
          pageSize: 100,
          sortBy: 'LTH',
          sortOrder: 'HTL',
          filter: [{ key: '', value: [] }],
          isSearchReset: false,
          isHistory: false,
          historyType: 'history'
        },
        loadTemsCountPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1
        },
      };
      const measureWeightPayload: StockReceiveTotalMeasuredWeightPayload = {
        storeType: 'L3',
        type: 'P',
        id: 1
      };
      const action = new StockReceiveActions.VerifyItem(parameter);
      const outcome1 = new StockReceiveActions.VerifyItemSuccess(
        serviceReponse
      );
      const outcome2 = new StockReceiveActions.GetTotalMeasuredWeight(
        measureWeightPayload
      );
      const outcome3 = new StockReceiveActions.LoadItems(
        parameter.loadItemsPayload
      );
      const outcome4 = new StockReceiveActions.LoadItemsTotalCount(
        parameter.loadTemsCountPayload
      );

      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.verifyItem.and.returnValue(response$);

      const expected$ = cold('--(abcd)', {
        a: outcome1,
        b: outcome2,
        c: outcome3,
        d: outcome4
      });

      expect(effect.verifyItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveUpdateItemPayload = {
        type: 'P',
        storeType: 'L3',
        id: 1,
        itemId: '1',
        newUpdate: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        actualDetails: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        loadItemsPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1,
          status: 'received',
          itemCode: 'STK',
          lotNumber: '1',
          pageIndex: 1,
          pageSize: 100,
          sortBy: 'LTH',
          sortOrder: 'HTL',
          filter: [{ key: '', value: [] }],
          isSearchReset: false,
          isHistory: false,
          historyType: 'history'
        },
        loadTemsCountPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1
        }
      };

      const action = new StockReceiveActions.VerifyItem(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.VerifyItemFailure({
        itemId: parameter.itemId,
        actualDetails: parameter.actualDetails,
        error: CustomErrorAdaptor.fromJson(error)
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.verifyItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.verifyItem$).toBeObservable(expected);
    });
  });

  describe('UpdateItem', () => {
    it('should return a stream with updated item', () => {
      const serviceReponse = itemData1;

      const parameter: StockReceiveUpdateItemPayload = {
        type: 'P',
        storeType: 'L3',
        id: 1,
        itemId: '1',
        newUpdate: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        actualDetails: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        loadItemsPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1,
          status: 'received',
          itemCode: 'STK',
          lotNumber: '1',
          pageIndex: 1,
          pageSize: 100,
          sortBy: 'LTH',
          sortOrder: 'HTL',
          filter: [{ key: '', value: [] }],
          isSearchReset: false,
          isHistory: false,
          historyType: 'history'
        },
        loadTemsCountPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1
        }
      };

      const measureWeightPayload: StockReceiveTotalMeasuredWeightPayload = {
        storeType: 'L3',
        type: 'P',
        id: 1
      };

      const action = new StockReceiveActions.UpdateItem(parameter);
      const outcome = new StockReceiveActions.UpdateItemSuccess(serviceReponse);
      const outcome2 = new StockReceiveActions.GetTotalMeasuredWeight(measureWeightPayload);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.verifyItem.and.returnValue(response$);

      const expected$ = cold('--(cd)', { c: outcome, d: outcome2});

      expect(effect.updateItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveUpdateItemPayload = {
        type: 'P',
        storeType: 'L3',
        id: 1,
        itemId: '1',
        newUpdate: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        actualDetails: {
          binCode: '',
          binGroupCode: '',
          measuredWeight: 1,
          remarks: '',
          itemDetails: ''
        },
        loadItemsPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1,
          status: 'received',
          itemCode: 'STK',
          lotNumber: '1',
          pageIndex: 1,
          pageSize: 100,
          sortBy: 'LTH',
          sortOrder: 'HTL',
          filter: [{ key: '', value: [] }],
          isSearchReset: false,
          isHistory: false,
          historyType: 'history'
        },
        loadTemsCountPayload: {
          storeType: 'L2',
          type: 'R',
          id: 1
        }
      };

      const action = new StockReceiveActions.UpdateItem(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.UpdateItemFailure({
        itemId: parameter.itemId,
        actualDetails: parameter.actualDetails,
        error: CustomErrorAdaptor.fromJson(error)
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.verifyItem.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateItem$).toBeObservable(expected);
    });
  });

  describe('VerifyAllItems', () => {
    it('should return a stream with all verifed items', () => {
      const serviceReponse = true;

      const parameter: StockReceiveUpdateAllItemsPayload = {
        type: 'R',
        storeType: 'L3',
        id: 1,
        data: {
          binCode: 'B',
          id: ['1', '2', '3'],
          status: 'received'
        }
      };

      const measureWeightPayload: StockReceiveTotalMeasuredWeightPayload = {
        storeType: 'L3',
        type: 'R',
        id: 1
      };

      const action = new StockReceiveActions.VerifyAllItems(parameter);
      const outcome = new StockReceiveActions.VerifyAllItemsSuccess(
        serviceReponse
      );
      const outcome2 = new StockReceiveActions.GetTotalMeasuredWeight(measureWeightPayload);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.updateAllItems.and.returnValue(response$);

      const expected$ = cold('--(cd)', { c: outcome, d: outcome2});

      expect(effect.verifyAllItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveUpdateAllItemsPayload = {
        type: 'R',
        storeType: 'L3',
        id: 1,
        data: {
          binCode: 'B',
          id: ['1', '2', '3'],
          status: 'received'
        }
      };

      const action = new StockReceiveActions.VerifyAllItems(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.VerifyAllItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.updateAllItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.verifyAllItems$).toBeObservable(expected);
    });
  });
  describe('AssignBinToAllItems', () => {
    it('should return a stream with all Updated items', () => {
      const serviceReponse = true;

      const parameter: StockReceiveUpdateAllItemsPayload = {
        type: 'R',
        storeType: 'L3',
        id: 1,
        data: {
          binCode: 'B',
          id: ['1', '2', '3'],
          status: 'received'
        }
      };

      const action = new StockReceiveActions.AssignBinToAllItems(parameter);
      const outcome = new StockReceiveActions.AssignBinToAllItemsSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.updateAllItems.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.assignBinToAllItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveUpdateAllItemsPayload = {
        type: 'R',
        storeType: 'L3',
        id: 1,
        data: {
          binCode: 'B',
          id: ['1', '2', '3'],
          status: 'received'
        }
      };

      const action = new StockReceiveActions.AssignBinToAllItems(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.AssignBinToAllItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.updateAllItems.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.assignBinToAllItems$).toBeObservable(expected);
    });
  });

  describe('ConfirmStockReceive', () => {
    it('should return a stream with Confirmed Stock', () => {
      const serviceReponse = {
        docNumber: 123
      };

      const parameter: StockReceiveConfirmStockReceivePayload = {
        type: 'P',
        storeType: 'L2',
        id: 1,
        confirmReceive: {
          courierReceivedDate: '12-12-2020',
          reasonForDelay: 'Test',
          receivedDate: '12-12-2020',
          remarks: 'Test'
        }
      };

      const action = new StockReceiveActions.ConfirmStockReceive(parameter);
      const outcome = new StockReceiveActions.ConfirmStockReceiveSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.confirmStn.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.confirmStock$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: StockReceiveConfirmStockReceivePayload = {
        type: 'P',
        storeType: 'L2',
        id: 1,
        confirmReceive: {
          courierReceivedDate: '12-12-2020',
          reasonForDelay: 'Test',
          receivedDate: '12-12-2020',
          remarks: 'Test'
        }
      };
      const action = new StockReceiveActions.ConfirmStockReceive(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.ConfirmStockReceiveFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.confirmStn.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.confirmStock$).toBeObservable(expected);
    });
  });

  describe('ValidateItem', () => {
    it('should return a stream with validated item', () => {
      const parameter: StockReceiveItemValidate = {
        itemId: 'TEST_ID',
        productGroupCode: '',
        availableWeight: 1,
        measuredWeight: 1,
        measuredQuantity: 1,
        availableQuantity: 1
      };
      const serviceReponse = { itemId: parameter.itemId, isSuccess: true };

      const action = new StockReceiveActions.ValidateItem(parameter);
      const outcome = new StockReceiveActions.ValidateItemSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      inventoryValidationServiceSpy.validateWeightTolerance.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.validateItem$).toBeObservable(expected$);
    });

    it('should fail and return an action with isSuccess flag as false', () => {
      const parameter: StockReceiveItemValidate = {
        itemId: 'TEST_ID',
        productGroupCode: '',
        availableWeight: 1,
        measuredWeight: 1,
        measuredQuantity: 1,
        availableQuantity: 1
      };

      const action = new StockReceiveActions.ValidateItem(parameter);
      const error = new HttpErrorResponse({ error: { code: 'ERR-INV-028' } });

      const outcome = new StockReceiveActions.ValidateItemSuccess({
        itemId: parameter.itemId,
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
      const parameter: StockReceiveItemValidate = {
        itemId: 'TEST_ID',
        productGroupCode: '',
        availableWeight: 1,
        measuredWeight: 1,
        measuredQuantity: 1,
        availableQuantity: 1
      };

      const action = new StockReceiveActions.ValidateItem(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.ValidateItemFailure({
        itemId: parameter.itemId,
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

  describe('fetchSTNFromOracle', () => {
    it('should return a stream with Factory STN List from Oracle', () => {
      const serviceReponse: StockReceiveStock[] = [stockData1, stockData2];

      const parameter = {
        stn: 10,
        type: StockReceiveAPITypesEnum.FAC_BTQ
      };

      const action = new StockReceiveActions.FetchSTNFromOracle(parameter);
      const outcome = new StockReceiveActions.FetchSTNFromOracleSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.fetchSTNFromOracle.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.fetchSTNFromOracle$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = {
        stn: 10,
        type: StockReceiveAPITypesEnum.FAC_BTQ
      };
      const action = new StockReceiveActions.FetchSTNFromOracle(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.FetchSTNFromOracleFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.fetchSTNFromOracle.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.fetchSTNFromOracle$).toBeObservable(expected);
    });
  });

  describe('fetchInvoiceFromOracle', () => {
    it('should return a stream with Invoice List from Oracle', () => {
      const serviceReponse: StockReceiveStock[] = [stockData1, stockData2];

      const parameter = {
        invoiceNo: 10,
        type: StockReceiveAPITypesEnum.FAC_BTQ
      };

      const action = new StockReceiveActions.FetchInvoiceFromOracle(parameter);
      const outcome = new StockReceiveActions.FetchInvoiceFromOracleSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      stockReceiveServiceSpy.fetchInvoiceFromOracle.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.fetchInvoiceFromOracle$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = {
        invoiceNo: 10,
        type: StockReceiveAPITypesEnum.FAC_BTQ
      };
      const action = new StockReceiveActions.FetchInvoiceFromOracle(parameter);
      const error = new Error('some error');
      const outcome = new StockReceiveActions.FetchInvoiceFromOracleFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      stockReceiveServiceSpy.fetchInvoiceFromOracle.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.fetchInvoiceFromOracle$).toBeObservable(expected);
    });
  });
});
