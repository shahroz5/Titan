//you should simply assert that you get the right state given the provided inputs.
import {
  CustomErrors,
  ACLDetails,
  ACLRole,
  ACLModuleDetails,
  ACLLoadRequest,
  ACLUpdateRequest
} from '@poss-web/shared/models';

import * as actions from './access-control-mgmt.actions';
import {
  initialState,
  AccessControlManagementReducer
} from './access-control-mgmt.reducer';
import { AccessControlManagementState } from './access-control-mgmt.state';

describe('Access Control Management reducer Testing Suite', () => {
  const customError: CustomErrors = {
    code: 'C',
    message: 'M',
    traceId: 'T',
    timeStamp: 'TS',
    error: {
      name: 'N',
      message: 'M',
      stack: 'S'
    }
  };

  describe('Roles Actions', () => {
    it('LoadRoles', () => {
      const action = new actions.LoadRoles();

      const testState = {
        ...initialState,
        roles: [
          {
            roleCode: 'ROLE1',
            roleName: 'ROLE 1'
          },
          {
            roleCode: 'ROLE2',
            roleName: 'ROLE 2'
          }
        ],
        isLoading: false
      };

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.roles).toEqual([]);
      expect(result.isLoading).toEqual(true);
    });

    it('LoadRolesSuccess', () => {
      const payload: ACLRole[] = [
        {
          roleCode: 'ROLE1',
          roleName: 'ROLE 1'
        },
        {
          roleCode: 'ROLE2',
          roleName: 'ROLE 2'
        }
      ];

      const testState = {
        ...initialState,
        isLoading: true
      };

      const action = new actions.LoadRolesSuccess(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.roles).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });

    it('LoadRolesFailure', () => {
      const payload = customError;
      const testState = {
        ...initialState,
        isLoading: true
      };
      const action = new actions.LoadRolesFailure(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadModules Actions', () => {
    it('LoadModules', () => {
      const payload = 'ROLE1';
      const action = new actions.LoadModules(payload);
      const testState = {
        ...initialState,
        modules: [
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
        ],
        isLoading: false
      };

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.modules).toEqual([]);
      expect(result.isLoading).toEqual(true);
    });

    it('LoadModulesSuccess', () => {
      const payload: ACLModuleDetails[] = [
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

      const testState = {
        ...initialState,

        isLoading: true
      };

      const action = new actions.LoadModulesSuccess(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.modules).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });

    it('LoadModulesFailure', () => {
      const payload = customError;
      const testState = {
        ...initialState,

        isLoading: true
      };

      const action = new actions.LoadModulesFailure(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadSubModules Actions', () => {
    it('LoadSubModules', () => {
      const payload = { groupCode: 'GROUP1', role: 'ROLE1' };
      const action = new actions.LoadSubModules(payload);
      const testState = {
        ...initialState,
        subModules: [
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
        ],
        isLoading: false
      };

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.subModules).toEqual([]);
      expect(result.isLoading).toEqual(true);
    });

    it('LoadSubModulesSuccess', () => {
      const payload: ACLModuleDetails[] = [
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

      const testState = {
        ...initialState,

        isLoading: false
      };

      const action = new actions.LoadSubModulesSuccess(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.subModules).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });

    it('LoadSubModulessFailure', () => {
      const payload = customError;
      const testState = {
        ...initialState,

        isLoading: false
      };
      const action = new actions.LoadSubModulesFailure(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadFeatures Actions', () => {
    it('LoadFeatures', () => {
      const payload = { groupCode: 'GROUP1', role: 'ROLE1' };
      const action = new actions.LoadFeatures(payload);
      const testState = {
        ...initialState,
        features: [
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
        ],
        isLoading: false
      };

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.features).toEqual([]);
      expect(result.isLoading).toEqual(true);
    });

    it('LoadFeaturesSuccess', () => {
      const payload: ACLModuleDetails[] = [
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

      const testState = {
        ...initialState,

        isLoading: false
      };

      const action = new actions.LoadFeaturesSuccess(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.features).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });

    it('LoadFeaturesFailure', () => {
      const payload = customError;
      const testState = {
        ...initialState,

        isLoading: false
      };
      const action = new actions.LoadSubModulesFailure(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('LoadAcl Actions', () => {
    it('LoadAcl', () => {
      const payload: ACLLoadRequest = {
        aclGroupCode: 'GROUP1',
        roleCode: 'ROLE1'
      };
      const action = new actions.LoadAcl(payload);
      const testState = {
        ...initialState,

        isLoading: false
      };

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.isLoading).toEqual(true);
    });

    it('LoadAclSuccess', () => {
      const payload: ACLDetails[] = [
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

      const testState = {
        ...initialState,

        isLoading: false
      };

      const action = new actions.LoadAclSuccess(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.acl).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });

    it('LoadAclFailure', () => {
      const payload = customError;
      const testState = {
        ...initialState,

        isLoading: false
      };
      const action = new actions.LoadAclFailure(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });
  });

  describe('UpdateAcl Actions', () => {
    it('UpdateAcl', () => {
      const payload: ACLUpdateRequest = {
        addedAclCodes: ['M1'],
        removedAclCodes: ['M10'],
        roleCode: 'RSO'
      };
      const action = new actions.UpdateAcl(payload);
      const testState = {
        ...initialState,
        isACLUpdateSuccess: true,
        isLoading: false
      };

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.isACLUpdateSuccess).toEqual(false);
      expect(result.isLoading).toEqual(true);
    });

    it('UpdateAclSuccess', () => {
      const testState = {
        ...initialState,
        isACLUpdateSuccess: false,
        isLoading: false
      };

      const action = new actions.UpdateAclSuccess();

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.isACLUpdateSuccess).toEqual(true);
      expect(result.isLoading).toEqual(false);
    });

    it('UpdateAclFailure', () => {
      const payload = customError;
      const testState = {
        ...initialState,

        isLoading: false
      };
      const action = new actions.UpdateAclFailure(payload);

      const result: AccessControlManagementState = AccessControlManagementReducer(
        testState,
        action
      );

      expect(result.error).toEqual(payload);
      expect(result.isLoading).toEqual(false);
    });
  });

  it('ClearAcl', () => {
    const action = new actions.ClearAcl();
    const testState = {
      ...initialState,
      isACLUpdateSuccess: true,
      isLoading: false,
      acl: [
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
      ],
      error: customError
    };

    const result: AccessControlManagementState = AccessControlManagementReducer(
      testState,
      action
    );

    expect(result.isACLUpdateSuccess).toEqual(false);
    expect(result.acl).toEqual([]);
    expect(result.error).toEqual(null);
  });

  it('ResetError', () => {
    const action = new actions.ResetError();
    const testState = {
      ...initialState,
      error: customError
    };

    const result: AccessControlManagementState = AccessControlManagementReducer(
      testState,
      action
    );

    expect(result.error).toEqual(null);
  });
});
