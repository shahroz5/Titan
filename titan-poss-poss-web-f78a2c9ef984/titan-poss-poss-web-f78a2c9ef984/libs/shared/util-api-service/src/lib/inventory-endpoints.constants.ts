import { HttpParams } from '@angular/common/http';
import {
  OtherReceiptsIssuesEnum,
  CountPayload,
  StoreTypes,
  ProductGroup,
  ConversionApprovalRequestsListingPayload,
  BinToBinFileUploadItemsBulkTransferRequest,
  BinToBinTransferLoadFileUploadItemsRequest,
  UpdateHallmarkDetails
} from '@poss-web/shared/models';

/**
 * Base Url for Inventory Stock API
 */
const getInventoryBaseUrl = (): string => {
  return `/inventory/v2`;
};
const getSalesInventoryBaseUrl = (): string => {
  return `/sales/v2/inventory`;
};
const getInventoryAdjUrl = (): string => {
  return `/inventory/v2/stock-managements`;
};

const getLocationBaseUrl = (): string => {
  return `/location/v2`;
};

const getEngineBaseUrl = (): string => {
  return `/engine/v2`;
};

const getUsersBaseUrl = (): string => {
  return `/user/v2`;
};
const getProductBaseUrl = (): string => {
  return `/product/v2`;
};

const getFileUploadUrl = (): string => {
  return `/file/v2/file-upload`;
};

export const getStockReceiveUrl = (): string => {
  return `/stock-receives`;
};

const getStockRequestUrl = (): string => {
  return `/stock-requests`;
};

export const getReturnInvoiceCfaUrl = (): string => {
  return `/return-invoices`;
};
export const getDirectIssueUrl = (): string => {
  return `/stock-issues/transfer`;
};

export const getPurchaseInvoiceUrl = (): string => {
  return `/purchase-invoices`;
};

const getStockManagementUrl = (): string => {
  return `/stock-managements`;
};
const getOtherIssuesUrl = (): string => {
  return `/other-issues/request`;
};
const getOtherRequestUrl = (): string => {
  return `/other-requests`;
};
const getOtherReceiveUrl = (): string => {
  return `/other-receives`;
};

const getStockTransferUrl = (): string => {
  return `/transfer`;
};

export const getStockIssueUrl = (): string => {
  return `/stock-issues`;
};

const getHistoryUrl = (): string => {
  return `/history`;
};

const getInvoiceUrl = (): string => {
  return `/invoice`;
};

const getLiteDataUrl = (): string => {
  return `/lite-data`;
};

const getWeightToleranceUrl = (): string => {
  return `/rule-types/validate/weight-tolerance/`;
};

const getStockIssuesCancelUrl = (): string => {
  return `/stock-issues/transfer/cancelstn`;
};

/**
 * Retrieve the Url of the API Endpoint for listing the Products in the Stock Transfer Note
 * in paginated format.
 * @param page  The page index (i.e. zero based index) to retreive the list of products.
 * @param limit The number products that need to be provided in each page.
 */
export const getStockReceiveByPaginationEndpointUrl = (
  type,
  page,
  size
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockReceiveUrl();
  const params = new HttpParams()
    .set('transferType', type)
    .set('page', page)
    .set('size', size)
    .append('sort', 'orderType,ASC')
    .append('sort', 'srcLocationCode,ASC')
    .append('sort', 'srcDocNo,ASC')
    .append('sort', 'srcDocDate,ASC');
  return { path, params };
};

/**
 * Retrieve the Url of the API Endpoint for listing the Products in the Purchace Invoice (L3)
 * in paginated format.
 * @param page  The page index (i.e. zero based index) to retreive the list of products.
 * @param limit The number products that need to be provided in each page.
 */
export const getPurchaseInvoiceByPaginationEndpointUrl = (
  type,
  page,
  size
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getPurchaseInvoiceUrl();

  const params = new HttpParams()
    .set('invoiceType', type)
    .set('page', page)
    .set('size', size)
    .append('sort', 'orderType,ASC')
    .append('sort', 'srcLocationCode,ASC')
    .append('sort', 'srcDocDate,ASC');
  return { path, params };
};

/**
 * Retrieve the list of product under particular Stock Transfer Note.
 * @param srcDocNo  This Stock Transfer Note Number.
 */
export const getStockReceiveBySrcDocNoEndpointUrl = (
  srcDocNo,
  type
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockReceiveUrl();
  const params = new HttpParams()
    .set('transferType', type)
    .set('srcDocNo', srcDocNo);
  return { path, params };
};

export const getFetchSTNFromOracleUrl = (
  srcDocNo,
  type
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockReceiveUrl() + '/stn';
  const params = new HttpParams()
    .set('transferType', type)
    .set('stnNo', srcDocNo);
  return { path, params };
};

// TODO : change the url
export const getFetchInvoiceFromOracleUrl = (
  srcDocNo,
  type
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getPurchaseInvoiceUrl() + '/inv';
  const params = new HttpParams()
    .set('invoiceType', type)
    .set('invNo', srcDocNo);
  return { path, params };
};

export const getStockByIdEndpointUrl = (
  id: string,
  type: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockReceiveUrl() + `/${id}`;
  const params = new HttpParams().set('transferType', type);
  return { path, params };
};

export const getStockReceiveHistoryById = (
  id: string,
  historyAPIType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/transfer/${id}`;
  const params = new HttpParams()
    .set('actionType', 'RECEIVE')
    .set('transferType', historyAPIType);
  return { path, params };
};
export const getStockReceiveCFAHistoryById = (
  id: string,
  historyAPIType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/invoice/${id}`;
  const params = new HttpParams()
    .set('actionType', 'RECEIVE')
    .set('invoiceType', historyAPIType);

  return { path, params };
};

/**
 * Retrieve the list of product under particular  Purchace Invoice  (L3)
 * @param srcDocNo  This Stock Transfer Note Number.
 */
export const getPurchaseInvoiceBySrcDocNoEndpointUrl = (
  srcDocNo,
  type
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getPurchaseInvoiceUrl();
  const params = new HttpParams()
    .set('invoiceType', type)
    .set('srcDocNo', srcDocNo);
  return { path, params };
};

export const getInvociePurchaseByIdEndpointUrl = (
  id: string,
  type: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getPurchaseInvoiceUrl() + `/${id}`;
  const params = new HttpParams().set('invoiceType', type);
  return { path, params };
};

/**
 * Retrieves the URL of the API Endpoint for retreiving the total count of pending Stock Transfer Note
 * for factory, boutique and other receipts.
 */
export const getStockTransferNoteCountEndpointUrl = (): string => {
  return getInventoryBaseUrl() + getStockReceiveUrl() + '/counts';
};

export const getReceiveInvoiceEndpointUrl = (): string => {
  return getInventoryBaseUrl() + getPurchaseInvoiceUrl() + '/counts';
};

/**
 * Base Url for IBT Request Api
 */

export const getRequestListEndpointUrl = (): string => {
  return getInventoryBaseUrl() + getStockRequestUrl();
};
/**
 * To retrive request sent and received list based on the params
 * @param type : type of request
 * @param searchValue : search value
 * @param pageIndex : page number
 * @param pageSize : number of requests in that page
 */
export const getRequestListByPaginationEndpointUrl = (
  requestGroup: string,
  searchValue: number,
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  if (searchValue === 0) {
    const path = getRequestListEndpointUrl();
    const params = new HttpParams()
      .set('requestGroup', requestGroup)
      .set('requestType', 'BTQ')
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('sort', 'createdDate,desc');
    return { path, params };
  } else {
    const path = getRequestListEndpointUrl();
    const params = new HttpParams()
      .set('reqDocNo', searchValue.toString())
      .set('requestGroup', requestGroup)
      .set('requestType', 'BTQ')
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('sort', 'createdDate,desc');
    return { path, params };
  }
};

export const getCreateRequestListEndpointUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + getStockRequestUrl();
  const params = new HttpParams().set('requestType', 'BTQ');
  return { path, params };
};

export const getBoutiqueListEndpointUrl = (): string => {
  return getInventoryBaseUrl() + `/stock-managements/items/locations`;
};
/**
 * To retrive boutique list based on the items entered to create request
 * @param pageIndex: page number
 * @param pageSize: number of boutiques to be displayed in that page
 */
export const getBoutiqueListByPaginationEndpointUrl = (
  regionType: string,
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getBoutiqueListEndpointUrl();
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString());

  if (regionType !== null) {
    params = params.set('regionType', regionType);
  }
  return { path, params };
};

export const getRequestEndpointUrl = (
  id: number,
  requestGroup: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockRequestUrl() + `/${id}`;
  const params = new HttpParams()
    .set('requestType', 'BTQ')
    .set('requestGroup', requestGroup);
  return { path, params };
};
/**
 * To retrive product variant based on params
 * @param requestId : selected request id
 * @param pageIndex : page number
 * @param pageSize : number of products to be displayed in that page
 */
export const getItemListEndpointUrl = (
  id: number,
  requestGroup: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockRequestUrl() + `/${id}/items`;
  const params = new HttpParams()
    .set('requestType', 'BTQ')
    .set('requestGroup', requestGroup);
  return { path, params };
};

/**
 * To update quantity for the product based on params
 * @param id : selected request id
 * @param itemId : selected product variant id
 */
export const updateItemListEndpointUrl = (
  id: number,
  itemId: string,
  requestGroup: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getStockRequestUrl() + `/${id}/items/${itemId}`;
  const params = new HttpParams()
    .set('requestType', 'BTQ')
    .set('requestGroup', requestGroup);
  return { path, params };
};

/**
 * To update status of request for selected products
 * @param type : type of status
 * @param id : selected request id
 */

