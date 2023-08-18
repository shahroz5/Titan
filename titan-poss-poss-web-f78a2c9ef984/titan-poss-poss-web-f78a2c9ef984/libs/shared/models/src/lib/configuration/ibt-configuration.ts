export interface IbtConfigurationListPayload {
  pageIndex: number;
  pageSize: number;
  length: number;
}
export interface IbtConfigurationList {
  ibtConfigList: IbtConfiguration[];
  totalElements: number;
}

export interface IbtConfiguration {
  configId?: string;
  configType?: string;
  description?: string;
  isActive?: boolean;
  ruleDetails?: {
    data: {};
    type: string;
  };
}
export interface IbtConfigurationResponse {
  configId: string;
  configType: string;
  description: string;
  isActive: boolean;
  maxProductsPerStn: string;
  maxReqPerMonth: string;
  maxValPerStn: string;
  validRequestTime: string;
}

export interface UpdateIbtConfigurationPayload {
  configId: string;
  isActive: string;
  ruleDetails?: {
    data: {};
    type: string;
  };
}

export interface IbtConfigFieldValue {
  noOfRequestPerMonth?: string;
  maxNoOfProductsPerStn?: string;
  maxValuePerSTN?: string;
  requestValidUpto?: string;
}

export interface SaveLocationMappingPayload {
  locations: SaveLocation;
  configId: string;
}
export interface SaveLocation {
  addLocations: string[];
  overwriteMapping: boolean;
  removeLocations: string[];
}
export enum ibtConfigEnums {
  IBT_CONFIGURATIONS = 'IBT_CONFIGURATIONS'
}
