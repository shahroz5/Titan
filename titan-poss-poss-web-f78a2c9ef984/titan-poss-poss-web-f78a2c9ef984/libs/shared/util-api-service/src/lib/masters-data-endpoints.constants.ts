import { HttpParams } from '@angular/common/http';
import { LocationFilter, params } from '@poss-web/shared/models';

const getMasterLocationBaseUrl = (): string => {
  return `/location/v2`;
};
export const getProduct = (): string => {
  return `/product/v2`;
};

const getMasterInventoryBaseUrl = (): string => {
  return `/inventory/v2`;
};
export const getMasterSalesBaseUrl = (): string => {
  return `/sales/v2`;
};

export const getMasterProductBaseUrl = (): string => {
  return `/product/v2`;
};

export const getMasterPaymentBaseurl = (): string => {
  return `/payment/v2`;
};

export const getMasterConfigBaseurl = (): string => {
  return `/config/v2`;
};

export const getMasterEngineBaseUrl = (): string => {
  return `/engine/v2`;
};

export const getMasterReportBaseUrl = (): string => {
  return `/report/v2`;
};
export const getMasterStoreUserBaseUrl = (): string => {
  return `/user/v2`;
};
export const getProductCategoryUrl = (): string => {
  return '/product-categories';
};
export const getProductGroupUrl = (): string => {
  return '/product-groups';
};
export const getLiteProductGroupUrl = (): string => {
  return '/products/product-groups';
};
export const getLiteProductCategoryUrl = (): string => {
  return '/products/product-categories';
};
export const getVendorsCodeUrl = (): string => {
  return '/integration/v2/vendors';
};
export const getMasterLocationsUrl = (
  filter?: LocationFilter,
  isActive?: boolean,
  pageIndex?: number,
  pageSize?: number,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  body: Object;
  params: HttpParams;
} => {
  let params = new HttpParams();
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path: getMasterLocationBaseUrl() + '/locations/filter',
    body: !!filter ? getMasterFilterData(filter) : {},
    params
  };
};
export const getLocationSummaryUrl = (
  filter: LocationFilter,
  isPageable?: boolean,
  pageIndex?: number,
  pageSize?: number,
  sort?: string[]
): {
  path: string;
  body: Object;
  params: HttpParams;
} => {
  let params = new HttpParams();
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path: getMasterLocationBaseUrl() + '/lite-data/locations',
    body: !!filter ? getMasterFilterData(filter) : {},
    params
  };
};

export const getCountryListUrl = (
  isPageable: boolean
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams();

  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path: getMasterLocationBaseUrl() + '/lite-data/countries',
    params
  };
};

export const getCurrencyListUrl = (
  isPageable: boolean
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams();

  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path: getMasterLocationBaseUrl() + '/lite-data/currencies',
    params
  };
};

function getMasterFilterData(filterdata: LocationFilter): Object {
  return {
    ...(filterdata.brands && { brandCodes: filterdata.brands }),
    ...(filterdata.regions && { regionCodes: filterdata.regions }),
    ...(filterdata.levels && { ownerTypeCodes: filterdata.levels }),
    ...(filterdata.countries && { countryCodes: filterdata.countries }),
    ...(filterdata.states && { stateCodes: filterdata.states }),
    ...(filterdata.towns && { townCodes: filterdata.towns }),
    ...(filterdata.cfa && { cfaCodes: filterdata.cfa }),
    ...(filterdata.factory && { factoryCodes: filterdata.factory }),
    ...(filterdata.locationTypes && {
      locationTypes: filterdata.locationTypes
    }),
    ...(filterdata.locationFormats && {
      locationFormats: filterdata.locationFormats
    }),
    ...(filterdata.isMigartedFromLegacy !== null &&
      filterdata.isMigartedFromLegacy !== undefined && {
        isMigartedFromLegacy: filterdata.isMigartedFromLegacy
      })
  };
}

export const getMasterLocationByCodeUrl = (locationCode): string => {
  return getMasterLocationBaseUrl() + `/locations/${locationCode}`;
};

export const getMasterCountriesUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterLocationBaseUrl() + `/countries`;
  let params = new HttpParams();
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};
export const getMasterCountryByCodeUrl = (countryCode): string => {
  return getMasterLocationBaseUrl() + `/countries/${countryCode}`;
};

