import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { CourierDetailsService } from '../courier-details.service';
import { CourierDetailsEffects } from './courier-details.effect';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  Country,
  CourierMaster,
  CourierSelectedLocations,
  LoadCourierDetailsListingPayload,
  LoadCourireDetailsListingSuccessPayload,
  State
} from '@poss-web/shared/models';
import {
  LoadCountry,
  LoadCountryFailure,
  LoadCountrySuccess,
  LoadCourierDetails,
  LoadCourierDetailsBasedOnCourierName,
  LoadCourierDetailsBasedOnCourierNameFailure,
  LoadCourierDetailsBasedOnCourierNameSuccess,
  LoadCourierDetailsFailure,
  LoadCourierDetailsSuccess,
  LoadStates,
  LoadStatesFailure,
  LoadStatesSuccess,
  LocationMapping,
  LocationMappingFailure,
  LocationMappingSuccess,
  SaveCourierDetails,
  SaveCourierDetailsFailure,
  SaveCourierDetailsSuccess,
  SearchCourierName,
  SearchCourierNameFailure,
  SearchCourierNameSuccess,
  SelectedLocations,
  SelectedLocationsFailure,
  SelectedLocationsSuccess,
  UpdateCourierDetails,
  UpdateCourierDetailsFailure,
  UpdateCourierDetailsSuccess,
  UpdateCourierStatus,
  UpdateCourierStatusFailure,
  UpdateCourierStatusSuccess
} from './courier-details.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CountryDataService,
  StateDataService
} from '@poss-web/shared/masters/data-access-masters';

