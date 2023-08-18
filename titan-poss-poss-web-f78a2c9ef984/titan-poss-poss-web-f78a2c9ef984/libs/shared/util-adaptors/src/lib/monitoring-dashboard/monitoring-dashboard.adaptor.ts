import {
  AllAppVersionsList,
  AppVersionDataByStatusResponse,
  AppVersionsList,
  DataSyncMessagesList,
  DataSyncMessagesListResponse,
  DataSyncStatusListResponse,
  GetAppVersionData,
  GetAppVersionDataByStatus,
  MonitoringDashboardEnum,
  SchedulerJobsResponse,
  SchedulerJobsResults,
  SelectDropDownOption
} from '@poss-web/shared/models';

import * as moment from 'moment';

export class MonitoringDashboardAdaptor {
  static getSchedulerJobs(
    data: any,
    schedulerTimeFormat: string
  ): SchedulerJobsResponse {
    const schedulerJobsResults: SchedulerJobsResults[] = [];
    for (const listItem of data.results) {
      schedulerJobsResults.push({
        active: listItem.active ? listItem.active : false,
        businessDate: listItem.businessDate
          ? Number(listItem.businessDate)
          : null,
        code: listItem.code ? listItem.code : '',
        cronExpression: listItem.cronExpression ? listItem.cronExpression : '',
        description: listItem.description ? listItem.description : '',
        lastRunTime: listItem.lastRunTime
          ? moment(Number(listItem.lastRunTime)).format(schedulerTimeFormat)
          : '',
        locationCode: listItem.locationCode ? listItem.locationCode : '',
        nextRunTime: listItem.nextRunTime
          ? moment(Number(listItem.nextRunTime)).format(schedulerTimeFormat)
          : '',
        status: listItem.status ? listItem.status : ''
      });
    }
    // console.log('schedulerJobsResults', schedulerJobsResults);

    return {
      schedulerJobsResults: schedulerJobsResults,
      schedulerJobsCount: data.totalElements ? data.totalElements : 0
    };
  }

  static getDataSyncStatusListForSelectDropdown(
    data: DataSyncStatusListResponse
  ): SelectDropDownOption[] {
    const statusCodeForSelection = [];
    if (!!data && !!data.status && data.status.length > 0) {
      data.status.forEach(status => {
        statusCodeForSelection.push({
          value: status,
          description: status
        });
      });
    }
    return statusCodeForSelection;
  }
  static loadDataSyncJobs(data): DataSyncMessagesListResponse {
    const dataSyncMessagesList: DataSyncMessagesList[] = [];
    if (!!data && data.results && data.results.length > 0) {
      data.results.forEach(result => {
        dataSyncMessagesList.push({
          dataflowDirection: result.dataflowDirection,
          destination: result.destination,
          exception: result.exception,
          id: result.id,
          messageRefId: result.messageRefId,
          messageType: result.messageType,
          operation: result.operation,
          source: result.source,
          status: result.status,
          syncTime: result.syncTime
        });
      });
    }
    return {
      messagelist: dataSyncMessagesList,
      count: data.totalElements
    };
  }

  //App Version Dashboard related below
  static getAppVersions(data): AppVersionsList {
    const appVersionData: GetAppVersionData[] = [];
    const possUiVersionsList: SelectDropDownOption[] = [];
    const apiVersionsList: SelectDropDownOption[] = [];
    const dbVersionsList: SelectDropDownOption[] = [];

    if (!!data && data.results && data.results.length > 0) {
      data.results.forEach(result => {
        appVersionData.push({
          databaseVersion: result.databaseVersion,
          // downloadUrl: result.downloadUrl,
          // id: result.id,
          // locationCode: result.locationCode,
          possServiceVersion: result.possServiceVersion,
          possUiVersion: result.possUiVersion
          // status: result.status
        });

        possUiVersionsList.push({
          value: result.possUiVersion,
          description: result.possUiVersion
        });
        apiVersionsList.push({
          value: result.possServiceVersion,
          description: result.possServiceVersion
        });
        dbVersionsList.push({
          value: result.databaseVersion,
          description: result.databaseVersion
        });
      });
    }

    return {
      appVersionData: appVersionData,
      possUiVersionsList: possUiVersionsList,
      apiVersionsList: apiVersionsList,
      dbVersionsList: dbVersionsList
    };
  }

  static listAllApplicationVersions(data): AllAppVersionsList {
    let allPossUiVersionsList: SelectDropDownOption[] = [];
    let allEpossUiVersionsList: SelectDropDownOption[] = [];
    let allApiVersionsList: SelectDropDownOption[] = [];
    let allDbVersionsList: SelectDropDownOption[] = [];

    if (!!data && data.length > 0) {
      data.forEach(result => {
        switch (result.appName) {
          case MonitoringDashboardEnum.POSS_UI_VERSION:
            allPossUiVersionsList = this.getAllVersionsList(result.versions);
            break;
          case MonitoringDashboardEnum.EPOSS_UI_VERSION:
            allEpossUiVersionsList = this.getAllVersionsList(result.versions);
            break;
          case MonitoringDashboardEnum.DB_VERSION:
            allDbVersionsList = this.getAllVersionsList(result.versions);
            break;
          case MonitoringDashboardEnum.POSS_SERVICE_VERSION:
            allApiVersionsList = this.getAllVersionsList(result.versions);
            break;
        }
      });
    }
    return {
      allPossUiVersionsList: allPossUiVersionsList,
      allEpossUiVersionsList: allEpossUiVersionsList,
      allApiVersionsList: allApiVersionsList,
      allDbVersionsList: allDbVersionsList
    };
  }

  static getAllVersionsList(versions: string[]): SelectDropDownOption[] {
    const allVersionsList: SelectDropDownOption[] = [];
    if (versions && versions.length > 0) {
      versions.forEach(version => {
        allVersionsList.push({
          value: version,
          description: version
        });
      });
    }
    return allVersionsList;
  }

  static getStatusList(data): SelectDropDownOption[] {
    const statusList: SelectDropDownOption[] = [];
    if (!!data && data.status && data.status.length > 0) {
      data.status.forEach(result => {
        //TODO: When Api is given for this, update the property names
        statusList.push({
          value: result,
          description: result
        });
      });
    }
    return statusList;
  }

  static getAppVersionsByStatus(data): AppVersionDataByStatusResponse {
    const appVersionDataByStatus: GetAppVersionDataByStatus[] = [];
    if (!!data && data.results && data.results.length > 0) {
      data.results.forEach(result => {
        appVersionDataByStatus.push({
          databaseVersion: result.databaseVersion,
          downloadUrl: result.downloadUrl,
          id: result.id,
          locationCode: result.locationCode,
          possServiceVersion: result.possServiceVersion,
          possUiVersion: result.possUiVersion,
          status: result.status,
          published: result.published
        });
      });
    }
    return {
      appVersionDataByStatus: appVersionDataByStatus,
      count: data.totalElements
    };
  }
}
