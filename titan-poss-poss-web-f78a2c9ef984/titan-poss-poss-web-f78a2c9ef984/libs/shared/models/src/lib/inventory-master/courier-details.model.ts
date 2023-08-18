export interface CourierMaster {
  courierName: string;
  address: string;
  stateName: string;
  townName: string;
  description: string;
  mailId: string;
  mobileNumber: string;
  contactPerson: string;
  isActive: boolean;
  countryCode: string;
}
export interface CourierDetailsListing {
  courierName: string;
  isActive: boolean;
}
export interface LoadCourierDetailsPayload {
  pageIndex: number;
  pageSize: number;
}
export interface LoadCourireDetailsListingSuccessPayload {
  courierDetailsListing: CourierDetailsListing[];
  totalElements: number;
}

export interface UpdateCourierDetailsPayload {
  courierName: string;
  data: {
    address: string;
    stateName: string;
    townName: string;
    description: string;
    mailId: string;
    mobileNumber: string;
    contactPerson: string;
    isActive: boolean;
    countryCode: string;
  };
}
export interface CountrySuccessPayload {
  id: string;
  name: string;
}
export interface StatesSuccessPayload {
  id: string;
  stateCode: string;
  description: string;
}
export interface TownsSuccessPayload {
  id: string;
  name: string;
  state_id: string;
}

export interface LocationMappingPayload {
  courierName: string;
  locationMapping: {
    addLocations: string[];
    removeLocations: string[];
  };
}

export interface CourierSelectedLocations {
  id: string;
  description: string;
}
