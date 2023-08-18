import { HttpParams } from '@angular/common/http';
import {
  TransactionTypeEnum,
  PaymentModeEnum,
  UniPayRequest,
  QCGCGetBalancePayload,
  PaymentGroupEnum,
  PaymentStatusEnum,
  SubTransactionTypeEnum,
  ConfigTypeEnum,
  AdvanceBookingSearchPayload,
  SortItem,
  GVStatusListingPayload,
  TransactionListPayload,
  GenerateCnPayload,
  RefundRequestPayload,
  FileUploadDownloadPayload,
  DiscountVoucherDetailsRequestPayload,
  CreateTepTypesEnum,
  DigiGetBalancePayload,
  GenerateOtpDigiGoldPayload,
  DiscountListPayload,
  TcsRequestParam,
  ValidateManualFocPayload,
  LocationSettingAttributesEnum
} from '@poss-web/shared/models';
import { engineBaseUrl } from './configuration-endpoints.constants';
import { getMasterSalesBaseUrl } from './masters-data-endpoints.constants';

const getEngineBaseUrl = (): string => {
  return `/engine/v2`;
};
const getGepBaseUrl = (): string => {
  return `/goods-exchange`;
};
const getStoreBaseUrl = (): string => {
  return `/store/v2`;
};

const getInventoryBaseUrl = (): string => {
  return `/inventory`;
};

const getSalesBaseUrl = (): string => {
  return `/sales/v2`;
};

const getCashMemosBaseUrl = (): string => {
  return `/cash-memos`;
};

const getOrdersBaseUrl = (): string => {
  return `/orders`;
};

const getAdvancesBaseUrl = (): string => {
  return `/advances`;
};

const getTaxesBaseUrl = (): string => {
  return `/taxes`;
};

const getPaymentsUrl = (): string => {
  return `/payments`;
};

const getCreditNoteurl = (): string => {
  return `/credit-note`;
};
const getGoodsReturnUrl = (): string => {
  return `/goods-return`;
};
const getLegacyOutboundUrl = (): string => {
  return `/legacy/outbound`;
};
const getLegacyIbtUrl = (): string => {
  return `/legacy/ibt`;
};
const getLegacyInboundUrl = (): string => {
  return `/legacy/inbound`;
};

const getIntegrationServiceBaseurl = (): string => '/integration/v2';
const getUnipayBaseUrl = (): string => {
  return 'http://localhost:80/innoweb/api/MSwipe';
};
const getEncryptedHostNameUrl = (): string => {
  return 'http://localhost:3000/sytemInformatiom';
};
const getDecryptedHostNameUrl = (): string => {
  return 'http://localhost:3000/sytemInformation';
};

const getWorkFlowUrl = (): string => {
  return `/workflow/v2`;
};
const getWorkflowTaskUrl = (): string => {
  return `/workflow-task`;
};
const getWorkflowProcessUrl = (): string => {
  return `/workflow-process`;
};
const getCustomerOrdersBaseUrl = (): string => {
  return `/customer-orders`;
};

export const getTransactionListUrl = (
  searchValue: any,
  status: string,
  txnType: string,
  subTxnType: string,
  pageIndex: number,
  pageSize: number,
  searchData: TransactionListPayload,
  sortParam?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  let sort;
  if (sortParam) {
    sort = sortParam;
  } else {
    if (status === 'HOLD') {
      sort = [`lastHoldTime,desc`];
    } else {
      sort = [`docNo,desc`];
    }
  }
  if (status === null) {
    if (typeof searchValue === 'number') {
      let params = new HttpParams()
        .set('txnType', txnType)
        .set('docNo', String(searchValue));
      if (searchData.fiscalYear) {
        params = params.append('fiscalYear', `${searchData.fiscalYear}`);
      }
      if (searchData.customerName) {
        params = params.append('customerName', searchData.customerName);
      }
      return { path: getSalesBaseUrl() + '/transactions', params };
    }
  } else {
    if (searchValue === '') {
      if (subTxnType === CreateTepTypesEnum.CUT_PIECE_TEP) {
        let params = new HttpParams()
          .set('status', status)
          .set('transactionType', subTxnType)
          .set('page', `${pageIndex}`)
          .set('size', `${pageSize}`);
        if (sort) {
          sort.forEach(sortvalue => {
            params = params.append('sort', sortvalue);
          });
        }
        return {
          path:
            getSalesBaseUrl() + getInventoryBaseUrl() + '/stock-managements',
          params
        };
      } else {
        let params = new HttpParams()
          .set('status', status)
          .set('txnType', txnType)
          .set('subTxnType', subTxnType)
          .set('page', `${pageIndex}`)
          .set('size', `${pageSize}`);
        if (sort) {
          sort.forEach(sortvalue => {
            params = params.append('sort', sortvalue);
          });
        }
        return { path: getSalesBaseUrl() + '/transactions', params };
      }
    } else if (typeof searchValue === 'number') {
      if (subTxnType === CreateTepTypesEnum.CUT_PIECE_TEP) {
        let params = new HttpParams()
          .set('transactionType', subTxnType)
          .set('status', status)
          .set('docNo', String(searchValue))
          .set('page', `${pageIndex}`)
          .set('size', `${pageSize}`);
        if (sort) {
          sort.forEach(sortvalue => {
            params = params.append('sort', sortvalue);
          });
        }
        return {
          path:
            getSalesBaseUrl() + getInventoryBaseUrl() + '/stock-managements',
          params
        };
      } else {
        let params = new HttpParams()
          .set('status', status)
          .set('txnType', txnType)
          .set('subTxnType', subTxnType)
          .set('docNo', String(searchValue))
          .set('page', `${pageIndex}`)
          .set('size', `${pageSize}`);
        if (sort) {
          sort.forEach(sortvalue => {
            params = params.append('sort', sortvalue);
          });
        }
        if (searchData.fiscalYear) {
          params = params.append('fiscalYear', `${searchData.fiscalYear}`);
        }
        if (searchData.customerName) {
          params = params.append('customerName', searchData.customerName);
        }
        return { path: getSalesBaseUrl() + '/transactions', params };
      }
    } else if (typeof searchValue === 'string') {
      let params = new HttpParams()
        .set('status', status)
        .set('txnType', txnType)
        .set('subTxnType', subTxnType)
        .set('customerName', searchValue)
        .set('page', `${pageIndex}`)
        .set('size', `${pageSize}`);
      if (sort) {
        sort.forEach(sortvalue => {
          params = params.append('sort', sortvalue);
        });
      }
      return { path: getSalesBaseUrl() + '/transactions', params };
    }
  }
};

export const getCustomerPrintUrl = (
  customerId: string
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams().set('customerId', customerId);
  return { path: getSalesBaseUrl() + '/prints/customerId', params: params };
};
export const getSalesHomePageUrl = (): string => {
  return '/sales/home';
};
export const searchABUrl = (data: AdvanceBookingSearchPayload) => {
  console.log(data, 'service');
  let params = new HttpParams()
    .set('txnType', data.txnType)
    .set('page', `${data.page}`)
    .set('size', `${data.size}`);

  if (data.subTxnType) {
    params.append('subTxnType', data.subTxnType);
  }

  if (data.fiscalYear) {
    params = params.append('fiscalYear', `${data.fiscalYear}`);
  }
  if (data.docNo) {
    params = params.append('docNo', `${data.docNo}`);
  }
  if (data.mobileNumber) {
    params = params.append('mobileNumber', data.mobileNumber);
  }

  if (data.status) {
    params = params.append('status', data.status);
  }
  params = params.append('sort', 'docNo,desc');

  return { path: getSalesBaseUrl() + '/transactions', params };
};

export const getTransactionListCountUrl = (
  status: string,
  txnType: string,
  subTxnType: string
): {
  path: string;
  params: HttpParams;
} => {
  if (txnType === null || subTxnType === null) {
    const params = new HttpParams().set('status', status);
    return { path: getSalesBaseUrl() + '/transactions/counts', params };
  }
  if (subTxnType === CreateTepTypesEnum.CUT_PIECE_TEP) {
    const params = new HttpParams()
      .set('status', status)

      .set('transactionType', subTxnType);

    return {
      path:
        getSalesBaseUrl() + getInventoryBaseUrl() + '/stock-managements/count',
      params
    };
  } else {
    const params = new HttpParams()
      .set('status', status)
      .set('txnType', txnType)
      .set('subTxnType', subTxnType);
    return { path: getSalesBaseUrl() + '/transactions/counts', params };
  }
};

export const getMetalPriceUrl = (): string => {
  return getEngineBaseUrl() + `/price/metals/all`;
};

export const getStandardMetalPriceUrl = (): string => {
  return getEngineBaseUrl() + `/price/metals/standard`;
};

export const getStandardMetalPriceHistoryUrl = (): string => {
  return getEngineBaseUrl() + `/price/metals/history`;
};

export const getToleranceUrl = (ruleType: string): string => {
  return getEngineBaseUrl() + `/rule-types/${ruleType}/values`;
};

export const getTEPSearchProductEndPointUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('searchType', 'TEP');
  return {
    path: getEngineBaseUrl() + '/products/items',
    params
  };
};

export const getSearchProductEndPointUrl = (
  searchValue: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('itemCode', searchValue);
  return {
    path: getEngineBaseUrl() + getInventoryBaseUrl() + '/items',
    params
  };
};

export const getProductDetailsEndPointUrl = (
  itemCode: string,
  lotNumber?: string
): {
  path: string;
  params?: HttpParams;
} => {
  if (lotNumber) {
    const params = new HttpParams().set('lotNumber', lotNumber);
    return {
      path:
        getEngineBaseUrl() + getInventoryBaseUrl() + `/items/${itemCode}/lots`,
      params
    };
  } else {
    return {
      path:
        getEngineBaseUrl() + getInventoryBaseUrl() + `/items/${itemCode}/lots`
    };
  }
};

export const getCoinDetailsEndPointUrl = (
  itemCode,
  withSaleableCheck
): string => {
  if (itemCode === null) {
    return (
      getEngineBaseUrl() +
      getInventoryBaseUrl() +
      `/coins?withSaleableCheck=${withSaleableCheck}`
    );
  } else {
    return (
      getEngineBaseUrl() +
      getInventoryBaseUrl() +
      `/coins?withSaleableCheck=${withSaleableCheck}&itemCode=${itemCode}`
    );
  }
};

export const getPriceDetailsEndPointUrl = (): string => {
  return getEngineBaseUrl() + `/price/orders`;
};

export const getFindPriceEndPointUrl = (): string => {
  return getEngineBaseUrl() + `/price/find-price`;
};

export const getConversionPriceDetailsEndPointUrl = (
  loc
): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + `/price/conversion-price`;
  const params = new HttpParams().set('locationCode', loc);
  return {
    path,
    params
  };
};

export const getReserveBinPriceDetailsEndPointUrl = (
  txnDetails
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getSalesBaseUrl() +
    getCashMemosBaseUrl() +
    `/${txnDetails.id}/items/order-price`;
  const params = new HttpParams()
    .set('txnType', txnDetails.txnType)
    .set('subTxnType', txnDetails.subTxnType);
  return {
    path,
    params
  };
};

export const getTepPriceDetailsEndPointUrl = (): string => {
  return getEngineBaseUrl() + `/price/tep`;
};

export const tepUploadUrl = (data: FileUploadDownloadPayload): string => {
  return (
    getSalesBaseUrl() +
    `/files/upload?docType=${data.txnType}&fileType=${data.uploadType}&id=${data.id}`
  );
};

export const tepDownloadUrl = (data: FileUploadDownloadPayload): string => {
  if (data.locationCode) {
    return (
      getSalesBaseUrl() +
      `/files/presigned-url?documentType=${data.txnType}&fileType=${data.uploadType}&id=${data.id}&customerId=${data.customerId}&locationCode=${data.locationCode}`
    );
  } else {
    return (
      getSalesBaseUrl() +
      `/files/presigned-url?documentType=${data.txnType}&fileType=${data.uploadType}&id=${data.id}&customerId=${data.customerId}`
    );
  }
};

export const getValidateProductDetailsEndPointUrl = (
  inventoryId: string,
  itemCode: string
): {
  path: string;
  params: HttpParams;
} => {
  if (itemCode === null) {
    const path = getEngineBaseUrl() + getInventoryBaseUrl() + `/saleable`;
    const params = new HttpParams().set('inventoryId', inventoryId);
    return {
      path,
      params
    };
  } else if (inventoryId === null) {
    const path = getEngineBaseUrl() + getInventoryBaseUrl() + `/saleable`;
    const params = new HttpParams().set('itemCode', itemCode);
    return {
      path,
      params
    };
  }
};

export const getTaxDetailsEndPointUrl = (
  customerId: number,
  itemCode: string,
  txnType: string,
  locationCode?: string,
  isFullValueTep?: boolean,
  isIGST?: boolean
): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + `/price/taxes`;
  if (!customerId && !locationCode) {
    let params = new HttpParams()
      .set('itemCode', itemCode)
      .set('txnType', txnType);
    if (isFullValueTep) {
      params = params.append('isfullvalueTep', `${isFullValueTep}`);
    }
    if (isIGST !== null && isIGST !== undefined) {
      params = params.append('isIGST', isIGST.toString());
    }
    return {
      path,
      params
    };
  } else if (customerId && !locationCode) {
    let paramsOut = new HttpParams()
      .set('customerId', customerId.toString())
      .set('itemCode', itemCode)
      .set('txnType', txnType);
    if (isFullValueTep) {
      paramsOut = paramsOut.append('isfullvalueTep', `${isFullValueTep}`);
    }
    if (isIGST !== null && isIGST !== undefined) {
      paramsOut = paramsOut.append('isIGST', isIGST.toString());
    }
    return {
      path,
      params: paramsOut
    };
  } else if (!customerId && locationCode) {
    let paramsOut = new HttpParams()
      .set('itemCode', itemCode)
      .set('txnType', txnType)
      .set('destBoutiqueLocationCode', locationCode);
    if (isFullValueTep) {
      paramsOut = paramsOut.append('isfullvalueTep', `${isFullValueTep}`);
    }
    if (isIGST !== null && isIGST !== undefined) {
      paramsOut = paramsOut.append('isIGST', isIGST.toString());
    }
    return {
      path,
      params: paramsOut
    };
  } else if (customerId && locationCode) {
    let paramsOut = new HttpParams()
      .set('itemCode', itemCode)
      .set('txnType', txnType)
      .set('customerId', customerId.toString())
      .set('destBoutiqueLocationCode', locationCode);
    if (isFullValueTep) {
      paramsOut = paramsOut.append('isfullvalueTep', `${isFullValueTep}`);
    }
    if (isIGST !== null && isIGST !== undefined) {
      paramsOut = paramsOut.append('isIGST', isIGST.toString());
    }
    return {
      path,
      params: paramsOut
    };
  }
};

