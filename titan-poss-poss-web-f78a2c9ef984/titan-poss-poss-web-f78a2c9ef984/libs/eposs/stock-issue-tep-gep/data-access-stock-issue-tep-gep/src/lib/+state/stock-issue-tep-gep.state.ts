import {
  ItemsEntity,
  StockIssueItemsEntity
} from './stock-issue-tep-gep.entity';
import {
  CustomErrors,
  ProductCategory,
  ProductGroup,
  LocationSummaryDetails,
  CreateStockIssueResponse,
  Filter,
  Column,
  StoreUser
} from '@poss-web/shared/models';

export class IssueTEPState {
  createStockIssueResponse: CreateStockIssueResponse;
  updateStockIssueResponse: CreateStockIssueResponse;
  items: ItemsEntity;
  updateAllStockIssueItemsResponse: boolean;
  createStockIssueItemsResponse: boolean;
  stockIssueItems: StockIssueItemsEntity;
  searchItems: ItemsEntity;
  searchStockIssueItems: StockIssueItemsEntity;
  totalItemsCount: number;
  totalStockIssueItemsCount: number;
  factoryAddress: LocationSummaryDetails;
  cfaAddress: LocationSummaryDetails;
  productCategories: ProductCategory[];
  productGroups: ProductGroup[];
  courierDetails: string[];
  LocationCode: string[];
  employeeCodes: string[];
  employeeDetails: StoreUser[];
  sortDataItems: Column[];
  sortDataStockIssueItems: Column[];
  filterDataItems: { [key: string]: Filter[] };
  filterDataStockIssueItems: { [key: string]: Filter[] };
  hasError?: CustomErrors;
  isLoading?: boolean;
  isCourierDetailsLoading?: boolean;
  isEmployeeCodesLoading?: boolean;
  isProductCategoriesLoading?: boolean;
  isProductGroupsLoading?: boolean;
  isFactoryAddressLoading?: boolean;
  studdedProductGroups: string[];
  isLoadingImage: boolean;
  selectedStockIssueResponse: CreateStockIssueResponse;
}
