/**
 * Inventory Routing Urls
 */

export const getMasterRouteUrl = (): string => {
  return `/master`;
};
export const getBoutiqueMasterRouteUrl = (): string => {
  return `/boutique-master`;
};
export const getBoutiqueMastersRouteUrl = (): string => {
  return `/boutique-masters`;
};
export const getMasterHomeRouteUrl = (): string => {
  return getMasterRouteUrl() + `/home`;
};
export const getProductAttributesMasterRouteUrl = (): string => {
  return `product-attributes`;
};
export const getProductPricingRouteUrl = (): string => {
  return `product-pricing`;
};
export const getProductMastersRouteUrl = (): string => {
  return `product-masters`;
};

export const getLocationMasterRouteUrl = (): string => {
  return `location-masters`;
};
export const getLocationRouteUrl = (): string => {
  return `location`;
};

export const getInventoryConfigMasterRouteUrl = (): string => {
  return `inventory-masters`;
};
export const getTaxMastersRouteUrl = (): string => {
  return `tax-masters`;
};

export const getPaymentMastersRouteUrl = (): string => {
  return `payment-masters`;
};
export const getBankingRouteurl = (): string => {
  return `banking`;
};
export const getCompanyRelatedRouteurl = (): string => {
  return `/company-related`;
};

// export const getPayeeBankMasterRouteUrl = (): string => {
//   return (
//     getMasterRouteUrl() +
//     `/` +
//     getPaymentMastersRouteUrl() +
//     `/payee-bank-list`
//   );
// };

// export const getbankDetailsRouteUrl = (bankName: string): string => {
//   return (
//     getMasterRouteUrl() +
//     `/` +
//     getPaymentMastersRouteUrl() +
//     `/payee-bank/${bankName}/bank-details`
//   );
// };
// export const getPayeeDetailsRouteUrl = (
//   bankName: string,
//   detailType: string
// ): string => {
//   return (
//     getMasterRouteUrl() +
//     `/` +
//     getPaymentMastersRouteUrl() +
//     `/payee-bank/${bankName}/${detailType}`
//   );
// };
// export const getbankGlCodeDetailsRouteUrl = (bankName: string): string => {
//   return (
//     getMasterRouteUrl() +
//     `/` +
//     getPaymentMastersRouteUrl() +
//     `/payee-bank/${bankName}/glCode-details`
//   );
// };
export const getTransactionTypeMasterRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getPaymentMastersRouteUrl() +
    `/transaction-type-list`
  );
};
export const getBankPriorityMasterRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + getCompanyRelatedRouteurl() + `/bank-priority-list`
  );
};
export const getBoutiqueBankDeposit = (): string => {
  return (
    getBoutiqueMasterRouteUrl() +
    `/` +
    getBankingRouteurl() +
    `/boutique-bank-deposit`
  );
};
export const getBoutiqueBankDepositRouteUrl = (): string => {
  return '/home/banking-revenue/bank-deposit';
};
export const getPIFSeriesUrl = (): string => {
  return (
    getBoutiqueMasterRouteUrl() + `/` + getBankingRouteurl() + `/pif-series`
  );
};

// export const getBankPriorityDashboardRouteUrl = (): string => {
//   return getBoutiqueMasterRouteUrl() + `/` + getBankingRouteurl();
// };
export const getPaymentMasterRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getPaymentMastersRouteUrl() +
    `/payment-mode-list`
  );
};
// export const getProductMasterDashboardRouteUrl = (): string => {
//   return getMasterRouteUrl() + `/` + getProductMastersRouteUrl();
// };

// export const getProductBoutiqueMasterDashboardRouteUrl = (): string => {
//   return getBoutiqueMasterRouteUrl() + `/` + getProductMastersRouteUrl();
// };

// export const getProductAttributesDashboardUrl = (): string => {
//   return (
//     getMasterRouteUrl() + `/` + getProductAttributesMasterRouteUrl()
//   );
// };

// export const getProductPricingDashboardUrl = (): string => {
//   return getMasterRouteUrl() + `/` + getProductPricingRouteUrl();
// };

export const getTaxMasterRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getTaxMastersRouteUrl() + `/tax-master-list`
  );
};
export const getTaxClassRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getTaxMastersRouteUrl() + `/tax-class-list`
  );
};

export const getProductMasterItemRouteUrl = (): string => {
  return getMasterRouteUrl() + '/' + getProductMastersRouteUrl() + `/item-list`;
};

export const getLOVMasterDashboardRouteUrl = (): string => {
  return getMasterRouteUrl() + `/lov-master-list`;
};

export const getProductMasterBrandListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getProductMastersRouteUrl() + `/brand-list`
  );
};

