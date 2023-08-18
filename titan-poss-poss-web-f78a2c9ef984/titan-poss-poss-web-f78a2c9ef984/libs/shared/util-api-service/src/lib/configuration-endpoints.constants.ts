import {
  getEngineBaseUrl,
  getLocationBaseUrl,
  getSalesBaseUrl
} from './master-endpoints.constants';
import {
  SortItem,
  GVExtendValidity,
  GVStatusChange,
  GVStatusListingPayload,
  GSTMappingFilter,
  TEPExceptionConfigFilter,
  DiscountBestDealListPayload,
  ProductGroup,
  LoadResidualToleranceByConfigidPayload,
  AbToleranceConfigDetailsReqPayload,
  DiscountExcludeConfigTabEnum
} from '@poss-web/shared/models';
import { HttpParams } from '@angular/common/http';
import { workFlowBaseUrl } from './request-approvals.endpoints';

export const configurationBaseUrl = (): string => {
  return '/config/v2/';
};
export const productBaseUrl = (): string => {
  return '/product/v2/';
};
export const ruleTypesBaseUrl = (): string => {
  return 'rule-types';
};
export const paymentCategoriesBaseUrl = (): string => {
  return 'payment-categories';
};
export const paymentBaseUrl = (): string => {
  return '/payment/v2/';
};
export const engineBaseUrl = (): string => {
  return '/engine/v2/';
};
export const fileBaseUrl = (): string => {
  return '/file/v2/';
};
export const integrationBaseUrl = (): string => {
  return '/integration/v2/';
};
export const locationBaseUrl = (): string => {
  return '/location/v2/';
};
export const exchangeBaseUrl = (): string => {
  return 'exchange-configs';
};
export const focBaseUrl = (): string => {
  return 'foc-schemes';
};
export const discountsBaseUrl = (): string => {
  return 'discounts';
};
export const getPaymentcategoriesPathConst = (): string => {
  return 'payment-categories';
};
export const getStatetaxesPathConst = (): string => {
  return '/state-taxes';
};
export const getTaxesPathConst = (): string => {
  return '/taxes';
};
export const getStatesPath2Const = (): string => {
  return '/states';
};
export const getTaxclassesPathConst = (): string => {
  return '/tax-classes';
};
export const getConfigPaymentBaseUrl = (): string => {
  return `/payment/v2`;
};
export const getGlBoutiqueLocationConst = (): string => {
  return '/gl-boutique-codes';
};
export const rangeBaseUrl = (): string => {
  return 'ranges';
};
export const liteDateBaseUrl = (): string => {
  return '/lite-data';
};

export const getConfigurationListUrl = (
  pageIndex?,
  pageSize?
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'rule-types/' + 'details';
  const params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('sort', 'ruleIdDao.ruleId,desc');
  return { path, params };
};

export const getSearchConfigByConfigNameUrl = (ruleType?): string => {
  return configurationBaseUrl() + 'rule-types/' + 'details';
};

export const getUniqueConfigByConfigNameUrl = (
  ruleType?
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'rule-types/' + 'details';
  const params = new HttpParams().set('isExactSearch', 'true');
  return { path, params };
};

export const getActiveConfigUrl = (ruleType: string): string => {
  return (
    configurationBaseUrl() + 'rule-types/' + `${ruleType}` + '/rules/locations'
  );
};

export const getRuleTypeActiveConfigUrl = (
  ruleType: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams();
  return {
    path:
      configurationBaseUrl() +
      'rule-types/' +
      `${ruleType}` +
      '/rules/locations',
    params
  };
};

export const getPaymentActiveConfigsUrl = (
  configType: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('configType', configType);
  return {
    path: paymentConfigurationBaseUrl() + paymentConfigConst() + '/locations',
    params
  };
};

export const getPayerBankActiveConfigsUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams();
  return {
    path:
      paymentConfigurationBaseUrl() + '/payer-bank-configs/configs/locations',
    params
  };
};

export const getExchangeActiveConfigsUrl = (
  configType: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('configType', configType);
  return {
    path: configurationBaseUrl() + 'exchange-configs' + '/locations',
    params
  };
};

export const getSaveConfigurationUrl = (ruleType: string): string => {
  return configurationBaseUrl() + 'rule-types/' + `${ruleType}` + '/rules';
};

export const getProductGroupMappingGetRulesUrl = (
  pageIndex,
  pageSize,
  ruleId: string,
  productGroupCode: string,
  ruleType: string,
  isPageable = true,
  sort?: string[]
): { path: string; params: HttpParams } => {
  let params = new HttpParams().set('size', pageSize).set('page', pageIndex);
  if (pageIndex === undefined && pageSize === undefined) {
    params = new HttpParams().set('productGroupCode', productGroupCode);
  } else {
    params = new HttpParams().set('size', pageSize).set('page', pageIndex);
  }
  if (isPageable === false) {
    params = new HttpParams().set('isPageable', 'false');
  }
  if (sort !== undefined && sort?.length > 0) {
    for (const element of sort) {
      params = params.append('sort', element);
    }
  }
  return {
    path:
      configurationBaseUrl() +
      'rule-types/' +
      `${ruleType}` +
      '/rules/' +
      `${ruleId}` +
      '/' +
      'products',
    params: params
  };
};
export const getProductGroupMappingRulesUrl = (
  ruleId: string,
  ruleType: string
): string => {
  return (
    configurationBaseUrl() +
    'rule-types/' +
    `${ruleType}` +
    '/rules/' +
    `${ruleId}` +
    '/' +
    'products'
  );
};

export const getProductGroupsByProductIdUrl = (
  productId: string,
  ruleId: string,
  ruleType: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    'rule-types/' +
    `${ruleType}` +
    '/rules/' +
    `${ruleId}` +
    '/' +
    'rivaah';

  let params = new HttpParams().set('productId', productId);
  return { path, params };
};

export const getProductGroupsByProductIdUpdateUrl = (
  productId: string,
  ruleId: string,
  ruleType: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    'rule-types/' +
    `${ruleType}` +
    '/rules/' +
    `${ruleId}` +
    '/' +
    'rivaah';

  let params = new HttpParams().set('productId', productId);
  return { path, params };
};

export const getRivaahEligibilityRulesUrl = (
  ruleId: string,
  ruleType: string,
  isPageable?,
  productCategoryCode?: string,
  productGroupCode?: string,
  pageIndex?: number,
  pageSize?: number
): { path: string; params: HttpParams } => {
  let params = new HttpParams().set('isPageable', isPageable.toString());
  if (productCategoryCode) {
    params = params.set('productCategoryCode', productCategoryCode);
  }
  if (productGroupCode) {
    params = params.set('productGroupCode', productGroupCode);
  }
  if (pageSize && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  return {
    path:
      configurationBaseUrl() +
      'rule-types/' +
      `${ruleType}` +
      '/rules/' +
      `${ruleId}` +
      '/' +
      'products',
    params: params
  };
};

export const getRivaahMappedLocationsUrl = (
  ruleId: string,
  ruleType: string,
  isPageable,
  pageIndex?: number,
  pageSize?: number
): { path: string; params: HttpParams } => {
  console.log(pageIndex, pageSize);

  const path =
    configurationBaseUrl() +
    'rule-types/' +
    `${ruleType}` +
    '/rules/' +
    `${ruleId}` +
    '/rivaah';

  let params = new HttpParams().set('isPageable', isPageable.toString());
  if (pageSize && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  return { path, params };
};

export const saveRivaahLocationsUrl = (
  ruleId: string,
  ruleType: string
): string => {
  return (
    configurationBaseUrl() +
    'rule-types/' +
    `${ruleType}` +
    '/rules/' +
    `${ruleId}` +
    '/locations'
  );
};

export const getRivaahAllLocationsUrl = (
  ruleId: string,
  ruleType: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    'rule-types/' +
    `${ruleType}` +
    '/rules/' +
    `${ruleId}` +
    '/locations';

  let params = new HttpParams();

  return { path, params };
};

export const getUpdateConfigurationUrl = (
  ruleId: string,
  ruleType: string
): string => {
  return (
    configurationBaseUrl() +
    'rule-types/' +
    `${ruleType}` +
    '/rules/' +
    `${ruleId}`
  );
};
export const getUpdateConfigFiledValueUrl = (
  ruleId: string,
  ruleType: string
): string => {
  return (
    configurationBaseUrl() +
    'rule-types/' +
    `${ruleType}` +
    '/rules/' +
    `${ruleId}`
  );
};
export const getLocationMappingDetailsUrl = (
  ruleId: string,
  ruleType: string
): string => {
  return (
    configurationBaseUrl() +
    'rule-types/' +
    `${ruleType}` +
    '/rules/' +
    `${ruleId}` +
    '/locations'
  );
};
export const getSaveConfigFiledValueUrl = (ruleType: string): string => {
  return configurationBaseUrl() + 'rule-types/' + `${ruleType}` + '/rules/';
};

export const getWeightRangeUrl = (): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'ranges';
  const params = new HttpParams()
    .set('rangeType', 'WEIGHT_TOLERANCE')
    .set('isActive', 'true');

  return { path, params };
};

export const getTepDurationUrl = (): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'ranges';
  const params = new HttpParams()
    .set('rangeType', 'TEP_DURATION_DAYS')
    .set('isActive', '' + true);
  return { path, params };
};