export const getRegTaxDetailsEndPointUrl = (
  itemCode: string,
  txnType: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + `/price/taxes`;
  let params = new HttpParams()
    .set('itemCode', itemCode)
    .set('txnType', txnType);

  return {
    path,
    params: params
  };
};

export const getAvailableDiscountsEndPointUrl = (
  requestPayload: DiscountListPayload
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getSalesBaseUrl() + `/goods-exchange/${requestPayload.id}/discounts`;
  if (requestPayload !== null) {
    const params = new HttpParams()
      .set('subTxnType', requestPayload.subTxnType)
      .set('txnType', requestPayload.txnType);
    return {
      path,
      params
    };
  }
};

export const getCashMemoEndPointUrl = (
  txnType: string,
  subTxnType: string,
  id?: string,
  status?: string
): { path: string; params: HttpParams } => {
  if (id || status) {
    if (status) {
      const path = getSalesBaseUrl() + getCashMemosBaseUrl() + `/${id}`;
      const params = new HttpParams()
        .set('status', status)
        .set('subTxnType', subTxnType)
        .set('txnType', txnType);
      return { path, params };
    } else {
      const path = getSalesBaseUrl() + getCashMemosBaseUrl() + `/${id}`;
      const params = new HttpParams()
        .set('subTxnType', subTxnType)
        .set('txnType', txnType);
      return { path, params };
    }
  } else {
    const path = getSalesBaseUrl() + getCashMemosBaseUrl();
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  }
};
export const getCashMemoRsoEndPointUrl = (
  txnType: string,
  subTxnType: string,
  id?: string,
  status?: string
): { path: string; params: HttpParams } => {
  if (txnType === 'CM') {
    const path = getSalesBaseUrl() + getCashMemosBaseUrl() + `/${id}`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  } else if (txnType === 'AB') {
    const path = getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  }
};
export const getorderServiceEndPointUrl = (
  txnType: string,
  subTxnType: string,
  id: string,
  status: string
): { path: string; params: HttpParams } => {
  if (txnType === 'CM') {
    const path = getSalesBaseUrl() + getCashMemosBaseUrl() + `/${id}`;
    const params = new HttpParams()
      .set('status', status)
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  } else if (txnType === 'ADV') {
    const path = getSalesBaseUrl() + getAdvancesBaseUrl() + `/${id}`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType)
      .set('status', status);
    return { path, params };
  } else if (txnType === 'AB') {
    const path = getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}`;
    const params = new HttpParams()
      .set('status', status)
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  } else if (txnType === 'CO') {
    const path = getSalesBaseUrl() + getCustomerOrdersBaseUrl() + `/${id}`;
    const params = new HttpParams()
      .set('status', status)
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  }
};
export const getAdvanceBookingEndPointUrl = (
  txnType: string,
  subTxnType: string,
  id?: string,
  status?: string,
  actionType?: string
): { path: string; params: HttpParams } => {
  if (id || status) {
    if (status) {
      const path = getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}`;
      const params = new HttpParams()
        .set('status', status)
        .set('subTxnType', subTxnType)
        .set('txnType', txnType);
      return { path, params };
    } else {
      const path = getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}`;
      const params = new HttpParams()
        .set('subTxnType', subTxnType)
        .set('txnType', txnType);
      return { path, params };
    }
  } else {
    const path = getSalesBaseUrl() + getOrdersBaseUrl();
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  }
};
export const getAdvanceBookingActionUrl = (
  txnType: string,
  subTxnType: string,
  id: string,
  actionType?: string,
  acknowledge?: boolean
): { path: string; params: HttpParams } => {
  if (actionType) {
    const path = getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}`;
    let params = new HttpParams()
      .set('actionType', actionType)
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);

    if (acknowledge) {
      params = params.append('ackReqRejection', `${acknowledge}`);
    }
    return { path, params };
  } else {
    const path = getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  }
};

export const getCashMemoCancelEndPoint = (
  txnType: string,
  subTxnType: string,
  customerMobileNo?: string,
  refDocNo?: number,
  fiscalYear?: number,
  page?: number,
  size?: number,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const urlPath = getSalesBaseUrl() + '/cancels';
  if (customerMobileNo && refDocNo && fiscalYear) {
    const params = new HttpParams()
      .set('customerMobileNo', customerMobileNo)
      .set('refDocNo', refDocNo.toString())
      .set('fiscalYear', fiscalYear.toString())
      .set('txnType', txnType)
      .set('subTxnType', subTxnType);
    return { path: urlPath, params };
  } else if (customerMobileNo && refDocNo) {
    const params = new HttpParams()
      .set('customerMobileNo', customerMobileNo)
      .set('refDocNo', refDocNo.toString())
      .set('txnType', txnType)
      .set('subTxnType', subTxnType);
    return { path: urlPath, params };
  } else if (customerMobileNo && fiscalYear) {
    const params = new HttpParams()
      .set('customerMobileNo', customerMobileNo)
      .set('fiscalYear', fiscalYear.toString())
      .set('txnType', txnType)
      .set('subTxnType', subTxnType);
    return { path: urlPath, params };
  } else if (refDocNo && fiscalYear) {
    const params = new HttpParams()
      .set('refDocNo', refDocNo.toString())
      .set('fiscalYear', fiscalYear.toString())
      .set('txnType', txnType)
      .set('subTxnType', subTxnType);
    return { path: urlPath, params };
  } else if (!customerMobileNo && !refDocNo && fiscalYear) {
    const params = new HttpParams()
      .set('fiscalYear', fiscalYear.toString())
      .set('txnType', txnType)
      .set('subTxnType', subTxnType);
    return { path: urlPath, params };
  } else if (!fiscalYear && !refDocNo && customerMobileNo) {
    const params = new HttpParams()
      .set('customerMobileNo', customerMobileNo)
      .set('txnType', txnType)
      .set('subTxnType', subTxnType);
    return { path: urlPath, params };
  } else if (!fiscalYear && refDocNo && !customerMobileNo) {
    const params = new HttpParams()
      .set('refDocNo', refDocNo.toString())
      .set('txnType', txnType)
      .set('subTxnType', subTxnType);
    return { path: urlPath, params };
  } else {
    const params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType);
    return { path: urlPath, params };
  }
};

export const getCashMemoGiftItemEndPointUrl = (
  txnType: string,
  subTxnType: string,
  id: string,
  giftCardItemId?: string,
  giftType?: string,
  vendorCode?: string
): { path: string; params: HttpParams } => {
  let urlPath = getSalesBaseUrl() + getCashMemosBaseUrl();
  let params: HttpParams;
  if (id && giftCardItemId) {
    urlPath = urlPath + `/${id}/gift-items/${giftCardItemId}`;
    params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
  } else if (id && vendorCode && giftType && !giftCardItemId) {
    urlPath = urlPath + `/${id}/gift-items`;
    params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType)
      .set('giftType', giftType)
      .set('vendorCode', vendorCode);
  }
  return { path: urlPath, params };
};

export const getAcceptAdvanceHistoryEndPointUrl = (
  subTxnType: string,
  txnType: string,
  searchField?: string,
  searchType?: string,
  status?: string,
  page?: number,
  size?: number
): { path: string; params: HttpParams } => {
  console.log(
    'SEARCH FIELD :',
    searchField,
    'SEARCH TYPE :',
    searchType,
    'STATUS :',
    status
  );
  const pageIndex = page.toString();
  const pageSize = size.toString();
  const urlPath = getSalesBaseUrl() + '/history' + '/accept-advance';
  let params: HttpParams;
  if (
    txnType &&
    subTxnType &&
    pageIndex &&
    pageSize &&
    searchField &&
    searchType &&
    status
  ) {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('searchField', searchField)
      .set('searchType', searchType)
      .set('status', status)
      .set('sort', 'salesTxn.docNo,desc');
  } else if (
    txnType &&
    subTxnType &&
    pageIndex &&
    pageSize &&
    searchField &&
    searchType &&
    !status
  ) {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('searchField', searchField)
      .set('searchType', searchType)
      .set('sort', 'salesTxn.docNo,desc');
  } else if (
    txnType &&
    subTxnType &&
    pageIndex &&
    pageSize &&
    !searchField &&
    !searchType &&
    status
  ) {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', status)
      .set('sort', 'salesTxn.docNo,desc');
  } else {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'salesTxn.docNo,desc');
  }
  return { path: urlPath, params };
};

export const getTEPHistoryEndPointUrl = (
  subTxnType: string,
  txnType: string,
  sort?: SortItem,
  searchField?: string,
  searchType?: string,
  status?: string,
  page?: number,
  size?: number
): { path: string; params: HttpParams } => {
  let sortvalue = sort.colId + ',' + sort.sort;

  const pageIndex = page.toString();
  const pageSize = size.toString();
  const urlPath = getSalesBaseUrl() + '/history' + '/goods-exchange';
  let params: HttpParams;
  if (
    txnType &&
    subTxnType &&
    pageIndex &&
    pageSize &&
    searchField &&
    searchType &&
    status &&
    sortvalue
  ) {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('searchField', searchField)
      .set('searchType', searchType)
      .set('status', status)
      .set('sort', sortvalue);
  } else if (
    txnType &&
    subTxnType &&
    pageIndex &&
    pageSize &&
    searchField &&
    searchType &&
    !status &&
    sortvalue
  ) {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('searchField', searchField)
      .set('searchType', searchType)
      .set('sort', sortvalue);
  } else if (
    txnType &&
    subTxnType &&
    pageIndex &&
    pageSize &&
    !searchField &&
    !searchType &&
    status &&
    sortvalue
  ) {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', status)
      .set('sort', sortvalue);
  } else {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sortvalue);
  }
  return { path: urlPath, params };
};

export const getGEPHistoryEndPointUrl = (
  subTxnType: string,
  txnType: string,
  searchField?: string,
  searchType?: string,
  status?: string,
  page?: number,
  size?: number
): { path: string; params: HttpParams } => {
  console.log(
    'SEARCH FIELD :',
    searchField,
    'SEARCH TYPE :',
    searchType,
    'STATUS :',
    status
  );
  const pageIndex = page.toString();
  const pageSize = size.toString();
  const urlPath = getSalesBaseUrl() + '/history' + '/goods-exchange';
  let params: HttpParams;
  if (
    txnType &&
    subTxnType &&
    pageIndex &&
    pageSize &&
    searchField &&
    searchType &&
    status
  ) {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('searchField', searchField)
      .set('searchType', searchType)
      .set('status', status);
  } else if (
    txnType &&
    subTxnType &&
    pageIndex &&
    pageSize &&
    searchField &&
    searchType &&
    !status
  ) {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('searchField', searchField)
      .set('searchType', searchType);
  } else if (
    txnType &&
    subTxnType &&
    pageIndex &&
    pageSize &&
    !searchField &&
    !searchType &&
    status
  ) {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', status);
  } else {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('page', page.toString())
      .set('size', size.toString());
  }

  params = params.append('sort', 'salesTxn.docNo,desc');
  return { path: urlPath, params };
};

export const getAcceptAdvanceEndPointUrl = (
  subTxnType: string,
  txnType: string,
  id?: string,
  remarks?: string
): { path: string; params: HttpParams } => {
  let urlPath = getSalesBaseUrl() + getAdvancesBaseUrl();
  let params: HttpParams;
  if (id) {
    urlPath = urlPath + `/${id}`;
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType)
      .set('remarks', remarks);
  } else {
    params = new HttpParams()
      .set('txnType', txnType)
      .set('subTxnType', subTxnType);
  }
  return { path: urlPath, params };
};

export const getPriceUpdateEndPointUrl = (
  id: string,
  txnType: string,
  subTxnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getCashMemosBaseUrl() + `/${id}/price`;
  const params = new HttpParams()
    .set('subTxnType', subTxnType)
    .set('txnType', txnType);
  return { path, params };
};

export const getInvokeOrderDetailsEndPointUrl = (
  txnType: string,
  subTxnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getCashMemosBaseUrl() + `/order`;
  const params = new HttpParams()
    .set('subTxnType', subTxnType)
    .set('txnType', txnType);
  return { path, params };
};

export const searchABWithActionUrl = (data: AdvanceBookingSearchPayload) => {
  let params = new HttpParams()
    .set('txnType', data.txnType)
    .set('page', `${data.page}`)
    .set('size', `${data.size}`);

  if (data.fiscalYear) {
    params = params.append('fiscalYear', `${data.fiscalYear}`);
  }
  if (data.docNo) {
    params = params.append('docNo', `${data.docNo}`);
  }
  if (data.mobileNumber) {
    params = params.append('mobileNumber', data.mobileNumber);
  }

  if (data.status) {
    params = params.append('actionType', data.status);
  }
  params = params.append('sort', 'docNo,desc');

  return { path: getSalesBaseUrl() + '/orders', params };
};

export const searchTEPWithActionUrl = (data: AdvanceBookingSearchPayload) => {
  let params = new HttpParams()
    .set('txnType', data.txnType)
    .set('page', `${data.page}`)
    .set('size', `${data.size}`)
    .set('txnType', `${data.txnType}`)
    .set('subTxnType', `${data.subTxnType}`);

  if (data.fiscalYear) {
    params = params.append('fiscalYear', `${data.fiscalYear}`);
  }
  if (data.docNo) {
    params = params.append('refDocNo', `${data.docNo}`);
  }
  if (data.mobileNumber) {
    params = params.append('customerMobileNo', data.mobileNumber);
  }

  params = params.append('sort', 'st.docNo,desc');

  return { path: getSalesBaseUrl() + '/cancels', params };
};

export const getAdvanceBookingPriceUpdateEndPointUrl = (
  id: string,
  txnType: string,
  subTxnType: string,
  action?: string
): { path: string; params: HttpParams } => {
  if (action) {
    const path = getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}/price`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType)
      .set('actionType', action);
    return { path, params };
  } else {
    const path = getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}/price`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  }
};

