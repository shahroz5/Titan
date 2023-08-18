import {
  AvailableMetalRates,
  AvailableMetalRatesResponse,
  EghsBodGeneratedPassword,
  EghsBodPasswordsListingResponse,
  MetalTypeEnum,
  MetalRatesAndGoldAvailabilityResponse,
  MetalRatesObject,
  UsersActiveSessionsResults,
  UsersSessionsResponse,
  LatestBodResponse,
  ClosedBodResponse
} from '@poss-web/shared/models';

import * as moment from 'moment';

export class BodEodAdaptor {
  static getOfflineEghsBodStatusData(
    data,
    dateFormat: string
  ): EghsBodPasswordsListingResponse {
    const offlineEghsBodPasswordData: EghsBodGeneratedPassword[] = [];
    if (data && data.results) {
      for (const listItem of data.results) {
        offlineEghsBodPasswordData.push({
          contextType: listItem.contextType,
          goldRate: listItem.goldRate ? Number(listItem.goldRate) : null,
          locationCode: listItem.locationCode ? listItem.locationCode : '',
          password: listItem.password ? listItem.password : '',
          passwordDate: listItem.passwordDate
            ? moment(listItem.passwordDate).format(dateFormat)
            : ''
        });
      }
    }

    return {
      offlineEghsBodPasswordData: offlineEghsBodPasswordData,
      count: data.totalElements
    };
  }

  static getBusinessDate(data: any): number {
    if (!data) {
      return null;
    }
    return data.businessDate ? Number(data.businessDate) : null;
  }

  static getClosedBusinessDateForOpenInProgressStatus(
    data: LatestBodResponse
  ): number {
    let returnBusinessDate: number;

    if (!data) {
      return null;
    } else if (!!data && data.status === 'BOD_IN_PROGRESS') {
      returnBusinessDate = data.previousBusinessDate
        ? Number(data.previousBusinessDate)
        : null;
    } else {
      returnBusinessDate = data.businessDate ? Number(data.businessDate) : null;
    }
    return returnBusinessDate;
  }

  static getClosedBusinessDayResponse(
    data: LatestBodResponse
  ): ClosedBodResponse {
    let closedBodResponse: ClosedBodResponse;
    if (!data) {
      return null;
    } else {
      closedBodResponse = {
        businessDate: this.getClosedBusinessDateForOpenInProgressStatus(data),
        fiscalYear: data.fiscalYear ? Number(data.fiscalYear) : null,
        status: data.status ? data.status : null
      };
    }
    return closedBodResponse;
  }

  static getMetalRatesAndGoldRateAvailabity(
    data
  ): MetalRatesAndGoldAvailabilityResponse {
    const availableMetalrates = this.getMetalRates(data);
    const goldRateAvailability = this.checkIfGoldRateAvailable(data);
    return {
      availableMetalRates: availableMetalrates,
      goldRateAvailable: goldRateAvailability
    };
  }

  static checkIfGoldRateAvailable(data: any): boolean {
    let goldRateAvailable = false;
    if (
      data &&
      data[MetalTypeEnum.GOLD] &&
      data[MetalTypeEnum.GOLD].ratePerUnit > 0
    ) {
      goldRateAvailable = true;
    }
    return goldRateAvailable;
  }

  static getMetalRates(data: any): AvailableMetalRates {
    let goldMetalRate: number;
    let platinumMetalRate: number;
    let silverMetalRate: number;

    if (!data) {
      goldMetalRate = null;
      platinumMetalRate = null;
      silverMetalRate = null;
    } else {
      goldMetalRate = data[MetalTypeEnum.GOLD]
        ? data[MetalTypeEnum.GOLD].ratePerUnit
          ? data[MetalTypeEnum.GOLD].ratePerUnit
          : null
        : null;
      platinumMetalRate = data[MetalTypeEnum.PLATINUM]
        ? data[MetalTypeEnum.PLATINUM].ratePerUnit
          ? data[MetalTypeEnum.PLATINUM].ratePerUnit
          : null
        : null;
      silverMetalRate = data[MetalTypeEnum.SILVER]
        ? data[MetalTypeEnum.SILVER].ratePerUnit
          ? data[MetalTypeEnum.SILVER].ratePerUnit
          : null
        : null;
    }
    return {
      goldRate: goldMetalRate,
      platinumRate: platinumMetalRate,
      silverRate: silverMetalRate
    };
  }