export const updateItemListStatusEndpointUrl = (
  id: number,
  requestGroup: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockRequestUrl() + `/${id}`;
  const params = new HttpParams()
    .set('requestType', 'BTQ')
    .set('requestGroup', requestGroup);
  return { path, params };
};
//IBT History
export const getIBTHistoryByPaginationEndpointUrl = (
  pageIndex: number,
  pageSize: number,
  requestType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/request`;
  let params = new HttpParams();
  if (pageIndex !== null && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
    params = params.set('sort', 'createdDate,desc');
    params = params.set('requestType', requestType);
  }

  return { path, params };
};
export const getIBTSelectedHistoryUrl = (
  id: number,
  actionType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/request/${id}`;
  const params = new HttpParams()
    .set('requestType', 'BTQ')
    .set('actionType', actionType);
  return { path, params };
};

export const getIBTHistoryItemsByPaginationEndpointUrl = (
  pageIndex: number,
  pageSize: number,
  id: number,
  actionType: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getHistoryUrl() + '/request' + `/${id}` + '/items';
  const params = new HttpParams()
    .set('requestType', 'BTQ')
    .set('actionType', actionType)
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString());
  return { path, params };
};

export const getBoutiqueStatisticsEndpointUrl = (): string => {
  return `/boutiqueStatistics`;
};

export const getStockReceiveVerifyItemEndpointUrl = (
  storeType: string,
  type: string,
  id: number,
  itemId: string
): { path: string; params: HttpParams } => {
  let path = getInventoryBaseUrl();
  let params = new HttpParams();
  if (isL1L2Store(storeType)) {
    path = path + getStockReceiveUrl();
    params = params.set('transferType', type);
  } else if (isL3Store(storeType)) {
    path = path + getPurchaseInvoiceUrl();
    params = params.set('invoiceType', type);
  }

  path = path + `/${id}/items/${itemId}`;
  return { path, params };
};

export const getTotalReceivedWeightEndpointUrl = (
  storeType: string,
  type: string,
  status: string,
  id: number
): { path: string; params: HttpParams } => {
  let path = getInventoryBaseUrl();
  let params = new HttpParams();

  if (isL1L2Store(storeType)) {
    path = path + getStockReceiveUrl();
    params = params.set('transferType', type);
  } else if (isL3Store(storeType)) {
    path = path + getPurchaseInvoiceUrl();
    params = params.set('invoiceType', type);
  }
  params = params.set('status', status);
  path = path + `/${id}/weight`;
  return { path, params };
};

export const getValidateItemEndpointUrl = (
  productGroupCode: string,
  availableWeight: number,
  measuredWeight: number,
  measuredQuantity: number,
  availableQuantity: number,
  configType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getLiteDataUrl() + '/validate';
  const params = new HttpParams()
    .set('productGroupCode', productGroupCode)
    .set('availableWeight', '' + availableWeight)
    .set('measuredWeight', '' + measuredWeight)
    .set('measuredQuantity', '' + measuredQuantity)
    .set('availableQuantity', '' + availableQuantity);

  return { path, params };
};
export const getWeightToleranceEndpointUrl = (
  productGroupCode: string,
  availableWeight: number,
  measuredWeight: number,
  measuredQuantity: number,
  availableQuantity: number,
  configType: string
): { path: string; params: HttpParams } => {
  const path = getEngineBaseUrl() + getWeightToleranceUrl();
  const params = new HttpParams()
    .set('productGroupCode', productGroupCode)
    .set('availableWeight', '' + availableWeight)
    .set('measuredWeight', '' + measuredWeight)
    .set('measuredQuantity', '' + measuredQuantity)
    .set('availableQuantity', '' + availableQuantity);

  return { path, params };
};

export const getStockReceiveUpdateAllItemsEndpointUrl = (
  storeType: string,
  type: string,
  id: number
): { path: string; params: HttpParams } => {
  let path = getInventoryBaseUrl();
  let params = new HttpParams();
  if (isL1L2Store(storeType)) {
    path = path + getStockReceiveUrl();
    params = params.set('transferType', type);
  } else if (isL3Store(storeType)) {
    path = path + getPurchaseInvoiceUrl();
    params = params.set('invoiceType', type);
  }

  path = path + `/${id}/items`;
  return { path, params };
};

export const getStockReceiveItemsEndpointUrl = (
  storeType: string,
  type: string,
  status: string,
  id: number,
  itemCode: string,
  lotNumber: string,
  pageIndex: number,
  pageSize: number,
  sortBy: string,
  sortOrder: string,
  filter: { key: string; value: any[] }[]
): { path: string; params: HttpParams } => {
  let path = getInventoryBaseUrl();
  if (isL1L2Store(storeType)) {
    path = path + getStockReceiveUrl();
  } else if (isL3Store(storeType)) {
    path = path + getPurchaseInvoiceUrl();
  }
  path = path + `/${id}/items`;

  let params = new HttpParams();
  if (itemCode) {
    params = params.set('itemCode', itemCode);
  }
  if (lotNumber) {
    params = params.set('lotNumber', lotNumber);
  }
  if (status) {
    params = params.set('status', status);
  }
  if (type) {
    if (isL1L2Store(storeType)) {
      params = params.set('transferType', type);
    } else if (isL3Store(storeType)) {
      params = params.set('invoiceType', type);
    }
  }
  if (sortBy) {
    params = params.set('sort', `${sortBy},${sortOrder}`);
  }
  if (pageIndex !== null && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  if (filter && filter.length > 0) {
    for (let i = 0; i < filter.length; i++) {
      for (let j = 0; j < filter[i].value.length; j++) {
        params = params.append(filter[i].key, filter[i].value[j]);
      }
    }
  }
  return {
    path,
    params
  };
};
export const getStockReceiveHistroyItemsEndpointUrl = (
  id: string,
  pageIndex: number,
  pageSize: number,
  sort: string[],
  historyApiType: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getHistoryUrl() + `/transfer/${id}/items`;
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('actionType', 'RECEIVE')
    .set('transferType', historyApiType);
  if (sort !== null) {
    params = params.set('sort', sort.toString());
  }
  return { path, params };
};
export const getStockReceiveCFAHistroyItemsEndpointUrl = (
  id: string,
  pageIndex: number,
  pageSize: number,
  sort: string[],
  historyApiType: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getHistoryUrl() + '/invoice' + `/${id}/items`;
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('actionType', 'RECEIVE')
    .set('invoiceType', historyApiType);
  if (sort !== null) {
    params = params.set('sort', sort.toString());
  }
  return { path, params };
};

export const getStockReceiveConfirmSTNEndpointUrl = (
  storeType: string,
  type: string,
  id: number
): { path: string; params: HttpParams } => {
  let path = getInventoryBaseUrl();
  let params = new HttpParams();
  if (isL1L2Store(storeType)) {
    path = path + getStockReceiveUrl();
    params = params.set('transferType', type);
  } else if (isL3Store(storeType)) {
    path = path + getPurchaseInvoiceUrl();
    params = params.set('invoiceType', type);
  }

  path = path + `/${id}`;
  return { path, params };
};

export const getStockReceiveHistoryEndPointUrl = (
  pageIndex,
  pageSize,
  transferType: string,
  sort: string[]
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/transfer`;
  let params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('transferType', transferType);
  if (sort !== null) {
    params = params.set('sort', sort.toString());
  }
  return { path: path, params: params };
};
export const getStockReceiveCFAHistoryUrl = (
  pageIndex,
  pageSize,
  invoiceType: string,
  sort: string[]
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/invoice`;
  let params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('invoiceType', invoiceType);
  if (sort !== null) {
    params = params.set('sort', sort.toString());
  }
  return { path: path, params: params };
};

export const getStockReceiveHeaderLevelDetails = (stockId): string => {
  return getInventoryBaseUrl() + '/history' + '/transfer' + `/${stockId}`;
};

/*
  Endpoints for Stock-issue module
*/
//new
export const getStockIssueRequestUrl = (): string => {
  return `/stock-issues/request`;
};

export const getStockIssueByPaginationEndpointUrl = (
  requestType,
  page,
  limit
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockIssueRequestUrl();
  const params = new HttpParams()
    .set('requestType', requestType)
    .set('page', page)
    .set('size', limit);
  return { path, params };
};

export const getIssueSTNCountEndpointUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + getStockIssueRequestUrl() + `/counts`;
  const params = new HttpParams();
  return { path, params };
};
export const getOtherIssueSTNCountEndpointUrl = (): string => {
  return getInventoryBaseUrl() + getOtherIssuesUrl() + '/counts';
};

// cancel STN

export const getStockIssueCancelByPaginationEndpointUrl = (
  requestType,
  page,
  limit,
  srcDocNo
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockIssuesCancelUrl();
  console.log('srcDocNo', srcDocNo, page, limit);
  let params = new HttpParams().set('transferType', requestType);

  if (srcDocNo) {
    params = params.set('srcDocNo', srcDocNo);
  } else {
    params = params.set('page', page).set('size', limit);
  }

  return { path, params };
};

export const getCancelIssueSTNCountEndpointUrl = (
  transferType: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + getStockIssuesCancelUrl() + `/count`;
  const params = new HttpParams().set('transferType', transferType);
  return { path, params };
};

export const getCancelIssueSTNEndpointUrl = (
  transferType: string,
  id: number
): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + getStockIssuesCancelUrl() + `/${id}`;
  const params = new HttpParams().set('transferType', transferType);
  return { path, params };
};

export const regenerateFileEndpointUrl = (
  invoiceType: string,
  id: number
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getInventoryBaseUrl() +
    getReturnInvoiceCfaUrl() +
    '/filePublish' +
    `/${id}`;
  const params = new HttpParams().set('invoiceType', invoiceType);
  return { path, params };
};

