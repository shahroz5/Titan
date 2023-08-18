import { HttpParams } from '@angular/common/http';
import { getMasterConfigBaseurl } from './masters-data-endpoints.constants';

export const getLocationBaseUrl = (): string => {
  return `/location/v2`;
};
export const getInventoryBaseUrl = (): string => {
  return `/inventory/v2`;
};
export const getProductBaseUrlV2 = (): string => {
  return `/product/v2`;
};
export const getProductBaseUrl = (): string => {
  return `/product/v1`;
};
export const getEngineBaseUrl = (): string => {
  return `/engine/v2`;
};
export const getPaymentBaseUrl = (): string => {
  return `/payment/v2`;
};

export const getStoreBaseUrl = (): string => {
  return `/store/v2`;
};
export const getSalesBaseUrl = (): string => {
  return '/sales/v2';
};
export const getComplexityFileUploadUrl = (): string => {
  return `/file/v2/file-upload`;
};

export const getLocationDetailsUrl = (
  page,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/locations';
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString());
  return { path, params };
};

export const getProductGroupsConst = (): string => {
  return '/product-groups';
};

export const getStoneTypesConst = (): string => {
  return '/stone-types';
};
export const getMaterialConst = (): string => {
  return '/material-types';
};
export const getPurityConst = (): string => {
  return '/purities';
};

export const getDepreciationsConst = (): string => {
  return '/depreciations';
};
export const getPriceGroupConst = (): string => {
  return '/price-groups';
};
export const getCountriesConst = (): string => {
  return '/countries';
};
export const getBankPriorityConst = (): string => {
  return '/bank-priorities';
};
export const getPayeeBankConst = (): string => {
  return '/payee-banks';
};

export const getTaxesConst = (): string => {
  return '/taxes';
};

export const getTaxClassesConst = (): string => {
  return '/tax-classes';
};
export const getProductCategoriesConst = (): string => {
  return '/product-categories';
};
export const getLovsPathConst = (): string => {
  return '/lovs';
};
export const getLocationsPathConst = (): string => {
  return '/locations';
};
export const getTownsPathConst = (): string => {
  return '/towns';
};
export const getStatesPathConst = (): string => {
  return '/states';
};
export const getMarketsPathConst = (): string => {
  return '/markets';
};
export const getCountriesPathConst = (): string => {
  return '/countries';
};
export const getCurrenciesPathConst = (): string => {
  return '/currencies';
};
export const getBrandsPathConst = (): string => {
  return '/brands';
};
export const getCatchmentsPathConst = (): string => {
  return '/catchments';
};

export const getCountryUrl = (): string => {
  return getLocationBaseUrl() + '/countries';
};

export const getCourierDetailsListingUrl = (
  page: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + '/couriers';
  let params = new HttpParams();
  params = params.set('page', page.toString());
  params = params.set('size', pageSize.toString());
  params = params.set('sort', 'createdDate,desc');
  return { path, params };
};
export const getCourierDetailsBasedOnCourierNameUrl = (
  courierName: string
): string => {
  return getInventoryBaseUrl() + '/couriers' + `/${courierName}`;
};
export const getSaveCourierDetailsUrl = (): string => {
  return getInventoryBaseUrl() + '/couriers';
};
export const getUpdateCourierDetailsUrl = (name: string): string => {
  const courierName = encodeURIComponent(name);
  return getInventoryBaseUrl() + '/couriers' + `/${courierName}`;
};
export const getSelectedLocationsUrl = (name: string): string => {
  const courierName = encodeURIComponent(name);
  return getInventoryBaseUrl() + '/couriers' + `/${courierName}` + '/locations';
};

export const getBinGroupDetailsListingUrl = (
  page: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + '/bingroups';
  let params = new HttpParams();
  if (pageSize > 0) {
    params = params.set('page', page.toString());
    params = params.set('size', pageSize.toString());
    params = params.set('sort', 'binGroupCode,ASC');
  } else params = params.set('isPageable', 'false');
  return { path, params };
};

export const getBinGroupByBinGroupCode = (binGroupCode: string) => {
  const encodedBinGroup = encodeURIComponent(binGroupCode);
  return getInventoryBaseUrl() + '/bingroups' + `/${encodedBinGroup}`;
};

export const getBinGroupEditedFormDetailsUrl = (
  binGroupCode: string
): string => {
  return getInventoryBaseUrl() + '/bingroups' + `/${binGroupCode}`;
};

export const getBinGroupSaveFormDetailsUrl = (): string => {
  return getInventoryBaseUrl() + '/bingroups';
};

export const getBinCodeSaveNewFormDetailsUrl = (): string => {
  return getInventoryBaseUrl() + '/bins';
};

export const getBinCodesByBinGroupCode = (
  binGroupCode: string,
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() + '/bingroups' + `/${binGroupCode}` + '/bins';
  let params = new HttpParams();
  if (pageSize) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
    params = params.set('sort', 'binCode,asc');
  }
  return { path, params };
};

export const getBinCodeEditedFormDetailsUrl = (binCode: string): string => {
  return getInventoryBaseUrl() + '/bins' + `/${binCode}`;
};

export const getLocationsByBinGroupAndBinCode = (
  location
): { path: string; params: HttpParams } => {
  const path =
    getInventoryBaseUrl() +
    '/bingroups' +
    `/${location.binGroup}` +
    '/locations';
  let params = new HttpParams().set('isActive', 'true');
  if (location.binCodes && location.binCodes.length > 0) {
    for (let i = 0; i < location.binCodes.length; i++) {
      params = params.append('binCodes', location.binCodes[i]);
    }
  }

  return { path, params };
};

