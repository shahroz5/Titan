import {
  ReportReponse,
  ReportName,
  ReportGroupLov,
  LoadAutoReportResponse,
  AutoReportList,
  CheckBoxSelectedOption,
  ReportField,
  ReportRoleSetting,
  SearchParameter,
  LoadExcludedSettingPayload,
  ComplexityCode,
  Karatage
} from '@poss-web/shared/models';
import { ReportAdaptor } from '../report/report.adaptor';
import * as moment from 'moment';

export class ReportHelper {
  static getReports(data: any): ReportReponse {
    const response: ReportReponse = {
      reports: [],
      totalReports: data.totalElements
    };
    for (const report of data.results) {
      response.reports.push(ReportAdaptor.getReport(report));
    }
    return response;
  }

  static getReportNames(data: any): ReportName[] {
    const response: ReportName[] = [];
    for (const report of data.results) {
      response.push(ReportAdaptor.getReportName(report));
    }
    return response;
  }

  static getReportGroups(data: any): ReportGroupLov[] {
    const response: ReportGroupLov[] = [];
    for (const report of data.results) {
      response.push(ReportAdaptor.getReportGroup(report));
    }

    return response;
  }

  static getAutoReportList(data: any): LoadAutoReportResponse {
    const autoReportList: AutoReportList[] = [];
    for (const report of data.results) {
      autoReportList.push(ReportAdaptor.getAutoReportList(report));
    }

    return {
      autoReportList: autoReportList,
      totalElements: data.totalElements
    };
  }

  static getReportSettings(data: any): CheckBoxSelectedOption[] {
    const checkBoxSelectedOption: CheckBoxSelectedOption[] = [];
    for (const report of data.results) {
      checkBoxSelectedOption.push(ReportAdaptor.getReportSettings(report));
    }
    return checkBoxSelectedOption;
  }

  static getExcludedReportSettings(data: any): LoadExcludedSettingPayload {
    const checkBoxSelectedOption: CheckBoxSelectedOption[] = [];
    for (const report of data.results) {
      for (const field of report?.outputColumns?.data?.fields)
        checkBoxSelectedOption.push(
          ReportAdaptor.getExcludedReportSettings(field)
        );
    }
    return {
      reportSetting: checkBoxSelectedOption,
      templateId: data.results[0]?.id,
      templateName: data.results[0]?.templateName
    };
  }

  static getReportFields(data: any): ReportField[] {
    const reportField: ReportField[] = [];
    for (const report of data.results) {
      reportField.push(ReportAdaptor.getReportFields(report));
    }
    return reportField;
  }

  static getReportRoles(data: any): ReportRoleSetting[] {
    const reportRoleSetting: ReportRoleSetting[] = [];
    for (const report of data.results) {
      reportRoleSetting.push(ReportAdaptor.getReportRoles(report));
    }
    return reportRoleSetting;
  }

  static getSearchParameter(data: any): SearchParameter {
    let searchParameter: SearchParameter;
    if (data) {
      searchParameter = {
        employeeCode: data?.employeeCode,
        reportMasterId: data?.reportMasterId,
        id: data?.id,
        queryName: data?.queryName,
        fromDate: moment(data?.savedQuery?.data?.fromDate),
        toDate: moment(data?.savedQuery?.data?.toDate),
        locationCode: data?.savedQuery?.data?.locationCode,
        ownerType: data?.savedQuery?.data?.ownerType,
        countryCode: data?.savedQuery?.data?.countryCode,
        stateId: data?.savedQuery?.data?.stateId,
        brandCode: data?.savedQuery?.data?.brandCode,
        subBrandCode: data?.savedQuery?.data?.subBrandCode,
        regionCode: data?.savedQuery?.data?.regionCode,
        townId: data?.savedQuery?.data?.townId,
        productGroupCode: data?.savedQuery?.data?.productGroupCode,
        productCategoryCode: data?.savedQuery?.data?.productCategoryCode,
        binGroupCode: data?.savedQuery?.data?.binGroupCode,
        cnStatus: data?.savedQuery?.data?.cnStatus,
        cnType: data?.savedQuery?.data?.cnType,
        paymentType: data?.savedQuery?.data?.paymentType,
        fiscalYear: data?.savedQuery?.data?.fiscalYear,
        karatage: data?.savedQuery?.data?.karatage,
        complexity: data?.savedQuery?.data?.complexity,
        confirmedByRso: data?.savedQuery?.data?.rsoName,
        fromGrossWeight: data?.savedQuery?.data?.fromWt,
        toGrossWeight: data?.savedQuery?.data?.toWt,
        fromValue: data?.savedQuery?.data?.fromValue,
        toValue: data?.savedQuery?.data?.toValue,
        docNo: data?.savedQuery?.data?.docNo,
        customerMobileNo: data?.savedQuery?.data?.customerMobileNo,
        customerName: data?.savedQuery?.data?.customerName,
        ulpNo: data?.savedQuery?.data?.ulpNo,
        fromAmount: data?.savedQuery?.data?.fromAmount,
        toAmount: data?.savedQuery?.data?.toAmount,
        receiptType: data?.savedQuery?.data?.receiptType,
        issueType: data?.savedQuery?.data?.issueType,
        transferType: data?.savedQuery?.data?.transferType
      };
    }

    return searchParameter;
  }

  static getComplexityCodeData(data: any): ComplexityCode[] {
    const complexityCode: ComplexityCode[] = [];

    for (const complexity of data.results) {
      complexityCode.push(ReportAdaptor.getComplexityCode(complexity));
    }
    return complexityCode;
  }

  static getKaratageData(data: any): Karatage[] {
    const karatage: Karatage[] = [];
    for (const karat of data.results) {
      karatage.push(ReportAdaptor.getKaratage(karat));
    }
    return karatage;
  }
}