export const getResidualWeightRangeUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'ranges';
  let params = new HttpParams();
  params = params.set('rangeType', 'ORDER_RESIDUAL_WEIGHT');
  params = params.set('isPageable', 'false');
  params = params.set('isActive', 'true');
  params = params.set('sort', 'fromRange,asc');
  return { path, params };
};
export const getAbToleranceConfigWeightRangeUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'ranges';
  let params = new HttpParams();
  params = params.set('isPageable', 'false');
  params = params.set('isActive', 'true');
  params = params.set('rangeType', 'ORDER_TOTAL_WEIGHT');
  params = params.set('sort', 'fromRange,asc');
  return { path, params };
};

export const getCoToleranceConfigWeightRangeUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'ranges';
  let params = new HttpParams();
  params = params.set('isPageable', 'false');
  params = params.set('isActive', 'true');
  params = params.set('rangeType', 'ORDER_TOTAL_WEIGHT');
  params = params.set('sort', 'fromRange,asc');
  return { path, params };
};

export const getBgrToleranceConfigWeightRangeUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'ranges';
  let params = new HttpParams();
  params = params.set('isActive', 'true');
  params = params.set('isPageable', 'false');
  params = params.set('rangeType', 'BGR_WEIGHT_TOLERANCE');
  return { path, params };
};

export const getCreditNoteTypeUrl = (): string => {
  return engineBaseUrl() + 'payments/credit-note-types';
};

export const getCutPieceTotListUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'exchange-configs';
  const params = new HttpParams().set('configType', 'TEP_CUT_PIECE_TOT');
  return { path, params };
};

export const getCutPieceTotDetailsUrl = (
  configId: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'exchange-configs/' + configId;
  const params = new HttpParams().set('configType', 'TEP_CUT_PIECE_TOT');
  return { path, params };
};

export const getCashPaymentConfigurationUrl = (ruleId: number): string => {
  return (
    configurationBaseUrl() + `rule-types/CASH_CONFIGURATION/rules/${ruleId}`
  );
};

export const getAddNewCashPaymentConfigurationUrl = (): string => {
  return configurationBaseUrl() + `rule-types/CASH_CONFIGURATION/rules`;
};

export const CreateConversionConfigByIdUrl = (configId: number): string => {
  return (
    configurationBaseUrl() +
    ruleTypesBaseUrl() +
    `/CONVERSIONS/rules/${configId}`
  );
};
export const ConversionConfigValuesByIdUrl = (configId): string => {
  return (
    configurationBaseUrl() +
    ruleTypesBaseUrl() +
    `/CONVERSIONS/rules/${configId}/products`
  );
};
export const ProductGroupsUrl = (): { path: string; params: HttpParams } => {
  const path = productBaseUrl() + `product-groups`;
  let params = new HttpParams();
  params = params.set('isPageable', 'false');
  params = params.set('isActive', 'true');

  // params = params.set('page', '0');
  // params = params.set('size', '20');
  // params = params.set('isActive', '' + true);
  return { path: path, params: params };
};
export const ProductCategoryUrl = (): { path: string; params: HttpParams } => {
  const path = productBaseUrl() + `product-categories`;
  let params = new HttpParams();
  params = params.set('isPageable', 'false');
  params = params.set('isActive', 'true');

  // params = params.set('page', '0');
  // params = params.set('size', '20');
  // params = params.set('isActive', '' + true);
  return { path: path, params: params };
};
export const filterUrl = (): string => {
  return configurationBaseUrl() + ruleTypesBaseUrl() + `/details`;
};
export const CreateconversionConfigUrl = (): string => {
  return configurationBaseUrl() + ruleTypesBaseUrl() + `/CONVERSIONS/rules`;
};
export const getLocationUrl = (configId): string => {
  return (
    configurationBaseUrl() +
    ruleTypesBaseUrl() +
    `/CONVERSIONS/rules/${configId}/locations`
  );
};
export const getConversionConfigSelectedLocationsUrl = (
  configId: number
): string => {
  return (
    configurationBaseUrl() +
    ruleTypesBaseUrl() +
    `/CONVERSIONS/rules/${configId}/locations`
  );
};
export const ConversionConfigValuesUrl = (id: string): string => {
  return (
    configurationBaseUrl() + `rule-types/CONVERSIONS/rules/${id}/productgroups`
  );
};

//payment configuration
export const paymentConfigurationBaseUrl = (): string => {
  return '/payment/v2';
};
export const paymentConfigConst = (): string => {
  return '/payment-configs';
};

export const getPaymentConfigurationListUrl = (
  pageIndex,
  pageSize,
  configType: string,
  description?: string
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + paymentConfigConst();
  let params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('configType', configType)
    .set('sort', 'createdDate,Desc');
  if (description) params = params.append('description', description);
  return { path, params };
};

export const getSearchPaymenConfigurationListUrl = (
  paymentName: string,
  configType: string
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + paymentConfigConst();
  const params = new HttpParams()
    .set('description', paymentName)
    .set('configType', configType);
  return {
    path,
    params
  };
};
export const getPaymentModeListUrl = (
  size
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + '/payment-codes';
  const params = new HttpParams().set('size', size).set('isActive', '' + true);
  return {
    path,
    params
  };
};

export const getPaymentModeCountUrl = (): string => {
  return paymentConfigurationBaseUrl() + '/payment-codes';
};
export const getTransactionTypesUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams()
    .set('isTrue', 'true')
    .set('searchType', 'PAYMENT_MAPPING')
    .set('isPageable', 'false');

  return {
    path: paymentConfigurationBaseUrl() + '/lite-data/transaction-types',
    params: params
  };
};
export const getSavePaymentConfigurationUrl = (): string => {
  return paymentConfigurationBaseUrl() + paymentConfigConst();
};
export const getUpdatePaymentConfigurationDetailUrl = (
  configId: string,
  paymentName?: string
): string => {
  return (
    paymentConfigurationBaseUrl() +
    paymentConfigConst() +
    '/' +
    `${configId}` +
    '/details'
  );
};

export const getSelectedTransactionCodeUrl = (
  configId: string,
  paymentName?: string
): { path: string; params: HttpParams } => {
  let params = new HttpParams();
  const path =
    paymentConfigurationBaseUrl() +
    paymentConfigConst() +
    '/' +
    `${configId}` +
    '/details';
  if (paymentName) {
    params = params.set('paymentCodes', paymentName);
  }
  return { path: path, params: params };
};
export const getUpdateUrl = (configId: string): string => {
  return (
    paymentConfigurationBaseUrl() +
    paymentConfigConst() +
    '/' +
    `${configId}` +
    '/details'
  );
};
export const getMappedCountUrl = (configId: string): string => {
  return (
    paymentConfigurationBaseUrl() +
    paymentConfigConst() +
    '/' +
    `${configId}` +
    '/count'
  );
};
export const getUpdatePaymentConfigurationUrl = (
  configId,
  isActive
): { path: string; params: HttpParams } => {
  const path =
    paymentConfigurationBaseUrl() + paymentConfigConst() + '/' + `${configId}`;
  const params = new HttpParams().set('isActive', isActive);
  return { path, params };
};
export const getLoadPaymentConfigurationUrl = (configId: string): string => {
  return (
    paymentConfigurationBaseUrl() + paymentConfigConst() + '/' + `${configId}`
  );
};

export const getPaymentConfigLocationMappingUrlByIdUrl = (
  configId: string,
  configType: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('config-type', configType);
  return {
    path:
      paymentConfigurationBaseUrl() +
      paymentConfigConst() +
      '/' +
      `${configId}` +
      '/locations',
    params
  };
};

export const getMappedLocationByConfigIdUrl = (
  ruleId: string,
  ruleType: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams();

  return {
    path:
      configurationBaseUrl() +
      'rule-types/' +
      `${ruleType}` +
      '/rules/' +
      `${ruleId}` +
      '/locations',
    params
  };
};

export const getExchangeConfigByIdUrl = (
  configId: string,
  configType: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams().set('configType', configType);

  return {
    path:
      configurationBaseUrl() + 'exchange-configs' + `/${configId}/locations`,
    params
  };
};

export const getPayerBankConfigByIdUrl = (
  configId: string
): {
  path: string;
  params: HttpParams;
} => {
  const params = new HttpParams();

  return {
    path:
      paymentConfigurationBaseUrl() +
      `/payer-bank-configs/${configId}/locations`,
    params
  };
};

