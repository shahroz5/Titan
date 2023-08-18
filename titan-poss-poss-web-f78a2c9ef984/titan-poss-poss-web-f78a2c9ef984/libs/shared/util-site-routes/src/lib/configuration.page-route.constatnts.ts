/**
 * Configuration Routing Urls
 */
export const getConfigurationRouteUrl = (): string => {
  return '/configuration';
};
export const getConfigurationHomeRouteUrl = (): string => {
  return getConfigurationRouteUrl() + `/home`;
};
export const getStockTransferConfigRouteUrl = (): string => {
  return 'stock-transfer';
};
export const getConversionConfigRouteUrl = (): string => {
  return 'conversion';
};

export const getInventoryConfigurationRouteUrl = (): string => {
  return '/inventory-configuration';
};

export const getCustomerTransactionConfigurationRouteUrl = (): string => {
  return '/customer-transaction-configuration';
};

export const getPaymentConfigurationRouteUrl = (): string => {
  return '/payment-configuration';
};

export const getTaxConfigurationRouteUrl = (): string => {
  return '/tax-configuration';
};

export const getOfferConfigurationRouteUrl = (): string => {
  return '/offer-configuration';
};

export const getDiscountConfigurationUrl = (): string => {
  return '/discount-configuration';
};
export const getGepConfigurationUrl = (): string => {
  return '/gep-configuration';
};
export const getFocConfigurationUrl = (): string => {
  return '/foc-configuration';
};
export const getABConfigurationUrl = (): string => {
  return '/ab-configuration';
};
export const getCOConfigurationUrl = (): string => {
  return '/co-configuration';
};
export const getCNConfigurationUrl = (): string => {
  return '/credit-note-configuration';
};
export const getGRNConfigurationUrl = (): string => {
  return '/grn-configuration';
};
export const getBGRConfigurationUrl = (): string => {
  return '/bgr-configuration';
};

export const getGlobalConfigurationRouteUrl = (): string => {
  return '/global-configuration';
};

export const getExchangeConfigurationRouteUrl = (): string => {
  return '/exchange-configuration';
};

export const getGlobalConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getInventoryConfigurationRouteUrl() +
    '/inv-global-config'
  );
};
export const getIBTConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getInventoryConfigurationRouteUrl() +
    '/ibt-config-list'
  );
};

export const getIBTConfigDetailRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getInventoryConfigurationRouteUrl() +
    '/ibt-config' +
    '/' +
    `${configId}`
  );
};
export const getL3InventoryConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getInventoryConfigurationRouteUrl() +
    '/L3-inventory-configuration'
  );
};

export const getConversionConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getInventoryConfigurationRouteUrl() +
    '/conversion-config-list'
  );
};

export const getCPGProductGroupConfigForQCGCRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/cpg-qcgc-map-config-list'
  );
};

export const getDetailsCPGProductGroupConfigForQCGCRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/cpg-qcgc-map-config-details'
  );
};

export const getTepProductGroupConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/tep-product-group-config-list'
  );
};

export const getTepProductGroupConfigDetailsRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/tep-product-group-config-details'
  );
};

export const getTepExchangeConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/tep-exchange-config-list'
  );
};

export const getTepExchangeConfigDetailsRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/tep-exchange-config-details'
  );
};

export const getTepStoneConfigDetailsRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/tep-stone-config-details'
  );
};

export const getCashPaymentConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getPaymentConfigurationRouteUrl() +
    '/cash-payment-config'
  );
};

export const getGrnInterboutiqueConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getGRNConfigurationUrl() +
    '/grn-interboutique-config'
  );
};

export const getPasswordConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getGlobalConfigurationRouteUrl() +
    '/password-config'
  );
};
export const getRangeConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() + getGlobalConfigurationRouteUrl() + '/ranges'
  );
};

export const getAmendmentConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getGlobalConfigurationRouteUrl() +
    '/amendment-config'
  );
};

export const getEmployeeLoanConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getGlobalConfigurationRouteUrl() +
    '/employee-loan-config'
  );
};

export const getStateTaxConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getTaxConfigurationRouteUrl() +
    '/state-tax-config-list'
  );
};

export const getStateTaxConfigurationDetailsRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getTaxConfigurationRouteUrl() +
    '/state-tax-config-details'
  );
};

export const getWeightToleranceListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getInventoryConfigurationRouteUrl() +
    '/weight-tolerance-config-list'
  );
};

export const getWeightToleranceDetailRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getInventoryConfigurationRouteUrl() +
    '/weight-tolerance-config' +
    '/' +
    `${configId}`
  );
};
export const getConversionConfigurationDetailsRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getInventoryConfigurationRouteUrl() +
    `/conversion-config/${configId}`
  );
};

