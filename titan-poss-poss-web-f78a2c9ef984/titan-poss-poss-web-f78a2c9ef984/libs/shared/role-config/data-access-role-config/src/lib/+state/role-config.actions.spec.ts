import {
  CustomErrors,
  LoadLocationFormatPayload,
  LocationSummaryList,
  RoleCountRequestList,
  RoleCountRequestListDetail,
  RoleDetail
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  RoleConfigActionTypes,
  ResetRoleCountRequestList,
  LoadRoleCountRequestList,
  LoadRoleCountRequestListSuccess,
  LoadRoleCountRequestListFailure,
  ClearRoleCountRequestList,
  LoadRoleCountRequest,
  LoadRoleCountRequestSuccess,
  LoadRoleCountRequestFailure,
  LoadRolesforCount,
  LoadRolesforCountSuccess,
  LoadRolesforCountFailure,
  ChangeRoleCount,
  ChangeRoleCountSuccess,
  ChangeRoleCountFailure,
  LoadLocation,
  LoadLocationSuccess,
  LoadLocationFailure,
  LoadLocationFormat,
  LoadLocationFormatSuccess,
  LoadLocationFormatFailure,
  LoadRoleRequestCount,
  LoadRoleRequestCountSuccess,
  LoadRoleRequestCountFailure
} from './role-config.actions';

describe('Role Configuration Action Testing Suite', () => {
  describe('ResetRoleCountRequestList Action Test Cases', () => {
    it('should check correct type is used for ResetRoleCountRequestList action ', () => {
      const action = new ResetRoleCountRequestList();
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.RESET_ROLE_COUNT_REQUEST_LIST
      });
    });
    it('should check correct type is used for ClearRoleCountRequestList action ', () => {
      const action = new ClearRoleCountRequestList();
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.CLEAR_ROLE_COUNT_REQUEST
      });
    });
  });

  describe('LoadRoleCountRequestList Action Test Cases', () => {
    it('should check correct type is used for LoadRoleCountRequestList action ', () => {
      const payload = {
        pageNumber: 1,
        pageSize: 10,
        isBTQUser: false,
        locationCodes: ['URB', 'PNA'],
        requestSearch: ''
      };
      const action = new LoadRoleCountRequestList(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_LIST,
        payload
      });
    });
    it('should check correct type is used for LoadRoleCountRequestListSuccess action ', () => {
      const roleCountRequestList: RoleCountRequestList[] = [
        {
          id: 1,
          ownerType: 'CORP',
          reqDocNo: 132244,
          requestRemarks: 'No Remarks',
          requesterName: 'name',
          status: 'open',
          address: ['Line 1', 'Line 2'],
          roleName: 'ORG',
          reqDocDate: null,
          locationCode: 'URB'
        }
      ];
      const payload: RoleCountRequestListDetail = {
        isSearch: '',
        isFilter: '',
        totalrequests: 1,
        requests: roleCountRequestList
      };
      const action = new LoadRoleCountRequestListSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRoleCountRequestListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRoleCountRequestListFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadRoleCountRequest Action Test Cases', () => {
    it('should check correct type is used for LoadRoleCountRequest action ', () => {
      const payload = { requestId: '1', isBTQUser: false };
      const action = new LoadRoleCountRequest(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST,
        payload
      });
    });
    it('should check correct type is used for LoadRoleCountRequestSuccess action ', () => {
      const payload: RoleCountRequestListDetail = {
        isSearch: '',
        isFilter: '',
        totalrequests: 1,
        requests: null
      };
      const action = new LoadRoleCountRequestSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRoleCountRequestFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRoleCountRequestFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLE_COUNT_REQUEST_FAILURE,
        payload
      });
    });
  });

  describe('LoadRolesforCount Action Test Cases', () => {
    it('should check correct type is used for LoadRolesforCount action ', () => {
      const payload = {
        isBTQUser: false,
        roleType: 'CORP',
        locationCode: 'URB',
        locationFormat: 'LF'
      };
      const action = new LoadRolesforCount(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLES_FOR_COUNT,
        payload
      });
    });
    it('should check correct type is used for LoadRolesforCountSuccess action ', () => {
      const payload: RoleDetail[] = [
        {
          roleCode: '01',
          roleName: 'name',
          isActive: true,
          roleType: 'CORP',
          description: 'Desc',
          corpAccess: true,
          userLimit: 10,
          assignedUsers: 10,
          locationFormats: null
        }
      ];
      const action = new LoadRolesforCountSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLES_FOR_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRolesforCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRolesforCountFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLES_FOR_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('ChangeRoleCount Action Test Cases', () => {
    it('should check correct type is used for ChangeRoleCount action ', () => {
      const RoleCountRequestArray = [
        {
          reqValue: 1,
          roleCode: 'CORP'
        }
      ];
      const payload = {
        remarks: 'test remarks',
        rolesCount: RoleCountRequestArray,
        locationCode: 'URB',
        requestId: '01',
        status: 'open'
      };
      const action = new ChangeRoleCount(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.CHANGE_ROLE_COUNT,
        payload
      });
    });
    it('should check correct type is used for ChangeRoleCountSuccess action ', () => {
      const action = new ChangeRoleCountSuccess();
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.CHANGE_ROLE_COUNT_SUCCESS
      });
    });
    it('should check correct type is used for ChangeRoleCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new ChangeRoleCountFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.CHANGE_ROLE_COUNT_FAILURE,
        payload
      });
    });
  });

  describe('LoadLocation Action Test Cases', () => {
    it('should check correct type is used for LoadLocation action ', () => {
      const action = new LoadLocation();
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_LOCATION
      });
    });
    it('should check correct type is used for LoadLocationSuccess action ', () => {
      const payload: LocationSummaryList[] = [
        {
          description: 'test description',
          locationCode: 'URB'
        }
      ];
      const action = new LoadLocationSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_LOCATION_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadLocationFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLocationFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_LOCATION_FAILURE,
        payload
      });
    });
  });

  describe('LoadLocationFormat Action Test Cases', () => {
    it('should check correct type is used for LoadLocationFormat action ', () => {
      const action = new LoadLocationFormat();
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_LOCATION_FORMAT
      });
    });
    it('should check correct type is used for LoadLocationFormatSuccess action ', () => {
      const payload: LoadLocationFormatPayload[] = [
        {
          code: 'code',
          value: 'value'
        }
      ];
      const action = new LoadLocationFormatSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_LOCATION_FORMAT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadLocationFormatFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadLocationFormatFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_LOCATION_FORMAT_FAILURE,
        payload
      });
    });
  });

  describe('LoadRoleRequestCount Action Test Cases', () => {
    it('should check correct type is used for LoadRoleRequestCount action ', () => {
      const payload = {
        pageNumber: 1,
        pageSize: 10
      };
      const action = new LoadRoleRequestCount(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLE_REQUEST_COUNT,
        payload
      });
    });
    it('should check correct type is used for LoadRoleRequestCountSuccess action ', () => {
      const payload = 1;
      const action = new LoadRoleRequestCountSuccess(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLE_REQUEST_COUNT_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadRoleRequestCountFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadRoleRequestCountFailure(payload);
      expect({ ...action }).toEqual({
        type: RoleConfigActionTypes.LOAD_ROLE_REQUEST_COUNT_FAILURE,
        payload
      });
    });
  });
});
