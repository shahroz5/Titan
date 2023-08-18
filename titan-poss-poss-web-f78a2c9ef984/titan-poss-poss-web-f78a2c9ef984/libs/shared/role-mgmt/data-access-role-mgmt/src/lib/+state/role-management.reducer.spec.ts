import { RoleManagementState } from './role-management.state';
import { initialState, RoleManagementReducer } from './role-management.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './role-management.actions';
import {
  RoleData,
  RoleDetail,
  RoleRequest,
  RolesPage,
  RoleTypesData
} from '@poss-web/shared/models';

describe('Role Management reducer Testing Suite', () => {
  describe('Testing LoadRoles Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_ROLES', () => {
      const payload: RolesPage = {
        pageNumber: 1,
        pageSize: 10,
        roleCode: 'ADMIN',
        roleType: 'CORP',
        locationFormat: 'LF'
      };
      const action = new actions.LoadRoles(payload);
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.updatedRole).toEqual('');
      expect(result.error).toBe(null);
    });
    it('LOAD_ROLES_SUCCESS should return Roles response', () => {
      const roleDetailArray: RoleDetail[] = [
        {
          roleCode: 'ADMIN',
          roleName: 'System Admin',
          isActive: true,
          roleType: 'CORP',
          description: 'Description',
          corpAccess: true,
          userLimit: 5,
          assignedUsers: 5,
          locationFormats: null
        }
      ];

      const payload: RoleData = {
        totalRoles: 5,
        roles: roleDetailArray
      };
      const action = new actions.LoadRolesSuccess(payload);
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.roles).toBe(action.payload.roles);
      expect(result.totalRoles).toEqual(action.payload.totalRoles);
      expect(result.isLoading).toBe(false);
    });
    it('LOAD_ROLES_FAILURE should return error', () => {
      const action = new actions.LoadRolesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.roles).toEqual([]);
      expect(result.totalRoles).toEqual(0);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing FetchRole Functionality', () => {
    beforeEach(() => {});
    it('Testing FETCH_ROLE', () => {
      const payload = 'Role';
      const action = new actions.FetchRole(payload);
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.updatedRole).toEqual('');
      expect(result.error).toBe(null);
    });
    it('FETCH_ROLE_SUCCESS should fetch Roles response', () => {
      const roleDetail: RoleDetail = {
        roleCode: 'ADMIN',
        roleName: 'System Admin',
        isActive: true,
        roleType: 'CORP',
        description: 'Description',
        corpAccess: true,
        userLimit: 5,
        assignedUsers: 5,
        locationFormats: null
      };
      const action = new actions.FetchRoleSuccess(roleDetail);
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.fetchRole).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
    it('FETCH_ROLE_FAILURE should return error', () => {
      const action = new actions.FetchRoleFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing UpdateRole Functionality', () => {
    beforeEach(() => {});
    it('Testing UPDATE_ROLE', () => {
      const payload: RoleRequest = {
        roleCode: 'CORP',
        data: ''
      };
      const action = new actions.UpdateRole(payload);
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.updatedRole).toEqual('');
      expect(result.error).toBe(null);
    });
    it('UPDATE_ROLE_SUCCESS should Update Role', () => {
      const action = new actions.UpdateRoleSuccess('CORP');
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.updatedRole).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
    it('UPDATE_ROLE_FAILURE should return error', () => {
      const action = new actions.UpdateRoleFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.updatedRole).toEqual('');
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing AddRole Functionality', () => {
    beforeEach(() => {});
    it('Testing ADD_ROLE', () => {
      const payload = 'CORP';
      const action = new actions.AddRole(payload);
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(true);
      expect(result.updatedRole).toEqual('');
      expect(result.error).toBe(null);
    });
    it('ADD_ROLE_SUCCESS should Add Role', () => {
      const action = new actions.AddRoleSuccess('CORP');
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.updatedRole).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
    it('ADD_ROLE_FAILURE should return error', () => {
      const action = new actions.AddRoleFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.updatedRole).toEqual('');
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ClearSearchedRoles Functionality', () => {
    beforeEach(() => {});
    it('Testing CLEAR_SEARCHED_ROLES', () => {
      const action = new actions.ClearSearchedRoles();
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.isLoading).toBe(false);
      expect(result.roles).toEqual([]);
      expect(result.totalRoles).toEqual(0);
    });
  });

  describe('Testing LoadLocationFormat Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_LOCATION_FORMAT', () => {
      const mappedResponse = new Map();

      const action = new actions.LoadLocationFormat();
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.locationformats).toEqual(mappedResponse);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LOAD_LOCATION_FORMAT_SUCCESS should Load Location Formats', () => {
      const payload = new Map();
      payload.set('key', 'value');

      const action = new actions.LoadLocationFormatSuccess(payload);
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.locationformats).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
    it('LOAD_LOCATION_FORMAT_FAILURE should return error', () => {
      const payload = new Map();

      const action = new actions.LoadLocationFormatFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.locationformats).toEqual(payload);
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadRoleTypes Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_ROLE_TYPES', () => {
      const mappedResponse = new Map();
      mappedResponse.set('key', 'value');

      const action = new actions.LoadRoleTypes();
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.roleTypes).toEqual([]);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LOAD_ROLE_TYPES_SUCCESS should Load Role types', () => {
      const roleTypesDataArray: RoleTypesData[] = [
        {
          code: 'CORP',
          value: 'Corporate Role'
        }
      ];
      const action = new actions.LoadRoleTypesSuccess(roleTypesDataArray);
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.roleTypes).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
    it('LOAD_ROLE_TYPES_FAILURE should return error', () => {
      const action = new actions.LoadRoleTypesFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleManagementState = RoleManagementReducer(
        initialState,
        action
      );
      expect(result.roleTypes).toEqual([]);
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('some error');
    });
  });
});