export const getCorporateTownListingUrl = (
  page: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/towns';
  let params = new HttpParams();
  if (pageSize) {
    params = params.set('page', page.toString());
    params = params.set('size', pageSize.toString());
    params = params.set('isPageable', 'true');
  } else params = params.set('isPageable', 'false');
  return { path, params };
};

export const getStateListingUrl = (
  page: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/states';
  let params = new HttpParams();

  params = params.set('page', page.toString());
  params = params.set('size', pageSize.toString());
  params = params.set('isActive', 'true');
  params = params.set('sort', 'description,ASC');
  return { path, params };
};

export const getTownDetailsByTownCodeUrl = (townCode: string): string => {
  return getLocationBaseUrl() + '/towns' + `/${townCode}`;
};

export const getTownSearchData = (
  townName: string
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/towns';
  const params = new HttpParams().set('townName', townName);
  return { path, params };
};

export const getSaveTownFormDetailsUrl = (): string => {
  return getLocationBaseUrl() + '/towns';
};

export const getTownEditedFormDetailsUrl = (townCode: string): string => {
  return getLocationBaseUrl() + '/towns' + `/${townCode}`;
};

export const getProductCategoryDetailsListingUrl = (
  page: number,
  size: number
): { path: string; params: HttpParams } => {
  const path = getProductBaseUrlV2() + getProductCategoriesConst();
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
  return { path, params };
};

export const getProductCategoryByProductCategoryCodeUrl = (
  productCategoryCode: string
): { path: string } => {
  return {
    path:
      getProductBaseUrlV2() +
      getProductCategoriesConst() +
      `/${encodeURIComponent(productCategoryCode)}`
  };
};

export const getProductCategorySaveFormDetailsUrl = (): { path: string } => {
  return { path: getProductBaseUrlV2() + getProductCategoriesConst() };
};

//stone

export const getFilterStoneListUrl = (
  pageIndex?: any,
  pageSize?: any
): { path: string; params: HttpParams } => {
  const path = getEngineBaseUrl() + '/products/stones';
  let params = new HttpParams();
  if (pageIndex !== null && pageSize !== null) {
    params = params.set('page', pageIndex.toString());
    params = params.set('size', pageSize.toString());
  }
  return { path, params };
};

export const getBrandListUrl = (
  page,
  size
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + getBrandsPathConst();
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', 'createdDate,desc');
  return { path, params };
};

export const getSubBrandListUrl = (
  pageIndex,
  pageSize,
  parentBrandCode
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/brands';
  const params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('parentBrandCode', parentBrandCode);
  return { path, params };
};

export const getParentBrandListUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getLocationBaseUrl() + '/brands';
  const params = new HttpParams()
    .set('isPageable', 'false')
    .set('isActive', 'true');
  return { path, params };
};

export const getSaveBrandUrl = (): { path: string } => {
  return { path: getLocationBaseUrl() + getBrandsPathConst() };
};

export const getUpdateBrandUrl = (brandCode): { path: string } => {
  return {
    path: getLocationBaseUrl() + getBrandsPathConst() + `/${brandCode}`
  };
};

export const getCurrencyUrl = (): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + getCurrenciesPathConst();
  const params = new HttpParams().set('isPageable', 'false');
  return { path, params };
};

export const getLOVReasonTypeListingUrl = (lovType: string): string => {
  return getProductBaseUrlV2() + '/lovs/' + lovType;
};
export const getBinDetailsByBinNameUrl = (
  binName: string,
  binGroupCode?: string
): { path: string; params: HttpParams } => {
  const path = getInventoryBaseUrl() + '/bins/' + `${binName}`;
  let params = new HttpParams();
  if (binGroupCode) params = params.set('binGroupCode', binGroupCode);
  return { path, params };
};
export const getCFAProductsUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const url = getProductBaseUrlV2() + getProductGroupsConst();
  let params = new HttpParams();
  params = params.set('page', pageIndex.toString());
  params = params.set('size', pageSize.toString());
  params = params.set('sort', 'createdDate,desc');
  return { path: url, params: params };
};
export const getCFAProductsBasedOnProductGroupCodeUrl = (
  productGroupCode
): string => {
  const CFAProductCode = encodeURIComponent(productGroupCode);
  return getProductBaseUrlV2() + getProductGroupsConst() + `/${CFAProductCode}`;
};
export const getSaveCFAProductsUrl = (): string => {
  return getProductBaseUrlV2() + getProductGroupsConst();
};

export const getUpdateCFAProductsUrl = (productGroupCode: string): string => {
  return (
    getProductBaseUrlV2() + getProductGroupsConst() + `/${productGroupCode}`
  );
};

export const getItemTypeUrl = (): { path: string; params: HttpParams } => {
  const path = getEngineBaseUrl() + `/products/item-types`;
  const metalArray = ['metal', 'stone'];
  const params = new HttpParams().set('itemGroups', metalArray.toString());
  return { path: path, params: params };
};

export const getProductLOVUrl = (): string => {
  return getProductBaseUrlV2() + '/lovs';
};

export const getLocationLOVeUrl = (): string => {
  return getLocationBaseUrl() + '/lovs';
};

export const getInventoryLOVUrl = (): string => {
  return getInventoryBaseUrl() + '/lovs';
};

export const getPaymentLOVUrl = (): string => {
  return getPaymentBaseUrl() + '/lovs';
};

export const getConfigLOVUrl = (): string => {
  return getMasterConfigBaseurl() + '/lovs';
};

export const getLovMasterTypeUrl = (): string => {
  return getEngineBaseUrl() + '/lovs/lov-types';
};