export const getCountriesSummaryUrl = (
  pageIndex?: number,
  pageSize?: number,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterEngineBaseUrl() + `/locations/countries`;
  let params = new HttpParams();
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};

export const getLocationMasterStates = (
  countryCode: string,
  regionCodes: string[],
  isPageable: boolean
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterLocationBaseUrl() + `/lite-data/states`;
  let params = new HttpParams();

  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }

  if (countryCode !== null && countryCode !== undefined) {
    params = params.append('countryCodes', countryCode);
  }

  if (regionCodes !== null && regionCodes !== undefined && regionCodes.length) {
    regionCodes.forEach(code => {
      params = params.append('regionCodes', code);
    });
  }

  return {
    path,
    params
  };
};
export const getMasterStatesUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  countryCode?: string,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterLocationBaseUrl() + `/states`;
  let params = new HttpParams();
  if (countryCode) {
    params = params.append('countryCode', countryCode);
  }
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};
export const getMasterStatesSummaryUrl = (
  countryCode: string,
  pageIndex?: number,
  pageSize?: number,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getMasterEngineBaseUrl() + `/locations/countries/${countryCode}/states`;
  let params = new HttpParams();
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};
export const getMasterStateByCodeUrl = (stateId): string => {
  return getMasterLocationBaseUrl() + `/states/${stateId}`;
};

export const getMasterTownsUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  stateCode?: string,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterLocationBaseUrl() + `/towns`;
  let params = new HttpParams();
  if (stateCode) {
    params = params.append('stateCode', stateCode);
  }
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};
export const getMasterTownByCodeUrl = (townCode): string => {
  return getMasterLocationBaseUrl() + `/towns/${townCode}`;
};
export const getMasterTownsSummaryUrl = (
  stateId: string,
  pageIndex?: number,
  pageSize?: number,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getMasterLocationBaseUrl() + `/lite-data/states/${stateId}/towns`;
  let params = new HttpParams();
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};
export const getMasterBinGroupsUrl = (
  pageIndex?: number,
  pageSize?: number,
  locationCode?: string,
  isActive?: boolean,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterInventoryBaseUrl() + '/bingroups';
  let params = new HttpParams();
  if (locationCode) {
    params = params.append('locationCode', locationCode);
  }
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
  }
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
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
export const getMasterBinGroupByCodeUrl = (binGroupCode): string => {
  return getMasterInventoryBaseUrl() + `/bingroups/${binGroupCode}`;
};

export const getMasterBinByCodeUrl = (binCode): string => {
  return getMasterInventoryBaseUrl() + `/bins/${binCode}`;
};
const getMasterLovsBaseUrl = (): string => {
  return `/lovs`;
};

export const getMasterProductCategoryUrl = (
  isPageable?: boolean,
  pageIndex?: number,
  pageSize?: number,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterEngineBaseUrl() + getLiteProductCategoryUrl();
  let params = new HttpParams();
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};
export const getMasterProductGroupUrl = (
  isPageable?: boolean,
  pageIndex?: number,
  pageSize?: number,
  sort?: string[],
  productType?: string
): { path: string; params: HttpParams } => {
  const path = getMasterEngineBaseUrl() + getLiteProductGroupUrl();
  let params = new HttpParams();
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  if (productType !== null && productType !== undefined) {
    params = params.append('plainStudded', productType);
  }

  return {
    path,
    params
  };
};
export const getMasterPriceGroupUrl = (
  isPageable?: boolean
): { path: string; params: HttpParams } => {
  const path = getProduct() + `/lite-data/priceGroups`;
  let params = new HttpParams();

  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }

  return {
    path,
    params
  };
};