export const getProductMasterSubBrandListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getProductMastersRouteUrl() + `/sub-brand-list`
  );
};

export const getProductMasterProductCategoryListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductMastersRouteUrl() +
    `/product-category-list`
  );
};

export const getComplexityCodeListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductAttributesMasterRouteUrl() +
    `/complexity-list`
  );
};

export const getVendorMasterListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductAttributesMasterRouteUrl() +
    `/vendor-master-list`
  );
};

// export const getProductMasterCFAProductListRouteUrl = (): string => {
//   return (
//     getMasterRouteUrl() +
//     `/` +
//     getProductMastersRouteUrl() +
//     `/CFAProducts`
//   );
// };

export const getProductMasterMetalTypeRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductAttributesMasterRouteUrl() +
    `/material-type-list`
  );
};

export const getProductMasterPurityRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductAttributesMasterRouteUrl() +
    `/purity-list`
  );
};

export const getProductMasterStoneTypeRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductAttributesMasterRouteUrl() +
    `/stone-type-list`
  );
};
export const getProductMasterDepreciationRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductAttributesMasterRouteUrl() +
    `/depreciations`
  );
};

export const getProductMasterStoneRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getProductMastersRouteUrl() + `/stone-list`
  );
};
export const getBoutiqueMasterStoneRouteUrl = (): string => {
  return getMasterRouteUrl() + getBoutiqueMastersRouteUrl() + `/stone-list`;
};
export const getBoutiqueMasterItemRouteUrl = (): string => {
  return getMasterRouteUrl() + getBoutiqueMastersRouteUrl() + `/item-list`;
};

export const getLocationMasterListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getLocationMasterRouteUrl() + `/location-list`
  );
};

export const getPriceGroupMappingRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getLocationMasterRouteUrl() +
    `/price-group-mapping`
  );
};

export const getCorporateTownListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getLocationMasterRouteUrl() +
    `/corporate-town-list`
  );
};
export const getMarketCodesListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getLocationMasterRouteUrl() +
    `/market-code-list`
  );
};

export const getProductMasterComplexityPriceGroupRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductPricingRouteUrl() +
    `/complexity-price-group-list`
  );
};

export const getRegionListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getLocationMasterRouteUrl() + `/region-list`
  );
};

export const getSubRegionListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getLocationMasterRouteUrl() + `/sub-region-list`
  );
};

export const getStateListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getLocationMasterRouteUrl() + `/state-list`
  );
};

export const getCountryMasterListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getLocationMasterRouteUrl() + `/country-list`
  );
};
export const getCurrencyistRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getLocationMasterRouteUrl() + `/currency-list`
  );
};

export const getBrandDetailsRouteUrl = (brandCode: string): string => {
  return (
    getMasterRouteUrl() +
    '/' +
    getProductMastersRouteUrl() +
    '/' +
    'brand-master/' +
    `${brandCode}`
    // +
    // '/brand/1'
  );
};

// export const getBrandListRouteUrl = (): string => {
//   return getMasterRouteUrl() + `/product-master/brandlist`;
// };

export const getCourierDetailsRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getInventoryConfigMasterRouteUrl() + `/courier`
  );
};
export const getCourierDetailsListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getInventoryConfigMasterRouteUrl() +
    `/courier-list`
  );
};

export const getBinGroupRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getInventoryConfigMasterRouteUrl() +
    `/bin-group-list`
  );
};

export const getBinCodeRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getInventoryConfigMasterRouteUrl() +
    `/bin-code-list`
  );
};

// export const getWeighttoleranceRouteUrl = (): string => {
//   return (
//     getMasterRouteUrl() +
//     `/` +
//     getInventoryConfigMasterRouteUrl() +
//     `/weight-tolerance`
//   );
// };

// export const getWeighttoleranceEditRouteUrl = (configId: string): string => {
//   return (
//     getMasterRouteUrl() + `/` + getInventoryConfigMasterRouteUrl() + `weighttolerance/edit/${configId}`
//   );
// };

// export const getWeighttoleranceDetailsRouteUrl = (configId): string => {
//   return (
//     getMasterRouteUrl() +
//     `/` +
//     getInventoryConfigMasterRouteUrl() +
//     `/weight-tolerance/details/` +
//     `${configId}`
//   );
// };

export const getCFAProductsRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductMastersRouteUrl() +
    `/product-group-list`
  );
};
export const getCFAProductsByCodeRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + `/` + getProductMastersRouteUrl() + `/product-group`
  );
};

export const getItemDetailsRouteUrl = (itemCode: string): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductMastersRouteUrl() +
    `/item-master/${encodeURIComponent(itemCode)}/item-details`
  );
};
export const getBoutiqueItemDetailsRouteUrl = (itemCode: string): string => {
  return (
    getMasterRouteUrl() +
    getBoutiqueMastersRouteUrl() +
    `/item-master/${encodeURIComponent(itemCode)}/item-details`
  );
};

