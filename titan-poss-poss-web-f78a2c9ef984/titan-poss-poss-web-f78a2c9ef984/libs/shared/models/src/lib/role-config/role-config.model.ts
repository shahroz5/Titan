import { Moment } from 'moment';

export interface RoleCountRequest {
  reqValue: number;
  roleCode: string;
}

export interface RoleCountRequestList {
  id: number;
  ownerType: string;
  reqDocNo: number;
  requestRemarks: string;
  requesterName: string;
  status: string;
  address: string[];
  roleName: string;
  reqDocDate: Moment;
  locationCode: string;
}

export interface RoleCountRequestListDetail {
  isSearch: string;
  isFilter: string;
  totalrequests: number;
  requests: RoleCountRequestList[];
}

export interface RequestedRole {
  roleCode: string;
  roleName: string;
  assignedUsers: number;
  userLimit: number;
  reqValue: number;
}
