import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import * as moment from 'moment';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { BinToBinTransferEffect } from './bin-to-bin-transfer.effect';
import { initialState } from './bin-to-bin-transfer.reducer';
import {
  SearchItemsSuccess,
  LoadSourceBins,
  LoadSourceBinsSuccess,
  LoadSourceBinsFailure,
  LoadStuddedProductGroups,
  LoadStuddedProductGroupsSuccess,
  LoadStuddedProductGroupsFailure,
  LoadProductsGroups,
  LoadProductsGroupsFailure,
  LoadProductsGroupsSuccess,
  LoadProductsCategoryFailure,
  LoadProductsCategory,
  LoadProductsCategorySuccess,
  LoadItemGroup,
  LoadItemGroupFailure,
  LoadItemGroupSuccess,
  SearchItemGroupsSuccess,
  SearchItemGroups,
  LoadItemsSuccess,
  LoadItems,
  LoadItemsFailure,
  SearchItemsFailure,
  SearchItems,
  LoadBins,
  LoadBinsSuccess,
  LoadBinsFailure,
  LoadProductGroupOptionsFailure,
  LoadProductGroupOptions,
  LoadProductGroupOptionsSuccess,
  LoadProductCategoryOptions,
  LoadProductCategoryOptionsSuccess,
  LoadProductCategoryOptionsFailure,
  LoadSourceBinOptions,
  LoadSourceBinOptionsSuccess,
  LoadSourceBinOptionsFailure,
  LoadHistoryItems,
  LoadHistoryItemsFailure,
  LoadHistoryItemsSuccess,
  ConfirmTransferItems,
  ConfirmTransferItemsSuccess,
  ConfirmTransferItemsFailure,
  ConfirmTransferAllItems,
  ConfirmTransferAllItemsSuccess,
  ConfirmTransferAllItemsFailure,
  LoadBinToBinHistory,
  LoadBinToBinHistorySuccess,
  LoadBinToBinHistoryFailure,
  LoadSelectedHistorySuccess,
  LoadSelectedHistoryFailure,
  LoadSelectedHistory
} from './bin-to-bin-transfer-actions';
import {
  BinToBinTransferLoadItemGroupsPayload,
  BinToBinTransferLoadItemListGroupResponse,
  ProductGroup,
  BinToBinTransferLoadItemsPayload,
  BinToBinTransferLoadItemsResponse,
  StoreBin,
  ProductCategory,
  BinToBinTransferLoadHistoryItemsPayload,
  BinToBinTransferConfirmTransferItemsRequest,
  BinToBinTransferConfirmTransferAllItemsRequest,
  LoadBinToBinTransferHistoryPayload
} from '@poss-web/shared/models';
import { BinToBinTransferService } from '../bin-to-bin-transfer.service';
import { DataPersistence } from '@nrwl/angular';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  StoreConfigDataService,
  ProductGroupDataService,
  ProductCategoryDataService
} from '@poss-web/shared/masters/data-access-masters';
import { binToBinTransferFeatureKey } from './bin-to-bin-transfer.state';
import { CommonService } from '@poss-web/shared/common/data-access-common';

