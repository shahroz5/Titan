import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  CPGProductGroupConfigForQCGCDetails,
  CPGProductGroupConfigForQCGCListingResult,
  CPGProductGroupConfigForQCGCMapping,
  InstrumentType,
  LoadCPGProductGroupConfigForQCGCListingPayload,
  PaymentCode,
  ProductGroupMappingOption,
  RedemptionType,
  TEPProductGroupConfigDetails,
  TEPProductGroupConfigListing,
  TEPProductGroupConfigListingPayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { CPGQCGCMapService } from '../cpg-qcgc-map.service';
import { CPGProductGroupConfigForQCGCEffect } from './cpg-product-group-config-for-qcgc.effect';
import { CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_FEATURE_KEY } from './cpg-product-group-config-for-qcgc.reducer';
import {
  EditCPGProductGroupConfigForQCGCDetails,
  EditCPGProductGroupConfigForQCGCDetailsFailure,
  EditCPGProductGroupConfigForQCGCDetailsSuccess,
  LoadCPGProductGroupConfigForQCGCDetails,
  LoadCPGProductGroupConfigForQCGCDetailsFailure,
  LoadCPGProductGroupConfigForQCGCDetailsSuccess,
  LoadCPGProductGroupConfigForQCGCListing,
  LoadCPGProductGroupConfigForQCGCListingFailure,
  LoadCPGProductGroupConfigForQCGCListingSuccess,
  LoadCPGProductGroupConfigForQCGCMapping,
  LoadCPGProductGroupConfigForQCGCMappingFailure,
  LoadCPGProductGroupConfigForQCGCMappingSuccess,
  SaveCPGProductGroupConfigForQCGCDetails,
  SaveCPGProductGroupConfigForQCGCDetailsFailure,
  SaveCPGProductGroupConfigForQCGCDetailsSuccess,
  SaveCPGProductGroupConfigForQCGCMapping,
  SaveCPGProductGroupConfigForQCGCMappingFailure,
  SaveCPGProductGroupConfigForQCGCMappingSuccess,
  SearchCPGProductGroupConfigForQCGCListing,
  SearchCPGProductGroupConfigForQCGCListingFailure,
  SearchCPGProductGroupConfigForQCGCListingSuccess
} from './cpg-product-group-config-for-qcgc.actions';

