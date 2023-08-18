import { SelectDropDownOption } from '../select-dropdown.model';

export interface SchedulerJobsResults {
  active: boolean;
  businessDate: number;
  code: string;
  cronExpression: string;
  description: string;
  lastRunTime: string;
  locationCode: string;
  nextRunTime: string;
  status: string;
}

export interface SchedulerJobsResponse {
  schedulerJobsResults: SchedulerJobsResults[];
  schedulerJobsCount: number;
}
export interface SchedulerJobsListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface DataSyncStatusListResponse {
  status: string[];
}
export interface DataSyncCountByMessageTypePayload {
  date: number;
  location?: string;
}
export interface DataSyncCountByMessageTypeResponse {
  statusCode: string;
  statusDecs: string;
  messageCount: number;
}
export interface DataSyncMessagesRequestPayload {
  payload: DataSyncMessagesPayloadData;
  queryParams: any;
}
export interface DataSyncMessagesPayloadData {
  date: number;
  location?: string;
  statusCode: string;
}
export interface DataSyncMessagesList {
  dataflowDirection: string;
  destination: string;
  exception: string;
  id: string;
  messageRefId: string;
  messageType: string;
  operation: string;
  source: string;
  status: string;
  syncTime: number;
}
export interface DataSyncMessagesListResponse {
  messagelist: DataSyncMessagesList[];
  count: number;
}
export interface ManualRunDataSyncPayload {
  destination: string;
  messageid: string;
}

export interface UpdateScheduleTimeRequestPayload {
  cronExpression: string;
  isActive: boolean;
  schedulerCode: string;
}
export interface ManualRunSchedulerJobRequestPayload {
  schedulerCode: string;
}

//App Version Dashboard Related below
export interface GetAppVersionData {
  databaseVersion: string;
  // downloadUrl: string;
  // id: string;
  // locationCode: string;
  possServiceVersion: string;
  possUiVersion: string;
  // status: string;
}

export interface AppVersionsList {
  appVersionData: GetAppVersionData[];
  possUiVersionsList: SelectDropDownOption[];
  apiVersionsList: SelectDropDownOption[];
  dbVersionsList: SelectDropDownOption[];
}

export interface AllAppVersionsList {
  allPossUiVersionsList: SelectDropDownOption[];
  allEpossUiVersionsList: SelectDropDownOption[];
  allApiVersionsList: SelectDropDownOption[];
  allDbVersionsList: SelectDropDownOption[];
}

export interface AppVersionByStatusRequestPayload {
  status: string;
  location?: string;
  databaseVersion?: string;
  epossUiVersion?: string;
  possServiceVersion?: string;
  possUiVersion?: string;
}
export interface AppVersionByStatusRequestPayloadWithQueryParams {
  appVersionByStatusRequestPayload: AppVersionByStatusRequestPayload;
  queryParams: any;
}

export interface GetAppVersionDataByStatus {
  databaseVersion: string;
  downloadUrl: string;
  id: string;
  locationCode: string;
  possServiceVersion: string;
  possUiVersion: string;
  status: string;
  published: boolean;
}

export interface AppVersionDataByStatusResponse {
  appVersionDataByStatus: GetAppVersionDataByStatus[];
  count: number;
}
export interface AddVersionRequestModel {
  databaseVersion: string;
  downloadUrl: string;
  locationCode: string[];
  possServiceVersion: string;
  possUiVersion: string;
}