export const getCancelIssueItemsByPaginationEndpointUrl = (
  id: number,
  pageIndex: number,
  pageSize: number,
  sort: string[],
  transferType: string,
  binCodes: string[],
  binGroupCode: string,
  itemCode: string,
  lotNumber: string,
  productCategories: string[],
  productGroups: string[]
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getStockIssuesCancelUrl() + `/${id}/items`;
  let params = new HttpParams()
    .set('size', pageSize.toString())
    .set('page', pageIndex.toString());
  if (sort !== null) {
    params = params.set('sort', sort.toString());
  }
  if (transferType !== null && transferType !== '') {
    params = params.set('transferType', transferType);
  }

  if (itemCode !== null && itemCode !== '') {
    params = params.set('itemCode', itemCode);
  }

  if (lotNumber !== null && lotNumber !== '') {
    params = params.set('lotNumber', lotNumber);
  }

  if (binGroupCode !== null && binGroupCode !== '') {
    params = params.set('binGroupCode', binGroupCode);
  }

  if (binCodes !== null && binCodes.length !== 0 && binCodes[0] !== null) {
    params = params.set('binCodes', binCodes.toString());
  }

  if (
    productCategories !== null &&
    productCategories.length !== 0 &&
    productCategories[0] !== null
  ) {
    params = params.set('productCategory', productCategories.toString());
  }

  if (
    productGroups !== null &&
    productGroups.length !== 0 &&
    productGroups[0] !== null
  ) {
    params = params.set('productGroup', productGroups.toString());
  }

  return { path, params };
};

export const getCancelIssueItemsCountEndpointUrl = (
  transferType: string,
  id: number
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getStockIssuesCancelUrl() + `/${id}/items`;
  const params = new HttpParams().set('transferType', transferType);

  return { path, params };
};

/*
  Stock Issue-L3
*/
const getInvoiceReturnUrl = (): string => {
  return `/invoice-return`;
};

export const getIssueInvoiceByPaginationEndpointUrl = (
  type,
  page,
  limit
): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + getInvoiceReturnUrl();
  const params = new HttpParams()
    .set('invoicetype', type)
    .set('page', page)
    .set('size', limit)
    .set('sort', `${'id'}%2C${'desc'}`);
  return { path, params };
};

/*
 Issue Invoice Count
*/

export const getIssueInvoiceEndpointUrl = (): string => {
  return getInventoryBaseUrl() + getInvoiceReturnUrl() + '/counts';
};

/*
Issue Search
*/

export const getStockIssueBySrcDocNoEndpointUrl = (
  reqDocNo: number,
  requestType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockIssueRequestUrl();
  const params = new HttpParams()
    .set('requestType', requestType)
    .set('reqDocNo', reqDocNo.toString());
  return { path, params };
};

/*
Load Selected Request
*/
export const getStockIssueRequestByIDEndpointUrl = (
  id,
  requestType
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockIssueRequestUrl() + `/${id}`;
  const params = new HttpParams().set('requestType', requestType);
  return { path, params };
};

/*
Search Issue Invoice
*/
export const getInvoiceReturnBySrcDocNoEndpointUrl = (
  srcDocNo,
  type
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getInvoiceReturnUrl();
  const params = new HttpParams()
    .set('invoicetype', type)
    .set('srcdocno', srcDocNo);
  return { path, params };
};

export const getInvoiceReturnByIdEndpointUrl = (
  srcDocNo,
  type,
  status
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getInvoiceReturnUrl() + `/${srcDocNo}`;
  const params = new HttpParams().set('status', status);
  return { path, params };
};

export const getStockIssueByReqDocNoEndpointUrl = (
  reqDocNo,
  transferType,
  requestType
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getStockIssueRequestUrl();
  const params = new HttpParams()
    .set('requestType', requestType)
    .set('reqDocNo', reqDocNo);
  return { path, params };
};

// ISSUE DETAILS
export const getIssueItemsCountEndpointUrl = (
  storeType: string,
  id: number,
  pageIndex: number,
  pageSize: number,
  requestType: string,
  status: string
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path =
      getInventoryBaseUrl() + getStockIssueRequestUrl() + `/${id}/items`;
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('requestType', requestType)
      .set('status', status);
    return { path, params };
  }
  // else if (isL3Store(storeType)) {
  //   return (
  //     getInventoryBaseUrl() +
  //     getInvoiceReturnUrl() +
  //     `/${id}/items?page=${pageIndex}&size=${pageSize}`
  //   );
  // }
  else {
    // TODO Throw an error
    return null;
  }
};

export const getIssueItemsByPaginationEndpointUrl = (
  id: number,
  itemCode: string,
  lotNumber: string,
  requestType: string,
  storeType: string,
  status: string,
  pageIndex: number,
  pageSize: number,
  sort?: Map<string, string>,
  filter?: { key: string; value: any[] }[]
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path =
      getInventoryBaseUrl() + getStockIssueRequestUrl() + `/${id}/items`;
    let params = new HttpParams();
    if (itemCode) {
      params = params.set('itemCode', itemCode);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (requestType) {
      params = params.set('requestType', requestType);
    }
    if (pageIndex !== null && pageSize !== null) {
      params = params.set('page', pageIndex.toString());
      params = params.set('size', pageSize.toString());
    }
    if (lotNumber) {
      params = params.set('lotNumber', lotNumber);
    }
    if (filter && filter.length > 0) {
      for (let i = 0; i < filter.length; i++) {
        for (let j = 0; j < filter[i].value.length; j++) {
          params = params.append(filter[i].key, filter[i].value[j]);
        }
      }
    }
    if (sort && sort.get('sort') !== undefined) {
      params = params.set('sort', sort.get('sort'));
    }
    return { path, params };
  }
};
// update Item
export const getIssueUpdateItemEndpointUrl = (
  requestType: string,
  storeType: string,
  id: number,
  itemId: number
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path =
      getInventoryBaseUrl() +
      getStockIssueRequestUrl() +
      `/${id}/items/${itemId}`;
    const params = new HttpParams().set('requestType', requestType);
    return { path, params };
  } else {
    // TODO Throw an error
    return null;
  }
};
export const getIssueUpdateAllItemEndpointUrl = (
  requestType: string,
  storeType: string,
  id: number
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getStockIssueRequestUrl() + `/${id}/items`;
  const params = new HttpParams().set('requestType', requestType);
  return { path, params };
};

const isL1L2Store = (storeType: string): boolean => {
  return (
    storeType === StoreTypes.LargeFormatStoreType ||
    storeType === StoreTypes.MediumFormatStoreType
  );
};

const isL3Store = (storeType: string): boolean => {
  return storeType === StoreTypes.SmallFormatStoreType;
};

// Issue History
export const getStockIssueHistoryByPaginationEndpointUrl = (
  page: number,
  size: number,
  sort: string[],
  transferType: string,
  isLegacy?: boolean
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/transfer`;
  let params = new HttpParams()
    .set('transferType', transferType)
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', sort.toString());
  if (isLegacy === true || isLegacy === false) {
    params = params.set('isLegacy', isLegacy.toString());
  }
  return { path, params };
};
export const getStockIssueInvoiceHistoryEndpointUrl = (
  pageIndex: number,
  pageSize: number,
  invoiceType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/invoice`;
  const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('invoiceType', invoiceType);

  return { path, params };
};

export const getStockIssueSelectedHistoryUrl = (
  actionType: string,
  id: number,
  type: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/transfer/${id}`;
  let params = new HttpParams();
  if (actionType !== null && actionType !== '') {
    params = params.set('actionType', actionType);
    params = params.set('transferType', type);
  }
  return { path, params };
};
export const getStockIssueInvoiceSelectedHistoryUrl = (
  id: number,
  type: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/invoice/${id}`;
  let params = new HttpParams();
  params = params.set('actionType', 'ISSUE');
  params = params.set('invoiceType', type);
  return { path, params };
};

export const getIssueHistoryItemsByPaginationEndpointUrl = (
  actionType: string,
  id: number,
  pageIndex: number,
  pageSize: number,
  sort: string[],
  transferType: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getHistoryUrl() + `/transfer/${id}/items`;
  let params = new HttpParams()
    .set('size', pageSize.toString())
    .set('page', pageIndex.toString());
  if (actionType !== null && actionType !== '') {
    params = params.set('actionType', actionType);
  }
  if (sort !== null) {
    params = params.set('sort', sort.toString());
  }
  if (transferType !== null && transferType !== '') {
    params = params.set('transferType', transferType);
  }

  return { path, params };
};
export const getIssueInvoiceHistoryItemsByPaginationEndpointUrl = (
  id: number,
  pageIndex: number,
  pageSize: number,
  sort: string[],
  invoiceType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/invoice/${id}/items`;
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('invoiceType', invoiceType)
    .set('actionType', 'ISSUE');
  if (sort !== null) {
    params = params.set('sort', sort.toString());
  }
  return { path, params };
};

export const getIssueHistoryItemsCountEndpointUrl = (
  storeType: string,
  id: number,
  pageIndex: number,
  pageSize: number,
  requestType: string,
  status: string
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path = getInventoryBaseUrl() + getHistoryUrl() + `/issue/${id}/items`;
    const params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('requestType', requestType)
      .set('status', status);
    return { path, params };
  } else {
    // TODO Throw an error
    return null;
  }
};

//////////////////////////////////////
//bintobin History
export const getBinToBinHistoryByPaginationEndpointUrl = (
  pageIndex: number,
  pageSize: number,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/transaction`;
  let params = new HttpParams();
  params = params.set('sort', 'createdDate,desc');
  params = params.set('transactionType', transactionType);
  if (pageIndex !== null && pageSize !== null) {
    params = params
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString());
    // params = params.set('sort', 'createdDate,DESC');
  }
  return { path, params };
};

