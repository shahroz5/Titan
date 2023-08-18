import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { DataPersistence } from "@nrwl/angular";
import { Observable } from "rxjs/internal/Observable";
import { AmendmentConfigService } from "../amendment-config.service";
import { InventoryGlobalConfigEffect } from './amendment-config.effect'
import { provideMockStore } from "@ngrx/store/testing";
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { POSS_WEB_API_URL, POSS_WEB_CACHING_STRATEGY } from "@poss-web/shared/util-config";
import { LoadAmendmentConfigurationFiledValue, LoadAmendmentConfigurationFiledValueFailure, LoadAmendmentConfigurationFiledValueSuccess } from "./amendment-config.actions";
import { CustomErrorAdaptor } from "@poss-web/shared/util-adaptors";

describe('AmendmentConfiguration Effects Testing Suite', () => {
let actions$: Observable<any>;
let effect: InventoryGlobalConfigEffect;
const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
  'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let amendmentConfigService = jasmine.createSpyObj<AmendmentConfigService>(
    'AmendmentConfigService',
    [
      'getAmendmentConfiguration',
      'saveAmendmentConfiguration'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InventoryGlobalConfigEffect,
        DataPersistence,
        provideMockStore({ initialState }),
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
          provide: AmendmentConfigService,
          useValue: {
            getAmendmentConfiguration: jasmine.createSpy(),
            saveAmendmentConfiguration: jasmine.createSpy(),
          }
        },
      ]
    });

    effect = TestBed.inject(InventoryGlobalConfigEffect);
    amendmentConfigService = TestBed.inject<any>(AmendmentConfigService);
  });

  describe('loadAmendmentConfigurationFiledValue', () => {
    it('should return loadAmendmentConfigurationFiledValue response', () => {
      const action = new LoadAmendmentConfigurationFiledValue();
      const outcome = new LoadAmendmentConfigurationFiledValueSuccess(6);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: 6
      });
      amendmentConfigService.getAmendmentConfiguration.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadAmendmentConfigurationFiledValue$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const action = new LoadAmendmentConfigurationFiledValue();
      const error = new Error('some error');
      const outcome = new LoadAmendmentConfigurationFiledValueFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      amendmentConfigService.getAmendmentConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAmendmentConfigurationFiledValue$).toBeObservable(expected);
    });
  })
})
