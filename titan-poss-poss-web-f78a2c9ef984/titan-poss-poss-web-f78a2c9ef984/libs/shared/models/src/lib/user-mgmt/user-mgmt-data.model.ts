export interface CountryData {
  description: string;
  countryCode: string;
}

export interface RoleTypesData {
  code: string;
  value: string;
}

export interface EmailMobileData {
  fieldtype: string;
  value: string;
}

export interface LocationData {
  locationCode: string;
  countryCode: string;
  ownerTypeCode?: string;
}

export interface LocationMappingData {
  id: string;
  description: string;
}
export interface LocationMappingPayLoad {
  addeLocations?: string[];
  removeLocations?: string[];
  updateLocations?: string[];
}