export const getMasterComplexityUrl = (
  isPageable?: boolean
): { path: string; params: HttpParams } => {
  const path = getProduct() + `/lite-data/complexities?`;
  let params = new HttpParams();

  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }

  return {
    path,
    params
  };
};
export const getMasterCourierUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  locationCode?: string,
  isPageable?: boolean,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterInventoryBaseUrl() + '/couriers';
  let params = new HttpParams();
  if (locationCode) {
    params = params.append('locationCode', locationCode);
  }
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};
export const getMasterStoreUserUrl = (
  pageIndex?: number,
  pageSize?: number,
  employeeCode?: string,
  locationCodes?: string[],
  roleCodes?: string[],
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterEngineBaseUrl() + '/users';
  let params = new HttpParams();
  if (employeeCode) {
    params = params.append('employeeCode', employeeCode);
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
  if (roleCodes) {
    roleCodes.forEach(roleCodevalue => {
      params = params.append('roleCodes', roleCodevalue);
    });
  }
  if (locationCodes) {
    locationCodes.forEach(locationCodevalue => {
      params = params.append('locationCodes', locationCodevalue);
    });
  }
  return {
    path,
    params
  };
};

export const getMasterLocationSummaryUrl = (): string => {
  return getMasterEngineBaseUrl() + '/locations/details';
};
export const getMasterItemByCodeUrl = (itemCode): string => {
  return getMasterProductBaseUrl() + `/items/${itemCode}`;
};

export const getMasterItemByItemCodeUrl = (): string => {
  return getMasterEngineBaseUrl() + `/products/items`;
};

export const getMasterInventoryLovsEndpointUrl = (
  lovType: string,
  isActive?: any
): { path: string; param: HttpParams } => {
  const path =
    getMasterInventoryBaseUrl() + getMasterLovsBaseUrl() + `/${lovType}`;
  let param = new HttpParams();
  if (isActive === true || isActive === false) {
    param = param.set('isActive', String(isActive));
  }

  return { path, param };
};
export const getMasterLocationLovsEndpointUrl = (
  lovType: string
): { path: string } => {
  return {
    path: getMasterLocationBaseUrl() + getMasterLovsBaseUrl() + `/${lovType}`
  };
};
export const getMasterProductLovsEndpointUrl = (
  lovType: string
): { path: string } => {
  return {
    path: getMasterProductBaseUrl() + getMasterLovsBaseUrl() + `/${lovType}`
  };
};

export const getMasterPaymentLovsEndpointUrl = (
  lovType: string
): { path: string } => {
  return {
    path: getMasterPaymentBaseurl() + getMasterLovsBaseUrl() + `/${lovType}`
  };
};

export const getMasterUserLovsEndpointUrl = (
  lovType: string,
  isActive: boolean
): { path: string; params: HttpParams } => {
  const path =
    getMasterStoreUserBaseUrl() + getMasterLovsBaseUrl() + `/${lovType}`;

  const params = new HttpParams().set('isActive', String(isActive));
  return { path, params };
};

export const getEngineSalesLovsEndpointUrl = (
  lovType: string
): { path: string } => {
  return { path: getMasterEngineBaseUrl() + '/payments' + `/lovs/${lovType}` };
};

export const getReportLovsEndpointUrl = (lovType: string): { path: string } => {
  return { path: getMasterReportBaseUrl() + `/lovs/${lovType}` };
};

export const getEngineproductLovsEndpointUrl = (
  lovType: string
): { path: string } => {
  return { path: getMasterEngineBaseUrl() + '/products' + `/lovs/${lovType}` };
};
export const getEngineLocationLovsEndpointUrl = (lovType: string): string => {
  return getMasterEngineBaseUrl() + '/locations' + `/lov/${lovType}`;
};
export const getEnginePaymentLovsEndpointUrl = (
  lovType: string
): { path: string } => {
  return { path: getMasterEngineBaseUrl() + '/payments' + `/lovs/${lovType} ` };
};
export const getConfigLovsEndpointUrl = (lovType: string): string => {
  return getMasterConfigBaseurl() + '/locations' + `/lov/${lovType}`;
};
export const getEngineConfigLovsEndpointUrl = (
  lovType: string,
  isPageable?: boolean,
  sorting?: boolean
): { path: string; params: HttpParams } => {
  const path = getMasterEngineBaseUrl() + '/configs' + `/lovs/${lovType}`;
  let params = new HttpParams();
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  if (sorting) {
    params = params.append('sort', 'code,ASC');
  }
  return {
    path,
    params
  };
};

export const getMasterBinDetailsUrl = (
  binGroupCode: string,
  isPageable?: boolean,
  pageIndex?: number,
  pageSize?: number,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterInventoryBaseUrl() + `/lite-data/${binGroupCode}/bins`;
  let params = new HttpParams();
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
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
export const getMasterStoreBinsUrl = (
  binType: string
): { path: string; params: HttpParams } => {
  const path = getMasterInventoryBaseUrl() + '/lite-data/bins';
  const params = new HttpParams().set('binType', binType);
  return {
    path,
    params
  };
};
export const getMasterBrandsUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  isPageable?: boolean,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterLocationBaseUrl() + '/brands';
  let params = new HttpParams();
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};
export const getMasterBrandsbyBrandCodeUrl = (brandCode: string): string => {
  return getMasterLocationBaseUrl() + `/brands/${brandCode}`;
};
export const getBrandSummaryUrl = (
  isPageable?: boolean,
  parentBrandCode?: string,
  parentBrandCodes?: string[],
  pageIndex?: number,
  pageSize?: number,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterLocationBaseUrl() + `/lite-data/brands`;
  let params = new HttpParams();
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

  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  if (
    parentBrandCode !== '' &&
    parentBrandCode !== null &&
    parentBrandCode !== undefined
  ) {
    params = params.append('parentBrandCode', parentBrandCode.toString());
  }

  if (parentBrandCodes !== null && parentBrandCodes !== undefined) {
    params = params.append('parentBrandCodes', `${parentBrandCodes}`);
  }
  return {
    path,
    params
  };
};
export const getMasterRegionsUrl = (
  regionType: string,
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  isPageable?: boolean,
  parentRegionCode?: string,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterLocationBaseUrl() + '/regions';
  let params = new HttpParams();

  if (regionType !== null && regionType !== undefined) {
    params = params.append('regionType', regionType);
  }

  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
  }
  if (pageIndex !== null && pageIndex !== undefined) {
    params = params.append('page', pageIndex.toString());
  }
  if (pageSize !== null && pageSize !== undefined) {
    params = params.append('size', pageSize.toString());
  }
  if (parentRegionCode) {
    params = params.append('parentRegionCode', parentRegionCode);
  }
  if (sort) {
    sort.forEach(sortvalue => {
      params = params.append('sort', sortvalue);
    });
  }
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};

