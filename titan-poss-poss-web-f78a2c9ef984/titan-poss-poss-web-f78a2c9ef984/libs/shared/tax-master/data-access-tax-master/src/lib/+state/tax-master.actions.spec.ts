import {
  CashPaymentConfiguration,
  CustomErrors,
  LoadTaxMasterListingPayload,
  LoadTaxMasterListingSuccessPayload,
  TaxMasterDetails
} from '@poss-web/shared/models';
import { EditTaxMasterFormDetails, EditTaxMasterFormDetailsFailure, EditTaxMasterFormDetailsSuccess, LoadTaxMasterDetailsByTaxCode, LoadTaxMasterDetailsByTaxCodeFailure, LoadTaxMasterDetailsByTaxCodeSuccess, LoadTaxMasterListing, LoadTaxMasterListingFailure, LoadTaxMasterListingSuccess, SaveTaxMasterFormDetails, SaveTaxMasterFormDetailsFailure, SaveTaxMasterFormDetailsSuccess, SearchTaxMasterCode, SearchTaxMasterCodeFailure, SearchTaxMasterCodeSuccess, TaxMasterActionTypes } from './tax-master.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Tax Master Action Testing Suite', () => {
  describe('LoadTaxMasterListing Action Test Cases', () => {
    it('should check correct type is used for LoadTaxMasterListing action', () => {
      const payload: LoadTaxMasterListingPayload = {
        pageIndex: 0,
        pageSize: 8
      };
      const action = new LoadTaxMasterListing(payload);
      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.LOAD_TAX_MASTER_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadTaxMasterListingSuccess action', () => {
      const payload: LoadTaxMasterListingSuccessPayload = {
        taxMasterListing: [],
        totalElements: 0
      };

      const action = new LoadTaxMasterListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.LOAD_TAX_MASTER_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTaxMasterListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTaxMasterListingFailure(payload);

      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.LOAD_TAX_MASTER_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadTaxMasterDetailsByTaxCode Action Test Cases', () => {
    it('should check correct type is used for LoadTaxMasterDetailsByTaxCode action', () => {
      const payload = ''

      const action = new LoadTaxMasterDetailsByTaxCode(payload);
      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.LOAD_TAX_MASTER_DETAILS_BY_TAXCODE,
        payload
      });
    });

    it('should check correct type is used for LoadTaxMasterDetailsByTaxCodeSuccess action', () => {
      const payload: TaxMasterDetails = {
        description: 'desc',
        isActive: true,
        taxCode: 'code',
        taxSystem: 'sys'
      };

      const action = new LoadTaxMasterDetailsByTaxCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.LOAD_TAX_MASTER_DETAILS_BY_TAXCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTaxMasterDetailsByTaxCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTaxMasterDetailsByTaxCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.LOAD_TAX_MASTER_DETAILS_BY_TAXCODE_FAILURE,
        payload
      });
    });
  });

  describe('SaveTaxMasterFormDetails Action Test Cases', () => {
    it('should check correct type is used for SaveTaxMasterFormDetails action', () => {
      const payload: TaxMasterDetails = {
        description: 'desc',
        isActive: true,
        taxCode: 'code',
        taxSystem: 'sys'
      };

      const action = new SaveTaxMasterFormDetails(payload);
      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.SAVE_TAX_MASTER_FORM_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveTaxMasterFormDetailsSuccess action', () => {
      const payload: TaxMasterDetails = {
        description: 'desc',
        isActive: true,
        taxCode: 'code',
        taxSystem: 'sys'
      };

      const action = new SaveTaxMasterFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.SAVE_TAX_MASTER_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveTaxMasterFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveTaxMasterFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.SAVE_TAX_MASTER_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditTaxMasterFormDetails Action Test Cases', () => {
    it('should check correct type is used for EditTaxMasterFormDetails action', () => {
      const payload: TaxMasterDetails = {
        description: 'desc',
        isActive: true,
        taxCode: 'code',
        taxSystem: 'sys'
      };

      const action = new EditTaxMasterFormDetails(payload);
      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.EDIT_TAX_MASTER_FORM_DETAILS,
        payload
      });
    });

    it('should check correct type is used for EditTaxMasterFormDetailsSuccess action', () => {
      const payload: TaxMasterDetails = {
        description: 'desc',
        isActive: true,
        taxCode: 'code',
        taxSystem: 'sys'
      };

      const action = new EditTaxMasterFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.EDIT_TAX_MASTER_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditTaxMasterFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditTaxMasterFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.EDIT_TAX_MASTER_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SearchTaxMasterCode Action Test Cases', () => {
    it('should check correct type is used for SearchTaxMasterCode action', () => {
      const payload = 'src';

      const action = new SearchTaxMasterCode(payload);
      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.SEARCH_TAX_MASTER_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SearchTaxMasterCodeSuccess action', () => {
      const payload: TaxMasterDetails[] = [{
        description: 'desc',
        isActive: true,
        taxCode: 'code',
        taxSystem: 'sys'
      }];

      const action = new SearchTaxMasterCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.SEARCH_TAX_MASTER_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchTaxMasterCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchTaxMasterCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: TaxMasterActionTypes.SEARCH_TAX_MASTER_DETAILS_FAILURE,
        payload
      });
    });
  });

});
