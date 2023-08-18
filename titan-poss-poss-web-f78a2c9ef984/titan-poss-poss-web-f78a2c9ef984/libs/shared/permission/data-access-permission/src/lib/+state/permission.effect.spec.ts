import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import {
  AclUrlPermissionRequestBody,
  ElementLevelPermissionItemModel,
  TransactionCodesModel
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { PermissionDataService } from '../permission-data.service';
import {
  LoadElementPermissionsForUrl,
  LoadElementPermissionsForUrlFailure,
  LoadElementPermissionsForUrlSuccess,
  LoadUrlPermissions,
  LoadUrlPermissionsFailure,
  LoadUrlPermissionsSuccess,
  LoadUrlSuggestion,
  LoadUrlSuggestionFailure,
  LoadUrlSuggestionSuccess
} from './permission.actions';
import { PermissionEffect } from './permission.effect';

describe('ACL Permission Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: PermissionEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};
  const permissionDataServiceSpy = jasmine.createSpyObj<PermissionDataService>(
    'PermissionDataService',
    ['getPermissionforURL', 'getURLPermissions', 'getURLSuggestions']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PermissionEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: PermissionDataService,
          useValue: permissionDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(PermissionEffect);
  });

  describe('LoadElementPermissionsForUrl', () => {
    const payload = 'inventory/home';
    it('should Load Element Permissions for the Url', () => {
      const elementLevelPermissionItemModelArray: ElementLevelPermissionItemModel[] = [
        {
          url: 'inventory/home',
          transactionCodes: [
            'I0',
            'I1',
            'I2',
            'I27',
            'I42',
            'I43',
            'I44',
            'I45'
          ],
          element: 'Inventory Home - Stock Receive Request Card',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: ['I0', 'I2', 'I27'],
          element: 'Inventory Home - Stock Receive Request Count L1L2',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: ['I1'],
          element: 'Inventory Home - Stock Receive Request Count L3',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: [
            'I18',
            'I20',
            'I21',
            'I22',
            'I23',
            'I24',
            'I62',
            'I64',
            'I65',
            'I66',
            'I67',
            'I68'
          ],
          element: 'Inventory Home - Stock Issue Card L1L2',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: [
            'I39',
            'I22',
            'I23',
            'I24',
            'I63',
            'I66',
            'I67',
            'I68'
          ],
          element: 'Inventory Home - Stock Issue  Card L3',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: ['I18', 'I20', 'I21'],
          element: 'Inventory Home - Stock Issue L1L2 Request Count',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        },
        {
          url: 'inventory/home',
          transactionCodes: [
            'I3',
            'I4',
            'I5',
            'I8',
            'I9',
            'I10',
            'I11',
            'I12',
            'I13',
            'I14',
            'I15',
            'I16',
            'I17',
            'I26',
            'I28',
            'I29',
            'I30',
            'I31',
            'I32',
            'I33',
            'I46',
            'I47',
            'I48',
            'I51',
            'I52',
            'I53',
            'I54',
            'I55',
            'I56',
            'I57',
            'I58',
            'I59',
            'I60',
            'I61',
            'I70'
          ],
          element: 'Inventory Home - In-Stock Management Card',
          authorisedStrategy: null,
          unauthorisedStrategy: null
        }
      ];
      const action = new LoadElementPermissionsForUrl(payload);
      const outCome = new LoadElementPermissionsForUrlSuccess(
        elementLevelPermissionItemModelArray
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: elementLevelPermissionItemModelArray
      });
      permissionDataServiceSpy.getPermissionforURL.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadElementPermissionsForUrl).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadElementPermissionsForUrl(payload);
      const error = new Error('some error');
      const outCome = new LoadElementPermissionsForUrlFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      permissionDataServiceSpy.getPermissionforURL.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadElementPermissionsForUrl).toBeObservable(expected$);
    });
  });

  describe('LoadUrlPermissions', () => {
    const payload: AclUrlPermissionRequestBody = {
      urls: ['/inventory/home']
    };

    it('should Load Url level Permissions', () => {
      const transactionCodesModelArray: TransactionCodesModel[] = [
        { url: '/inventory/home', transactionCodes: ['I'] }
      ];

      const action = new LoadUrlPermissions(payload);
      const outCome = new LoadUrlPermissionsSuccess(transactionCodesModelArray);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', {
        a: transactionCodesModelArray
      });
      permissionDataServiceSpy.getURLPermissions.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadUrlPermissions).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadUrlPermissions(payload);
      const error = new Error('some error');
      const outCome = new LoadUrlPermissionsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      permissionDataServiceSpy.getURLPermissions.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadUrlPermissions).toBeObservable(expected$);
    });
  });

  describe('LoadUrlSuggestion', () => {
    const payload = '/inventory/home';

    it('should Load Allowed routes/Url Suggestions for the mapping Url', () => {
      const url = ['/inventory/home'];

      const action = new LoadUrlSuggestion(payload);
      const outCome = new LoadUrlSuggestionSuccess(url);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: url });
      permissionDataServiceSpy.getURLSuggestions.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadUrlSuggestion).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadUrlSuggestion(payload);
      const error = new Error('some error');
      const outCome = new LoadUrlSuggestionFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      permissionDataServiceSpy.getURLSuggestions.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadUrlSuggestion).toBeObservable(expected$);
    });
  });
});
