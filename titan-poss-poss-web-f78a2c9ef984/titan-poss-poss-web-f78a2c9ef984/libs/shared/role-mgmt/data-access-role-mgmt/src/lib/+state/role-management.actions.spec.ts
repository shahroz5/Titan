import {
  CustomErrors,
  RoleData,
  RoleDetail,
  RoleRequest,
  RolesPage,
  RoleTypesData
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  AddRole,
  AddRoleFailure,
  AddRoleSuccess,
  ClearSearchedRoles,
  FetchRole,
  FetchRoleFailure,
  FetchRoleSuccess,
  LoadLocationFormat,
  LoadLocationFormatFailure,
  LoadLocationFormatSuccess,
  LoadRoles,
  LoadRolesFailure,
  LoadRolesSuccess,
  LoadRoleTypes,
  LoadRoleTypesFailure,
  LoadRoleTypesSuccess,
  RoleManagementActionTypes,
  UpdateRole,
  UpdateRoleFailure,
  UpdateRoleSuccess
} from './role-management.actions';

describe('Role Management Action Testing Suite', () => {
  describe('FetchRole Action Test Cases', () => {
    it('should check correct type is used for FetchRole action ', () => {
      const payload = 'Role';
      const action = new FetchRole(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.FETCH_ROLE,
        payload
      });
    });
    it('should check correct type is used for FetchRoleSuccess action ', () => {
      const payload: RoleDetail = {
        roleCode: 'ORG',
        roleName: 'ADMIN',
        isActive: true,
        roleType: 'CORP',
        description: 'Test Description',
        corpAccess: true,
        userLimit: 10,
        assignedUsers: 10,
        locationFormats: null
      };
      const action = new FetchRoleSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.FETCH_ROLE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for FetchRoleFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new FetchRoleFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.FETCH_ROLE_FAILURE,
        payload
      });
    });
  });

  describe('LoadRoles Action Test Cases', () => {
    it('should check correct type is used for LoadRoles action ', () => {
      const payload: RolesPage = {
        pageNumber: 1,
        pageSize: 10,
        roleCode: 'ORG',
        roleType: 'CORP',
        locationFormat: 'URB'
      };
      const action = new LoadRoles(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.LOAD_ROLES,
        payload
      });
    });
    it('should check correct type is used for LoadRolesSuccess action ', () => {
      const RoleDetailArray = [
        {
          roleCode: 'ORG',
          roleName: 'ADMIN',
          isActive: true,
          roleType: 'CORP',
          description: 'Test Description',
          corpAccess: true,
          userLimit: 10,
          assignedUsers: 10,
          locationFormats: null
        }
      ];
      const payload: RoleData = {
        totalRoles: 99,
        roles: RoleDetailArray
      };
      const action = new LoadRolesSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.LOAD_ROLES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRolesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRolesFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.LOAD_ROLES_FAILURE,
        payload
      });
    });
  });

  describe('LoadRoleTypes Action Test Cases', () => {
    it('should check correct type is used for LoadRoleTypes action ', () => {
      const action = new LoadRoleTypes();
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.LOAD_ROLE_TYPES
      });
    });
    it('should check correct type is used for LoadRoleTypesSuccess action ', () => {
      const payload: RoleTypesData[] = [
        {
          code: '01',
          value: 'value'
        }
      ];
      const action = new LoadRoleTypesSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.LOAD_ROLE_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRoleTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRoleTypesFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.LOAD_ROLE_TYPES_FAILURE,
        payload
      });
    });
  });

  describe('ClearSearchedRoles Action Test Cases', () => {
    it('should check correct type is used for ClearSearchedRoles action ', () => {
      const action = new ClearSearchedRoles();
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.CLEAR_SEARCHED_ROLES
      });
    });
  });

  describe('UpdateRole Action Test Cases', () => {
    it('should check correct type is used for UpdateRole action ', () => {
      const payload: RoleRequest = {
        roleCode: 'CORP',
        data: null
      };
      const action = new UpdateRole(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.UPDATE_ROLE,
        payload
      });
    });
    it('should check correct type is used for UpdateRoleSuccess action ', () => {
      const payload = 'test value';
      const action = new UpdateRoleSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.UPDATE_ROLE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for UpdateRoleFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateRoleFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.UPDATE_ROLE_FAILURE,
        payload
      });
    });
  });

  describe('AddRole Action Test Cases', () => {
    it('should check correct type is used for AddRole action ', () => {
      const payload = 'test value';
      const action = new AddRole(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.ADD_ROLE,
        payload
      });
    });
    it('should check correct type is used for AddRoleSuccess action ', () => {
      const payload = 'test value';
      const action = new AddRoleSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.ADD_ROLE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for AddRoleFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddRoleFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.ADD_ROLE_FAILURE,
        payload
      });
    });
  });

  describe('LoadLocationFormat Action Test Cases', () => {
    it('should check correct type is used for LoadLocationFormat action ', () => {
      const action = new LoadLocationFormat();
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.LOAD_LOCATION_FORMAT
      });
    });
    it('should check correct type is used for LoadLocationFormatSuccess action ', () => {
      const payload = new Map();
      const action = new LoadLocationFormatSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.LOAD_LOCATION_FORMAT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadLocationFormatFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLocationFormatFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleManagementActionTypes.LOAD_LOCATION_FORMAT_FAILURE,
        payload
      });
    });
  });
});
