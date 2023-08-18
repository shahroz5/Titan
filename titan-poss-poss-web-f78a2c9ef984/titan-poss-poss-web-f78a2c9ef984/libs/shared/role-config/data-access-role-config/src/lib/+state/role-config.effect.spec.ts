import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClient } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { RoleConfigEffect } from './role-config.effect';
import { RoleConfigService } from '../role-config.service';
import {
  ChangeRoleCount,
  ChangeRoleCountFailure,
  ChangeRoleCountSuccess,
  LoadLocation,
  LoadLocationFailure,
  LoadLocationSuccess,
  LoadLocationFormat,
  LoadLocationFormatFailure,
  LoadLocationFormatSuccess,
  LoadRoleCountRequest,
  LoadRoleCountRequestFailure,
  LoadRoleCountRequestList,
  LoadRoleCountRequestListFailure,
  LoadRoleCountRequestListSuccess,
  LoadRoleCountRequestSuccess,
  LoadRoleRequestCount,
  LoadRoleRequestCountFailure,
  LoadRoleRequestCountSuccess,
  LoadRolesforCount,
  LoadRolesforCountFailure,
  LoadRolesforCountSuccess,
  ClearRoleCountRequestList
} from './role-config.actions';
import {
  LoadLocationFormatPayload,
  LocationSummaryList,
  RoleCountRequest,
  RoleCountRequestList,
  RoleCountRequestListDetail,
  RoleDetail
} from '@poss-web/shared/models';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';