export const getBinToBinSelectedHistoryUrl = (
  id: number
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/transaction/${id}`;
  const params = new HttpParams().set('transactionType', 'BIN_TO_BIN');
  return { path: path, params: params };
};

export const getBinToBinHistoryItemsByPaginationEndpointUrl = (
  pageIndex: number,
  pageSize: number,
  sortBy: string,
  sortOrder: string,
  id: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() +
    getHistoryUrl() +
    '/transaction' +
    `/${id}` +
    '/items';
  let params = new HttpParams()
    .set('transactionType', 'BIN_TO_BIN')
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString());
  if (sortBy) {
    params = params.set('sort', `${sortBy},${sortOrder}`);
  }
  return { path, params };
};

export const getCreateIssueItemsEndPointUrl = (
  id: number
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getReturnInvoiceCfaUrl() + `/${id}/items`;
  let params = new HttpParams();
  params = params.set('invoiceType', 'BTQ_CFA');
  return { path: path, params: params };
};

export const getCreateDirectIssueItemsEndPointUrl = (
  id: number
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getDirectIssueUrl() + `/${id}/items`;
  let params = new HttpParams();
  params = params.set('transferType', 'BTQ_BTQ');
  return { path: path, params: params };
};
export const getCFAddressUrl = (): string => {
  return getLocationBaseUrl() + '/stores' + '/locations';
};

export const getConfirmReturnInvoiceCfaEndpointUrl = (
  id
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getReturnInvoiceCfaUrl() + `/${id}`;
  let params = new HttpParams();
  params = params.set('invoiceType', 'BTQ_CFA');
  return { path: path, params: params };
};

export const getConfirmDirectIssueEndpointUrl = (
  id
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getDirectIssueUrl() + `/${id}`;
  let params = new HttpParams();
  params = params.set('transferType', 'BTQ_BTQ');
  return { path: path, params: params };
};

export const getSearchReturnInvoiceItemCfaEndpointUrl = (
  id: number,
  variantCode: string,
  lotNumber: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + '/return-invoices' + `/${id}` + '/items';
  let params = new HttpParams();
  params = params.set('invoiceType', 'BTQ_CFA');

  if (lotNumber) {
    params = params.set('lotNumber', lotNumber);
  }
  if (variantCode) {
    params = params.set('itemCode', variantCode);
  }
  return { path: path, params: params };
};

export const getSearchDirectIssueEndpointUrl = (
  id: number,
  variantCode: string,
  lotNumber: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getDirectIssueUrl() + `/${id}` + '/items';
  let params = new HttpParams();
  params = params.set('transferType', 'BTQ_BTQ');

  if (lotNumber) {
    params = params.set('lotNumber', lotNumber);
  }
  if (variantCode) {
    params = params.set('itemCode', variantCode);
  }
  return { path: path, params: params };
};

export const getRemoveSelectedItemEndPointUrl = (id, itemId): string => {
  return (
    getInventoryBaseUrl() +
    getReturnInvoiceCfaUrl() +
    `/${id}` +
    '/items' +
    `/${itemId}`
  );
};

export const getItemsToCFAUrl = (
  id: number,
  pageIndex: number,
  pageSize: number,
  sortBy: string,
  sortOrder: string,
  itemCode: string,
  lotNumber: string,
  filter: { key: string; value: any[] }[]
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getReturnInvoiceCfaUrl() + `/${id}` + '/items';
  let params = new HttpParams();
  params = params.set('invoiceType', 'BTQ_CFA');
  params = params.set('status', 'SELECTED');
  if (itemCode) {
    params = params.set('itemCode', itemCode);
  }
  if (lotNumber) {
    params = params.set('lotNumber', lotNumber);
  }
  if (pageIndex !== null && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  if (sortBy) {
    params = params.set('sort', `${sortBy},${sortOrder}`);
  }
  if (filter && filter.length > 0) {
    for (let i = 0; i < filter.length; i++) {
      for (let j = 0; j < filter[i].value.length; j++) {
        params = params.append(filter[i].key, filter[i].value[j]);
      }
    }
  }

  return {
    path,
    params
  };
};

export const getItemsToDirectIssueUrl = (
  id: number,
  pageIndex: number,
  pageSize: number,
  sortBy: string,
  sortOrder: string,
  itemCode: string,
  lotNumber: string,
  filter: { key: string; value: any[] }[]
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getDirectIssueUrl() + `/${id}` + '/items';
  let params = new HttpParams();
  params = params.set('transferType', 'BTQ_BTQ');
  params = params.set('status', 'SELECTED');
  if (itemCode) {
    params = params.set('itemCode', itemCode);
  }
  if (lotNumber) {
    params = params.set('lotNumber', lotNumber);
  }
  if (pageIndex !== null && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  if (sortBy) {
    params = params.set('sort', `${sortBy},${sortOrder}`);
  }
  if (filter && filter.length > 0) {
    for (let i = 0; i < filter.length; i++) {
      for (let j = 0; j < filter[i].value.length; j++) {
        params = params.append(filter[i].key, filter[i].value[j]);
      }
    }
  }

  return {
    path,
    params
  };
};

export const getReturnInvoiceToCFAProductGroupsForFilterUrl = (): string => {
  return getProductBaseUrl() + getLiteDataUrl() + '/product-groups';
};
export const getReturnInvoiceToCFAProductCatrgoryForFilterUrl = (): string => {
  return getProductBaseUrl() + getLiteDataUrl() + '/product-categories';
};

/**
 * Base Url for stock-issue TEP/GEP  Api
 */

export const getCreateStockIssueUrl = (
  transferType: string,
  storeType: string
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path =
      getInventoryBaseUrl() + getStockIssueUrl() + getStockTransferUrl();
    const params = new HttpParams().set('transferType', transferType);
    return { path: path, params: params };
  } else if (isL3Store(storeType)) {
    const path = getInventoryBaseUrl() + getReturnInvoiceCfaUrl();
    const params = new HttpParams().set('invoiceType', transferType);
    return { path: path, params: params };
  }
};

export const getSelectedStockIssueUrl = (
  transferType: string,
  storeType: string,
  id: number
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path =
      getInventoryBaseUrl() +
      getStockIssueUrl() +
      getStockTransferUrl() +
      `/${id}/detail`;
    const params = new HttpParams().set('transferType', transferType);
    return { path: path, params: params };
  } else if (isL3Store(storeType)) {
    const path =
      getInventoryBaseUrl() + getReturnInvoiceCfaUrl() + `/${id}/detail`;
    const params = new HttpParams().set('invoiceType', transferType);
    return { path: path, params: params };
  }
};

export const updateStockIssueUrl = (
  id: number,
  transferType: string,
  storeType: string
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path =
      getInventoryBaseUrl() +
      getStockIssueUrl() +
      getStockTransferUrl() +
      `/${id}`;
    const params = new HttpParams().set('transferType', transferType);
    return { path: path, params: params };
  } else if (isL3Store(storeType)) {
    const path = getInventoryBaseUrl() + getReturnInvoiceCfaUrl() + `/${id}`;
    const params = new HttpParams().set('invoiceType', transferType);
    return { path: path, params: params };
  }
};

export const getCreateStockIssueItemsUrl = (
  id: number,
  transferType: string,
  storeType: string
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path =
      getInventoryBaseUrl() +
      getStockIssueUrl() +
      getStockTransferUrl() +
      `/${id}/items`;
    const params = new HttpParams().set('transferType', transferType);
    return { path: path, params: params };
  } else if (isL3Store(storeType)) {
    const path =
      getInventoryBaseUrl() + getReturnInvoiceCfaUrl() + `/${id}/items`;
    const params = new HttpParams().set('invoiceType', transferType);
    return { path: path, params: params };
  }
};

export const getStockIssueItemsUrl = (
  id: number,
  itemCode: string,
  lotNumber: string,
  transferType: string,
  storeType: string,
  status: string,
  pageIndex: number,
  pageSize: number,
  sort: Map<string, string>,
  filter: Map<string, string>,
  cfaLocationCode?: string
): string => {
  if (isL1L2Store(storeType)) {
    /*
     const path = getInventoryBaseUrl() + getStockIssueUrl() + getStockTransferUrl() + `/${id}/items`;
    let params = new HttpParams()
      .set('status', status)
      .set('transferType', transferType)
      .set('page', pageIndex.toString());
    if (pageSize && pageSize !== 0) {
      params = params.set('size', pageSize.toString());
    } else {
      params = params.set('size', '');
    }
    if (itemCode && itemCode !== '') {
      params = params.set('itemCode', itemCode);
    } else {
      params = params.set('itemCode', '');
    }
    if (lotNumber && lotNumber !== '') {
      params = params.set('lotNumber', lotNumber);
    } else {
      params = params.set('itemCode', '');
    }
    if (sort) {
      params = params.set('lotNumber', lotNumber);
    } else {
      params = params.set('itemCode', '');
    }

    return { path: path, params: params };
    */
    return (
      getInventoryBaseUrl() +
      getStockIssueUrl() +
      getStockTransferUrl() +
      `/${id}/items?status=${status}&transferType=${transferType}&page=${pageIndex}` +
      (pageSize && pageSize !== 0 ? `&size=${pageSize}` : ``) +
      (itemCode && itemCode !== '' ? `&itemCode=${itemCode}` : ``) +
      (lotNumber && lotNumber !== '' ? `&lotNumber=${lotNumber}` : ``) +
      (sort ? generateSortUrl(sort) : ``) +
      (filter ? generateFilterUrl(filter) : ``) +
      (cfaLocationCode ? `&cfaLocationCode=${cfaLocationCode}` : ``)
    );
  } else if (isL3Store(storeType)) {
    return (
      getInventoryBaseUrl() +
      getReturnInvoiceCfaUrl() +
      `/${id}/items?status=${status}&invoiceType=${transferType}&page=${pageIndex}` +
      (pageSize && pageSize !== 0 ? `&size=${pageSize}` : ``) +
      (itemCode && itemCode !== '' ? `&itemCode=${itemCode}` : ``) +
      (lotNumber && lotNumber !== '' ? `&lotNumber=${lotNumber}` : ``) +
      (sort ? generateSortUrl(sort) : ``) +
      (filter ? generateFilterUrl(filter) : ``)+
      (cfaLocationCode ? `&cfaLocationCode=${cfaLocationCode}` : ``)
    );
  }
};

export const getCreateRequestEndpointUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + getReturnInvoiceCfaUrl();
  let params = new HttpParams();
  params = params.set('invoiceType', 'BTQ_CFA');
  return { path: path, params: params };
};

export const getCreateRequestDirectIssueEndpointUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + getDirectIssueUrl();
  let params = new HttpParams();
  params = params.set('transferType', 'BTQ_BTQ');
  return { path: path, params: params };
};

export const getStockIssueItemsCountUrl = (
  id: number,
  transferType: string,
  storeType: string,
  status: string,
  cfaLocationCode?: string
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path =
      getInventoryBaseUrl() +
      getStockIssueUrl() +
      getStockTransferUrl() +
      `/${id}/items`;
    let params = new HttpParams();
    params = params.set('status', status);
    params = params.set('transferType', transferType);
    if(cfaLocationCode) params = params.set('cfaLocationCode', cfaLocationCode);
    params = params.set('page', '0');
    params = params.set('size', '1');
    return { path: path, params: params };
  } else if (isL3Store(storeType)) {
    const path =
      getInventoryBaseUrl() + getReturnInvoiceCfaUrl() + `/${id}/items`;
    let params = new HttpParams();
    params = params.set('status', status);
    params = params.set('invoiceType', transferType);
    params = params.set('page', '0');
    params = params.set('size', '1');
    return { path: path, params: params };
  }
};

export const updateStockIssueItemUrl = (
  id: number,
  itemId: number,
  transferType: string,
  storeType: string
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path =
      getInventoryBaseUrl() +
      getStockIssueUrl() +
      getStockTransferUrl() +
      `/${id}/items/${itemId}`;
    let params = new HttpParams();
    params = params.set('transferType', transferType);
    return { path: path, params: params };
  } else if (isL3Store(storeType)) {
    const path =
      getInventoryBaseUrl() +
      getReturnInvoiceCfaUrl() +
      `/ ${id} /items/${itemId}`;
    let params = new HttpParams();
    params = params.set('invoiceType', transferType);
    return { path: path, params: params };
  }
};

export const generateFilterUrl = (filter: Map<string, string>): string => {
  if (filter.size !== 0) {
    let filterUrl = '';
    filter.forEach((value, key) => {
      filterUrl = filterUrl + `&${key}=${value}`;
    });
    return filterUrl;
  } else {
    return '';
  }
};

export const generateSortUrl = (sort: Map<string, string>): string => {
  if (sort.size !== 0) {
    let sortUrl = '';
    sort.forEach((value, key) => {
      sortUrl = sortUrl + `&${key}=${value}`;
    });
    return sortUrl;
  } else {
    return '';
  }
};

export const getFactoryAddressEndpointUrl = (): string => {
  return getLocationBaseUrl() + `/ stores / locations`;
};

export const getReceiptItemsByPaginationEndpointUrl = (
  storeType: string,
  id: number,
  status: string,
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  if (isL1L2Store(storeType)) {
    const path = getInventoryBaseUrl() + getStockReceiveUrl() + `/${id}/items`;
    let params = new HttpParams();
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
    params = params.set('status', status);
    return { path: path, params: params };
  } else if (isL3Store(storeType)) {
    const path =
      getInventoryBaseUrl() + getPurchaseInvoiceUrl() + `/${id}/items`;
    let params = new HttpParams();
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
    params = params.set('status', status);
    return { path: path, params: params };
  } else {
    // TODO Throw an error
    return null;
  }
};

export const getOtherIssueItemsByPaginationEndpointUrl = (
  id: number,
  status: string,
  pageIndex: number,
  pageSize: number,
  requestType: string,
  itemCode?: string,
  lotNumber?: string,
  sort?: Map<string, string>,
  filter?: { key: string; value: any[] }[]
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherIssuesUrl() + `/${id}/items`;
  let params = new HttpParams();
  params = params.set('page', pageIndex.toString());
  params = params.set('size', pageSize.toString());
  params = params.set('requestType', requestType);
  params = params.set('status', status);
  if (itemCode && itemCode !== '') {
    params = params.append('itemCode', itemCode);
  }
  if (lotNumber && lotNumber !== '') {
    params = params.append('lotNumber', lotNumber);
  }
  if (sort) {
    sort.forEach((value, key) => {
      params = params.append(key, value);
    });
  }
  if (filter && filter.length > 0) {
    for (let i = 0; i < filter.length; i++) {
      for (let j = 0; j < filter[i].value.length; j++) {
        params = params.append(filter[i].key, filter[i].value[j]);
      }
    }
  }
  return {
    path,
    params
  };
};

export const getOtherStockIssueByPaginationEndpointUrl = (
  requestType,
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherIssuesUrl();
  let params = new HttpParams();
  params = params.set('requestType', requestType);
  params = params.set('page', pageIndex);
  params = params.set('size', pageSize);
  params = params.set('sort', 'reqDocNo,DESC');
  params = params.append('sort', 'reqDocDate,DESC');
  return { path: path, params: params };
};
export const getOtherStockIssueBySrcDocNoEndpointUrl = (
  reqDocNo,
  requestType
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherIssuesUrl();
  let params = new HttpParams();
  params = params.set('requestType', requestType);
  params = params.set('reqDocNo', reqDocNo);
  return { path: path, params: params };
};
export const getRemoveSelectedItemsUrl = (
  id
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getReturnInvoiceCfaUrl() + `/${id}` + '/items';
  let params = new HttpParams();
  params = params.set('invoiceType', 'BTQ_CFA');
  return { path: path, params: params };
};

export const getRemoveDirectIssueSelectedItemsUrl = (
  id
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getDirectIssueUrl() + `/${id}` + '/items';
  let params = new HttpParams();
  params = params.set('transferType', 'BTQ_BTQ');
  return { path: path, params: params };
};
export const getCourierDetailsByLocCodeEndpointUrl = (
  locationCode
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/couriers`;
  let params = new HttpParams();
  params = params.set('isActive', 'true');
  params = params.set('locationCode', locationCode);
  return { path: path, params: params };
};
export const getLoadHeaderLevelUrl = (
  requestId: number
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getReturnInvoiceCfaUrl() + `/${requestId}/detail`;
  let params = new HttpParams();
  params = params.set('invoiceType', 'BTQ_CFA');
  return { path: path, params: params };
};

