import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenerateReportRequest } from '@poss-web/shared/models';
import { Moment } from 'moment';

export const generateInventoryReport = (
  form: FormGroup,
  emitter: EventEmitter<GenerateReportRequest>,
  isRegUser,
  isBtqUser,
  isStockReport
) => {
  console.log(form);
  if (form.valid) {
    const formValue = form.getRawValue();
    const request: GenerateReportRequest = {
      fromDate: isStockReport
        ? (formValue.date as Moment).startOf('day').valueOf()
        : (formValue.fromDate as Moment).endOf('day').valueOf(),
      toDate: isStockReport
        ? (formValue.date as Moment).endOf('day').valueOf()
        : (formValue.toDate as Moment).endOf('day').valueOf(),
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
          productGroupCode: formValue.cfaProductCode
            ? formValue.cfaProductCode
            : [],
          productCategoryCode: formValue.productCategory
            ? formValue.productCategory
            : [],
          binGroupCode: formValue.binGroup ? formValue.binGroup : [],
          receiptType: formValue.receiptType ? formValue.receiptType : [],
          issueType: formValue.issueType ? formValue.issueType : [],
          header: formValue.transferType ? formValue.transferType : []
        },
        type: 'string'
      }
    };
    emitter.emit(request);
  } else {
    form.markAllAsTouched();
  }
};

export const generateInventoryCommonReport = (
  form: FormGroup,
  emitter: EventEmitter<GenerateReportRequest>,
  isRegUser,
  isBtqUser,
  isStockReport?
) => {
  if (form.valid) {
    const formValue = form.getRawValue();
    const request: GenerateReportRequest = {
      fromDate: isStockReport
        ? (formValue.date as Moment).startOf('day').valueOf()
        : (formValue.fromDate as Moment).startOf('day').valueOf(),
      toDate: isStockReport
        ? (formValue.date as Moment).endOf('day').valueOf()
        : (formValue.toDate as Moment).endOf('day').valueOf(),
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
          productGroupCode: formValue.cfaProductCode
            ? formValue.cfaProductCode
            : [],
          productCategoryCode: formValue.productCategory
            ? formValue.productCategory
            : [],
          binGroupCode: formValue.binGroup ? formValue.binGroup : []
          // receiptType: formValue.receiptType ? formValue.receiptType : [],
          // issueType: formValue.issueType ? formValue.issueType : []
        },
        type: 'string'
      }
    };
    emitter.emit(request);
  } else {
    form.markAllAsTouched();
  }
};
