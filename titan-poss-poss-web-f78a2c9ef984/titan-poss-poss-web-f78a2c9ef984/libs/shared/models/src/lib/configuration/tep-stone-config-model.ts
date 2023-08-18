export interface TEPStoneConfigListingPayload {
  pageIndex: number;
  pageSize: number;
}

export interface TEPStoneConfigListing {
  results: TEPStoneConfig[];
  totalElements: number;
}

export interface TEPStoneConfig {
  description?: string;
  isActive: boolean;
  itemCode?: string;
  configId: string;
  configType?: string;
}

export interface TEPStoneConfigDetailsListing {
  results: TEPStoneConfigDetails[];
  totalElements: number;
}

export interface TEPStoneConfigQualities {
  name: string;
}

export interface TEPStoneConfigStoneType {
  stoneTypeCode: string;
  description: string;
}

export interface TEPStoneConfigRange {
  id: string;
  range: string;
}

export enum TEPStoneConfigEnum {
  NEW = 'NEW',
  new = 'new',
  edit = 'edit',
  TEP_STONE = 'TEP_STONE'
}
export enum TEPStoneConfigGridEnum {
  ADD = 'ADD',
  EDIT = 'EDIT',
  REMOVE = 'REMOVE'
}

export interface TEPStoneDetailsModify {
  addStones?: TEPStoneConfigDetails[];
  removeStones?: string[];
  updateStones?: TEPStoneConfigDetails[];
}

export interface TEPStoneConfigDetails {
  id?: string;
  rowId?: number;
  configId?: string;
  dedutionPercent: number;
  range?: string;
  rangeId: string;
  stoneQuality: string;
  stoneTypeCode: string;
  description?: string;
}