export const getPaymentHostsUploadUrl = (): string => {
  return paymentConfigurationBaseUrl() + '/hostnames';
};
export const getPaymentHostnameUrl = (
  pageIndex?,
  pageSize?,
  type?,
  sortField?: SortItem,
  locationCode?: string
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + '/hostnames';
  let sort = 'createdDate,Desc';
  if (sortField) {
    sort = sortField.colId + ',' + sortField.sort;
  }
  let params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('paymentCode', type)
    .set('sort', sort);

  if (locationCode) {
    params = params.set('locationCode', locationCode);
  }
  return { path, params };
};

export const getEmpLoanConfigUrl = (
  pageIndex?,
  pageSize?,
  sortField?: SortItem
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + '/employee-loan';
  let sort = 'createdDate,Desc';
  if (sortField) {
    sort = sortField.colId + ',' + sortField.sort;
  }
  let params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('sort', sort);
  return { path, params };
};

export const getDeleteEmpLoanConfigUrl = (
  id: string
): { path: string; params: HttpParams } => {
  const path =
    paymentConfigurationBaseUrl() + '/employee-loan/delete-loan-details';

  let params = new HttpParams().set('employeeId', id);
  return { path, params };
};
export const updatePaymentHostnameUrl = (type?): string => {
  return paymentConfigurationBaseUrl() + '/hostnames';
};

export const getGVStatusUpdateUrl = (
  payload: GVStatusListingPayload,
  sortField?: SortItem
): { path: string; params: HttpParams } => {
  const sort = 'lastModifiedDate,Desc';

  // if (sortField) {
  //   sort = sortField.colId + ',' + sortField.sort;
  // }

  const path = paymentBaseUrl() + 'gift-vouchers';

  if (payload.serialNo && payload.serialNo.length > 0) {
    const params = new HttpParams()
      .set('page', payload.pageIndex.toString())
      .set('sort', sort)
      .set('size', payload.pageSize.toString())
      .set('serialNo', payload.serialNo)
      .set('giftVoucherStatus', payload.status);

    return { path, params };
  } else {
    const params = new HttpParams()
      .set('page', payload.pageIndex.toString())
      .set('sort', sort)
      .set('size', payload.pageSize.toString())
      .set('giftVoucherStatus', payload.status);

    return { path, params };
  }
};

export const getGVExtendValidityUrl = (
  payload: GVExtendValidity
): { path: string; body: Object } => {
  return {
    path: paymentBaseUrl() + 'gift-vouchers' + '/validity',
    body: payload
  };
};

export const getGVStatusChangeUrl = (
  payload: GVStatusChange
): { path: string; body: Object } => {
  return {
    path: paymentBaseUrl() + 'gift-vouchers' + '/status',
    body: payload
  };
};

export const saveEncircleProductGroups = (
  paymentCategoryName: string
): string => {
  return (
    paymentBaseUrl() +
    paymentCategoriesBaseUrl() +
    `/${paymentCategoryName}/product-groups`
  );
};
export const loadEncircleMappings = (
  paymentCategoryName: string,
  pageIndex: number,
  pageSize: number,
  productGroupCode?: string
): { path: string; params: HttpParams } => {
  const path =
    paymentBaseUrl() +
    paymentCategoriesBaseUrl() +
    `/${paymentCategoryName}/product-groups`;
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString());
  if (productGroupCode) params = params.set('productGroup', productGroupCode);
  return { path: path, params: params };
};
export const searchProductGroupCode = (
  productGroupCode: string
): { path: string; params: HttpParams } => {
  const path =
    paymentBaseUrl() + paymentCategoriesBaseUrl() + `/Encircle/product-groups`;
  const params = new HttpParams().set('productGroup', productGroupCode);
  return { path: path, params: params };
};

export const getPayerBankListingUrl = (
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + `/payer-bank-configs`;
  const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', 'createdDate,desc');
  return { path: path, params: params };
};
export const savePayerBankConfigUrl = (): string => {
  return paymentConfigurationBaseUrl() + `/payer-bank-configs`;
};
export const updatePayerBankConfigs = (id: string): string => {
  return paymentConfigurationBaseUrl() + '/payer-bank-configs' + `/${id}`;
};
export const getSavePayerBanksUrl = (id: string): string => {
  return (
    paymentConfigurationBaseUrl() + '/payer-bank-configs' + `/${id}/details`
  );
};
export const getUpdatePayerBankConfigUrl = (id: string): string => {
  return paymentConfigurationBaseUrl() + '/payer-bank-configs' + `/${id}`;
};

export const getLoadPayerBanksUrl = (
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + '/payer-banks';
  const params = new HttpParams()
    .set('isActive', 'true')
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString());
  return { path: path, params: params };
};
export const getPayerBankConfigSelectedLocationsUrl = (
  configId: string
): string => {
  return (
    paymentConfigurationBaseUrl() +
    '/payer-bank-configs' +
    `/${configId}/locations`
  );
};
export const getPayerBankSearchUrl = (
  configName: string
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + `/payer-bank-configs`;
  const params = new HttpParams().set('description', configName);
  return { path: path, params: params };
};
export const getSearchPayerBankNameUrl = (
  payerBankName: string
): { path: string; params: HttpParams } => {
  const path = paymentBaseUrl() + `/payer-banks`;
  const params = new HttpParams().set('bankName', payerBankName);
  return { path: path, params: params };
};
//cashback-offer-configuration
export const getSaveBankDetailsUrl = (): string => {
  return paymentConfigurationBaseUrl() + '/cash-back-offers';
};
export const getUpdateBankDetailsUrl = (id: string): string => {
  return paymentConfigurationBaseUrl() + '/cash-back-offers' + '/' + `${id}`;
};
export const getBankDetailsByIdUrl = (id: string): string => {
  return paymentConfigurationBaseUrl() + '/cash-back-offers' + '/' + `${id}`;
};

export const getOfferDetailsByIdUrl = (id: string): string => {
  return (
    paymentConfigurationBaseUrl() +
    '/cash-back-offers' +
    '/' +
    `${id}` +
    '/offer-details'
  );
};

export const getUpdateCardDetailsUrl = (id: string): string => {
  return (
    paymentConfigurationBaseUrl() +
    '/cash-back-offers' +
    '/' +
    `${id}` +
    '/card-details'
  );
};
export const getCardDetailsUrl = (
  id: string,
  page: string,
  size: string
): { path: string; params: HttpParams } => {
  const path =
    paymentConfigurationBaseUrl() +
    '/cash-back-offers/' +
    `${id}` +
    '/card-details';
  const params = new HttpParams().set('page', page).set('size', size);
  return {
    path,
    params
  };
};
export const getMappedProductGroupByIdUrl = (id: string): string => {
  return (
    paymentConfigurationBaseUrl() +
    '/cash-back-offers' +
    '/' +
    `${id}` +
    '/product-groups'
  );
};
export const getCashBackOfferListWithSearchUrl = (
  pageIndex?,
  pageSize?,
  searchValue?: string
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + '/cash-back-offers';
  const params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('bankName', searchValue);
  return {
    path,
    params
  };
};

export const getCashBackOfferListUrl = (
  pageIndex?,
  pageSize?
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + '/cash-back-offers';
  const params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('sort', 'createdDate,desc');
  return {
    path,
    params
  };
};

export const getloadPayerBankList = (
  isCashBack?: boolean
): {
  path: string;
  params: HttpParams;
} => {
  const path = paymentConfigurationBaseUrl() + '/payer-banks';
  let params = new HttpParams().set('size', '10000');
  if (isCashBack) {
    params = params.append('isCashBack', `${isCashBack}`);
  }
  return {
    path,
    params
  };
};

export const getAllPaymentCategoryListingUrl = (
  page: number,
  size: number,
  searchData: string
): { path: string; params: HttpParams } => {
  const path = paymentBaseUrl() + getPaymentcategoriesPathConst();
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
  if (searchData?.length > 0) {
    params = params.append('paymentCategoryName', searchData);
  }
  return { path, params };
};

export const getPaymentCategoryDetailsUrl = (
  param: string
): { path: string } => {
  return {
    path: paymentBaseUrl() + getPaymentcategoriesPathConst() + `/${param}`
  };
};

export const savePaymentCategoryDetailsUrl = (): { path: string } => {
  return { path: paymentBaseUrl() + getPaymentcategoriesPathConst() };
};

export const getPaymentCategoryMappingUrl = (
  param: string
): { path: string; params: HttpParams } => {
  const path =
    paymentBaseUrl() +
    getPaymentcategoriesPathConst() +
    `/${param}/product-groups`;
  let params = new HttpParams();
  params = params.append('isPageable', 'false');
  return { path, params };
};

