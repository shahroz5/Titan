import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';

import { DataPersistence } from '@nrwl/angular';

import { POSS_WEB_API_URL, POSS_WEB_CACHING_STRATEGY } from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { PayeeBankEffect } from './payee-bank.effect';
import { PayeeBankService } from '../payee-bank.service';
import {
  LoadPayeeBankListingSuccessPayload,
  PayeeBankDetails,
  PayeeBankGLCodeDetails,
  LocationCodeDetails,
  LoadPayeeBankListingPayload,
  SavePayeeBankFormPayload,
  PayeeBankGLCodePayload,
  PayeeGLCodeDetailsSuccessList,
  SaveGLcodeDetails,
  GlSelectMappedLocations,
  GlCodeDefaultsPayload,
  TownSummary
} from '@poss-web/shared/models';
import {
  LoadPayeeBankDetails,
  LoadPayeeBankDetailsSuccess,
  LoadPayeeBankDetailsFailure,
  LoadPayeeBankByPayeeBankName,
  LoadPayeeBankByPayeeBankNameSuccess,
  LoadPayeeBankByPayeeBankNameFailure,
  SavePayeeBankFormDetails,
  SavePayeeBankFormDetailsFailure,
  EditPayeeBankFormDetails,
  EditPayeeBankFormDetailsSuccess,
  EditPayeeBankFormDetailsFailure,
  SavePayeeBankFormDetailsSuccess,
  SearchPayeebankName,
  SearchPayeebankNameSuccess,
  LoadPayeeBankGlCodeDetails,
  LoadPayeeBankGlCodeDetailsSuccess,
  LoadPayeeBankGlCodeDetailsFailure,
  SavePayeeBankGlCodeDetails,
  SavePayeeBankGlCodeDetailsSuccess,
  SavePayeeBankGlCodeDetailsFailure,
  GetLocationCodes,
  GetLocationCodesSuccess,
  GetLocationCodesFailure,
  GetGlCodeIsDefaults,
  GetGlCodeIsDefaultsSuccess,
  GetGlCodeIsDefaultsFailure,
  LoadMappedLocations,
  LoadMappedLocationsSuccess,
  LoadMappedLocationsFailure,
  LoadTowns,
  LoadTownsSuccess
} from './payee-bank.action';
import { LocationDataService, StateDataService, TownDataService } from '@poss-web/shared/masters/data-access-masters';

