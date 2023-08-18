import { ProfileDataState } from './profile-data.state';
import { initialState, ProfileDataReducer } from './profile-data.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './profile-data.actions';
import { ProfileData } from '@poss-web/shared/models';

describe('Profile Data reducer Testing Suite', () => {
  describe('Testing ClearProfileData Functionality', () => {
    beforeEach(() => {});
    it('Testing CLEAR_PROFILE_DATA', () => {
      const action = new actions.ClearProfileData();
      const result: ProfileDataState = ProfileDataReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });

  describe('Testing LoadProfileData Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_PROFILE_DATA', () => {
      const action = new actions.LoadProfileData();
      const result: ProfileDataState = ProfileDataReducer(initialState, action);
      expect(result.error).toBe(null);
    });

    it('LOAD_PROFILE_DATA_SUCCESS should return Profile Data', () => {
      const profileData: ProfileData = {
        empName: 'System Admin',
        email: 'abcd@titan.com',
        userType: 'CORP',
        boutiqueType: 'ORG',
        boutiqueCode: '',
        boutiqueDesc: '',
        isBTQUser: false,
        isCorpUser: true,
        isRegUser: false,
        regionCode: null,
        isL1Boutique: false,
        isL2Boutique: false,
        isL3Boutique: false,
        orgCode: 'TJ',
        address: null
      };
      const action = new actions.LoadProfileDataSuccess(profileData);
      const result: ProfileDataState = ProfileDataReducer(initialState, action);
      expect(result.error).toBe(null);
      expect(result.email).toEqual(action.payload.email);
      expect(result.empName).toEqual(action.payload.empName);
      expect(result.userType).toEqual(action.payload.userType);
      expect(result.boutiqueCode).toEqual(action.payload.boutiqueCode);
      expect(result.boutiqueDesc).toEqual(action.payload.boutiqueDesc);
      expect(result.boutiqueType).toEqual(action.payload.boutiqueType);
      expect(result.isBTQUser).toEqual(action.payload.isBTQUser);
      expect(result.isCorpUser).toEqual(action.payload.isCorpUser);
      expect(result.isRegUser).toEqual(action.payload.isRegUser);
      expect(result.regionCode).toEqual(action.payload.regionCode);
      expect(result.isL1Boutique).toEqual(action.payload.isL1Boutique);
      expect(result.isL2Boutique).toEqual(action.payload.isL2Boutique);
      expect(result.isL3Boutique).toEqual(action.payload.isL3Boutique);
      expect(result.orgCode).toEqual(action.payload.orgCode);
    });

    it('LOAD_PROFILE_DATA_FAILURE should return error', () => {
      const action = new actions.LoadProfileDataFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: ProfileDataState = ProfileDataReducer(initialState, action);
      expect(result.error.message).toEqual('some error');
    });
  });
});