export const getStateTaxConfigurationListingUrl = (
  page: number,
  size: number,
  stateName?: string
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + getStatetaxesPathConst();
  let params = new HttpParams();
  if (stateName) {
    params = params.append('stateName', stateName);
  }
  params = params.append('page', page.toString());
  params = params.append('size', size.toString());

  return { path, params };
};

export const getStateTaxConfigurationStateDetailsUrl = (
  configId: string
): { path: string } => {
  return {
    path: getLocationBaseUrl() + getStatetaxesPathConst() + `/${configId}`
  };
};

export const getStateTaxConfigurationTaxDetailsUrl = (
  configId: string
): { path: string } => {
  return {
    path:
      getLocationBaseUrl() +
      getStatetaxesPathConst() +
      `/${configId}` +
      '/taxDetails'
  };
};

export const getAllStateListingUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getLocationBaseUrl() + getStatesPath2Const();
  const params = new HttpParams().set('isPageable', 'false');
  return { path, params };
};

export const getAllTaxClassListingUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getLocationBaseUrl() + getTaxclassesPathConst();
  const params = new HttpParams()
    .set('isActive', 'true')
    .set('isPageable', 'false');
  return { path, params };
};

export const getAllTaxListingUrl = (): { path: string } => {
  return { path: getLocationBaseUrl() + getTaxesPathConst() };
};

export const getStateTaxSaveUrl = (): { path: string } => {
  return { path: getLocationBaseUrl() + getStatetaxesPathConst() };
};
export const getCustomerTransactionConfigListUrl = (
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = paymentBaseUrl() + `payment-configs`;
  const params = new HttpParams()
    .set('configType', 'CUSTOMER_CONFIG')
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', 'createdDate,desc');
  return { path: path, params: params };
};
export const getSearchConfigNameUrl = (
  configName
): { path: string; params: HttpParams } => {
  const path = paymentBaseUrl() + `payment-configs?`;
  const params = new HttpParams()
    .set('configType', 'CUSTOMER_CONFIG')
    .set('description', configName);
  return { path: path, params: params };
};
export const getUpdateConfigStatus = (
  configId: string,
  isActive: boolean
): { path: string; params: HttpParams } => {
  console.log('isActive', isActive);
  const path = paymentBaseUrl() + `payment-configs/${configId}`;
  const params = new HttpParams().set('isActive', '' + isActive);
  return { path: path, params: params };
};

export const getCustomersUrl = (): string => {
  return paymentConfigurationBaseUrl() + '/lovs/CUSTOMER_TYPE';
};
export const getCustomerTransactionConfigUrl = (): string => {
  return paymentConfigurationBaseUrl() + '/payment-configs';
};
export const getCustomerTransactionDetailsUrl = (configId: string): string => {
  return (
    paymentConfigurationBaseUrl() +
    `/payment-configs/${configId}/customer-details`
  );
};
export const getCustomerTranConfigById = (configId: string): string => {
  return paymentConfigurationBaseUrl() + `/payment-configs/${configId}`;
};
export const getCustomerTranConfigValuesById = (configId: string): string => {
  return (
    paymentConfigurationBaseUrl() +
    `/payment-configs/${configId}/customer-details`
  );
};
export const getTranTypesUrl = (
  type: string
): { path: string; params: HttpParams } => {
  const path =
    getConfigPaymentBaseUrl() + liteDateBaseUrl() + `/transaction-types`;
  let params = new HttpParams();
  params = params.set('isPageable', 'false');
  params = params.set('isTrue', 'true');
  params = params.set('searchType', type);
  return { path: path, params: params };
};
export const getsavedLocationsUrl = (configId: string): string => {
  return (
    paymentConfigurationBaseUrl() + `/payment-configs/${configId}/locations`
  );
};
export const getMappedLocationsUrl = (configId: string): string => {
  return (
    paymentConfigurationBaseUrl() +
    `/payment-configs/${configId}/mappedLocations`
  );
};

export const getGenerateBoutiquePasswordForManualBillUrl = (): string => {
  return getLocationBaseUrl() + '/password/manual-bill';
};

export const getGenerateBoutiquePasswordForGoldRateUrl = (): string => {
  return getLocationBaseUrl() + '/password/metal-rates';
};

export const getGenerateCashDepostPasswordUrl = (): string => {
  return getLocationBaseUrl() + '/password/bank-deposits';
};

export const getGepPurityConfigListUrl = (
  pageIndex: number,
  pageSize: number,
  type: string,
  description: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + exchangeBaseUrl();
  let params = new HttpParams();
  params = params.set('page', pageIndex.toString());
  params = params.set('size', pageSize.toString());
  params = params.set('configType', type);
  if (description) params = params.set('description', description);
  params = params.set('sort', 'createdDate,desc');
  return { path: path, params: params };
};
export const getGepPurityConfigSearchUrl = (
  description: string,
  type: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + exchangeBaseUrl();
  const params = new HttpParams()
    .set('configType', type)
    .set('description', description);
  return { path: path, params: params };
};
export const getSaveGEPPurityDetailsUrl = (
  configId: string,
  type: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + exchangeBaseUrl() + `/${configId}`;
  const params = new HttpParams().set('configType', type);
  return { path: path, params: params };
};
export const getMetalTypesUrl = (): { path: string; params: HttpParams } => {
  const path = engineBaseUrl() + `products/item-types`;
  const params = new HttpParams().set('itemGroups', 'metal');
  return { path: path, params: params };
};
// export const getItemTypesUrl = (): string => {
//   return productBaseUrl() + `lovs/GEPITEMTYPE`;
// };
export const getRangesUrl = (
  rangeType: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + `ranges`;
  let params = new HttpParams();
  params = params.set('rangeType', rangeType);
  params = params.set('isActive', 'true');
  params = params.set('isPageable', 'false');
  params = params.set('sort', 'fromRange,asc');
  return { path: path, params: params };
};
export const getExcludeThemeCodesUrl = (
  configId: string,
  type: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    exchangeBaseUrl() +
    `/${configId}/item-theme-mapping`;
  const params = new HttpParams()
    .set('configType', type)
    .set('isTheme', 'true');
  return { path: path, params: params };
};
export const getExcludeItemCodesUrl = (
  configId: string,
  pageIndex: number,
  pageSize: number,
  type: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    exchangeBaseUrl() +
    `/${configId}/item-theme-mapping`;
  const params = new HttpParams()
    .set('configType', type)
    .set('isTheme', 'false')
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', 'createdDate,desc');
  return { path: path, params: params };
};
export const getUploadFileUrl = (
  type: string,
  configId: string
): { path: string; params: HttpParams } => {
  const path = fileBaseUrl() + `file-upload`;
  const params = new HttpParams().set('fileGroup', type).set('param', configId);
  return { path: path, params: params };
};

export const getProductGroupsDeductionUrl = (
  configId: string,
  type: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + exchangeBaseUrl() + `/${configId}/product-mapping`;
  const params = new HttpParams().set('configType', type);
  return { path: path, params: params };
};

export const getGEPConfigUrl = (
  type: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + exchangeBaseUrl();
  const params = new HttpParams().set('configType', type);
  return { path: path, params: params };
};
export const getPurityDetailsUrl = (
  configId: string,
  type: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + exchangeBaseUrl() + `/${configId}/details`;
  const params = new HttpParams().set('configType', type);
  return { path: path, params: params };
};
export const getGepDetailsUrl = (
  configId: string,
  type: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + exchangeBaseUrl() + `/${configId}`;
  const params = new HttpParams().set('configType', type);
  return { path: path, params: params };
};
export const gepProductGroupsDeductionUrl = (
  configId: string,
  pageIndex: number,
  pageSize: number,
  type: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + exchangeBaseUrl() + `/${configId}/product-mapping`;
  const params = new HttpParams()
    .set('page', '0')
    .set('size', '2147483647')
    .set('configType', type)
    .set('sort', 'productGroupCode,asc');
  return { path: path, params: params };
};
export const getSearchProductGroupUrl = (
  configId: string,
  searchValue: string,
  type: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + exchangeBaseUrl() + `/${configId}/product-mapping`;
  const params = new HttpParams()
    .set('configType', type)
    .set('productGroup', searchValue);
  return { path: path, params: params };
};
export const getSaveThemeCodeUrl = (
  configId: string,
  type: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + exchangeBaseUrl() + `/${configId}/theme-mapping`;
  const params = new HttpParams().set('configType', type);
  return { path: path, params: params };
};
export const getGepPurityConfigLocationUrl = (
  configId: string,
  type: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + exchangeBaseUrl() + `/${configId}/locations`;
  const params = new HttpParams();
  params.set('configType', type);
  return { path: path, params: params };
};

