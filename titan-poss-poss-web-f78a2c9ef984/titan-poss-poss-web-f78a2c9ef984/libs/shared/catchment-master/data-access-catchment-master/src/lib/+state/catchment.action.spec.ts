import {
  CatchmentDetails,
  CustomErrors,
  LoadCatchmentListingPayload,
  LoadCatchmentListingSuccessPayload
} from '@poss-web/shared/models';
import {
  CatchmentActionTypes,
  EditCatchmentFormDetails,
  EditCatchmentFormDetailsFailure,
  EditCatchmentFormDetailsSuccess,
  LoadCatchmentDetails,
  LoadCatchmentDetailsFailure,
  LoadCatchmentDetailsSuccess,
  LoadCatchmentListing,
  LoadCatchmentListingFailure,
  LoadCatchmentListingSuccess,
  SaveCatchmentFormDetails,
  SaveCatchmentFormDetailsFailure,
  SaveCatchmentFormDetailsSuccess,
  SearchCatchmentCode,
  SearchCatchmentCodeFailure,
  SearchCatchmentCodeSuccess
} from './catchment.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Catchment Action Testing Suite', () => {
  describe('LoadCatchmentListing Action Test Cases', () => {
    it('should check correct type is used for LoadCatchmentListing action', () => {
      const payload: LoadCatchmentListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadCatchmentListing(payload);
      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.LOAD_CATCHMENT_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadCatchmentListingSuccess action', () => {
      const payload: LoadCatchmentListingSuccessPayload = {
        catchmentListing: [
          {
            catchmentCode: 'Code',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };

      const action = new LoadCatchmentListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.LOAD_CATCHMENT_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCatchmentListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCatchmentListingFailure(payload);

      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.LOAD_CATCHMENT_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadCatchmentDetails Action Test Cases', () => {
    it('should check correct type is used for LoadCatchmentDetails action', () => {
      const payload = '';
      const action = new LoadCatchmentDetails(payload);
      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.LOAD_CATCHMENT_DETAILS,
        payload
      });
    });

    it('should check correct type is used for LoadCatchmentDetailsSuccess action', () => {
      const payload: CatchmentDetails = {
        catchmentCode: 'Code',
        description: 'Desc',
        isActive: true
      };

      const action = new LoadCatchmentDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.LOAD_CATCHMENT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadCatchmentDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadCatchmentDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.LOAD_CATCHMENT_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveCatchmentFormDetails Action Test Cases', () => {
    const payload: CatchmentDetails = {
      catchmentCode: 'Code',
      description: 'Desc',
      isActive: true
    };
    it('should check correct type is used for SaveCatchmentFormDetails action', () => {
      const action = new SaveCatchmentFormDetails(payload);
      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.SAVE_CATCHMENT_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveCatchmentFormDetailsSuccess action', () => {
      const action = new SaveCatchmentFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.SAVE_CATCHMENT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveCatchmentFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveCatchmentFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.SAVE_CATCHMENT_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditCatchmentFormDetails Action Test Cases', () => {
    const payload: CatchmentDetails = {
      catchmentCode: 'Code',
      description: 'Desc',
      isActive: true
    };
    it('should check correct type is used for EditCatchmentFormDetails action', () => {
      const action = new EditCatchmentFormDetails(payload);
      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.EDIT_CATCHMENT_DETAILS,
        payload
      });
    });

    it('should check correct type is used for EditCatchmentFormDetailsSuccess action', () => {
      const action = new EditCatchmentFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.EDIT_CATCHMENT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditCatchmentFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditCatchmentFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.EDIT_CATCHMENT_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SearchCatchmentCode Action Test Cases', () => {
    it('should check correct type is used for SearchCatchmentCode action', () => {
      const payload = '';
      const action = new SearchCatchmentCode(payload);
      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.SEARCH_CATCHMENT_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SearchCatchmentCodeSuccess action', () => {
      const payload: LoadCatchmentListingSuccessPayload = {
        catchmentListing: [
          {
            catchmentCode: 'Code',
            description: 'Desc',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new SearchCatchmentCodeSuccess(payload);
      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.SEARCH_CATCHMENT_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchCatchmentCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchCatchmentCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: CatchmentActionTypes.SEARCH_CATCHMENT_DETAILS_FAILURE,
        payload
      });
    });
  });
});
