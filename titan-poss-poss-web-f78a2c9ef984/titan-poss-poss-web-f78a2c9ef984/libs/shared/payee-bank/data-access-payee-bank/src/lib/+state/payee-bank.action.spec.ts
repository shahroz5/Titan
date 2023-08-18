import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadPayeeBankListingPayload,
  CustomErrors,
  LoadPayeeBankListingSuccessPayload,
  PayeeBankDetails,
  SavePayeeBankFormPayload,
  PayeeBankGLCodePayload,
  PayeeBankGLCodeDetails,
  SaveGLcodeDetails,
  GlCodeDefaultsPayload,
  PayeeGLCodeDetailsSuccessList,
  GlSelectMappedLocations,
  LocationCodeDetails
} from '@poss-web/shared/models';
import {
  PayeeBankActionTypes,
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
  SearchPayeebankNameFailure,
  LoadPayeeBankGlCodeDetails,
  LoadPayeeBankGlCodeDetailsSuccess,
  LoadPayeeBankGlCodeDetailsFailure,
  SavePayeeBankGlCodeDetails,
  SavePayeeBankGlCodeDetailsSuccess,
  SavePayeeBankGlCodeDetailsFailure,
  ResetGlCodeDetails,
  ResetBankDetails,
  GetLocationCodes,
  GetLocationCodesSuccess,
  GetLocationCodesFailure,
  GetGlCodeIsDefaults,
  GetGlCodeIsDefaultsSuccess,
  GetGlCodeIsDefaultsFailure,
  LoadMappedLocations,
  LoadMappedLocationsSuccess,
  LoadMappedLocationsFailure,
  UpdateGlCodeDetails,
  DeleteGlCodeDetails
} from './payee-bank.action';

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

