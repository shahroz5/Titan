import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RoleConfigState } from './role-config.state';
import { RoleConfigFacade } from './role-config.facade';
import {
  ChangeRoleCount,
  ClearRoleCountRequestList,
  LoadLocation,
  LoadLocationFormat,
  LoadRoleCountRequest,
  LoadRoleCountRequestList,
  LoadRoleRequestCount,
  LoadRolesforCount,
  ResetRoleCountRequestList
} from './role-config.actions';

describe('User Management facade Testing Suite', () => {
  const initialState: RoleConfigState = {
    roles: [],
    error: null,
    isLoading: false,
    roleCountChanged: false,
    roleCountRequestList: [],
    roleCountRequestListlength: 0,
    requestedRoles: [],
    requestdata: null,
    locations: [],
    locationformats: [],
    isSearch: '',
    isFilter: ''
  };

  let roleConfigFacade: RoleConfigFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), RoleConfigFacade]
    });

    roleConfigFacade = TestBed.inject(RoleConfigFacade);
  });

  describe('Load Roles for Count', () => {
    it('should dispatch LoadRolesforCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const isBTQUser = false;
      const roleType = 'ORG';
      const locationCode = 'TJ';
      const locationFormat = 'LF';

      const expectedAction = new LoadRolesforCount({
        isBTQUser,
        roleType,
        locationCode,
        locationFormat
      });
      roleConfigFacade.loadRolesforCount(
        isBTQUser,
        roleType,
        locationCode,
        locationFormat
      );
      roleConfigFacade.getRolesList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('request RoleCountChange', () => {
    it('should dispatch ChangeRoleCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const rolesCount = [
        {
          reqValue: 1,
          roleCode: 'ORG'
        }
      ];
      const remarks = 'remarks';
      const status = 'status';
      const locationCode = 'TJ';
      const requestId = '01';

      const expectedAction = new ChangeRoleCount({
        remarks,
        rolesCount,
        locationCode,
        requestId,
        status
      });
      roleConfigFacade.requestRoleCountChange(
        rolesCount,
        remarks,
        status,
        locationCode,
        requestId
      );
      roleConfigFacade.isRoleCountChanged();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('role Count RequestList', () => {
    it('should dispatch LoadRoleCountRequestList action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const data = {
          pageNumber: 1,
          pageSize: 10,
          isBTQUser: false,
          locationCodes: ['URB', 'PNA'],
          requestSearch: ''
        };
        const expectedAction = new LoadRoleCountRequestList(data);
        roleConfigFacade.roleCountRequestList(data);
        roleConfigFacade.fetchRoleCountRequestList();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('reset RoleCountRequestList', () => {
    it('should dispatch ResetRoleCountRequestList action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetRoleCountRequestList();
        roleConfigFacade.resetRoleCountRequestList();
        roleConfigFacade.fetchRoleCountRequestList();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('reset RoleCountRequestList', () => {
    it('should dispatch ResetRoleCountRequestList action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetRoleCountRequestList();
        roleConfigFacade.resetRoleCountRequestList();
        roleConfigFacade.fetchRoleCountRequestList();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('load RoleCountRequest', () => {
    it('should dispatch LoadRoleCountRequest action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const requestId = '01';
      const isBTQUser = false;
      const expectedAction = new LoadRoleCountRequest({
        requestId,
        isBTQUser
      });
      roleConfigFacade.loadRoleCountRequest(requestId, isBTQUser);
      roleConfigFacade.getRequestedRoles();
      roleConfigFacade.getRoleCountRequest();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('clear RoleCountRequestList', () => {
    it('should dispatch ClearRoleCountRequestList action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ClearRoleCountRequestList();
        roleConfigFacade.clearRoleCountRequestList();
        roleConfigFacade.fetchRoleCountRequestList();
        roleConfigFacade.isLoading();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('load RoleRequestCount', () => {
    it('should dispatch LoadRoleRequestCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRoleRequestCount({
        pageNumber: 0,
        pageSize: 4
      });
      roleConfigFacade.loadRoleRequestCount();
      roleConfigFacade.fetchRoleCountRequestListLength();
      roleConfigFacade.getError();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load locations', () => {
    it('should dispatch LoadLocation action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadLocation();
      roleConfigFacade.loadlocations();
      roleConfigFacade.fetchLocations();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load locationformats', () => {
    it('should dispatch LoadLocationFormat action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadLocationFormat();
      roleConfigFacade.loadlocationformats();
      roleConfigFacade.fetchLocationFormats();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