export const getLocationCodeTypeUrl = (): string => {
  return getEngineBaseUrl() + '/locations/cfa';
};
export const getProductLOVTypeUrl = (lovType: string): string => {
  return getProductLOVUrl() + '/' + lovType;
};

export const getLocationLOVTypeUrl = (lovType: string): string => {
  return getLocationLOVeUrl() + '/' + lovType;
};

export const getInventoryLOVTypeUrl = (lovType: string): string => {
  return getInventoryLOVUrl() + '/' + lovType;
};

export const getPaymentLOVTypeUrl = (lovType: string): string => {
  return getPaymentLOVUrl() + '/' + lovType;
};
export const getConfigLOVTypeUrl = (lovType: string): string => {
  return getConfigLOVUrl() + '/' + lovType;
};

export const getLoadMappedLocationUrl = (configId): string => {
  return getInventoryBaseUrl() + '/configs/' + `${configId}` + '/locations';
};

export const getSaveLocationMappingUrl = (configId): string => {
  return getInventoryBaseUrl() + '/configs/' + `${configId}` + '/locations';
};
export const getUpdateIsActiveUrl = (configId): string => {
  return getInventoryBaseUrl() + '/configs/' + `${configId}`;
};
export const getSearchBrandByBrandCode = (brandCode): { path: string } => {
  return {
    path:
      getLocationBaseUrl() +
      getBrandsPathConst() +
      '/' +
      encodeURIComponent(brandCode)
  };
};
export const getSearchSubbrandBySubbrandCode = (
  subbrandCode,
  parentBrandCode
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/brands/' + `${subbrandCode}`;
  const params = new HttpParams().set('parentBrandCode', parentBrandCode);
  return { path, params };
};
export const getBrandDetailsByBrandCode = (brandCode): { path: string } => {
  return {
    path: getLocationBaseUrl() + getBrandsPathConst() + `/${brandCode}`
  };
};

export const getLocationMappingUpdateUrl = (binGroupCode: string): string => {
  return (
    getInventoryBaseUrl() + '/bingroups/' + `${binGroupCode}` + '/locations'
  );
};

//Item Master

export const getItemByItemCodeUrl = (itemCode: string): string => {
  return getProductBaseUrlV2() + '/items' + `/${encodeURIComponent(itemCode)}`;
};
export const getItemStonesUrl = (itemCode: string): string => {
  return (
    getEngineBaseUrl() +
    '/products' +
    `/${encodeURIComponent(itemCode)}` +
    '/stones'
  );
};

export const getFilterItemDetailsListingUrl = (
  pageIndex?: number,
  pageSize?: number
): { path: string; params: HttpParams } => {
  const path = getEngineBaseUrl() + '/products/items';
  let params = new HttpParams();
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
//Lite-Data for Item Master
export const getCFAProductCodeLiteDataUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getEngineBaseUrl() + '/products/product-groups';
  const params = new HttpParams().set('isPageable', 'false');
  return { path, params };
};
//
export const getMarketCodeListingUrl = (
  page: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/markets';
  let params = new HttpParams();
  params = params.set('page', page.toString());
  params = params.set('size', pageSize.toString());
  params = params.set('sort', 'createdDate,desc');
  return { path: path, params: params };
};

export const getMarketCodeDetailsBasedOnMarketCodeUrl = (
  marketCode: string
): string => {
  return getLocationBaseUrl() + '/markets' + `/${marketCode}`;
};
export const getSaveMarketCodeUrl = (): string => {
  return getLocationBaseUrl() + '/markets';
};
export const getUpdateMarketCodeUrl = (marketCode): string => {
  return getLocationBaseUrl() + '/markets' + `/${marketCode}`;
};
export const getSaveMarketMaterialFacatorsUrl = (marketCode): string => {
  return getLocationBaseUrl() + '/markets' + `/${marketCode}` + '/metal-types';
};
export const getUpdateMarketMaterialFacatorsUrl = (marketCode): string => {
  return getLocationBaseUrl() + '/markets' + `/${marketCode}` + '/metal-types';
};
export const getLoadMaterialFacatorsBasedOnMarketCodeUrl = (
  marketCode
): string => {
  return getLocationBaseUrl() + '/markets' + `/${marketCode}` + '/metal-types';
};

export const getMarketCodeSearchUrl = (marketCode): string => {
  return getLocationBaseUrl() + '/markets' + `/${marketCode}`;
};

// Stone type

export const getStoneQualitiesDetailsListingUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getProductBaseUrlV2() + '/lite-data/stone-qualities';
  const params = new HttpParams().set('isPageable', 'false');
  return { path, params };
};

export const getStoneTypeDetailsAllListingUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getProductBaseUrlV2() + '/lite-data' + getStoneTypesConst();
  const params = new HttpParams().set('isPageable', 'false');
  return { path, params };
};

export const getStoneTypeDetailsListingUrl = (
  page: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getProductBaseUrlV2() + getStoneTypesConst();
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString());
  return { path, params };
};

export const getStoneTypeDetailsBystoneTypeCodeUrl = (
  stoneTypeCode: string
): string => {
  return (
    getProductBaseUrlV2() +
    getStoneTypesConst() +
    `/${encodeURIComponent(stoneTypeCode)}`
  );
};

export const getStoneTypeSaveFormDetailsUrl = (): string => {
  return getProductBaseUrlV2() + getStoneTypesConst();
};

//Metal Type
export const getMetalTypeListUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getProductBaseUrlV2() + getMaterialConst();
  const params = new HttpParams().set('page', pageIndex).set('size', pageSize);
  return { path, params };
};