describe('Courier Details Effects Testing Suite', () => {
  const dummyCourierDetailsListing: LoadCourireDetailsListingSuccessPayload = {
    courierDetailsListing: [
      {
        courierName: 'BLUE DART',
        isActive: true
      },
      {
        courierName: 'HAND CARRY',
        isActive: true
      }
    ],
    totalElements: 2
  };
  const dummyCourierDetails: CourierMaster = {
    courierName: 'BLUDE DART',
    address: 'Vijayawada',
    stateName: 'Andhra Pradesh',
    townName: 'Machilipatnam',
    description: 'Courier Name is Blue dart',
    mailId: 'titan@gmail.com',
    mobileNumber: '9010462817',
    contactPerson: 'admin',
    isActive: true,
    countryCode: 'IND'
  };
  const dummySearchResponse: CourierMaster[] = [
    {
      courierName: 'BLUDE DART',
      address: 'Vijayawada',
      stateName: 'Andhra Pradesh',
      townName: 'Machilipatnam',
      description: 'Courier Name is Blue dart',
      mailId: 'titan@gmail.com',
      mobileNumber: '9010462817',
      contactPerson: 'admin',
      isActive: true,
      countryCode: 'IND'
    }
  ];
  const dummySelectedLocations: CourierSelectedLocations[] = [
    {
      id: 'PNA',
      description: 'PNA'
    },
    {
      id: 'URB',
      description: 'URB'
    }
  ];
  let actions$: Observable<any>;
  let effect: CourierDetailsEffects;

  const initialState = {};

  const courierDetailsServiceSpy = jasmine.createSpyObj<CourierDetailsService>([
    'getCourierDetails',
    'getCourierDetailsBasedOnCourierName',
    'searchCourierName',
    'saveCourierDetails',
    'updateCourierDetails',
    'updateCourierStatus',
    'selectedLocations',
    'getCountry',
    'getStates',
    'locationMapping'
  ]);

  const countryDataServiceSpy = jasmine.createSpyObj<CountryDataService>([
    'getCountries'
  ]);
  const stateDataServiceSpy = jasmine.createSpyObj<StateDataService>([
    'getStates'
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CourierDetailsEffects,
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
          provide: CourierDetailsService,
          useValue: courierDetailsServiceSpy
        },
        {
          provide: CountryDataService,
          useValue: countryDataServiceSpy
        },
        {
          provide: StateDataService,
          useValue: stateDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(CourierDetailsEffects);
  });
  describe('loadCourierDetailsListing', () => {
    it('should return a stream with courierDetailsListing', () => {
      const parameters: LoadCourierDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCourierDetails(parameters);
      const outcome = new LoadCourierDetailsSuccess(dummyCourierDetailsListing);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummyCourierDetailsListing });
      courierDetailsServiceSpy.getCourierDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCourierDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const parameters: LoadCourierDetailsListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadCourierDetails(parameters);
      const error = new Error('some error');
      const outcome = new LoadCourierDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      courierDetailsServiceSpy.getCourierDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCourierDetails$).toBeObservable(expected);
    });
  });
  describe('loadCourierDetailsBasedOnCourierName', () => {
    it('should return a stream with loadCourierDetailsBasedOnCourierName', () => {
      const action = new LoadCourierDetailsBasedOnCourierName('BLUE DART');
      const outcome = new LoadCourierDetailsBasedOnCourierNameSuccess(
        dummyCourierDetails
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummyCourierDetails });
      courierDetailsServiceSpy.getCourierDetailsBasedOnCourierName.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCourierDetailsBasedOnCourierName$).toBeObservable(
        expected$
      );
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadCourierDetailsBasedOnCourierName('BLUE DART');
      const error = new Error('some error');
      const outcome = new LoadCourierDetailsBasedOnCourierNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      courierDetailsServiceSpy.getCourierDetailsBasedOnCourierName.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCourierDetailsBasedOnCourierName$).toBeObservable(
        expected
      );
    });
  });
  describe('searchCourierDetails', () => {
    it('should return a stream with searchCourierDetails', () => {
      const action = new SearchCourierName('BLUE DART');
      const outcome = new SearchCourierNameSuccess(dummySearchResponse);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummySearchResponse });
      courierDetailsServiceSpy.searchCourierName.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchCourierName$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SearchCourierName('BLUE DART');
      const error = new Error('some error');
      const outcome = new SearchCourierNameFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      courierDetailsServiceSpy.searchCourierName.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCourierName$).toBeObservable(expected);
    });
  });
  describe('saveCourierDetails', () => {
    it('should return a stream with saveCourierDetails', () => {
      const action = new SaveCourierDetails(dummyCourierDetails);
      const outcome = new SaveCourierDetailsSuccess(dummyCourierDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummyCourierDetails });
      courierDetailsServiceSpy.saveCourierDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.saveCourierDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SaveCourierDetails(dummyCourierDetails);
      const error = new Error('some error');
      const outcome = new SaveCourierDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      courierDetailsServiceSpy.saveCourierDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveCourierDetails$).toBeObservable(expected);
    });
  });
  describe('updateCourierDetails', () => {
    it('should return a stream with updateCourierDetails', () => {
      const action = new UpdateCourierDetails({
        courierName: 'BLUE DART',
        data: {
          address: 'Vijayawada',
          stateName: 'Andhra Pradesh',
          townName: 'Machilipatnam',
          description: 'Courier Name is Blue dart',
          mailId: 'titan@gmail.com',
          mobileNumber: '9010462817',
          contactPerson: 'admin',
          isActive: true,
          countryCode: 'IND'
        }
      });
      const outcome = new UpdateCourierDetailsSuccess(dummyCourierDetails);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummyCourierDetails });
      courierDetailsServiceSpy.updateCourierDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.updateCourierDetails$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new UpdateCourierDetails({
        courierName: 'BLUE DART',
        data: {
          address: 'Vijayawada',
          stateName: 'Andhra Pradesh',
          townName: 'Machilipatnam',
          description: 'Courier Name is Blue dart',
          mailId: 'titan@gmail.com',
          mobileNumber: '9010462817',
          contactPerson: 'admin',
          isActive: true,
          countryCode: 'IND'
        }
      });
      const error = new Error('some error');
      const outcome = new UpdateCourierDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      courierDetailsServiceSpy.updateCourierDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateCourierDetails$).toBeObservable(expected);
    });
  });
  describe('selectedLocations', () => {
    it('should return a stream with selectedLocations', () => {
      const action = new SelectedLocations('Blue Dart');
      const outcome = new SelectedLocationsSuccess(dummySelectedLocations);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: dummySelectedLocations });
      courierDetailsServiceSpy.selectedLocations.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.selectedLocations$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new SelectedLocations('BLUE DART');
      const error = new Error('some error');
      const outcome = new SelectedLocationsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      courierDetailsServiceSpy.selectedLocations.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.selectedLocations$).toBeObservable(expected);
    });
  });
  describe('loadCountries', () => {
    // it('should return a stream with loadCountries', () => {
    //   const response: Country[] = [
    //     {
    //       id: '12',
    //       countryCode: 12,
    //       currencyCode: 'IR',
    //       description: 'INDIA',
    //       isActive: true,
    //       locale: 'lc',
    //       phoneLength: 9010462817,
    //       timeFormat: 'mm',
    //       isdCode: 'dd',
    //       fiscalYear: '2021'
    //     }
    //   ];
    //   const action = new LoadCountry();
    //   const outcome = new LoadCountrySuccess([
    //     {
    //       id: '12',
    //       name: 'INDIA'
    //     }
    //   ]);
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', { a: response });
    //   countryDataServiceSpy.getCountries.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadCountry$).toBeObservable(expected$);
    // });
    it('should fail and return an action with the error', () => {
      const action = new LoadCountry();
      const error = new Error('some error');
      const outcome = new LoadCountryFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      countryDataServiceSpy.getCountries.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCountry$).toBeObservable(expected);
    });
  });
  describe('loadStates', () => {
    // it('should return a stream with loadStates', () => {
    //   const response: State[] = [
    //     {
    //       configDetails: {},
    //       countryCode: 12,
    //       description: 'Andhra Pradesh',
    //       isActive: true,
    //       stateCode: 12,
    //       stateId: 12,
    //       stateTaxCode: 12,
    //       isUnionTerritory: true
    //     }
    //   ];
    //   const action = new LoadStates('IND');
    //   const outcome = new LoadStatesSuccess([
    //     {
    //       id: 12,
    //       stateCode: 12,
    //       description: 'Andhra Pradesh'
    //     }
    //   ]);
    //   actions$ = hot('-a', { a: action });

    //   const response$ = cold('-a|', {
    //     a: response
    //   });
    //   stateDataServiceSpy.getStates.and.returnValue(response$);

    //   const expected$ = cold('--b', { b: outcome });
    //   expect(effect.loadStates$).toBeObservable(expected$);
    // });
    it('should fail and return an action with the error', () => {
      const action = new LoadStates('IND');
      const error = new Error('some error');
      const outcome = new LoadStatesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      stateDataServiceSpy.getStates.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStates$).toBeObservable(expected);
    });
  });
  describe('locationMapping', () => {
    it('should return a stream with locationMapping', () => {
      const action = new LocationMapping({
        courierName: 'Blue Dart',
        locationMapping: {
          addLocations: ['PNA', 'URB'],
          removeLocations: ['KHN']
        }
      });

      const outcome = new LocationMappingSuccess();
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: null });
      courierDetailsServiceSpy.locationMapping.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.locationMapping$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LocationMapping({
        courierName: 'Blue Dart',
        locationMapping: {
          addLocations: ['PNA', 'URB'],
          removeLocations: ['KHN']
        }
      });
      const error = new Error('some error');
      const outcome = new LocationMappingFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      courierDetailsServiceSpy.locationMapping.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.locationMapping$).toBeObservable(expected);
    });
  });
});
