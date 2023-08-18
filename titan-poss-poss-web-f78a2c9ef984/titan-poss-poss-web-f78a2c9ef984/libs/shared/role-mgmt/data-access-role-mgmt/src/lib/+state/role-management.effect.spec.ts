import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { RoleManagementEffect } from './role-management.effect';
import { RoleManagementService } from '../role-management.service';
import {
  AddRole,
  AddRoleFailure,
  AddRoleSuccess,
  FetchRole,
  FetchRoleFailure,
  FetchRoleSuccess,
  LoadLocationFormat,
  LoadLocationFormatFailure,
  LoadLocationFormatSuccess,
  LoadRoles,
  LoadRolesSuccess,
  LoadRoleTypes,
  LoadRoleTypesFailure,
  LoadRoleTypesSuccess,
  UpdateRole,
  UpdateRoleFailure,
  UpdateRoleSuccess
} from './role-management.actions';
import {
  RoleData,
  RoleDetail,
  RoleRequest,
  RolesPage,
  RoleTypesData
} from '@poss-web/shared/models';

describe('Role Management Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: RoleManagementEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const roleManagementServiceSpy = jasmine.createSpyObj<RoleManagementService>(
    'RoleManagementService',
    [
      'loadRoles',
      'fetchRole',
      'updateRole',
      'addRole',
      'fetchLocationFormat',
      'fetchRoletypesList'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoleManagementEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: RoleManagementService,
          useValue: roleManagementServiceSpy
        }
      ]
    });
    effect = TestBed.inject(RoleManagementEffect);
  });

  describe('loadRoles', () => {
    const payload: RolesPage = {
      pageNumber: 1,
      pageSize: 10,
      roleCode: 'ORG',
      roleType: 'CORP',
      locationFormat: 'LF'
    };
    it('should load Roles', () => {
      const roleDetailArray: RoleDetail[] = [
        {
          roleCode: 'ORG',
          roleName: 'System Admin',
          isActive: true,
          roleType: 'CORP',
          description: 'System Admin',
          corpAccess: true,
          userLimit: 2,
          assignedUsers: 2,
          locationFormats: null
        }
      ];
      const roleData: RoleData = {
        totalRoles: 89,
        roles: roleDetailArray
      };

      const action = new LoadRoles(payload);
      const outCome = new LoadRolesSuccess(roleData);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: roleData });
      roleManagementServiceSpy.loadRoles.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoles$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRoles(payload);
      const error = new Error('some error');
      const outCome = new LoadRolesSuccess({
        roles: [],
        totalRoles: 0
      });
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roleManagementServiceSpy.loadRoles.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoles$).toBeObservable(expected$);
    });
  });

  describe('FetchRole', () => {
    it('should Fetch User Details', () => {
      const roleDetail: RoleDetail = {
        roleCode: 'ORG',
        roleName: 'System Admin',
        isActive: true,
        roleType: 'CORP',
        description: 'System Admin',
        corpAccess: true,
        userLimit: 2,
        assignedUsers: 2,
        locationFormats: null
      };

      const action = new FetchRole('ORG');
      const outCome = new FetchRoleSuccess(roleDetail);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: roleDetail });
      roleManagementServiceSpy.fetchRole.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.fetchRole$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new FetchRole('ORG');
      const error = new Error('some error');
      const outCome = new FetchRoleFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roleManagementServiceSpy.fetchRole.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.fetchRole$).toBeObservable(expected$);
    });
  });

  describe('UpdateRole', () => {
    const roleRequest: RoleRequest = {
      roleCode: 'CORP',
      data: ''
    };
    it('should Fetch User Details', () => {
      const response = 'Response';
      const action = new UpdateRole(roleRequest);
      const outCome = new UpdateRoleSuccess(roleRequest.roleCode);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      roleManagementServiceSpy.updateRole.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.UpdateRole$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new UpdateRole(roleRequest);
      const error = new Error('some error');
      const outCome = new UpdateRoleFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roleManagementServiceSpy.updateRole.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.UpdateRole$).toBeObservable(expected$);
    });
  });

  describe('AddRole', () => {
    const roleRequest: RoleRequest = {
      roleCode: 'CORP',
      data: ''
    };
    it('should Add New Role', () => {
      const response = 'Response';
      const action = new AddRole(roleRequest);
      const outCome = new AddRoleSuccess(roleRequest.roleCode);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      roleManagementServiceSpy.addRole.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.addRole$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new AddRole(roleRequest);
      const error = new Error('some error');
      const outCome = new AddRoleFailure(CustomErrorAdaptor.fromJson(error));
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roleManagementServiceSpy.addRole.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.addRole$).toBeObservable(expected$);
    });
  });

  describe('LoadLocationFormat', () => {
    it('should Load Location Formats', () => {
      const response = new Map();
      response.set('key', 'value');
      const action = new LoadLocationFormat();
      const outCome = new LoadLocationFormatSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      roleManagementServiceSpy.fetchLocationFormat.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.locationformat$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadLocationFormat();
      const error = new Error('some error');
      const outCome = new LoadLocationFormatFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roleManagementServiceSpy.fetchLocationFormat.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.locationformat$).toBeObservable(expected$);
    });
  });

  describe('LoadRoleTypes', () => {
    it('should Load Location Formats', () => {
      const response: RoleTypesData[] = [
        {
          code: 'CORP',
          value: 'Corporate Role'
        },
        {
          code: 'BOS',
          value: 'Boutique operation Specialist'
        }
      ];

      const action = new LoadRoleTypes();
      const outCome = new LoadRoleTypesSuccess(response);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: response });
      roleManagementServiceSpy.fetchRoletypesList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoleTypes$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRoleTypes();
      const error = new Error('some error');
      const outCome = new LoadRoleTypesFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roleManagementServiceSpy.fetchRoletypesList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoleTypes$).toBeObservable(expected$);
    });
  });
});
