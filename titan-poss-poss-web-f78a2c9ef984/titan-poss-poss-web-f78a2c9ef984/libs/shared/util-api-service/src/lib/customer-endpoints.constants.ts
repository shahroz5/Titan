import { HttpParams } from '@angular/common/http';
import {
  CUSTOMER_TYPE_ENUM,
  SEARCH_BY_ENUM,
  ConfigTypeEnum,
  PanVerificationRequestPayload,
  GstVerificationRequestPayload,
  PanFormDetailsRequestPayload
} from '@poss-web/shared/models';
import { integrationBaseUrl } from './configuration-endpoints.constants';

const getCustomerBaseUrl = (): string => {
  return `/store/v2`;
};

const getPaymentsBaseUrl = (): string => {
  return `/payments`;
};

const getEngineBaseUrl = (): string => {
  return `/engine/v2`;
};

const getSaleBaseUrl = (): string => {
  return `/sales/v2`;
};

export const getCustomerLovsEndpointUrl = (lovType: string): string => {
  return getEngineBaseUrl() + getPaymentsBaseUrl() + `/lovs/${lovType}`;
};

export const getIsCustomerUniqueEndpointUrl = (
  searchType: string,
  value: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('searchType', searchType)
    .set('value', value);
  return { path: getSaleBaseUrl() + '/customers/unique-checks', params };
};

export const getPANVerificationUrl = (
  requestPaylaod: PanVerificationRequestPayload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()
    .set('vendorCode', requestPaylaod.vendorCode)
    .set('verificationType', requestPaylaod.verificationType);

  if (
    requestPaylaod.panCardNo !== null &&
    requestPaylaod.panCardNo !== undefined
  ) {
    params = params.append('panCardNo', requestPaylaod.panCardNo);
  }

  return { path: integrationBaseUrl() + 'pan', params };
};

export const getGSTVerificationUrl = (
  requestPaylaod: GstVerificationRequestPayload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams().set('vendorCode', requestPaylaod.vendorCode);

  if (requestPaylaod.gstIn !== null && requestPaylaod.gstIn !== undefined) {
    params = params.append('gstIn', requestPaylaod.gstIn);
  }

  return { path: integrationBaseUrl() + 'einvoice/irn/verify', params };
};

export const getEmailValidationUrl = (
  emailId: string,
  vendorCode: string,
  verificationType: string
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams().set('emailId', emailId);
  params = params.append('vendorCode', vendorCode);
  params = params.append('verificationType', verificationType);
  return { path: integrationBaseUrl() + 'email-validation', params };
};

export const getTransactionTypesForCustomerTypeUrl = (
  customerType: CUSTOMER_TYPE_ENUM
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set(
    'config-type',
    ConfigTypeEnum.CUSTOMER_TRANSACTION_CONFIGURATIONS
  );

  return {
    path:
      getEngineBaseUrl() + getPaymentsBaseUrl() + `/customers/${customerType}`,
    params
  };
};

export const getCountryCodeEndpointUrl = (): {
  path: string;
} => {
  return { path: getEngineBaseUrl() + '/locations/details' };
};

export const getCustomerSaveNewFormDetailsUrl = (): string => {
  return getSaleBaseUrl() + '/customers';
};

export const getBrandsbyBrandCodeUrl = (
  brandCode
): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + '/locations/brand-details';
  let params = new HttpParams();
  if (brandCode) {
    params = params.append('brandCode', brandCode);
  }
  return {
    path,
    params
  };
};

export const getCatchmentAreaUrl = (
  catchmentCode?: string,
  pageIndex?: number,
  pageSize?: number,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getCustomerBaseUrl() + `/catchments`;
  let params = new HttpParams();
  if (catchmentCode) {
    params = params.append('catchmentCode', catchmentCode);
  }
  if (pageIndex !== null && pageIndex !== undefined) {
    params = params.append('page', pageIndex.toString());
  }
  if (pageSize !== null && pageSize !== undefined) {
    params = params.append('size', pageSize.toString());
  }
  if (sort) {
    sort.forEach(sortvalue => {
      params = params.append('sort', sortvalue);
    });
  }
  return {
    path,
    params
  };
};

