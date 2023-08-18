import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from "@nrwl/angular";
import { ProductCategoryDataService } from "@poss-web/shared/masters/data-access-masters";
import { Observable } from "rxjs"
import { hot, cold } from 'jasmine-marbles';
import { RivaahConfigurationService } from "../rivaah-configuration.service";
import { RivaahConfigurationEffect } from './rivaah-configuration.effect';
import { POSS_WEB_API_URL, POSS_WEB_CACHING_STRATEGY } from "@poss-web/shared/util-config";
import { CreateRivaahEligibilityConfiguration, CreateRivaahEligibilityConfigurationFailure, CreateRivaahEligibilityConfigurationSuccess, DeleteRivaahEligibilityConfiguration, DeleteRivaahEligibilityConfigurationFailure, DeleteRivaahEligibilityConfigurationSuccess, LoadCouponConfiguration, LoadCouponConfigurationFailure, LoadCouponConfigurationSuccess, LoadMappedProductGroupsByProductId, LoadMappedProductGroupsByProductIdFailure, LoadMappedProductGroupsByProductIdSuccess, LoadRivaahEligibilityConfiguration, LoadRivaahEligibilityConfigurationFailure, LoadRivaahEligibilityConfigurationSuccess, ToggleRivaahEligibilityConfigurationStatus, ToggleRivaahEligibilityConfigurationStatusFailure, ToggleRivaahEligibilityConfigurationStatusSuccess, UpdateCouponConfiguration, UpdateCouponConfigurationFailure, UpdateCouponConfigurationSuccess, UpdateRivaahEligibilityConfiguration, UpdateRivaahEligibilityConfigurationFailure, UpdateRivaahEligibilityConfigurationSuccess } from "./rivaah-configuration.actions";
import { LoadProductGroupsPayload, ProductGroupMappingOption, RivaahConfigurationResponse, RivaahEligibilityConfigRequest, RivaahEligibilityConfigResponse } from "@poss-web/shared/models";
import { CustomErrorAdaptor } from "@poss-web/shared/util-adaptors";

const requestPayload = {
  configId: 'configId',
  ruleType: 'ruleType'
}

const rivaahEligibilityConfigRequest: RivaahEligibilityConfigRequest = {
  addProducts: [{
    productCategoryCode: 'prodCategory',
    productGroupCode: 'prodGroup',
    ruleDetails: {
      data: {
        grammage: 'gms',
        eleventhDigit: [''],
        occasion: 'Wedding',
        isActive: false
      },
      type: 'RIVAAH_CARD_ELIGIBILITY'
    }
  }],
  removeProducts: null,
  updateProducts: [{
    id: 'id',
    productCategoryCode: 'prodCategory',
    productGroupCode: 'prodGroup',
    ruleDetails: {
      data: {
        isActive: false
      },
      type: 'RIVAAH_CARD_ELIGIBILITY',
    }
  }]
}

