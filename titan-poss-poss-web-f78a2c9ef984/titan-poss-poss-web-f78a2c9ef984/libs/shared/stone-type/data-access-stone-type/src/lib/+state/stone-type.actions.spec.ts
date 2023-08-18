import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import {
  CustomErrors,
  LoadStoneTypeListingPayload,
  LoadStoneTypeListingSuccessPayload,
  SaveStoneTypeFormDetailsPayload,
  StoneTypeDetails
} from '@poss-web/shared/models';

import {
  StoneTypeActionTypes,
  LoadStoneTypeDetails,
  LoadStoneTypeDetailsSuccess,
  LoadStoneTypeDetailsFailure,
  LoadStoneTypeByStoneTypeCode,
  LoadStoneTypeByStoneTypeCodeSuccess,
  LoadStoneTypeByStoneTypeCodeFailure,
  ResetStoneTypeDialog,
  SaveStoneTypeFormDetails,
  SaveStoneTypeFormDetailsSuccess,
  SaveStoneTypeFormDetailsFailure,
  EditStoneTypeFormDetails,
  EditStoneTypeFormDetailsSuccess,
  EditStoneTypeFormDetailsFailure,
  SearchStoneTypeCode,
  SearchStoneTypeCodeSuccess,
  SearchStoneTypeCodeFailure
} from './stone-type.actions';

describe('Stone type Action Testing Suite', () => {
  //stone type
  describe('LoadStoneTypeDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadStoneTypeDetails action ', () => {
      const payload: LoadStoneTypeListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadStoneTypeDetails(payload);
      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for  LoadStoneTypeDetailsSuccess action ', () => {
      const payload: LoadStoneTypeListingSuccessPayload = {
        stoneTypeListing: [],
        totalElements: 0
      };
      const action = new LoadStoneTypeDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadStoneTypeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStoneTypeDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_FAILURE,
        payload
      });
    });
  });

  // stone type by stone type code
  describe('LoadStoneTypeByStoneTypeCode Action Test Cases', () => {
    it('should check correct type is used for  LoadStoneTypeByStoneTypeCode action ', () => {
      const payload = 'abc';
      const action = new LoadStoneTypeByStoneTypeCode(payload);
      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE,
        payload
      });
    });
    it('should check correct type is used for LoadStoneTypeByStoneTypeCodeSuccess action ', () => {
      const payload: StoneTypeDetails = {
        stoneTypeCode: 'ABC',
        description: 'ABC',
        configDetails: { karatageWeightPrint: 'ABC' },
        isActive: true
      };
      const action = new LoadStoneTypeByStoneTypeCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadStoneTypeByStoneTypeCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStoneTypeByStoneTypeCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
          StoneTypeActionTypes.LOAD_STONE_TYPE_DETAILS_BY_STONE_TYPECODE_FAILURE,
        payload
      });
    });
  });

  describe('EditStoneTypeFormDetails Action Test Cases', () => {
    it('should check correct type is used for  EditStoneTypeFormDetails action ', () => {
      const payload: SaveStoneTypeFormDetailsPayload = {
        stoneTypeCode: 'ABC',
        description: 'ABC',
        configDetails: { karatageWeightPrint: 'ABC' },
        isActive: true
      };
      const action = new EditStoneTypeFormDetails(payload);
      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.EDIT_STONE_TYPE_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditStoneTypeFormDetailsSuccess action ', () => {
      const payload: StoneTypeDetails = {
        stoneTypeCode: 'ABC',
        description: 'ABC',
        configDetails: { karatageWeightPrint: 'ABC' },
        isActive: true
      };

      const action = new EditStoneTypeFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.EDIT_STONE_TYPE_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditStoneTypeFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditStoneTypeFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.EDIT_STONE_TYPE_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveStoneTypeFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveStoneTypeFormDetails action ', () => {
      const payload: SaveStoneTypeFormDetailsPayload = {
        stoneTypeCode: 'ABC',
        description: 'ABC',
        configDetails: { karatageWeightPrint: 'ABC' },
        isActive: true
      };
      const action = new SaveStoneTypeFormDetails(payload);
      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.SAVE_STONE_TYPE_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveStoneTypeFormDetailsSuccess action ', () => {
      const payload: StoneTypeDetails = {
        stoneTypeCode: 'ABC',
        description: 'ABC',
        configDetails: { karatageWeightPrint: 'ABC' },
        isActive: true
      };

      const action = new SaveStoneTypeFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.SAVE_STONE_TYPE_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveStoneTypeFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveStoneTypeFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.SAVE_STONE_TYPE_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });
  describe('SearchStoneTypeCode Action Test Cases', () => {
    it('should check correct type is used for  SearchStoneTypeCode action ', () => {
      const payload = 'ABC';
      const action = new SearchStoneTypeCode(payload);
      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.SEARCH_STONE_TYPE_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SearchStoneTypeCodeSuccess action ', () => {
      const payload: StoneTypeDetails[] = [
        {
          stoneTypeCode: 'ABC',
          description: 'ABC',
          configDetails: { karatageWeightPrint: 'ABC' },
          isActive: true
        }
      ];
      const action = new SearchStoneTypeCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.SEARCH_STONE_TYPE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchStoneTypeCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchStoneTypeCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.SEARCH_STONE_TYPE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('ResetStoneTypeDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetStoneTypeDialog action ', () => {
      const action = new ResetStoneTypeDialog();
      expect({ ...action }).toEqual({
        type: StoneTypeActionTypes.RESET_STONE_TYPE_DIALOG_DATA
      });
    });
  });
});
