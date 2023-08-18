import {
  CustomErrors,
  RoleDetail,
  RequestedRole,
  RoleCountRequestList,
  LoadLocationFormatPayload,
  LocationSummaryList
} from '@poss-web/shared/models';

export interface RoleConfigState {
  roles: RoleDetail[];
  error: CustomErrors;
  isLoading: boolean;
  isSearch: string;
  isFilter: string;
  roleCountChanged: boolean;
  roleCountRequestList: RoleCountRequestList[];
  roleCountRequestListlength: number;
  requestedRoles: RequestedRole[];
  requestdata: RoleCountRequestList;
  locations: LocationSummaryList[];
  locationformats: LoadLocationFormatPayload[];
}