export const getDirectIssueLoadHeaderLevelUrl = (
  requestId: number
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getDirectIssueUrl() + `/${requestId}/detail`;
  let params = new HttpParams();
  params = params.set('transferType', 'BTQ_BTQ');
  return { path: path, params: params };
};

export const getOtherReceiptsSortItemsByPaginationEndpointUrl = (
  id: number,
  status: string,
  pageIndex: number,
  pageSize: number,
  sortBy: string,
  property: string,
  transactionType: string,
  itemCode?: string,
  lotNumber?: string,
  sort?: Map<string, string>,
  filter?: { key: string; value: any[] }[]
): string => {
  return (
    getInventoryBaseUrl() +
    getOtherReceiveUrl() +
    `/${id}/items?page=${pageIndex}&size=${pageSize}&status=${status}&transactionType=${transactionType}` +
    (itemCode && itemCode !== '' ? `&itemCode=${itemCode}` : ``) +
    (lotNumber && lotNumber !== '' ? `&lotNumber=${lotNumber}` : ``) +
    (sort ? generateSortUrl(sort) : ``) +
    (filter ? generateFilterIssuesUrl(filter) : ``)
  );
};

export const generateFilterIssuesUrl = (
  filter?: { key: string; value: any[] }[]
): string => {
  if (filter.length !== 0) {
    let filterUrl = '';
    if (filter && filter.length > 0) {
      for (let i = 0; i < filter.length; i++) {
        for (let j = 0; j < filter[i].value.length; j++) {
          filterUrl += '&' + filter[i].key + '=' + filter[i].value[j];
        }
      }
    }
    return filterUrl;
  } else {
    return '';
  }
};
export const getcreateOtherIssuesStockRequestEndpointUrl = (
  reqtype: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherRequestUrl();
  const params = new HttpParams().set('requestType', reqtype);
  return { path, params };
};
//v2
export const getOtherIssueCreateItemsByPaginationEndpointUrl = (
  id: number,
  status: string,
  pageIndex: number,
  pageSize: number,
  requestType: string,
  itemCode?: string,
  lotNumber?: string,
  sort?: Map<string, string>,
  filter?: { key: string; value: any[] }[]
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherRequestUrl() + `/${id}/items`;

  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('requestType', requestType)
    .set('status', status);
  if (itemCode && itemCode !== '') {
    params = params.append('itemCode', itemCode);
  }
  if (lotNumber && lotNumber !== '') {
    params = params.append('lotNumber', lotNumber);
  }
  if (sort) {
    sort.forEach((value, key) => {
      params = params.append(key, value);
    });
  }
  if (filter && filter.length > 0) {
    for (let i = 0; i < filter.length; i++) {
      for (let j = 0; j < filter[i].value.length; j++) {
        params = params.append(filter[i].key, filter[i].value[j]);
      }
    }
  }
  return {
    path,
    params
  };
};
//v2
export const searchOtherIssueCreateItemsByPaginationEndpointUrl = (
  id: number,
  status: string,
  pageIndex: number,
  pageSize: number,
  requestType: string,
  itemCode: string,
  lotNumber: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherRequestUrl() + `/${id}/items`;
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('requestType', requestType)
    .set('status', status)
    .set('itemCode', itemCode);
  if (lotNumber && lotNumber !== '') {
    params = params.set('lotNumber', lotNumber);
  } else {
    params = params.set('lotNumber', '');
  }
  return { path, params };
};

export const getCreateOtherIssueStockRequestItemsUrl = (
  id: number,
  requestType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherRequestUrl() + `/${id}/items`;
  const params = new HttpParams().set('requestType', requestType);
  return { path, params };
};
export const getupdateStockRequestCreateItemUrl = (
  id: number,
  itemid: number,
  requestType: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getOtherRequestUrl() + `/${id}/items/${itemid}`;
  const params = new HttpParams().set('requestType', requestType);
  return { path, params };
};
export const getupdateStockRequestUrl = (
  id: number,
  requestType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherRequestUrl() + `/${id}`;
  const params = new HttpParams().set('requestType', requestType);
  return { path, params };
};

export const searchOtherIssueDetailsItemsByPaginationEndpointUrl = (
  id: number,
  status: string,
  pageIndex: number,
  pageSize: number,
  requestType: string,
  itemCode: string,
  lotNumber: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherIssuesUrl() + `/${id}/items`;
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('requestType', requestType)
    .set('status', status)
    .set('itemCode', itemCode);
  if (lotNumber && lotNumber !== '') {
    params = params.set('lotNumber', lotNumber);
  }
  return { path, params };
};