describe('CPG product group Config Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CPGProductGroupConfigForQCGCEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const cpgQCGCMapServiceServiceSpy = jasmine.createSpyObj<CPGQCGCMapService>([
    'getCPGProductGroupConfigurationList',
    'getCPGProductGroupConfigurationDetails',
    'saveCPGProductGroupConfigurationDetails',
    'editCPGProductGroupConfigurationDetails',
    'getCPGProductGroupConfigurationMapping',
    'saveCPGProductGroupConfigurationMapping'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CPGProductGroupConfigForQCGCEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [CPG_PRODUCT_GROUP_CONFIG_FOR_QCGC_FEATURE_KEY]: initialState
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
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: CPGQCGCMapService,
          useValue: cpgQCGCMapServiceServiceSpy
        }
      ]
    });

    effect = TestBed.inject(CPGProductGroupConfigForQCGCEffect);
  });

  describe('LoadCPGProductGroupConfigForQCGCListing', () => {
    it('should return LoadCPGProductGroupConfigForQCGCListing', () => {
      const payload1: LoadCPGProductGroupConfigForQCGCListingPayload = {
        pageIndex: 0,
        pageSize: 10,
        searchData: ''
      };
      const action = new LoadCPGProductGroupConfigForQCGCListing(payload1);

      const payload2: CPGProductGroupConfigForQCGCListingResult = {
        results: [],
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0,
        totalElements: 0
      };

      const outcome = new LoadCPGProductGroupConfigForQCGCListingSuccess(
        payload2
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      cpgQCGCMapServiceServiceSpy.getCPGProductGroupConfigurationList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStateTaxConfigurationListing$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error', () => {
      const payload1: LoadCPGProductGroupConfigForQCGCListingPayload = {
        pageIndex: 0,
        pageSize: 10,
        searchData: ''
      };
      const action = new LoadCPGProductGroupConfigForQCGCListing(payload1);
      const error = new Error('some error');
      const outcome = new LoadCPGProductGroupConfigForQCGCListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cpgQCGCMapServiceServiceSpy.getCPGProductGroupConfigurationList.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStateTaxConfigurationListing$).toBeObservable(expected);
    });
  });

  /* describe('SearchCPGProductGroupConfigForQCGCListing Details', () => {
    it('should return a details of TEP Exception Config for SearchCPGProductGroupConfigForQCGCListingSuccess', () => {
      const payload2: CPGProductGroupConfigForQCGCDetails =
      {
        description: 'desc',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full,
      }


      const payload1: string = 'Code';
      const action = new SearchCPGProductGroupConfigForQCGCListing(payload1);
      const outcome = new SearchCPGProductGroupConfigForQCGCListingSuccess(
        payload2
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2[0]
      });
      cpgQCGCMapServiceServiceSpy.getCPGProductGroupConfigurationDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchStateTaxConfigurationDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for SearchCPGProductGroupConfigForQCGCListingFailure', () => {
      const payload1: string = 'Code';
      const action = new SearchCPGProductGroupConfigForQCGCListing(payload1);

      const error = new Error('some error');
      const outcome = new SearchCPGProductGroupConfigForQCGCListingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cpgQCGCMapServiceServiceSpy.getCPGProductGroupConfigurationDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.searchStateTaxConfigurationDetails$).toBeObservable(
        expected
      );
    });
  }); */

  describe('LoadCPGProductGroupConfigForQCGCDetails Details', () => {
    it('should return a details of TEP Exception Config for LoadCPGProductGroupConfigForQCGCDetailsSuccess', () => {
      const payload1 = '';
      const action = new LoadCPGProductGroupConfigForQCGCDetails(payload1);

      const payload2: CPGProductGroupConfigForQCGCDetails = {
        description: 'desc',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full
      };
      const outcome = new LoadCPGProductGroupConfigForQCGCDetailsSuccess(
        payload2
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      cpgQCGCMapServiceServiceSpy.getCPGProductGroupConfigurationDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStateTaxConfigurationDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for LoadCPGProductGroupConfigForQCGCDetailsFailure', () => {
      const payload1: string = 'Code';

      const action = new LoadCPGProductGroupConfigForQCGCDetails(payload1);
      const error = new Error('some error');
      const outcome = new LoadCPGProductGroupConfigForQCGCDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cpgQCGCMapServiceServiceSpy.getCPGProductGroupConfigurationDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStateTaxConfigurationDetails$).toBeObservable(expected);
    });
  });

  describe('SaveCPGProductGroupConfigForQCGCDetails Details', () => {
    it('should return a details of TEP Exception Config for SaveCPGProductGroupConfigForQCGCDetailsSuccess', () => {
      const payload: CPGProductGroupConfigForQCGCDetails = {
        description: 'desc',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full
      };

      const action = new SaveCPGProductGroupConfigForQCGCDetails(payload);
      const outcome = new SaveCPGProductGroupConfigForQCGCDetailsSuccess(
        payload
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      cpgQCGCMapServiceServiceSpy.saveCPGProductGroupConfigurationDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveStateTaxConfigurationDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for SaveCPGProductGroupConfigForQCGCDetailsFailure', () => {
      const payload: CPGProductGroupConfigForQCGCDetails = {
        description: 'desc',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full
      };

      const action = new SaveCPGProductGroupConfigForQCGCDetails(payload);
      const error = new Error('some error');
      const outcome = new SaveCPGProductGroupConfigForQCGCDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cpgQCGCMapServiceServiceSpy.saveCPGProductGroupConfigurationDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveStateTaxConfigurationDetails$).toBeObservable(expected);
    });
  });

  describe('EditCPGProductGroupConfigForQCGCDetails Details', () => {
    it('should return a details of TEP Exception Config for EditCPGProductGroupConfigForQCGCDetailsSuccess', () => {
      const payload: CPGProductGroupConfigForQCGCDetails = {
        description: 'desc',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full
      };

      const action = new EditCPGProductGroupConfigForQCGCDetails(payload);
      const outcome = new EditCPGProductGroupConfigForQCGCDetailsSuccess(
        payload
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload
      });
      cpgQCGCMapServiceServiceSpy.editCPGProductGroupConfigurationDetails.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editStateTaxConfigurationDetails$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for EditCPGProductGroupConfigForQCGCDetailsFailure', () => {
      const payload: CPGProductGroupConfigForQCGCDetails = {
        description: 'desc',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full
      };

      const action = new EditCPGProductGroupConfigForQCGCDetails(payload);
      const error = new Error('some error');
      const outcome = new EditCPGProductGroupConfigForQCGCDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cpgQCGCMapServiceServiceSpy.editCPGProductGroupConfigurationDetails.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.editStateTaxConfigurationDetails$).toBeObservable(expected);
    });
  });

  describe('LoadCPGProductGroupConfigForQCGCMapping Details', () => {
    it('should return a details of TEP Exception Config for LoadCPGProductGroupConfigForQCGCMappingSuccess', () => {
      const payload1 = 'Code';

      const action = new LoadCPGProductGroupConfigForQCGCMapping(payload1);

      const payload2: ProductGroupMappingOption[] = [
        {
          description: 'desc',
          id: '1',
          uuid: '2'
        }
      ];
      const outcome = new LoadCPGProductGroupConfigForQCGCMappingSuccess(
        payload2
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      cpgQCGCMapServiceServiceSpy.getCPGProductGroupConfigurationMapping.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.LoadStateTaxConfigurationMapping$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for LoadCPGProductGroupConfigForQCGCMappingFailure', () => {
      const payload1 = 'Code';

      const action = new LoadCPGProductGroupConfigForQCGCMapping(payload1);
      const error = new Error('some error');
      const outcome = new LoadCPGProductGroupConfigForQCGCMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cpgQCGCMapServiceServiceSpy.getCPGProductGroupConfigurationMapping.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.LoadStateTaxConfigurationMapping$).toBeObservable(expected);
    });
  });

  describe('SaveCPGProductGroupConfigForQCGCMapping Details', () => {
    it('should return a details of TEP Exception Config for SaveCPGProductGroupConfigForQCGCMappingSuccess', () => {
      const payload1: {
        data: CPGProductGroupConfigForQCGCMapping;
        id: string;
      } = {
        data: {
          addProductGroupCode: [],
          removeProductMappingIds: []
        },
        id: '1'
      };

      const action = new SaveCPGProductGroupConfigForQCGCMapping(payload1);

      const payload2: ProductGroupMappingOption[] = [
        {
          id: '1',
          uuid: '2',
          description: 'desc'
        }
      ];
      const outcome = new SaveCPGProductGroupConfigForQCGCMappingSuccess(
        payload2
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      cpgQCGCMapServiceServiceSpy.saveCPGProductGroupConfigurationMapping.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveStateTaxConfigurationMapping$).toBeObservable(
        expected$
      );
    });

    it('should fail and return an action with the error for SaveCPGProductGroupConfigForQCGCMappingFailure', () => {
      const payload1: {
        data: CPGProductGroupConfigForQCGCMapping;
        id: string;
      } = {
        data: {
          addProductGroupCode: [],
          removeProductMappingIds: []
        },
        id: '1'
      };

      const action = new SaveCPGProductGroupConfigForQCGCMapping(payload1);
      const error = new Error('some error');
      const outcome = new SaveCPGProductGroupConfigForQCGCMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      cpgQCGCMapServiceServiceSpy.saveCPGProductGroupConfigurationMapping.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.saveStateTaxConfigurationMapping$).toBeObservable(expected);
    });
  });
});