export const getBgrConfigDetailRouteUrl = (configId, ruleType): string => {
  return (
    getConfigurationRouteUrl() +
    getBGRConfigurationUrl() +
    `/bgr-config/${configId}/${ruleType}`
  );
};

export const getWeightValueConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/grf-tolerance-config-list'
  );
};

export const getGRNWeightValueConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getGRNConfigurationUrl() +
    '/grn-tolerance-config/list'
  );
};

export const getWeightValueConfigDetailRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/grf-tolerance-config' +
    '/' +
    `${configId}`
  );
};

export const geGRNWeightValueConfigDetailRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getGRNConfigurationUrl() +
    '/grn-tolerance-config' +
    '/' +
    `${configId}`
  );
};
export const getGVStatusUpdateRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/gv-status-update-list'
  );
};
export const getFOCBCLRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getFocConfigurationUrl() +
    '/foc-blocking-customer-level'
  );
};

export const getDiscountsDashBoardRouteUrl = (): string => {
  // return (
  //   getConfigurationRouteUrl() + getOfferConfigurationRouteUrl() + '/discounts'
  // );
  return getConfigurationRouteUrl() + '/home';
};
export const getDiscountConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getDiscountConfigurationUrl() +
    '/discount/list'
  );
};
export const getDiscountConfigRquestRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getDiscountConfigurationUrl() +
    '/discount/request'
  );
};

export const getDiscountConfigRequestRouteUrl = (
  requestType,
  configId
): string => {
  return (
    getConfigurationRouteUrl() +
    getDiscountConfigurationUrl() +
    `/${requestType}/${configId}`
  );
};
export const getDiscountConfigDetailsViewRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getDiscountConfigurationUrl() +
    '/discount/' +
    `${configId}/view`
  );
};

export const getDiscountConfigRequestViewRouteUrl = (
  tabType,
  configId
): string => {
  return (
    getConfigurationRouteUrl() +
    getDiscountConfigurationUrl() +
    `/${tabType}/` +
    `${configId}/view`
  );
};

export const getPaymentConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/payment-config-list'
  );
};

export const getPaymentConfigDetailRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/payment-config' +
    '/' +
    `${configId}`
  );
};
export const getEncircleProdcutGroupMappingRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/product-group-mapping-list'
  );
};

export const getCustomerTransactionConfigDashBoardRouteUrl = (): string => {
  return getConfigurationRouteUrl() + '/customer-transaction';
};
export const getAccessMappingConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/unipay-access-mapping-list'
  );
};

export const getPrinterConfigurationRouteUrl = (): string => {
  return getConfigurationRouteUrl() + '/printer-config';
};
export const getGVRedemptionConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/gv-redemption-configuration'
  );
};
export const getPayerBankConfigurationRouteUrl = (): string => {
  return getConfigurationRouteUrl() + '/banking-revenue/payer-bank-config-list';
};
export const getCustomerTransactionConfigUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/customer-transaction-config-list'
  );
};
export const getCustomerTransactionConfigDetailUrl = (
  configName: string
): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/customer-transaction-config' +
    `/${configName}`
  );
};

export const getPayerBankConfigurationDetailsRouteUrl = (
  configName: string
): string => {
  console.log('name', configName);
  return (
    getConfigurationRouteUrl() +
    '/banking-revenue/payer-bank-config' +
    `/${configName}`
  );
};
export const getCashBackOfferConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getPaymentConfigurationRouteUrl() +
    '/cashback-offer-config-list'
  );
};

export const getCashBackOfferConfigDetailRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getPaymentConfigurationRouteUrl() +
    '/cashback-offer-config' +
    '/' +
    `${configId}`
  );
};
export const getAirpayHostConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/airpay-host-config-list'
  );
};
export const getRazorpayHostConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/razorpay-host-config-list'
  );
};
export const getRazorpayVendorConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/razorpay-vendor-config-list'
  );
};
export const getAirpayConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getGlobalConfigurationRouteUrl() +
    '/airpay-config-list'
  );
};
export const getGepPurityConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getGepConfigurationUrl() +
    '/geppurity-config-list'
  );
};
export const getGepPurityConfigurationDetailsRouteUrl = (
  configName: string
): string => {
  return (
    getConfigurationRouteUrl() +
    getGepConfigurationUrl() +
    '/geppurity-config' +
    `/${configName}`
  );
};
export const getGepPurityConfigurationDetailsTabRouteUrl = (
  configName: string,
  tabType: string
): string => {
  console.log('name', configName, tabType);
  return (
    getConfigurationRouteUrl() +
    getGepConfigurationUrl() +
    '/geppurity-config' +
    `/${configName}/${tabType}`
  );
};

export const getGLBoutiqueLocatonConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() + '/banking-revenue/gl-boutique-location-list'
  );
};

