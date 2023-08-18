import { RoleConfigState } from './role-config.state';
import { initialState, RoleConfigReducer } from './role-config.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as actions from './role-config.actions';
import {
  LoadLocationFormatPayload,
  LocationSummaryList,
  RoleCountRequest,
  RoleCountRequestList,
  RoleCountRequestListDetail,
  RoleDetail
} from '@poss-web/shared/models';

describe('Role Configuration reducer Testing Suite', () => {
  describe('Testing LoadRolesforCount Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_ROLES_FOR_COUNT', () => {
      const payload = {
        isBTQUser: false,
        roleType: 'CORP',
        locationCode: 'TJ',
        locationFormat: 'LF'
      };
      const action = new actions.LoadRolesforCount(payload);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LOAD_ROLES_FOR_COUNT_SUCCESS should return Roles response', () => {
      const roleDetailArray: RoleDetail[] = [
        {
          roleCode: 'ADMIN',
          roleName: 'System Admin',
          isActive: false,
          roleType: 'CORP',
          description: 'System Admin',
          corpAccess: true,
          userLimit: 5,
          assignedUsers: 5,
          locationFormats: null
        }
      ];
      const action = new actions.LoadRolesforCountSuccess(roleDetailArray);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.roles).toBe(action.payload);
      expect(result.isLoading).toBe(false);
    });
    it('LOAD_ROLES_FOR_COUNT_FAILURE should return error', () => {
      const action = new actions.LoadRolesforCountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.roles).toEqual([]);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ChangeRoleCount Functionality', () => {
    beforeEach(() => {});
    it('Testing CHANGE_ROLE_COUNT', () => {
      const roleCountRequestArray: RoleCountRequest[] = [
        {
          reqValue: 5,
          roleCode: 'CORP'
        }
      ];
      const payload = {
        remarks: 'Remarks',
        rolesCount: roleCountRequestArray,
        locationCode: 'TJ',
        requestId: 'Test Id',
        status: 'OPEN'
      };
      const action = new actions.ChangeRoleCount(payload);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.roleCountChanged).toBe(false);
      expect(result.error).toBe(null);
    });
    it('CHANGE_ROLE_COUNT_SUCCESS should update RoleCount flag', () => {
      const action = new actions.ChangeRoleCountSuccess();
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.roleCountChanged).toBe(true);
      expect(result.isLoading).toBe(false);
    });
    it('CHANGE_ROLE_COUNT_FAILURE should return error', () => {
      const action = new actions.ChangeRoleCountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.roleCountChanged).toBe(false);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ResetRoleCountRequestList Functionality', () => {
    beforeEach(() => {});
    it('Testing RESET_ROLE_COUNT_REQUEST_LIST', () => {
      const action = new actions.ResetRoleCountRequestList();
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.roleCountRequestList).toEqual([]);
      expect(result.roles).toEqual([]);
      expect(result.error).toBe(null);
      expect(result.isSearch).toEqual('');
    });
  });

  describe('Testing LoadRoleCountRequestList Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_ROLE_COUNT_REQUEST_LIST', () => {
      const payload = {
        pageNumber: 1,
        pageSize: 10,
        isBTQUser: false,
        locationCodes: ['TJ'],
        requestSearch: ''
      };
      const action = new actions.LoadRoleCountRequestList(payload);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.roleCountRequestListlength).toEqual(0);
      expect(result.error).toBe(null);
    });
    it('LOAD_ROLE_COUNT_REQUEST_LIST_SUCCESS should load Role count request list', () => {
      const roleCountRequestListArray: RoleCountRequestList[] = [
        {
          id: 123,
          ownerType: 'ORG',
          reqDocNo: 432523,
          requestRemarks: 'request remarks',
          requesterName: 'System Admin',
          status: 'Open',
          address: ['Line 1, Line 2'],
          roleName: 'Admin',
          reqDocDate: null,
          locationCode: 'TJ'
        }
      ];
      const payload: RoleCountRequestListDetail = {
        isSearch: '',
        isFilter: '',
        totalrequests: 10,
        requests: roleCountRequestListArray
      };
      const action = new actions.LoadRoleCountRequestListSuccess(payload);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      // expect(result.roleCountRequestList).toEqual(
      //   result.roleCountRequestList.concat(action.payload.requests)
      // );
      expect(result.roleCountRequestListlength).toEqual(
        action.payload.totalrequests
      );
      expect(result.isSearch).toEqual(action.payload.isSearch);
      expect(result.isFilter).toEqual(action.payload.isFilter);
    });
    it('LOAD_ROLE_COUNT_REQUEST_LIST_FAILURE should return error', () => {
      const action = new actions.LoadRoleCountRequestListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.roleCountRequestList).toEqual([]);
      expect(result.roleCountRequestListlength).toEqual(0);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing ClearRoleCountRequestList Functionality', () => {
    beforeEach(() => {});
    it('Testing CLEAR_ROLE_COUNT_REQUEST', () => {
      const action = new actions.ClearRoleCountRequestList();
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.roleCountRequestListlength).toEqual(0);
      expect(result.roleCountRequestList).toEqual([]);
    });
  });

  describe('Testing LoadRoleRequestCount Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_ROLE_REQUEST_COUNT', () => {
      const payload = {
        pageNumber: 1,
        pageSize: 10
      };
      const action = new actions.LoadRoleRequestCount(payload);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.roleCountRequestListlength).toEqual(0);
      expect(result.error).toBe(null);
    });
    it('LOAD_ROLE_REQUEST_COUNT_SUCCESS should load Role count request', () => {
      const action = new actions.LoadRoleRequestCountSuccess(1);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.roleCountRequestListlength).toEqual(action.payload);
    });
    it('LOAD_ROLE_REQUEST_COUNT_FAILURE should return error', () => {
      const action = new actions.LoadRoleRequestCountFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.roleCountRequestListlength).toEqual(0);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadRoleCountRequest Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_ROLE_COUNT_REQUEST', () => {
      const payload = { requestId: 'id', isBTQUser: false };
      const action = new actions.LoadRoleCountRequest(payload);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(true);
      expect(result.requestedRoles).toEqual([]);
      expect(result.requestdata).toBe(null);
      expect(result.error).toBe(null);
    });
    it('LOAD_ROLE_COUNT_REQUEST_SUCCESS should load Role count request', () => {
      const payload = {
        requestdata: 'data',
        requestedRoles: 'roles'
      };
      const action = new actions.LoadRoleCountRequestSuccess(payload);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.requestedRoles).toEqual(action.payload.requestedRoles);
      expect(result.requestdata).toEqual(action.payload.requestdata);
    });
    it('LOAD_ROLE_COUNT_REQUEST_FAILURE should return error', () => {
      const action = new actions.LoadRoleCountRequestFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.isLoading).toBe(false);
      expect(result.requestedRoles).toEqual([]);
      expect(result.requestdata).toBe(null);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadLocation Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_LOCATION', () => {
      const action = new actions.LoadLocation();
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.locations).toEqual([]);
      expect(result.roles).toEqual([]);
      expect(result.error).toBe(null);
    });
    it('LOAD_LOCATION_SUCCESS should load locations', () => {
      const payload: LocationSummaryList[] = [
        {
          description: 'description',
          locationCode: 'TJ'
        }
      ];
      const action = new actions.LoadLocationSuccess(payload);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.locations).toEqual(action.payload);
    });
    it('LOAD_LOCATION_FAILURE should return error', () => {
      const action = new actions.LoadLocationFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.locations).toEqual([]);
      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadLocationFormat Functionality', () => {
    beforeEach(() => {});
    it('Testing LOAD_LOCATION_FORMAT', () => {
      const action = new actions.LoadLocationFormat();
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.locationformats).toEqual([]);
      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });
    it('LOAD_LOCATION_FORMAT_SUCCESS should load location Formats', () => {
      const payload: LoadLocationFormatPayload[] = [
        {
          code: 'URB',
          value: 'Urb location'
        }
      ];
      const action = new actions.LoadLocationFormatSuccess(payload);
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.locationformats).toEqual(action.payload);
      expect(result.isLoading).toBe(false);
    });
    it('LOAD_LOCATION_FORMAT_FAILURE should return error', () => {
      const action = new actions.LoadLocationFormatFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );
      const result: RoleConfigState = RoleConfigReducer(initialState, action);
      expect(result.locationformats).toEqual([]);
      expect(result.isLoading).toBe(false);
      expect(result.error.message).toEqual('some error');
    });
  });
});