export const getSearchMetalTypeByMaterialCode = (searhValue): string => {
  const path =
    getProductBaseUrlV2() + getMaterialConst() + '/' + `${searhValue}`;

  return path;
};
export const getSaveMetalTypeUrl = (): string => {
  const path = getProductBaseUrlV2() + getMaterialConst();

  return path;
};

export const getUpdateMetalTypeUrl = (materialCode): string => {
  const path =
    getProductBaseUrlV2() + getMaterialConst() + '/' + `${materialCode}`;

  return path;
};

export const getLoadMetalTypeByMaterialCodeUrl = (materialCode): string => {
  const path =
    getProductBaseUrlV2() + getMaterialConst() + '/' + `${materialCode}`;

  return path;
};

export const getPurityListUrl = (
  pageIndex,
  pageSize,
  materialCode
): { path: string; params: HttpParams } => {
  const path = getProductBaseUrlV2() + getPurityConst();
  let params = new HttpParams().set('page', pageIndex).set('size', pageSize);

  if (materialCode) {
    params = new HttpParams()
      .set('page', pageIndex)
      .set('size', pageSize)
      .set('itemTypeCode', materialCode);
  }

  return { path, params };
};

export const getSearchPurityByMaterialCode = (materialCode): string => {
  return getProductBaseUrlV2() + getPurityConst();
};
//move to master data service
export const getLoadMetalTypeUrl = (): { path: string; params: HttpParams } => {
  const path = '/engine/v2/products/item-types';
  const params = new HttpParams().set('itemGroups', 'METAL');
  return {
    path,
    params
  };
};

export const getSavePurityUrl = (): string => {
  return getProductBaseUrlV2() + '/purities';
};

export const getUpdatePurityUrl = () => {
  return getProductBaseUrlV2() + '/purities';
};

export const getloadPurityByCodeUrl = (
  materialCode: string,
  purity
): { path: string; params: HttpParams } => {
  const path = getProductBaseUrlV2() + '/purities';
  const params = new HttpParams()
    .set('itemTypeCode', materialCode)
    .set('purity', purity);
  return {
    path,
    params
  };
};
//end purity
export const getRegionAllListingUrl = (
  page: number,
  pageSize: number,
  region: string
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/regions';
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString())
    .set('sort', 'regionCode,asc')
    .set('regionType', region)
    .set('isPageable', 'true');
  return { path, params };
};

export const getRegionLiteDataUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getLocationBaseUrl() + '/lite-data/regions';
  const params = new HttpParams().set('isPageable', 'false');
  return { path, params };
};

export const getSubRegionListingUrl = (
  pageIndex,
  pageSize,
  parentRegionCode
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/regions';
  const params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('parentRegionCode', parentRegionCode)
    .set('sort', 'regionCode,asc');
  return { path, params };
};

export const getRegionByRegionCodeUrl = (
  regionCode: string,
  parentRegionCode?: string
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/regions' + `/${regionCode}`;
  let params = new HttpParams();
  if (parentRegionCode)
    params = params.set('parentRegionCode', parentRegionCode);
  return { path, params };
};

export const getSaveRegionFormDetailsUrl = (): string => {
  return getLocationBaseUrl() + '/regions';
};

export const getRegionEditedFormDetailsUrl = (regionCode: string): string => {
  return getLocationBaseUrl() + '/regions' + `/${regionCode}`;
};

//priceGroup
export const getLocationPriceGroupMappingUrl = (
  locationCode: string
): {
  path: string;
} => {
  const path =
    getLocationBaseUrl() + `/locations/${locationCode}` + getPriceGroupConst();
  return { path };
};
export const getPriceGroupMasterAllUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getProductBaseUrlV2() + getPriceGroupConst();
  const params = new HttpParams()
    .set('isPageable', 'false')
    .set('isActive', 'true');
  return { path, params };
};
export const getPriceGroupMasterUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getProductBaseUrlV2() + getPriceGroupConst();
  const params = new HttpParams().set('page', pageIndex).set('size', pageSize);
  return { path, params };
};

export const getPriceGroupByPriceGroupCodeUrl = (priceGroupCode): string => {
  return (
    getProductBaseUrlV2() + getPriceGroupConst() + '/' + `${priceGroupCode}`
  );
};

export const getUpdatePriceGroupMasterUrl = (priceGroupCode): string => {
  return getProductBaseUrlV2() + '/price-groups/' + `${priceGroupCode}`;
};

export const savePriceGroupUrl = (): string => {
  return getProductBaseUrlV2() + getPriceGroupConst();
};
export const getComplexityPricegroupListingUrl = (
  page: number,
  pageSize: number,
  complexityCode?: string,
  priceGroup?: string
): { path: string; params: HttpParams } => {
  const path = getProductBaseUrlV2() + '/complexity-price-groups';
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString())
    .set('sort', 'createdDate,desc');

  if (complexityCode) {
    params = params.set('complexityCode', complexityCode);
  }
  if (priceGroup) {
    params = params.set('priceGroup', priceGroup);
  }
  return { path, params };
};

export const getSaveComplexityPricegroupListingUrl = (): string => {
  return getProductBaseUrlV2() + '/complexity-price-groups';
};

export const getComplexityPricegroupDetailsByIdUrl = (id: string): string => {
  return getProductBaseUrlV2() + '/complexity-price-groups/' + `${id}`;
};
export const getLoadComplexityCodeUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getProductBaseUrlV2() + '/complexities';
  const params = new HttpParams()
    .set('size', '10000')
    .set('isActive', 'true')
    .set('sort', 'complexityCode,ASC');
  return { path, params };
};

export const getLoadComplexityFileUploadItemsUrl = (): string => {
  return (
    getComplexityFileUploadUrl() + `?fileGroup=COMPLEXITY_PRICE_GROUP_DETAILS`
  );
};

