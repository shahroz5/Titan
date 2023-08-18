import * as selectors from './role-management.selectors';
import { initialState } from './role-management.reducer';
import { RoleManagementState } from './role-management.state';
import {
  CustomErrors,
  RoleDetail,
  RoleTypesData
} from '@poss-web/shared/models';

describe('Role Management Selector Testing Suite', () => {
  it('Testing selectError selector', () => {
    const error: Error = {
      name: 'Name',
      message: 'error message',
      stack: 'stack'
    };
    const customErrors: CustomErrors = {
      code: 'EC2',
      message: 'error occured',
      traceId: 'abcdefghijk',
      timeStamp: '',
      error: error
    };
    const state: RoleManagementState = {
      ...initialState,
      error: customErrors
    };
    expect(
      selectors.RoleManagementSelectors.selectError.projector(state)
    ).toEqual(customErrors);
  });

  it('Testing loadRoles selector', () => {
    const roleDetails: RoleDetail[] = [
      {
        roleCode: 'ADMIN',
        roleName: 'System Admin',
        isActive: true,
        roleType: 'CORP',
        description: 'Corporate Role',
        corpAccess: true,
        userLimit: 5,
        assignedUsers: 5,
        locationFormats: null
      }
    ];
    const state: RoleManagementState = {
      ...initialState,
      roles: roleDetails
    };
    expect(
      selectors.RoleManagementSelectors.loadRoles.projector(state)
    ).toEqual(roleDetails);
  });

  it('Testing addUpdateRole selector', () => {
    const state: RoleManagementState = {
      ...initialState,
      updatedRole: 'role'
    };
    expect(
      selectors.RoleManagementSelectors.addUpdateRole.projector(state)
    ).toEqual('role');
  });

  it('Testing fetchRole selector', () => {
    const roleDetail: RoleDetail = {
      roleCode: 'ADMIN',
      roleName: 'System Admin',
      isActive: true,
      roleType: 'CORP',
      description: 'System Admin',
      corpAccess: true,
      userLimit: 3,
      assignedUsers: 3,
      locationFormats: null
    };
    const state: RoleManagementState = {
      ...initialState,
      fetchRole: roleDetail
    };
    expect(
      selectors.RoleManagementSelectors.fetchRole.projector(state)
    ).toEqual(roleDetail);
  });

  it('Testing totalRoles selector', () => {
    const payload = 10;
    const state: RoleManagementState = {
      ...initialState,
      totalRoles: payload
    };
    expect(
      selectors.RoleManagementSelectors.totalRoles.projector(state)
    ).toEqual(payload);
  });

  it('Testing isLoading selector', () => {
    const payload = false;
    const state: RoleManagementState = {
      ...initialState,
      isLoading: payload
    };
    expect(
      selectors.RoleManagementSelectors.isLoading.projector(state)
    ).toEqual(payload);
  });

  it('Testing fetchLocationFormats selector', () => {
    const payload = new Map();
    payload.set('key', 'value');
    const state: RoleManagementState = {
      ...initialState,
      locationformats: payload
    };
    expect(
      selectors.RoleManagementSelectors.fetchLocationFormats.projector(state)
    ).toEqual(payload);
  });

  it('Testing loadRoleTypes selector', () => {
    const payload: RoleTypesData[] = [
      {
        code: 'code',
        value: 'value'
      }
    ];
    const state: RoleManagementState = {
      ...initialState,
      roleTypes: payload
    };
    expect(
      selectors.RoleManagementSelectors.loadRoleTypes.projector(state)
    ).toEqual(payload);
  });
});
