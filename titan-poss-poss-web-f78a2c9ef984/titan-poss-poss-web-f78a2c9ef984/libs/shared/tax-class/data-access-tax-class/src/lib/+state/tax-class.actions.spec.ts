import {
  CustomErrors,
  LoadTaxClassListingPayload,
  LoadTaxClassListingSuccessPayload,
  TaxClassDetails
} from '@poss-web/shared/models';
import { EditTaxClassFormDetails, EditTaxClassFormDetailsFailure, EditTaxClassFormDetailsSuccess, LoadTaxClassDetailsByTaxClassCode, LoadTaxClassDetailsByTaxClassCodeFailure, LoadTaxClassDetailsByTaxClassCodeSuccess, LoadTaxClassListing, LoadTaxClassListingFailure, LoadTaxClassListingSuccess, SaveTaxClassFormDetails, SaveTaxClassFormDetailsFailure, SaveTaxClassFormDetailsSuccess, SearchTaxClassCode, SearchTaxClassCodeFailure, SearchTaxClassCodeSuccess, TaxClassActionTypes } from './tax-class.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Tax Class Action Testing Suite', () => {
  describe('LoadTaxClassListing Action Test Cases', () => {
    it('should check correct type is used for LoadTaxClassListing action', () => {
      const payload: LoadTaxClassListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const action = new LoadTaxClassListing(payload);
      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.LOAD_TAX_CLASS_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadTaxClassListingSuccess action', () => {
      const payload: LoadTaxClassListingSuccessPayload = {
        taxClassListing: [],
        totalElements: 0
      };

      const action = new LoadTaxClassListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.LOAD_TAX_CLASS_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTaxClassListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTaxClassListingFailure(payload);

      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.LOAD_TAX_CLASS_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadTaxClassDetailsByTaxClassCode Action Test Cases', () => {
    it('should check correct type is used for LoadTaxClassDetailsByTaxClassCode action', () => {
      const payload = ''

      const action = new LoadTaxClassDetailsByTaxClassCode(payload);
      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE,
        payload
      });
    });

    it('should check correct type is used for LoadTaxClassDetailsByTaxClassCodeSuccess action', () => {
      const payload: TaxClassDetails = {
        description: 'desc',
        isActive: true,
        taxClassCode: 'code'
      };

      const action = new LoadTaxClassDetailsByTaxClassCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadTaxClassDetailsByTaxClassCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadTaxClassDetailsByTaxClassCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.LOAD_TAX_CLASS_DETAILS_BY_TAXCLASSCODE_FAILURE,
        payload
      });
    });
  });

  describe('SaveTaxClassFormDetails Action Test Cases', () => {
    it('should check correct type is used for SaveTaxClassFormDetails action', () => {
      const payload: TaxClassDetails = {
        description: 'desc',
        isActive: true,
        taxClassCode: 'code'
      };

      const action = new SaveTaxClassFormDetails(payload);
      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.SAVE_TAX_CLASS_FORM_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveTaxClassFormDetailsSuccess action', () => {
      const payload: TaxClassDetails = {
        description: 'desc',
        isActive: true,
        taxClassCode: 'code'
      };

      const action = new SaveTaxClassFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.SAVE_TAX_CLASS_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveTaxClassFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveTaxClassFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.SAVE_TAX_CLASS_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditTaxClassFormDetails Action Test Cases', () => {
    it('should check correct type is used for EditTaxClassFormDetails action', () => {
      const payload: TaxClassDetails = {
        description: 'desc',
        isActive: true,
        taxClassCode: 'code'
      };

      const action = new EditTaxClassFormDetails(payload);
      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.EDIT_TAX_CLASS_FORM_DETAILS,
        payload
      });
    });

    it('should check correct type is used for EditTaxClassFormDetailsSuccess action', () => {
      const payload: TaxClassDetails = {
        description: 'desc',
        isActive: true,
        taxClassCode: 'code'
      };

      const action = new EditTaxClassFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.EDIT_TAX_CLASS_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditTaxClassFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditTaxClassFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.EDIT_TAX_CLASS_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SearchTaxClassCode Action Test Cases', () => {
    it('should check correct type is used for SearchTaxClassCode action', () => {
      const payload = 'src';

      const action = new SearchTaxClassCode(payload);
      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.SEARCH_TAX_CLASS_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SearchTaxClassCodeSuccess action', () => {
      const payload: TaxClassDetails[] = [{
        description: 'desc',
        isActive: true,
        taxClassCode: 'code'
      }];

      const action = new SearchTaxClassCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.SEARCH_TAX_CLASS_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchTaxClassCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchTaxClassCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: TaxClassActionTypes.SEARCH_TAX_CLASS_DETAILS_FAILURE,
        payload
      });
    });
  });

});
