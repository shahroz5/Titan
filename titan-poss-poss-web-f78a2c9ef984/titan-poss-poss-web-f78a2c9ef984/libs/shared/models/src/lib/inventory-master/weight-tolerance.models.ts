import { CustomErrors } from '../error.model';

export interface ConfigDetails {
  configId: string;
  description: string;
  configType: string;
  orgCode: string;
  productCategoryCode: string;
  isActive: boolean

}

export interface ConfigDetailsList {
  configDetails: ConfigDetails[];
  totalConfigDetails: number;
}
export interface Tolerance {
  id: any
  productGroupCode: string,
  rangeId: number
  value: number

}

export interface SaveTolerance {
  productGroupCode?: string,
  rangeId?: number
  value?: number
}
export interface RangeWeight {
  id: number;
  fromRange: number;
  toRange: number
}

export interface ProductGroupCode {
  productGroupCode: number;
  description: string
}



export interface SaveTolerancePayload {
  tolerance: SaveTolerance;
  configId: any;
}
export interface LocationPayload {
  addLocations: string[];
  removeLocations: string[];
}
export interface LocationMapping {
  locations: LocationPayload;
  configId: string;
}

export interface UpdateTolerancePayloadSuccess {
  configProductId: number;
  newTolerance: SaveTolerance;
}
export interface UpdateTolerancePayload {
  configId: any;
  newTolerance: SaveTolerance;
  actualTolerance: SaveTolerance;
  configProductId: any;
}

export interface UpdateToleranceFailurePayload {
  id: any;
  actualTolerance: SaveTolerance;
  error: CustomErrors;
}
export interface InventoryConfigurationListingPayload {
  pageIndex: number;
  pageSize: number;
}
export interface LoadSelectedConfigDetailsPayload {
  configId: string;
}

export interface UpadateToleranceIsActivePayload {
  configId: string;
  isActive: boolean;
}
