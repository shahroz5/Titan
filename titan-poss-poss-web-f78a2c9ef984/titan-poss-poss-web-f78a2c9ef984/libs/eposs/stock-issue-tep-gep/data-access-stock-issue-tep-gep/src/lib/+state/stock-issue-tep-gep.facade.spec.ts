import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  Column,
  CreateStockIssueItemsPayload,
  CreateStockIssuePayload,
  Filter,
  LoadStockIssueItemsPayload,
  UpdateStockIssuePayload
} from '@poss-web/shared/models';
import {
  CreateStockIssue,
  CreateStockIssueItems,
  LoadCourierDetails,
  LoadEmployeeCodes,
  LoadEmployeeDetails,
  LoadFactoryAddress,
  LoadItems,
  LoadProductCategories,
  LoadProductGroups,
  LoadStockIssueItems,
  LoadStuddedProductGroups,
  LoadTotalItemsCount,
  LoadTotalStockIssueItemsCount,
  ResetAll,
  ResetList,
  ResetResponse,
  SearchClear,
  SetFilterDataItems,
  SetFilterDataStockIssueItems,
  SetSortDataItems,
  SetSortDataStockIssueItems,
  UpdateAllStockIssueItems,
  UpdateStockIssue
} from './stock-issue-tep-gep.action';
import { IssueTEPFacade } from './stock-issue-tep-gep.facade';
import { initialState } from './stock-issue-tep-gep.reducers';
import { IssueTEPState } from './stock-issue-tep-gep.state';