//v2
export const getCreateOtherStockIssueItemsUrl = (
  id: number,
  requestType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherIssuesUrl() + `/${id}/items`;
  const params = new HttpParams().set('requestType', requestType);
  return { path, params };
};
//v2
export const getConfirmOtherIssueUrl = (
  id: number,
  requestType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherIssuesUrl() + `/${id}/`;
  const params = new HttpParams().set('requestType', requestType);
  return { path, params };
};
// Bin to Bin Transfer

export const getBinToBinTransferGetItemListGroupsUrl = (
  transferBy: string,
  pageIndex: number,
  pageSize: number,
  type: string,
  value: string,
  binType: string
): { path: string; params: HttpParams } => {
  const path = getSalesInventoryBaseUrl() + `/${transferBy}`;
  let params = new HttpParams().set('binType', binType);
  if (pageIndex !== null && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  if (value) {
    params = params.set(type, value);
  }
  return {
    path,
    params
  };
};

export const getBinToBinTransferSearchItemsUrl = (
  itemCode: string,
  lotNumber: string,
  binType: string
): { path: string; params: HttpParams } => {
  const path = getSalesInventoryBaseUrl() + `/items`;
  let params = new HttpParams()
    .set('binType', binType)
    .set('size', '2147483647');
  if (itemCode) {
    params = params.set('itemCode', itemCode);
  }
  if (lotNumber) {
    params = params.set('lotNumber', lotNumber);
  }
  return {
    path,
    params
  };
};

export const getBinToBinTransferLoadFileUploadUrl = (): string => {
  return getSalesInventoryBaseUrl() + `/uploadItemsCSV`;
};

export const getBinToBinTransferLoadFileUploadItemsUrl = (): string => {
  return getSalesInventoryBaseUrl() + `/uploadBinItemsCSV`;
};

export const getBinToBinTransferLoadItemsByFileIdUrl = (
  payload: BinToBinTransferLoadFileUploadItemsRequest
): { path: string; params: HttpParams } => {
  let path =
    getSalesInventoryBaseUrl() + `/bins/transfer/items/` + `${payload.fileId}`;
  let params = new HttpParams()
    .set('page', payload.pageIndex.toString())
    .set('size', payload.pageSize.toString());
  return { path, params };
};

export const getBinToBinTransferGetItemsUrl = (
  itemCode: string,
  lotNumber: string,
  type: string,
  value: string,
  pageIndex: number,
  pageSize: number,
  sortBy: string,
  sortOrder: string,
  filter: { key: string; value: any[] }[],
  binType: string
): { path: string; params: HttpParams } => {
  const path = getSalesInventoryBaseUrl() + `/items`;
  let params = new HttpParams().set('binType', binType);
  if (itemCode) {
    params = params.set('itemCode', itemCode);
  }
  if (lotNumber) {
    params = params.set('lotNumber', lotNumber);
  }
  if (type && value) {
    params = params.set(type, value);
  }
  if (sortBy) {
    params = params.set('sort', `${sortBy},${sortOrder}`);
  }
  if (pageIndex !== null && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  if (filter && filter.length > 0) {
    for (let i = 0; i < filter.length; i++) {
      for (let j = 0; j < filter[i].value.length; j++) {
        params = params.append(filter[i].key, filter[i].value[j]);
      }
    }
  }
  return {
    path,
    params
  };
};

export const getBinToBinTransferConfirmTransferItemsUrl = (): string => {
  return getSalesInventoryBaseUrl() + '/bins/items';
};

export const getBinToBinFileUploadItemsBulkTransferUrl = (
  payload: BinToBinFileUploadItemsBulkTransferRequest
): { path: string; params: HttpParams } => {
  let path = getSalesInventoryBaseUrl() + '/bin/items/' + `${payload.fileId}`;
  const params = new HttpParams()
    .set('destinationBincode', payload.destinationBincode)
    .set('destinationBinGroup', payload.destinationBinGroup);
  return { path, params };
};

export const getBinToBinTransferConfirmTransferAllItemsUrl = (
  typeUrl: string,
  typeParam: string,
  value: string,
  destinationBinCode: string,
  destinationBinGroupCode: string
): { path: string; params: HttpParams } => {
  let path = getSalesInventoryBaseUrl();
  path = path + `/${typeUrl}/items`;
  const params = new HttpParams()
    .set('destinationBincode', destinationBinCode)
    .set('destinationBinGroup', destinationBinGroupCode)
    .set(typeParam, value);

  return {
    path,
    params
  };
};
export const getAdjustmentSearchUrl = (
  variantCode: string,
  lotNumber: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + '/stock-management' + '/items';
  let params = new HttpParams();

  if (lotNumber) {
    params = params.set('lotNumber', lotNumber);
  }
  if (variantCode) {
    params = params.set('itemCode', variantCode);
  }
  return { path, params };
};
export const getSearchAdjustmentEndpointUrl = (
  variantCode: string,
  lotNumber: string,
  binType: string
  //productGroups: ProductGroup[]
): { path: string; params: HttpParams } => {
  const path = getInventoryAdjUrl() + '/items';

  let params = new HttpParams();

  if (lotNumber && !variantCode) {
    params = params.set('lotNumber', lotNumber);
  }
  if (variantCode && !lotNumber) {
    params = params.set('itemCode', variantCode);
  }
  if (variantCode && lotNumber) {
    params = params.set('itemCode', variantCode);
    params = params.set('lotNumber', lotNumber);
  }
  if (binType) {
    params = params.set('binType', binType);
  }
  // if (productGroups !== null && productGroups !== undefined) {
  //   productGroups.forEach(productGroup => {
  //     // url = url + `&productGroup=` + productGroup.productGroupCode;
  //     params = params.append('productGroup', productGroup.productGroupCode);
  //   });
  // }

  return { path, params };
};
export const getAdjustmentConfirmUrl = (
  type: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherReceiveUrl();
  const params = new HttpParams().set('transactionType', type);

  return { path, params };
};

export const getAllBinCodesUrl = (): string => {
  return getInventoryBaseUrl() + `/stock-managements/bincodes`;
};

export const getAllBinCodesCountUrl = (): string => {
  return getInventoryBaseUrl() + `/stock-managements/bins`;
};

export const requestBinUrl = () => {
  return getInventoryBaseUrl() + `/stock-managements/bins/requests`;
};

export const getBinRequestApprovalsUrl = (
  locationCode,
  reqDocNo,
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/bins/requests`;
  let params = new HttpParams();
  if (locationCode) {
    params = params.set('locationCode', locationCode);
  }

  if (reqDocNo !== null && reqDocNo !== undefined) {
    params = params.set('reqDocNo', reqDocNo.toString());
  }

  if (
    pageIndex !== null &&
    pageIndex !== undefined &&
    pageSize !== null &&
    pageSize !== undefined
  ) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }

  return { path, params };
};

export const getAllBinHistoryUrl = (
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/history/bin-request`;
  let params = new HttpParams();
  if (pageIndex !== null && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }

  return { path, params };
};

export const getUpdateHallmarkDetailsUrl = (
  payload: UpdateHallmarkDetails
): string => {
  const path =
    getSalesInventoryBaseUrl() +
    `/items/` +
    `${payload.itemCode}` +
    `/${payload.lotNumber}` +
    `/${payload.isHallmark}`;

  return path;
};

export const getLocationsUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + `/locations/filter`;
  const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString());

  return { path, params };
};

export const getLocationCountUrl = (): string => {
  return getLocationBaseUrl() + `/locations`;
};

export const getOtherReciveCountEndpointUrl = (): string => {
  return getInventoryBaseUrl() + getOtherReceiveUrl() + '/counts';
};
export const getOtherReceiveByPaginationEndpointUrl = (
  type,
  page,
  limit
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherReceiveUrl();
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', limit.toString())
    .set('transactionType', type)
    .append('sort', 'issuedDocNo,desc')
    .append('sort', 'issuedDocDate,desc');
  return { path, params };
};
export const getcreateOtherIssuesAdjustmentRequestEndpointUrl = (
  reqtype: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherRequestUrl() + `/items`;
  const params = new HttpParams().set('requestType', reqtype);
  return { path, params };
};

export const getotherReceiveStockByIdEndpointUrl = (
  id,
  transactionType
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherReceiveUrl() + `/${id}`;
  const params = new HttpParams().set('transactionType', transactionType);
  return { path, params };
};

export const getIbtRequestApprovalsUrl = (
  id: number,
  itemCode: string,
  requestType: string,
  pageIndex: number,
  sortBy: string,
  sortOrder: string,
  filter: { key: string; value: any[] }[],
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/${id}/items`;
  let params = new HttpParams();
  if (itemCode) {
    params = params.set('itemCode', itemCode);
  }
  if (pageIndex !== null && pageIndex !== undefined) {
    params = params.set('page', pageIndex.toString());
  }

  if (filter && filter.length > 0) {
    for (let i = 0; i < filter.length; i++) {
      for (let j = 0; j < filter[i].value.length; j++) {
        params = params.append(filter[i].key, filter[i].value[j]);
      }
    }
  }
  if (requestType) {
    params = params.set('requestType', requestType);
  }
  if (pageSize !== null && pageSize !== undefined) {
    params = params.set('size', pageSize.toString());
  }

  if (sortBy) {
    params = params.set('sort', `${sortBy},${sortOrder}`);
  }

  params = params.set('status', 'APVL_PENDING');

  return {
    path,
    params
  };
};

export const getIbtCancelApprovalsUrl = (
  id,
  requestType,
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/transfer/${id}/items`;

  const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('status', 'CNCL_APVL_PENDING')
    .set('transferType', requestType);

  return {
    path,
    params
  };
};

