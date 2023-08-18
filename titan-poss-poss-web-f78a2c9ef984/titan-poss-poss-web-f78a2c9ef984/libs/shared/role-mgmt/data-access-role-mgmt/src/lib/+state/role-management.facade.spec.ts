import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RoleManagementState } from './role-management.state';
import { RoleManagementFacade } from './role-management.facade';
import {
  AddRole,
  ClearSearchedRoles,
  FetchRole,
  LoadLocationFormat,
  LoadRoles,
  LoadRoleTypes,
  UpdateRole
} from './role-management.actions';

describe('User Management facade Testing Suite', () => {
  const initialState: RoleManagementState = {
    roles: [],
    roleTypes: [],
    updatedRole: null,
    fetchRole: null,
    totalRoles: 0,
    error: null,
    isLoading: false,
    locationformats: new Map<string, string>()
  };

  let roleManagementFacade: RoleManagementFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), RoleManagementFacade]
    });

    roleManagementFacade = TestBed.inject(RoleManagementFacade);
  });

  describe('Load Roles', () => {
    it('should dispatch LoadRoles action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const rolesPage = {
        pageNumber: 1,
        pageSize: 10,
        roleCode: 'ORG',
        roleType: 'ORG',
        locationFormat: 'LF'
      };
      const expectedAction = new LoadRoles(rolesPage);
      roleManagementFacade.loadRoles(rolesPage);
      roleManagementFacade.getRolesList();
      roleManagementFacade.getTotalRoles();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Update Roles', () => {
    it('should dispatch UpdateRole action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const roleCode = 'ORG';
      const data = 'Data';
      const expectedAction = new UpdateRole({ roleCode, data });
      roleManagementFacade.updateRole(roleCode, data);
      roleManagementFacade.getAddUpdateRoleStatus();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('Add Role', () => {
    it('should dispatch AddRole action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const data = 'Data';
      const expectedAction = new AddRole(data);
      roleManagementFacade.addRole(data);
      roleManagementFacade.getAddUpdateRoleStatus();
      roleManagementFacade.isLoading();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Clear Role', () => {
    it('should dispatch ClearSearchedRoles action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearSearchedRoles();
      roleManagementFacade.clearRole();
      roleManagementFacade.getError();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Fetch Role', () => {
    it('should dispatch FetchRole action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const data = 'Data';
      const expectedAction = new FetchRole(data);
      roleManagementFacade.fetchRole(data);
      roleManagementFacade.fetchRoleDetails();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load locationformats', () => {
    it('should dispatch LoadLocationFormat action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadLocationFormat();
      roleManagementFacade.loadlocationformats();
      roleManagementFacade.fetchLocationFormats();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load RoleTypes', () => {
    it('should dispatch LoadRoleTypes action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRoleTypes();
      roleManagementFacade.loadRoleTypes();
      roleManagementFacade.getRoleTypesList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