describe('Bin to Bin transfer Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: BinToBinTransferEffect;

  const binToBinTransferServiceSpy = jasmine.createSpyObj<
    BinToBinTransferService
  >([
    'getItemListGroups',
    'getItems',
    'searchItems',
    'getHistoryItems',
    'confirmTransferItems',
    'confirmTransferAllItems',
    'getHistory',
    'getSelectedHistory'
  ]);

  const storeConfigDataServiceSpy = jasmine.createSpyObj<
    StoreConfigDataService
  >(['getStoreBins']);

  const commonServiceSpy = jasmine.createSpyObj<
  CommonService
  >(['getThumbnailImageUrl', 'getImageUrl']);

  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);

  const productCategoryDataServiceSpy = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategories']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BinToBinTransferEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [binToBinTransferFeatureKey]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: BinToBinTransferService,
          useValue: binToBinTransferServiceSpy
        },
        {
          provide: CommonService,
          useValue: commonServiceSpy
        },
        {
          provide: StoreConfigDataService,
          useValue: storeConfigDataServiceSpy
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

    effect = TestBed.inject(BinToBinTransferEffect);
  });

  describe('LoadSourceBins', () => {
    it('should return a stream with Source bins', () => {
      const serviceReponse: BinToBinTransferLoadItemListGroupResponse = {
        count: 10,
        itemListGroups: [
          {
            id: '11',
            name: '71',
            products: 16,
            totalValue: 826133.1,
            totalWeight: 269.728,
            currencyCode: 'INR',
            weightUnit: 'gms',
            description: 'Gold Plain'
          }
        ]
      };
      const parameters: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadSourceBins(parameters);
      const outcome = new LoadSourceBinsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadSourceBins$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadSourceBins(parameters);
      const error = new Error('some error');
      const outcome = new LoadSourceBinsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSourceBins$).toBeObservable(expected);
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

  describe('LoadProductsGroups', () => {
    it('should return a stream with product groups', () => {
      const serviceReponse: BinToBinTransferLoadItemListGroupResponse = {
        count: 10,
        itemListGroups: [
          {
            id: '11',
            name: '71',
            products: 16,
            totalValue: 826133.1,
            totalWeight: 269.728,
            currencyCode: 'INR',
            weightUnit: 'gms',
            description: 'Gold Plain'
          }
        ]
      };
      const parameters: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadProductsGroups(parameters);
      const outcome = new LoadProductsGroupsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadProductsGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadProductsGroups(parameters);
      const error = new Error('some error');
      const outcome = new LoadProductsGroupsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductsGroups$).toBeObservable(expected);
    });
  });

  describe('LoadProductsCategory', () => {
    it('should return a stream with product categories', () => {
      const serviceReponse: BinToBinTransferLoadItemListGroupResponse = {
        count: 10,
        itemListGroups: [
          {
            id: '11',
            name: '71',
            products: 16,
            totalValue: 826133.1,
            totalWeight: 269.728,
            currencyCode: 'INR',
            weightUnit: 'gms',
            description: 'Gold Plain'
          }
        ]
      };
      const parameters: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadProductsCategory(parameters);
      const outcome = new LoadProductsCategorySuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadProductsCategory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadProductsCategory(parameters);
      const error = new Error('some error');
      const outcome = new LoadProductsCategoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductsCategory$).toBeObservable(expected);
    });
  });

  describe('LoadItemGroup', () => {
    it('should return a stream with item group', () => {
      const serviceReponse: BinToBinTransferLoadItemListGroupResponse = {
        count: 10,
        itemListGroups: [
          {
            id: '11',
            name: '71',
            products: 16,
            totalValue: 826133.1,
            totalWeight: 269.728,
            currencyCode: 'INR',
            weightUnit: 'gms',
            description: 'Gold Plain'
          }
        ]
      };
      const parameters: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadItemGroup(parameters);
      const outcome = new LoadItemGroupSuccess(
        serviceReponse.itemListGroups[0]
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadItemGroup$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadItemGroup(parameters);
      const error = new Error('some error');
      const outcome = new LoadItemGroupFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.loadItemGroup$).toBeObservable(expected);
    });
  });

  describe('SearchItemGroups', () => {
    it('should return a stream with searchd item groups', () => {
      const serviceReponse: BinToBinTransferLoadItemListGroupResponse = {
        count: 10,
        itemListGroups: [
          {
            id: '11',
            name: '71',
            products: 16,
            totalValue: 826133.1,
            totalWeight: 269.728,
            currencyCode: 'INR',
            weightUnit: 'gms',
            description: 'Gold Plain'
          }
        ]
      };
      const parameters: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };

      const action = new SearchItemGroups(parameters);
      const outcome = new SearchItemGroupsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.searchItemGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinToBinTransferLoadItemGroupsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };
      const action = new SearchItemGroups(parameters);
      const outcome = new SearchItemGroupsSuccess({
        count: 0,
        itemListGroups: []
      });
      const error = new Error('some error');

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.searchItemGroups$).toBeObservable(expected);
    });
  });

  describe('LoadItems', () => {
    it('should return a stream with items', () => {
      const serviceReponse: BinToBinTransferLoadItemsResponse = {
        count: 10,
        items: [
          {
            id: 'B948E97B-BBB8-4C77-9383-1712B570F713',
            itemCode: '511178VHIU1A00',
            lotNumber: '2EA001188',
            mfgDate: moment(),
            productCategory: 'V',
            productGroup: '71',
            productCategoryDesc: 'BANGLES',
            productGroupDesc: 'Gold Plain',
            binCode: 'CHAIN',
            binGroupCode: 'STN',
            stdValue: 88213.86,
            stdWeight: 28.75,
            currencyCode: 'INR',
            weightUnit: 'gms',
            imageURL: '/productcatalogue/ProductImages/1178VHI.jpg',
            itemDetails: {},
            availableWeight: 28.75,
            availableValue: 88213.86,
            availableQuantity: 1,
            isSelected: false,
            isDisabled: false,
            destinationBinGroupCode: null,
            destinationBinCode: null,
            isStudded: true,
            thumbnailImageURL: 'abc',
            isLoadingThumbnailImage: false,
            isLoadingImage: false
          }
        ]
      };
      const parameters: BinToBinTransferLoadItemsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadItems(parameters);
      const outcome = new LoadItemsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.getItems.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinToBinTransferLoadItemsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadItems(parameters);
      const error = new Error('some error');
      const outcome = new LoadItemsSuccess({
        count: 0,
        items: [],
        totalValue: 0
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.getItems.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.loadItems$).toBeObservable(expected);
    });
  });

  describe('LoadHistoryItems', () => {
    it('should return a stream with history items', () => {
      const serviceReponse: BinToBinTransferLoadItemsResponse = {
        count: 10,
        items: [
          {
            id: 'B948E97B-BBB8-4C77-9383-1712B570F713',
            itemCode: '511178VHIU1A00',
            lotNumber: '2EA001188',
            mfgDate: moment(),
            productCategory: 'V',
            productGroup: '71',
            productCategoryDesc: 'BANGLES',
            productGroupDesc: 'Gold Plain',
            binCode: 'CHAIN',
            binGroupCode: 'STN',
            stdValue: 88213.86,
            stdWeight: 28.75,
            currencyCode: 'INR',
            weightUnit: 'gms',
            imageURL: '/productcatalogue/ProductImages/1178VHI.jpg',
            itemDetails: {},
            availableWeight: 28.75,
            availableValue: 88213.86,
            availableQuantity: 1,
            isSelected: false,
            isDisabled: false,
            destinationBinGroupCode: null,
            destinationBinCode: null,
            isStudded: true,
            thumbnailImageURL: 'abc',
            isLoadingThumbnailImage: false,
            isLoadingImage: false
          }
        ]
      };
      const parameters: BinToBinTransferLoadHistoryItemsPayload = {
        historyItemsData: null,
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadHistoryItems(parameters);
      const outcome = new LoadHistoryItemsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.getHistoryItems.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadHistoryItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinToBinTransferLoadHistoryItemsPayload = {
        historyItemsData: null,
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadHistoryItems(parameters);
      const error = new Error('some error');
      const outcome = new LoadHistoryItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.getHistoryItems.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.loadHistoryItems$).toBeObservable(expected);
    });
  });

  describe('SearchItems', () => {
    it('should return a stream with searched items', () => {
      const serviceReponse: BinToBinTransferLoadItemsResponse = {
        count: 10,
        items: [
          {
            id: 'B948E97B-BBB8-4C77-9383-1712B570F713',
            itemCode: '511178VHIU1A00',
            lotNumber: '2EA001188',
            mfgDate: moment(),
            productCategory: 'V',
            productGroup: '71',
            productCategoryDesc: 'BANGLES',
            productGroupDesc: 'Gold Plain',
            binCode: 'CHAIN',
            binGroupCode: 'STN',
            stdValue: 88213.86,
            stdWeight: 28.75,
            currencyCode: 'INR',
            weightUnit: 'gms',
            imageURL: '/productcatalogue/ProductImages/1178VHI.jpg',
            itemDetails: {},
            availableWeight: 28.75,
            availableValue: 88213.86,
            availableQuantity: 1,
            isSelected: false,
            isDisabled: false,
            destinationBinGroupCode: null,
            destinationBinCode: null,
            isStudded: true,
            thumbnailImageURL: 'abc',
            isLoadingThumbnailImage: false,
            isLoadingImage: false
          }
        ]
      };
      const parameters: BinToBinTransferLoadItemsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };

      const action = new SearchItems(parameters);
      const outcome = new SearchItemsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.searchItems.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.searchItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinToBinTransferLoadItemsPayload = {
        type: 'TEST TYPE',
        value: 'TEST VALUE',
        pageIndex: 0,
        pageSize: 100
      };
      const action = new SearchItems(parameters);
      const error = new Error('some error');
      const outcome = new SearchItemsSuccess({
        count: 0,
        items: [],
        totalValue: 0
      });

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.searchItems.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.searchItems$).toBeObservable(expected);
    });
  });

  describe('loadBins', () => {
    it('should return a stream with bins', () => {
      const serviceReponse: StoreBin[] = [
        {
          binCode: 'Test 1',
          binGroupCode: 'Test 1'
        },
        {
          binCode: 'Test 2',
          binGroupCode: 'Test 2'
        }
      ];

      const action = new LoadBins();
      const outcome = new LoadBinsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      storeConfigDataServiceSpy.getStoreBins.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadBins$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadBins();
      const error = new Error('some error');
      const outcome = new LoadBinsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      storeConfigDataServiceSpy.getStoreBins.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBins$).toBeObservable(expected);
    });
  });

  describe('LoadProductGroupsOptions', () => {
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

      const action = new LoadProductGroupOptions();
      const outcome = new LoadProductGroupOptionsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadProductGroupsOptions$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroupOptions();
      const error = new Error('some error');
      const outcome = new LoadProductGroupOptionsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productGroupDataServiceSpy.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroupsOptions$).toBeObservable(expected);
    });
  });

  describe('LoadProductCategoriesOptions', () => {
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

      const action = new LoadProductCategoryOptions();
      const outcome = new LoadProductCategoryOptionsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadProductCategoriesOptions$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductCategoryOptions();
      const error = new Error('some error');
      const outcome = new LoadProductCategoryOptionsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productCategoryDataServiceSpy.getProductCategories.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductCategoriesOptions$).toBeObservable(expected);
    });
  });

  describe('loadSourceBinOptions', () => {
    it('should return a stream with Source Bin Options', () => {
      const serviceReponse: BinToBinTransferLoadItemListGroupResponse = {
        count: 10,
        itemListGroups: [
          {
            id: '11',
            name: '71',
            products: 16,
            totalValue: 826133.1,
            totalWeight: 269.728,
            currencyCode: 'INR',
            weightUnit: 'gms',
            description: 'Gold Plain'
          }
        ]
      };

      const bins = serviceReponse.itemListGroups.map(pg => pg.name);

      const action = new LoadSourceBinOptions();
      const outcome = new LoadSourceBinOptionsSuccess(bins);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadSourceBinOptions$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadSourceBinOptions();
      const error = new Error('some error');
      const outcome = new LoadSourceBinOptionsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.getItemListGroups.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.loadSourceBinOptions$).toBeObservable(expected);
    });
  });

  describe('confirmTransferItems', () => {
    it('should return a stream confirmTransfer items response', () => {
      const serviceReponse = {
        transferId: 123
      };

      const effectReponse = {
        confirmTransferResponse: {
          transferId: 123
        },
        itemId: ['ID'],
        remove: true
      };
      const parameters: BinToBinTransferConfirmTransferItemsRequest = {
        request: {
          binItems: [
            {
              binCode: 'Test 1',
              inventoryId: 'ID',
              binGroupCode: 'Code'
            }
          ]
        },
        remove: true
      };

      const action = new ConfirmTransferItems(parameters);
      const outcome = new ConfirmTransferItemsSuccess(effectReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.confirmTransferItems.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.confirmTransferItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinToBinTransferConfirmTransferItemsRequest = {
        request: {
          binItems: [
            {
              binCode: 'Test 1',
              inventoryId: 'ID',
              binGroupCode: 'Code'
            }
          ]
        },
        remove: true
      };

      const action = new ConfirmTransferItems(parameters);
      const error = new Error('some error');
      const outcome = new ConfirmTransferItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.confirmTransferItems.and.returnValue(
        response$
      );

      const expected = cold('--b', { b: outcome });
      expect(effect.confirmTransferItems$).toBeObservable(expected);
    });
  });

  describe('confirmTransferAllItems', () => {
    it('should return a stream confirmTransfer items response', () => {
      const serviceReponse = {
        transferId: 123
      };

      const parameters: BinToBinTransferConfirmTransferAllItemsRequest = {
        type: 'Teest Type',
        value: 'Test Value',
        destinationBinCode: 'Test Bin Code',
        destinationBinGroupCode: 'Test Bin Group Code'
      };

      const action = new ConfirmTransferAllItems(parameters);
      const outcome = new ConfirmTransferAllItemsSuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.confirmTransferAllItems.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.confirmTransferAllItems$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: BinToBinTransferConfirmTransferAllItemsRequest = {
        type: 'Teest Type',
        value: 'Test Value',
        destinationBinCode: 'Test Bin Code',
        destinationBinGroupCode: 'Test Bin Group Code'
      };
      const action = new ConfirmTransferAllItems(parameters);
      const error = new Error('some error');
      const outcome = new ConfirmTransferAllItemsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.confirmTransferAllItems.and.returnValue(
        response$
      );

      const expected = cold('--b', { b: outcome });
      expect(effect.confirmTransferAllItems$).toBeObservable(expected);
    });
  });

  describe('loadBinToBinHistory', () => {
    it('should return a stream with history', () => {
      const serviceReponse = {
        count: 12,
        items: [
          {
            id: '111',
            transactionType: 'BIN_BIN',
            locationCode: 'URB',
            srcDocNo: 123,
            srcFiscalYear: 2019,
            srcDocDate: moment(),
            destDocNo: 1223,
            destDocDate: '11-MAR-2020',
            totalAvailableQuantity: 10,
            totalMeasuredQuantity: 10,
            locationCodeDescription: 'Desc',
            totalAvailableValue: 1000,
            totalMeasuredValue: 1000,
            totalAvailableWeight: 1000,
            totalMeasuredWeight: 1000,
            carrierDetails: {},
            weightUnit: 'gms',
            currencyCode: 'INR',
            status: 'OPEN',
            destFiscalYear: 2019,
            remarks: 'Remarks',
            otherDetails: {}
          }
        ]
      };
      const parameters: LoadBinToBinTransferHistoryPayload = {
        historyData: null,
        page: 12,
        size: 12,
        transactionType: 'Type'
      };

      const action = new LoadBinToBinHistory(parameters);
      const outcome = new LoadBinToBinHistorySuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.getHistory.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadBinToBinHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadBinToBinTransferHistoryPayload = {
        historyData: null,
        page: 12,
        size: 12,
        transactionType: 'Type'
      };
      const action = new LoadBinToBinHistory(parameters);
      const error = new Error('some error');
      const outcome = new LoadBinToBinHistorySuccess({ items: [], count: 0 });

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.getHistory.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.loadBinToBinHistory$).toBeObservable(expected);
    });
  });

  describe('loadSelectedHistory', () => {
    it('should return a stream with selected history', () => {
      const serviceReponse = {
        id: '111',
        transactionType: 'BIN_BIN',
        locationCode: 'URB',
        srcDocNo: 123,
        srcFiscalYear: 2019,
        srcDocDate: moment(),
        destDocNo: 1223,
        destDocDate: '11-MAR-2020',
        totalAvailableQuantity: 10,
        totalMeasuredQuantity: 10,
        locationCodeDescription: 'Desc',
        totalAvailableValue: 1000,
        totalMeasuredValue: 1000,
        totalAvailableWeight: 1000,
        totalMeasuredWeight: 1000,
        carrierDetails: {},
        weightUnit: 'gms',
        currencyCode: 'INR',
        status: 'OPEN',
        destFiscalYear: 2019,
        remarks: 'Remarks',
        otherDetails: {}
      };

      const parameters = {
        id: 1
      };

      const action = new LoadSelectedHistory(parameters);
      const outcome = new LoadSelectedHistorySuccess(serviceReponse);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      binToBinTransferServiceSpy.getSelectedHistory.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadSelectedHistory$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = {
        id: 1
      };
      const action = new LoadSelectedHistory(parameters);
      const error = new Error('some error');
      const outcome = new LoadSelectedHistoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );

      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      binToBinTransferServiceSpy.getSelectedHistory.and.returnValue(response$);

      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedHistory$).toBeObservable(expected);
    });
  });
});
