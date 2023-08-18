import {
  StockRequestNote,
  ProductCategory,
  ProductGroup,
  RequestList,
  StoreUser,
  IssueAdvanceFilterPayload,
  CustomErrors,
  Filter, Column, RegenerateFileResponse
} from '@poss-web/shared/models';
import {
  IssueItemEntity,
  RequestStockTransferNoteEntity
} from './stock-issue.entity';


export interface StockIssueState {
  issueFactorySTN: RequestStockTransferNoteEntity;
  issueBoutiqueSTN: RequestStockTransferNoteEntity;
  issueMerchantSTN: RequestStockTransferNoteEntity;

  isLoadingIssueFactorySTN: boolean;
  isLoadingIssueBoutiqueSTN: boolean;
  isLoadingIssueMerchantSTN: boolean;

  pendingBTQ_FAC_STNCount: number;
  pendingBTQ_BTQ_STNCount: number;
  pendingBTQ_MER_STNCount: number;

  isLoadingIssueCount: boolean;

  searchIssueResults: RequestStockTransferNoteEntity;
  isSearchingIssues: boolean;
  hasSearchIssueResults: boolean;

  isStockIssueListReset: boolean;

  //DETAILS PAGE

  selectedIssue: StockRequestNote;
  isLoadingSelectedIssue: boolean;
  hasSelectedIssue: boolean;

  regenerateFile: RegenerateFileResponse;
  isFileLoading: boolean;

  isItemsTotalCountLoading: boolean;
  isItemsTotalCountLoaded: boolean;

  issueItems: IssueItemEntity;
  isIssueItemsLoading: boolean;
  issueItemsTotalCount: number;

  approvedItems: IssueItemEntity;
  isApprovedItemsLoading: boolean;
  approvedItemsTotalCount: number;

  selectedItems: IssueItemEntity;
  isSelectedItemsLoading: boolean;
  selectedItemsTotalCount: number;

  searchedItems: IssueItemEntity;
  isSearchingItems: boolean;
  hasSearchedItems: boolean;

  isSearchIssueItemsCountLoaded: boolean;
  searchedIssueItemsCount: number;

  updateItemSuccess: boolean;
  isitemUpdating: boolean;

  isupdateItemLoading: boolean;
  isItemUpdated: boolean;

  isUpdatingAllItems: boolean;
  isUpdatingAllItemsSuccess: boolean;

  confirmIssue: StockRequestNote;
  isItemIssued: boolean;

  courierDetails: string[];
  isLoadingCourierDetails: boolean;
  hasCourierDetails: boolean;

  employeeCodes: string[];
  employeeDetails: StoreUser[];

  productCategories: ProductCategory[];
  productGroups: ProductGroup[];
  isLoading: boolean;

  filterDataAllProducts: { [key: string]: Filter[] };
  filterDataSelectedProducts: { [key: string]: Filter[] };

  sortDataAllProducts: Column[];
  sortDataSelectedProducts: Column[];

  items: IssueItemEntity;
  isItemsLoading: boolean;
  isItemsLoaded: boolean;
  itemsCount: number;

  updateItemListStatusResponse: RequestList;

  totalMeasuredWeight: number;
  totalMeasuredValue: number;

  issueHistory: RequestStockTransferNoteEntity;
  isLoadingHistory: boolean;
  issueHistoryCount: number;

  isLoadingSelectedHistory: boolean;
  hasSelectedHistory: boolean;
  selectedHistory: StockRequestNote;

  isLoadingHistoryItems: boolean;
  isHistoryItemsLoaded: boolean;
  historyItems: IssueItemEntity;
  historyItemsCount: number;

  historyItemsTotalCount: number;
  isLoadingHistoryItemsTotalCount: boolean;

  advancedFilterData: IssueAdvanceFilterPayload;

  studdedProductGroups: string[];

  error: CustomErrors;

  // cancel STN
  issueCancelSTN: RequestStockTransferNoteEntity;
  totalIssueCancelSTNCount: number;
  cancelIssueItems: IssueItemEntity;
  isLoadingIssueCancelSTN: boolean;
  pendingBTQ_BTQ_STNCancelCount: number;
  cancelIssueItemsCount: number;
  cancelIssuesSTNRes: StockRequestNote;
  cancelIssueSTNDetails: StockRequestNote;
  isLoadingImage: boolean;
}