describe('Stone type Action Testing Suite', () => {
  //stone type
  describe('LoadPayeeBankDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadPayeeBankDetails action ', () => {
      const payload: LoadPayeeBankListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadPayeeBankDetails(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.LOAD_PAYEE_BANK_LISTING,
        payload
      });
    });
    it('should check correct type is used for  LoadPayeeBankDetailsSuccess action ', () => {
      const payload: LoadPayeeBankListingSuccessPayload = {
        payeeBankListing: [payeeBank],
        totalElements: 1
      };
      const action = new LoadPayeeBankDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.LOAD_PAYEE_BANK_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPayeeBankDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPayeeBankDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.LOAD_PAYEE_BANK_LISTING_FAILURE,
        payload
      });
    });
  });

  // stone type by stone type code
  describe('LoadPayeeBankByPayeeBankName Action Test Cases', () => {
    it('should check correct type is used for  LoadPayeeBankByPayeeBankName action ', () => {
      const payload = 'abc';
      const action = new LoadPayeeBankByPayeeBankName(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME,
        payload
      });
    });
    it('should check correct type is used for LoadPayeeBankByPayeeBankNameSuccess action ', () => {
      const payload = payeeBank;
      const action = new LoadPayeeBankByPayeeBankNameSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          PayeeBankActionTypes.LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPayeeBankByPayeeBankNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPayeeBankByPayeeBankNameFailure(payload);

      expect({ ...action }).toEqual({
        type:
          PayeeBankActionTypes.LOAD_PAYEE_BANK_DETAILS_BY_PAYEE_BANKNAME_FAILURE,
        payload
      });
    });
  });

  describe('EditPayeeBankFormDetails Action Test Cases', () => {
    it('should check correct type is used for  EditPayeeBankFormDetails action ', () => {
      const payload: SavePayeeBankFormPayload = {
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
      const action = new EditPayeeBankFormDetails(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.EDIT_PAYEE_BANK_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditPayeeBankFormDetailsSuccess action ', () => {
      const payload = payeeBank;

      const action = new EditPayeeBankFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.EDIT_PAYEE_BANK_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditPayeeBankFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditPayeeBankFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.EDIT_PAYEE_BANK_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SavePayeeBankFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SavePayeeBankFormDetails action ', () => {
      const payload: SavePayeeBankFormPayload = {
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
      const action = new SavePayeeBankFormDetails(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.SAVE_PAYEE_BANK_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SavePayeeBankFormDetailsSuccess action ', () => {
      const payload = payeeBank;

      const action = new SavePayeeBankFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.SAVE_PAYEE_BANK_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SavePayeeBankFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SavePayeeBankFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.SAVE_PAYEE_BANK_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('SearchPayeebankName Action Test Cases', () => {
    it('should check correct type is used for  SearchPayeebankName action ', () => {
      const payload = 'ABC';
      const action = new SearchPayeebankName(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.SEARCH_PAYEE_BANK_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SearchPayeebankNameSuccess action ', () => {
      const payload = [payeeBank];
      const action = new SearchPayeebankNameSuccess(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.SEARCH_PAYEE_BANK_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchPayeebankNameFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchPayeebankNameFailure(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.SEARCH_PAYEE_BANK_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadPayeeBankGlCodeDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadPayeeBankGlCodeDetails action ', () => {
      const payload: PayeeBankGLCodePayload = {
        payloadData: {
          bankName: 'AMEX',
          locationCode: ['CPD'],
          paymentCode: ['CASH']
        },
        pageEvent: { pageIndex: 0, pageSize: 100 },
        isPageable: true
      };
      const action = new LoadPayeeBankGlCodeDetails(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.LOAD_PAYEE_BANK_GL_CODE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadPayeeBankGlCodeDetailsSuccess action ', () => {
      const payload: PayeeGLCodeDetailsSuccessList = {
        locationList: [],
        count: 0
      };
      const action = new LoadPayeeBankGlCodeDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.LOAD_PAYEE_BANK_GL_CODE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPayeeBankGlCodeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPayeeBankGlCodeDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.LOAD_PAYEE_BANK_GL_CODE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SavePayeeBankGlCodeDetails Action Test Cases', () => {
    it('should check correct type is used for  SavePayeeBankGlCodeDetails action ', () => {
      const payload: SaveGLcodeDetails = {
        bankName: 'AMEX',
        addLocations: ['CPD'],
        addPaymentCodes: ['CASH'],
        removeLocations: [],
        removePaymentCodes: [],
        updateConfigs: []
      };
      const action = new SavePayeeBankGlCodeDetails(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.SAVE_PAYEE_BANK_GL_CODE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  SavePayeeBankGlCodeDetailsSuccess action ', () => {
      const payload: PayeeBankGLCodeDetails = {
        id: 'XXXAAA',
        bankName: 'XYZ',
        locationCode: 'CPD',
        paymentCode: 'CASH',
        glCode: 222222,
        isDefault: true
      };
      const action = new SavePayeeBankGlCodeDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.SAVE_PAYEE_BANK_GL_CODE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SavePayeeBankGlCodeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SavePayeeBankGlCodeDetailsFailure(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.SAVE_PAYEE_BANK_GL_CODE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('GetLocationCodes Action Test Cases', () => {
    it('should check correct type is used for  GetLocationCodes action ', () => {
      const action = new GetLocationCodes();
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.GET_LOCATIONS
      });
    });
    it('should check correct type is used for  GetLocationCodesSuccess action ', () => {
      const payload: LocationCodeDetails[] = [
        {
          locationCode: 'CPD',
          description: 'Delhi'
        }
      ];
      const action = new GetLocationCodesSuccess(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.GET_LOCATIONS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  GetLocationCodesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetLocationCodesFailure(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.GET_LOCATIONS_FAILURE,
        payload
      });
    });
  });
  describe('LoadMappedLocations Action Test Cases', () => {
    it('should check correct type is used for  LoadMappedLocations action ', () => {
      const payload: PayeeBankGLCodePayload = {
        payloadData: {
          bankName: 'AMEX',
          locationCode: ['CPD'],
          paymentCode: ['CASH']
        },
        pageEvent: { pageIndex: 0, pageSize: 100 },
        isPageable: true
      };
      const action = new LoadMappedLocations(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.GET_MAPPED_LOCATIONS,
        payload
      });
    });
    it('should check correct type is used for  LoadMappedLocationsSuccess action ', () => {
      const payload: GlSelectMappedLocations[] = [
        {
          id: '111222',
          description: 'Delhi'
        }
      ];
      const action = new LoadMappedLocationsSuccess(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.GET_MAPPED_LOCATIONS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMappedLocationsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMappedLocationsFailure(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.GET_MAPPED_LOCATIONS_FAILURE,
        payload
      });
    });
  });

  describe('GetGlCodeIsDefaults Action Test Cases', () => {
    it('should check correct type is used for  GetGlCodeIsDefaults action ', () => {
      const payload: GlCodeDefaultsPayload = {
        defaultList: [
          {
            locationCode: 'CPD',
            paymentCode: 'CASH'
          }
        ]
      };
      const action = new GetGlCodeIsDefaults(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.CHECK_GL_CODE_DEFAULTS,
        payload
      });
    });
    it('should check correct type is used for  GetGlCodeIsDefaultsSuccess action ', () => {
      const payload: PayeeBankGLCodeDetails[] = [
        {
          id: 'XXXAAA',
          bankName: 'XYZ',
          locationCode: 'CPD',
          paymentCode: 'CASH',
          glCode: 222222,
          isDefault: true
        }
      ];
      const action = new GetGlCodeIsDefaultsSuccess(payload);

      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.CHECK_GL_CODE_DEFAULTS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  GetGlCodeIsDefaultsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new GetGlCodeIsDefaultsFailure(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.CHECK_GL_CODE_DEFAULTS_FAILURE,
        payload
      });
    });
  });
  describe('ResetBankDetails Action Test Cases', () => {
    it('should check correct type is used for  ResetStoneTypeDialog action ', () => {
      const action = new ResetBankDetails();
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.RESET_BANK_DETAILS
      });
    });
  });

  describe('ResetGlCodeDetails Action Test Cases', () => {
    it('should check correct type is used for  ResetStoneTypeDialog action ', () => {
      const action = new ResetGlCodeDetails();
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.RESET_GL_CODE_DETAILS
      });
    });
  });
  describe('UpdateGlCodeDetails Action Test Cases', () => {
    it('should check correct type is used for  DELETE_GL_CODE_DETAILS action ', () => {
      const payload = {
        id: '1111',
        glCode: 32222,
        isDefault: true
      };
      const action = new UpdateGlCodeDetails(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.UPDATE_GL_CODE_DETAILS,
        payload
      });
    });
  });

  describe('DeleteGlCodeDetails Action Test Cases', () => {
    it('should check correct type is used for  DeleteGlCodeDetails action ', () => {
      const payload = '1111';

      const action = new DeleteGlCodeDetails(payload);
      expect({ ...action }).toEqual({
        type: PayeeBankActionTypes.DELETE_GL_CODE_DETAILS,
        payload
      });
    });
  });
});
