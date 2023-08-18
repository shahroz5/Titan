import {
  CashPaymentConfiguration,
  CustomErrors,
  LoadLovListingSuccessPayload,
  LovMaster,
  LovMasterType
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  EditLovFormDetails,
  EditLovFormDetailsFailure,
  EditLovFormDetailsSuccess,
  LoadLovListing,
  LoadLovListingFailure,
  LoadLovListingSuccess,
  LoadLovTypes,
  LoadLovTypesFailure,
  LoadLovTypesSuccess,
  LovActionTypes,
  ResetLovMasterData,
  SaveLovFormDetails,
  SaveLovFormDetailsFailure,
  SaveLovFormDetailsSuccess
} from './lovmaster.actons';

describe('LOV Master Action Testing Suite', () => {
  describe('LoadLovTypes Action Test Cases', () => {
    it('should check correct type is used for LoadLovTypes action', () => {
      const action = new LoadLovTypes();
      expect({ ...action }).toEqual({
        type: LovActionTypes.LOAD_LOV_TYPES
      });
    });

    it('should check correct type is used for LoadLovTypesSuccess action', () => {
      const payload: LovMasterType[] = [
        {
          name: 'LOV_Name',
          value: 'LOV_Value'
        }
      ];

      const action = new LoadLovTypesSuccess(payload);
      expect({ ...action }).toEqual({
        type: LovActionTypes.LOAD_LOV_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadLovTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLovTypesFailure(payload);

      expect({ ...action }).toEqual({
        type: LovActionTypes.LOAD_LOV_TYPES_FAILURE,
        payload
      });
    });
  });

  describe('LoadLovListing Action Test Cases', () => {
    it('should check correct type is used for LoadLovListing action', () => {
      const payload = 'LOV_Name';

      const action = new LoadLovListing(payload);
      expect({ ...action }).toEqual({
        type: LovActionTypes.LOAD_LOV_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadLovListingSuccess action', () => {
      const payload: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            description: 'Desc',
            isActive: true,
            lovName: 'LOV_Name',
            lovType: 'LOV_Type'
          }
        ],
        totalElements: 1
      };

      const action = new LoadLovListingSuccess(payload);
      expect({ ...action }).toEqual({
        type: LovActionTypes.LOAD_LOV_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadLovListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLovListingFailure(payload);

      expect({ ...action }).toEqual({
        type: LovActionTypes.LOAD_LOV_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SaveLovFormDetails Action Test Cases', () => {
    it('should check correct type is used for SaveLovFormDetails action', () => {
      const payload: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const action = new SaveLovFormDetails(payload);
      expect({ ...action }).toEqual({
        type: LovActionTypes.SAVE_LOV_TOWN,
        payload
      });
    });

    it('should check correct type is used for SaveLovFormDetailsSuccess action', () => {
      const payload: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const action = new SaveLovFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: LovActionTypes.SAVE_LOV_TOWN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveLovFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveLovFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: LovActionTypes.SAVE_LOV_TOWN_FAILURE,
        payload
      });
    });
  });

  describe('EditLovFormDetails Action Test Cases', () => {
    it('should check correct type is used for EditLovFormDetails action', () => {
      const payload: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const action = new EditLovFormDetails(payload);
      expect({ ...action }).toEqual({
        type: LovActionTypes.EDIT_LOV_TOWN,
        payload
      });
    });

    it('should check correct type is used for EditLovFormDetailsSuccess action', () => {
      const payload: LoadLovListingSuccessPayload = {
        LovListing: [
          {
            description: 'Desc',
            isActive: true,
            lovName: 'LOV_Name',
            lovType: 'LOV_Type'
          }
        ],
        totalElements: 1
      };

      const action = new EditLovFormDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type: LovActionTypes.EDIT_LOV_TOWN_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditLovFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditLovFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: LovActionTypes.EDIT_LOV_TOWN_FAILURE,
        payload
      });
    });
  });

  describe('ResetLovMasterData Action Test Cases', () => {
    it('should check correct type is used for ResetLovMasterData action', () => {
      const action = new ResetLovMasterData();
      expect({ ...action }).toEqual({
        type: LovActionTypes.RESET_LOV_DIALOG_DATA
      });
    });
  });
});