export const getIbtsApprovalsUrl = (
  locationCode,
  reqDocNo,
  type,
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals`;

  let params = new HttpParams();

  if (pageIndex !== null && pageIndex !== undefined) {
    params = params.set('page', pageIndex.toString());
  }

  if (reqDocNo !== null && reqDocNo !== undefined) {
    params = params.set('reqDocNo', reqDocNo.toString());
  }

  if (locationCode) {
    params = params.set('reqLocationCode', locationCode);
  }

  if (type) {
    params = params.set('requestType', type);
  }

  if (pageSize !== null && pageSize !== undefined) {
    params = params.set('size', pageSize.toString());
  }
  params = params.set('sort', 'reqDocDate,ASC');
  params = params.set('status', 'APVL_PENDING');

  return {
    path,
    params
  };
};

export const getIbtsCancellationApprovalsUrl = (
  locationCode,
  reqDocNo,
  type,
  sort,
  pageIndex,
  pageSize,
  status
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/transfer`;

  let params = new HttpParams();

  if (pageIndex !== null && pageIndex !== undefined) {
    params = params.set('page', pageIndex.toString());
  }

  if (pageSize !== null && pageSize !== undefined) {
    params = params.set('size', pageSize.toString);
  }

  if (reqDocNo !== null && reqDocNo !== undefined) {
    params = params.set('srcDocNo', reqDocNo.toString());
  }

  if (locationCode) {
    params = params.set('srcLocationCode', locationCode);
  }

  if (status) {
    params = params.set('status', status);
  }

  if (type) {
    params = params.set('transferType', type);
  }

  return {
    path,
    params
  };
};

export const getAllBinRequestApprovalsCountUrl = (): string => {
  return getInventoryBaseUrl() + `/approvals/bins/requests`;
};

export const getAllIBTRequestApprovalsCountUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + `/approvals`;

  const params = new HttpParams()
    .set('requestType', 'BTQ')
    .set('status', 'APVL_PENDING');
  return { path, params };
};

export const getIBTCancelRequestApprovalsCountUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + `/approvals/transfer`;

  const params = new HttpParams()
    .set('transferType', 'BTQ_BTQ')
    .set('status', 'CNCL_APVL_PENDING');
  return { path, params };
};

export const updateIbtCancelUrl = (
  id,
  transferType
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/transfer/${id}`;

  const params = new HttpParams().set('transferType', transferType);
  return { path, params };
};
export const getAllIBTItemsRequestApprovalsCountUrl = (
  payload: CountPayload
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/${payload.id}/items`;

  const params = new HttpParams()
    .set('requestType', payload.requestType)
    .set('status', 'APVL_PENDING');
  return { path, params };
};

export const updateBinRequestApprovalsCountUrl = (id): string => {
  return getInventoryBaseUrl() + `/approvals/bins/requests/${id}`;
};
export const updateIbtRequestApprovalsCountUrl = (
  id: number,
  itemId: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/${id}/items/${itemId}`;

  const params = new HttpParams().set('requestType', 'BTQ');
  return { path, params };
};

export const updateIbtApprovalsCountUrl = (
  id: number,
  requestType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/${id}`;

  const params = new HttpParams().set('requestType', requestType);
  return { path, params };
};

// export const getLocationsUrl = (pageIndex, pageSize): string => {
//   return (
//     getLocationBaseUrl() +
//     `/locations`

//   );
// };
export const getOtherReceiveItemsByPaginationEndpointUrl = (
  id: number,
  status: string,
  pageIndex: number,
  pageSize: number,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherReceiveUrl() + `/${id}/items`;

  const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('status', status)
    .set('transactionType', transactionType);

  return { path, params };
};
export const getSearchOtherReceiptItemsByItemCodeUrl = (
  id: number,
  itemCode: string,
  lotNumber: string,
  status: string,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherReceiveUrl() + `/${id}/items/`;

  let params = new HttpParams()
    .set('itemCode', itemCode)
    .set('status', status)
    .set('transactionType', transactionType);
  if (lotNumber && lotNumber !== '') {
    params = params.set('lotNumber', lotNumber);
  } else {
    params = params.set('lotNumber', '');
  }

  return { path, params };
};
export const getOtherReceiveVerifyItemEndpointUrl = (
  id: number,
  itemId: string,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getOtherReceiveUrl() + `/${id}/items/${itemId}`;

  const params = new HttpParams().set('transactionType', transactionType);
  return { path, params };
};
export const getUpdateAllOtherReceiptItemsEndpointUrl = (
  id: number,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherReceiveUrl() + `/${id}/items`;

  const params = new HttpParams().set('transactionType', transactionType);
  return { path, params };
};
export const getConfirmOtherReceiptSTNEndpointUrl = (
  id: number,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherReceiveUrl() + `/${id}`;

  const params = new HttpParams().set('transactionType', transactionType);
  return { path, params };
};

export const getCancelStockRequestUrl = (
  id: number,
  requestType: string
): { path: string; params: HttpParams } => {
  if (
    requestType === OtherReceiptsIssuesEnum.ADJUSTMENT_TYPE ||
    requestType === OtherReceiptsIssuesEnum.PSV ||
    requestType === OtherReceiptsIssuesEnum.FOC
  ) {
    const path = getInventoryBaseUrl() + getOtherRequestUrl() + `/${id}/cancel`;

    let params = new HttpParams();

    params = params.set('requestType', requestType);

    return { path, params };
  } else if (
    requestType === OtherReceiptsIssuesEnum.LOAN ||
    requestType === OtherReceiptsIssuesEnum.EXHIBITION_TYPE ||
    requestType === OtherReceiptsIssuesEnum.LOSS_TYPE
  ) {
    const path =
      getInventoryBaseUrl() + getOtherRequestUrl() + `/items/${id}/cancel`;

    let params = new HttpParams();

    params = params.set('requestType', requestType);
    return { path, params };
  }
};
//OTHER RECEIPTS HISTORY
// export const getOtherReceiptIssueHistoryByPaginationEndpointUrl = (
//   page: number,
//   size: number,
//   sort: string[]
// ): { path: string; params: HttpParams } => {
//   const path =
//     getInventoryBaseUrl() +
//     getHistoryUrl() +
//     `/transaction?page=${page}&size=${size}`;
//   const params = new HttpParams();
//   return { path, params };
// };

export const getOtherReceiptsSelectedHistoryUrl = (
  id: number,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getHistoryUrl() + `/transaction` + `/${id}`;

  const params = new HttpParams().set('transactionType', transactionType);
  return { path, params };
};

// export const getOtherReceiptsHistoryItemsByPaginationEndpointUrl = (
//   id: number,
//   pageIndex: number,
//   pageSize: number,
//   sort: string[]
// ): { path: string; params: HttpParams } => {
//   const path =
//     getInventoryBaseUrl() +
//     getHistoryUrl() +
//     `/transaction` +
//     `/${id}/items?page=${pageIndex}` +
//     (pageSize && pageSize !== 0 ? `&size=${pageSize}` : ``);
//   let params = new HttpParams();
//   if (sort !== null) {
//     params = params.set('sort', sort.toString());
//   }
//   return { path, params };

//   // add status
// };

//OTHER ISSUE HISTORY
export const getOtherReceiptIssueHistoryByPaginationEndpointUrl = (
  page: number,
  size: number,
  sort: string,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/transaction`;
  let params = new HttpParams();
  params = params.set('page', page.toString());
  params = params.set('size', size.toString());
  if (!!sort) {
    params = params.set('sort', sort);
  }
  if (transactionType !== null && transactionType !== '') {
    params = params.set('transactionType', transactionType);
  }
  return { path, params };
};
export const getOtherIssueRequestsHistoryByPaginationEndpointUrl = (
  page: number,
  size: number,
  sort: string,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/request`;
  let params = new HttpParams();
  params = params.set('page', page.toString());
  params = params.set('size', size.toString());
  if (transactionType !== null && transactionType !== '') {
    params = params.set('requestType', transactionType);
  }
  if (!!sort) {
    params = params.set('sort', sort);
  }

  return { path, params };
};

export const getOtherIssueSelectedHistoryEndpointUrl = (
  id: number,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getHistoryUrl() + `/transaction` + `/${id}`;
  let params = new HttpParams();
  if (transactionType !== null && transactionType !== '') {
    params = params.set('transactionType', transactionType);
  }
  return { path, params };
};
export const getOtherIssueRequestSelectedHistoryEndpointUrl = (
  actionType: string,
  id: number,
  requestType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getHistoryUrl() + `/request` + `/${id}`;
  let params = new HttpParams();
  if (actionType !== null && actionType !== '') {
    params = params.set('actionType', actionType);
  }
  if (requestType !== null && requestType !== '') {
    params = params.set('requestType', requestType);
  }
  return { path, params };
};
export const getOtherReceiptIssueHistoryItemsByPaginationEndpointUrl = (
  id: number,
  pageIndex: number,
  pageSize: number,
  sort: string[],
  transactionType
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getHistoryUrl() + `/transaction` + `/${id}/items`;
  let params = new HttpParams();
  params = params.set('page', pageIndex.toString());
  if (pageSize && pageSize !== 0) {
    params = params.set('size', pageSize.toString());
  }
  if (sort !== null) {
    params = params.set('sort', sort.toString());
  }
  if (transactionType !== null && transactionType !== '') {
    params = params.set('transactionType', transactionType);
  }

  return { path, params };
  // Add status
};

export const getOtherIssueRequestsHistoryItemsByPaginationEndpointUrl = (
  actionType: string,
  id: number,
  pageIndex: number,
  pageSize: number,
  sort: string[],
  requestType: string
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getHistoryUrl() + `/request` + `/${id}/items`;
  let params = new HttpParams();
  params = params.set('page', pageIndex.toString());

  if (pageSize && pageSize !== 0) {
    params = params.set('size', pageSize.toString());
  } else {
    params = params.set('size', '');
  }

  if (actionType !== null && actionType !== '') {
    params = params.set('actionType', actionType);
  }
  if (sort !== null) {
    params = params.set('sort', sort.toString());
  }
  if (requestType !== null && requestType !== '') {
    params = params.set('requestType', requestType);
  }

  return { path, params };
  // Add status
};

// /////////
export const getOtherReceiveBySrcDocNoEndpointUrl = (
  srcDocNo,
  type
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherReceiveUrl();

  const params = new HttpParams()
    .set('transactionType', type)
    .set('srcDocNo', srcDocNo);
  return { path, params };
};
////////////////////////CONVERSION///////////////////////////////