export const getCashMemoItemEndPointUrl = (
  id: string,
  txnType: string,
  subTxnType: string,
  itemId?: string,
  removeFromOrder: any = null,
  isIGST?: boolean
): { path: string; params: HttpParams } => {
  if (itemId) {
    if (removeFromOrder !== null) {
      const path =
        getSalesBaseUrl() + getCashMemosBaseUrl() + `/${id}/items/${itemId}`;
      const params = new HttpParams()
        .set('subTxnType', subTxnType)
        .set('txnType', txnType)
        .set('removeFromOrder', removeFromOrder);
      return { path, params };
    } else {
      const path =
        getSalesBaseUrl() + getCashMemosBaseUrl() + `/${id}/items/${itemId}`;
      let params = new HttpParams()
        .set('subTxnType', subTxnType)
        .set('txnType', txnType);
      if (isIGST !== null && isIGST !== undefined) {
        params = params.append('isIGST', isIGST.toString());
      }
      return { path, params };
    }
  } else {
    const path = getSalesBaseUrl() + getCashMemosBaseUrl() + `/${id}/items`;
    let params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    if (isIGST !== null && isIGST !== undefined) {
      params = params.append('isIGST', isIGST.toString());
    }
    return { path, params };
  }
};

export const getAdvanceBoookingItemEndPointUrl = (
  id: string,
  txnType: string,
  subTxnType: string,
  itemId?: string
): { path: string; params: HttpParams } => {
  if (itemId) {
    const path =
      getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}/items/${itemId}`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  } else {
    const path = getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}/items`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  }
};

export const getAdvanceBoookingCMItemEndPointUrl = (
  id: string,
  txnType: string,
  subTxnType: string,
  itemId: string,
  cashMemoId: string
): { path: string; params: HttpParams } => {
  const path =
    getSalesBaseUrl() + getOrdersBaseUrl() + `/${id}/items/${itemId}`;
  const params = new HttpParams()
    .set('subTxnType', subTxnType)
    .set('txnType', txnType)
    .set('cashMemoId', cashMemoId);
  return { path, params };
};

export const getPaymentModesEndpointUrl = (
  transactionType: TransactionTypeEnum
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set(
    'config-type',
    ConfigTypeEnum.PAYMENT_CONFIGURATIONS
  );

  return {
    path:
      getEngineBaseUrl() +
      getPaymentsUrl() +
      `/transactions/${transactionType}`,
    params
  };
};

export const getCustomerUrl = (customerId: string): string => {
  return getSalesBaseUrl() + `/customers/${customerId}`;
};

export const getPayerBanksEndpointUrl = (
  paymentMode: PaymentModeEnum
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('paymentCode', paymentMode);

  return {
    path: getEngineBaseUrl() + getPaymentsUrl() + `/payer-banks`,
    params
  };
};
export const getCreditNoteListUrl = (): string => {
  return engineBaseUrl() + '/payments/credit-note-types';
};
export const getBankPrioritiesEndpointUrl = (): string => {
  return getStoreBaseUrl() + `/bank-priorities`;
};

export const getPayeeBanksEndpointUrl = (
  paymentMode: PaymentModeEnum
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('paymentCode', paymentMode);

  return {
    path: getEngineBaseUrl() + getPaymentsUrl() + `/payee-banks`,
    params
  };
};

export const getPaymentRequestUrl = (): string => {
  return getSalesBaseUrl() + '/payment-requests';
};
export const getROPaymentRequestStatusURLByID = (id: string): string => {
  return getPaymentRequestUrl() + '/' + id;
};

export const getPaymentRequestStatusURL = (
  paymentMode: PaymentModeEnum
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('paymentCode', paymentMode)
    .set('sort', 'createdDate,desc');

  return {
    path: getPaymentRequestUrl() + '/list',
    params
  };
};

export const getQCGCPaymentEndpointURl = (
  cardDetails: QCGCGetBalancePayload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()
    .set('cardNumber', cardDetails.cardNumber)
    .set('vendorCode', cardDetails.cardType);

  if (cardDetails && cardDetails.otpRequired) {
    params = params.append('otpRequired', cardDetails.otpRequired?.toString());
  }

  return {
    path: getSalesBaseUrl() + `/balances/gift-cards`,
    params
  };
};

export const getDigiBalanceEndpointURl = (
  details: DigiGetBalancePayload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()

    .set('mobileNo', details.mobileNo)
    .set('transactionId', details.transactionId);

  return {
    path: getMasterSalesBaseUrl() + `/balances/digi-gold`,
    params
  };
};

export const getDigiPriceEndpointURl = (
  details: DigiGetBalancePayload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()

    .set('mobileNo', details.mobileNo)
    .set('transactionId', details.transactionId);

  return {
    path: getMasterSalesBaseUrl() + `/balances/digi-gold/price`,
    params
  };
};

export const generateDigiOtpEndpointURl = (
  details: GenerateOtpDigiGoldPayload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()

    .set('mobileNo', details.mobileNo)
    .set('transactionId', details.transactionId)
    .set('referenceId', details.referenceId);

  if (details.tanishqGoldGrams) {
    params = params.append('tanishqGoldGrams', details.tanishqGoldGrams);
  }

  if (details.nonTanishqGoldGrams) {
    params = params.append('nonTanishqGoldGrams', details.nonTanishqGoldGrams);
  }

  return {
    path: getSalesBaseUrl() + `/balances/digi-gold/otp`,
    params
  };
};

export const validateDigiOtpEndpointURl = (
  details: GenerateOtpDigiGoldPayload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()

    .set('mobileNo', details.mobileNo)
    .set('goldGrams', details.goldGrams)
    .set('otp', details.otp)
    .set('transactionId', details.transactionId)
    .set('vendorCode', details.vendorCode);

  return {
    path: getIntegrationServiceBaseurl() + `/digi-gold/verify-otp`,
    params
  };
};
export const getQCGCProductGroupEndpointURl = (
  cardDetails: QCGCGetBalancePayload
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('cardNumber', cardDetails.cardNumber);

  return {
    path: getEngineBaseUrl() + getPaymentsUrl() + `/QCGC/product-groups`,
    params
  };
};
export const getQCGCPaymentCustomerEndpointURl = (
  cardDetails: QCGCGetBalancePayload
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('giftCardNumber', cardDetails.cardNumber)
    .set('vendorCode', cardDetails.cardType);

  return {
    path: getSalesBaseUrl() + `/balances/gift-cards/customer`,
    params
  };
};

export const getGVBalanceUrl = (
  payload: GVStatusListingPayload
): { path: string; params: HttpParams } => {
  const path = '/payment/v2/gift-vouchers';

  const params = new HttpParams().set('serialNo', payload.serialNo);

  return { path, params };
};

export const getAddPaymentEndpointUrl = (
  transactionType: TransactionTypeEnum,
  subTransactionType: SubTransactionTypeEnum,
  transactionId: string,
  paymentMode: string,
  paymentGroup: PaymentGroupEnum,
  isTcsPayment?: any
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()
    .set('txnType', transactionType)
    .set('subTxnType', subTransactionType)
    .set('transactionId', transactionId)
    .set('paymentCode', paymentMode)
    .set('paymentGroup', paymentGroup);

  if (isTcsPayment) {
    params = params.append('isTcsPayment', isTcsPayment);
  }
  return {
    path: getSalesBaseUrl() + getPaymentsUrl(),
    params
  };
};

// TODO :  use getEditPaymentEndpointUrl
export const UpdateUnipayPaymentEndpointUrl = (
  status: string,
  transactionId: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('status', status);

  return {
    path: getSalesBaseUrl() + getPaymentsUrl() + `/${transactionId}`,
    params
  };
};
export const getPaymentEndpointUrl = (
  transactionType: TransactionTypeEnum,
  subTransactionType: SubTransactionTypeEnum,
  paymentId: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('txnType', transactionType)
    .set('subTxnType', subTransactionType);

  return {
    path: getSalesBaseUrl() + getPaymentsUrl() + `/${paymentId}`,
    params
  };
};

export const getLinkedCNPaymentEndpointUrl = (
  transactionType: TransactionTypeEnum,
  subTransactionType: SubTransactionTypeEnum,
  paymentId: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('txnType', transactionType)
    .set('subTxnType', subTransactionType);

  return {
    path:
      getSalesBaseUrl() +
      getPaymentsUrl() +
      `/${paymentId}` +
      `/linked-payments`,
    params
  };
};

export const getEditPaymentEndpointUrl = (
  transactionType: TransactionTypeEnum,
  subTransactionType: SubTransactionTypeEnum,
  paymentId: string,
  status: PaymentStatusEnum
): {
  path: string;
  params: HttpParams;
} => {
  const api = getPaymentEndpointUrl(
    transactionType,
    subTransactionType,
    paymentId
  );
  return { path: api.path, params: api.params.set('status', status) };
};

export const getConfirmPaymentEndpointUrl = (
  transactionType: TransactionTypeEnum,
  subTransactionType: SubTransactionTypeEnum,
  paymentId: string,
  status: PaymentStatusEnum
): {
  path: string;
  params: HttpParams;
} => {
  const api = getPaymentEndpointUrl(
    transactionType,
    subTransactionType,
    paymentId
  );

  return { path: api.path, params: api.params.set('status', status) };
};
export const getConfirmlinkedCNPaymentEndpointUrl = (
  transactionType: TransactionTypeEnum,
  subTransactionType: SubTransactionTypeEnum,
  orderId: string
): {
  path: string;
  params: HttpParams;
} => {
  const api = getLinkedCNPaymentEndpointUrl(
    transactionType,
    subTransactionType,
    orderId
  );

  return { path: api.path, params: api.params };
};
export const getMaxCashLimitEndpointUrl = (
  transactionType: TransactionTypeEnum,
  subTransactionType: SubTransactionTypeEnum,
  customerId: string,
  paymentCode: PaymentModeEnum,
  paymentGroup: PaymentGroupEnum,
  transactionId: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('customerId', customerId)
    .set('paymentCode', paymentCode)
    .set('paymentGroup', paymentGroup)
    .set('transactionId', transactionId)
    .set('txnType', transactionType)
    .set('subTxnType', subTransactionType);

  return {
    path: getSalesBaseUrl() + getPaymentsUrl() + '/check-eligibility',
    params
  };
};

export const getCashLimitCapUrl = (
  config
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams();

  return {
    path: getEngineBaseUrl() + '/rule-types/' + config + '/values',
    params
  };
};

export const getLoadPaymentDetailsEndpointUrl = (
  transactionId: string,
  transactionType: TransactionTypeEnum,
  subTransactionType: SubTransactionTypeEnum
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('transactionId', transactionId)
    .set('txnType', transactionType)
    .set('subTxnType', subTransactionType);

  return {
    path: getSalesBaseUrl() + getPaymentsUrl(),
    params
  };
};

export const getLoadCreditNoteDetailsEndpointUrl = (
  transactionId: string,
  type: string
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams();
  if (type === 'CMCAN') {
    params = params.append('transactionId', transactionId);
  } else {
    params = params.append('linkedTxnId', transactionId);
  }

  return {
    path: getSalesBaseUrl() + `/credit-note`,
    params
  };
};

export const getUnipayEndpointUrl = (
  uniPayRequest: UniPayRequest
): {
  path: string;
  params: HttpParams;
} => {
  const UniPayPayload: string =
    uniPayRequest.txnType +
    ',' +
    uniPayRequest.txnMode +
    ',' +
    uniPayRequest.txnId +
    ',' +
    uniPayRequest.txnAmount * 100 +
    ',' +
    uniPayRequest.date;
  const params = new HttpParams().set('value', UniPayPayload);
  return {
    path: getUnipayBaseUrl(),
    params
  };
};

export const getVoidUnipayEndpointUrl = (
  uniPayRequest: UniPayRequest
): {
  path: string;
  params: HttpParams;
} => {
  const UniPayPayload: string =
    uniPayRequest.txnType +
    ',' +
    uniPayRequest.txnMode +
    ',' +
    uniPayRequest.txnId +
    ',' +
    uniPayRequest.BankInvoiceNumber +
    ',' +
    uniPayRequest.date;
  const params = new HttpParams().set('value', UniPayPayload);
  return {
    path: getUnipayBaseUrl(),
    params
  };
};

export const verifyHostNameEndpointUrl = (): string => {
  return getEngineBaseUrl() + getPaymentsUrl() + '/hostnames';
};

export const getDecryptedHostNameEndpointUrl = (): string => {
  return getDecryptedHostNameUrl();
};
export const getGepInitUrl = (
  subTxnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getGepBaseUrl();
  const params = new HttpParams()
    .set('subTxnType', subTxnType)
    .set('txnType', 'GEP');
  return { path, params };
};

export const deleteGepUrl = (data): { path: string; params: HttpParams } => {
  const path =
    getSalesBaseUrl() + getGepBaseUrl() + `/${data.id}/items/${data.itemId}`;
  const params = new HttpParams()
    .set('subTxnType', data.subTxnType)
    .set('txnType', 'GEP');
  return { path, params };
};

export const holdConfirmUrl = (data): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getGepBaseUrl() + `/${data.id}`;
  const params = new HttpParams()
    .set('status', data.status)
    .set('subTxnType', data.subTxnType)
    .set('txnType', 'GEP');
  return { path, params };
};

export const postRsoUrl = (
  subTxnType: string,
  id: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getGepBaseUrl() + `/${id}`;
  const params = new HttpParams()
    .set('subTxnType', subTxnType)
    .set('txnType', 'GEP');
  return { path, params };
};

export const getGoodExchangeUrl = (
  id: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getGepBaseUrl() + `/${id}`;
  const params = new HttpParams()
    .set('subTxnType', subTxnType)
    .set('txnType', txnType);
  return { path, params };
};

export const postGepUrl = (
  subTxnType: string,
  id: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getGepBaseUrl() + `/${id}/gep/items`;
  const params = new HttpParams()
    .set('subTxnType', subTxnType)
    .set('txnType', 'GEP');
  return { path, params };
};
export const metalUrl = (date): { path: string; params: HttpParams } => {
  if (date) {
    const path = `/engine/v2/price/metals/standard`;
    const params = new HttpParams().set('applicableDate', date);
    return { path, params };
  } else {
    const path = `/engine/v2/price/metals/standard`;
    const params = new HttpParams();
    return { path, params };
  }
};

export const metalTypeUrl = (
  data: string
): { path: string; params: HttpParams } => {
  const path = `/engine/v2/products/item-types`;
  const params = new HttpParams().set('itemGroups', data);
  return { path, params };
};

export const getProductGroupDetailsUrl = (
  productType: string,
  transacionType: string
): { path: string; params: HttpParams } => {
  const path = getEngineBaseUrl() + '/products/product-groups/cache';
  const params = new HttpParams()
    .set('plainStudded', productType)
    .set('transactionType', transacionType);
  return { path, params };
};