export const getExcludeItemCodeSearchUrl = (
  configId: string,
  itemCode: string,
  type: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    exchangeBaseUrl() +
    `/${configId}/item-theme-mapping`;
  const params = new HttpParams()
    .set('configType', type)
    .set('isTheme', 'false')
    .set('itemCode', itemCode);
  return { path: path, params: params };
};
export const getFileUploadCommonUrl = (
  fileGroup: string,
  param?: string
): { path: string; params: HttpParams } => {
  const path = fileBaseUrl() + 'file-upload';
  let params = new HttpParams();
  params = params.set('fileGroup', fileGroup);
  if (param) {
    params = params.set('param', param);
  }
  return { path: path, params: params };
};
export const getFileUrl = (fileGroup: string, params?: string): string => {
  let path;

  path = fileBaseUrl() + 'file-upload?fileGroup=' + `${fileGroup}`;
  if (params) {
    path = path + '&param=' + `${params}`;
  }
  return path;
};

/* export const getFileUploadCommonUrl = (
  fileGroup: string,
  paramsi?: string
): { path: string; params: HttpParams } => {
  const path = fileBaseUrl() + 'file-upload';
  let params = new HttpParams()
    .set('fileGroup', fileGroup);
  if (paramsi) {
    params = params.set('param', paramsi);
  }
  return { path, params };
}; */

export const getGepItemTypesUrl = (itemType: string): string => {
  return engineBaseUrl() + `products/lovs/${itemType}`;
};

export const getVendorListUrl = (
  pageIndex?,
  pageSize?,
  vendorCode?,
  sortField?: SortItem,
  locationCode?: string
): { path: string; params: HttpParams } => {
  const path = integrationBaseUrl() + 'vendor-config/configuration';
  let sort = 'createdDate,Desc';
  if (sortField) {
    sort = sortField.colId + ',' + sortField.sort;
  }
  let params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('vendorCode', vendorCode)
    .set('sort', sort);

  if (locationCode) {
    params = params.set('locationCode', locationCode);
  }

  return { path, params };
};
export const getErrorLogUrl = (
  errorId: string,
  fileGroup: string
): { path: string; params: HttpParams } => {
  const path = fileBaseUrl() + 'error-log';
  const params = new HttpParams()
    .set('fileGroup', fileGroup)
    .set('fileId', errorId);
  return { path, params };
};
export const getGSTMappingListUrl = (
  pageIndex: number,
  pageSize: number,
  filter: GSTMappingFilter
): { path: string; params: HttpParams } => {
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString());

  if (filter.isActive !== null) {
    params = params.set('isActive', '' + filter.isActive);
  }

  if (!!filter.customerTaxType) {
    params = params.set('customerTaxType', filter.customerTaxType);
  }

  if (!!filter.destLocationTaxType) {
    params = params.set('destLocationTaxType', filter.destLocationTaxType);
  }

  if (!!filter.srcLocationTaxType) {
    params = params.set('srcLocationTaxType', filter.srcLocationTaxType);
  }

  if (!!filter.txnType) {
    params = params.set('txnTypeEnum', filter.txnType);
  }

  return { path: getGSTMappingBaseUrl(), params };
};

export const getGSTMappingBaseUrl = (): string => {
  return locationBaseUrl() + `tax-configs`;
};

export const getEditGSTMappingUrl = (configId: string): string => {
  return getGSTMappingBaseUrl() + `/${configId}`;
};
// GL Boutique Location Urls

export const getGlBoutiqueLocationListingUrl = (
  page: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getConfigPaymentBaseUrl() + getGlBoutiqueLocationConst();
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString())
    .set('sort', 'createdDate,desc');
  return { path, params };
};

export const getGlBoutiqueLocationByLocationCodeUrl = (
  locationCode: string
): string => {
  return (
    getConfigPaymentBaseUrl() +
    getGlBoutiqueLocationConst() +
    `/${encodeURIComponent(locationCode)}`
  );
};

export const getGlBoutiqueLocationSaveDetailsUrl = (): string => {
  return getConfigPaymentBaseUrl() + getGlBoutiqueLocationConst();
};
export const getGlBoutiqueLocationEditDetailsUrl = (
  locationCode: string
): string => {
  return (
    getConfigPaymentBaseUrl() +
    getGlBoutiqueLocationConst() +
    `/${locationCode}`
  );
};
//GL Location Payment urls

export const getGlLocationPaymentListingUrl = (
  pageIndex?: number,
  pageSize?: number
  // locationCode?: string
): { url: string; params: HttpParams } => {
  const url =
    getConfigPaymentBaseUrl() + getGlBoutiqueLocationConst() + '/payments';

  let params = new HttpParams();

  // if (locationCode && locationCode.length > 0) {
  //   for (let i = 0; i < locationCode.length; i++) {
  //     params = params.append('locationCode', locationCode[i]);
  //   }
  // }
  if (pageIndex !== null && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
    params = params.append('sort', 'lastModifiedDate,DESC');
  }
  return { url, params };
};

export const getSaveGlLocationPaymentUrl = (): string => {
  return getConfigPaymentBaseUrl() + getGlBoutiqueLocationConst() + '/payments';
};

//FOC SCHEME BASED ENDPOINTS
export const getFocSchemeBasedListUrl = (
  page,
  size,
  searchValue?
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'foc-schemes' + '/list';
  let params = new HttpParams()
    .set('size', size)
    .set('page', page)
    .set('sort', 'createdDate,desc');
  if (searchValue) {
    params = params.set('schemeName', searchValue);
  }
  return { path, params };
};

export const getFocSchemeBasedSearchUrl = (
  schemeName: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'foc-schemes' + '/list';
  const params = new HttpParams().set('schemeName', schemeName);
  return { path, params };
};

export const getFocSchemeBasedConfigByIdGetUrl = (
  id: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'foc-schemes';
  const params = new HttpParams().set('id', id);
  return { path, params };
};
export const getFocSchemeBasedUpdateUrl = (id: string): string => {
  return configurationBaseUrl() + 'foc-schemes/' + `${id}`;
};

export const getFocSchemeBasedSaveUrl = (): string => {
  return configurationBaseUrl() + 'foc-schemes';
};
export const getSaveFocBlockingLocationLevelUrl = (
  schemeId: string
): string => {
  return configurationBaseUrl() + focBaseUrl() + `/${schemeId}/locations`;
};
export const getFocBlockingLocationLevelListUrl = (
  pageIndex: number,
  pageSize: number,
  schemeId: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + focBaseUrl() + `/${schemeId}/locations`;
  const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', 'createdDate,desc');
  return { path: path, params: params };
};
export const getSearchLocationCodeUrl = (
  schemeId: string,
  locationCode: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + focBaseUrl() + `/${schemeId}/locations`;
  const params = new HttpParams().set('locationCode', locationCode);
  return { path: path, params: params };
};

export const getSchemeIdUrl = (
  schemeName: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + focBaseUrl();
  const params = new HttpParams().set('schemeName', schemeName);
  return { path: path, params: params };
};
export const getFocSchemeBasedVariantDetailsByIdUrl = (
  id: string,
  category?: string,
  itemType?: string,
  offerType?: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + 'foc-schemes' + '/' + `${id}` + '/scheme-details';
  const params = new HttpParams()
    .set('category', category)
    .set('itemType', itemType)
    .set('offerType', offerType);
  return { path, params };
};

export const getFocSchemeBasedVariantDetailsPatchUrl = (id: string): string => {
  return (
    configurationBaseUrl() + 'foc-schemes' + '/' + `${id}` + '/scheme-details'
  );
};

export const getLocationByIdUrl = (
  id: string,
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + 'foc-schemes' + '/' + `${id}` + '/locations';
  const params = new HttpParams().set('page', pageIndex).set('size', pageSize);
  return { path, params };
};

export const getUpdateLocationByIdUrl = (id: string): string => {
  return configurationBaseUrl() + 'foc-schemes' + '/' + `${id}` + '/locations';
};

export const getProductGroupsByIdUrl = (
  itemType: string,
  category: string,
  masterId: string,
  schemeDetailsId?: string
): { path: string; params: HttpParams } => {
  console.log(schemeDetailsId);
  const path =
    configurationBaseUrl() + 'foc-schemes' + '/' + `${masterId}` + '/products';
  let params = new HttpParams().set('category', category).set('size', '10000');
  if (schemeDetailsId !== null && schemeDetailsId !== undefined) {
    console.log(schemeDetailsId);
    params = new HttpParams()
      .set('category', category)
      .set('size', '10000')
      .set('schemedetailsId', schemeDetailsId);
  }
  if (itemType !== null && itemType !== undefined) {
    console.log(schemeDetailsId);
    params = new HttpParams()
      .set('category', category)
      .set('size', '10000')
      .set('itemType', itemType);
  }
  return { path, params };
};