export const getMasterListOfPaymentMode = (
  paymentCode?: string,
  isPageable?: boolean
): { path: string; params: HttpParams } => {
  const path = getMasterPaymentBaseurl() + `/lite-data/payments`;
  let params = new HttpParams();
  if (paymentCode !== null && paymentCode !== undefined) {
    params = params.append('paymentCode', paymentCode.toString());
  }

  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};

export const getMasterListOfPaymentTransactionTypes = (
  transactionType?: string,
  isPageable?: boolean,
  isTrue?: boolean,
  searchType?: string
): { path: string; params: HttpParams } => {
  const path = getMasterPaymentBaseurl() + `/lite-data/transaction-types`;
  let params = new HttpParams();
  if (transactionType !== null && transactionType !== undefined) {
    params = params.append('transactionType', transactionType.toString());
  }

  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  if (isTrue !== null && isTrue !== undefined) {
    params = params.append('isTrue', isTrue.toString());
  }

  if (searchType !== null && searchType !== undefined) {
    params = params.append('searchType', searchType);
  }
  return {
    path,
    params
  };
};

export const getMasterProductCategoryMasterUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  isPageable?: boolean,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterProductBaseUrl() + getProductCategoryUrl();
  let params = new HttpParams();
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};
export const getMasterProductGroupMasterUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  isPageable?: boolean,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterProductBaseUrl() + getProductGroupUrl();
  let params = new HttpParams();
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};

export const getMasterIBTLocationsSummaryUrl = (
  pageIndex?: number,
  pageSize?: number,
  regionType?: string,
  locationType?: string[],
  ownerTypeCode?: string[],
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams();
  if (pageIndex !== null && pageIndex !== undefined) {
    params = params.append('page', pageIndex.toString());
  }
  if (pageSize !== null && pageSize !== undefined) {
    params = params.append('size', pageSize.toString());
  }

  if (ownerTypeCode) {
    for (let i = 0; i < ownerTypeCode.length; i++) {
      params = params.append('ownerTypeCode', ownerTypeCode[i]);
    }
  }
  if (locationType) {
    for (let i = 0; i < locationType.length; i++) {
      params = params.append('locationType', locationType[i]);
    }
  }
  if (sort) {
    sort.forEach(sortvalue => {
      params = params.append('sort', sortvalue);
    });
  }
  if (regionType && regionType !== '') {
    params = params.append('regionType', regionType);
  }
  return {
    path: getMasterLocationBaseUrl() + '/lite-data/ibt/locations',
    params
  };
};
export const getMasterLocationSummaryByCodeUrl = (locationCode): string => {
  return getMasterLocationBaseUrl() + `/lite-data/locations/${locationCode}`;
};

