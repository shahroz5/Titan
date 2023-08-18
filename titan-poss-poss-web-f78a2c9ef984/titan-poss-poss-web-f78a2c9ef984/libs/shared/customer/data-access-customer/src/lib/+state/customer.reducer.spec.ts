import * as moment from 'moment';
import * as actions from './customer.actions';
import {
  CountrySummary,
  StateSummary,
  TownSummary,
  PincodeSummary,
  CustomerLov,
  CustomerInfo,
  Zone,
  CreatedCustomerResponse,
  SEARCH_BY_ENUM
} from '@poss-web/shared/models';
import { CustomerState } from './customer.state';
import { initialState, CustomerReducer } from './customer.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

const dummyCustomerDetail: CreatedCustomerResponse = {
  customerId: '702',
  title: 'Mr',
  customerName: 'Customerone',
  customerType: 'REGULAR',
  ulpId: '4626',
  mobileNumber: '8970420911',
  emailId: 'customerone@gmail.com',
  instiTaxNo: '1234567890poiuy',
  custTaxNo: 'BLOPJ2603A',
  isPulseCustomer: false,
  isMemberBlocked: false,
  currentTier: null,
  customerDetails: {
    type: 'REGULAR',
    data: {
      addressLines: ['Address line1', 'Address line2', 'Address line3'],
      pinCode: '560010',
      city: 'Banglore',
      state: 'karnataka',
      country: 'qew1',
      zone: 'Zone 1',
      catchmentName: 'Rajajinagar',
      birthday: moment(1585679400000),
      spouseBirthday: moment(1585765800000),
      anniversary: moment(1586975400000),
      canSendSMS: true,
      altContactNo: null
    }
  },
  isActive: true,
  loyaltyDetails: {
    data: {
      anniversary: '',
      anniversaryDiscount: '',
      anniversaryValidityPeriod: '',
      birthday: '',
      birthdayDiscount: '',
      birthdayValdityPeriod: '',
      child1BirthdayDiscount: '',
      child1BirthdayValidityPeriod: '',
      child2BirthdayDiscount: '',
      child2BirthdayValidityPeriod: '',
      spouseBirthday: '',
      spouseBirthdayDiscount: '',
      spouseBirthdayValidityPeriod: ''
    },
    type: 'REGULAR'
  }
};

const dummyResponseData: CustomerInfo = {
  customerId: '702',
  title: 'Mr',
  customerName: 'Customerone',
  customerType: 'REGULAR',
  ulpId: '4626',
  mobileNumber: '8970420911',
  emailId: 'customerone@gmail.com',
  instiTaxNo: '1234567890poiuy',
  custTaxNo: 'BLOPJ2603A',
  isActive: true,
  customerDetails: {
    type: 'REGULAR',
    data: {
      addressLines: ['Address line1', 'Address line2', 'Address line3'],
      pinCode: '560010',
      city: 'Banglore',
      state: 'karnataka',
      country: 'qew1',
      zone: 'Zone 1',
      catchmentName: 'Rajajinagar',
      birthday: moment(1585679400000),
      spouseBirthday: moment(1585765800000),
      anniversary: moment(1586975400000),
      canSendSMS: true,
      altContactNo: null
    }
  },
  passportId: 'IND123',
  pointBalance: 2561.25,
  currentTier: 'Gold',
  enrollmentDate: moment(1589182198987),
  isMemberBlocked: false,
  isPulseCustomer: false,
  loyaltyDetails: {
    data: {
      anniversary: '',
      anniversaryDiscount: '',
      anniversaryValidityPeriod: '',
      birthday: '',
      birthdayDiscount: '',
      birthdayValdityPeriod: '',
      child1BirthdayDiscount: '',
      child1BirthdayValidityPeriod: '',
      child2BirthdayDiscount: '',
      child2BirthdayValidityPeriod: '',
      spouseBirthday: '',
      spouseBirthdayDiscount: '',
      spouseBirthdayValidityPeriod: ''
    },
    type: 'REGULAR'
  }
};

