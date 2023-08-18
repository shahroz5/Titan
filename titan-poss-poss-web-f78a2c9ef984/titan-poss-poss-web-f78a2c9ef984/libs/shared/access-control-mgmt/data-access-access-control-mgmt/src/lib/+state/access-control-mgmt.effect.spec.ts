import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { initialState } from './access-control-mgmt.reducer';
import {
  BinCode,
  ACLRole,
  ACLModuleDetails,
  ACLDetails,
  ACLUpdateRequest
} from '@poss-web/shared/models';
import { DataPersistence } from '@nrwl/angular';
import * as AccessControlManagementActions from './access-control-mgmt.actions';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { AccessControlManagementEffect } from './access-control-mgmt.effect';
import { AccessControlManagementService } from '../access-control-mgmt.service';
import { ACCESS_CONTROL_MANAGEMENT_FEATURE_KEY } from './access-control-mgmt.state';

describe('Access Control Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: AccessControlManagementEffect;

  const accessControlManagementServiceSpy = jasmine.createSpyObj<
    AccessControlManagementService
  >(['loadRoles', 'loadModules', 'loadSubModules', 'loadACL', 'updateACL']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccessControlManagementEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [ACCESS_CONTROL_MANAGEMENT_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),

        {
          provide: AccessControlManagementService,
          useValue: accessControlManagementServiceSpy
        }
      ]
    });

    effect = TestBed.inject(AccessControlManagementEffect);
  });

  describe('LoadRoles', () => {
    it('should return a stream with list of roles', () => {
      const serviceReponse: ACLRole[] = [
        {
          roleCode: 'ROLE1',
          roleName: 'ROLE 1'
        },
        {
          roleCode: 'ROLE2',
          roleName: 'ROLE 2'
        }
      ];

      const action = new AccessControlManagementActions.LoadRoles();
      const outcome = new AccessControlManagementActions.LoadRolesSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      accessControlManagementServiceSpy.loadRoles.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadRoles$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new AccessControlManagementActions.LoadRoles();
      const error = new Error('some error');
      const outcome = new AccessControlManagementActions.LoadRolesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      accessControlManagementServiceSpy.loadRoles.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadRoles$).toBeObservable(expected);
    });
  });

  describe('LoadModules', () => {
    it('should return a stream with list of modules', () => {
      const serviceReponse: ACLModuleDetails[] = [
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
      const parameter = 'ROLE1';

      const action = new AccessControlManagementActions.LoadModules(parameter);
      const outcome = new AccessControlManagementActions.LoadModulesSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      accessControlManagementServiceSpy.loadModules.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadModules$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = 'ROLE1';

      const action = new AccessControlManagementActions.LoadModules(parameter);
      const error = new Error('some error');
      const outcome = new AccessControlManagementActions.LoadModulesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      accessControlManagementServiceSpy.loadModules.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadModules$).toBeObservable(expected);
    });
  });

  describe('LoadSubModules', () => {
    it('should return a stream with list of Sub modules', () => {
      const serviceReponse: ACLModuleDetails[] = [
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
      const parameter = { groupCode: 'GC', role: 'role' };

      const action = new AccessControlManagementActions.LoadSubModules(
        parameter
      );
      const outcome = new AccessControlManagementActions.LoadSubModulesSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      accessControlManagementServiceSpy.loadSubModules.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadSubModules$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = { groupCode: 'GC', role: 'role' };

      const action = new AccessControlManagementActions.LoadSubModules(
        parameter
      );
      const error = new Error('some error');
      const outcome = new AccessControlManagementActions.LoadSubModulesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      accessControlManagementServiceSpy.loadSubModules.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadSubModules$).toBeObservable(expected);
    });
  });

  describe('loadFeatures', () => {
    it('should return a stream with list of features', () => {
      const serviceReponse: ACLModuleDetails[] = [
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
      const parameter = { groupCode: 'GC', role: 'role' };

      const action = new AccessControlManagementActions.LoadFeatures(parameter);
      const outcome = new AccessControlManagementActions.LoadFeaturesSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      accessControlManagementServiceSpy.loadSubModules.and.returnValue(
        response$
      );

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadFeatures$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = { groupCode: 'GC', role: 'role' };

      const action = new AccessControlManagementActions.LoadFeatures(parameter);
      const error = new Error('some error');
      const outcome = new AccessControlManagementActions.LoadFeaturesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      accessControlManagementServiceSpy.loadSubModules.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outcome });
      expect(effect.loadFeatures$).toBeObservable(expected);
    });
  });

  describe('loadACL', () => {
    it('should return a stream with list of ACL', () => {
      const serviceReponse: ACLDetails[] = [
        {
          aclCode: 'A0',
          description: 'aclcodes',
          isAssigned: false
        }
      ];

      const parameter = {
        aclGroupCode: 'M',
        roleCode: 'RSO'
      };

      const action = new AccessControlManagementActions.LoadAcl(parameter);
      const outcome = new AccessControlManagementActions.LoadAclSuccess(
        serviceReponse
      );
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      accessControlManagementServiceSpy.loadACL.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.loadACL$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter = {
        aclGroupCode: 'M',
        roleCode: 'RSO'
      };
      const action = new AccessControlManagementActions.LoadAcl(parameter);
      const error = new Error('some error');
      const outcome = new AccessControlManagementActions.LoadAclFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      accessControlManagementServiceSpy.loadACL.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadACL$).toBeObservable(expected);
    });
  });

  describe('updateACL', () => {
    it('should return a stream with ACL update', () => {
      const parameter: ACLUpdateRequest = {
        addedAclCodes: ['A0', 'A1'],
        removedAclCodes: [''],
        roleCode: 'CORP'
      };
      const serviceReponse = 'Success';

      const action = new AccessControlManagementActions.UpdateAcl(parameter);
      const outcome = new AccessControlManagementActions.UpdateAclSuccess();
      actions$ = cold('-a', { a: action });

      const response$ = cold('-b', { b: serviceReponse });
      accessControlManagementServiceSpy.updateACL.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });

      expect(effect.updateACL$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const parameter: ACLUpdateRequest = {
        addedAclCodes: ['A0', 'A1'],
        removedAclCodes: [''],
        roleCode: 'CORP'
      };

      const action = new AccessControlManagementActions.UpdateAcl(parameter);
      const error = new Error('some error');
      const outcome = new AccessControlManagementActions.UpdateAclFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      accessControlManagementServiceSpy.updateACL.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.updateACL$).toBeObservable(expected);
    });
  });
});
