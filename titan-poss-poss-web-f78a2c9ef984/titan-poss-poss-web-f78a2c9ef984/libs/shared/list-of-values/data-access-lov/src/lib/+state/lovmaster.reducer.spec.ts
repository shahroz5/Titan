import {
  LoadLovListingSuccessPayload,
  LovMaster,
  LovMasterType,
  LovMasterTypeMain
} from '@poss-web/shared/models';
import * as actions from './lovmaster.actons';
import { LovMasterState } from './lovmaster.state';
import { LovMasterReducer, initialState as istate } from './lovmaster.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('LOV Master Reducer Testing Suite', () => {
  const initialState: LovMasterState = { ...istate };

  const responsePayload: LoadLovListingSuccessPayload = {
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

  describe('Testing LovMasterReducer Functionality', () => {
    it('LovMasterReducer should be called', () => {
      const action = new actions.LoadLovTypes();

      const result: LovMasterState = LovMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadLovTypesSuccess should return list', () => {
      const payload: LovMasterType[] = [
        {
          name: 'LOV_Name',
          value: 'LOV_Value'
        }
      ];
      const action = new actions.LoadLovTypesSuccess(payload);
      const result: LovMasterState = LovMasterReducer(initialState, action);

      expect(result.lovMasterTypes[0].name).toBe('LOV_Name');
      expect(result.isLoading).toBe(false);
    });
    it('LoadLovTypesFailure should return error', () => {
      const action = new actions.LoadLovTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LovMasterState = LovMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadLovTypesMain Functionality', () => {
    it('LoadLovTypesMain should be called', () => {
      const action = new actions.LoadLovTypesMain();

      const result: LovMasterState = LovMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadLovTypesMainSuccess should return list', () => {
      const payload: LovMasterTypeMain[] = [
        {
          name: 'LOV_Name',
          value: 'LOV_Value'
        }
      ];
      const action = new actions.LoadLovTypesMainSuccess(payload);
      const result: LovMasterState = LovMasterReducer(initialState, action);

      expect(result.isLoading).toBe(false);
    });
    it('LoadLovTypesMainFailure should return error', () => {
      const action = new actions.LoadLovTypesMainFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LovMasterState = LovMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadLovListing Functionality', () => {
    it('LoadLovListing should be called', () => {
      const action = new actions.LoadLovListing('LOV_Name');

      const result: LovMasterState = LovMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadLovListingSuccess should return list', () => {
      const action = new actions.LoadLovListingSuccess(responsePayload);
      const result: LovMasterState = LovMasterReducer(initialState, action);

      expect(result.lovMasterListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadLovListingFailure should return error', () => {
      const action = new actions.LoadLovListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: LovMasterState = LovMasterReducer(initialState, action);

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveLovFormDetails Functionality', () => {
    it('SaveLovFormDetails should be called', () => {
      const payload1: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const action = new actions.SaveLovFormDetails(payload1);
      const result: LovMasterState = LovMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveLovFormDetailsSuccess should return list', () => {
      const payload1: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };
      const action = new actions.SaveLovFormDetailsSuccess(payload1);
      const result: LovMasterState = LovMasterReducer(initialState, action);
      expect(result.saveLovMasterDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SaveLovFormDetailsFailure should return error', () => {
      const action = new actions.SaveLovFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: LovMasterState = LovMasterReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditLovFormDetails Functionality', () => {
    it('EditLovFormDetails should be called', () => {
      const payload1: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };

      const action = new actions.EditLovFormDetails(payload1);
      const result: LovMasterState = LovMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('EditLovFormDetailsSuccess should return list', () => {
      const payload1: LovMaster = {
        lovName: 'LOV_Name',
        description: 'Desc',
        isActive: true,
        lovType: 'LOV_Type'
      };
      const action = new actions.EditLovFormDetailsSuccess(responsePayload);
      const result: LovMasterState = LovMasterReducer(initialState, action);
      expect(result.saveLovMasterDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('EditLovFormDetailsFailure should return error', () => {
      const action = new actions.EditLovFormDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: LovMasterState = LovMasterReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ResetLovMasterData Functionality', () => {
    it('ResetLovMasterData should be called', () => {
      const action = new actions.ResetLovMasterData();
      const result: LovMasterState = LovMasterReducer(initialState, action);
      expect(result.isLoading).toEqual(false);
      expect(result.error).toEqual(null);
    });
  });
});