export const getGLBoutiqueLocatonConfigDetailRouteUrl = (
  locationCode
): string => {
  return (
    getConfigurationRouteUrl() +
    '/banking-revenue/gl-boutique-location' +
    `/${locationCode}` +
    '/details'
  );
};

export const getGLLocatonPaymentConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() + '/banking-revenue/gl-location-payment-list'
  );
};

export const getPayeeBankRouteUrl = (): string => {
  return getConfigurationRouteUrl() + `/banking-revenue/payee-bank-list`;
};
export const getbankDetailsRouteUrl = (bankName: string): string => {
  return (
    getConfigurationRouteUrl() +
    `/banking-revenue/payee-bank/${bankName}/bank-details`
  );
};
export const getPayeeDetailsRouteUrl = (
  bankName: string,
  detailType: string
): string => {
  return (
    getConfigurationRouteUrl() +
    `/banking-revenue/payee-bank/${bankName}/${detailType}`
  );
};
export const getGSTMappingUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/gst-mapping'
  );
};
export const getFocConfigurationListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() + getFocConfigurationUrl() + '/foc-config-list'
  );
};

export const getFocConfigurationRouteUrl = (): string => {
  return getConfigurationRouteUrl() + getFocConfigurationUrl() + '/foc-config';
};
export const getFocConfigurationVariantDetailsRouteUrl = (
  configId: string
): string => {
  return (
    getConfigurationRouteUrl() +
    getFocConfigurationUrl() +
    '/foc-config' +
    '/' +
    `${configId}` +
    '/variant-details'
  );
};
export const getFOCBLLRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getFocConfigurationUrl() +
    '/foc-blocking-location-level'
  );
};

export const getResidualWeightToleranceConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getABConfigurationUrl() +
    '/residual-weight-tolerance-list'
  );
};
export const getResidualWeightToleranceDetailsRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getABConfigurationUrl() +
    '/residual-weight-tolerance' +
    '/' +
    `${configId}`
  );
};
export const getOrderPaymentConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getABConfigurationUrl() +
    '/order-payment-config-list'
  );
};
export const getOrderPaymentConfigDetailRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getABConfigurationUrl() +
    '/order-payment-config' +
    '/' +
    `${configId}`
  );
};

export const getCustomerOrderPaymentConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCOConfigurationUrl() +
    '/order-payment-config-list'
  );
};
export const getCustomerOrderPaymentConfigDetailRouteUrl = (
  configId
): string => {
  return (
    getConfigurationRouteUrl() +
    getCOConfigurationUrl() +
    '/order-payment-config' +
    '/' +
    `${configId}`
  );
};

export const getCOResidualWeightToleranceConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCOConfigurationUrl() +
    '/residual-weight-tolerance-list'
  );
};
export const getCOResidualWeightToleranceDetailsRouteUrl = (
  configId
): string => {
  return (
    getConfigurationRouteUrl() +
    getCOConfigurationUrl() +
    '/residual-weight-tolerance' +
    '/' +
    `${configId}`
  );
};

export const getClubbingDiscountConfigRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getDiscountConfigurationUrl() +
    '/clubbing-discount-list'
  );
};

export const getRivaahAllowedRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getDiscountConfigurationUrl() +
    '/rivaah-eligibility'
  );
};

export const getCreditNoteMasterListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCNConfigurationUrl() +
    '/credit-note-master-list'
  );
};
export const getCreditNoteMasterDetailRouteUrl = (cnType): string => {
  return (
    getConfigurationRouteUrl() +
    getCNConfigurationUrl() +
    '/credit-note-master' +
    '/' +
    `${cnType}`
  );
};
export const getCreditNoteMasterViewDetailRouteUrl = (cnType): string => {
  return (
    getConfigurationRouteUrl() +
    getCNConfigurationUrl() +
    '/credit-note-master-view' +
    '/' +
    `${cnType}`
  );
};

export const getCreditNotePriorityListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCNConfigurationUrl() +
    '/cn-priority-config-list'
  );
};

export const getCreditNotePriorityDetailRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getCNConfigurationUrl() +
    '/cn-priority-config' +
    '/' +
    `${configId}`
  );
};

export const getCreditNotePriorityViewDetailRouteUrl = (configId): string => {
  return (
    getConfigurationRouteUrl() +
    getCNConfigurationUrl() +
    '/cn-priority-config-view' +
    '/' +
    `${configId}`
  );
};

export const getCreditNoteValidationListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCNConfigurationUrl() +
    '/credit-note-validation-list'
  );
};
export const getCreditNoteValidationDetailRouteUrl = (
  ruleId,
  ruleType
): string => {
  return (
    getConfigurationRouteUrl() +
    getCNConfigurationUrl() +
    '/credit-note-validation' +
    '/' +
    `${ruleId}` +
    '/' +
    `${ruleType}`
  );
};