const getStockManagementsUrl = (): string => {
  return `/stock-managements`;
};
export const getConversionSearchItemsEndpointUrl = (
  itemCode: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + getStockManagementsUrl() + `/items`;
  let params = new HttpParams();
  params = params.set('itemCode', itemCode);
  return { path, params };
};
export const getConversionReqCountEndpointUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getInventoryBaseUrl() + getStockManagementsUrl() + `/conversion/requests`;
  let params = new HttpParams();
  params = params.set('page', '0');
  params = params.set('size', '1');
  return { path, params };
};
export const getConversionRequestsBySrcDocNoUrl = (
  srcDocNo: number
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getStockManagementsUrl() + `/conversion/requests`;
  let params = new HttpParams();
  if (srcDocNo !== null && srcDocNo !== undefined) {
    params = params.set('srcDocNo', srcDocNo.toString());
  }
  return { path, params };
};

export const getConversionRequestsByIdEndPointUrl = (id: number): string => {
  const path =
    getInventoryBaseUrl() +
    getStockManagementsUrl() +
    `/conversion/requests/${id}`;

  return path;
};

export const getConversionRequestByIdEnpointUrl = (id): string => {
  return getInventoryBaseUrl() + getStockIssueUrl() + `/${id}`;
};
//
export const getConversionRequestDataByIdEnpointUrl = (id): string => {
  return (
    getInventoryBaseUrl() +
    getStockManagementsUrl() +
    `/conversion//requests/${id}` +
    `/items`
  );
};
//
export const getConversionItemsEndpointUrl = (
  loadItemsPayload
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getStockManagementsUrl() + `/conversion/items`;

  const params = new HttpParams()
    .set('itemCode', loadItemsPayload.itemCode)
    .set('lotNumber', loadItemsPayload.lotNumber)
    .set('binCode', loadItemsPayload.binCode)
    .set('itemWeight', loadItemsPayload.itemWeight);
  return { path, params };
};
//
export const getConversionSplitItemEndpointUrl = (): string => {
  return getInventoryBaseUrl() + getStockManagementsUrl() + `/conversion/items`;
};
export const getConversionRequestConfrimEndpointUrl = (id): string => {
  return (
    getInventoryBaseUrl() +
    getStockManagementsUrl() +
    `/conversion/requests/${id}`
  );
};
export const getRequestSentHistoryUrl = (
  pageIndex: number,
  pageSize: number,
  requestType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/history/request`;
  const params = new HttpParams()
    .set('size', pageSize.toString())
    .set('page', pageIndex.toString())
    .set('requestType', requestType);
  return { path, params };
};
export const getConvertedTransactionHistoryUrl = (
  pageIndex: number,
  pageSize: number,
  transactionType: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/history/transaction`;
  const params = new HttpParams()
    .set('size', pageSize.toString())
    .set('page', pageIndex.toString())
    .set('transactionType', transactionType);
  return { path, params };
};
export const getSelectedRequestSentHistoryUrl = (
  reqDocNo: number
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/history/request/${reqDocNo}`;
  const params = new HttpParams()
    .set('actionType', 'ISSUE')
    .set('requestType', 'CONV');
  return { path, params };
};
export const getSelectedConvertedTransactionHistoryUrl = (
  reqDocNo: number
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/history/transaction/${reqDocNo}`;
  const params = new HttpParams().set('transactionType', 'CONV');
  return { path, params };
};
export const getRequestSentHistoryItemsUrl = (
  id: number,
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/history/request/${id}/items`;
  const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('requestType', 'CONV')
    .set('actionType', 'ISSUE');
  return { path, params };
};
export const getConvertedTransactionHistoryItemsUrl = (
  id: number,
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/history/transaction/${id}/items`;
  const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('transactionType', 'CONV');
  return { path, params };
};
export const getConversionRequestEndpointUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + `/other-requests/items`;
  const params = new HttpParams().set('requestType', 'CONV');
  return { path, params };
};
//
export const getConversionRequestsEndpointUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + getStockManagementsUrl() + `/conversion/requests`;
  let params = new HttpParams();
  if (pageIndex !== null && pageIndex !== undefined) {
    params = params.set('page', pageIndex.toString());
  }

  if (pageSize !== null && pageSize !== undefined) {
    params = params.set('size', pageSize.toString());
  }
  return { path, params };
};
export const getRsoDetailsEndpointUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getUsersBaseUrl() + `/store/user`;
  const params = new HttpParams().set('isActive', 'true');
  return { path, params };
};

export const getRequestByIdEndpointUrl = (
  id,
  type
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/${id}`;
  const params = new HttpParams().set('requestType', type);
  return { path, params };
};

// Conversion Approvals
export const getUpdateApprovalRequestStatusEndpointUrl = (
  id: number,
  type: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/${id}`;
  const params = new HttpParams().set('requestType', type);
  return { path, params };
};
export const getRequestItemsByIdEndpointUrl = (
  id: number,
  type: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/${id}/items`;
  const params = new HttpParams().set('requestType', type);
  return { path, params };
};
export const getConversionApprovalRequestsEndpointUrl = (
  requestPayload: ConversionApprovalRequestsListingPayload
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals`;

  let params = new HttpParams()
    .set('requestType', 'CONV')
    .set('status', requestPayload.status);
  // .set('page', requestPayload.pageNumber.toString())
  // .set('size', requestPayload.pageSize.toString());

  if (requestPayload?.reqDocNo) {
    params = params.append('reqDocNo', requestPayload.reqDocNo.toString());
  }
  if (requestPayload?.locationCode) {
    params = params.append(
      'reqLocationCode',
      requestPayload.locationCode.toString()
    );
  }
  if (requestPayload?.pageNumber) {
    params = params.append('page', requestPayload.pageNumber.toString());
  }
  if (requestPayload?.pageSize) {
    params = params.append('size', requestPayload.pageSize.toString());
  }

  return { path, params };
};

export const getCancelRequestByIdEndpointUrl = (
  id,
  type
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + `/approvals/transfer/${id}`;
  const params = new HttpParams().set('transferType', type);
  return { path, params };
};
export const getAdjustmentApprovalsCountUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + `/approvals`;
  const params = new HttpParams()
    .set('requestType', 'ADJ')
    .set('status', 'APVL_PENDING');
  return { path, params };
};

export const getLossApprovalsCountUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + `/approvals`;
  const params = new HttpParams()
    .set('requestType', 'LOSS')
    .set('status', 'APVL_PENDING');
  return { path, params };
};

export const getLoanApprovalsCountUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + `/approvals`;
  const params = new HttpParams()
    .set('requestType', 'LOAN')
    .set('status', 'APVL_PENDING');
  return { path, params };
};

export const getPsvApprovalsCountUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + `/approvals`;
  const params = new HttpParams()
    .set('requestType', 'PSV')
    .set('status', 'APVL_PENDING');
  return { path, params };
};

export const getExhibitionApprovalsCountUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + `/approvals`;
  const params = new HttpParams()
    .set('requestType', 'EXH')
    .set('status', 'APVL_PENDING');
  return { path, params };
};

export const getFocApprovalsCountUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getInventoryBaseUrl() + `/approvals`;
  const params = new HttpParams()
    .set('requestType', 'FOC')
    .set('status', 'APVL_PENDING');
  return { path, params };
};

export const getPrintOtherIssuesEndpointUrl = (
  id: number,
  reqtype: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherIssuesUrl() + `/${id}/prints`;
  const params = new HttpParams().set('otherIssueType', reqtype);
  return { path, params };
};

export const getPrintOtherReceivesEndpointUrl = (
  id: number,
  reqtype: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + getOtherReceiveUrl() + `/${id}/prints`;
  const params = new HttpParams().set('otherReciveType', reqtype);
  return { path, params };
};

/**
 * file upload urls
 */

export const getFIRFileUploadUrl = (): string => {
  return getFileUploadUrl() + `?fileGroup=FIR`;
};

export const getMERFileUploadUrl = (): string => {
  return getFileUploadUrl() + `?fileGroup=MER`;
};

export const getSTNJobTriggerUrl = (): string => {
  return `/integration/v2/scheduler?schedulerCode=FILE_STN_JOB`;
};

export const getInvoiceJobTriggerUrl = (): string => {
  return `/integration/v2/scheduler?schedulerCode=FILE_INVOICE_JOB`;
};

// 27012020
export const getCopyLocationUrl = (
  sourceLocationCode: string,
  destinationLocationCode: string
): { path: string; params: HttpParams } => {
  const path =
    getLocationBaseUrl() + '/locations/' + `${sourceLocationCode}` + '/clone';
  const params = new HttpParams().set(
    'dstLocationCode',
    destinationLocationCode
  );
  return { path, params };
};

export const getLocationListUrl = (
  page,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/locations';
  const params = new HttpParams().set('page', page).set('size', pageSize);
  return { path, params };
};

export const getLocationSettingsUrl = (): string => {
  return getEngineBaseUrl() + '/locations/details';
};

export const getPostLocationDetailsUrl = (
  page,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/locations/filter';
  const params = new HttpParams().set('page', page).set('size', pageSize);
  return { path, params };
};

export const getLocationRegionUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getLocationBaseUrl() + '/regions';
  const params = new HttpParams().set('isPageable', 'false');
  return { path, params };
};

export const getLocationAllRegionUrl = (
  parentRegionCode?: string
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/regions';
  let params = new HttpParams()
    .set('isActive', 'true')
    .set('isPageable', 'false');
  if (parentRegionCode) {
    params = params.set('parentRegionCode', parentRegionCode);
  }
  return { path, params };
};

export const getBrandUrl = (
  parentBrandCode?: string
): { path: string; params: HttpParams } => {
  const path = getProductBaseUrl() + '/brands';
  const params = new HttpParams()
    .set('isActive', 'true')
    .set('isPageable', 'false');
  return { path, params };
};

// export const getBaseCurrencyUrl = (): string => {
//   return getLocationBaseUrl() + '/countries';
// };

// export const UpdateConversionConfigUrl = (configId: string): string => {
//   return configurationBaseUrl() + `config-types/CONVERSIONS/configs`;
// };
