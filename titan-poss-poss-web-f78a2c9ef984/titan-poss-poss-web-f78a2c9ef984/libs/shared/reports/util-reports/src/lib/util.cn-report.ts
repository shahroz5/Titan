import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenerateReportRequest } from '@poss-web/shared/models';
import { Moment } from 'moment';

export const generateCnReport = (
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
      customFields: {
        data: {
          cnType: formValue.cnType ? formValue.cnType : [],
          cnStatus: formValue.cnStatus ? formValue.cnStatus : [],
          fromAmount: formValue.fromAmount ? formValue.fromAmount : [],
          toAmount: formValue.toAmount ? formValue.toAmount : []
        },
        type: 'string'
      }
    };
    emitter.emit({ form: form, request: request });
  } else {
    form.markAllAsTouched();
  }
};

export const generateCnCommonReport = (
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
      customFields: {
        data: {
          cnType: formValue.cnType ? formValue.cnType : [],
          cnStatus: formValue.cnStatus ? formValue.cnStatus : []
          // fromAmount: formValue.fromAmount ? formValue.fromAmount : [],
          // toAmount: formValue.toAmount ? formValue.toAmount : []
        },
        type: 'string'
      }
    };
    emitter.emit({ form: form, request: request });
  } else {
    form.markAllAsTouched();
  }
};
