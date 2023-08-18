import { BinGroups } from '../bin-group/bin-group.model';

export interface LoadBinCodeDetailsListingSuccessPayload {
  binCodeDetailsListing: BinCodeList[];
  totalElements: number;
}

export interface BinCodeSaveNewModel {
  binCode: string;
  binGroups: BinGroups[];
  description: string;
}

export interface BinCodeSaveEditedModel {
  binGroups: BinGroups[];
  description: string;
}

export interface BinCodeList {
  locationCode: string;
  brandCode: string;
  regionCode: string;
  isActive: boolean;
}

// export interface BinCodesByBinGroup {
//   binCode: string,
//   description: string;
// }

export interface BinCodeSaveModel {
  binCode: string;
  binGroups: BinGroups[];
  description: string;
}

export interface BinCodeEditModel {
  binGroups: BinGroups[];
  description: string;
}

export interface BinCodesByBinGroup {
  binCode: string;
  description: string;
  isActive: boolean;
}

export interface BinLocationMapping {
  locationCode: string;
  isActive: boolean;
}

export interface LocationList {
  id: string;
  description: string;
}

export interface LocationMappingPost {
  addLocations: string[];
  binCodes: string[];
  removeLocations: string[];
}

export interface LoadBinCodeDetailsListingSuccessPayload {
  binCodeDetailsListing: BinCodeList[];
  totalElements: number;
}

export interface LoadSearchBinCodeDetails {
  binCodeSearchListing: BinCodesByBinGroup[];
  totalElements: number;
}

export interface LoadBinCodeByBinGroupPayload {
  binCodeDetailsListing: BinCodesByBinGroup[];
}

export interface BinCodeListingPayload {
  binGroupCode?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface SaveBinCodeFormPayload {
  binCode: string;
  binGroups: string[];
  description: string;
}

export interface BinCodeEditedFormPayload {
  binCode: string;
  binGroups: BinGroups[];
  description: string;
}

export interface LocationsByBinGroupAndBinCode {
  binGroup: string;
  binCodes: string[];
}

export interface LocationMappingPostPayload {
  binGroup: string;
  data: LocationMappingPost;
}

export interface SearchBinCodePayload {
  binCode: string;
  binGroupCode: string;
}