export const itemTypeUrl = (data: string): string => {
  return `/engine/v2/products/lovs/${data}`;
};

export const postTotalBreakUpUrl = (): string => {
  return `/engine/v2/price/gep`;
};

export const getCancelUrl = (data): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/cancels`;

  let params = new HttpParams();
  if (data.customerMobileNo && data.customerMobileNo !== '') {
    params = params.append('customerMobileNo', data.customerMobileNo);
  }
  if (data.customerName && data.customerName !== '') {
    params = params.append('customerName', data.customerName);
  }
  if (data.docDate && data.docDate !== '') {
    params = params.append('docDate', data.docDate.toString());
  }
  if (data.fiscalYear && data.fiscalYear !== undefined) {
    params = params.append('fiscalYear', data.fiscalYear.toString());
  }

  if (data.page && data.page !== undefined) {
    params = params.append('page', data.page.toString());
  }
  if (data.refDocNo && data.refDocNo !== undefined) {
    params = params.append('refDocNo', data.refDocNo.toString());
  }
  if (data.size && data.size !== undefined) {
    params = params.append('size', data.size.toString());
  }

  if (data.sort) {
    for (let i = 0; i < data.sort.length; i++) {
      params = params.append('sort', data.sort[i]);
    }
  }

  params = params.append('subTxnType', 'GEP');

  params = params.append('txnType', 'GEPCAN');

  return {
    path,
    params
  };
};

export const saveCancelUrl = (data): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/cancels`;
  const params = new HttpParams()
    .set('subTxnType', data.subTxnType)
    .set('txnType', 'GEPCAN');
  return { path, params };
};
export const deleteGEPUrl = (data): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getGepBaseUrl() + `/${data.id}`;

  let params = new HttpParams();
  if (data.remarks && data.remarks !== '') {
    params = params.append('remarks', data.remarks);
  }

  if (data.subTxnType && data.subTxnType !== '') {
    params = params.append('subTxnType', data.subTxnType);
  }

  params = params.append('txnType', 'GEP');

  return {
    path,
    params
  };
};
export const getOnHoldCountUrl = (
  data
): { path: string; params: HttpParams } => {
  const params = new HttpParams()
    .set('status', data.status)
    .set('subTxnType', data.subTxnType)
    .set('txnType', 'GEP');

  return {
    path: getSalesBaseUrl() + `/transactions/counts`,
    params
  };
};
export const getOnHoldUrl = (data): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/transactions`;

  let params = new HttpParams();

  if (data.customerName && data.customerName !== '') {
    params = params.append('customerName', data.customerName);
  }
  if (data.docNo && data.docNo !== undefined) {
    params = params.append('docNo', data.docNo.toString());
  }

  if (data.page && data.page !== undefined) {
    params = params.append('page', data.page.toString());
  }

  if (data.size && data.size !== undefined) {
    params = params.append('size', data.size.toString());
  }

  if (data.sort) {
    for (let i = 0; i < data.sort.length; i++) {
      params = params.append('sort', data.sort[i]);
    }
  }
  if (data.status && data.status !== '') {
    params = params.append('status', data.status);
  }

  if (data.subTxnType && data.subTxnType !== '') {
    params = params.append('subTxnType', data.subTxnType);
  }

  params = params.append('txnType', 'GEP');

  return {
    path,
    params
  };
};

export const getGepItemUrl = (data): { path: string; params: HttpParams } => {
  const params = new HttpParams()
    .set('subTxnType', data.subTxnType)
    .set('txnType', 'GEP');

  return {
    path: getSalesBaseUrl() + getGepBaseUrl() + `/${data.id}`,
    params
  };
};

export const putGepItemUrl = (data): { path: string; params: HttpParams } => {
  const path =
    getSalesBaseUrl() +
    getGepBaseUrl() +
    `/${data.id}/gep/items/${data.itemId}`;
  const params = new HttpParams()
    .set('subTxnType', data.subTxnType)
    .set('txnType', 'GEP');

  return { path, params };
};

export const updatePriceUrl = (data): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getGepBaseUrl() + `/${data.id}/price`;
  const params = new HttpParams()
    .set('subTxnType', 'NEW_GEP')
    .set('txnType', 'GEP');

  return { path, params };
};

export const uploadPreDeclarationFormUrl = (data): string => {
  return (
    getSalesBaseUrl() +
    `/files/upload?customerId=${data.customerId}&docType=GEP&fileType=PRE_DECLARATION_FORM&id=${data.id}&txnType=GEP`
  );
};

export const downloadPreDeclarationFormUrl = (data): string => {
  return (
    getSalesBaseUrl() +
    `/files/presigned-url?documentType=GEP&fileType=PRE_DECLARATION_FORM&id=${data.id}&customerId=${data.customerId}`
  );
};

export const uploadManualBillUrl = (data): string => {
  return (
    getSalesBaseUrl() +
    `/files/upload?docType=${data.txnType}&fileType=OTHERS&id=${data.id}`
  );
};

export const downloadManualBillUrl = (data): string => {
  if (data.locationCode) {
    return (
      getSalesBaseUrl() +
      `/files/${data.id}/presigned-url?locationCode=${data.locationCode}`
    );
  } else {
    return getSalesBaseUrl() + `/files/${data.id}/presigned-url`;
  }
};

export const manualBillListUrl = (data): string => {
  if (data.locationCode) {
    return (
      getSalesBaseUrl() +
      `/files/list?documentType=${data.txnType}&fileType=OTHERS&id=${data.id}&locationCode=${data.locationCode}`
    );
  } else {
    return (
      getSalesBaseUrl() +
      `/files/list?documentType=${data.txnType}&fileType=OTHERS&id=${data.id}`
    );
  }
};

export const getCmRequestListUrl = (
  approvalStatus: string,
  pageIndex: number,
  pageSize: number,
  workflowType: string
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + `/workflow-task`;
  const params = new HttpParams()
    .set('sort', 'docNo,ASC')
    .set('approvalStatus', approvalStatus)
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('workflowType', workflowType);

  return { path, params };
};

export const getGRFRequestListUrl = (
  approvalStatus: string,
  pageIndex: number,
  pageSize: number,
  workflowType: string
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + `/workflow-task`;
  const params = new HttpParams()
    .set('sort', 'docNo,ASC')
    .set('approvalStatus', approvalStatus)
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('workflowType', workflowType);

  return { path, params };
};

export const getGRFRequestDetailsUrl = (
  processId: string,
  taskId: string,
  taskName: string,
  workflowType: string
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + `/workflow-task/${taskId}`;

  const params = new HttpParams()
    .set('processId', processId)
    .set('taskName', taskName)
    .set('workflowType', workflowType);

  return {
    path,
    params
  };
};

export const getCmRequestDetailsUrl = (
  processId: string,
  taskId: string,
  taskName: string,
  workflowType: string
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + `/workflow-task/${taskId}`;

  const params = new HttpParams()
    .set('processId', processId)
    .set('taskName', taskName)
    .set('workflowType', workflowType);

  return {
    path,
    params
  };
};

export const getCnRequestListUrl = (
  customerId,
  isPageable,
  isFrozenRateCnRequired,
  status?: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/credit-note`;

  let params = new HttpParams()
    .set('customerId', customerId)
    .set('isPageable', isPageable)
    .set('isFrozenRateCnRequired', isFrozenRateCnRequired);

  if (status) {
    params = params.set('status', status);
  }

  return {
    path,
    params
  };
};

export const getCnRequestListByCnTypeUrl = (
  customerId,
  cnType,
  isFrozenRateCnRequired,
  isPageable
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/credit-note`;

  const params = new HttpParams()
    .set('customerId', customerId)
    .set('cnType', cnType)
    .set('isFrozenRateCnRequired', isFrozenRateCnRequired)
    .set('isPageable', isPageable);
  return {
    path,
    params
  };
};

export const getThirdPartyCnRequestListUrl = (
  customerIds,
  isPageable
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/credit-note`;

  const params = new HttpParams()
    .set('ids', customerIds)
    .set('isPageable', isPageable);

  return {
    path,
    params
  };
};

export const getInvokeCNUrl = (
  cnNumber,
  fiscalYear
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/credit-note`;

  const params = new HttpParams()
    .set('docNo', cnNumber)
    .set('fiscalYear', fiscalYear);

  return {
    path,
    params
  };
};

export const getCnPriorityUrl = (ruleType: string): string => {
  return engineBaseUrl() + `rule-types/${ruleType}/values`;
};

export const generateOTPForCnUrl = (
  customerId,
  otpType
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/otp`;
  const params = new HttpParams()
    .set('id', `${customerId}`)
    .set('otpType', otpType);

  return { path, params };
};

export const getCmApprovalRequestUrl = (
  isApprove: boolean,
  processId: string,
  taskId: string,
  taskName: string
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + `/workflow-task/approval`;
  const params = new HttpParams()
    .set('approved', `${isApprove}`)
    .set('taskId', taskId)
    .set('processId', processId)
    .set('taskName', taskName);

  return { path, params };
};

export const getWorkFlowProcessUrl = (
  requestParams
): {
  path: string;
  params: HttpParams;
} => {
  const path = getWorkFlowUrl() + '/workflow-process/list';
  const params = new HttpParams()
    .set('sort', 'docNo,ASC')
    .set('approvalStatus', requestParams.approvalStatus)
    .set('size', requestParams.size)
    .set('page', requestParams.page)
    .set('workflowType', requestParams.workflowType);
  return {
    path,
    params
  };
};

export const getRefundStatusUrl = (
  requestParams
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + '/refund/list';
  const params = new HttpParams()
    .set('sort', 'docNo,ASC')

    .set('size', requestParams.size)
    .set('page', requestParams.page)
    .set('txnType', requestParams.txntype);
  return {
    path,
    params
  };
};

export const getRefundDetailsUrl = (
  data: RefundRequestPayload
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + `/refund/${data.id}`;
  let params = new HttpParams().set('txnType', data.txnType);
  if (data.status) {
    params = params.append('status', data.status);
  }
  return {
    path,
    params
  };
};
export const getWorkFlowProcessDetailsUrl = (
  requestParams
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set(
    'workflowType',
    requestParams.workflowType
  );
  return {
    path: getWorkFlowUrl() + `/workflow-process/${requestParams.processId}`,
    params
  };
};

export const validatePaymentEndpointUrl = (
  transactionType: TransactionTypeEnum,
  subTransactionType: SubTransactionTypeEnum,
  paymentID: string,
  inputString?: string
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()
    .set('txnType', transactionType)
    .set('subTxnType', subTransactionType);
  if (inputString && inputString !== '') {
    params = params.append('inputValue', inputString);
  }
  return {
    path:
      getSalesBaseUrl() + getPaymentsUrl() + '/' + `${paymentID}` + '/validate',
    params
  };
};

export const getPendingFocCMUrl = (
  txnType: string,
  subTxnType: string,
  fiscalYear?: string,
  customerId?: string,
  docNo?: number,
  transactionId?: string,
  status?: string
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType)
    .set('sort', 'docNo,desc');
  if (fiscalYear && fiscalYear !== '') {
    params = params.append('fiscalYear', fiscalYear);
  }
  if (customerId && customerId !== '') {
    params = params.append('customerId', customerId);
  }
  if (transactionId && transactionId !== '') {
    params = params.append('transactionId', transactionId);
  }
  if (status && status !== '') {
    params = params.append('status', status);
  }
  return { path: '/sales/cash-memo/foc/pending', params };
};

export const getPendingFocSchemesUrl = (
  txnType: string,
  subTxnType: string,
  id: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = `/sales/v2/cash-memo/${id}/foc-schemes`;
  const params = new HttpParams()
    .set('subTxnType', subTxnType)
    .set('txnType', txnType);

  return { path, params };
};

export const getFocItemsDetailsUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()

    .set('page', (0).toString())
    .set('size', (999).toString());
  return { path: '/engine/v2/inventory/foc-items', params };
};
export const confirmPendingFocUrl = (
  refTxnId: string,
  subTxnType: string,
  txnType: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('refTxnId', refTxnId)
    .set('txnType', txnType)
    .set('subTxnType', subTxnType);

  return { path: '/sales/cash-memo/foc/items', params };
};

export const getBillCancellationRequestUrl = (
  data
): {
  path: string;
  params: HttpParams;
} => {
  const path = getWorkFlowUrl() + getWorkflowTaskUrl();
  const params = new HttpParams()
    .set('approvalStatus', data.approvalStatus)
    .set('page', data.page)
    .set('size', data.size)
    .set('workflowType', data.workflowType);

  return { path, params };
};

export const getCancelTypeEndPointUrl = (
  refTxnId: string,
  subTxnType: string,
  txnType: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType);

  return { path: `/sales/v2/cancels/bills/${refTxnId}/cancel-types`, params };
};

export const getBulkApproveUrl = (): string => {
  return getWorkFlowUrl() + getWorkflowTaskUrl() + `/approvals`;
};

export const getBillCancelUrl = (): string => {
  return `/integration/v2/api-call/eposs`;
};

export const putBillCancellationUrl = (
  data
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + getWorkflowTaskUrl() + `/approval`;
  const params = new HttpParams()
    .set('approved', data.approved)
    .set('processId', data.processId)
    .set('taskId', data.taskId)
    .set('taskName', data.taskName);

  return { path, params };
};

export const getBillCountUrl = (data): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + getWorkflowTaskUrl() + `/count`;
  const params = new HttpParams()
    .set('approvalStatus', data.approvalStatus)
    .set('workflowType', data.workflowType);

  return { path, params };
};

export const getDayWiseRevenueUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/revenues/days`;
  const params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .append('sort', 'businessDate,desc');
  return { path, params };
};

export const getTodayRevenueUrl = (
  locationCode
): { path: string; params?: HttpParams } => {
  const path = getSalesBaseUrl() + `/revenues/todays`;
  const params = new HttpParams().set('locationCode', locationCode);
  if (locationCode !== '') {
    return { path, params };
  } else {
    return { path };
  }
};

export const getGHSRevenueUrl = (
  venderCode
): { path: string; params: HttpParams } => {
  const path = '/integration/v2/ghs/revenue';
  const params = new HttpParams().set('vendorCode', venderCode);
  return { path, params };
};

export const getServiceRevenueUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = '/integration/v2/service-poss/todays-revenue';
  const params = new HttpParams();
  return { path, params };
};

export const getTodayGHSRevenueUrl = (
  locationCode
): { path: string; params?: HttpParams } => {
  const path = getSalesBaseUrl() + `/revenues/todays/ghs`;
  const params = new HttpParams().set('locationCode', locationCode);
  if (locationCode !== '') {
    return { path, params };
  } else {
    return { path };
  }
};

export const getTodayServiceRevenueUrl = (
  locationCode
): { path: string; params?: HttpParams } => {
  const path = getSalesBaseUrl() + `/revenues/todays/service`;
  const params = new HttpParams().set('locationCode', locationCode);
  if (locationCode !== '') {
    return { path, params };
  } else {
    return { path };
  }
};

export const getBankDepositUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/bankings/deposits`;
  const params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .append('sort', 'businessDate,desc');
  return { path, params };
};

