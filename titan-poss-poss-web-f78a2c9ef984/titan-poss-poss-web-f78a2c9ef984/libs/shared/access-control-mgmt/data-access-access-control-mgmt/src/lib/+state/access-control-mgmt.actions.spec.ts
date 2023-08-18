import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  AccessControlManagementActionTypes,
  ClearAcl,
  LoadAcl,
  LoadAclFailure,
  LoadAclSuccess,
  LoadFeatures,
  LoadFeaturesFailure,
  LoadFeaturesSuccess,
  LoadModules,
  LoadModulesFailure,
  LoadModulesSuccess,
  LoadRoles,
  LoadRolesFailure,
  LoadRolesSuccess,
  LoadSubModules,
  LoadSubModulesFailure,
  LoadSubModulesSuccess,
  ResetError,
  UpdateAcl,
  UpdateAclFailure,
  UpdateAclSuccess
} from './access-control-mgmt.actions';
import {
  ACLDetails,
  ACLLoadRequest,
  ACLModuleDetails,
  ACLRole,
  ACLUpdateRequest,
  CustomErrors
} from '@poss-web/shared/models';

describe('Access Control Action Testing Suite', () => {
  describe('LoadAcl Action Test Cases', () => {
    it('should check correct type is used for LoadAcl action ', () => {
      const payload: ACLLoadRequest = {
        aclGroupCode: '',
        roleCode: ''
      };
      const action = new LoadAcl(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_ACL,
        payload
      });
    });
    it('should check correct type is used for LoadAclSuccess action ', () => {
      const payload: ACLDetails[] = [
        {
          aclCode: 'A0',
          description: 'aclcodes',
          isAssigned: false
        }
      ];
      const action = new LoadAclSuccess(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_ACL_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadAclFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAclFailure(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_ACL_FAILURE,
        payload
      });
    });
  });

  describe('Other Action Test Cases', () => {
    it('should check correct type is used for ClearAcl action ', () => {
      const action = new ClearAcl();
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.CLEAR_ACL
      });
    });

    it('should check correct type is used for ResetError action ', () => {
      const action = new ResetError();
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.RESET_ERROR
      });
    });
  });

  describe('UpdateAcl Action Test Cases', () => {
    it('should check correct type is used for UpdateAcl action ', () => {
      const payload: ACLUpdateRequest = {
        addedAclCodes: ['A0', 'A1'],
        removedAclCodes: [''],
        roleCode: 'CORP'
      };
      const action = new UpdateAcl(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.UPDATE_ACL,
        payload
      });
    });
    it('should check correct type is used for UpdateAclSuccess action ', () => {
      const action = new UpdateAclSuccess();
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.UPDATE_ACL_SUCCESS
      });
    });
    it('should check correct type is used for UpdateAclFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateAclFailure(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.UPDATE_ACL_FAILURE,
        payload
      });
    });
  });

  describe('LoadModules Action Test Cases', () => {
    it('should check correct type is used for LoadModules action ', () => {
      const payload = '';
      const action = new LoadModules(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_MODULES,
        payload
      });
    });
    it('should check correct type is used for LoadModulesSuccess action ', () => {
      const payload: ACLModuleDetails[] = [
        {
          aclGroupCode: 'A',
          description: 'description',
          isLeaf: false,
          parentAclGroupCode: 'A'
        }
      ];
      const action = new LoadModulesSuccess(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_MODULES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadModulesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadModulesFailure(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_MODULES_FAILURE,
        payload
      });
    });
  });

  describe('LoadSubModules Action Test Cases', () => {
    it('should check correct type is used for LoadSubModules action ', () => {
      const payload = { groupCode: 'GC', role: 'role' };
      const action = new LoadSubModules(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_SUB_MODULES,
        payload
      });
    });
    it('should check correct type is used for LoadSubModulesSuccess action ', () => {
      const payload: ACLModuleDetails[] = [
        {
          aclGroupCode: 'A',
          description: 'description',
          isLeaf: false,
          parentAclGroupCode: 'A'
        }
      ];
      const action = new LoadSubModulesSuccess(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_SUB_MODULES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadSubModulesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadSubModulesFailure(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_SUB_MODULES_FAILURE,
        payload
      });
    });
  });

  describe('LoadFeatures Action Test Cases', () => {
    it('should check correct type is used for LoadFeatures action ', () => {
      const payload = { groupCode: 'GC', role: 'role' };
      const action = new LoadFeatures(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_FEATURES,
        payload
      });
    });
    it('should check correct type is used for LoadFeaturesSuccess action ', () => {
      const payload: ACLModuleDetails[] = [
        {
          aclGroupCode: 'A',
          description: 'description',
          isLeaf: false,
          parentAclGroupCode: 'A'
        }
      ];
      const action = new LoadFeaturesSuccess(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_FEATURES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadFeaturesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadFeaturesFailure(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_FEATURES_FAILURE,
        payload
      });
    });
  });

  describe('LoadRoles Action Test Cases', () => {
    it('should check correct type is used for LoadRoles action ', () => {
      const action = new LoadRoles();
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_ROLES
      });
    });
    it('should check correct type is used for LoadRolesSuccess action ', () => {
      const payload: ACLRole[] = [
        {
          roleCode: 'ORG',
          roleName: 'Admin'
        }
      ];
      const action = new LoadRolesSuccess(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_ROLES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRolesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRolesFailure(payload);
      expect({ ...action }).toEqual({
        type: AccessControlManagementActionTypes.LOAD_ROLES_FAILURE,
        payload
      });
    });
  });
});
