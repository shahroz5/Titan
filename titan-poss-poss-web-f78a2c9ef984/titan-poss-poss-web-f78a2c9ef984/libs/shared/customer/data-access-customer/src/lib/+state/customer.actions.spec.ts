import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadCountries,
  CustomerActionTypes,
  LoadCountriesSuccess,
  LoadCountriesFailure,
  LoadStates,
  LoadStatesSuccess,
  LoadStatesFailure,
  LoadTowns,
  LoadTownsSuccess,
  LoadTownsFailure,
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
  LoadCustomerUniqueGstSuccess,
  LoadCustomerUniqueGstFailure,
  LoadPincode,
  LoadPincodeSuccess,
  LoadPincodeFailure,
  LoadSalutations,
  LoadSalutationsSuccess,
  LoadSalutationsFailure,
  LoadCountryCode,
  LoadCountryCodeSuccess,
  LoadCountryCodeFailure,
  SaveCustomerFormDetails,
  SaveCustomerFormDetailsSuccess,
  SaveCustomerFormDetailsFailure,
  UpdateCustomer,
  UpdateCustomerSuccess,
  UpdateCustomerFailure,
  ResetError,
  SearchCustomer,
  SearchCustomerSuccess,
  SearchCustomerFailure,
  ClearCustomerSearch,
  ClearSelectedCustomer,
  SelectCustomer,
  LoadZonesSuccess,
  LoadZones,
  LoadZonesFailure,
  SelectedCustomerDetail,
  SelectedCustomerDetailSuccess,
  SelectedCustomerDetailFailure,
  LoadSelectedCustomerSuccess,
  LoadSelectedCustomerFailure,
  LoadSelectedCustomer,
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
  ClearUpdatedCustomer,
  SelectInternationalCustomer,
  SelectInternationalCustomerSuccess,
  SelectInternationalCustomerFailure,
  LoadBrandDetails,
  LoadBrandDetailsSuccess,
  LoadBrandDetailsFailure,
  GetGhsCustomerDetails,
  GetCustomerDetailsSuccess,
  GetCustomerDetailsFailure,
  EnableCustomerCreate,
  DisableCustomerCreate,
  EnableCustomerEdit,
  DisableCustomerEdit
} from './customer.actions';
import {
  CountrySummary,
  CustomErrors,
  StateSummary,
  TownSummary,
  PincodeSummary,
  CustomerLov,
  Customers,
  CustomerInfo,
  UpdateCustomerDetail,
  Zone,
  CreatedCustomerResponse,
  SEARCH_BY_ENUM,
  PanVerificationRequestPayload,
  ValidatePanResponse,
  GstVerificationRequestPayload,
  ValidateGstResponse,
  Brand
} from '@poss-web/shared/models';