describe('Issue TEP-GEP facade Testing Suite action', () => {
  let issueTEPFacade: IssueTEPFacade;

  let store: Store<IssueTEPState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), IssueTEPFacade]
    });

    issueTEPFacade = TestBed.inject(IssueTEPFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Actions', () => {
    const createStockIssuePayload: CreateStockIssuePayload = {
      transferType: 'TEP_PLAIN',
      storeType: 'L1'
    };

    const updateStockIssuePayload: UpdateStockIssuePayload = {
      id: 12,
      transferType: 'TEP_PLAIN',
      storeType: 'L1',
      remarks: 'string'
    };

    const loadStockIssueItemsPayload: LoadStockIssueItemsPayload = {
      id: 12,
      transferType: 'TEP_PLAIN',
      storeType: 'L1',
      status: 'OPEN'
    };

    const createStockIssueItemsPayload: CreateStockIssueItemsPayload = {
      id: 12,
      transferType: 'TEP_PLAIN',
      storeType: 'L1',
      itemIds: ['20D16ABE-DB4E-4E25-BD4C-20126C3B7D79']
    };

    const courierDetailsReq: string = 'CPD';

    const employeeDetailsReq: string = 'ID1';

    const sortData: Column[] = [
      {
        id: 13,
        sortByColumnName: 'TOTAL_WEIGHT',
        sortAscOrder: true
      }
    ];

    const filterArray = [
      {
        id: 14,
        description: 'PLAIN',
        selected: true
      }
    ];

    const filterData: { [key: string]: Filter[] } = {
      filter: filterArray
    };

    it('should call CreateStockIssue action', () => {
      const action = new CreateStockIssue(createStockIssuePayload);
      issueTEPFacade.createStockIssue(createStockIssuePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateStockIssue action', () => {
      const action = new UpdateStockIssue(updateStockIssuePayload);
      issueTEPFacade.updateStockIssue(updateStockIssuePayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadItems action', () => {
      const action = new LoadItems(loadStockIssueItemsPayload);
      issueTEPFacade.loadItems(loadStockIssueItemsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateAllStockIssueItems action', () => {
      const action = new UpdateAllStockIssueItems(createStockIssueItemsPayload);
      issueTEPFacade.updateAllStockIssueItems(createStockIssueItemsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call CreateStockIssueItems action', () => {
      const action = new CreateStockIssueItems(createStockIssueItemsPayload);
      issueTEPFacade.createStockIssueItems(createStockIssueItemsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadStockIssueItems action', () => {
      const action = new LoadStockIssueItems(loadStockIssueItemsPayload);
      issueTEPFacade.loadStockIssueItems(loadStockIssueItemsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadTotalItemsCount action', () => {
      const action = new LoadTotalItemsCount(loadStockIssueItemsPayload);
      issueTEPFacade.loadTotalItemsCount(loadStockIssueItemsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadTotalStockIssueItemsCount action', () => {
      const action = new LoadTotalStockIssueItemsCount(
        loadStockIssueItemsPayload
      );
      issueTEPFacade.loadTotalStockIssueItemsCount(loadStockIssueItemsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadFactoryAddress action', () => {
      const action = new LoadFactoryAddress();
      issueTEPFacade.loadFactoryAddress();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadProductGroups action', () => {
      const action = new LoadProductGroups();
      issueTEPFacade.loadProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadProductCategories action', () => {
      const action = new LoadProductCategories();
      issueTEPFacade.loadProductCategories();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadCourierDetails action', () => {
      const action = new LoadCourierDetails(courierDetailsReq);
      issueTEPFacade.loadCourierDetails(courierDetailsReq);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadEmployeeCodes action', () => {
      const action = new LoadEmployeeCodes();
      issueTEPFacade.loadEmployeeCodes();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadEmployeeDetails action', () => {
      const action = new LoadEmployeeDetails(employeeDetailsReq);
      issueTEPFacade.loadEmployeeDetails(employeeDetailsReq);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetSortDataItems action', () => {
      const action = new SetSortDataItems(sortData);
      issueTEPFacade.setSortDataItems(sortData);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetSortDataStockIssueItems action', () => {
      const action = new SetSortDataStockIssueItems(sortData);
      issueTEPFacade.setSortDataStockIssueItems(sortData);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetFilterDataItems action', () => {
      const action = new SetFilterDataItems(filterData);
      issueTEPFacade.setFilterDataItems(filterData);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetFilterDataStockIssueItems action', () => {
      const action = new SetFilterDataStockIssueItems(filterData);
      issueTEPFacade.setFilterDataStockIssueItems(filterData);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadStuddedProductGroups action', () => {
      const action = new LoadStuddedProductGroups();
      issueTEPFacade.loadStuddedProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SearchClear action', () => {
      const action = new SearchClear();
      issueTEPFacade.searchClear();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ResetList action', () => {
      const action = new ResetList();
      issueTEPFacade.resetList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ResetResponse action', () => {
      const action = new ResetResponse();
      issueTEPFacade.resetResponse();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ResetAll action', () => {
      const action = new ResetAll();
      issueTEPFacade.resetAll();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Selector', () => {
    it('should access selectCreateStockIssueResponse selector', () => {
      expect(issueTEPFacade.getCreateStockIssueResponse()).toEqual(
        issueTEPFacade['createStockIssueResponse$']
      );
    });

    it('should access selectUpdateStockIssueResponse selector', () => {
      expect(issueTEPFacade.getUpdateStockIssueResponse()).toEqual(
        issueTEPFacade['updateStockIssueResponse$']
      );
    });

    it('should access selectUpdateAllStockIssueItemsResponse selector', () => {
      expect(issueTEPFacade.getUpdateAllStockIssueItemsResponse()).toEqual(
        issueTEPFacade['updateAllStockIssueItemsResponse$']
      );
    });

    it('should access selectItems selector', () => {
      expect(issueTEPFacade.getItems()).toEqual(issueTEPFacade['getItems$']);
    });

    it('should access selectCreateStockIssueItemsResponse selector', () => {
      expect(issueTEPFacade.getCreateStockIssueItemsResponse()).toEqual(
        issueTEPFacade['createStockIssueItemsResponse$']
      );
    });

    it('should access selectStockIssueItems selector', () => {
      expect(issueTEPFacade.getStockIssueItems()).toEqual(
        issueTEPFacade['getStockIssueItems$']
      );
    });

    it('should access selectHasError selector', () => {
      expect(issueTEPFacade.getError()).toEqual(issueTEPFacade['hasError$']);
    });

    it('should access selectIsLoading selector', () => {
      expect(issueTEPFacade.getIsLoading()).toEqual(
        issueTEPFacade['isLoading$']
      );
    });

    it('should access selectTotalItemsCount selector', () => {
      expect(issueTEPFacade.getTotalItemsCount()).toEqual(
        issueTEPFacade['totalItemsCount$']
      );
    });

    it('should access selectTotalStockIssueItemsCount selector', () => {
      expect(issueTEPFacade.getTotalStockIssueItemsCount()).toEqual(
        issueTEPFacade['totalStockIssueItemsCount$']
      );
    });

    it('should access selectFactoryAddress selector', () => {
      expect(issueTEPFacade.getFactoryAddress()).toEqual(
        issueTEPFacade['factoryAddress$']
      );
    });

    it('should access selectProductCategories selector', () => {
      expect(issueTEPFacade.getProductCategories()).toEqual(
        issueTEPFacade['productCategories$']
      );
    });

    it('should access selectProductGroups selector', () => {
      expect(issueTEPFacade.getProductGroups()).toEqual(
        issueTEPFacade['productGroups$']
      );
    });

    it('should access selectCourierDetails selector', () => {
      expect(issueTEPFacade.getCourierDetails()).toEqual(
        issueTEPFacade['courierDetails$']
      );
    });

    it('should access selectEmployeeCodes selector', () => {
      expect(issueTEPFacade.getEmployeeCodes()).toEqual(
        issueTEPFacade['employeeCodes$']
      );
    });

    it('should access selectEmployeeDetails selector', () => {
      expect(issueTEPFacade.getEmployeeDetails()).toEqual(
        issueTEPFacade['employeeDetails$']
      );
    });

    it('should access selectSortDataItems selector', () => {
      expect(issueTEPFacade.getSortDataItems()).toEqual(
        issueTEPFacade['sortDataItems$']
      );
    });

    it('should access selectSortDataStockIssueItems selector', () => {
      expect(issueTEPFacade.getSortDataStockIssueItems()).toEqual(
        issueTEPFacade['sortDataStockIssueItems$']
      );
    });

    it('should access selectFilterDataItems selector', () => {
      expect(issueTEPFacade.getfilterDataItems()).toEqual(
        issueTEPFacade['filterDataItems$']
      );
    });

    it('should access selectFilterDataStockIssueItems selector', () => {
      expect(issueTEPFacade.getfilterDataStockIssueItems()).toEqual(
        issueTEPFacade['filterDataStockIssueItems$']
      );
    });

    it('should access selectIsCourierDetailsLoading selector', () => {
      expect(issueTEPFacade.getIsCourierDetailsLoading()).toEqual(
        issueTEPFacade['isCourierDetailsLoading$']
      );
    });

    it('should access selectIsFactoryAddressLoading selector', () => {
      expect(issueTEPFacade.getIsFactoryAddressLoading()).toEqual(
        issueTEPFacade['isFactoryAddressLoading$']
      );
    });

    it('should access selectIsEmployeeCodesLoading selector', () => {
      expect(issueTEPFacade.getIsEmployeeCodesLoading()).toEqual(
        issueTEPFacade['isEmployeeCodesLoading$']
      );
    });

    it('should access selectIsProductCategoriesLoading selector', () => {
      expect(issueTEPFacade.getIsProductCategoriesLoading()).toEqual(
        issueTEPFacade['isProductCategoriesLoading$']
      );
    });

    it('should access selectIsProductGroupsLoading selector', () => {
      expect(issueTEPFacade.getIsProductGroupsLoading()).toEqual(
        issueTEPFacade['isProductGroupsLoading$']
      );
    });
  });
});