export const getCustomerTownsSummaryUrl = (
  stateCode: string,
  pageIndex?: number,
  pageSize?: number,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getCustomerBaseUrl() + `/towns`;
  let params = new HttpParams();
  if (stateCode) {
    params = params.append('stateCode', stateCode.toString());
  }
  if (pageIndex !== null && pageIndex !== undefined) {
    params = params.append('page', pageIndex.toString());
  }
  if (pageSize !== null && pageSize !== undefined) {
    params = params.append('size', pageSize.toString());
  }
  if (sort) {
    sort.forEach(sortvalue => {
      params = params.append('sort', sortvalue);
    });
  }
  return {
    path,
    params
  };
};

export const getCustomerSearchUrl = (
  searchBy: SEARCH_BY_ENUM,
  searchValue: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('searchType', searchBy)
    .set('searchField', searchValue);
  return { path: getSaleBaseUrl() + '/customers', params };
};

export const getCatchmentListUrl = (): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams();

  const path = getCustomerBaseUrl() + `/catchments`;

  const activeStatus: any = true;

  params = params.append('isActive', activeStatus);

  return {
    path,
    params
  };
};

export const getRivaahCouponEndpointUrl = (
  customerId,
  couponCanSend
): { path: string; params: HttpParams } => {
  let params = new HttpParams();
  const path = getSaleBaseUrl() + `/balances/rivaah/coupon`;

  if (customerId !== null && customerId !== undefined) {
    params = params.append('customerId', customerId.toString());
  }
  if (couponCanSend !== null && couponCanSend !== undefined) {
    params = params.append('sendCoupon', couponCanSend);
  }

  return {
    path,
    params
  };
};

export const getVerifyPanDetailsUrl = (
  requestPaylaod: PanVerificationRequestPayload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams();
  params = params.set('pancardNo', requestPaylaod.panCardNo)
            .set('reEnterPancardNo', requestPaylaod.panCardNo)
            .set('verificationType', requestPaylaod.verificationType)
  const api = getSaleBaseUrl() + `/customers/verifyPan`;
  return { path: api, params: params };
};

export const updatePanFormDetailsUrl = (
  requestPaylaod: PanFormDetailsRequestPayload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams();
  params = params.set('isHardcopySubmitted', `${requestPaylaod.isIdProofSubmitted}`)
            .set('matched', `${requestPaylaod.isProfileMatched}`)
            .set('verificationType',requestPaylaod.verificationType)
  if (requestPaylaod.typeOfProof) {
    params = params.set('selectedIdProofType', requestPaylaod.typeOfProof)
  }
  const api = getSaleBaseUrl() + '/customers/verifyForm60';
  return { path: api, params: params };
};

export const getCustomerBySearchByEmailUrl = (
  searchBy: SEARCH_BY_ENUM,
  searchValue: string
): {
  path: string;
  params: HttpParams;
} => {
  const api = getCustomerSearchUrl(searchBy, searchValue);
  return { path: api.path + '/list', params: api.params };
};

export const getCustomerDetailsUrl = (customerId: string): string => {
  return getSaleBaseUrl() + '/customers' + `/${customerId}`;
};

export const fileUploadUrl = (data): { path: string } => {
  const path = getSaleBaseUrl() + `/files/upload`;

  let params = new HttpParams();

  if (data.customerId && data.customerId !== undefined) {
    params = params.append('customerId', data.customerId.toString());
  }
  if (data.fileSubType && data.fileSubType !== '') {
    params = params.append('fileSubType', data.fileSubType);
  }

  if (data.fileType && data.fileType !== '') {
    params = params.append('page', data.fileType);
  }

  if (data.id && data.id !== '') {
    params = params.append('id', data.IdbService);
  }

  if (data.txnType && data.txnType !== '') {
    params = params.append('txnType', data.txnType);
  }
  const param = params.toString();

  return {
    path: path + param
  };
};