describe('Rivaah Configuration Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: RivaahConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let rivaahConfigService = jasmine.createSpyObj<RivaahConfigurationService>(
    'RivaahConfigurationService',
    [
      'getCouponConfiguration',
      'updateCouponConfiguration',
      'getRivaahEligibilityConfiguration',
      'updateRivaahEligibilityConfiguration',
      'loadMappedProductGroups',
      'getMappedProductCategories',
      'updateProductGroups',
      'getRivaahMappedLocationsList',
      'saveRivaahLocations',
      'getSelectedLocations'
    ]
  )
  let productCategoryService = jasmine.createSpyObj<ProductCategoryDataService>(
    'ProductCategoryDataService',
    [
      'getProductCategories'
    ]
  )
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RivaahConfigurationEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: []
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
          provide: RivaahConfigurationService,
          useValue: {
            getCouponConfiguration: jasmine.createSpy(),
            updateCouponConfiguration: jasmine.createSpy(),
            getRivaahEligibilityConfiguration: jasmine.createSpy(),
            updateRivaahEligibilityConfiguration: jasmine.createSpy(),
            loadMappedProductGroups: jasmine.createSpy(),
            getMappedProductCategories: jasmine.createSpy(),
            updateProductGroups: jasmine.createSpy(),
            getRivaahMappedLocationsList: jasmine.createSpy(),
            saveRivaahLocations: jasmine.createSpy(),
            getSelectedLocations: jasmine.createSpy()
          }
        },
        {
          provide: ProductCategoryDataService,
          useValue: {
            getProductCategories: jasmine.createSpy()
          }
        }
      ]
    });
    effect = TestBed.inject(RivaahConfigurationEffect);
    rivaahConfigService = TestBed.inject<any>(RivaahConfigurationService);
    productCategoryService = TestBed.inject<any>(ProductCategoryDataService)
  });

  describe('loadCouponConfiguration', () => {
    it('should return loadCouponConfiguration', () => {
      const responsePayload: RivaahConfigurationResponse = {
        ruleType: 'Config'
      }
      const action = new LoadCouponConfiguration(requestPayload);
      const outcome = new LoadCouponConfigurationSuccess(responsePayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: responsePayload
      });
      rivaahConfigService.getCouponConfiguration.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome })
      expect(effect.loadCouponConfiguration$).toBeObservable(expected$)
    })
    it('should fail and return an action with the error', () => {
      const requestPayload = {
        configId: 'configId',
        ruleType: 'ruleType'
      }
      const action = new LoadCouponConfiguration(requestPayload);
      const error = new Error('some error');
      const outcome = new LoadCouponConfigurationFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      rivaahConfigService.getCouponConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCouponConfiguration$).toBeObservable(expected);
    });
  })
  describe('updateCouponConfiguration', () => {
    it('should return updateCouponConfiguration', () => {
      const payload: RivaahConfigurationResponse = {
        ruleType: 'Config'
      }
      const action = new UpdateCouponConfiguration(payload);
      const outcome = new UpdateCouponConfigurationSuccess(payload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: payload
      });
      rivaahConfigService.updateCouponConfiguration.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome })
      expect(effect.updateCouponConfiguration$).toBeObservable(expected$)
    })
    it('should fail and return an action with the error', () => {
      const payload: RivaahConfigurationResponse = {
        ruleType: 'Config'
      }
      const action = new UpdateCouponConfiguration(payload);
      const error = new Error('some error');
      const outcome = new UpdateCouponConfigurationFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      rivaahConfigService.updateCouponConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateCouponConfiguration$).toBeObservable(expected);
    });
  })
  describe('loadRivaahElibilityConfiguration', () => {
    it('should return loadRivaahElibilityConfiguration', () => {
      const payload = {
        configId: 'configId',
        ruleType: 'Config'
      }
      const response: RivaahEligibilityConfigResponse = {
        rivaahEligibilityConfig: [{}],
        totalElements: 1
      }
      const action = new LoadRivaahEligibilityConfiguration(payload);
      const outcome = new LoadRivaahEligibilityConfigurationSuccess(response);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: response
      });
      rivaahConfigService.getRivaahEligibilityConfiguration.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome })
      expect(effect.loadRivaahElibilityConfiguration$).toBeObservable(expected$)
    })
    it('should fail and return an action with the error', () => {
      const payload = {
        configId: 'configId',
        ruleType: 'Config'
      }
      const action = new LoadRivaahEligibilityConfiguration(payload);
      const error = new Error('some error');
      const outcome = new LoadRivaahEligibilityConfigurationFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      rivaahConfigService.getRivaahEligibilityConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRivaahElibilityConfiguration$).toBeObservable(expected);
    });
  })
  describe('CreateRivaahEligibilityConfiguration', () => {
    it('should return CreateRivaahEligibilityConfiguration', () => {
      const action = new CreateRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      const outcome = new CreateRivaahEligibilityConfigurationSuccess();

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
      });
      rivaahConfigService.updateRivaahEligibilityConfiguration.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome })
      expect(effect.createRivaahEligibilityConfiguration$).toBeObservable(expected$)
    })
    it('should fail and return an action with the error', () => {
      const action = new CreateRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      const error = new Error('some error');
      const outcome = new CreateRivaahEligibilityConfigurationFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      rivaahConfigService.updateRivaahEligibilityConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.createRivaahEligibilityConfiguration$).toBeObservable(expected);
    });
  })
  describe('updateRivaahEligibilityConfiguration', () => {
    it('should return updateRivaahEligibilityConfiguration', () => {
      const action = new UpdateRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      const outcome = new UpdateRivaahEligibilityConfigurationSuccess();

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
      });
      rivaahConfigService.updateRivaahEligibilityConfiguration.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome })
      expect(effect.updateRivaahEligibilityConfiguration$).toBeObservable(expected$)
    })
    it('should fail and return an action with the error', () => {
      const action = new UpdateRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      const error = new Error('some error');
      const outcome = new UpdateRivaahEligibilityConfigurationFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      rivaahConfigService.updateRivaahEligibilityConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateRivaahEligibilityConfiguration$).toBeObservable(expected);
    });
  })
  describe('deleteRivaahEligibilityConfiguration', () => {
    it('should return deleteRivaahEligibilityConfiguration', () => {
      const action = new DeleteRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      const outcome = new DeleteRivaahEligibilityConfigurationSuccess();

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
      });
      rivaahConfigService.updateRivaahEligibilityConfiguration.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome })
      expect(effect.deleteRivaahEligibilityConfiguration$).toBeObservable(expected$)
    })
    it('should fail and return an action with the error', () => {
      const action = new DeleteRivaahEligibilityConfiguration(rivaahEligibilityConfigRequest);
      const error = new Error('some error');
      const outcome = new DeleteRivaahEligibilityConfigurationFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      rivaahConfigService.updateRivaahEligibilityConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.deleteRivaahEligibilityConfiguration$).toBeObservable(expected);
    });
  })
  describe('toggleRivaahEligibilityConfigurationStatus', () => {
    it('should return toggleRivaahEligibilityConfigurationStatus', () => {
      const action = new ToggleRivaahEligibilityConfigurationStatus(rivaahEligibilityConfigRequest);
      const outcome = new ToggleRivaahEligibilityConfigurationStatusSuccess();

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
      });
      rivaahConfigService.updateRivaahEligibilityConfiguration.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome })
      expect(effect.toggleRivaahEligibilityConfigurationStatus$).toBeObservable(expected$)
    })
    it('should fail and return an action with the error', () => {
      const action = new ToggleRivaahEligibilityConfigurationStatus(rivaahEligibilityConfigRequest);
      const error = new Error('some error');
      const outcome = new ToggleRivaahEligibilityConfigurationStatusFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      rivaahConfigService.updateRivaahEligibilityConfiguration.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.toggleRivaahEligibilityConfigurationStatus$).toBeObservable(expected);
    });
  })
  describe('loadProductGroups', () => {
    it('should return loadProductGroups', () => {
      const payload: LoadProductGroupsPayload = {
        ruleType: 'Config'
      }
      const responsePayload: ProductGroupMappingOption[] = [{
        id: 'Id'
      }]
      const action = new LoadMappedProductGroupsByProductId(payload);
      const outcome = new LoadMappedProductGroupsByProductIdSuccess(responsePayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: responsePayload
      });
      rivaahConfigService.loadMappedProductGroups.and.returnValue(response$);
      const expected$ = cold('--c', { c: outcome })
      expect(effect.loadProductGroups$).toBeObservable(expected$)
    })
    it('should fail and return an action with the error', () => {
      const payload: LoadProductGroupsPayload = {
        ruleType: 'Config'
      }
      const action = new LoadMappedProductGroupsByProductId(payload);
      const error = new Error('some error');
      const outcome = new LoadMappedProductGroupsByProductIdFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      rivaahConfigService.loadMappedProductGroups.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadProductGroups$).toBeObservable(expected);
    });
  })
})