export const getProductGroupsByIdUpdateUrl = (
  masterId: string,
  schemeDetailsId?: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + 'foc-schemes' + '/' + `${masterId}` + '/products';

  let params;

  if (schemeDetailsId !== null && schemeDetailsId !== undefined) {
    params = new HttpParams().set('schemedetailsId', schemeDetailsId);
  }
  return { path, params };
};

export const getFocItemCodesUrl = (): string => {
  return productBaseUrl() + 'lite-data/items';
};
export const getSaveFocItemsUrl = (id: string): string => {
  return configurationBaseUrl() + `foc-schemes/${id}/items`;
};
export const getLoadMappedFocItemsUrl = (
  id: string,
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + 'foc-schemes' + `/${id}` + '/' + 'items';
  const params = new HttpParams().set('page', pageIndex).set('size', pageSize);

  return { path, params };
};
export const getFocSearchUrl = (
  configId: string,
  itemCode: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    'foc-schemes' +
    '/' +
    `${configId}` +
    '/' +
    'items';
  const params = new HttpParams().set('itemCode', itemCode);
  return { path, params };
};

export const getFocPublishUrl = (id: string): string => {
  const path =
    configurationBaseUrl() + 'foc-schemes' + '/publish' + '/' + `${id}`;

  return path;
};

export const searchLocationCodeUrl = (
  configId: string,
  locationCode: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    'foc-schemes' +
    '/' +
    `${configId}` +
    '/' +
    'locations';
  const params = new HttpParams().set('locationCode', locationCode);
  return { path, params };
};
export const getClubbedDiscountsUrl = (
  pageIndex: number,
  pageSize: number,
  discountCode?: string
): { path: string; params: HttpParams } => {
  const sort = 'lastModifiedDate,Desc';
  const path = configurationBaseUrl() + discountsBaseUrl() + '/club-discounts';
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', sort);
  if (discountCode) {
    params = params.set('discountCode', discountCode);
  }
  return { path, params };
};

export const getSaveClubbedDiscountsUrl = (): string => {
  return configurationBaseUrl() + discountsBaseUrl() + `/club-discounts`;
};
export const getDiscountsUrl = (
  type?: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + discountsBaseUrl();
  const params = new HttpParams()
    .set('clubbingDiscountType', type)
    .set('isPageable', 'false');
  return { path, params };
};

export const getGrnInterboutiqueConfigUrl = (
  ruleId: number
): { path: string } => {
  return {
    path:
      configurationBaseUrl() + `rule-types/GRN_INTER_OWNER_TYPE/rules/${ruleId}`
  };
};

export const getAddNewGrnInterboutiqueConfigUrl = (): { path: string } => {
  return {
    path: configurationBaseUrl() + `rule-types/GRN_INTER_OWNER_TYPE/rules`
  };
};
export const getCnMasterListUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + `/credit-notes`;
  const params = new HttpParams().set('page', pageIndex).set('size', pageSize);
  return { path, params };
};

export const getSearchCnMasterByCnTypeUrl = (
  cnType: string
): { path: string; params: HttpParams } => {
  const path = paymentConfigurationBaseUrl() + `/credit-notes`;
  const params = new HttpParams().set('creditNoteType', cnType);
  return { path, params };
};

export const getCnMasterDetailByCnTypeUrl = (cnType: string): string => {
  return paymentConfigurationBaseUrl() + `/credit-notes/${cnType}`;
};
export const getLoadRangesUrl = (
  rangeType: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + rangeBaseUrl();
  let params = new HttpParams();
  params = params.set('isPageable', 'false');
  params = params.set('rangeType', rangeType);
  params = params.set('sort', 'fromRange,asc');
  return { path: path, params: params };
};
export const getSaveRangesUrl = (
  rangeType: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + rangeBaseUrl();
  let params = new HttpParams();
  params = params.set('rangeType', rangeType);
  return { path: path, params: params };
};
export const getRangeMappingRulesUrl = (
  ruleId: string,
  ruleType: string
): string => {
  return (
    configurationBaseUrl() +
    'rule-types/' +
    `${ruleType}` +
    '/rules/' +
    `${ruleId}` +
    '/' +
    'ranges'
  );
};

export const getAbToleranceRangeMappingRulesUrl = (
  payload: AbToleranceConfigDetailsReqPayload
): { path: string; params: HttpParams } => {
  let params = new HttpParams()
    .set('size', payload.pageSize.toString())
    .set('page', payload.pageIndex.toString());
  if (payload.sort.length > 0) {
    for (const sort of payload.sort) {
      params = params.append('sort', sort);
    }
  } else {
    params = params.append('sort', 'metalType,asc');
    params = params.append('sort', 'rangeId.fromRange,asc');
  }
  return {
    path:
      configurationBaseUrl() +
      'rule-types/' +
      `${payload.ruleType}` +
      '/rules/' +
      `${payload.configId}` +
      '/' +
      'ranges',
    params: params
  };
};

export const getCoToleranceRangeMappingRulesUrl = (
  payload: AbToleranceConfigDetailsReqPayload
): { path: string; params: HttpParams } => {
  let params = new HttpParams()
    .set('size', payload.pageSize.toString())
    .set('page', payload.pageIndex.toString());
  if (payload.sort.length > 0) {
    for (const sort of payload.sort) {
      params = params.append('sort', sort);
    }
  } else {
    params = params.append('sort', 'metalType,asc');
    params = params.append('sort', 'rangeId.fromRange,asc');
  }
  return {
    path:
      configurationBaseUrl() +
      'rule-types/' +
      `${payload.ruleType}` +
      '/rules/' +
      `${payload.configId}` +
      '/' +
      'ranges',
    params: params
  };
};
export const geResidualRangeMappingRulesUrl = (
  payload: LoadResidualToleranceByConfigidPayload,
  ruleType: string
): { path: string; params: HttpParams } => {
  const params = new HttpParams()
    .set('size', payload.pageSize.toString())
    .set('page', payload.pageIndex.toString())
    .set('sort', 'rangeId.fromRange,asc');
  return {
    path:
      configurationBaseUrl() +
      'rule-types/' +
      `${ruleType}` +
      '/rules/' +
      `${payload.configId}` +
      '/' +
      'ranges',
    params: params
  };
};
export const getTepGlobalConfigListUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'exchange-configs';
  const params = new HttpParams().set('configType', 'TEP_GLOBAL');
  return { path, params };
};

export const updateTepGlobalConfigUrl = (
  configId: string
): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'exchange-configs/' + configId;
  const params = new HttpParams().set('configType', 'TEP_GLOBAL');
  return { path, params };
};

export const getTepStoneConfigListUrl = (
  page: number,
  size: number
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs';
  const params = new HttpParams()
    .set('configType', 'TEP_STONE')
    .set('page', page.toString())
    .set('size', size.toString());
  return { path, params };
};

export const searchTepStoneConfigListUrl = (
  filter: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs';
  let params = new HttpParams().set('configType', 'TEP_STONE');
  params = params.set('description', filter);
  return { path, params };
};

export const searchTepStoneConfigDetalsListUrl = (
  configId: string,
  stoneTypeCode: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + `exchange-configs/${configId}/stones`;
  const params = new HttpParams()
    .set('configType', 'TEP_STONE')
    .set('stoneTypeCode', stoneTypeCode);
  return { path, params };
};

export const getTepStoneConfigDetailsListUrl = (
  configId: string
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    configurationBaseUrl() + 'exchange-configs/' + configId + '/stones';
  const params = new HttpParams().set('configType', 'TEP_STONE');
  return { path, params };
};

export const getTepStoneConfigUrl = (
  configId: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs' + '/' + configId;
  const params = new HttpParams().set('configType', 'TEP_STONE');
  return { path, params };
};

export const getTepStoneConfigSaveUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'exchange-configs';
  const params = new HttpParams().set('configType', 'TEP_STONE');
  return { path, params };
};

export const updateTepStoneConfigDetailsUrl = (
  configId: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + 'exchange-configs' + '/' + configId + '/stones';
  const params = new HttpParams().set('configType', 'TEP_STONE');
  return { path, params };
};

export const getTepExceptionConfigListUrl = (
  page: number,
  size: number
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs';
  const params = new HttpParams()
    .set('configType', 'TEP_EXCEPTION')
    .set('page', page.toString())
    .set('size', size.toString());
  return { path, params };
};

export const searchTepExceptionConfigListUrl = (
  filter: TEPExceptionConfigFilter
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs';
  let params = new HttpParams().set('configType', 'TEP_EXCEPTION');
  if (filter.configName) {
    params = params.set('description', filter.configName);
  }
  if (filter.variantCode) {
    params = params.set('itemCode', filter.variantCode);
  }
  return { path, params };
};

export const getTepExceptionConfigSaveUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'exchange-configs';
  const params = new HttpParams().set('configType', 'TEP_EXCEPTION');
  return { path, params };
};