export const getLocationDetailsLocationRouteUrl = (
  locationCode: string
  // page: string
): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getLocationMasterRouteUrl() +
    `/location` +
    `/${locationCode}`
    // `/` +
    // getLocationRouteUrl()
    //  +
    // `/${page}`
  );
};

export const getLocationDetailsGHSRouteUrl = (
  locationCode: string,
  page: string
): string => {
  return (
    getMasterRouteUrl() +
    `/location/location-master/${locationCode}/` +
    getLocationMasterGhsRouterLink() +
    `/${page}`
  );
};

export const getLocationDetailsPrintRouteUrl = (
  locationCode: string
): string => {
  return (
    getMasterRouteUrl() +
    `/location/location-master/${locationCode}/` +
    getLocationMasterPrintRouterLink() +
    `/`
  );
};

export const getLocationDetailsGRNRouteUrl = (
  locationCode: string,
  page: string
): string => {
  return (
    getMasterRouteUrl() +
    `/location/location-master/${locationCode}/` +
    getLocationMasterGrnRouterLink() +
    `/${page}`
  );
};

export const getLocationDetailsLoyalityRouteUrl = (
  locationCode: string,
  page: string
): string => {
  return (
    getMasterRouteUrl() +
    `/location/location-master/${locationCode}/` +
    getLocationMasterLoyalityRouterLink() +
    `/${page}`
  );
};

export const getLocationDetailsAdvanceRouteUrl = (
  locationCode: string,
  page: string
): string => {
  return (
    getMasterRouteUrl() +
    `/location/location-master/${locationCode}/` +
    getLocationMasterAdvanceRouterLink() +
    `/${page}`
  );
};

// RouterLinks
export const getBrandMasterBrandRouterLink = (page: string): string => {
  return `brand/${page}`;
};

export const getBrandMasterPancardRouterLink = (page: string): string => {
  return `pancard/${page}`;
};

export const getBrandMasterResidualamountdRouterLink = (
  page: string
): string => {
  return `residualamount/${page}`;
};

export const getBrandMasterSMSConfigRouterLink = (page: string): string => {
  return `SMSConfig/${page}`;
};

export const getBrandMasterCurrencyRouterLink = (page: string): string => {
  return `currency/${page}`;
};

export const getLovMasterRouterLink = (): string => {
  return `lov-master-list`;
};

export const getLocationMasterGhsRouterLink = (): string => {
  return `ghs`;
};

export const getLocationMasterPrintRouterLink = (): string => {
  return `print`;
};

export const getLocationMasterGrnRouterLink = (): string => {
  return `grn`;
};

export const getLocationMasterAdvanceRouterLink = (): string => {
  return `advance`;
};

export const getProductPricinglistRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductPricingRouteUrl() +
    `/price-group-list`
  );
};

export const getUcpMarketCodelistRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getProductPricingRouteUrl() +
    `/ucp-market-code-list`
  );
};
// export const getProductPricingDashboardRouteUrl = (): string => {
//   return getMasterRouteUrl() + `/product-pricing`;
// };
export const getMaterialPriceListRoutingUrl = (
  materialType: string
): string => {
  return (
    getMasterRouteUrl() +
    `/product-pricing/market-price-list` +
    `/${materialType}`
  );
};
export const getMaterialPriceDetailPageRoutingUrl = (
  materialType: string,
  priceType: string,
  mode: string
): string => {
  return (
    getMasterRouteUrl() +
    `/product-pricing/market-price` +
    `/${materialType}` +
    `/${priceType}` +
    `/${mode}`
  );
};
export const getLocationMasterLoyalityRouterLink = (): string => {
  return `loyality`;
};
export const getGLBoutiqueLocatonMasterRouteUrl = (): string => {
  return (
    getMasterRouteUrl() +
    `/` +
    getBankingRouteurl() +
    `/gl-boutique-location-list`
  );
};
export const getCustomerTownListRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + getBoutiqueMastersRouteUrl() + `/customer-town-list`
  );
};

export const getCatchmentDashboardRouteUrl = (): string => {
  return getMasterRouteUrl() + getBoutiqueMastersRouteUrl() + `/catchment-list`;
};

export const getUploadEghsRouteUrl = (): string => {
  return (
    getBoutiqueMasterRouteUrl() + `/` + getBankingRouteurl() + `/upload-eGHS`
  );
};
export const getOfflineMetalRatesUpdateRouteUrl = (): string => {
  return (
    getMasterRouteUrl() + getBoutiqueMastersRouteUrl() + '/update-metal-rates'
  );
};
