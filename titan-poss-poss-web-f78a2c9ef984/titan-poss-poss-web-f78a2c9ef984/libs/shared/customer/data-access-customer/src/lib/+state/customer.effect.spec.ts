import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomerEffect } from './customer.effect';
import { CustomerDataService } from '../customer.service';
import {
  CountrySummary,
  StateSummary,
  TownSummary,
  PincodeSummary,
  CustomerLov,
  CustomerInfo,
  CreatedCustomerResponse,
  Zone,
  SEARCH_BY_ENUM,
  AllowedTransactionTypeMap
} from '@poss-web/shared/models';
import {
  LoadCountriesSuccess,
  LoadCountries,
  LoadCountriesFailure,
  LoadStatesSuccess,
  LoadStates,
  LoadStatesFailure,
  LoadTownsSuccess,
  LoadTowns,
  LoadTownsFailure,
  LoadPincode,
  LoadPincodeSuccess,
  LoadPincodeFailure,
  LoadCustomerUniqueMobile,
  LoadCustomerUniqueMobileSuccess,
  LoadCustomerUniqueMobileFailure,
  LoadCustomerUniqueEmail,
  LoadCustomerUniqueEmailSuccess,
  LoadCustomerUniqueEmailFailure,
  LoadCustomerUniquePan,
  LoadCustomerUniquePanSuccess,
  LoadCustomerUniquePanFailure,
  LoadCustomerUniqueGst,
  LoadCustomerUniqueGstFailure,
  LoadCustomerUniqueGstSuccess,
  LoadCountryCodeFailure,
  LoadCountryCode,
  LoadCountryCodeSuccess,
  LoadSalutationsSuccess,
  LoadSalutations,
  LoadSalutationsFailure,
  SaveCustomerFormDetails,
  SaveCustomerFormDetailsSuccess,
  SaveCustomerFormDetailsFailure,
  UpdateCustomerSuccess,
  UpdateCustomerFailure,
  UpdateCustomer,
  SearchCustomerSuccess,
  SearchCustomer,
  SearchCustomerFailure,
  SelectedCustomerDetail,
  SelectedCustomerDetailSuccess,
  SelectedCustomerDetailFailure,
  LoadZones,
  LoadZonesSuccess,
  LoadZonesFailure,
  LoadSelectedCustomer,
  LoadSelectedCustomerSuccess,
  LoadSelectedCustomerFailure,
  LoadAllowedTransactionTypes,
  LoadAllowedTransactionTypesSuccess,
  LoadAllowedTransactionTypesFailure,
  LoadCustomerUniquePassport,
  LoadCustomerUniquePassportSuccess,
  LoadCustomerUniquePassportFailure,
  LoadIdProofs,
  LoadIdProofsSuccess,
  LoadIdProofsFailure,
  PanCardVerificationStatus,
  PanCardVerificationStatusSuccess,
  PanCardVerificationStatusFailure,
  GstCardVerificationStatus,
  GstCardVerificationStatusSuccess,
  GstCardVerificationStatusFailure,
  LoadBrandDetails,
  LoadBrandDetailsSuccess,
  LoadBrandDetailsFailure,
  GetGhsCustomerDetails,
  GetCustomerDetailsSuccess,
  GetCustomerDetailsFailure,
  SelectInternationalCustomerSuccess,
  SelectInternationalCustomer,
  SelectInternationalCustomerFailure
} from './customer.actions';
import {
  CountryDataService,
  ZoneDataService
} from '@poss-web/shared/masters/data-access-masters';

