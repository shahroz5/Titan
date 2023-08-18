export interface UrlLevelPermissionResponseModel {
  results: TransactionCodesModel[];
}

export interface TransactionCodesModel {
  url: string;
  transactionCodes: string[];
}

export interface ElementLevelPermissionListModel {
  data: ElementLevelPermissionItemModel[];
}

export interface AclUrlPermissionRequestBody {
  urls: string[];
}

export interface ElementLevelPermissionModel {
  results: ElementLevelPermissionItemModel[];
}

export interface ElementLevelPermissionItemModel {
  element: string;
  url: string;
  transactionCodes: string[];
  authorisedStrategy: string;
  unauthorisedStrategy: string;
}
