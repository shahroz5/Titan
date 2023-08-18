//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import { ProductCategory } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ProductCategoryDataService } from '@poss-web/shared/masters/data-access-masters';
import { ProductCategoryMappingEffects } from './pc-mapping.effects';
import {
  LoadProductCategorySuccess,
  LoadProductCategoryFailure,
  LoadProductCategory
} from './pc-mapping.actions';
describe('ProductCategoryMappingEffects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ProductCategoryMappingEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const productCategoryDataServiceServicepy = jasmine.createSpyObj<
    ProductCategoryDataService
  >(['getProductCategories']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductCategoryMappingEffects,
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
          provide: ProductCategoryDataService,
          useValue: productCategoryDataServiceServicepy
        }
      ]
    });

    effect = TestBed.inject(ProductCategoryMappingEffects);
  });

  describe('loadProductGroups', () => {
    const payload = '';
    it('should return a LoadProductCategory stream ', () => {
      const res: ProductCategory[] = [
        {
          description: 'GOLD COIN',
          productCategoryCode: '71'
        }
      ];

      const action = new LoadProductCategory();
      const outcome = new LoadProductCategorySuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      productCategoryDataServiceServicepy.getProductCategories.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductCategory();
      const error = new Error('some error');
      const outcome = new LoadProductCategoryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productCategoryDataServiceServicepy.getProductCategories.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  });
});