describe('Customer Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: CustomerEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let customerDataService = jasmine.createSpyObj<CustomerDataService>(
    'CustomerDataService',
    [
      'getCustomerDetails',
      'getTownsSummary',
      'getPincodeSummary',
      'getIsUniqueCustomer',
      'getCountryCode',
      'getCustomerLovs',
      'saveCustomer',
      'updateCustomer',
      'searchCustomer',
      'getCustomer',
      'getAllowedTransactionTypes',
      'getStateSummary',
      'validatePAN',
      'validateGST',
      'getBrandByCode',
      'searchCustomer'
    ]
  );
  let countryDataService = jasmine.createSpyObj<CountryDataService>(
    'CustomerDataService',
    ['getCountrySummary']
  );

  let zoneDataService = jasmine.createSpyObj<ZoneDataService>(
    'ZoneDataService',
    ['getZones']
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CustomerEffect,
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
          provide: CustomerDataService,
          useValue: {
            getCustomerDetails: jasmine.createSpy(),
            getTownsSummary: jasmine.createSpy(),
            getPincodeSummary: jasmine.createSpy(),
            getIsUniqueCustomer: jasmine.createSpy(),
            getCountryCode: jasmine.createSpy(),
            getCustomerLovs: jasmine.createSpy(),
            saveCustomer: jasmine.createSpy(),
            updateCustomer: jasmine.createSpy(),
            searchCustomer: jasmine.createSpy(),
            getCustomer: jasmine.createSpy(),
            getAllowedTransactionTypes: jasmine.createSpy(),
            getStateSummary: jasmine.createSpy(),
            validatePAN: jasmine.createSpy(),
            validateGST: jasmine.createSpy(),
            getBrandByCode: jasmine.createSpy()
          }
        },
        {
          provide: CountryDataService,
          useValue: {
            getCountrySummary: jasmine.createSpy()
          }
        },

        {
          provide: ZoneDataService,
          useValue: {
            getZones: jasmine.createSpy()
          }
        }
      ]
    });

    effect = TestBed.inject(CustomerEffect);
    customerDataService = TestBed.inject(CustomerDataService) as jasmine.SpyObj<
      CustomerDataService
    >;
    countryDataService = TestBed.inject(CountryDataService) as jasmine.SpyObj<
      CountryDataService
    >;
    zoneDataService = TestBed.inject(ZoneDataService) as jasmine.SpyObj<
      ZoneDataService
    >;
  });

  describe('loadCountries', () => {
    it('should return a list of countries', () => {
      const loadCountries: CountrySummary[] = [
        {
          countryCode: 'IND',
          description: 'India',
          isdCode: '+91'
        }
      ];
      const action = new LoadCountries();
      const outcome = new LoadCountriesSuccess(loadCountries);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: loadCountries });
      countryDataService.getCountrySummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCountries$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCountries();
      const error = new Error('some error');
      const outcome = new LoadCountriesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      countryDataService.getCountrySummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCountries$).toBeObservable(expected);
    });
  });
  describe('loadStates', () => {
    it('should return a list of states', () => {
      const countryCode = 'IND';
      const loadStates: any[] = [
        {
          stateId: 1,
          description: 'Karnataka'
        }
      ];
      const action = new LoadStates(countryCode);
      const outcome = new LoadStatesSuccess(loadStates);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: loadStates });
      customerDataService.getStateSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStates$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const countryCode = 'IND';
      const action = new LoadStates(countryCode);
      const error = new Error('some error');
      const outcome = new LoadStatesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getStateSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadStates$).toBeObservable(expected);
    });
  });
  describe('loadTowns', () => {
    it('should return a list of towns', () => {
      const stateCode = '1';
      const loadTowns: TownSummary[] = [
        {
          townCode: 1,
          description: 'Mysore'
        }
      ];
      const action = new LoadTowns(stateCode);
      const outcome = new LoadTownsSuccess(loadTowns);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: loadTowns });
      customerDataService.getTownsSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadTowns$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const stateCode = '1';
      const action = new LoadTowns(stateCode);
      const error = new Error('some error');
      const outcome = new LoadTownsFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getTownsSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadTowns$).toBeObservable(expected);
    });
  });
  describe('loadPincode', () => {
    it('should return a pincode detail', () => {
      const requestParam = {
        countryCode: 'IND',
        pincode: '571313'
      };
      const pincodeSummary: PincodeSummary = {
        townName: 'Banglore',
        stateName: 'Karnataka',
        cachementArea: ['Rajajinagar', 'Rajarajeswari Nagar']
      };
      const action = new LoadPincode(requestParam);
      const outcome = new LoadPincodeSuccess(pincodeSummary);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: pincodeSummary });
      customerDataService.getPincodeSummary.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPincode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestParam = {
        countryCode: 'IND',
        pincode: '571313'
      };
      const action = new LoadPincode(requestParam);
      const error = new Error('some error');
      const outcome = new LoadPincodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getPincodeSummary.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPincode$).toBeObservable(expected);
    });
  });
  describe('loadIsUniqueMobile', () => {
    it('should return  is a unique mobile', () => {
      const requestParam = {
        searchType: 'MOBILE_NO',
        value: '8095319938'
      };
      const response = true;
      const action = new LoadCustomerUniqueMobile(requestParam);
      const outcome = new LoadCustomerUniqueMobileSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      customerDataService.getIsUniqueCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIsUniqueMobile$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestParam = {
        searchType: 'MOBILE_NO',
        value: '8095319938'
      };
      const action = new LoadCustomerUniqueMobile(requestParam);
      const error = new Error('some error');
      const outcome = new LoadCustomerUniqueMobileFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getIsUniqueCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIsUniqueMobile$).toBeObservable(expected);
    });
  });
  describe('loadIsUniqueEmail', () => {
    it('should return  is a unique email', () => {
      const requestParam = {
        searchType: 'EMAIL_ID',
        value: 'customer@gmail.com'
      };
      const response = true;
      const action = new LoadCustomerUniqueEmail(requestParam);
      const outcome = new LoadCustomerUniqueEmailSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      customerDataService.getIsUniqueCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIsUniqueEmail$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestParam = {
        searchType: 'EMAIL_ID',
        value: 'customer@gmail.com'
      };
      const action = new LoadCustomerUniqueEmail(requestParam);
      const error = new Error('some error');
      const outcome = new LoadCustomerUniqueEmailFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getIsUniqueCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIsUniqueEmail$).toBeObservable(expected);
    });
  });
  describe('loadIsUniquePan', () => {
    it('should return  is a unique PAN', () => {
      const requestParam = {
        searchType: 'CUSTOMER_TAX_NO',
        value: 'BLOPJ2603A'
      };
      const response = true;
      const action = new LoadCustomerUniquePan(requestParam);
      const outcome = new LoadCustomerUniquePanSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      customerDataService.getIsUniqueCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIsUniquePan$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestParam = {
        searchType: 'EMAIL_ID',
        value: 'customer@gmail.com'
      };
      const action = new LoadCustomerUniquePan(requestParam);
      const error = new Error('some error');
      const outcome = new LoadCustomerUniquePanFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getIsUniqueCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIsUniquePan$).toBeObservable(expected);
    });
  });
  describe('loadIsUniqueGst', () => {
    it('should return  is a unique GST No', () => {
      const requestParam = {
        searchType: 'INSTITUTIONAL_TAX_NO',
        value: '18AABCT3518Q1ZV'
      };
      const response = true;
      const action = new LoadCustomerUniqueGst(requestParam);
      const outcome = new LoadCustomerUniqueGstSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      customerDataService.getIsUniqueCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIsUniqueGst$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestParam = {
        searchType: 'EMAIL_ID',
        value: 'customer@gmail.com'
      };
      const action = new LoadCustomerUniqueGst(requestParam);
      const error = new Error('some error');
      const outcome = new LoadCustomerUniqueGstFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getIsUniqueCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIsUniqueGst$).toBeObservable(expected);
    });
  });
  describe('loadCountryCode', () => {
    it('should return  a countryCode', () => {
      const response: any = 'IND';
      const action = new LoadCountryCode();
      const outcome = new LoadCountryCodeSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      customerDataService.getCountryCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadCountryCode$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadCountryCode();
      const error = new Error('some error');
      const outcome = new LoadCountryCodeFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getCountryCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadCountryCode$).toBeObservable(expected);
    });
  });
  describe('loadSalutations', () => {
    it('should return  a list of salutation', () => {
      const requestParam = 'SALUTATION';
      const response: CustomerLov[] = [
        {
          code: 'Mr',
          isActive: true,
          value: 'Mr'
        }
      ];
      const action = new LoadSalutations(requestParam);
      const outcome = new LoadSalutationsSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      customerDataService.getCustomerLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSalutations$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestParam = 'SALUTATION';
      const action = new LoadSalutations(requestParam);

      const error = new Error('some error');
      const outcome = new LoadSalutationsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getCustomerLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSalutations$).toBeObservable(expected);
    });
  });
  describe('SaveCustomer', () => {
    it('should post customer details', () => {
      const customerData = null;
      const createdCustomer: CustomerInfo = null;

      const action = new SaveCustomerFormDetails(customerData);
      const outcome = new SaveCustomerFormDetailsSuccess(createdCustomer);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: createdCustomer });
      customerDataService.saveCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.SaveCustomer$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const customerData = null;
      const action = new SaveCustomerFormDetails(customerData);

      const error = new Error('some error');
      const outcome = new SaveCustomerFormDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.saveCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.SaveCustomer$).toBeObservable(expected);
    });
  });
  describe('UpdateCustomer', () => {
    it('should update a customer details', () => {
      const customerData = {
        customerId: '702',
        data: null
      };

      const updatedCustomer: CustomerInfo = null;

      const action = new UpdateCustomer(customerData);
      const outcome = new UpdateCustomerSuccess(updatedCustomer);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: updatedCustomer });
      customerDataService.updateCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.UpdateCustomer$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const customerData = {
        customerId: '702',
        data: null
      };
      const action = new UpdateCustomer(customerData);

      const error = new Error('some error');
      const outcome = new UpdateCustomerFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.updateCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.UpdateCustomer$).toBeObservable(expected);
    });
  });
  describe('searchCustomer', () => {
    it('should search customer', () => {
      const searchParam = {
        searchBy: SEARCH_BY_ENUM.MOBILE_NO,
        searchValue: '8970420911'
      };

      const customerDetail: CustomerInfo = null;

      const action = new SearchCustomer(searchParam);
      const outcome = new SearchCustomerSuccess(customerDetail);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: customerDetail });
      customerDataService.searchCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.searchCustomer$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const searchParam = {
        searchBy: SEARCH_BY_ENUM.MOBILE_NO,
        searchValue: '8970420911'
      };
      const action = new SearchCustomer(searchParam);

      const error = new Error('some error');
      const outcome = new SearchCustomerFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.searchCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.searchCustomer$).toBeObservable(expected);
    });
  });

  describe('getCustomer', () => {
    it('should search customer', () => {
      const searchParam = {
        searchBy: SEARCH_BY_ENUM.MOBILE_NO,
        searchValue: '8970420911'
      };

      const customerDetail: CustomerInfo = null;

      const action = new GetGhsCustomerDetails(searchParam);
      const outcome = new GetCustomerDetailsSuccess(customerDetail);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: customerDetail });
      customerDataService.searchCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.getCustomer$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const searchParam = {
        searchBy: SEARCH_BY_ENUM.MOBILE_NO,
        searchValue: '8970420911'
      };
      const action = new GetGhsCustomerDetails(searchParam);

      const error = new Error('some error');
      const outcome = new GetCustomerDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.searchCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.getCustomer$).toBeObservable(expected);
    });
  });

  describe('selectInternationalCustomer$', () => {
    it('should search customer', () => {
      const searchParam = {
        searchBy: SEARCH_BY_ENUM.MOBILE_NO,
        searchValue: '8970420911'
      };
      const customerRequestPayload = null;

      const customerDetail: CustomerInfo = null;

      const action = new SelectInternationalCustomer(
        SEARCH_BY_ENUM.PASSPORT_ID
      );
      const outcome = new SelectInternationalCustomerSuccess(customerDetail);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: customerDetail });
      customerDataService.searchCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.selectInternationalCustomer$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const searchParam = {
        searchBy: SEARCH_BY_ENUM.MOBILE_NO,
        searchValue: '8970420911'
      };
      const action = new SelectInternationalCustomer(
        SEARCH_BY_ENUM.PASSPORT_ID
      );

      const error = new Error('some error');
      const outcome = new SelectInternationalCustomerFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.searchCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.selectInternationalCustomer$).toBeObservable(expected);
    });
  });

  describe('selectedCustomerDetail', () => {
    it('should get selectedCustomerDetail', () => {
      const customerId = '702';

      const customerDetail: CreatedCustomerResponse = null;

      const action = new SelectedCustomerDetail({ customerId });
      const outcome = new SelectedCustomerDetailSuccess(customerDetail);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: customerDetail });
      customerDataService.getCustomerDetails.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.selectedCustomerDetail$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const customerId = '702';
      const action = new SelectedCustomerDetail({ customerId });

      const error = new Error('some error');
      const outcome = new SelectedCustomerDetailFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getCustomerDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.selectedCustomerDetail$).toBeObservable(expected);
    });
  });

  describe('loadZones', () => {
    it('should get list of zone', () => {
      const zoneList: Zone[] = [
        {
          description: 'Zone1',
          zoneCode: 1
        },
        {
          description: 'Zone2',
          zoneCode: 2
        },
        {
          description: 'Zone3',
          zoneCode: 3
        },
        {
          description: 'Zone4',
          zoneCode: 4
        }
      ];

      const action = new LoadZones();
      const outcome = new LoadZonesSuccess(zoneList);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: zoneList });
      zoneDataService.getZones.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadZones$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadZones();

      const error = new Error('some error');
      const outcome = new LoadZonesFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      zoneDataService.getZones.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadZones$).toBeObservable(expected);
    });
  });

  describe('loadSelectedCustomer', () => {
    it('should get loadSelectedCustomer', () => {
      const payload = {
        customerId: '702',
        enableClear: false,
        enableEdit: true,
        enableCreate: true
      };

      const customerInfo = null;
      const result = {
        customerInfo: customerInfo,
        enableClear: false,
        enableEdit: true,
        enableCreate: true
      };

      const action = new LoadSelectedCustomer(payload);
      const outcome = new LoadSelectedCustomerSuccess(result);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: customerInfo });
      customerDataService.getCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadSelectedCustomer$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const payload = {
        customerId: '702',
        enableClear: false,
        enableEdit: true,
        enableCreate: true
      };
      const action = new LoadSelectedCustomer(payload);

      const error = new Error('some error');
      const outcome = new LoadSelectedCustomerFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSelectedCustomer$).toBeObservable(expected);
    });
  });

  describe('loadAllowedTransactionTypes', () => {
    it('should get loadAllowedTransactionTypes', () => {
      const result: AllowedTransactionTypeMap = null;

      const action = new LoadAllowedTransactionTypes();
      const outcome = new LoadAllowedTransactionTypesSuccess(result);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: result });
      customerDataService.getAllowedTransactionTypes.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadAllowedTransactionTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadAllowedTransactionTypes();

      const error = new Error('some error');
      const outcome = new LoadAllowedTransactionTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getAllowedTransactionTypes.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadAllowedTransactionTypes$).toBeObservable(expected);
    });
  });

  describe('loadCustomerUniquePassport', () => {
    it('should return  is a unique Passport Id', () => {
      const requestParam = {
        searchType: 'PASSPORT_ID',
        value: 'ACJDIEEFLF'
      };
      const response = false;
      const action = new LoadCustomerUniquePassport(requestParam);
      const outcome = new LoadCustomerUniquePassportSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      customerDataService.getIsUniqueCustomer.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIsUniquepassport$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestParam = {
        searchType: 'PASSPORT_ID',
        value: 'customer@gmail.com'
      };
      const action = new LoadCustomerUniquePassport(requestParam);
      const error = new Error('some error');
      const outcome = new LoadCustomerUniquePassportFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getIsUniqueCustomer.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIsUniquepassport$).toBeObservable(expected);
    });
  });

  describe('loadIdProofs', () => {
    it('should return  a list of Id proof', () => {
      const requestParam = 'ID_PROOF';
      const response: CustomerLov[] = [
        {
          code: 'passport',
          isActive: true,
          value: 'Passport'
        }
      ];
      const action = new LoadIdProofs(requestParam);
      const outcome = new LoadIdProofsSuccess(response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: response });
      customerDataService.getCustomerLovs.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadIdProofs$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestParam = 'ID_PROOF';
      const action = new LoadIdProofs(requestParam);

      const error = new Error('some error');
      const outcome = new LoadIdProofsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getCustomerLovs.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadIdProofs$).toBeObservable(expected);
    });
  });

  describe('loadPanVerificationStatus', () => {
    it('should return  loadPanVerificationStatus', () => {
      const requestPayload = {
        panCardNo: 'BLOPJ2603A',
        vendorCode: 'PAN',
        verificationType: 'NUMBER'
      };
      const panVerificationResponse = {
        message: 'Invalid PAN',
        ownerName: 'ASSFS',
        verificationStatus: true
      };
      const action = new PanCardVerificationStatus(requestPayload);
      const outcome = new PanCardVerificationStatusSuccess(
        panVerificationResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: panVerificationResponse });
      customerDataService.validatePAN.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadPanVerificationStatus$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload = {
        panCardNo: 'BLOPJ2603A',
        vendorCode: 'PAN',
        verificationType: 'NUMBER'
      };
      const action = new PanCardVerificationStatus(requestPayload);

      const error = new Error('some error');
      const outcome = new PanCardVerificationStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.validatePAN.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadPanVerificationStatus$).toBeObservable(expected);
    });
  });

  describe('loadGstVerificationStatus', () => {
    it('should return  loadGstVerificationStatus', () => {
      const requestPayload = {
        gstIn: 'BLOPJ2603A',
        vendorCode: 'PAN'
      };
      const gstVerificationResponse = {
        errorMessage: 'Invalida GST',
        gstIn: 'ASJKWKO93322',
        status: true
      };
      const action = new GstCardVerificationStatus(requestPayload);
      const outcome = new GstCardVerificationStatusSuccess(
        gstVerificationResponse
      );
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: gstVerificationResponse });
      customerDataService.validateGST.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadGstVerificationStatus$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload = {
        gstIn: 'BLOPJ2603A',
        vendorCode: 'PAN'
      };
      const action = new GstCardVerificationStatus(requestPayload);

      const error = new Error('some error');
      const outcome = new GstCardVerificationStatusFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.validateGST.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGstVerificationStatus$).toBeObservable(expected);
    });
  });

  describe('loadBrandDetails', () => {
    it('should return  loadBrandDetails', () => {
      const requestPayload = '';
      const Response = null;
      const action = new LoadBrandDetails(requestPayload);
      const outcome = new LoadBrandDetailsSuccess(Response);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', { a: Response });
      customerDataService.getBrandByCode.and.returnValue(response$);

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadBrandDetails$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const requestPayload = '';
      const action = new LoadBrandDetails(requestPayload);

      const error = new Error('some error');
      const outcome = new LoadBrandDetailsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      customerDataService.getBrandByCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadBrandDetails$).toBeObservable(expected);
    });
  });
});