export const getLoadPricegroupUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getProductBaseUrlV2() + '/price-groups';
  const params = new HttpParams()
    .set('size', '10000')
    .set('isActive', 'true')
    .set('sort', 'priceGroup,ASC');
  return { path, params };
};

//materialPrice start
export const getMetalPriceDetailsUrl = (
  materialCode: string,
  pageIndex: number,
  pageSize: number,
  configId?
): { path: string; params: HttpParams } => {
  let params = new HttpParams();
  let path;
  path =
    getLocationBaseUrl() + '/metal-types' + '/' + `${materialCode}` + '/price';
  if (configId) {
    params = params.set('configId', configId).set('sort', 'createdDate,desc');
  } else if (pageIndex !== null && pageIndex !== undefined && pageSize) {
    params = params
      .set('page', pageIndex.toString())
      .set('size', pageSize.toString())
      .set('sort', 'createdDate,desc');
  } else {
    params = params.set('sort', 'createdDate,desc');
  }

  return { path, params };
};

export const getMarketDetailsBasedOnMaterialUrl = (
  materialType,
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path =
    getLocationBaseUrl() + '/metal-types' + `/${materialType}` + '/market';
  const params = new HttpParams().set('page', pageIndex).set('size', pageSize);
  return { path, params };
};
export const getComputeMaterialPriceUrl = (
  materialCode,
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path =
    getLocationBaseUrl() +
    '/metal-types' +
    '/' +
    `${materialCode}` +
    '/price' +
    '/compute';

  const params = new HttpParams().set('page', pageIndex).set('size', pageSize);
  return { path, params };
};
export const getSavePriceUrl = (materialCode): string => {
  const path =
    getLocationBaseUrl() + '/metal-types' + `/${materialCode}` + '/price';

  return path;
};
export const getSavedBasePriceUrl = (
  materialCode,
  id,
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path =
    getLocationBaseUrl() +
    '/metal-types' +
    `/${materialCode}` +
    `/${id}` +
    '/prices';

  const params = new HttpParams().set('page', pageIndex).set('size', pageSize);
  return { path, params };
};
export const getSearchMarketCodeUrl = (
  materialCode,
  marketCode
): { path: string; params: HttpParams } => {
  const path =
    getLocationBaseUrl() + '/metal-types' + `/${materialCode}` + '/market';

  const params = new HttpParams().set('marketCodes', marketCode);

  return { path, params };
};

export const getSearchSavedLocationPriceByLocationCodeUrl = (
  id,
  locationCode,
  materialCode
): { path: string; params: HttpParams } => {
  const path =
    getLocationBaseUrl() +
    '/metal-types' +
    `/${materialCode}` +
    `/${id}` +
    '/prices';

  const params = new HttpParams().set('locationCode', locationCode);

  return { path, params };
};

export const getsearchComputedPriceByLocationCodeUrl = (
  locationCode,
  materialCode
): { path: string; params: HttpParams } => {
  const path =
    getLocationBaseUrl() +
    '/metal-types' +
    `/${materialCode}` +
    '/price' +
    '/compute';

  const params = new HttpParams().set('locationCodes', locationCode);

  return { path, params };
};
//materialPrice end
export const getTaxMasterListingUrl = (
  page: number,
  size: number,
  isActive?: boolean
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + getTaxesConst();
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  if (isActive === true || isActive === false) {
    params = params.set('isActive', isActive.toString());
  }
  return { path, params };
};

export const getTaxMasterDetailsUrl = (taxCode: string): { path: string } => {
  return { path: getLocationBaseUrl() + getTaxesConst() + `/${taxCode}` };
};

export const getresetAmountToZeroUrl = (): { path: string } => {
  return { path: getLocationBaseUrl() + `/markets/metal-types` };
};

export const getSaveTaxMasterFormUrl = (): { path: string } => {
  return { path: getLocationBaseUrl() + getTaxesConst() };
};

export const getStateAllListingUrl = (
  page,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/states';
  const params = new HttpParams()
    .set('isPageable', 'true')
    .set('page', page)
    .set('size', pageSize);
  return { path, params };
};

export const getCountriesListingUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = '/engine' + '/v2' + '/locations' + '/countries';
  const params = new HttpParams().set('isPageable', 'false');

  return { path, params };
};

export const getStateByStateCodeUrl = (stateId: string): string => {
  const path = getLocationBaseUrl() + '/states' + `/${stateId}`;

  return path;
};

export const getSaveStateFormDetailsUrl = (): string => {
  const path = getLocationBaseUrl() + '/states';

  return path;
};

export const getStateEditedFormDetailsUrl = (stateCode: number): string => {
  const path = getLocationBaseUrl() + '/states' + `/${stateCode}`;

  return path;
};

export const getSearchStateUrl = (
  stateName: string
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/states';
  const params = new HttpParams().set('stateName', stateName);
  return { path, params };
};
export const getEditTaxMasterFormUrl = (taxCode: string): { path: string } => {
  return { path: getLocationBaseUrl() + getTaxesConst() + `/${taxCode}` };
};
//  country
export const getCountryCodeUrl = (
  countryName: string
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + getCountriesConst();
  const params = new HttpParams().set('description', countryName);
  return { path, params };
};
export const getCountryDetailsListingUrl = (
  page?: number,
  pageSize?: number,
  countryName?: string
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + getCountriesConst();
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString());

  if (countryName) {
    params = params.set('description', countryName);
  }
  return { path, params };
};

