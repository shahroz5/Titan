import {
  Column,
  CreateStockIssueResponse,
  Filter,
  LocationSummaryDetails,
  ProductCategory,
  ProductGroup,
  StockIssueItem,
  StoreUser
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  itemsAdapter,
  stockIssueItemsAdapter
} from './stock-issue-tep-gep.entity';
import { initialState } from './stock-issue-tep-gep.reducers';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './stock-issue-tep-gep.selectors';
import { IssueTEPState } from './stock-issue-tep-gep.state';

describe('Issue TEP-GEP related Selectors', () => {
  const createStockIssueResponse: CreateStockIssueResponse = {
    id: 1,
    srcLocationCode: 'ABO',
    destLocationCode: 'FHJR',
    status: 'OPEN',
    weightUnit: 'gms',
    currencyCode: 'INR',
    srcDocNo: 1001,
    srcFiscalYear: 100,
    srcDocDate: moment(),
    destDocNo: 2001,
    destDocDate: moment(),
    orderType: 'R',
    totalAvailableQuantity: 5,
    totalMeasuredQuantity: 4,
    totalAvailableValue: 50,
    totalMeasuredValue: 60,
    totalAvailableWeight: 12,
    totalMeasuredWeight: 13,
    // for l1/l2
    transferType: 'TEP_PLAIN',
    // for l3
    invoiceType: 'TEP_PLAIN',
    // for l1/l2
    courierReceivedDate: moment(),
    courierDetails: {},
    // for l3
    issuedRemarks: 'remarks'
  };

  const itemsResponse: StockIssueItem[] = [
    {
      id: 1,
      itemCode: '21212121212921',
      lotNumber: '1234567',
      mfgDate: moment(),
      productCategory: 'P',
      productGroup: 'Plain',
      binCode: 'A',
      binGroupCode: 'B',
      stdValue: 120,
      stdWeight: 130,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'OPEN,',
      imageURL: 'url',
      itemDetails: {},
      availableQuantity: 10,
      availableWeight: 100,
      availableValue: 11,
      measuredQuantity: 20,
      measuredWeight: 200,
      measuredValue: 22,
      orderType: 'R',
      inventoryId: '100',
      productCategoryDesc: 'gold',
      productGroupDesc: 'plain',
      // for l3
      remarks: 'remarks',
      totalElements: 12,
      isStudded: true,
      refDocDate: moment(),
      refDocNumber: 1,
      refDocType: 'TEP',
      taxDetails: null
    }
  ];

  const createStockIssueItemsRes: boolean = true;

  const loadStockIssueItemsCountRes: number = 10;

  const locationSummaryDetails: LocationSummaryDetails = {
    address: 'string',
    brandCode: 'Tanishq',
    description: null,
    isActive: true,
    locationCode: 'PAT',
    locationTypeCode: 'CFA',
    phoneNo: null,
    regionCode: null,
    stateCode: null,
    townCode: null
  };

  const productCategoryRes: ProductCategory[] = [
    {
      description: 'chain',
      productCategoryCode: 'C'
    }
  ];

  const productGroupRes: ProductGroup[] = [
    {
      description: 'Gold Plain',
      productGroupCode: '71'
    }
  ];

  const courierDetailsRes: string[] = ['CPD'];

  const employeeCodesRes: string[] = ['ID1'];

  const employeeDetailsRes: StoreUser[] = [
    {
      empName: 'ABC',
      employeeCode: 'ID1',
      locationCode: 'CPD',
      mobileNo: '9876543210',
      isLoginActive: true
    }
  ];

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

  const loadingRes: boolean = false;

  const itemsEntity = itemsAdapter.setAll(itemsResponse, {
    ...itemsAdapter.getInitialState()
  });

  const stockIssueItemsEntity = stockIssueItemsAdapter.setAll(itemsResponse, {
    ...stockIssueItemsAdapter.getInitialState()
  });

  it('Should return items Entity', () => {
    const state: IssueTEPState = {
      ...initialState,
      items: itemsEntity
    };
    expect(selectors.items.projector(state)).toEqual(itemsEntity);
  });

  it('Should return selectItems', () => {
    expect(
      selectors.issueTEPSelectors.selectItems.projector(itemsEntity)
    ).toEqual(itemsResponse);
  });

  it('Should return stockIssueItems Entity', () => {
    const state: IssueTEPState = {
      ...initialState,
      stockIssueItems: stockIssueItemsEntity
    };
    expect(selectors.stockIssueItems.projector(state)).toEqual(
      stockIssueItemsEntity
    );
  });

  it('Should return stockIssueItems', () => {
    expect(
      selectors.issueTEPSelectors.selectStockIssueItems.projector(
        stockIssueItemsEntity
      )
    ).toEqual(itemsResponse);
  });

  it('Should return createStockIssueResponse ', () => {
    const state: IssueTEPState = {
      ...initialState,
      createStockIssueResponse: createStockIssueResponse
    };
    expect(
      selectors.issueTEPSelectors.selectCreateStockIssueResponse.projector(
        state
      )
    ).toEqual(createStockIssueResponse);
  });

  it('Should return selectUpdateStockIssueResponse', () => {
    const state: IssueTEPState = {
      ...initialState,
      updateStockIssueResponse: createStockIssueResponse
    };
    expect(
      selectors.issueTEPSelectors.selectUpdateStockIssueResponse.projector(
        state
      )
    ).toEqual(createStockIssueResponse);
  });

  it('Should return selectUpdateAllStockIssueItemsResponse', () => {
    const state: IssueTEPState = {
      ...initialState,
      updateAllStockIssueItemsResponse: createStockIssueItemsRes
    };
    expect(
      selectors.issueTEPSelectors.selectUpdateAllStockIssueItemsResponse.projector(
        state
      )
    ).toEqual(createStockIssueItemsRes);
  });

  it('Should return selectCreateStockIssueItemsResponse', () => {
    const state: IssueTEPState = {
      ...initialState,
      createStockIssueItemsResponse: createStockIssueItemsRes
    };
    expect(
      selectors.issueTEPSelectors.selectCreateStockIssueItemsResponse.projector(
        state
      )
    ).toEqual(createStockIssueItemsRes);
  });

  it('Should return selectTotalItemsCount', () => {
    const state: IssueTEPState = {
      ...initialState,
      totalItemsCount: loadStockIssueItemsCountRes
    };
    expect(
      selectors.issueTEPSelectors.selectTotalItemsCount.projector(state)
    ).toEqual(loadStockIssueItemsCountRes);
  });

  it('Should return selectTotalStockIssueItemsCount', () => {
    const state: IssueTEPState = {
      ...initialState,
      totalStockIssueItemsCount: loadStockIssueItemsCountRes
    };
    expect(
      selectors.issueTEPSelectors.selectTotalStockIssueItemsCount.projector(
        state
      )
    ).toEqual(loadStockIssueItemsCountRes);
  });

  it('Should return selectFactoryAddress', () => {
    const state: IssueTEPState = {
      ...initialState,
      factoryAddress: locationSummaryDetails
    };
    expect(
      selectors.issueTEPSelectors.selectFactoryAddress.projector(state)
    ).toEqual(locationSummaryDetails);
  });

  it('Should return selectProductCategories', () => {
    const state: IssueTEPState = {
      ...initialState,
      productCategories: productCategoryRes
    };
    expect(
      selectors.issueTEPSelectors.selectProductCategories.projector(state)
    ).toEqual(productCategoryRes);
  });

  it('Should return selectProductGroups', () => {
    const state: IssueTEPState = {
      ...initialState,
      productGroups: productGroupRes
    };
    expect(
      selectors.issueTEPSelectors.selectProductGroups.projector(state)
    ).toEqual(productGroupRes);
  });

  it('Should return selectCourierDetails', () => {
    const state: IssueTEPState = {
      ...initialState,
      courierDetails: courierDetailsRes
    };
    expect(
      selectors.issueTEPSelectors.selectCourierDetails.projector(state)
    ).toEqual(courierDetailsRes);
  });

  it('Should return selectEmployeeCodes', () => {
    const state: IssueTEPState = {
      ...initialState,
      employeeCodes: employeeCodesRes
    };
    expect(
      selectors.issueTEPSelectors.selectEmployeeCodes.projector(state)
    ).toEqual(employeeCodesRes);
  });

  it('Should return selectEmployeeDetails', () => {
    const state: IssueTEPState = {
      ...initialState,
      employeeDetails: employeeDetailsRes
    };
    expect(
      selectors.issueTEPSelectors.selectEmployeeDetails.projector(state)
    ).toEqual(employeeDetailsRes);
  });

  it('Should return selectSortDataItems', () => {
    const state: IssueTEPState = {
      ...initialState,
      sortDataItems: sortData
    };
    expect(
      selectors.issueTEPSelectors.selectSortDataItems.projector(state)
    ).toEqual(sortData);
  });

  it('Should return selectSortDataStockIssueItems', () => {
    const state: IssueTEPState = {
      ...initialState,
      sortDataStockIssueItems: sortData
    };
    expect(
      selectors.issueTEPSelectors.selectSortDataStockIssueItems.projector(state)
    ).toEqual(sortData);
  });

  it('Should return selectFilterDataItems', () => {
    const state: IssueTEPState = {
      ...initialState,
      filterDataItems: filterData
    };
    expect(
      selectors.issueTEPSelectors.selectFilterDataItems.projector(state)
    ).toEqual(filterData);
  });

  it('Should return selectFilterDataStockIssueItems', () => {
    const state: IssueTEPState = {
      ...initialState,
      filterDataStockIssueItems: filterData
    };
    expect(
      selectors.issueTEPSelectors.selectFilterDataStockIssueItems.projector(
        state
      )
    ).toEqual(filterData);
  });

  it('Should return selectIsCourierDetailsLoading', () => {
    const state: IssueTEPState = {
      ...initialState,
      isCourierDetailsLoading: loadingRes
    };
    expect(
      selectors.issueTEPSelectors.selectIsCourierDetailsLoading.projector(state)
    ).toEqual(loadingRes);
  });

  it('Should return selectIsFactoryAddressLoading', () => {
    const state: IssueTEPState = {
      ...initialState,
      isFactoryAddressLoading: loadingRes
    };
    expect(
      selectors.issueTEPSelectors.selectIsFactoryAddressLoading.projector(state)
    ).toEqual(loadingRes);
  });

  it('Should return selectIsEmployeeCodesLoading', () => {
    const state: IssueTEPState = {
      ...initialState,
      isEmployeeCodesLoading: loadingRes
    };
    expect(
      selectors.issueTEPSelectors.selectIsEmployeeCodesLoading.projector(state)
    ).toEqual(loadingRes);
  });

  it('Should return selectIsProductCategoriesLoading', () => {
    const state: IssueTEPState = {
      ...initialState,
      isProductCategoriesLoading: loadingRes
    };
    expect(
      selectors.issueTEPSelectors.selectIsProductCategoriesLoading.projector(
        state
      )
    ).toEqual(loadingRes);
  });

  it('Should return selectIsProductGroupsLoading', () => {
    const state: IssueTEPState = {
      ...initialState,
      isProductGroupsLoading: loadingRes
    };
    expect(
      selectors.issueTEPSelectors.selectIsProductGroupsLoading.projector(state)
    ).toEqual(loadingRes);
  });

  it('Should return selectIsLoading', () => {
    const state: IssueTEPState = {
      ...initialState,
      isLoading: false
    };
    expect(
      selectors.issueTEPSelectors.selectIsLoading.projector(state)
    ).toEqual(false);
  });

  it('Should return selectHasError ', () => {
    const state: IssueTEPState = {
      ...initialState,
      hasError: null
    };
    expect(selectors.issueTEPSelectors.selectHasError.projector(state)).toEqual(
      null
    );
  });
});
