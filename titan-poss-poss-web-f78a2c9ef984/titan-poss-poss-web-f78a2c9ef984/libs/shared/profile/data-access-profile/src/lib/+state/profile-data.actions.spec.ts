import {
  CustomErrors,
  ProfileData,
  RoleData,
  RoleDetail,
  RoleRequest,
  RolesPage,
  RoleTypesData
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ClearProfileData,
  LoadProfileData,
  LoadProfileDataFailure,
  LoadProfileDataSuccess,
  ProfileDataActionTypes
} from './profile-data.actions';

describe('Profile Data Action Testing Suite', () => {
  describe('ClearProfileData Action Test Cases', () => {
    it('should check correct type is used for Clear Profile Data action ', () => {
      const payload = 'Role';
      const action = new ClearProfileData();
      expect({ ...action }).toEqual({
        type: ProfileDataActionTypes.CLEAR_PROFILE_DATA
      });
    });
  });
  describe('LoadProfileData Action Test Cases', () => {
    it('should check correct type is used for LOAD_PROFILE_DATA action ', () => {
      const action = new LoadProfileData();
      expect({ ...action }).toEqual({
        type: ProfileDataActionTypes.LOAD_PROFILE_DATA
      });
    });

    it('should check correct type is used for LOAD_PROFILE_DATA_SUCCESS action ', () => {
      const payload: ProfileData = {
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

      const action = new LoadProfileDataSuccess(payload);
      expect({ ...action }).toEqual({
        type: ProfileDataActionTypes.LOAD_PROFILE_DATA_SUCCESS,
        payload
      });
    });

    it('should check correct type is used for FetchRoleFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadProfileDataFailure(payload);
      expect({ ...action }).toEqual({
        type: ProfileDataActionTypes.LOAD_PROFILE_DATA_FAILURE,
        payload
      });
    });
  });
});