export const getCountryByCountryCodeUrl = (countryCode: string): string => {
  return (
    getLocationBaseUrl() +
    getCountriesConst() +
    `/${encodeURIComponent(countryCode)}`
  );
};

export const getCountrySaveFormDetailsUrl = (): string => {
  return getLocationBaseUrl() + getCountriesConst();
};

export const getCurrencyCodeUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getLocationBaseUrl() + '/currencies';
  const params = new HttpParams().set('size', '10000').set('isActive', 'true');
  return { path, params };
};

//  payeeBank
export const getPayeeBankDetailsListingUrl = (
  page: number,
  pageSize: number,
  description?: string
): { path: string; params: HttpParams } => {
  const path = getPaymentBaseUrl() + getPayeeBankConst();
  let params = new HttpParams();
  if (description) {
    params = params.append('bankName', description);
  }

  if (pageSize) {
    params = params.set('page', page.toString());
    params = params.set('size', pageSize.toString());
  }
  params = params.set('sort', 'createdDate,desc');

  return { path, params };
};

export const getPayeeBankByBankNameUrl = (bankName: string): string => {
  return (
    getPaymentBaseUrl() +
    getPayeeBankConst() +
    `/${encodeURIComponent(bankName)}`
  );
};

export const getPayeeBankSaveFormDetailsUrl = (): string => {
  return getPaymentBaseUrl() + getPayeeBankConst();
};

export const getPayeeBankGLCodeDetailsUrl = (
  bankName: string,
  paymentCode: string[],
  isPageable?: boolean,
  pageIndex?,
  pageSize?
): { path: string; params: HttpParams } => {
  const path =
    getPaymentBaseUrl() + getPayeeBankConst() + `/${bankName}` + '/locations';
  let params = new HttpParams().set('isPageable', isPageable.toString());
  if (paymentCode && paymentCode.length > 0) {
    for (let i = 0; i < paymentCode.length; i++) {
      params = params.append('paymentCodes', paymentCode[i]);
    }
  }
  params = params.set('sort', 'locationCode,ASC');

  if (pageSize) {
    params = params.set('size', pageSize);
    params = params.set('page', pageIndex);
  }

  return { path, params };
};
export const getPayeeBankGlCodeDefaults = (): string => {
  return getPaymentBaseUrl() + getPayeeBankConst() + '/locations/defaults';
};
export const savePayeeBankGLCodeDetailsUrl = (bankName: string): string => {
  return (
    getPaymentBaseUrl() + getPayeeBankConst() + `/${bankName}` + '/locations'
  );
};

//currency
export const getCurrencyListingUrl = (
  page: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + '/currencies';
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString());
  return { path, params };
};

export const getSaveCurrencyListingUrl = (): string => {
  return getLocationBaseUrl() + '/currencies';
};

export const getCurrencyDetailsByCurrencyCodeUrl = (
  currencyCode: string
): string => {
  return getLocationBaseUrl() + '/currencies/' + `${currencyCode}`;
};
export const getSaveCurrencyFormDetailsUrl = (): string => {
  return getLocationBaseUrl() + '/currencies';
};

// Tax class
export const getTaxClassListingUrl = (
  page: number,
  size: number
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + getTaxClassesConst();
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
  return { path, params };
};

export const getTaxClassDetailsUrl = (taxCode: string): { path: string } => {
  return { path: getLocationBaseUrl() + getTaxClassesConst() + `/${taxCode}` };
};

export const getSaveTaxClassFormUrl = (): { path: string } => {
  return { path: getLocationBaseUrl() + getTaxClassesConst() };
};
export const getCountriesUrl = (): { path: string; params: HttpParams } => {
  const path = getEngineBaseUrl() + `/locations/countries`;
  let params = new HttpParams();
  params = params.set('isPageable', 'false');
  params = params.set('sort', `description,asc`);

  return {
    path,
    params
  };
};
export const getStatesUrl = (
  countryId: string
): { path: string; params: HttpParams } => {
  let path;
  path = getEngineBaseUrl() + `/locations/countries/${countryId}/states`;
  let params = new HttpParams();
  params = params.set('isPageable', 'false');
  params = params.set('sort', `description,asc`);
  return {
    path,
    params
  };
};

// Transaction Type Master
export const getTransactionTypeMasterListingUrl = (): { path: string } => {
  return { path: getPaymentBaseUrl() + `/lite-data/transaction-types` };
};
export const getTransactionTypeMasterSearchUrl = (
  transactionType: string
): { path: string; params: HttpParams } => {
  const path = getPaymentBaseUrl() + `/lite-data/transaction-types`;
  const params = new HttpParams().set('transactionType', transactionType);
  return { path, params };
};

export const getTransactionTypeMasterDetailsUrl = (
  transactionTypeCode: string,
  code: string
): { path: string; params: HttpParams } => {
  const path =
    getPaymentBaseUrl() + getLovsPathConst() + `/${transactionTypeCode}`;
  const params = new HttpParams().set('lovCode', code);
  return { path, params };
};

export const getSaveTransactionTypeMasterFormUrl = (): { path: string } => {
  return { path: getPaymentBaseUrl() + getLovsPathConst() };
};

//complexity code
export const getComplexityCodeListUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getProductBaseUrlV2() + '/complexities';
  const params = new HttpParams().set('page', pageIndex).set('size', pageSize);
  return { path, params };
};

export const getComplexityByCodeUrl = (complexityCode: string): string => {
  const path = getProductBaseUrlV2() + '/complexities/' + `${complexityCode}`;
  return path;
};

export const saveComplexityCodeUrl = (): string => {
  const path = getProductBaseUrlV2() + '/complexities';

  return path;
};