export const getBankDepositDateUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + '/bankings/deposit-date';
  const params = new HttpParams();

  return {
    path,
    params
  };
};

export const getPIFSeriesUrl = (
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/pif-series`;
  const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString());
  return { path, params };
};
export const getSavePIFSeriesUrl = (): string => {
  return getSalesBaseUrl() + `/pif-series`;
};
export const deleteBillCancelUrl = (
  data
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/cancels/request/${data.id}`;
  const params = new HttpParams()
    .set('subTxnType', data.subTxnType)
    .set('txnType', 'CMCAN');
  return { path, params };
};

export const confirmBillCancelUrl = (
  data
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/cancels/request`;
  const params = new HttpParams()
    .set('subTxnType', data.subTxnType)
    .set('txnType', 'CMCAN');
  return { path, params };
};
export const cancelBillCancelUrl = (
  data
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/cancels/${data.id}`;
  const params = new HttpParams()
    .set('subTxnType', data.subTxnType)
    .set('txnType', 'CMCAN');
  return { path, params };
};

export const directCancelBillCancelUrl = (
  data
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/cancels`;
  const params = new HttpParams()
    .set('subTxnType', data.subTxnType)
    .set('txnType', 'CMCAN');
  return { path, params };
};

export const directCancelTEPUrl = (): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/cancels`;
  const params = new HttpParams()
    .set('subTxnType', 'TEP')
    .set('txnType', 'TEPCAN');
  return { path, params };
};

export const getAirpayRequestsUrl = (
  page: number,
  paymentCode: string,
  size: number,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('paymentCode', paymentCode)
    .set('size', size.toString());

  if (sort) {
    for (let i = 0; i < sort.length; i++) {
      params = params.append('sort', sort[i]);
    }
  }
  return { path: '/sales/v2/payment-requests/list', params };
};

export const validateAirpayPaymentRequestsEndpointUrl = (
  paymentID: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams();
  return {
    path: getSalesBaseUrl() + '/payment-requests/' + `${paymentID}`,
    params
  };
};
export const airpayGenerateCnEndpointUrl = (
  payload: GenerateCnPayload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams();
  if (payload.untilizedAmount) {
    params = params.set('untilizedAmount', payload.untilizedAmount.toString());
  }
  return {
    path: getSalesBaseUrl() + '/payment-requests/' + `${payload.id}`,
    params
  };
};

export const getNotificationEndPointUrl = (): string => {
  return getEngineBaseUrl() + `/notifications/register-emitter`;
};

