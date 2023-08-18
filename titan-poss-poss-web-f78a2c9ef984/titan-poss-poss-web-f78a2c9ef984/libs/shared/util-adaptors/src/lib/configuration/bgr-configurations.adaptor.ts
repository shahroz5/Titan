import {
  ConfigTypeEnum,
  BgrConfigListingResult,
  BgrConfigDetails
} from '@poss-web/shared/models';

export class BgrConfigAdaptor {
  static getBgrConfigListing(dataObj: any): BgrConfigListingResult {
    return {
      results: dataObj.results,
      pageNumber: dataObj.pageNumber,
      pageSize: dataObj.pageSize,
      totalPages: dataObj.totalPages,
      totalElements: dataObj.totalElements
    };
  }

  static getBgrConfigDetails(dataObj: any): BgrConfigDetails {
    if (!dataObj) {
      return null;
    }
    return {
      ruleId: dataObj.ruleId,
      ruleType: dataObj.ruleType,
      description: dataObj.description,
      ruleDetails: dataObj.ruleDetails ? dataObj.ruleDetails : null,
      isActive: dataObj.isActive
    };
  }

  static getBgrConfigDetailsNew() {
    return {
      ruleId: null,
      ruleType: ConfigTypeEnum.BGR_CONFIG,
      description: '',
      ruleDetails: {
        type: ConfigTypeEnum.BGR_CONFIG,
        data: {
          bgrOfferFromDate: 0,
          bgrOfferToDate: 0,
          redemptionPeriodFromDate: 0,
          redemptionPeriodToDate: 0,
          downSideAmount: '0',
          applicableRateDate: '',
          // noOfDaysFromCurrentDate: 0,
          otherDetails: {
            applicableRate: 'FIRST_RATE',
            applicableDate: 0
          }
        }
      }
    };
  }
}