export const updateComplexityCodeUrl = (complexityCode: string): string => {
  const path = getProductBaseUrlV2() + '/complexities/' + `${complexityCode}`;

  return path;
};
//complexity end

//payment master
export const getPaymentMasterUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = getPaymentBaseUrl() + '/payment-codes';
  const params = new HttpParams().set('page', pageIndex).set('size', pageSize);
  return {
    path,
    params
  };
};
export const getSavePaymentMasterUrl = (
  paymentGroup: string
): { path: string; params: HttpParams } => {
  const path = getPaymentBaseUrl() + '/payment-codes';
  const params = new HttpParams().set('paymentGroup', paymentGroup);
  return {
    path,
    params
  };
};
export const getUpdatePaymentMasterUrl = (
  paymentCode: string,
  paymentGroup: string
): { path: string; params: HttpParams } => {
  const path = getPaymentBaseUrl() + '/payment-codes' + '/' + `${paymentCode}`;
  const params = new HttpParams().set('paymentGroup', paymentGroup);
  return {
    path,
    params
  };
};

export const getLoadPaymentMasterByPaymentCodeUrl = (
  paymentCode: string
): string => {
  const path = getPaymentBaseUrl() + '/payment-codes' + '/' + `${paymentCode}`;

  return path;
};
//payment master end
export const getCustomerTownListingUrl = (
  page: number,
  pageSize: number,
  townName?: string
): { path: string; params: HttpParams } => {
  const path = getStoreBaseUrl() + '/towns';
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString());

  if (townName) {
    params = params.set('description', townName);
  }
  return { path, params };
};
export const getCustomerTownDetailsByTownCodeUrl = (
  townCode: string
): string => {
  return getStoreBaseUrl() + '/towns' + `/${townCode}`;
};
export const getSaveCustomerTownFormDetailsUrl = (): string => {
  return getStoreBaseUrl() + '/towns';
};
export const getCustomerTownEditFormDetailsUrl = (townCode: string): string => {
  return getStoreBaseUrl() + '/towns' + `/${townCode}`;
};

//Bank Priority
export const getBankPriorityListingUrl = (): string => {
  const path = getStoreBaseUrl() + '/bank-priorities';
  return path;
};
export const getPayeeBanksListingUrl = (): string => {
  const path = getEngineBaseUrl() + '/' + 'payments' + '/' + 'payee-banks';
  return path;
};

export const getBankPrioritySaveFormDetailsUrl = (): string => {
  const path = getStoreBaseUrl() + '/bank-priorities';
  return path;
};
//Bank Priority end
export const getFileUploadUrl = (): string => {
  return getPaymentBaseUrl() + '/payer-banks';
};
export const loadPayerBanksUrl = (
  pageIndex: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = getPaymentBaseUrl() + `/payer-banks`;
  let params = new HttpParams();
  params = params.set('page', pageIndex.toString());
  params = params.set('size', pageSize.toString());
  params = params.set('sort', 'createdDate,desc');
  return { path: path, params: params };
};
export const searchPayerBankUrl = (
  payerBankName: string
): { path: string; params: HttpParams } => {
  const path = getPaymentBaseUrl() + `/payer-banks`;
  const params = new HttpParams().set('bankName', payerBankName);
  return { path: path, params: params };
};

export const updateBankStatusUrl = (): string => {
  return getPaymentBaseUrl() + `/payer-banks`;
};

export const getBankDepositDetailsUrl = (
  pageIndex: number,
  pageSize: number,
  paymentModes: string[],
  sort: string[]
): { path: string; params: HttpParams } => {
  const path = getSalesBaseUrl() + `/bankings`;
  let params = new HttpParams()
    .set('page', `${pageIndex}`)
    .set('size', `${pageSize}`);

  if (sort !== null) {
    params = params.set('sort', sort.toString());
  } else {
    params = params.set('sort', 'collectionDate,desc');
  }

  if (paymentModes.length > 0) {
    for (const paymentMode of paymentModes) {
      params = params.append('paymentCode', paymentMode);
    }
  }
  return { path, params };
};
export const getSaveBoutiqueBankDepositDetails = (): string => {
  return getSalesBaseUrl() + `/bankings`;
};
export const getSaveDenomitionUrl = (): string => {
  return getSalesBaseUrl() + `/bankings/denomination`;
};
export const getPendingDatesUrl = (): string => {
  return getSalesBaseUrl() + `/bankings/ghs`;
};
export const getServicePossPendingDatesUrl = (): string => {
  return getSalesBaseUrl() + `/bankings/service`;
};
export const getDepositAmountByPifNo = (): string => {
  return getSalesBaseUrl() + `/bankings/pifNo`;
};

export const getCatchmentListingUrl = (
  page: number,
  size: number
): { path: string; params: HttpParams } => {
  const path = getStoreBaseUrl() + getCatchmentsPathConst();
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
  return { path, params };
};

export const searchCatchmentListingUrl = (
  payload: string
): { path: string; params: HttpParams } => {
  const path = getStoreBaseUrl() + getCatchmentsPathConst();
  const params = new HttpParams().set('searchField', payload);
  return { path, params };
};

export const getCatchmentDetailsUrl = (payload: string): { path: string } => {
  return { path: getStoreBaseUrl() + '/catchments/' + `${payload}` };
};

export const getSaveCatchmentFormUrl = (): { path: string } => {
  return { path: getStoreBaseUrl() + '/catchments/' };
};

// export const getLocationListUrl = (
//   page: number,
//   size: number
// ): { path: string; params: HttpParams } => {
//   const path = getLocationBaseUrl() + getLocationsPathConst();
//   const params = new HttpParams()
//     .set('page', page.toString())
//     .set('size', size.toString());
//   return { path, params };
// };