export const getCmBillListEndpointUrl = (
  txnType: string,
  subTxnType: string,
  pageIndex: number,
  pageSize: number,
  customerName: string,
  refDocNo: number,
  sort: any
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/cancels`;
  let params = new HttpParams()
    .set('subTxnType', subTxnType)
    .set('txnType', txnType);

  if (pageIndex && pageIndex !== 0) {
    params = params.set('page', pageIndex.toString());
  }
  if (pageSize && pageSize !== 0) {
    params = params.set('size', pageSize.toString());
  }
  if (customerName && customerName !== '') {
    params = params.set('customerName', customerName);
  }
  if (refDocNo && refDocNo !== 0) {
    params = params.set('refDocNo', refDocNo.toString());
  }
  if (sort) {
    params = params.set('sort', `docNo,${sort}`);
  }

  return { path, params };
};
/*Bod-Eod Related Below*/
export const getBusinessDaysBaseUrl = () => '/business-days';
export const getCustomerVisitsUrl = () => '/customer-visits';
export const getBankingsUrl = () => '/bankings';
export const getBodBusinessDayEndpointUrl = (): string => {
  return getSalesBaseUrl() + getBusinessDaysBaseUrl() + '/bod';
};
export const getAvailableMetalRatesEndpointUrl = (): string => {
  return getEngineBaseUrl() + '/price/metals/standard';
};

export const getBusinessDayEndpointUrl = (): string => {
  return getSalesBaseUrl() + getBusinessDaysBaseUrl();
};
export const getGhsBodBusinessDayEndpointUrl = () => {
  return getBodBusinessDayEndpointUrl() + '/ghs';
};
export const getgeneratePasswordForEghsBodEndpointUrl = () => {
  return getSalesBaseUrl() + `/store-passwords`;
};
export const getgOfflineEghsBodListingEndpointUrlWithQueryParams = (requestParams: {
  contextType: string;
  pageIndex: number;
  pageSize: number;
  sortBy;
}) => {
  const path = getSalesBaseUrl() + `/store-passwords`;
  const params = new HttpParams()
    .set('contextType', requestParams.contextType)
    .set('page', requestParams.pageIndex.toString())
    .set('size', requestParams.pageSize.toString())
    .set('sort', requestParams.sortBy);
  return { path: path, params: params };
};

export const getEodBusinessDayEndpointUrl = (): string => {
  return getSalesBaseUrl() + getBusinessDaysBaseUrl() + '/eod';
};

export const getLatestBodEndpointUrl = (): string => {
  return '/engine/v2/revenues/business-day/latest';
};

export const getOpenBusinessDayUrl = (): string => {
  return '/engine/v2/revenues/business-day';
};
export const getWalkInDetailsEndpointUrl = (): string => {
  return getSalesBaseUrl() + getCustomerVisitsUrl() + '/details';
};
export const getWalkInDetailsConversionCountEndpointUrl = (): string => {
  return getSalesBaseUrl() + getCustomerVisitsUrl() + '/conversion-count';
};
export const getWalkInDetailsCustomerVisitsCountEndpointUrl = (): string => {
  return getSalesBaseUrl() + getCustomerVisitsUrl() + '/count';
};
export const walkInsHistoryDataApiUrl = (): string => {
  return getSalesBaseUrl() + getCustomerVisitsUrl();
};
export const saveWalkInDetailsEndpointUrl = (): string => {
  return getSalesBaseUrl() + getCustomerVisitsUrl();
};
export const getGhsBankDepositUploadEndpointUrl = (): string => {
  return getSalesBaseUrl() + getBankingsUrl() + '/ghs';
};
export const getPreviousDayBankDepositEndpointUrl = (): string => {
  return getSalesBaseUrl() + getBankingsUrl();
};
export const getRevenueCollectionEndpointUrl = (): string => {
  return getSalesBaseUrl() + getBusinessDaysBaseUrl() + '/eod/revenue';
};
export const getGhsRevenueCollectionEndpointUrl = (): string => {
  return getSalesBaseUrl() + getBusinessDaysBaseUrl() + '/eod/ghs/revenue';
};
export const getServiceRevenueCollectionEndpointUrl = (): string => {
  return getSalesBaseUrl() + getBusinessDaysBaseUrl() + '/eod/service/revenue';
};
export const getSchedulerEndpointUrlWithQueryParams = (
  requestParams: string
) => {
  const path = getIntegrationServiceBaseurl() + '/scheduler';
  let params = new HttpParams();
  params = params.set('schedulerCode', requestParams);
  return { path: path, params: params };
};

export const getGhsEodActivityEndpointUrl = (): string => {
  return getSalesBaseUrl() + getBusinessDaysBaseUrl() + '/eod/ghs';
};
export const getEodActivityEndpointUrl = (): string => {
  return getSalesBaseUrl() + getBusinessDaysBaseUrl() + '/eod';
};

export const getEodOfflineGhsRevenueCollectionEndpointUrl = (): string => {
  return (
    getSalesBaseUrl() + getBusinessDaysBaseUrl() + `/eod/ghs/offline/revenue`
  );
};
//NAP-7851
export const getActiveUserSessionsEndpointUrl = (): string => {
  return getEngineBaseUrl() + '/users/active-sessions';
};

// Update Metal Rates
export const getLocationMetalRatesEndpointUrl = (): string => {
  return getEngineBaseUrl() + '/locations/metal-rates';
};
///FOC
export const getCurrentConfiguredFOCSchemesUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams();
  return {
    path: getEngineBaseUrl() + '/configs/foc-schemes/location',
    params
  };
};

export const getFocSchemesAndItemsUrl = (
  payload
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams();
  if (payload.cashMemoId && payload.abItemIdList.length !== 0) {
    params = params
      .set('cashMemoId', payload.cashMemoId)
      .set('abItemIdList', payload.abItemIdList.toString());
  }
  return {
    path: getEngineBaseUrl() + '/configs/foc-schemes',
    params
  };
};

// AB FOC
export const getABFocSchemesUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams();
  return {
    path: getEngineBaseUrl() + '/configs/foc-schemes/advance-booking',
    params
  };
};

export const getSelectedABFocSchemesUrl = (
  id: string,
  txnType: TransactionTypeEnum,
  subTxnType: SubTransactionTypeEnum
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType);
  return {
    path: getSalesBaseUrl() + `/advance-booking/${id}/foc-items`,
    params
  };
};

export const getDeleteABFocSchemesUrl = (
  txnType: TransactionTypeEnum,
  subTxnType: SubTransactionTypeEnum,
  id?: string,
  focSchemeId?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType);

  if (focSchemeId) {
    params = params.set('focSchemeId', focSchemeId.toString());
  } else {
    params = params.set('id', id);
  }

  return {
    path: getSalesBaseUrl() + `/advance-booking/foc-items`,
    params
  };
};

export const getManualFocItemUrl = (
  mobileNumber: string
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams();

  params = params.set('mobileNumber', mobileNumber);

  return {
    path: getEngineBaseUrl() + '/configs/foc-schemes/manual-foc',
    params
  };
};

export const getPrinterDetailsUrl = (
  pageIndex?,
  pageSize?,
  sortField?: SortItem
): {
  path: string;
  params: HttpParams;
} => {
  let sort = 'createdDate,Desc';
  if (sortField) {
    sort = sortField.colId + ',' + sortField.sort;
  }
  const path = getStoreBaseUrl() + '/printer-configs';
  const params = new HttpParams()
    .set('page', pageIndex)
    .set('sort', sort)
    .set('size', pageSize);
  return {
    path,
    params
  };
};

export const getPrinterNameUrl = (
  documentType: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + '/stores/printer-configs';
  const params = new HttpParams().set('documentType', documentType);

  return {
    path,
    params
  };
};

export const getAddPrinterDetailsUrl = (): string => {
  const url = getStoreBaseUrl() + '/printer-configs';

  return url;
};
export const getFocToCmUrl = (
  id: string,
  subTxnType: string,
  txnType: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType);
  return {
    path: getSalesBaseUrl() + getCashMemosBaseUrl() + `/${id}` + '/foc-items',
    params
  };
};
export const getUploadEghsFileUploadUrl = (): string => {
  return getSalesBaseUrl() + getBankingsUrl() + `/file-upload`;
};
export const getUploadServicePossFileUploadUrl = (): string => {
  return getSalesBaseUrl() + getBankingsUrl() + `/service-file-upload`;
};
export const getManualFocToCmUrl = (
  id: string,
  subTxnType: string,
  txnType: string,
  approvedBy,
  startDate,
  endDate
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType);

  if (approvedBy !== '' && approvedBy) {
    params = params.append('approvedBy', approvedBy);
  }

  if (startDate !== null && startDate) {
    params = params.append('manualFocStartDate', startDate);
  }
  if (endDate !== null && endDate) {
    params = params.append('manualFocEndDate', endDate);
  }
  return {
    path:
      getSalesBaseUrl() +
      getCashMemosBaseUrl() +
      `/${id}` +
      '/foc-items/add-manual-foc',
    params
  };
};

export const getManualFocToCmGetUrl = (
  id: string,
  subTxnType: string,
  txnType: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType);
  return {
    path:
      getSalesBaseUrl() +
      getCashMemosBaseUrl() +
      `/${id}` +
      '/foc-items/get-manual-foc',
    params
  };
};

export const getCreditNoteSearchUrl = (
  cnNumber: string,
  fiscalYear: string,
  mobileNumber: string,
  startDate: string,
  endDate: string,
  pageIndex: number,
  pageSize: number,
  isUnipayCN: boolean
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + getCreditNoteurl();
  let params = new HttpParams();
  if (cnNumber !== '') {
    params = params.set('docNo', cnNumber);
  }
  if (fiscalYear !== '' && fiscalYear) {
    params = params.set('fiscalYear', fiscalYear);
    params = params.set('isPageable', 'false');
  }
  if (mobileNumber !== '' && mobileNumber) {
    params = params.set('mobileNo', mobileNumber);
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  if (startDate !== null && startDate) {
    params = params.append('fromDate', startDate);
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  if (endDate !== null && endDate) {
    params = params.append('toDate', endDate);
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  if (isUnipayCN) {
    params = params.set('isUnipay', isUnipayCN.toString());
  }
  return { path: path, params: params };
};

export const validateManualFocUrl = (
  requestPaylod: ValidateManualFocPayload
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getEngineBaseUrl() + '/configs/foc-schemes/validate-cm-manual-foc';
  let params = new HttpParams();
  if (requestPaylod.fiscalYear !== '' && requestPaylod.fiscalYear) {
    params = params.set('fiscalYear', requestPaylod.fiscalYear);
  }
  if (requestPaylod.CMNumber !== '' && requestPaylod.CMNumber) {
    params = params.set('CMNumber', requestPaylod.CMNumber);
  }
  if (requestPaylod.locationCode !== '' && requestPaylod.locationCode) {
    params = params.set('locationCode', requestPaylod.locationCode);
  }
  if (requestPaylod.mobileNumber !== '' && requestPaylod.mobileNumber) {
    params = params.set('mobileNumber', requestPaylod.mobileNumber);
  }
  if (requestPaylod.approvedBy !== '' && requestPaylod.approvedBy) {
    params = params.set('approvedBy', requestPaylod.approvedBy);
  }
  return { path: path, params: params };
};

export const verifyManualFocUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + '/configs/foc-schemes/verify-manual-foc';
  const params = new HttpParams();
  return { path: path, params: params };
};
export const getSearchTransferedCNUrl = (
  cnNumber: string,
  fiscalYear: string
): {
  path: string;
  params: HttpParams;
} => {
  console.log('data', cnNumber, fiscalYear);
  const path = getSalesBaseUrl() + getCreditNoteurl();
  let params = new HttpParams();
  params = params.set('isPageable', 'false');
  if (cnNumber) {
    params = params.set('docNo', cnNumber);
  }
  if (fiscalYear) {
    params = params.set('fiscalYear', fiscalYear);
  }
  return { path: path, params: params };
};

export const getCreditNotesUrl = (id: string): string => {
  return getSalesBaseUrl() + getCreditNoteurl() + `/${id}`;
};
export const getDownloadGHSUrl = (
  id: string,
  ghsDocNo: number
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getCreditNoteurl() + `/${id}/ghs`;
  let params = new HttpParams();
  params = params.set('ghsDocNo', ghsDocNo.toString());
  return { path: path, params: params };
};
export const getCancelRequstUrl = (
  id: string,
  workFlowType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getCreditNoteurl() + `/${id}/cancel`;
  let params = new HttpParams();
  params = params.set('creditNoteWorkFlowType', workFlowType);
  return {
    path: path,
    params: params
  };
};

export const getSentRequestUrl = (
  type: string,
  id: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getCreditNoteurl() + `/${id}/request`;
  let params = new HttpParams();
  params = params.set('creditNoteWorkFlowType', type);
  return { path: path, params: params };
};
export const getLoadSentRequestsUrl = (
  workFlowType: string,
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + getWorkflowProcessUrl() + `/list`;
  let params = new HttpParams();
  params = params.set('workflowType', workFlowType);
  if (pageIndex) params = params.set('page', pageIndex.toString());
  if (pageSize) params = params.set('size', pageSize.toString());
  return { path: path, params: params };
};
export const getRequestUrl = (
  processId: string,
  workFlowType: string
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + getWorkflowProcessUrl() + `/${processId}`;
  let params = new HttpParams();
  params = params.set('workflowType', workFlowType);
  return { path: path, params: params };
};
// GRN URLS

export const getGrnWorkFlowProcessUrl = (
  requestParams
): {
  path: string;
  params: HttpParams;
} => {
  const path = getWorkFlowUrl() + '/workflow-process/list';
  const params = new HttpParams()
    .set('sort', 'docNo,desc')
    .set('approvalStatus', requestParams.approvalStatus)
    .set('size', requestParams.size)
    .set('page', requestParams.page)
    .set('workflowType', requestParams.workflowType);
  return {
    path,
    params
  };
};

export const getGrnHistoryDetailsUrl = (
  size,
  page,
  subTxnType,
  txnType,
  cmLocation,
  searchField,
  searchType
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + '/' + 'history' + getGoodsReturnUrl();
  let params = new HttpParams()
    .set('size', size)
    .set('page', page)
    .set('subTxnType', subTxnType)
    .set('txnType', txnType);

  if (searchField !== null && searchType !== null) {
    params = new HttpParams()
      .set('size', size)
      .set('page', page)
      .set('subTxnType', subTxnType)
      .set('txnType', txnType)
      .set('searchField', searchField)
      .set('searchType', searchType);
  }
  if (cmLocation !== null) {
    params = new HttpParams()
      .set('size', size)
      .set('page', page)
      .set('subTxnType', subTxnType)
      .set('txnType', txnType)
      .set('cmLocation', cmLocation);
  }
  params = params.append('sort', 'cancel.docNo,desc');

  return { path, params };
};

export const getGrnDetailsByIdUrl = (
  grnId,
  creditNoteType,
  txnType,
  subTxnType
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + getGoodsReturnUrl() + '/' + `${grnId}`;
  let params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType);

  if (creditNoteType) {
    params = params.set('creditNoteType', creditNoteType);
  }
  return { path, params };
};

export const getWorkFlowProcessByIdUrl = (
  processId,
  workflowType
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('workflowType', workflowType);

  return {
    path: getWorkFlowUrl() + '/workflow-process' + '/' + `${processId}`,
    params
  };
};

export const getconfirmWithoutApprovalUrl = (
  subTxnType,
  txnType
): { path: string; params: HttpParams } => {
  const params = new HttpParams()

    .set('txnType', txnType)
    .set('subTxnType', subTxnType);

  return {
    path: getSalesBaseUrl() + getGoodsReturnUrl(),
    params
  };
};

export const getsendForApprovalUrl = (
  subTxnType,
  txnType
): { path: string; params: HttpParams } => {
  const params = new HttpParams()

    .set('txnType', txnType)
    .set('subTxnType', subTxnType);
  console.log(txnType, subTxnType, 'endpoints');

  return {
    path: getSalesBaseUrl() + getGoodsReturnUrl() + '/request',
    params
  };
};

export const getGrnConfirmUrl = (
  grnId,
  txnType,
  subTxnType
): { path: string; params: HttpParams } => {
  const params = new HttpParams()

    .set('txnType', txnType)
    .set('subTxnType', subTxnType);

  return {
    path: getSalesBaseUrl() + getGoodsReturnUrl() + '/' + `${grnId}`,
    params
  };
};
export const getWorkFlowProcessAllReqUrl = (
  requestParams
): {
  path: string;
  params: HttpParams;
} => {
  console.log(requestParams);
  const params = new HttpParams()

    .set('size', requestParams.size)
    .set('page', requestParams.page)
    .set('workflowType', requestParams.workflowType);
  return {
    path:
      // 'api' + getWorkFlowUrl() + '/workflow-process/list?sort=' + 'docNo,ASC',
      getWorkFlowUrl() + '/workflow-process/list?sort=' + 'docNo,desc',
    params
  };
};

export const getSearchGrnWorkFlowProcessUrl = (
  requestParams
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('approvalStatus', requestParams.approvalStatus)
    .set('workflowType', requestParams.workflowType);
  return {
    path:
      // 'api' + getWorkFlowUrl() + '/workflow-process/list?sort=' + 'docNo,ASC',
      getWorkFlowUrl() + '/workflow-process/list?sort=' + 'docNo,ASC',
    params
  };
};

export const getSearchAllGrnWorkFlowProcessUrl = (
  requestParams
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set(
    'workflowType',
    requestParams.workflowType
  );
  return {
    path:
      // 'api' + getWorkFlowUrl() + '/workflow-process/list?sort=' + 'docNo,ASC',
      getWorkFlowUrl() + '/workflow-process/list?sort=' + 'docNo,ASC',
    params
  };
};
export const getInitiateGrnEndPointUrl = (
  docNo,
  fiscalYear,
  locationCode,
  txnType,
  subTxnType
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + getGoodsReturnUrl();
  let params = new HttpParams()
    .set('refDocNo', docNo)
    .set('refFiscalYear', fiscalYear)
    .set('txnType', txnType)
    .set('subTxnType', subTxnType);
  if (locationCode) params = params.set('locationCode', locationCode);

  return { path, params };
};
export const getLoadItemEndPointUrl = (
  refTxnId
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getSalesBaseUrl() + getGoodsReturnUrl() + `/item-details` + `/${refTxnId}`;
  const params = new HttpParams();

  return { path, params };
};
export const getGrnApproversUrl = (
  ruleType
): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + `/rule-types` + `/${ruleType}/values`;
  const params = new HttpParams();

  return { path, params };
};
export const getGrnItemPriceDetailsEndPointUrl = (
  txnType,
  subTxnType
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + getGoodsReturnUrl() + '/price';
  let params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType);

  return { path, params };
};
export const createGrnUrl = (): string => {
  return `/sales/grn/create-grn`;
};
export const getCreditNoteTransferSearchUrl = (
  srcBtqCode: string,
  docNo?: number,
  fiscalYear?: string,
  mobileNo?: string,
  page?: number,
  sort?: []
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + getCreditNoteurl();
  let params = new HttpParams();
  if (srcBtqCode) {
    params = params.set('locationCode', srcBtqCode);
  }
  if (docNo) {
    params = params.set('docNo', docNo.toString());
  }
  if (fiscalYear) {
    params = params.set('fiscalYear', fiscalYear);
  }
  if (mobileNo) {
    params = params.set('mobileNo', mobileNo);
  }
  if (page) {
    params = params.set('page', page.toString());
  }
  return { path: path, params: params };
};

export const getCreditNoteTransferSearchDetailsUrl = (
  id: string,
  srcBtqCode: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + getCreditNoteurl() + `/${id}`;
  let params = new HttpParams();
  if (srcBtqCode) {
    params = params.set('locationCode', srcBtqCode);
  }
  return { path: path, params: params };
};
export const getCnTransferRequestUrl = (
  id: string,
  workflowType: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + getCreditNoteurl() + `/${id}/request`;
  let params = new HttpParams();
  if (workflowType) {
    params = params.set('creditNoteWorkFlowType', workflowType);
  }
  return { path: path, params: params };
};

export const getLegacyCNOutwardTransferUrl = (
  id: string,
  destLocationCode: string
): {
  path: string;
  body: Object;
  params: HttpParams;
} => {
  const path =
    getIntegrationServiceBaseurl() +
    getLegacyOutboundUrl() +
    getCreditNoteurl();
  let params = new HttpParams();
  if (destLocationCode) {
    params = params.append('destLocationCode', destLocationCode);
  }
  if (id) {
    params = params.append('id', id);
  }
  return { path: path, body: {}, params: params };
};

export const getLegacyCNInwardTransferUrl = (
  id: string,
  locationCode: string
): {
  path: string;
  body: Object;
  params: HttpParams;
} => {
  const path = getCreditNoteDetailByIdUrl(id) + getLegacyIbtUrl();
  let params = new HttpParams();
  if (locationCode) {
    params = params.set('srcLocationCode', locationCode);
  }
  return { path: path, body: {}, params: params };
};

export const getLoadCreditNoteSentRequestsUrl = (
  workFlowType: string,
  pageIndex: number,
  pageSize: number,
  approvalStatus: string
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + getWorkflowProcessUrl() + `/list`;
  let params = new HttpParams();
  params = params.set('workflowType', workFlowType);
  params = params.set('page', pageIndex.toString());
  params = params.set('size', pageSize.toString());
  params = params.set('sort', `docNo,desc`);
  if (!!approvalStatus) {
    params = params.set('approvalStatus', approvalStatus);
  }

  return { path: path, params: params };
};
export const getLoadCreditNoteSentRequestDetailsByIdUrl = (
  id: string,
  workFlowType: string
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + getWorkflowProcessUrl() + `/${id}`;
  let params = new HttpParams();
  params = params.set('workflowType', workFlowType);

  return { path: path, params: params };
};
export const getLoadCreditNoteReceivedRequestsUrl = (
  workFlowType: string,
  pageIndex: number,
  pageSize: number,
  approvalStatus?: string
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + getWorkflowTaskUrl();
  let params = new HttpParams();
  params = params.set('workflowType', workFlowType);
  params = params.set('page', pageIndex.toString());
  params = params.set('size', pageSize.toString());
  params = params.set('sort', `docNo,desc`);
  if (params) {
    params = params.set('approvalStatus', approvalStatus);
  }

  return { path: path, params: params };
};
export const getLoadCreditNoteReceivedRequestsDetailsByIdUrl = (
  id: string,
  taskId: string,
  taskName: string,
  workFlowType: string
): { path: string; params: HttpParams } => {
  const path = getWorkFlowUrl() + getWorkflowTaskUrl() + `/${taskId}`;
  let params = new HttpParams();
  params = params.set('workflowType', workFlowType);
  params = params.set('processId', id);
  params = params.set('taskName', taskName);

  return { path: path, params: params };
};
export const getCnTransferApprovalUrl = (
  id: string,
  workFlowType: string,
  status?: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getCreditNoteurl() + `/${id}/request/ibt`;
  let params = new HttpParams();
  params = params.set('creditNoteWorkFlowType', workFlowType);
  if (status) {
    params = params.set('status', status);
  }
  return { path: path, params: params };
};

export const getTransfetToEghsUrl = (id: string): string => {
  const path = getSalesBaseUrl() + `/credit-note/${id}/ghs`;
  return path;
};
export const getTransferedCNsurl = (): { path: string; params: HttpParams } => {
  const path = getIntegrationServiceBaseurl() + `/ghs/credit-notes`;
  let params = new HttpParams();
  params = params.set('vendorCode', 'GHS');
  return { path: path, params: params };
};

export const getInititateTepEndpointUrl = (
  txnType: string,
  subTxnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/goods-exchange`;
  let params = new HttpParams();
  params = params.set('subTxnType', subTxnType);
  params = params.set('txnType', txnType);
  return { path: path, params: params };
};

export const getTepItemConfigUrl = (
  itemCode: string,
  tepType: string,
  isDummy: boolean,
  customerMobileNo: string
): { path: string; params: HttpParams } => {
  const path = getEngineBaseUrl() + `/configs/tep-item`;
  let params = new HttpParams();
  if (customerMobileNo) {
    params = params.set('customerMobileNo', customerMobileNo);
  }
  if (isDummy) {
    params = params.set('isDummy', isDummy.toString());
  }
  params = params.set('itemCode', itemCode);
  params = params.set('tepType', tepType);
  return { path: path, params: params };
};

export const getTepCashMemoDetailsUrl = (
  locationCode,
  refDocNo: string,
  refFiscalYear: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/goods-exchange/cash-memo`;
  let params = new HttpParams();
  params = params.set('refDocNo', refDocNo);
  params = params.set('locationCode', locationCode);
  params = params.set('refFiscalYear', refFiscalYear);
  params = params.set('subTxnType', subTxnType);
  params = params.set('txnType', txnType);
  return { path: path, params: params };
};

export const updateOpenTepTransactionEndPointUrl = (
  id: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/goods-exchange/${id}`;
  let params = new HttpParams();
  params = params.set('subTxnType', subTxnType);
  params = params.set('txnType', txnType);
  return { path: path, params: params };
};

export const getTepItemPriceDetailsEndPointUrl = (): string => {
  return getEngineBaseUrl() + `/price/tep`;
};

export const getReasonsEndPointUrl = (lovType: string): string => {
  return getEngineBaseUrl() + `/payments/lovs/${lovType}`;
};

