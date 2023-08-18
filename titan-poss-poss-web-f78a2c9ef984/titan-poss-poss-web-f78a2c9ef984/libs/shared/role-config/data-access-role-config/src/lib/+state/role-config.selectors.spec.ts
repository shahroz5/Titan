import * as selectors from './role-config.selectors';
import { initialState } from './role-config.reducer';
import { RoleConfigState } from './role-config.state';
import {
  CustomErrors,
  LoadLocationFormatPayload,
  LocationSummaryList,
  RequestedRole,
  RoleCountRequestList,
  RoleDetail
} from '@poss-web/shared/models';

describe('Role Configuration Selector Testing Suite', () => {
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
    const state: RoleConfigState = {
      ...initialState,
      error: customErrors
    };
    expect(selectors.RoleConfigSelectors.selectError.projector(state)).toEqual(
      customErrors
    );
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
    const state: RoleConfigState = {
      ...initialState,
      roles: roleDetails
    };
    expect(selectors.RoleConfigSelectors.loadRoles.projector(state)).toEqual(
      roleDetails
    );
  });

  it('Testing isLoading selector', () => {
    const state: RoleConfigState = {
      ...initialState,
      isLoading: true
    };
    expect(selectors.RoleConfigSelectors.isLoading.projector(state)).toEqual(
      true
    );
  });

  it('Testing roleCountChanged selector', () => {
    const state: RoleConfigState = {
      ...initialState,
      roleCountChanged: true
    };
    expect(
      selectors.RoleConfigSelectors.roleCountChanged.projector(state)
    ).toEqual(true);
  });

  it('Testing fetchRoleCountRequestList selector', () => {
    const roleCountRequestListArray: RoleCountRequestList[] = [
      {
        id: 10,
        ownerType: 'CORP',
        reqDocNo: 23243,
        requestRemarks: 'remarks',
        requesterName: 'Name',
        status: 'Active',
        address: ['line1', 'line2'],
        roleName: 'System Admin',
        reqDocDate: null,
        locationCode: 'TJ'
      }
    ];

    const state: RoleConfigState = {
      ...initialState,
      roleCountRequestList: roleCountRequestListArray
    };
    expect(
      selectors.RoleConfigSelectors.fetchRoleCountRequestList.projector(state)
    ).toEqual(roleCountRequestListArray);
  });

  it('Testing fetchRoleCountRequestListLength selector', () => {
    const state: RoleConfigState = {
      ...initialState,
      roleCountRequestListlength: 5
    };
    expect(
      selectors.RoleConfigSelectors.fetchRoleCountRequestListLength.projector(
        state
      )
    ).toEqual(5);
  });

  it('Testing fetchRoleCountRequest selector', () => {
    const roleCountRequestList: RoleCountRequestList = {
      id: 10,
      ownerType: 'CORP',
      reqDocNo: 23243,
      requestRemarks: 'remarks',
      requesterName: 'Name',
      status: 'Active',
      address: ['line1', 'line2'],
      roleName: 'System Admin',
      reqDocDate: null,
      locationCode: 'TJ'
    };

    const state: RoleConfigState = {
      ...initialState,
      requestdata: roleCountRequestList
    };
    expect(
      selectors.RoleConfigSelectors.fetchRoleCountRequest.projector(state)
    ).toEqual(roleCountRequestList);
  });

  it('Testing fetchRequestedRoles selector', () => {
    const requestedRoleArray: RequestedRole[] = [
      {
        roleCode: 'ADMIN',
        roleName: 'System Admin',
        assignedUsers: 5,
        userLimit: 5,
        reqValue: 5
      }
    ];

    const state: RoleConfigState = {
      ...initialState,
      requestedRoles: requestedRoleArray
    };
    expect(
      selectors.RoleConfigSelectors.fetchRequestedRoles.projector(state)
    ).toEqual(requestedRoleArray);
  });

  it('Testing fetchLocations selector', () => {
    const locationSummaryListArray: LocationSummaryList[] = [
      {
        description: 'Description',
        locationCode: 'TJ'
      }
    ];
    const state: RoleConfigState = {
      ...initialState,
      locations: locationSummaryListArray
    };
    expect(
      selectors.RoleConfigSelectors.fetchLocations.projector(state)
    ).toEqual(locationSummaryListArray);
  });

  it('Testing fetchLocationFormats selector', () => {
    const loadLocationFormatPayloadArray: LoadLocationFormatPayload[] = [
      {
        code: 'EC2',
        value: 'value'
      }
    ];
    const state: RoleConfigState = {
      ...initialState,
      locationformats: loadLocationFormatPayloadArray
    };
    expect(
      selectors.RoleConfigSelectors.fetchLocationFormats.projector(state)
    ).toEqual(loadLocationFormatPayloadArray);
  });
});
