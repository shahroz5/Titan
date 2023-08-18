import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ItemEffect } from './item.effects';
import { ItemListingService } from '../item.service';
import {
  LoadItemByItemCode,
  LoadItemByItemCodeSuccess,
  LoadItemByItemCodeFailure,
  ResetItemByItemCode,
  // SearchItem,
  // SearchItemSuccess,
  // SearchItemFailure,
  LoadStones,
  LoadStonesSuccess,
  LoadStonesFailure,
  LoadFilterItemDetails,
  LoadFilterItemDetailsSuccess,
  LoadFilterItemDetailsFailure,
  StoreFilter,
  ResetFilter,
  LoadPricingType,
  LoadPricingTypeFailure,
  LoadPricingTypeSuccess,
  LoadCFAProductCode,
  LoadCFAProductCodeSuccess,
  LoadCFAProductCodeFailure
} from './item.actions';
import {
  ListingPageData,
  ItemStones,
  ItemFilter,
  ItemFilterPayload,
  LoadItemListingPayload,
  LoadItemListingSuccessPayload,
  ItemDetails,
  Lov,
  ProductGroup
} from '@poss-web/shared/models';
import {
  LovDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
describe('  Item Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ItemEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let itemService = jasmine.createSpyObj<ItemListingService>(
    'ItemListingService',
    ['getItemByItemCode', 'getItemStones', 'getFilterItemDetails']
  );
  const lovDataServiceSpy = jasmine.createSpyObj<LovDataService>([
    'getLocationSummaryList',
    'getEngineProductLovs'
  ]);
  const productGroupServiceSpy = jasmine.createSpyObj<ProductGroupDataService>([
    'getProductGroups'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemEffect,
        DataPersistence,
        provideMockStore({ initialState }),
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
          provide: ItemListingService,
          useValue: {
            getItemByItemCode: jasmine.createSpy(),
            getItemStones: jasmine.createSpy(),
            getFilterItemDetails: jasmine.createSpy()
          }
        },
        {
          provide: LovDataService,
          useValue: lovDataServiceSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupServiceSpy
        }
      ]
    });

    effect = TestBed.inject(ItemEffect);
    itemService = TestBed.inject<any>(ItemListingService);
  });

  describe('loadFilterItemDetails', () => {
    it('should return a stream with stone type list', () => {
      const parameter1: LoadItemListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const parameter2: ItemFilterPayload = {
        fromStdValue: 10,
        fromStdWeight: 10,
        fromStoneCharges: 10,
        itemCode: 'ABC',
        pricingType: 'ABC',
        productCategoryCode: 'ABC',
        productGroupCode: 'ABC',
        toStdValue: 100,
        toStdWeight: 100,
        toStoneCharges: 100
      };
      const parameters: ItemFilter = {
        filterPayload: parameter2,
        paginate: parameter1
      };
      const itemListing: LoadItemListingSuccessPayload = {
        itemListing: [
          {
            itemCode: 'itemCode',
            description: 'itemCode'
          }
        ],
        totalElements: 1
      };
      const action = new LoadFilterItemDetails(parameters);
      const outcome = new LoadFilterItemDetailsSuccess(itemListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: itemListing });
      itemService.getFilterItemDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadFilterItemDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter1: LoadItemListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const parameter2: ItemFilterPayload = {
        fromStdValue: 10,
        fromStdWeight: 10,
        fromStoneCharges: 10,
        itemCode: 'ABC',
        pricingType: 'ABC',
        productCategoryCode: 'ABC',
        productGroupCode: 'ABC',
        toStdValue: 100,
        toStdWeight: 100,
        toStoneCharges: 100
      };
      const parameters: ItemFilter = {
        filterPayload: parameter2,
        paginate: parameter1
      };

      const action = new LoadFilterItemDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadFilterItemDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      itemService.getFilterItemDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFilterItemDetails$).toBeObservable(expected);
    });
  });

  describe('loadItemDetailsByItemCode', () => {
    it('should return a stream with stone type object', () => {
      const parameters = 'item';
      const itemDetail: ItemDetails = {
        isEditable: true,
        itemCode: 'ABC',
        description: 'ABC',
        isActive: true,
        stoneWeight: 'ABC',
        indentType: 'ABC',
        isConsignable: true,
        maxWeightDeviation: 'ABC',
        stdWeight: 'ABC',
        productCode: 'ABC',
        brandCode: 'ABC',
        productType: 'ABC',
        materialCode: 'ABC',
        supplyChainCode: 'ABC',
        itemNature: 'ABC',
        stdPrice: 'ABC',
        stoneCharges: 'ABC',
        leadTime: 'ABC',
        hsnSacCode: 'ABC',
        purity: 'ABC',
        inventoryType: 'ABC',
        CFAproductCode: 'ABC',
        complexityCode: 'ABC',
        pricingType: 'ABC',
        taxClass: 'ABC',
        findingCode: 'ABC',
        size: 'ABC',
        finishing: 'ABC',
        pricingGroupType: 'ABC',
        priceFactor: 'ABC',
        karatage: 'ABC',
        diamondKaratage: 'ABC',
        diamondClarity: 'ABC',
        diamondColour: 'ABC',
        perGram: true,
        saleable: true,
        returnable: true,
        indentable: true
      };

      const action = new LoadItemByItemCode(parameters);
      const outcome = new LoadItemByItemCodeSuccess(itemDetail);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: itemDetail });
      itemService.getItemByItemCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadItemDetailsByItemCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'item';
      const action = new LoadItemByItemCode(parameters);
      const error = new Error('some error');
      const outcome = new LoadItemByItemCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      itemService.getItemByItemCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadItemDetailsByItemCode$).toBeObservable(expected);
    });
  });
  describe('cfaProductCodeDetails', () => {
    it('should return a stream with CountryName list', () => {
      const list: ProductGroup[] = [
        { productGroupCode: 'abc', description: 'abc' }
      ];
      const action = new LoadCFAProductCode();
      const outcome = new LoadCFAProductCodeSuccess(list);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: list });
      productGroupServiceSpy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.cfaProductCodeDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCFAProductCode();
      const error = new Error('some error');
      const outcome = new LoadCFAProductCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productGroupServiceSpy.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.cfaProductCodeDetails$).toBeObservable(expected);
    });
  });

  describe('LoadPricingType', () => {
    it('should return a stream with CountryName list', () => {
      const payload = 'PRICINGTYPE';
      const list: Lov[] = [{ code: 'abc', isActive: true, value: 'abc' }];
      const action = new LoadPricingType(payload);
      const outcome = new LoadPricingTypeSuccess(list);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: list });
      lovDataServiceSpy.getEngineProductLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPricingTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = 'PRICINGTYPE';
      const action = new LoadPricingType(payload);
      const error = new Error('some error');
      const outcome = new LoadPricingTypeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      lovDataServiceSpy.getEngineProductLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPricingTypes$).toBeObservable(expected);
    });
  });
  // describe('searchItem', () => {
  //   it('should return a stream with stone type list', () => {
  //     const parameters = 'item';
  //     const itemListing: ListingPageData[] = [
  //       {
  //         itemCode: 'ABC',
  //         description: 'ABC'
  //       }
  //     ];
  //     const action = new SearchItem(parameters);
  //     const outcome = new SearchItemSuccess(itemListing);
  //     actions$ = hot('-a', { a: action });

  //     const response$ = cold('-a|', { a: itemListing });
  //     itemService.getItemSearchResult.and.returnValue(response$);

  //     const expected$ = cold('--b', { b: outcome });
  //     expect(effect.searchItem$).toBeObservable(expected$);
  //   });

  //   it('should fail and return an action with the error', () => {
  //     const parameters = 'item';
  //     const action = new SearchItem(parameters);
  //     const error = new Error('some error');
  //     const outcome = new SearchItemFailure(CustomErrorAdaptor.fromJson(error));
  //     actions$ = hot('-a', { a: action });
  //     const response$ = cold('-#|', {}, error);
  //     itemService.getItemSearchResult.and.returnValue(response$);
  //     const expected = cold('--b', { b: outcome });
  //     expect(effect.searchItem$).toBeObservable(expected);
  //   });
  // });

  describe('itemStones', () => {
    it('should return a stream with stone type list', () => {
      const parameters = 'item';
      const itemListing: ItemStones[] = [
        {
          id: 'ABC',
          isActive: true,
          itemCode: 'ABC',
          noOfStones: 2,
          stoneCode: 'ABC'
        }
      ];
      const action = new LoadStones(parameters);
      const outcome = new LoadStonesSuccess(itemListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: itemListing });
      itemService.getItemStones.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.itemStones$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'item';
      const action = new LoadStones(parameters);
      const error = new Error('some error');
      const outcome = new LoadStonesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      itemService.getItemStones.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.itemStones$).toBeObservable(expected);
    });
  });
});