export const addTepItemToGridEndPointUrl = (
  id: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/goods-exchange/${id}/tep/items`;
  let params = new HttpParams();
  params = params.set('subTxnType', subTxnType);
  params = params.set('txnType', txnType);
  return { path: path, params: params };
};

export const updateTepItemInGridEndPointUrl = (
  id: string,
  itemId: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/goods-exchange/${id}/tep/items/${itemId}`;
  let params = new HttpParams();
  params = params.set('subTxnType', subTxnType);
  params = params.set('txnType', txnType);
  return { path: path, params: params };
};

export const confirmOrHoldTepEndPointUrl = (
  id: string,
  status: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/goods-exchange/${id}`;
  let params = new HttpParams();
  params = params.set('status', status);
  params = params.set('subTxnType', subTxnType);
  params = params.set('txnType', txnType);
  return { path: path, params: params };
};

export const confirmRequestTepEndPointUrl = (
  id: string,
  status: string,
  subTxnType: string,
  txnType: string,
  workflowType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/goods-exchange/request/${id}`;
  let params = new HttpParams();

  params = params.set('subTxnType', subTxnType);
  params = params.set('txnType', txnType);
  params = params.set('workflowType', workflowType);
  return { path: path, params: params };
};

export const deleteTepItemEndPointUrl = (
  id: string,
  itemId: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  const url = getSalesBaseUrl() + `/goods-exchange/${id}/items/${itemId}`;
  let params = new HttpParams();
  params = params.set('subTxnType', subTxnType);
  params = params.set('txnType', txnType);
  return { path: url, params: params };
};

export const deletCutPieceTepItemEndPointUrl = (
  id: string,
  itemId: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  const url =
    getSalesBaseUrl() + getInventoryBaseUrl() + `/${id}/items/${itemId}`;

  let params = new HttpParams();

  params = params.set('transactionType', subTxnType);
  return { path: url, params: params };
};

export const getTepItemEndPointUrl = (
  id: string,
  itemId: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  // const url = getSalesBaseUrl() + `/goods-exchange/${id}/items/${itemId}`;
  // let params = new HttpParams();
  // params = params.set('subTxnType', subTxnType);
  // params = params.set('txnType', txnType);
  // return { path: url, params: params };
  if (subTxnType === CreateTepTypesEnum.CUT_PIECE_TEP) {
    const url =
      getSalesBaseUrl() +
      getInventoryBaseUrl() +
      `/stock-managements/${id}/items/${itemId}`;
    let params = new HttpParams();
    params = params.set('transactionType', subTxnType);

    return { path: url, params: params };
  } else {
    const url = getSalesBaseUrl() + `/goods-exchange/${id}/items/${itemId}`;
    let params = new HttpParams();
    params = params.set('subTxnType', subTxnType);
    params = params.set('txnType', txnType);
    return { path: url, params: params };
  }
};

export const updateTepTransactionPriceDetailsEndPointUrl = (
  id: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/goods-exchange/${id}/price`;
  let params = new HttpParams();
  params = params.set('subTxnType', subTxnType);
  params = params.set('txnType', txnType);
  return { path: path, params: params };
};

export const getTepItemCodeEndPointUrl = (): string => {
  return getEngineBaseUrl() + `/products/items`;
};

export const getTepTransactionUrl = (
  id: string,
  subTxnType: string,
  txnType: string,
  recalculate?: boolean,
  isTepException?: boolean
): { path: string; params: HttpParams } => {
  if (subTxnType === CreateTepTypesEnum.CUT_PIECE_TEP) {
    const path = getSalesBaseUrl() + getInventoryBaseUrl() + `/${id}`;
    let params = new HttpParams();
    params = params.set('transactionType', subTxnType);
    return { path: path, params: params };
  } else {
    const path = getSalesBaseUrl() + `/goods-exchange/${id}`;
    let params = new HttpParams();
    params = params.set('subTxnType', subTxnType);
    params = params.set('txnType', txnType);
    if (isTepException || isTepException === false) {
      params = params.set('isTepException', isTepException.toString());
    } else {
    }
    if (recalculate || recalculate === false) {
      params = params.set('recalculationRequired', recalculate.toString());
    } else {
    }

    return { path: path, params: params };
  }
};

export const getRefundCashLimitUrl = (
  customerId?: number,
  refundAmt?: number,
  txnType?: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/goods-exchange/checkRefundCashLimit`;
  let params = new HttpParams();
  params = params.set('customerId', customerId.toString());
  params = params.set('refundAmt', refundAmt.toString());
  params = params.set('txnType', txnType);

  return { path: path, params: params };
};

export const getCutPieceTepTransactionUrl = (
  id: string,
  subTxnType: string,
  txnType: string
): { path: string; params: HttpParams } => {
  const path =
    getSalesBaseUrl() + getInventoryBaseUrl() + `/stock-managements/${id}`;
  let params = new HttpParams();
  params = params.set('transactionType', subTxnType);
  return { path: path, params: params };
};

export const getFrozenCNsUrl = (
  customerId: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/advances/list`;
  let params = new HttpParams();
  params = params.set('customerId', customerId);
  params = params.set('subTxnType', 'FROZEN_RATES');
  params = params.set('txnType', 'ADV');
  return { path: path, params: params };
};

export const getSearchGRFUrl = (
  docNo: string,
  fiscalYear: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/credit-note/grf`;
  let params = new HttpParams();
  params = params.set('docNo', docNo);
  params = params.set('fiscalYear', fiscalYear);
  return { path: path, params: params };
};

export const getMegreCNsUrl = (): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/advances/merge`;
  let params = new HttpParams();
  params = params.set('subTxnType', 'FROZEN_RATES');
  params = params.set('txnType', 'ADV');
  return { path: path, params: params };
};
export const getGenerateOTPUrl = (
  id: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/otp`;
  let params = new HttpParams();
  params = params.set('id', id);
  params = params.set('otpType', 'CN');
  return { path: path, params: params };
};

export const getValidateOTPUrl = (
  id: string,
  token: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/otp`;
  let params = new HttpParams();
  params = params.set('id', id);
  params = params.set('otpType', 'CN');
  params = params.set('token', token);
  return { path: path, params: params };
};

export const generateOTPForCustomerSignatureUrl = (
  id: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/otp`;
  let params = new HttpParams();
  params = params.set('id', id);
  params = params.set('otpType', 'CUST_SIGNATURE_OTP');
  return { path: path, params: params };
};

export const validateOTPForCustomerSignatureUrl = (
  id: string,
  token: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/otp`;
  let params = new HttpParams();
  params = params.set('id', id);
  params = params.set('otpType', 'CUST_SIGNATURE_OTP');
  params = params.set('token', token);
  return { path: path, params: params };
};

export const getEmployeeSignatureDetailsUrl = (
  employeeCode: string
): { path: string; params: HttpParams } => {
  const path = getEngineBaseUrl() + `/users/employee-signature-details`;
  let params = new HttpParams();
  params = params.set('employeeCode', employeeCode);
  return { path: path, params: params };
};

export const uploadEmployeeSignatureUrl = (
  employeeCode: string
): { path: string; params: HttpParams } => {
  const path =
    getEngineBaseUrl() + `/users/digital-signature/upload/${employeeCode}`;
  let params = new HttpParams();
  return { path: path, params: params };
};

export const uploadFormUrl = (
  customerId,
  fileType: string,
  docType: string,
  id?: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/files/upload`;
  let params = new HttpParams()
    .set('fileType', fileType)
    .set('docType', docType);
  if (id) params = params.set('id', id);
  if (customerId) params = params.set('customerId', customerId);
  return { path, params };
};
export const getDocumentsUrl = (
  customerId,
  docType,
  fileType,
  id,
  locationCode?
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + '/files/list';
  let params = new HttpParams()
    .set('documentType', docType)
    .set('fileType', fileType);
  if (id) params = params.set('id', id);
  if (customerId) params = params.set('customerId', customerId);
  if (locationCode) params = params.set('locationCode', locationCode);
  return { path, params };
};
export const deleteDocumentUrl = (
  fileId
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + '/files' + `/${fileId}`;
  const params = new HttpParams();
  return { path, params };
};
export const getDocumentsUrlByIdUrl = (
  id,
  locationCode?: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/files/${id}/presigned-url`;
  let params = new HttpParams();
  if (locationCode) params = params.set('locationCode', locationCode);
  return { path, params };
};
export const getLocationStoresUrl = (
  isPageable: boolean,
  isLocationFromTep?: boolean
): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + '/locations/stores';
  let params = new HttpParams().set('isPageable', isPageable.toString());
  if (isLocationFromTep) {
    params = params.set('isLocationFromTep', `${isLocationFromTep}`);
  }

  return {
    path,
    params
  };
};
//Cash Memo History
export const getCashMemoHistoryDetailsUrl = (
  size,
  page,
  subTxnType,
  txnType,
  sortOrder,
  searchField,
  searchType
): {
  path: string;
  params: HttpParams;
} => {
  const sort = 'salesTxnDao.docNo' + ',' + sortOrder;
  const path = getSalesBaseUrl() + '/' + 'history' + '/' + 'cash-memo';
  let params = new HttpParams()
    .set('size', size)
    .set('page', page)
    .set('subTxnType', subTxnType)
    .set('txnType', txnType)
    .set('sort', sort);

  if (searchField && searchType) {
    params = new HttpParams()
      .set('size', size)
      .set('page', page)
      .set('subTxnType', subTxnType)
      .set('txnType', txnType)
      .set('sort', sort)
      .set('searchField', searchField)
      .set('searchType', searchType);
  }

  return { path, params };
};
export const getGHSAccountDetailsEndpointURl = (
  accountNo: string,
  vendorCode: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('accountNo', accountNo)
    .set('vendorCode', vendorCode);

  return {
    path: getSalesBaseUrl() + `/balances/account`,
    params
  };
};
export const getGHSAttachmentsEndpointURl = (
  accountNo: string,
  customerId: string,
  vendorCode: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('accountNo', accountNo)
    .set('customerId', customerId)
    .set('vendorCode', vendorCode);

  return {
    path: getIntegrationServiceBaseurl() + `/ghs/docs`,
    params
  };
};

export const getCreditNoteDetailByIdUrl = (id: string): string => {
  return getSalesBaseUrl() + `/credit-note/${id}`;
};

export const getTransactionLevelDiscountsEndPointUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + '/discounts/transaction-level';
  const params = new HttpParams();

  return {
    path,
    params
  };
};

export const getApplyTransactionLevelEndPointUrl = (
  discountType: string,
  txnType: string,
  subTxnType: string,
  transactionId: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + '/discounts/transaction-level';
  const params = new HttpParams()
    .set('discountType', discountType)
    .set('txnType', txnType)
    .set('subTxnType', subTxnType)
    .set('transactionId', transactionId);

  return {
    path,
    params
  };
};
export const getAppliedTransactionLevelDiscountsEndPointUrl = (
  discountType: string,
  txnType: string,
  subTxnType: string,
  transactionId: string,
  applicableLevel: string,
  status: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + '/discounts/transaction-level';
  let params = new HttpParams()

    .set('txnType', txnType)
    .set('subTxnType', subTxnType)
    .set('transactionId', transactionId);
  if (!!discountType) {
    params = params.set('discountType', discountType);
  }
  if (!!applicableLevel) {
    params = params.set('applicableLevel', applicableLevel);
  }
  if (!!status) {
    params = params.set('status', status);
  }

  return {
    path,
    params
  };
};

export const getRemoveAllTransactionLevelDiscountsEndPointUrl = (
  discountType: string,
  txnType: string,
  subTxnType: string,
  transactionId: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + '/discounts/transaction-level';
  const params = new HttpParams()
    .set('discountType', discountType)
    .set('txnType', txnType)
    .set('subTxnType', subTxnType)
    .set('transactionId', transactionId);

  return {
    path,
    params
  };
};
export const getRemoveSelectedTransactionLevelDiscountEndPointUrl = (
  discountId: string,
  discountType: string,
  txnType: string,
  subTxnType: string,
  transactionId: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + `/discounts/transaction-level/${discountId}`;
  const params = new HttpParams()
    .set('discountType', discountType)
    .set('txnType', txnType)
    .set('subTxnType', subTxnType)
    .set('transactionId', transactionId);

  return {
    path,
    params
  };
};
export const getUpdateTransactionLevelDiscountEndPointUrl = (
  discountType: string,
  txnType: string,
  subTxnType: string,
  transactionId: string,
  isPriceUpdate?: boolean
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + `/discounts/transaction-level`;
  let params = new HttpParams()
    .set('discountType ', discountType)
    .set('txnType ', txnType)
    .set('subTxnType ', subTxnType)
    .set('transactionId ', transactionId);
  if (isPriceUpdate || isPriceUpdate === false) {
    params = params.append('isPriceUpdate', isPriceUpdate.toString());
  }

  return {
    path,
    params
  };
};
export const getConfirmTransactionLevelDiscountEndPointUrl = (
  discountType: string,
  txnType: string,
  subTxnType: string,
  transactionId: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + `/discounts/transaction-level`;
  const params = new HttpParams()
    .set('discountType', discountType)
    .set('txnType', txnType)
    .set('subTxnType', subTxnType)
    .set('transactionId', transactionId);
  return {
    path,
    params
  };
};
export const getConfirmTransactionLevelDiscountByIdEndPointUrl = (
  discountType: string,
  txnType: string,
  subTxnType: string,
  transactionId: string,
  discountTxnId: string = null
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + `/discounts/transaction-level`;
  const params = new HttpParams()
    .set('discountType', discountType)
    .set('txnType', txnType)
    .set('subTxnType', subTxnType)
    .set('transactionId', transactionId)
    .set('discountTxnId', discountTxnId);
  return {
    path,
    params
  };
};

export const getLoadItemLevelDiscountsEndPointUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + `/discounts/item-level`;
  const params = new HttpParams();

  return {
    path,
    params
  };
};

export const getLoadItemLevelDiscountsDetailsEndPointUrl = (
  discountId: string,
  discountClubId: string
): {
  path: string;
  params: HttpParams;
} => {
  let path = '';
  if (discountClubId)
    path =
      getEngineBaseUrl() + `/discounts` + `?discountClubId=${discountClubId}`;
  else path = getEngineBaseUrl() + `/discounts` + `?discountId=${discountId}`;
  const params = new HttpParams();

  return {
    path,
    params
  };
};

export const getItemLevelDiscountsEndPointUrl = (
  txnType: string,
  subTxnType: string,
  transactionId: string,
  itemId: string,
  discountTxnId?: string
): {
  path: string;
  params: HttpParams;
} => {
  let path = '';
  if (discountTxnId) {
    path = getSalesBaseUrl() + `/discounts/item-level/${discountTxnId}`;
  } else {
    path = getSalesBaseUrl() + `/discounts/item-level`;
  }

  const params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType)
    .set('transactionId', transactionId)
    .set('itemId', itemId);

  return {
    path,
    params
  };
};

export const getSlabExcludeDiscountsEndPointUrl = (
  txnType: string,
  subTxnType: string,
  transactionId: string,
  itemId: string
): {
  path: string;
  params: HttpParams;
} => {
  let path = '';

  path = getSalesBaseUrl() + `/discounts/item-level/slab`;

  const params = new HttpParams()
    .set('txnType', txnType)
    .set('subTxnType', subTxnType)
    .set('transactionId', transactionId)
    .set('itemId', itemId);

  return {
    path,
    params
  };
};

export const getEligibleItemsForParticularDiscountUrl = (
  discountType: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + `/discounts/eligible-items`;
  const params = new HttpParams().set('discountType', discountType);
  return {
    path,
    params
  };
};

export const getEligibleItemsForGepPurityConfigId = (): string => {
  const path = getEngineBaseUrl() + `/discounts/eligible-items/gep-purity`;
  return path;
};

export const getDiscountVocherDetailsUrld = (
  payload: DiscountVoucherDetailsRequestPayload
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + `/balances/discount-voucher`;
  const params = new HttpParams()
    .set('accountNo', payload.accountNo.toString())
    .set('vendorCode', payload.vendorCode)
    .set('voucherNo', payload.voucherCode.toString());
  return {
    path,
    params
  };
};

export const getCheckABCOEligibility = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + `/discounts/orders/eligibility`;
  const params = new HttpParams();
  return {
    path,
    params
  };
};

export const getAutoDiscounts = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + `/discounts/auto`;
  const params = new HttpParams();
  return {
    path,
    params
  };
};

export const getLoadABCODiscounts = (
  payload
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getSalesBaseUrl() + `/discounts/item-level/orders?configsRequired=false`;

  let params = new HttpParams()
    .set('txnType', payload.txnType)
    .set('subTxnType', payload.subTxnType)
    .set('transactionId', payload.transactionId)
    .set('itemProductGroupCode', payload.itemProductGroupCode);

  if (payload.itemId) params = params.append('orderItemId', payload.itemId);

  return {
    path,
    params
  };
};

export const getLoadABCOConfigDetails = (
  payload
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getSalesBaseUrl() + `/discounts/item-level/orders?configsRequired=true`;

  let params = new HttpParams()
    .set('txnType', payload.txnType)
    .set('subTxnType', payload.subTxnType)
    .set('transactionId', payload.transactionId)
    .set('itemProductGroupCode', payload.itemProductGroupCode);

  if (payload.itemId) params = params.append('orderItemId', payload.itemId);

  if (payload.clubbedDiscountId)
    params = params.append('clubbedDiscountId', payload.clubbedDiscountId);
  else params = params.append('discountTxnId', payload.discountTxnId);
  return {
    path,
    params
  };
};

export const getLoadABCODiscountDetails = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + `/discounts/orders`;
  const params = new HttpParams();
  return {
    path,
    params
  };
};

export const createCutPieceTepStockManagementUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + `/inventory/stock-managements`;
  const params = new HttpParams().set('transactionType', 'CUT_PIECE_TEP');
  return {
    path,
    params
  };
};

export const patchCutPieceTepStockManagementUrl = (
  id: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + `/inventory/stock-managements/${id}`;
  const params = new HttpParams().set('transactionType', 'CUT_PIECE_TEP');
  return {
    path,
    params
  };
};

export const addCutPieceTepItemInStockManagementUrl = (
  id: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + `/inventory/stock-managements/${id}/items`;
  const params = new HttpParams().set('transactionType', 'CUT_PIECE_TEP');
  return {
    path,
    params
  };
};

export const getStoreDetailsForDigitalSignatureUrl = (): string => {
  return getEngineBaseUrl() + `/locations/details`;
};

export const getCahbacOfferkBankDetailUrl = (): string => {
  return getEngineBaseUrl() + `/payments/cash-back-offers`;
};

export const getCashBackConfigDetailsUrl = (offerId): string => {
  return getEngineBaseUrl() + `/payments/cash-back-offers/${offerId}/details`;
};

export const validateCashbackCardUrl = (offerId): string => {
  return getEngineBaseUrl() + `/payments/cash-back-offers/${offerId}/discounts`;
};

export const getNewCustomerDetailsUrl = (
  mobileNumber?: string,
  ulpNumber?: string
) => {
  const path = getSalesBaseUrl() + `/digital-signature/newCustomerDetails`;
  let params = new HttpParams();
  if (mobileNumber && !ulpNumber) {
    params = new HttpParams().set('mobileNumber', mobileNumber);
  } else if (!mobileNumber && ulpNumber) {
    params = new HttpParams().set('ulpNumber', ulpNumber);
  } else if (mobileNumber && ulpNumber) {
    params = new HttpParams()
      .set('mobileNumber', mobileNumber)
      .set('ulpNumber', ulpNumber);
  }
  return {
    path,
    params
  };
};

export const getDigitalSignatureUrl = () => {
  const path = getSalesBaseUrl() + `/digital-signature`;
  const params = new HttpParams();
  return {
    path,
    params
  };
};

export const getCustomerDetailsForDigitalSignatureUrl = (
  customerType: string,
  mobileNumber?: string,
  ulpNumber?: string
) => {
  const path = getSalesBaseUrl() + `/digital-signature`;
  let params = new HttpParams().set('customerType', customerType);

  if (mobileNumber) {
    params = params.append('mobileNumber', mobileNumber);
  }
  if (ulpNumber) {
    params = params.append('ulpNumber', ulpNumber);
  }
  return {
    path,
    params
  };
};

export const uploadDigitalSignatureUrl = (
  mobileNumber: string,
  customerType: string
) => {
  const path = getSalesBaseUrl() + `/digital-signature/upload/${mobileNumber}`;
  const params = new HttpParams().set('customerType', customerType);
  return {
    path,
    params
  };
};

export const patchCutPieceTepItemInStockManagementUrl = (
  id: string,
  itemId: string
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getSalesBaseUrl() + `/inventory/stock-managements/${id}/items/${itemId}`;
  const params = new HttpParams().set('transactionType', 'CUT_PIECE_TEP');
  return {
    path,
    params
  };
};

export const confirmCutPieceTepItemInStockManagementUrl = (
  id: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + `/inventory/stock-managements/${id}`;
  const params = new HttpParams().set('transactionType', 'CUT_PIECE_TEP');
  return {
    path,
    params
  };
};

export const getBillCancellationHistoryDetailsUrl = (
  subTxnType,
  txnType,
  searchField,
  searchType,
  page,
  size
): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + '/' + 'history' + '/' + 'cancel';
  let params = new HttpParams()
    .set('size', size)
    .set('page', page)
    .set('subTxnType', subTxnType)
    .set('txnType', txnType);

  if (searchField !== null && searchType !== null) {
    params = new HttpParams()
      .set('size', size)
      .set('page', page)
      .set('subTxnType', subTxnType)
      .set('txnType', txnType)
      .set('searchField', searchField)
      .set('searchType', searchType);
  }

  return { path, params };
};

export const getDownloadDocUrl = (
  fileId: string,
  locationCode?: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/files/${fileId}/download`;
  let params = new HttpParams();
  // .set('id', fileId);
  if (locationCode) params = params.set('locationCode', locationCode);
  return { path, params };
};