export const getCreditNoteValidationViewDetailRouteUrl = (
  ruleId,
  ruleType
): string => {
  return (
    getConfigurationRouteUrl() +
    getCNConfigurationUrl() +
    '/credit-note-validation-view' +
    '/' +
    `${ruleId}` +
    '/' +
    `${ruleType}`
  );
};
export const getAdavanceBookingToleranceConfigListRouteUrl = (
  orderType
): string => {
  return (
    getConfigurationRouteUrl() +
    getABConfigurationUrl() +
    '/' +
    `${orderType}` +
    '/ab-tolerance-config-list'
  );
};
export const getAdavanceBookingToleranceConfigDetailsRouteUrl = (
  orderType,
  configId
): string => {
  return (
    getConfigurationRouteUrl() +
    getABConfigurationUrl() +
    '/' +
    `${orderType}` +
    '/ab-tolerance-config' +
    '/' +
    `${configId}`
  );
};

export const getCustomerOrderToleranceConfigListRouteUrl = (
  orderType
): string => {
  return (
    getConfigurationRouteUrl() +
    getCOConfigurationUrl() +
    '/' +
    `${orderType}` +
    '/co-tolerance-config-list'
  );
};
export const getCustomerOrderToleranceConfigDetailsRouteUrl = (
  orderType,
  configId
): string => {
  return (
    getConfigurationRouteUrl() +
    getCOConfigurationUrl() +
    '/' +
    `${orderType}` +
    '/co-tolerance-config' +
    '/' +
    `${configId}`
  );
};

export const getTEPExceptionConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/tep-exchange-config-list'
  );
};
export const getTEPValidationConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/tep-validation-config-list'
  );
};
export const getTEPStoneConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/tep-stone-config-list'
  );
};

export const getTepValidationConfigDetailsRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/tep-validation-config-details'
  );
};

export const getGrnApprovalConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getGRNConfigurationUrl() +
    '/grn-approval-access-listing'
  );
};
export const getGrnApprovalConfigDetailRouteUrl = (
  ruleId,
  ruleType
): string => {
  return (
    getConfigurationRouteUrl() +
    getGRNConfigurationUrl() +
    '/grn-approval-access' +
    '/' +
    `${ruleId}` +
    '/' +
    `${ruleType}`
  );
};
export const getGrnApprovalConfigViewDetailRouteUrl = (
  ruleId,
  ruleType
): string => {
  return (
    getConfigurationRouteUrl() +
    getGRNConfigurationUrl() +
    '/grn-approval-access/view' +
    '/' +
    `${ruleId}` +
    '/' +
    `${ruleType}`
  );
};

export const getMaxFlatTepConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/max-flat-tep-configuration'
  );
};

export const getBgrConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() + getBGRConfigurationUrl() + '/bgr-config-list'
  );
};

export const getBgrToleranceConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getBGRConfigurationUrl() +
    '/bgr-tolerance-config-list'
  );
};

export const getBgrToleranceConfigDetailsRouteUrl = (
  configId,
  ruleType
): string => {
  return (
    getConfigurationRouteUrl() +
    getBGRConfigurationUrl() +
    '/bgr-tolerance-config' +
    '/' +
    `${configId}/${ruleType}`
  );
};

export const getCutPieceConfigurationRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getCustomerTransactionConfigurationRouteUrl() +
    '/cut-piece-config'
  );
};

export const getCutPieceTotRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    getExchangeConfigurationRouteUrl() +
    '/cut-piece-tot'
  );
};

export const getFtepApprovalConfigListRouteUrl = (): string => {
  return (
    getConfigurationRouteUrl() +
    '/customer-transaction/ftep-approval-access-listing'
  );
};
export const getFtepApprovalConfigDetailRouteUrl = (
  ruleId,
  ruleType
): string => {
  return (
    getConfigurationRouteUrl() +
    '/customer-transaction' +
    '/ftep-approval-access' +
    '/' +
    `${ruleId}` +
    '/' +
    `${ruleType}`
  );
};
export const getFtepApprovalConfigViewDetailRouteUrl = (
  ruleId,
  ruleType
): string => {
  return (
    getConfigurationRouteUrl() +
    '/customer-transaction' +
    '/ftep-approval-access/view' +
    '/' +
    `${ruleId}` +
    '/' +
    `${ruleType}`
  );
};

export const getPayerBankMasterRouteUrl = (): string => {
  return getConfigurationRouteUrl() + `/banking-revenue/payer-bank-list`;
};
export const getGepPurityConfigViewUrl = (configName): string => {
  return (
    getConfigurationRouteUrl() +
    getGepConfigurationUrl() +
    `/geppurity-config/${configName}/view`
  );
};