describe('Customer reducer Testing Suite', () => {
  const getCountryList = (
    countryCode: string,
    description: string,
    isdCode: string
  ): CountrySummary => ({
    countryCode,
    description,
    isdCode
  });

  const countryList1 = getCountryList('IND', 'India', '+91');
  const countryList2 = getCountryList('UK', 'United Kingdom', '+44');

  describe('Testing Load country list Functionality ', () => {
    beforeEach(() => {});
    it('LoadCountriesSuccess should return list of country', () => {
      const listOfCountry = [countryList1, countryList2];
      const action = new actions.LoadCountriesSuccess(listOfCountry);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.countries.ids.length).toBe(2);
    });

    it('LoadCountriesFailure should return error', () => {
      const action = new actions.LoadCountriesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Load state list Functionality ', () => {
    beforeEach(() => {});
    it('LoadCountriesSuccess should return list of country', () => {
      const listOfStates: any[] = [
        {
          stateId: 1,
          description: 'Karnataka'
        }
      ];
      const action = new actions.LoadStatesSuccess(listOfStates);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.states.ids.length).toBe(1);
    });

    it('LoadStatesFailure should return error', () => {
      const action = new actions.LoadStatesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing Load town list Functionality ', () => {
    beforeEach(() => {});
    it('LoadTownsSuccess should return list of country', () => {
      const listOfTowns: TownSummary[] = [
        {
          townCode: 1,
          description: 'Banglore'
        }
      ];
      const action = new actions.LoadTownsSuccess(listOfTowns);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.city.length).toBe(1);
    });

    it('LoadTownsFailure should return error', () => {
      const action = new actions.LoadTownsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCustomerUniqueMobile Functionality ', () => {
    beforeEach(() => {});
    it('LoadCustomerUniqueMobile should return boolean value', () => {
      const data = false;
      const action = new actions.LoadCustomerUniqueMobileSuccess(data);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isUniqueCustomer).toBe(false);
    });

    it('LoadCustomerUniqueMobileFailure should return error', () => {
      const action = new actions.LoadCustomerUniqueMobileFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCustomerUniqueEmail Functionality ', () => {
    beforeEach(() => {});
    it('LoadCustomerUniqueEmail should return boolean value', () => {
      const data = false;
      const action = new actions.LoadCustomerUniqueEmailSuccess(data);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isUniqueEmail).toBe(false);
    });

    it('LoadCustomerUniqueEmailFailure should return error', () => {
      const action = new actions.LoadCustomerUniqueEmailFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadAllowedTransactionTypes Functionality ', () => {
    beforeEach(() => {});

    it('LoadAllowedTransactionTypes should return allowedTransactionTypes value', () => {
      const data = undefined;
      const action = new actions.LoadAllowedTransactionTypes();

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.allowedTransactionTypes).toBe(null);
    });

    it('LoadAllowedTransactionTypesSuccess should return allowedTransactionTypes value', () => {
      const data = null;
      const action = new actions.LoadAllowedTransactionTypesSuccess(data);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.allowedTransactionTypes).toBe(null);
    });

    it('LoadAllowedTransactionTypesFailure should return error', () => {
      const action = new actions.LoadAllowedTransactionTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.searchError.message).toEqual('some error');
    });
  });

  describe('Testing LoadCustomerUniquePan Functionality ', () => {
    beforeEach(() => {});
    it('LoadCustomerUniquePan should return boolean value', () => {
      const data = false;
      const action = new actions.LoadCustomerUniquePanSuccess(data);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isUniquePan).toBe(false);
    });

    it('LoadCustomerUniquePanFailure should return error', () => {
      const action = new actions.LoadCustomerUniquePanFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCustomerUniqueGst Functionality ', () => {
    beforeEach(() => {});
    it('LoadCustomerUniqueGst should return boolean value', () => {
      const data = false;
      const action = new actions.LoadCustomerUniqueGstSuccess(data);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isUniqueGst).toBe(false);
    });

    it('LoadCustomerUniqueGstFailure should return error', () => {
      const action = new actions.LoadCustomerUniqueGstFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadUniquePassport Functionality ', () => {
    beforeEach(() => {});
    it('LoadUniquePassport should return boolean value', () => {
      const data = false;
      const action = new actions.LoadCustomerUniquePassportSuccess(data);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isUniquePassport).toBe(false);
    });

    it('LoadUniquePassport should return error', () => {
      const action = new actions.LoadCustomerUniquePassportFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadPincode Functionality ', () => {
    beforeEach(() => {});
    it('LoadPincode should return pincode summary', () => {
      const pincodeSummary: PincodeSummary = {
        townName: 'Banglore',
        stateName: 'Karnataka',
        cachementArea: ['Rajajinagar']
      };
      const action = new actions.LoadPincodeSuccess(pincodeSummary);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.pincode).toBe(pincodeSummary);
    });

    it('LoadPincodeFailure should return error', () => {
      const action = new actions.LoadPincodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SelectInternationalCustomer Functionality ', () => {
    beforeEach(() => {});

    it('SelectInternationalCustomer should return customer info', () => {
      const requestPayload = false;
      const action = new actions.SelectInternationalCustomer('ASDF');

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('SelectInternationalCustomerSuccss should return customer info', () => {
      const requestPayload = null;
      const action = new actions.SelectInternationalCustomerSuccess(
        requestPayload
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.selectedCustomer).toBe(requestPayload);
    });

    it('SelectInternationalCustomerFailure should return error', () => {
      const action = new actions.SelectInternationalCustomerFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadBrandDetails Functionality ', () => {
    beforeEach(() => {});

    it('LoadBrandDetails should return customer info', () => {
      const requestPayload = 'Tanishaq';
      const action = new actions.LoadBrandDetails(requestPayload);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
    it('LoadBrandDetailsSuccss should return customer info', () => {
      const requestPayload = null;
      const action = new actions.LoadBrandDetailsSuccess(requestPayload);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.brandDetails).toBe(requestPayload);
    });

    it('LoadBrandDetailsFailure should return error', () => {
      const action = new actions.LoadBrandDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadSalutations Functionality ', () => {
    beforeEach(() => {});
    it('LoadSalutations should return list of salutations', () => {
      const salutations: CustomerLov[] = [
        {
          code: 'Mr',
          value: 'Mr',
          isActive: true
        }
      ];
      const action = new actions.LoadSalutationsSuccess(salutations);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.salutations.length).toBe(1);
    });

    it('LoadSalutationsFailure should return error', () => {
      const action = new actions.LoadSalutationsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadCountryCode Functionality ', () => {
    beforeEach(() => {});
    it('LoadCountryCode should return country code', () => {
      const countryCode = 'IND';
      const action = new actions.LoadCountryCodeSuccess(countryCode);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.countryCode).toBe('IND');
    });

    it('LoadCountryCodeFailure should return error', () => {
      const action = new actions.LoadCountryCodeFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveCustomerFormDetails Functionality ', () => {
    beforeEach(() => {});
    it('SaveCustomerFormDetails should return selected customer', () => {
      const customerData: CustomerInfo = dummyResponseData;
      const action = new actions.SaveCustomerFormDetails(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isCustomerSaving).toBe(true);
    });

    it('SaveCustomerFormDetailsSuccess should return selected customer', () => {
      const customerData: CustomerInfo = dummyResponseData;
      const action = new actions.SaveCustomerFormDetailsSuccess(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.selectedCustomer).toBe(customerData);
      expect(result.isCustomerSaving).toBe(false);
    });

    it('SaveCustomerFormDetailsFailure should return error', () => {
      const action = new actions.SaveCustomerFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing PanCardVerificationStatus Functionality ', () => {
    beforeEach(() => {});
    it('PanCardVerificationStatus should return selected customer', () => {
      const customerData = null;
      const action = new actions.PanCardVerificationStatus(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });

    it('PanCardVerificationStatusSuccess should return selected customer', () => {
      const customerData = null;
      const action = new actions.PanCardVerificationStatusSuccess(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.panVerificationResponse).toBe(null);
    });

    it('PanCardVerificationStatusFailure should return error', () => {
      const action = new actions.PanCardVerificationStatusFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing GstCardVerificationStatus Functionality ', () => {
    beforeEach(() => {});
    it('GstCardVerificationStatus should return selected customer', () => {
      const customerData = null;
      const action = new actions.GstCardVerificationStatus(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });

    it('GstCardVerificationStatusSuccess should return selected customer', () => {
      const customerData = null;
      const action = new actions.GstCardVerificationStatusSuccess(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.gstVerificationResponse).toBe(null);
    });

    it('GstCardVerificationStatusFailure should return error', () => {
      const action = new actions.GstCardVerificationStatusFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateCustomer Functionality ', () => {
    beforeEach(() => {});
    it('UpdateCustomer should update the customer detail', () => {
      const customerData: CustomerInfo = dummyResponseData;
      const action = new actions.UpdateCustomerSuccess(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.selectedCustomer).toBe(customerData);
      expect(result.isLoading).toBe(false);
    });

    it('UpdateCustomerFailure should return error', () => {
      const action = new actions.UpdateCustomerFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchCustomer Functionality ', () => {
    beforeEach(() => {});
    it('SearchCustomer should return customer detail', () => {
      const customerData: CustomerInfo = dummyResponseData;
      const action = new actions.SearchCustomerSuccess(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.searchCustomerResult).toBe(customerData);
      expect(result.isSearchingCustomer).toBe(false);
      expect(result.hasCustomerResult).toBe(true);
    });

    it('SearchCustomerFailure should return error', () => {
      const action = new actions.SearchCustomerFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.searchError.message).toEqual('some error');
    });
  });

  describe('Testing LoadZones Functionality ', () => {
    beforeEach(() => {});
    it('LoadZones should return list of zone', () => {
      const listOfZone: Zone[] = [
        {
          description: 'Zone 1',
          zoneCode: 1
        }
      ];
      const action = new actions.LoadZonesSuccess(listOfZone);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.zones.ids.length).toBe(1);
    });

    it('LoadZonesFailure should return error', () => {
      const action = new actions.LoadZonesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SelectedCustomerDetail Functionality ', () => {
    beforeEach(() => {});
    it('SelectedCustomerDetail should return detail about customer', () => {
      const customerData: CreatedCustomerResponse = dummyCustomerDetail;
      const action = new actions.SelectedCustomerDetail(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.selectedCustomerDetail).toBe(null);
    });

    it('SelectedCustomerDetailSuccess should return detail about customer', () => {
      const customerData: CreatedCustomerResponse = dummyCustomerDetail;
      const action = new actions.SelectedCustomerDetailSuccess(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.selectedCustomerDetail).toBe(customerData);
    });

    it('SelectedCustomerDetailFailure should return error', () => {
      const action = new actions.SelectedCustomerDetailFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadSelectedCustomer Functionality ', () => {
    beforeEach(() => {});
    it('LoadSelectedCustomer should return detail about customer', () => {
      const customerData: CustomerInfo = dummyResponseData;
      const action = new actions.LoadSelectedCustomerSuccess({
        customerInfo: customerData,
        enableClear: true,
        enableEdit: true,
        enableCreate: true
      });

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.selectedCustomer).toEqual(customerData);
    });

    it('LoadSelectedCustomerFailure should return error', () => {
      const action = new actions.LoadSelectedCustomerFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });

    it('ClearCustomerSearch should return error', () => {
      const action = new actions.ClearCustomerSearch();

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.isSearchingCustomer).toEqual(false);
    });

    it('ClearUpdatedCustomer should return error', () => {
      const action = new actions.ClearUpdatedCustomer();

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.updatedCustomerStatus).toEqual(false);
    });

    it('ClearSelectedCustomer should return error', () => {
      const action = new actions.ClearSelectedCustomer();

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.selectedCustomer).toEqual(null);
    });

    it('EnableCustomerCreate should return error', () => {
      const action = new actions.EnableCustomerCreate();

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.enableCreate).toEqual(true);
    });

    it('DisableCustomerCreate should return error', () => {
      const action = new actions.DisableCustomerCreate();

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.enableCreate).toEqual(false);
    });

    // it('LoadSelectedCustomer should selected customer Detail', () => {
    //   const action = new actions.LoadSelectedCustomer(null);

    //   const result: CustomerState = CustomerReducer(initialState, action);

    //   expect(result.selectedCustomer).toEqual(null);
    // });
  });

  describe('Testing GetGHSCustomerDetail Functionality ', () => {
    beforeEach(() => {});
    it('GetGHSCustomerDetail return detail about customer', () => {
      const customerData: CreatedCustomerResponse = dummyCustomerDetail;
      const action = new actions.GetGhsCustomerDetails({
        searchBy: SEARCH_BY_ENUM.MOBILE_NO,
        searchValue: '8970420911'
      });

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.customerDetails).toBe(null);
    });

    it('SelectedCustomerDetailSuccess should return detail about customer', () => {
      const customerData: CustomerInfo = null;
      const action = new actions.GetCustomerDetailsSuccess(customerData);

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.customerDetails).toBe(null);
    });

    it('SelectedCustomerDetailFailure should return error', () => {
      const action = new actions.GetCustomerDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: CustomerState = CustomerReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });
});