describe('Customer Action Testing Suite', () => {
  describe('LoadCountries Action Test Cases', () => {
    it('should check correct type is used for  LoadCountries action ', () => {
      const action = new LoadCountries();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_COUNTRIES
      });
    });
    it('should check correct type is used for  LoadCountriesSuccess action ', () => {
      const payload: CountrySummary[] = [];
      const action = new LoadCountriesSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_COUNTRIES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCountriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountriesFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_COUNTRIES_FAILURE,
        payload
      });
    });
  });
  describe('LoadStates Action Test Cases', () => {
    it('should check correct type is used for  LoadStates action ', () => {
      const payload = 'IND';
      const action = new LoadStates(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_STATES,
        payload
      });
    });
    it('should check correct type is used for  LoadStatesSuccess action ', () => {
      const payload: any[] = [];
      const action = new LoadStatesSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_STATES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCountriesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStatesFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_STATES_FAILURE,
        payload
      });
    });
  });
  describe('LoadTowns Action Test Cases', () => {
    it('should check correct type is used for  LoadTowns action ', () => {
      const payload = '1';
      const action = new LoadTowns(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_TOWNS,
        payload
      });
    });
    it('should check correct type is used for  LoadTownsSuccess action ', () => {
      const payload: TownSummary[] = [];
      const action = new LoadTownsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_TOWNS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadTownsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTownsFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_TOWNS_FAILURE,
        payload
      });
    });
  });
  describe('LoadCustomerUniqueMobile Action Test Cases', () => {
    it('should check correct type is used for  LoadCustomerUniqueMobile action ', () => {
      const payload = {
        searchType: 'MOBILE_NO',
        value: '8095319938'
      };
      const action = new LoadCustomerUniqueMobile(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_MOBILE,
        payload
      });
    });
    it('should check correct type is used for  LoadCustomerUniqueMobileSuccess action ', () => {
      const payload = true;
      const action = new LoadCustomerUniqueMobileSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_MOBILE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCustomerUniqueMobileFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCustomerUniqueMobileFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_MOBILE_FAILURE,
        payload
      });
    });
  });
  describe('LoadCustomerUniqueEmail Action Test Cases', () => {
    it('should check correct type is used for  LoadCustomerUniqueMobile action ', () => {
      const payload = {
        searchType: 'EMAIL_ID',
        value: 'customer@gmail.com'
      };
      const action = new LoadCustomerUniqueEmail(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_EMAIL,
        payload
      });
    });
    it('should check correct type is used for  LoadCustomerUniqueEmailSuccess action ', () => {
      const payload = true;
      const action = new LoadCustomerUniqueEmailSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_EMAIL_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCustomerUniqueEmailFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCustomerUniqueEmailFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_EMAIL_FAILURE,
        payload
      });
    });
  });
  describe('LoadCustomerUniquePan Action Test Cases', () => {
    it('should check correct type is used for  LoadCustomerUniquePan action ', () => {
      const payload = {
        searchType: 'CUSTOMER_TAX_NO',
        value: 'BLOPJ2603A'
      };
      const action = new LoadCustomerUniquePan(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PAN,
        payload
      });
    });
    it('should check correct type is used for  LoadCustomerUniquePanSuccess action ', () => {
      const payload = true;
      const action = new LoadCustomerUniquePanSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PAN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCustomerUniquePanFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCustomerUniquePanFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PAN_FAILURE,
        payload
      });
    });
  });
  describe('LoadCustomerUniqueGst Action Test Cases', () => {
    it('should check correct type is used for  LoadCustomerUniqueGst action ', () => {
      const payload = {
        searchType: 'INSTITUTIONAL_TAX_NO',
        value: '18AABCT3518Q1ZV'
      };
      const action = new LoadCustomerUniqueGst(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_GST,
        payload
      });
    });
    it('should check correct type is used for  LoadCustomerUniqueGstSuccess action ', () => {
      const payload = true;
      const action = new LoadCustomerUniqueGstSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_GST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadCustomerUniqueGstFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCustomerUniqueGstFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_GST_FAILURE,
        payload
      });
    });
  });
  describe('LoadPincode Action Test Cases', () => {
    it('should check correct type is used for LoadPincode action ', () => {
      const payload = {
        countryCode: 'IND',
        pincode: '571313'
      };
      const action = new LoadPincode(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_PINCODE,
        payload
      });
    });
    it('should check correct type is used for  LoadPincodeSuccess action ', () => {
      const payload: PincodeSummary = null;
      const action = new LoadPincodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_PINCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadPincodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPincodeFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_PINCODE_FAILURE,
        payload
      });
    });
  });
  describe('LoadSalutations Action Test Cases', () => {
    it('should check correct type is used for LoadSalutations action ', () => {
      const payload = 'SALUTATIONS';
      const action = new LoadSalutations(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_SALUTATIONS,
        payload
      });
    });
    it('should check correct type is used for  LoadSalutationsSuccess action ', () => {
      const payload: CustomerLov[] = [];
      const action = new LoadSalutationsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_SALUTATIONS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSalutationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSalutationsFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_SALUTATIONS_FAILURE,
        payload
      });
    });
  });
  describe('LoadCountryCode Action Test Cases', () => {
    it('should check correct type is used for LoadCountryCode action ', () => {
      const action = new LoadCountryCode();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_COUNTRY_CODE
      });
    });
    it('should check correct type is used for  LoadCountryCodeSuccess action ', () => {
      const payload = 'IND';
      const action = new LoadCountryCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_COUNTRY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCountryCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCountryCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_COUNTRY_CODE_FAILURE,
        payload
      });
    });
  });
  describe('SaveCustomerFormDetails Action Test Cases', () => {
    it('should check correct type is used for SaveCustomerFormDetails action ', () => {
      const payload: Customers = null;
      const action = new SaveCustomerFormDetails(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SAVE_CUSTOMER_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  SaveCustomerFormDetailsSuccess action ', () => {
      const payload: CustomerInfo = null;
      const action = new SaveCustomerFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SAVE_CUSTOMER_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveCustomerFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCustomerFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SAVE_CUSTOMER_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('UpdateCustomer Action Test Cases', () => {
    it('should check correct type is used for UpdateCustomer action ', () => {
      const payload: UpdateCustomerDetail = null;
      const action = new UpdateCustomer(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.UPDATE_CUSTOMER,
        payload
      });
    });
    it('should check correct type is used for  UpdateCustomerSuccess action ', () => {
      const payload: CustomerInfo = null;
      const action = new UpdateCustomerSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.UPDATE_CUSTOMER_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateCustomerFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateCustomerFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.UPDATE_CUSTOMER_FAILURE,
        payload
      });
    });
  });
  describe('ResetError Action Test Cases', () => {
    it('should check correct type is used for ResetError action ', () => {
      const action = new ResetError();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.RESET_ERROR
      });
    });
  });
  describe('SearchCustomer Action Test Cases', () => {
    it('should check correct type is used for SearchCustomer action ', () => {
      const payload = {
        searchBy: SEARCH_BY_ENUM.MOBILE_NO,
        searchValue: '8970420911'
      };
      const action = new SearchCustomer(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SEARCH_CUSTOMER,
        payload
      });
    });
    it('should check correct type is used for  SearchCustomerSuccess action ', () => {
      const payload: CustomerInfo = null;
      const action = new SearchCustomerSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SEARCH_CUSTOMER_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchCustomerFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCustomerFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SEARCH_CUSTOMER_FAILURE,
        payload
      });
    });
  });
  describe('ClearCustomerSearch Action Test Cases', () => {
    it('should check correct type is used for ClearCustomerSearch action ', () => {
      const action = new ClearCustomerSearch();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.CLEAR_CUSTOMER_SEARCH
      });
    });
  });
  describe('ClearSelectedCustomer Action Test Cases', () => {
    it('should check correct type is used for ClearSelectedCustomer action ', () => {
      const action = new ClearSelectedCustomer();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.CLEAR_SELECTED_CUSTOMER
      });
    });
  });

  describe('EnableCustomerCreate Action Test Cases', () => {
    it('should check correct type is used for EnableCustomerCreate action ', () => {
      const action = new EnableCustomerCreate();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.ENABLE_CUSTOMER_CREATE
      });
    });
  });

  describe('DisableCustomerCreate Action Test Cases', () => {
    it('should check correct type is used for DisableCustomerCreate action ', () => {
      const action = new DisableCustomerCreate();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.DISABLE_CUSTOMER_CREATE
      });
    });
  });

  describe('EnableCustomerEdit Action Test Cases', () => {
    it('should check correct type is used for EnableCustomerEdit action ', () => {
      const action = new EnableCustomerEdit();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.ENABLE_CUSTOMER_EDIT
      });
    });
  });

  describe('DisableCustomerEdit Action Test Cases', () => {
    it('should check correct type is used for DisableCustomerEdit action ', () => {
      const action = new DisableCustomerEdit();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.DISABLE_CUSTOMER_EDIT
      });
    });
  });

  describe('ClearUpdatedCustomer Action Test Cases', () => {
    it('should check correct type is used for ClearUpdatedCustomer action ', () => {
      const action = new ClearUpdatedCustomer();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.CLEAR_UPDATED_CUSTOMER
      });
    });
  });

  describe('SelectCustomer Action Test Cases', () => {
    it('should check correct type is used for SelectCustomer action ', () => {
      const payload: CustomerInfo = null;
      const action = new SelectCustomer(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SELECT_CUSTOMER,
        payload
      });
    });
  });
  describe('LoadZones Action Test Cases', () => {
    it('should check correct type is used for LoadZones action ', () => {
      const action = new LoadZones();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_ZONES
      });
    });
    it('should check correct type is used for  LoadZonesSuccess action ', () => {
      const payload: Zone[] = [];
      const action = new LoadZonesSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_ZONES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadZonesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadZonesFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_ZONES_FAILURE,
        payload
      });
    });
  });
  describe('SelectedCustomerDetail Action Test Cases', () => {
    it('should check correct type is used for SelectedCustomerDetail action ', () => {
      const payload = { customerId: '702' };
      const action = new SelectedCustomerDetail(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SELECTED_CUSTOMER_DETAIL,
        payload
      });
    });
    it('should check correct type is used for  SelectedCustomerDetailSuccess action ', () => {
      const payload: CreatedCustomerResponse = null;
      const action = new SelectedCustomerDetailSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SELECTED_CUSTOMER_DETAIL_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SelectedCustomerDetailFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SelectedCustomerDetailFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SELECTED_CUSTOMER_DETAIL_FAILURE,
        payload
      });
    });
  });

  describe('SelectInternationalCustomer Action Test Cases', () => {
    it('should check correct type is used for SelectInternationalCustomer action ', () => {
      const payload = '702';
      const action = new SelectInternationalCustomer(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SELECT_INTERNATIONAL_CUSTOMER,
        payload
      });
    });
    it('should check correct type is used for  SelectInternationalCustomerSuccess action ', () => {
      const payload: CustomerInfo = null;
      const action = new SelectInternationalCustomerSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SELECT_INTERNATIONAL_CUSTOMER_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SelectInternationalCustomerFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SelectInternationalCustomerFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.SELECT_INTERNATIONAL_CUSTOMER_FAILURE,
        payload
      });
    });
  });

  describe('LoadBrandDetails Action Test Cases', () => {
    it('should check correct type is used for LoadBrandDetails action ', () => {
      const payload = '702';
      const action = new LoadBrandDetails(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_BRAND_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadBrandDetailsSuccess action ', () => {
      const payload: Brand = null;
      const action = new LoadBrandDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_BRAND_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadBrandDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadBrandDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_BRAND_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadSelectedCustomer Action Test Cases', () => {
    it('should check correct type is used for LoadSelectedCustomer action ', () => {
      const payload = {
        customerId: '123',
        enableClear: true,
        enableEdit: true,
        enableCreate: true
      };
      const action = new LoadSelectedCustomer(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_SELECTED_CUSTOMER,
        payload
      });
    });
    it('should check correct type is used for  LoadSelectedCustomerSuccess action ', () => {
      const payload = {
        customerInfo: null,
        enableClear: true,
        enableEdit: true,
        enableCreate: true
      };
      const action = new LoadSelectedCustomerSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_SELECTED_CUSTOMER_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSelectedCustomerFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSelectedCustomerFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_SELECTED_CUSTOMER_FAILURE,
        payload
      });
    });
  });

  describe('LoadAllowedTransactionTypes Action Test Cases', () => {
    it('should check correct type is used for LoadAllowedTransactionTypes action ', () => {
      const action = new LoadAllowedTransactionTypes();

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_ALLOWED_TRANSACTIONTYPES
      });
    });
    it('should check correct type is used for  LoadAllowedTransactionTypesSuccess action ', () => {
      const payload = null;
      const action = new LoadAllowedTransactionTypesSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_ALLOWED_TRANSACTIONTYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadAllowedTransactionTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllowedTransactionTypesFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_ALLOWED_TRANSACTIONTYPES_FAILURE,
        payload
      });
    });
  });

  describe('LoadCustomerUniquePassport Action Test Cases', () => {
    it('should check correct type is used for LoadCustomerUniquePassport action ', () => {
      const payload = {
        searchType: SEARCH_BY_ENUM.PASSPORT_ID,
        value: '8970420911'
      };
      const action = new LoadCustomerUniquePassport(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PASSPORT,
        payload
      });
    });
    it('should check correct type is used for  LoadCustomerUniquePassportSuccess action ', () => {
      const payload = false;
      const action = new LoadCustomerUniquePassportSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PASSPORT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCustomerUniquePassportFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCustomerUniquePassportFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_CUSTOMER_UNIQUE_PASSPORT_FAILURE,
        payload
      });
    });
  });

  describe('LoadIdProofs Action Test Cases', () => {
    it('should check correct type is used for LoadIdProofs action ', () => {
      const payload = 'ID_PROOF';
      const action = new LoadIdProofs(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_ID_PROOFS,
        payload
      });
    });
    it('should check correct type is used for  LoadIdProofsSuccess action ', () => {
      const payload: CustomerLov[] = [];
      const action = new LoadIdProofsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_ID_PROOFS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadIdProofsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadIdProofsFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.LOAD_ID_PROOFS_FAILURE,
        payload
      });
    });
  });

  describe('GetGhsCustomerDetails Action Test Cases', () => {
    it('should check correct type is used for GetGhsCustomerDetails action ', () => {
      const payload = {
        searchBy: SEARCH_BY_ENUM.PASSPORT_ID,
        searchValue: '8970420911'
      };
      const action = new GetGhsCustomerDetails(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.GET_GHS_CUSTOMER_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  GetGhsCustomerDetailsSuccess action ', () => {
      const payload: CustomerInfo = null;
      const action = new GetCustomerDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.GET_GHS_CUSTOMER_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for GetCustomerDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetCustomerDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.GET_GHS_CUSTOMER_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('PAN verification Action Test Cases', () => {
    it('should check correct type is used for PAN verification action ', () => {
      const payload: PanVerificationRequestPayload = {
        panCardNo: 'BLOPJ2603A',
        vendorCode: 'PAN',
        verificationType: 'NUMBER',
        panDocument: null
      };
      const action = new PanCardVerificationStatus(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.PAN_CARD_VERIFICATION_STATUS,
        payload
      });
    });
    it('should check correct type is used for  PanCardVerificationStatusSuccess action ', () => {
      const payload: ValidatePanResponse = null;
      const action = new PanCardVerificationStatusSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.PAN_CARD_VERIFICATION_STATUS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for PanCardVerificationStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new PanCardVerificationStatusFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.PAN_CARD_VERIFICATION_STATUS_FAILURE,
        payload
      });
    });
  });

  describe('GST verification Action Test Cases', () => {
    it('should check correct type is used for GST verification action ', () => {
      const payload: GstVerificationRequestPayload = {
        gstIn: 'BLOPJ2603A',
        vendorCode: 'PAN'
      };
      const action = new GstCardVerificationStatus(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.GST_CARD_VERIFICATION_STATUS,
        payload
      });
    });
    it('should check correct type is used for  GstCardVerificationStatusSuccess action ', () => {
      const payload: ValidateGstResponse = null;
      const action = new GstCardVerificationStatusSuccess(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.GST_CARD_VERIFICATION_STATUS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for GstCardVerificationStatusFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GstCardVerificationStatusFailure(payload);

      expect({ ...action }).toEqual({
        type: CustomerActionTypes.GST_CARD_VERIFICATION_STATUS_FAILURE,
        payload
      });
    });
  });
});
