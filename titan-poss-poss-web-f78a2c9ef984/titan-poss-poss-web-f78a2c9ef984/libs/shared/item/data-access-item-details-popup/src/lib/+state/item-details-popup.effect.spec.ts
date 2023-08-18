import { TestBed } from '@angular/core/testing';
import { DataPersistence } from '@nrwl/angular';

import { Observable } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { GSTMappingDetails, ItemStoneDetails } from '@poss-web/shared/models';

import { hot, cold } from 'jasmine-marbles';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ItemDataService,
  LovDataService,
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  LoadPcDesc,
  LoadPcDescFailure,
  LoadPcDescSuccess,
  LoadPgDesc,
  LoadPgDescFailure,
  LoadPgDescSuccess,
  LoadStoneDetails,
  LoadStoneDetailsFailure,
  LoadStoneDetailsSuccess
} from './item-details-popup.actions';
import { ItemDetailsPopupEffect } from './item-details-popup.effect';
import {
  initialState,
  ITEM_DETAILS_POPUP_FEATURE_KEY
} from './item-details-popup.reducer';

describe('Item Detail Popup Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ItemDetailsPopupEffect;

  const itemDataServicespy = jasmine.createSpyObj<ItemDataService>([
    'getItemStoneDetails'
  ]);
  const productCategoryDataServiceSpy = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategoryDescription']);

  const productGroupDataServiceSpy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroupDescription']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemDetailsPopupEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [ITEM_DETAILS_POPUP_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: ItemDataService,
          useValue: itemDataServicespy
        },

        {
          provide: ProductCategoryDataService,
          useValue: productCategoryDataServiceSpy
        },
        {
          provide: ProductGroupDataService,
          useValue: productGroupDataServiceSpy
        }
      ]
    });

    effect = TestBed.inject(ItemDetailsPopupEffect);
  });

  describe('LoadStoneDetails', () => {
    it('should return a Stone details List', () => {
      const payload: { itemCode: string; lotNumber: string | number } = {
        itemCode: '512115DVAABAP5',
        lotNumber: '2BA000002'
      };

      const response: ItemStoneDetails[] = [
        {
          color: 'Blue',
          description: 'Blue Stone 1',
          noOfStones: 12,
          price: 1234,
          quality: 'A',
          ratePerCarat: 2345,
          stoneCode: 'DA',
          stoneWeight: 12.33,
          currencyCode: 'IND',
          weightUnit: 'gms'
        },
        {
          color: 'Blue',
          description: 'Blue Stone 2',
          noOfStones: 12,
          price: 1234,
          quality: 'A',
          ratePerCarat: 2345,
          stoneCode: 'DA',
          stoneWeight: 12.33,
          currencyCode: 'IND',
          weightUnit: 'gms'
        }
      ];
      const action = new LoadStoneDetails(payload);
      const outcome = new LoadStoneDetailsSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      itemDataServicespy.getItemStoneDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadStoneDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload: { itemCode: string; lotNumber: string | number } = {
        itemCode: '512115DVAABAP5',
        lotNumber: '2BA000002'
      };

      const error = new Error('some error');

      const action = new LoadStoneDetails(payload);
      const outcome = new LoadStoneDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      itemDataServicespy.getItemStoneDetails.and.returnValue(response$);
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStoneDetails$).toBeObservable(expected$);
    });
  });

  describe('LoadPcDesc', () => {
    it('should return a PC description List', () => {
      const response = [
        {
          code: 'Description 1',
          description: 'Description 2'
        },
        {
          code: 'Description 1',
          description: 'Description 2'
        }
      ];
      const action = new LoadPcDesc();
      const outcome = new LoadPcDescSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      productCategoryDataServiceSpy.getProductCategoryDescription.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadPcDesc$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const error = new Error('some error');

      const action = new LoadPcDesc();
      const outcome = new LoadPcDescFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productCategoryDataServiceSpy.getProductCategoryDescription.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPcDesc$).toBeObservable(expected$);
    });
  });

  describe('LoadPgDesc', () => {
    it('should return a Pg description List', () => {
      const response = [
        {
          code: 'Description 1',
          description: 'Description 2'
        },
        {
          code: 'Description 1',
          description: 'Description 2'
        }
      ];
      const action = new LoadPgDesc();
      const outcome = new LoadPgDescSuccess(response);
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: response });
      productGroupDataServiceSpy.getProductGroupDescription.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadPgDesc$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const error = new Error('some error');

      const action = new LoadPgDesc();
      const outcome = new LoadPgDescFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      productGroupDataServiceSpy.getProductGroupDescription.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPgDesc$).toBeObservable(expected$);
    });
  });
});
