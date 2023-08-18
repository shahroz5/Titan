//you here need to assert a reactive result as well as trigger an effect.
//To assert that an effect returns the right observable stream, we can use
// Rx Marbles.
import { Observable, from } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { POSS_WEB_API_URL } from '@poss-web/shared/util-config';
import { DataPersistence } from '@nrwl/angular';
import { ProductGroup } from '@poss-web/shared/models';
import { ProductGroupMappingEffects } from './product-group-mapping.effects';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ProductGroupDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  LoadProductGroupMappingSuccess,
  LoadProductGroupMappingFailure,
  LoadProductGroupMapping
} from './product-group-mapping.actions';

describe('ProductGroupMappingEffects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ProductGroupMappingEffects;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const productGroupDataServicepy = jasmine.createSpyObj<
    ProductGroupDataService
  >(['getProductGroups']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductGroupMappingEffects,
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
          provide: ProductGroupDataService,
          useValue: productGroupDataServicepy
        }
      ]
    });

    effect = TestBed.inject(ProductGroupMappingEffects);
  });

  describe('loadProductGroups', () => {
    const payload = '';
    it('should return a loadProductGroups stream ', () => {
      const res: ProductGroup[] = [
        {
          description: 'GOLD COIN',
          productGroupCode: '71'
        }
      ];

      const action = new LoadProductGroupMapping(payload);
      const outcome = new LoadProductGroupMappingSuccess(res);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: res });
      productGroupDataServicepy.getProductGroups.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProductGroupMapping(payload);
      const error = new Error('some error');
      const outcome = new LoadProductGroupMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      productGroupDataServicepy.getProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  });
});