describe('Stone Type Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: PayeeBankEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const payeeBankGlCodePayload: PayeeBankGLCodePayload = {
    payloadData: {
      bankName: 'AMEX',
      locationCode: ['CPD'],
      paymentCode: ['CASH']
    },
    pageEvent: { pageIndex: 0, pageSize: 100 },
    isPageable: true
  };
  let payeeBankService = jasmine.createSpyObj<PayeeBankService>(
    'PayeeBankService',
    [
      'getPayeeBankDetails',
      'getPayeeBankByBankName',
      'savePayeeBankFormDetails',
      'editPayeeBankFormDetails',
      'getPayeeBankSearchResult',
      'getPayeeBankGlCodeDetails',
      'savePayeeBankGlCodeDetails',
      'getGlCodeDefaults',
      'getMappedLocations'
    ]
  );
  const locationDataService = jasmine.createSpyObj<LocationDataService>(
    [
      'getLocationSummaryList'
    ]
  );
  const stateDataService = jasmine.createSpyObj<StateDataService>(
    [
      'getStatesSummary'
    ]
  );
  const townDataService = jasmine.createSpyObj<TownDataService>(
    [
      'getTownsSummary'
    ]
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PayeeBankEffect,
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
          provide: PayeeBankService,
          useValue: {
            getPayeeBankDetails: jasmine.createSpy(),
            getPayeeBankByBankName: jasmine.createSpy(),
            savePayeeBankFormDetails: jasmine.createSpy(),
            editPayeeBankFormDetails: jasmine.createSpy(),
            getPayeeBankSearchResult: jasmine.createSpy(),
            getPayeeBankGlCodeDetails: jasmine.createSpy(),
            savePayeeBankGlCodeDetails: jasmine.createSpy(),
            getGlCodeDefaults: jasmine.createSpy(),
            getMappedLocations: jasmine.createSpy()
          },
        },
        {
          provide: LocationDataService,
          useValue: locationDataService
        },
        {
          provide: StateDataService,
          useValue: stateDataService
        },
        {
          provide: TownDataService,
          useValue: townDataService
        }
      ]
    });

    effect = TestBed.inject(PayeeBankEffect);
    payeeBankService = TestBed.inject<any>(PayeeBankService);
  });
  const payeeBank: PayeeBankDetails = {
    bankName: 'AMERICAN EXPRESS',
    bankCode: 'AMEX',
    addressOne: '1/278',
    addressTwo: 'KK NAGAR',
    townName: 'BANGALORE',
    stateName: 'KARNATAKA',
    mailId: 'arun@gmail.com',
    contactPerson: 'Arun',
    ownerType: 'L1',
    isActive: true
  };

  describe('loadPayeeBankDetails', () => {
    it('should return a stream with stone type list', () => {
      const parameters: LoadPayeeBankListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const stoneTypeListing: LoadPayeeBankListingSuccessPayload = {
        payeeBankListing: [],
        totalElements: 0
      };
      const action = new LoadPayeeBankDetails(parameters);
      const outcome = new LoadPayeeBankDetailsSuccess(stoneTypeListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: stoneTypeListing });
      payeeBankService.getPayeeBankDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPayeeBankDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters: LoadPayeeBankListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };

      const action = new LoadPayeeBankDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadPayeeBankDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payeeBankService.getPayeeBankDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPayeeBankDetails$).toBeObservable(expected);
    });
  });
  describe('loadPayeeBankByPayeeBankName', () => {
    it('should return a stream with stone type object', () => {
      const parameters = 'stoneType1';
      const payeeBankDetail = payeeBank;

      const action = new LoadPayeeBankByPayeeBankName(parameters);
      const outcome = new LoadPayeeBankByPayeeBankNameSuccess(payeeBankDetail);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payeeBankDetail });
      payeeBankService.getPayeeBankByBankName.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPayeeBankByPayeeBankName$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new LoadPayeeBankByPayeeBankName(parameters);
      const error = new Error('some error');
      const outcome = new LoadPayeeBankByPayeeBankNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payeeBankService.getPayeeBankByBankName.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPayeeBankByPayeeBankName$).toBeObservable(expected);
    });
  });

  describe('savePayeeBankFormDetails', () => {
    const parameters: SavePayeeBankFormPayload = {
      bankName: 'AMERICAN EXPRESS',
      bankCode: 'AMEX',
      address: '1/278, KK NAGAR',
      townName: 'BANGALORE',
      stateName: 'KARNATAKA',
      mailId: 'arun@gmail.com',
      contactPerson: 'Arun',
      ownerType: 'L1',
      isActive: true
    };
    it('should return a stream with stone type list', () => {
      const payeeBankDetail = payeeBank;
      const action = new SavePayeeBankFormDetails(parameters);
      const outcome = new SavePayeeBankFormDetailsSuccess(payeeBankDetail);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payeeBankDetail });
      payeeBankService.savePayeeBankFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.savePayeeBankFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new SavePayeeBankFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new SavePayeeBankFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payeeBankService.savePayeeBankFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.savePayeeBankFormDetails$).toBeObservable(expected);
    });
  });

  describe('editPayeeBankFormDetails', () => {
    const parameters: SavePayeeBankFormPayload = {
      bankName: 'AMERICAN EXPRESS',
      bankCode: 'AMEX',
      address: '1/278, KK NAGAR',
      townName: 'BANGALORE',
      stateName: 'KARNATAKA',
      mailId: 'arun@gmail.com',
      contactPerson: 'Arun',
      ownerType: 'L1',
      isActive: true
    };
    it('should return a stream with stone type list', () => {
      const payeeBankDetail = payeeBank;
      const action = new EditPayeeBankFormDetails(parameters);
      const outcome = new EditPayeeBankFormDetailsSuccess(payeeBankDetail);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payeeBankDetail });
      payeeBankService.editPayeeBankFormDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.editPayeeBankFormDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new EditPayeeBankFormDetails(parameters);
      const error = new Error('some error');
      const outcome = new EditPayeeBankFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payeeBankService.editPayeeBankFormDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editPayeeBankFormDetails$).toBeObservable(expected);
    });
  });

  describe('searchPayeebankName', () => {
    it('should return a stream with stone type list', () => {
      const parameters = 'stoneType1';
      const payeeBankListing = [payeeBank];
      const action = new SearchPayeebankName(parameters);
      const outcome = new SearchPayeebankNameSuccess(payeeBankListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payeeBankListing });
      payeeBankService.getPayeeBankSearchResult.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchPayeebankName$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameters = 'stoneType1';
      const action = new SearchPayeebankName(parameters);
      const error = new Error('some error');
      const outcome = new LoadPayeeBankDetailsSuccess({
        payeeBankListing: [],
        totalElements: 0
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payeeBankService.getPayeeBankSearchResult.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchPayeebankName$).toBeObservable(expected);
    });
  });
  describe('loadGlCodeDetails', () => {
    it('should return a stream with stone type list', () => {

      const stoneTypeListing: PayeeGLCodeDetailsSuccessList = {
        locationList: [],
        count: 0
      };
      const action = new LoadPayeeBankGlCodeDetails(payeeBankGlCodePayload);
      const outcome = new LoadPayeeBankGlCodeDetailsSuccess(stoneTypeListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: stoneTypeListing });
      payeeBankService.getPayeeBankGlCodeDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGlCodeDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {

      const action = new LoadPayeeBankGlCodeDetails(payeeBankGlCodePayload);
      const error = new Error('some error');
      const outcome = new LoadPayeeBankGlCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payeeBankService.getPayeeBankGlCodeDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGlCodeDetails$).toBeObservable(expected);
    });
  });
  describe('saveGlCodeDetails', () => {
    const parameters: SaveGLcodeDetails = {
      bankName: 'AMEX',
      addLocations: ['CPD'],
      addPaymentCodes: ['CASH'],
      removeLocations: [],
      removePaymentCodes: [],
      updateConfigs: []
    };
    it('should return a stream with stone type list', () => {
      const payeeBankDetail: PayeeBankGLCodeDetails = {
        id: 'XXXAAA',
        bankName: 'XYZ',
        locationCode: 'CPD',
        paymentCode: 'CASH',
        glCode: 222222,
        isDefault: true
      };

      const action = new SavePayeeBankGlCodeDetails(parameters);
      const outcome = new SavePayeeBankGlCodeDetailsSuccess(payeeBankDetail);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: payeeBankDetail });
      payeeBankService.savePayeeBankGlCodeDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveGlCodeDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SavePayeeBankGlCodeDetails(parameters);
      const error = new Error('some error');
      const outcome = new SavePayeeBankGlCodeDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payeeBankService.savePayeeBankGlCodeDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveGlCodeDetails$).toBeObservable(expected);
    });
  });
  describe('loadLocationCodes', () => {
    it('should return a stream with stone type list', () => {
      const locationCodes: LocationCodeDetails[] = [
        {
          locationCode: null,
          description: null,
        },
        {
          locationCode: null,
          description: null,
        },
      ]
      const action = new GetLocationCodes();
      const outcome = new GetLocationCodesSuccess(locationCodes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: locationCodes });
      locationDataService.getLocationSummaryList.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadLocationCodes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetLocationCodes();
      const error = new Error('some error');
      const outcome = new GetLocationCodesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationDataService.getLocationSummaryList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadLocationCodes$).toBeObservable(expected);
    });
  });

  describe('loadMappedLocations', () => {
    it('should return a stream with stone type list', () => {
      const mappedLocationCodes: GlSelectMappedLocations[] = [
        {
          id: '111222',
          description: 'Delhi'
        }
      ];
      const action = new LoadMappedLocations(payeeBankGlCodePayload);
      const outcome = new LoadMappedLocationsSuccess(mappedLocationCodes);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: mappedLocationCodes });
      payeeBankService.getMappedLocations.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadMappedLocations$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadMappedLocations(payeeBankGlCodePayload);
      const error = new Error('some error');
      const outcome = new LoadMappedLocationsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payeeBankService.getMappedLocations.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadMappedLocations$).toBeObservable(expected);
    });
  });
  describe('loadGlCodeDefaults', () => {
    const parameters: GlCodeDefaultsPayload = {
      defaultList: [
        {
          locationCode: 'CPD',
          paymentCode: 'CASH'
        }
      ]
    };
    it('should return a stream with stone type list', () => {
      const glCodeDefaults: PayeeBankGLCodeDetails[] = [
        {
          id: 'XXXAAA',
          bankName: 'XYZ',
          locationCode: 'CPD',
          paymentCode: 'CASH',
          glCode: 222222,
          isDefault: true
        }
      ];
      const action = new GetGlCodeIsDefaults(parameters);
      const outcome = new GetGlCodeIsDefaultsSuccess(glCodeDefaults);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: glCodeDefaults });
      payeeBankService.getGlCodeDefaults.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGlCodeDefaults$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new GetGlCodeIsDefaults(parameters);
      const error = new Error('some error');
      const outcome = new GetGlCodeIsDefaultsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      payeeBankService.getGlCodeDefaults.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGlCodeDefaults$).toBeObservable(expected);
    });
  });

  describe('loadTowns', () => {
    const towns: TownSummary[] = [
      {
        description: 'Description',
        townCode: 123
      }
    ]
    it('should return a stream with stone type list', () => {
      const action = new LoadTowns('')
      const outcome = new LoadTownsSuccess(towns);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: towns });
      townDataService.getTownsSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome});
      expect(effect.loadTowns$).toBeObservable(expected$);
    })
  })
})