  static getAvailableMetalRates(data: any): AvailableMetalRatesResponse {
    let availableMetalRates: AvailableMetalRatesResponse;
    let goldRatesObjectResponse: MetalRatesObject;
    let platinumRatesObjectResponse: MetalRatesObject;
    let silverRatesObjectResponse: MetalRatesObject;

    if (!data) {
      availableMetalRates = {
        additionalProp1: {
          applicableDate: null,
          currency: '',
          metalTypeCode: '',
          purity: 0,
          ratePerUnit: 0
        },
        additionalProp2: {
          applicableDate: null,
          currency: '',
          metalTypeCode: '',
          purity: 0,
          ratePerUnit: 0
        },
        additionalProp3: {
          applicableDate: null,
          currency: '',
          metalTypeCode: '',
          purity: 0,
          ratePerUnit: 0
        }
      };
    } else {
      goldRatesObjectResponse = {
        applicableDate: data[MetalTypeEnum.GOLD]
          ? data[MetalTypeEnum.GOLD].applicableDate
            ? data[MetalTypeEnum.GOLD].applicableDate
            : ''
          : '',
        currency: data[MetalTypeEnum.GOLD]
          ? data[MetalTypeEnum.GOLD].currency
            ? data[MetalTypeEnum.GOLD].currency
            : ''
          : '',
        metalTypeCode: data[MetalTypeEnum.GOLD]
          ? data[MetalTypeEnum.GOLD].metalTypeCode
            ? data[MetalTypeEnum.GOLD].metalTypeCode
            : ''
          : '',
        purity: data[MetalTypeEnum.GOLD]
          ? data[MetalTypeEnum.GOLD].purity
            ? data[MetalTypeEnum.GOLD].purity
            : null
          : null,
        ratePerUnit: data[MetalTypeEnum.GOLD]
          ? data[MetalTypeEnum.GOLD].ratePerUnit
            ? data[MetalTypeEnum.GOLD].ratePerUnit
            : null
          : null
      };
      platinumRatesObjectResponse = {
        applicableDate: data[MetalTypeEnum.PLATINUM]
          ? data[MetalTypeEnum.PLATINUM].applicableDate
            ? data[MetalTypeEnum.PLATINUM].applicableDate
            : ''
          : '',
        currency: data[MetalTypeEnum.PLATINUM]
          ? data[MetalTypeEnum.PLATINUM].currency
            ? data[MetalTypeEnum.PLATINUM].currency
            : ''
          : '',
        metalTypeCode: data[MetalTypeEnum.PLATINUM]
          ? data[MetalTypeEnum.PLATINUM].metalTypeCode
            ? data[MetalTypeEnum.PLATINUM].metalTypeCode
            : ''
          : '',
        purity: data[MetalTypeEnum.PLATINUM]
          ? data[MetalTypeEnum.PLATINUM].purity
            ? data[MetalTypeEnum.PLATINUM].purity
            : null
          : null,
        ratePerUnit: data[MetalTypeEnum.PLATINUM]
          ? data[MetalTypeEnum.PLATINUM].ratePerUnit
            ? data[MetalTypeEnum.PLATINUM].ratePerUnit
            : null
          : null
      };
      silverRatesObjectResponse = {
        applicableDate: data[MetalTypeEnum.SILVER]
          ? data[MetalTypeEnum.SILVER].applicableDate
            ? data[MetalTypeEnum.SILVER].applicableDate
            : ''
          : '',
        currency: data[MetalTypeEnum.SILVER]
          ? data[MetalTypeEnum.SILVER].currency
            ? data[MetalTypeEnum.SILVER].currency
            : ''
          : '',
        metalTypeCode: data[MetalTypeEnum.SILVER]
          ? data[MetalTypeEnum.SILVER].metalTypeCode
            ? data[MetalTypeEnum.SILVER].metalTypeCode
            : ''
          : '',
        purity: data[MetalTypeEnum.SILVER]
          ? data[MetalTypeEnum.SILVER].purity
            ? data[MetalTypeEnum.SILVER].purity
            : null
          : null,
        ratePerUnit: data[MetalTypeEnum.SILVER]
          ? data[MetalTypeEnum.SILVER].ratePerUnit
            ? data[MetalTypeEnum.SILVER].ratePerUnit
            : null
          : null
      };
      availableMetalRates = {
        additionalProp1: goldRatesObjectResponse,
        additionalProp2: platinumRatesObjectResponse,
        additionalProp3: silverRatesObjectResponse
      };
    }
    return availableMetalRates;
  }

  static getUsersActiveSessions(data: any): UsersActiveSessionsResults[] {
    const usersActiveSessionsResponseData: UsersActiveSessionsResults[] = [];
    let activeUser: UsersActiveSessionsResults;
    if (data && data.results) {
      for (activeUser of data.results) {
        const userSessionsList: UsersSessionsResponse[] = [];
        if (activeUser && activeUser.sessions) {
          for (const activeUserSession of activeUser.sessions) {
            userSessionsList.push({
              id: activeUserSession.id ? activeUserSession.id : null,
              loginDate: activeUserSession.loginDate
                ? moment(activeUserSession.loginDate).format()
                : null,
              expiryDate: activeUserSession.expiryDate
                ? moment(activeUserSession.expiryDate).format()
                : null,
              hostName: activeUserSession.hostName
                ? activeUserSession.hostName
                : null
            });
          }
        }
        usersActiveSessionsResponseData.push({
          userName: activeUser.userName ? activeUser.userName : null,
          employeeCode: activeUser.employeeCode
            ? activeUser.employeeCode
            : null,
          employeeName: activeUser.employeeName
            ? activeUser.employeeName
            : null,
          emailId: activeUser.emailId ? activeUser.emailId : null,
          mobileNo: activeUser.mobileNo ? activeUser.mobileNo : null,
          sessions: userSessionsList
        });
      }
    }
    return usersActiveSessionsResponseData;
  }
}