describe('Role Configuration Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: RoleConfigEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  const roleConfigServiceSpy = jasmine.createSpyObj<RoleConfigService>(
    'RoleConfigService',
    [
      'loadRolesforCount',
      'requestRoleCountChange',
      'fetchRoleCountRequestList',
      'fetchRoleCountRequest',
      'fetchRoleRequestCount',
      'fetchLocationFormat'
    ]
  );
  const locationServiceSpy = jasmine.createSpyObj<LocationDataService>(
    'LocationDataService',
    ['getLocationSummaryList']
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoleConfigEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: RoleConfigService,
          useValue: roleConfigServiceSpy
        },
        {
          provide: LocationDataService,
          useValue: locationServiceSpy
        }
      ]
    });
    effect = TestBed.inject(RoleConfigEffect);
  });

  describe('LoadRolesforCount', () => {
    const payload = {
      isBTQUser: false,
      roleType: 'CORP',
      locationCode: 'TJ',
      locationFormat: 'LF'
    };
    it('should Load Roles', () => {
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
      const action = new LoadRolesforCount(payload);
      const outCome = new LoadRolesforCountSuccess(roleDetailArray);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: roleDetailArray });
      roleConfigServiceSpy.loadRolesforCount.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRolesforCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRolesforCount(payload);
      const error = new Error('some error');
      const outCome = new LoadRolesforCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roleConfigServiceSpy.loadRolesforCount.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRolesforCount$).toBeObservable(expected$);
    });
  });

  describe('ChangeRoleCount', () => {
    const roleCountRequestArray: RoleCountRequest[] = [
      {
        reqValue: 5,
        roleCode: 'Role Code'
      }
    ];
    const payload = {
      remarks: 'Remarks',
      rolesCount: roleCountRequestArray,
      locationCode: 'TJ',
      requestId: 'ID 1',
      status: 'Open'
    };
    it('should Change RoleCount', () => {
      const action = new ChangeRoleCount(payload);
      const outCome = new ChangeRoleCountSuccess();
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: null });
      roleConfigServiceSpy.requestRoleCountChange.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.roleCountChangeRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new ChangeRoleCount(payload);
      const error = new Error('some error');
      const outCome = new ChangeRoleCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roleConfigServiceSpy.requestRoleCountChange.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.roleCountChangeRequest$).toBeObservable(expected$);
    });
  });

  describe('LoadRoleCountRequestList', () => {
    const payload = {
      pageNumber: 1,
      pageSize: 10,
      isBTQUser: false,
      locationCodes: ['TJ'],
      requestSearch: 'Role Count Request'
    };
    it('should Load Role count Request list', () => {
      const roleCountRequestListArray: RoleCountRequestList[] = [
        {
          id: 1,
          ownerType: 'CORP',
          reqDocNo: 134,
          requestRemarks: '',
          requesterName: 'test user',
          status: 'open',
          address: ['line 1', 'Line 2'],
          roleName: 'System Admin',
          reqDocDate: null,
          locationCode: 'TJ'
        }
      ];
      const roleCountRequestListDetail: RoleCountRequestListDetail = {
        isSearch: 'search',
        isFilter: '',
        totalrequests: 2,
        requests: roleCountRequestListArray
      };
      const action = new LoadRoleCountRequestList(payload);
      const outCome = new LoadRoleCountRequestListSuccess(
        roleCountRequestListDetail
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: roleCountRequestListDetail });
      roleConfigServiceSpy.fetchRoleCountRequestList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoleCountRequestList$).toBeObservable(expected$);
    });

    it('should fail and return an action to clear role count request list', () => {
      const action = new LoadRoleCountRequestList(payload);
      // const error = new Error('some error');
      const outCome = new ClearRoleCountRequestList();
      actions$ = hot('-a', { a: action });
      // const response$ = cold('-a|', { a: null });
      const response$ = cold('-#|', {}, null);
      roleConfigServiceSpy.fetchRoleCountRequestList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoleCountRequestList$).toBeObservable(expected$);
    });
  });

  describe('LoadRoleRequestCount', () => {
    const payload = {
      pageNumber: 1,
      pageSize: 10
    };
    it('should Load Role Request count', () => {
      const action = new LoadRoleRequestCount(payload);
      const outCome = new LoadRoleRequestCountSuccess(10);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: 10 });
      roleConfigServiceSpy.fetchRoleRequestCount.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoleRequestCount$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRoleRequestCount(payload);
      const error = new Error('some error');
      const outCome = new LoadRoleRequestCountFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roleConfigServiceSpy.fetchRoleRequestCount.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoleRequestCount$).toBeObservable(expected$);
    });
  });

  describe('LoadRoleCountRequest', () => {
    const payload = { requestId: '56', isBTQUser: false };

    it('should Load Role Count Request', () => {
      const action = new LoadRoleCountRequest(payload);
      const outCome = new LoadRoleCountRequestSuccess(10);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: 10 });
      roleConfigServiceSpy.fetchRoleCountRequest.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoleCountRequest$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadRoleCountRequest(payload);
      const error = new Error('some error');
      const outCome = new LoadRoleCountRequestFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      roleConfigServiceSpy.fetchRoleCountRequest.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadRoleCountRequest$).toBeObservable(expected$);
    });
  });

  describe('LoadLocation', () => {
    const payload = { requestId: '56', isBTQUser: false };

    it('should Load Locations', () => {
      const locationSummaryListArray: LocationSummaryList[] = [
        {
          description: 'Description',
          locationCode: 'TJ'
        }
      ];
      const action = new LoadLocation();
      const outCome = new LoadLocationSuccess(locationSummaryListArray);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: locationSummaryListArray });
      locationServiceSpy.getLocationSummaryList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.location$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadLocation();
      const error = new Error('some error');
      const outCome = new LoadLocationFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationServiceSpy.getLocationSummaryList.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.location$).toBeObservable(expected$);
    });
  });

  describe('LoadLocationFormat', () => {
    const payload = { requestId: '56', isBTQUser: false };

    it('should Load Location Format', () => {
      const loadLocationFormatPayloadArray: LoadLocationFormatPayload[] = [
        {
          code: 'Code',
          value: 'Value'
        }
      ];
      const action = new LoadLocationFormat();
      const outCome = new LoadLocationFormatSuccess(
        loadLocationFormatPayloadArray
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: loadLocationFormatPayloadArray });
      roleConfigServiceSpy.fetchLocationFormat.and.returnValue(response$);
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
      roleConfigServiceSpy.fetchLocationFormat.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.locationformat$).toBeObservable(expected$);
    });
  });
});
