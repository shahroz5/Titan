import {
  OtherIssueEntity,
  OtherIssueItemEntity,
  OtherIssueCreateItemEntity,
  OtherIssueHistoryItemEntity
} from './other-issues.entity';
import {
  CustomErrors,
  RequestOtherIssueStockTransferNote,
  OtherIssuesCreateStockResponse,
  ProductCategory,
  ProductGroup,
  Filter,
  Column,
  OtherIssueTransferType,
  OtherIssueModel,
  OtherReceiptsIssuesAdvanceFilterPayload
} from '@poss-web/shared/models';

export interface OtherIssuesState {
  pendingOtherIssuesSTNCount: number;

  hasError?: string;
  isLoading: boolean;
  studdedProductGroups: string[];
  isSearchingStocks: boolean;
  hasSearchStockResults: boolean;
  searchIssueStockResults: OtherIssueEntity;
  otherIssuesList: OtherIssueEntity;
  otherIssueLoanList: OtherIssueEntity;
  isLoadingOtherIssuesList: boolean;
  isLoadingOtherIssuesLoanList: boolean;

  otherIssuesDropdownValues: OtherIssueTransferType[];

  error: CustomErrors;
  selectedDropDownForIssues: string;
  selectedIssue: RequestOtherIssueStockTransferNote;
  isItemIssued: boolean;
  issueItemsTotalCount: number;
  totalElementsOtherIssues: number;
  nonVerifiedOtherIssuesItems: OtherIssueItemEntity;
  isLoadingOtherIssueSelectedStock: boolean;
  isSearchingOtherIssueItems: boolean;
  hasSearchedOtherssueIItems: boolean;
  createOtherStockIssueItemsResponse: any;
  isLoadingOtherIssueDetails: boolean;

  confirmOtherStockIssueResponse: any;
  //create  page
  createOtherIssueStockRequestResponse: OtherIssuesCreateStockResponse;
  isCreateOtherIssueStockRequestPending: boolean;

  allOtherIssueCreateItems: OtherIssueCreateItemEntity;
  isallOtherIssueCreateItemsLoading: boolean;

  selectedOtherIssueCreateItems: OtherIssueCreateItemEntity;
  isselectedOtherIssueCreateItemsLoading: boolean;

  allOtherIssueCreateItemsTotalCount: number;
  selectedOtherIssueCreateItemsTotalCount: number;
  isOtherIssueCreateItemTotalCountLoaded: boolean;
  isOtherIssueItemTotalCountLoading: boolean;

  isSearchingOtherIssueCreateItems: boolean;
  hasSearchedOtherssueCreateItems: boolean;

  createOtherIssueStockRequestItemsResponse: any;
  isLoadingOtherIssueRequestItemsResponse: boolean;

  removeOtherIssueStockRequestItemsResponse: any;
  isLoadingOtherIssueStockRequestItemsResponse: boolean;

  updateStockRequestCreateItemResponse: any;
  isLoadingUpdateStockRequestCreateItemResponse: boolean;

  updateStockRequestResponse: any;
  isLoadingUpdateStockRequestResponse: boolean;

  //adjustment
  searchedAdjustmentItems: OtherIssueItemEntity;
  isSearchingAdjustment?: boolean;
  hasSearchedItemAdjustment?: boolean;
  searchCountAdjustment: number;
  adjustmentItemsInCarts: OtherIssueItemEntity;
  adjustmentItemsInCartsSearch: OtherIssueItemEntity;
  hasSearchItemInCartSearch: boolean;
  createStockRequestAdjustmentResponse: any;
  isLoadingAdjustment: boolean;

  otherIssueADJList: OtherIssueEntity;
  isLoadingOtherIssuesADJList: boolean;

  otherIssueLossList: OtherIssueEntity;
  isLoadingOtherIssuesLossList: boolean;

  otherIssuePSVList: OtherIssueEntity;
  isLoadingOtherIssuesPSVList: boolean;

  //psv
  searchedPSVItems: OtherIssueItemEntity;
  isSearchingPSV?: boolean;
  hasSearchedItemPSV?: boolean;
  searchCountPSV: number;
  psvItemsInCarts: OtherIssueItemEntity;
  psvItemsInCartsSearch: OtherIssueItemEntity;
  hasSearchItemInCartSearchPSV: boolean;
  createStockRequestPSVResponse: any;
  isLoadingPSV: boolean;

  //FOC
  searchedFOCItems: OtherIssueItemEntity;
  isSearchingFOC?: boolean;
  hasSearchedItemFOC?: boolean;
  searchCountFOC: number;
  focItemsInCarts: OtherIssueItemEntity;
  focItemsInCartsSearch: OtherIssueItemEntity;
  hasSearchItemInCartSearchFOC: boolean;
  createStockRequestFOCResponse: any;
  isLoadingFOC: boolean;

  otherIssueFOCList: OtherIssueEntity;
  isLoadingOtherIssuesFOCList: boolean;

  isLoadingCancelStockRequestResponse: boolean;
  cancelStockRequestResponse: any;
  printDataResponse: any;

  productCategories: ProductCategory[];
  productGroups: ProductGroup[];
  filterDataAllProducts: { [key: string]: Filter[] };
  filterDataSelectedProducts: { [key: string]: Filter[] };

  sortDataAllProducts: Column[];
  sortDataSelectedProducts: Column[];

  filterDataOtherIssue: { [key: string]: Filter[] };
  sortDataotherIssue: Column[];

  //HISTORY
  otherIssueHistory: OtherIssueEntity;
  isLoadingHistory: boolean;
  otherIssueHistoryCount: number;
  isLoadingHistoryCount: boolean;

  isLoadingSelectedHistory: boolean;
  hasSelectedHistory: boolean;
  selectedHistory: OtherIssueModel;
  historyItemsCount: number;
  historyItems: OtherIssueHistoryItemEntity;
  isLoadingHistoryItems: boolean;
  isHistoryItemsLoaded: boolean;

  historyItemsTotalCount: number;
  isLoadingHistoryItemsTotalCount: boolean;
  isHistoryItemsTotalCountLoaded: boolean;

  advancedfilter: OtherReceiptsIssuesAdvanceFilterPayload;
}