export const getTepExceptionConfigDetailsUrl = (
  configId: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs' + '/' + configId;
  const params = new HttpParams().set('configType', 'TEP_EXCEPTION');
  return { path, params };
};

export const getTepProductGroupConfigListUrl = (
  page: number,
  size: number,
  description?: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs';
  let params = new HttpParams()
    .set('configType', 'TEP_ITEM')
    .set('page', page.toString())
    .set('size', size.toString());
  if (description) params = params.set('description', description);
  return { path, params };
};

export const searchTepProductGroupConfigListUrl = (
  filter: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs';
  let params = new HttpParams().set('configType', 'TEP_ITEM');
  params = params.set('description', filter);
  return { path, params };
};

export const getTepProductGroupConfigDetailsUrl = (
  configId: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs' + '/' + configId;
  const params = new HttpParams().set('configType', 'TEP_ITEM');
  return { path, params };
};

export const getTepProductGroupConfigSaveUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'exchange-configs';
  const params = new HttpParams().set('configType', 'TEP_ITEM');
  return { path, params };
};

export const getTepProductGroupMappingSaveUrl = (
  configId: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + `exchange-configs/${configId}/product-mapping`;
  const params = new HttpParams().set('configType', 'TEP_ITEM');
  return { path, params };
};

export const getTepProductGroupMappingListUrl = (
  configId: string,
  page: number,
  size: number,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + `exchange-configs/${configId}/product-mapping`;
  let params = new HttpParams()
    .set('configType', 'TEP_ITEM')
    .set('page', '0')
    .set('size', '2147483647');
  if (sort !== undefined && sort?.length > 0) {
    for (const element of sort) {
      params = params.append('sort', element);
    }
  }
  return { path, params };
};

export const searchTepProductGroupMappingListUrl = (
  configId: string,
  productGroup: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + `exchange-configs/${configId}/product-mapping`;
  const params = new HttpParams()
    .set('configType', 'TEP_ITEM')
    .set('productGroup', productGroup);
  return { path, params };
};

export const getTepValidationConfigListUrl = (
  page: number,
  size: number
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs';
  const params = new HttpParams()
    .set('configType', 'TEP_VALIDATION')
    .set('page', page.toString())
    .set('size', size.toString());
  return { path, params };
};

export const searchTepValidationConfigListUrl = (
  filter: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs';
  let params = new HttpParams().set('configType', 'TEP_VALIDATION');
  params = params.set('description', filter);
  return { path, params };
};

export const getTepValidationConfigDetailsUrl = (
  configId: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'exchange-configs' + '/' + configId;
  const params = new HttpParams().set('configType', 'TEP_VALIDATION');
  return { path, params };
};

export const getTepValidationConfigSaveUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + 'exchange-configs';
  const params = new HttpParams().set('configType', 'TEP_VALIDATION');
  return { path, params };
};

export const getDiscountConfigsUrl = (
  pageIndex: number,
  pageSize: number,
  discountCode: string,
  discountType: string,
  status: string,
  publishStatus: string,
  occasion: string
): { path: string; params: HttpParams } => {
  console.log(pageIndex, pageSize, 'in endpoints');
  const path = configurationBaseUrl() + discountsBaseUrl();
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', 'createdDate,DESC');
  if (discountCode) params = params.set('discountCode', discountCode);
  if (discountType) params = params.set('discountType', discountType);
  if (occasion) params = params.set('occasion', occasion);
  if (status) params = params.set('status', status);
  if (publishStatus) params = params.set('publishStatus', publishStatus);
  return { path, params };
};

export const getDiscountDetailsUrl = (
  discountId: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + discountsBaseUrl() + `/${discountId}/details`;
  const params = new HttpParams();

  return { path, params };
};

export const getDiscountComponentPGConfigURl = (
  discountId: string,
  pageIndex?: string,
  pageSize?: string,
  productGroups?: ProductGroup[]
): { path: string; params: HttpParams } => {
  console.log(pageSize, pageSize, 'check');

  const path =
    configurationBaseUrl() + discountsBaseUrl() + `/${discountId}/details`;
  let params = new HttpParams();
  if (pageIndex !== null && pageIndex !== undefined) {
    console.log('in if');

    params = params.set('page', pageIndex.toString());
  }
  if (pageSize !== null && pageSize !== undefined) {
    params = params.set('size', pageSize.toString());
  }
  if (productGroups || productGroups.length) {
    for (let i = 0; i < productGroups.length; i++) {
      params = params.append(
        'productGroupCodes',
        productGroups[i].productGroupCode
      );
    }
  }
  return { path, params };
};

export const getDiscountSlabDetailsUrl = (
  discountId: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + discountsBaseUrl() + `/${discountId}/slabs`;
  const params = new HttpParams();

  return { path, params };
};

export const getDiscountMappedBestDealDiscountUrl = (
  payload: DiscountBestDealListPayload
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    discountsBaseUrl() +
    `/${payload.id}` +
    '/link-discounts';
  const params = new HttpParams()
    .set('page', payload.pageIndex.toString())
    .set('size', payload.pageSize.toString());

  return { path, params };
};

export const getBestDealDiscountUrl = (
  discountType: string,
  isPageable: boolean,
  isActive: boolean
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + discountsBaseUrl();
  let params = new HttpParams().set('discountType', discountType.toString());
  if (isActive) params = params.set('isActive', isActive.toString());
  if (isPageable === false || isPageable === true)
    params = params.append('isPageable', isPageable.toString());
  return { path, params };
};

export const getSaveDiscountDetailsUrl = (): string => {
  return configurationBaseUrl() + discountsBaseUrl();
};
export const getEditDiscountDetailsUrl = (id: string): string => {
  return configurationBaseUrl() + discountsBaseUrl() + `/${id}`;
};

export const getDiscountDetailsByIdUrl = (id: string): string => {
  return configurationBaseUrl() + discountsBaseUrl() + `/${id}`;
};

export const getDiscountMappedLocationsUrl = (
  id: string,
  isPageable,
  pageIndex?: number,
  pageSize?: number,
  offerStartDate?,
  offerEndDate?,
  previewStartDate?,
  previewEndDate?
): { path: string; params: HttpParams } => {
  console.log(pageIndex, pageSize);

  const path =
    configurationBaseUrl() + discountsBaseUrl() + `/${id}` + '/locations';

  let params = new HttpParams().set('isPageable', isPageable.toString());
  if (pageSize && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
    // params = params.append('sort', 'locationCode,ASC');
  }
  // if (offerStartDate && offerEndDate) {
  //   params = params.set('offerStartDate', offerStartDate);
  //   params = params.set('offerEndDate', offerEndDate);
  // }
  // if (previewStartDate && previewEndDate) {
  //   params = params.set('previewStartDate', previewStartDate);
  //   params = params.set('previewEndDate', previewEndDate);
  // }
  return { path, params };
};

export const getDiscountMappedProductCategoriesUrl = (
  id: string,
  isPageable: boolean,
  pageIndex?: number,
  pageSize?: number,
  productCategoryCode?: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    discountsBaseUrl() +
    `/${id}` +
    '/product-categories';

  let params = new HttpParams().set('isPageable', isPageable?.toString());
  if (pageSize && pageSize !== null) {
    params = params.set('page', pageIndex?.toString());
    params = params.set('size', pageSize?.toString());
    params = params.append('sort', 'productCategoryCode,ASC');
  }
  if (productCategoryCode)
    params = params.append('productCategoryCode', productCategoryCode);
  return { path, params };
};
export const getDiscountMappedProductGroupsUrl = (
  id: string,
  isPageable,
  karatType?: string,
  productType?: string,
  pageIndex?: number,
  pageSize?: number,
  productGroupCode?: any
): { path: string; params: HttpParams } => {
  console.log(productGroupCode, karatType, 'in endpoints');

  const path =
    configurationBaseUrl() + discountsBaseUrl() + `/${id}` + '/product-groups';

  let params = new HttpParams().set('isPageable', isPageable.toString());
  if (pageSize && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
    params = params.set('sort', 'productGroupCode,ASC');
  }
  if (productGroupCode) {
    params = params.set('productGroupCodeList', productGroupCode);
  }
  if (productType) {
    params = params.set('productType', productType);
  }
  if (karatType) params = params.set('karatType', karatType);
  console.log(path, 'check path');

  return { path, params };
};
export const getDiscountExcludeConfigsUrl = (
  id: string,
  isPageable: boolean,
  pageIndex?: number,
  pageSize?: number,
  itemCode?: string,
  excludeType?: string,
  sort?: boolean
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    discountsBaseUrl() +
    `/${id}` +
    '/item-theme-mapping';

  let params = new HttpParams();
  if (pageIndex !== null && pageSize && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
    // params = params.append('sort', 'itemCode,ASC');
  }
  if (itemCode) params = params.append('itemCode', itemCode);
  if (excludeType) params = params.append('excludeType', excludeType);
  if (excludeType === DiscountExcludeConfigTabEnum.SCHEME_CODE) {
    params = params.set('sort', 'createdDate,desc');
  } else {
    if (sort) {
      params = params.set('sort', 'fromValue,ASC');
    }
  }

  return { path, params };
};
export const saveDiscountMappedLocationsUrl = (id: string): string => {
  return configurationBaseUrl() + discountsBaseUrl() + `/${id}` + '/locations';
};
export const saveDiscountMappedProductCategoriesUrl = (id: string): string => {
  return (
    configurationBaseUrl() +
    discountsBaseUrl() +
    `/${id}` +
    '/product-categories'
  );
};