export const getMasterLocationDetailsByCodeUrl = (locationCode): string => {
  return getMasterEngineBaseUrl() + `/locations/${locationCode}/cache`;
};

export const getMasterRegionSummaryByCodeUrl = (
  isPageable?: boolean,
  parentRegionCode?: string,
  pageIndex?: number,
  pageSize?: number,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path = getMasterLocationBaseUrl() + `/lite-data/regions`;
  let params = new HttpParams();
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  if (
    parentRegionCode !== '' &&
    parentRegionCode !== null &&
    parentRegionCode !== undefined
  ) {
    params = params.append('parentRegionCode', parentRegionCode.toString());
  }
  return {
    path,
    params
  };
};
export const getMasterProductGroupSummaryByCodeUrl = (
  productGroupCode
): string => {
  return getMasterProductBaseUrl() + `/product-groups/${productGroupCode}`;
};
export const getMasterItemSummaryByCodeUrl = (
  itemCode
): { path: string; params: HttpParams } => {
  return {
    path: getMasterEngineBaseUrl() + `/products/items`,
    params: new HttpParams().set('itemCodes', itemCode)
  };
};
export const getMasterItemStoneDetailsUrl = (
  itemCode,
  lotnumber,
  locationCode
): { path: string; params: HttpParams } => {
  if (locationCode) {
    return {
      path: getMasterEngineBaseUrl() + `/products/items/${itemCode}/stones`,
      params: new HttpParams()
        .set('lotNumber', lotnumber)
        .set('locationCode', locationCode)
    };
  } else {
    return {
      path: getMasterEngineBaseUrl() + `/products/items/${itemCode}/stones`,
      params: new HttpParams().set('lotNumber', lotnumber)
    };
  }
};
export const getMasterItemWithoutLotStoneDetailsUrl = (
  itemCode
): { path: string } => {
  return {
    path: getMasterEngineBaseUrl() + `/products/${itemCode}/stones`
  };
};
export const getMasterItemSummaryConversionCodeUrl = (
  itemCode: string,
  lotNumber?: string
): { path: string; params: HttpParams } => {
  let params = new HttpParams();
  if (lotNumber && lotNumber !== '') {
    params = params.append('lotNumber', lotNumber);
  }
  return {
    path: getMasterProductBaseUrl() + `/lite-data/conversion/${itemCode}`,
    params: params
  };
};
export const getMasterCourierSummaryUrl = (
  pageIndex?: number,
  pageSize?: number,
  isActive?: boolean,
  sort?: string[]
): { path: string; params: HttpParams } => {
  const path = getMasterInventoryBaseUrl() + '/lite-data/couriers';
  let params = new HttpParams();
  if (isActive !== null && isActive !== undefined) {
    params = params.append('isActive', isActive.toString());
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

export const getMasterStoreUserDetailsUrl = (employeeCode: string): string => {
  return getMasterStoreUserBaseUrl() + `/store/user/${employeeCode}`;
};

export const getMasterPinCodesSummaryUrl = (
  countryCode: string,
  pincode: string,
  pageIndex?: number,
  pageSize?: number,
  isPageable?: boolean,
  sort?: string[]
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getMasterEngineBaseUrl() + `/locations/countries/${countryCode}/pincodes`;
  let params = new HttpParams();
  if (pincode) {
    params = params.append('pincode', pincode);
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
  if (isPageable !== null && isPageable !== undefined) {
    params = params.append('isPageable', isPageable.toString());
  }
  return {
    path,
    params
  };
};

export const getMasterProductCategoryMasterCacheUrl = (): string => {
  return getMasterEngineBaseUrl() + getLiteProductCategoryUrl() + `/cache`;
};

export const getMasterProductGroupMasterCacheUrl = (): string => {
  return getMasterEngineBaseUrl() + getLiteProductGroupUrl() + `/cache`;
};

export const getMasterItemUrlByCodeUrl = (): string => {
  return getMasterEngineBaseUrl() + `/products/items`;
};

export const getvendorsCodeUrl = (vendorCode: string): string => {
  return getVendorsCodeUrl() + `/${vendorCode}`;
};