export const getDownloadDocFromEpossUrl = (
  fileId: string,
  locationCode?: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/files/${fileId}/downloadFileEposs`;
  let params = new HttpParams();
  // .set('id', fileId);
  if (locationCode) params = params.set('locationCode', locationCode);
  return { path, params };
};

export const getTcsDetailUrl = (
  requestParm: TcsRequestParam
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/cash-memos/view-tcs`;
  const params = new HttpParams()
    .set('id', requestParm.id)
    .set('txnType', requestParm.txnType)
    .set('subTxnType', requestParm.subTxnType);
  return {
    path,
    params
  };
};

export const validateCMMetalRateUrl = (
  requestParm: any
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/cash-memos/validate-metal-Rate`;
  const params = new HttpParams()
    .set('id', requestParm.id)
    .set('status', requestParm.status)
    .set('txnType', requestParm.txnType)
    .set('subTxnType', requestParm.subTxnType);
  return {
    path,
    params
  };
};

export const validateABMetalRateUrl = (
  requestParm: any
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/orders/validate-metal-Rate`;
  const params = new HttpParams()
    .set('id', requestParm.id)
    .set('status', requestParm.status)
    .set('txnType', requestParm.txnType)
    .set('subTxnType', requestParm.subTxnType);
  return {
    path,
    params
  };
};

export const getEmpLoanDetailsUrl = (
  empId: string,
  custId: string
): { path: string; params: HttpParams } => {
  const path =
    getSalesBaseUrl() +
    getCashMemosBaseUrl() +
    `/eposs/employee-loan/config-details`;
  const params = new HttpParams()
    .set('employeeCode', empId)
    .set('customerId', custId);
  return {
    path,
    params
  };
};

export const documentsSearchEndPointUrl = (
  txnType?: string,
  page?: number,
  size?: number
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/history/invoice-list`;
  const params = new HttpParams()
    .set('page', page?.toString())
    .set('size', size?.toString())
    .set('txnType', txnType)
    .set('sort', `fiscalYear,desc`)
    .set('sort', `docNo,desc`);
  return {
    path,
    params
  };
};

export const getCalculateCnRefundAmountRequestUrl = (id: string): string => {
  const path = getSalesBaseUrl() + getCreditNoteurl() + `/${id}/price`;
  return path;
};

export const getCancelAutoApprovedCnRequestUrl = (id: string): string => {
  const path = getSalesBaseUrl() + getCreditNoteurl() + `/${id}/cancellation`;
  return path;
};

export const getCancelRequestApprovedCnRequestUrl = (
  id: string,
  workFlowType: string
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getCreditNoteurl() + `/${id}/request`;
  const params = new HttpParams().set(
    'creditNoteWorkFlowType',
    workFlowType.toString()
  );
  return {
    path,
    params
  };
};
//GC History
export const getGcHistoryListItemsEndpointURl = (
  size: number,
  page: number,
  subTxnType: string,
  txnType: string,
  sortOrder: string,
  searchField: string,
  searchType: string
): { path: string; params: HttpParams } => {
  const sort = 'salesTxnDao.docNo' + ',' + sortOrder;

  const path = getSalesBaseUrl() + '/' + 'history' + '/' + 'cash-memo';

  let params = new HttpParams()
    .set('size', size.toString())
    .set('page', page.toString())
    .set('subTxnType', subTxnType)
    .set('txnType', txnType)
    .set('sort', sort);

  if (searchField && searchType) {
    params = new HttpParams()
      .set('size', size.toString())
      .set('page', page.toString())
      .set('subTxnType', subTxnType)
      .set('txnType', txnType)
      .set('sort', sort)
      .set('searchField', searchField)
      .set('searchType', searchType);
  }

  return { path, params };
};

export const getCustomerOrderEndPointUrl = (
  txnType?: string,
  subTxnType?: string,
  id?: string,
  status?: string,
  locationCode?: string,
  requestType?: string
): { path: string; params: HttpParams } => {
  if (locationCode && requestType) {
    const path = getSalesBaseUrl() + getCustomerOrdersBaseUrl();
    const params = new HttpParams()
      .set('locationCode', locationCode)
      .set('requestTypes', requestType);
    return { path, params };
  } else {
    if (id || status) {
      if (status) {
        const path = getSalesBaseUrl() + getCustomerOrdersBaseUrl() + `/${id}`;
        const params = new HttpParams()
          .set('status', status)
          .set('subTxnType', subTxnType)
          .set('txnType', txnType);
        return { path, params };
      } else {
        const path = getSalesBaseUrl() + getCustomerOrdersBaseUrl() + `/${id}`;
        const params = new HttpParams()
          .set('subTxnType', subTxnType)
          .set('txnType', txnType);
        return { path, params };
      }
    } else {
      const path = getSalesBaseUrl() + getCustomerOrdersBaseUrl();
      const params = new HttpParams()
        .set('subTxnType', subTxnType)
        .set('txnType', txnType);
      return { path, params };
    }
  }
};

export const getCustomerOrderItemEndPointUrl = (
  id: string,
  txnType: string,
  subTxnType: string,
  itemId?: string
): { path: string; params: HttpParams } => {
  if (itemId) {
    const path =
      getSalesBaseUrl() + getCustomerOrdersBaseUrl() + `/${id}/items/${itemId}`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  } else {
    const path =
      getSalesBaseUrl() + getCustomerOrdersBaseUrl() + `/${id}/items`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  }
};

export const getCustomerOrderPriceUpdateEndPointUrl = (
  id: string,
  txnType: string,
  subTxnType: string,
  action?: string
): { path: string; params: HttpParams } => {
  if (action) {
    const path =
      getSalesBaseUrl() + getCustomerOrdersBaseUrl() + `/${id}/price`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType)
      .set('actionType', action);
    return { path, params };
  } else {
    const path =
      getSalesBaseUrl() + getCustomerOrdersBaseUrl() + `/${id}/price`;
    const params = new HttpParams()
      .set('subTxnType', subTxnType)
      .set('txnType', txnType);
    return { path, params };
  }
};

export const getPrintDepositUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getSalesBaseUrl() + '/prints' + '/deposit';
  const params = new HttpParams();

  return {
    path,
    params
  };
};
export const updatePaymentStatusForVoidUnipayUrl = (
  txnType: TransactionTypeEnum,
  subTxnType: SubTransactionTypeEnum,
  txnId: string,
  paymentIds: string[]
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + getPaymentsUrl() + `/${txnId}/void-payments`;
  let params = new HttpParams()
    .set('subTxnType', subTxnType)
    .set('txnType', txnType);
  if (paymentIds.length) {
    params = params.set('paymentIds', paymentIds.toString());
  }
  return { path, params };
};

export const updateCNStatusForVoidUnipayUrl = (
  creditNoteId: string
): { path: string; params: HttpParams } => {
  const path =
    getSalesBaseUrl() + getCreditNoteurl() + `/${creditNoteId}/cn-void`;
  const params = new HttpParams();
  return { path, params };
};
