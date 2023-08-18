import * as selectors from './access-control-mgmt.selectors';

import { initialState } from './access-control-mgmt.reducer';
import { AccessControlManagementState } from './access-control-mgmt.state';
import {
  CustomErrors,
  ACLRole,
  ACLModuleDetails,
  ACLDetails
} from '@poss-web/shared/models';

describe('Access Control Management Selector Testing Suite', () => {
  it('Should return the loading status ', () => {
    const testData = true;
    const state: AccessControlManagementState = {
      ...initialState,
      isLoading: testData
    };
    expect(selectors.selectIsLoading.projector(state)).toEqual(testData);
  });

  it('Should return the update status ', () => {
    const testData = true;
    const state: AccessControlManagementState = {
      ...initialState,
      isACLUpdateSuccess: testData
    };
    expect(selectors.selectIsACLUpdateSuccess.projector(state)).toEqual(
      testData
    );
  });

  it('Should return the error', () => {
    const testData: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: AccessControlManagementState = {
      ...initialState,
      error: testData
    };
    expect(selectors.selectError.projector(state)).toEqual(testData);
  });

  it('Should return the roles', () => {
    const testData: ACLRole[] = [
      {
        roleCode: 'ROLE1',
        roleName: 'ROLE 1'
      },
      {
        roleCode: 'ROLE2',
        roleName: 'ROLE 2'
      }
    ];

    const state: AccessControlManagementState = {
      ...initialState,
      roles: testData
    };
    expect(selectors.selectRoles.projector(state)).toEqual(testData);
  });

  it('Should return the modules', () => {
    const testData: ACLModuleDetails[] = [
      {
        aclGroupCode: 'GROUP1',
        description: 'GROUP 1',
        isLeaf: false,
        parentAclGroupCode: 'PARENT_GROUP1'
      },
      {
        aclGroupCode: 'GROUP2',
        description: 'GROUP 2',
        isLeaf: false,
        parentAclGroupCode: 'PARENT_GROUP2'
      }
    ];

    const state: AccessControlManagementState = {
      ...initialState,
      modules: testData
    };
    expect(selectors.selectModules.projector(state)).toEqual(testData);
  });

  it('Should return the sub modules', () => {
    const testData: ACLModuleDetails[] = [
      {
        aclGroupCode: 'GROUP1',
        description: 'GROUP 1',
        isLeaf: false,
        parentAclGroupCode: 'PARENT_GROUP1'
      },
      {
        aclGroupCode: 'GROUP2',
        description: 'GROUP 2',
        isLeaf: false,
        parentAclGroupCode: 'PARENT_GROUP2'
      }
    ];

    const state: AccessControlManagementState = {
      ...initialState,
      subModules: testData
    };
    expect(selectors.selectSubModules.projector(state)).toEqual(testData);
  });

  it('Should return the feature', () => {
    const testData: ACLModuleDetails[] = [
      {
        aclGroupCode: 'GROUP1',
        description: 'GROUP 1',
        isLeaf: false,
        parentAclGroupCode: 'PARENT_GROUP1'
      },
      {
        aclGroupCode: 'GROUP2',
        description: 'GROUP 2',
        isLeaf: false,
        parentAclGroupCode: 'PARENT_GROUP2'
      }
    ];

    const state: AccessControlManagementState = {
      ...initialState,
      features: testData
    };
    expect(selectors.selectFeatures.projector(state)).toEqual(testData);
  });

  it('Should return the ACL Codes', () => {
    const testData: ACLDetails[] = [
      {
        aclCode: 'ACL_CODE_1',
        description: 'ACL CODE 1',
        isAssigned: false
      },
      {
        aclCode: 'ACL_CODE_2',
        description: 'ACL CODE 2',
        isAssigned: false
      }
    ];

    const state: AccessControlManagementState = {
      ...initialState,
      acl: testData
    };
    expect(selectors.selectACL.projector(state)).toEqual(testData);
  });
});