export const saveDiscountMappedBestDealDiscountUrl = (id: string): string => {
  return (
    configurationBaseUrl() + discountsBaseUrl() + `/${id}` + `/link-discounts`
  );
};
export const saveDiscountMappedProductGroupsUrl = (
  id: string,
  karatType?: string,
  productType?: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + discountsBaseUrl() + `/${id}` + '/product-groups';
  let params = new HttpParams();
  if (karatType) params = params.set('karatType', karatType);
  if (productType) params = params.set('productType', productType);
  return { path, params };
};

export const getPublishDiscountUrl = (id: string): string => {
  return configurationBaseUrl() + discountsBaseUrl() + `/publish/${id}`;
};

export const saveDiscountExcludeThemesUrl = (
  id: string,
  excludeType: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + discountsBaseUrl() + `/${id}` + '/theme-mapping';

  let params = new HttpParams();
  params = params.set('excludeType', excludeType);
  return { path, params };
};
export const saveDiscountExcludeSchemesUrl = (
  id: string,
  excludeType: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + discountsBaseUrl() + `/${id}` + '/scheme-mapping';

  let params = new HttpParams();
  params = params.set('excludeType', excludeType);
  return { path, params };
};

export const saveDiscountExcludeTyperl = (
  id: string,
  excludeType: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + discountsBaseUrl() + `/${id}` + '/exclude-mapping';

  let params = new HttpParams();
  params = params.set('excludeType', excludeType);
  return { path, params };
};
export const getDiscountTypesUrl = (
  lovType: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + 'lovs' + `/${lovType}`;
  const params = new HttpParams();
  return { path, params };
};
export const getRoleTypeUrl = (): string => {
  return engineBaseUrl() + `users/roles`;
};
export const getRangeTypesUrl = (type: string): string => {
  return configurationBaseUrl() + `lovs/${type}`;
};

export const getCutPieceConfigListUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = configurationBaseUrl() + exchangeBaseUrl();
  let params = new HttpParams();
  params = params.set('configType', 'TEP_CUT_PIECE');
  return { path: path, params: params };
};
export const getProductCategoriesMappingUrl = (
  configId: string
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    configurationBaseUrl() + exchangeBaseUrl() + `/${configId}/product-mapping`;
  let params = new HttpParams();
  params = params.set('configType', 'TEP_CUT_PIECE');
  return { path: path, params: params };
};

export const getDiscountProductGroupsByIdUrl = (
  discountId: string,
  discountDetailsId: string,
  hasPagbelOption: boolean
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() +
    discountsBaseUrl() +
    '/' +
    `${discountId}` +
    '/product-groups';
  let params = new HttpParams().set('discountDetailsId', discountDetailsId);

  if (hasPagbelOption) {
    params = params.set('isPageable', 'false');
  }

  return { path, params };
};

export const getDiscountProductGroupsByIdUpdateUrl = (
  masterId: string,
  schemeDetailsId?: string
): { path: string; params: HttpParams } => {
  const path =
    configurationBaseUrl() + 'foc-schemes' + '/' + `${masterId}` + '/products';

  let params;

  if (schemeDetailsId !== null && schemeDetailsId !== undefined) {
    params = new HttpParams().set('schemedetailsId', schemeDetailsId);
  }
  return { path, params };
};

export const getProductCategoriesMappingListUrl = (
  configId: string,
  pageIndex: number,
  pageSize: number
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    configurationBaseUrl() + exchangeBaseUrl() + `/${configId}/product-mapping`;
  let params = new HttpParams();
  params = params.set('configType', 'TEP_CUT_PIECE');
  params = params.set('page', pageIndex.toString());
  params = params.set('size', pageSize.toString());
  return { path: path, params: params };
};

export const getProductCategorySearchUrl = (
  configId: string,
  searchValue: string
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    configurationBaseUrl() + exchangeBaseUrl() + `/${configId}/product-mapping`;
  let params = new HttpParams();
  params = params.set('configType', 'TEP_CUT_PIECE');
  params = params.set('productCategory', searchValue);
  return { path: path, params: params };
};
export const getSubBrandsLiteDataUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = locationBaseUrl() + 'lite-data' + '/brands';
  let params;
  params = new HttpParams().set('isPageable', false.toString());

  return { path, params };
};

export const getCashPaymentEngineUrl = (ruleType: string): string => {
  const path = engineBaseUrl() + `rule-types/${ruleType}/values`;
  return path;
};

export const getfailedInvoiceUrl = (): string => {
  const path = integrationBaseUrl() + 'jobs/failed-einvoice-irn/list';
  return path;
};

export const getCopiedInvoiceUrl = (): string => {
  const path = getSalesBaseUrl() + '/einvoice/copy_invoice_docs';
  return path;
};

export const triggerFailedInvoiceUrl = (): string => {
  const path = integrationBaseUrl() + 'jobs/einvoice-irn';
  return path;
};

export const getComputeTsssDiscountUrl = (discountId: string): string => {
  const path = configurationBaseUrl() + `discounts/${discountId}/coupons`;
  return path;
};

export const getDiscountWorkflowRequesturl = (
  discountId: string,
  type: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + `discounts/raiseRequest`;
  let params = new HttpParams();
  params = params.set('discountId', discountId);
  params = params.set('typeOfRequest', type);
  return { path: path, params: params };
};

export const getDiscountApprovalRequesturl = (
  discountId: string,
  type: string
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + `discounts/updateRequest`;
  let params = new HttpParams();
  params = params.set('discountId', discountId);
  params = params.set('approvalStatus', type);
  return { path: path, params: params };
};

export const getResendEmailurl = (
  processId: string
): { path: string; params: HttpParams } => {
  const path = workFlowBaseUrl() + `/workflow-task/resendEmail`;
  let params = new HttpParams();
  params = params.set('processId', processId);
  return { path: path, params: params };
};

export const uploadFaqDocUrl = (
  docType,
  fileType
): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + `files/upload`;
  let params = new HttpParams();
  params = params.set('docType', docType);
  params = params.set('fileType', fileType);
  return { path: path, params: params };
};

export const downloadFaqUrl = (data): { path: string; params: HttpParams } => {
  const path = configurationBaseUrl() + `files/${data.fileId}/download`;
  let params = new HttpParams();
  params = params.set('fileName', data.fileName);
  return { path: path, params: params };
};

//cn Direct

export const getSearchCnDirectUrl = (
  cnNumebr?: number,
  fiscalYear?: string,
  locationCode?: string,
  page?: number,
  size?: number
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + '/credit-note' + '/eposs' + '/direct-op';
  let params = new HttpParams();
  params = params.set('page', '' + page);
  params = params.set('size', '' + size);
  if (cnNumebr) {
    params = params.set('docNo', cnNumebr + ' ');
  }
  if (fiscalYear) {
    params = params.set('fiscalYear', fiscalYear);
  }
  if (locationCode) {
    params = params.set('locationCode', locationCode);
  }

  return { path: path, params: params };
};

export const getUploadCnDirectUrl = (
  page?: number,
  size?: number
): { path: string; params: HttpParams } => {
  const path =
    getSalesBaseUrl() + '/credit-note' + '/eposs' + '/direct-op/file';
  let params = new HttpParams();
  params = params.set('page', '' + page);
  params = params.set('size', '' + size);

  return { path: path, params: params };
};

export const getSaveCnActionDirectUrl = (
  cnIds: any,
  operation: string
): { path: string; params: HttpParams } => {
  const path =
    getSalesBaseUrl() + '/credit-note' + '/eposs' + '/direct-op/action';
  let params = new HttpParams();
  params = params.set('cnIds', cnIds);
  params = params.set('operation', operation);

  return { path: path, params: params };
};

export const loadProductMasterUpdateUrl = (
  itemCode: string,
  lotNumber: string
): { path: string; params: HttpParams } => {
  const path = getEngineBaseUrl() + '/products' + '/stones-details';
  let params = new HttpParams();
  params = params.set('itemCode', itemCode);
  params = params.set('lotNumber', lotNumber);

  return { path: path, params: params };
};