export const getSearchLocationByLocationCode = (
  locationCode: string
): { path: string } => {
  return {
    path:
      getLocationBaseUrl() +
      getLocationsPathConst() +
      '/' +
      encodeURIComponent(locationCode)
  };
};

// 27012020, moved to master-endpoints.constants file from inventory-endpoints.constants
// export const getCopyLocationUrl = (
//   sourceLocationCode: string,
//   destinationLocationCode: string
// ): { path: string; params: HttpParams } => {
//   const path = getLocationBaseUrl() + getLocationsPathConst() + '/clone';

//   const params = new HttpParams()
//     .set('srcLocationCode', sourceLocationCode)
//     .set('dstLocationCode', destinationLocationCode);

//   return { path, params };
// };

export const getLocationDetailsByLocationCodeUrl = (
  locationCode: string
): { path: string } => {
  return {
    path: getLocationBaseUrl() + getLocationsPathConst() + `/${locationCode}`
  };
};

export const getSaveLocationDetailsUrl = (): { path: string } => {
  return { path: getLocationBaseUrl() + getLocationsPathConst() };
};

export const getLocationTownUrl = (
  stateId?: string
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + getTownsPathConst();
  let params = new HttpParams().set('isPageable', 'false');
  if (stateId) {
    params = params.append('stateId', stateId);
  }
  return { path, params };
};

export const getLocationCFAListUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getLocationBaseUrl() + '/lite-data' + getLocationsPathConst();
  const params = new HttpParams().set('isPageable', 'false');

  return { path, params };
};

export const getLocationStateUrl = (
  countryId?: string
): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + getStatesPathConst();
  const params = new HttpParams().set('isPageable', 'false');
  if (countryId) {
    params.set('countryCode', countryId);
  }
  return { path, params };
};

export const getMarketCodeListUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getLocationBaseUrl() + getMarketsPathConst();
  const params = new HttpParams()
    .set('isActive', 'true')
    .set('isPageable', 'false');
  return { path, params };
};

export const getBaseCurrencyUrl = (): { path: string } => {
  return { path: getLocationBaseUrl() + getCountriesPathConst() };
};

export const getCurrencyDetailsUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = getLocationBaseUrl() + getCurrenciesPathConst();
  const params = new HttpParams().set('isPageable', 'false');
  return { path, params };
};

export const getFileStatusUrl = (
  pageIndex,
  pageSize
): { path: string; params: HttpParams } => {
  const path = '/file/v2/file-status';
  const params = new HttpParams()
    .set('page', pageIndex)
    .set('size', pageSize)
    .set('sort', 'startTime,DESC');
  return { path, params };
};

//f2Margin
export const getF2MarginListUrl = (
  pageIndex,
  pageSize,
  cfaCode
): { path: string; params: HttpParams } => {
  const path = getProductBaseUrlV2() + '/' + 'product-price';
  let params = new HttpParams().set('page', pageIndex).set('size', pageSize);

  if (cfaCode !== undefined) {
    params = new HttpParams()
      .set('page', pageIndex)
      .set('size', pageSize)
      .set('productGroupCode', cfaCode);
  }

  return { path, params };
};

//UCP market code
export const getUcpMarketCodeUrl = (
  pageIndex,
  pageSize,
  searchValue
): { path: string; params: HttpParams } => {
  const path =
    getLocationBaseUrl() + getMarketsPathConst() + getProductGroupsConst();
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('size', pageSize.toString())
    .set('sort', 'createdDate,desc');

  if (searchValue) {
    params = new HttpParams()
      .set('page', pageIndex)
      .set('size', pageSize)
      .set('marketCode', searchValue);
  }
  return { path, params };
};

export const getUcpMarketCodeFactorByCodeUrl = (id): string => {
  const path =
    getLocationBaseUrl() +
    getMarketsPathConst() +
    getProductGroupsConst() +
    '/' +
    `${id}`;
  return path;
};

export const getSaveUcpMarketCodeFactorUrl = (): string => {
  const path =
    getLocationBaseUrl() + getMarketsPathConst() + getProductGroupsConst();
  return path;
};

export const getMarketCodeUrl = (): { path: string; params: HttpParams } => {
  const path = getLocationBaseUrl() + getMarketsPathConst();
  const params = new HttpParams()
    .set('isActive', 'true')
    .set('isPageable', 'false');
  return { path, params };
};

export const getUcpProductGroupUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path = '/product/v2/' + getProductGroupsConst();
  const params = new HttpParams()
    .set('isActive', 'true')
    .set('pricingType', 'UCP')
    .set('size', '10000');
  return { path, params };
};

//vendor master
export const getVendorMasterUrl = (
  pageSize,
  pageIndex
): { path: string; param: HttpParams } => {
  const path = '/integration/v2/' + 'vendors';
  const param = new HttpParams().set('page', pageSize).set('size', pageIndex);
  return { path, param };
};

export const getSearchVendorMasterUrl = (vendorCode): string => {
  const path = '/integration/v2/' + 'vendors' + '/' + `${vendorCode}`;
  return path;
};

export const getVendorMasterByCodeUpdateUrl = (
  vendorCode
): { path: string; param: HttpParams } => {
  const path = '/integration/v2/' + 'vendors';
  const param = new HttpParams().set('vendorCode', vendorCode);
  return {
    path,
    param
  };
};
export const getVendorMasterByCodeUrl = (id): string => {
  const path = '/integration/v2/' + 'vendors' + '/' + `${id}`;
  return path;
};

export const getSaveVendorMasterUrl = (): string => {
  const path = '/integration/v2/' + 'vendors';

  return path;
};
