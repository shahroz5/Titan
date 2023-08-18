import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenerateReportRequest } from '@poss-web/shared/models';
import { Moment } from 'moment';

export const generateDiscountLocationReport = (
  form: FormGroup,
  emitter: EventEmitter<GenerateReportRequest>,
  isRegUser,
  isBtqUser
) => {
  if (form.valid) {
    const formValue = form.getRawValue();
    const request: GenerateReportRequest = {
      fromDate: (formValue.fromDate as Moment).startOf('day').valueOf(),
      toDate: (formValue.toDate as Moment).endOf('day').valueOf(),
      locationCode: isBtqUser
        ? formValue.btqCode !== ''
          ? [formValue.btqCode]
          : []
        : formValue.btqCode
        ? formValue.btqCode
        : [],
      ownerType: formValue.level ? formValue.level : [],
      reportType: formValue.reportName?.reportType,
      countryId: formValue.country,
      stateId: formValue.state,
      townId: formValue.town ? formValue.town : [],
      brandCode: formValue.brand ? formValue.brand : [],
      subBrandCode: formValue.subBrand ? formValue.subBrand: [],
      subRegionCode: isRegUser
        ? formValue.region !== ''
          ? [formValue.region]
          : []
        : formValue.region
        ? formValue.region
        : [],
      customFields: {}
    };
    emitter.emit(request);
  } else {
    form.markAllAsTouched();
  }
};
export const generateDiscountTxnReport = (
  form: FormGroup,
  emitter: EventEmitter<{
    form: FormGroup;
    request: GenerateReportRequest;
  }>,
  isRegUser,
  isBtqUser
) => {
  if (form.valid) {
    const formValue = form.getRawValue();
    const request: GenerateReportRequest = {
      fromDate: (formValue.fromDate as Moment)?.startOf('day').valueOf(),
      toDate: (formValue.toDate as Moment).endOf('day').valueOf(),
      locationCode: isBtqUser
        ? formValue.btqCode !== ''
          ? [formValue.btqCode]
          : []
        : formValue.btqCode
        ? formValue.btqCode
        : [],
      ownerType: formValue.level ? formValue.level : [],
      reportType: formValue.reportName?.reportType,
      countryId: formValue.country,
      stateId: formValue.state,
      townId: formValue.town ? formValue.town : [],
      brandCode: formValue.brand ? formValue.brand : [],
      subBrandCode: formValue.subBrand ? formValue.subBrand: [],
      subRegionCode: isRegUser
        ? formValue.region !== ''
          ? [formValue.region]
          : []
        : formValue.region
        ? formValue.region
        : [],
      customFields: {
        data: {
          fiscalYear: formValue.fiscalYear ? formValue.fiscalYear : null,
          fromWt: formValue.fromGrossWeight ? formValue.fromGrossWeight : null,
          toWt: formValue.toGrossWeight ? formValue.toGrossWeight : null,
          fromValue: formValue.fromValue ? formValue.fromValue : null,
          toValue: formValue.toValue ? formValue.toValue : null,

          customerMobileNo: formValue.customerMobileNo
            ? formValue.customerMobileNo
            : null,
          customerName: formValue.customerName ? formValue.customerName : null,
          ulpNo: formValue.ulpNo ? formValue.ulpNo : null,
          cfa: formValue.cfaProductCode ? formValue.cfaProductCode : [],
          rsoName: formValue.confirmedByRso ? formValue.confirmedByRso : []
        },
        type: 'string'
      }
    };

    emitter.emit({ form: form, request: request });
  } else {
    form.markAllAsTouched();
  }
};
export const generateDiscountCommonReport = (
  form: FormGroup,
  emitter: EventEmitter<GenerateReportRequest>,
  isRegUser,
  isBtqUser
) => {
  if (form.valid) {
    const formValue = form.getRawValue();
    const request: GenerateReportRequest = {
      fromDate: (formValue.fromDate as Moment)?.startOf('day').valueOf(),
      toDate: (formValue.toDate as Moment).endOf('day').valueOf(),
      locationCode: isBtqUser
        ? formValue.btqCode !== ''
          ? [formValue.btqCode]
          : []
        : formValue.btqCode
        ? formValue.btqCode
        : [],
      ownerType: formValue.level ? formValue.level : [],
      reportType: formValue.reportName?.reportType,
      countryId: formValue.country,
      stateId: formValue.state,
      townId: formValue.town ? formValue.town : [],
      brandCode: formValue.brand ? formValue.brand : [],
      subBrandCode: formValue.subBrand ? formValue.subBrand: [],
      subRegionCode: isRegUser
        ? formValue.region !== ''
          ? [formValue.region]
          : []
        : formValue.region
        ? formValue.region
        : [],
      customFields: {
        data: {
          fiscalYear: formValue.fiscalYear ? formValue.fiscalYear : null
          // fromWt: formValue.fromGrossWeight ? formValue.fromGrossWeight : null,
          // toWt: formValue.toGrossWeight ? formValue.toGrossWeight : null,
          // fromValue: formValue.fromValue ? formValue.fromValue : null,
          // toValue: formValue.toValue ? formValue.toValue : null,

          // customerMobileNo: formValue.customerMobileNo
          //   ? formValue.customerMobileNo
          //   : null,
          // customerName: formValue.customerName ? formValue.customerName : null,
          // ulpNo: formValue.ulpNo ? formValue.ulpNo : null,
          // cfa: formValue.cfaProductCode ? formValue.cfaProductCode : [],
          // rsoName: formValue.confirmedByRso ? formValue.confirmedByRso : []
        },
        type: 'string'
      }
    };

    emitter.emit(request);
  } else {
    form.markAllAsTouched();
  }
};
