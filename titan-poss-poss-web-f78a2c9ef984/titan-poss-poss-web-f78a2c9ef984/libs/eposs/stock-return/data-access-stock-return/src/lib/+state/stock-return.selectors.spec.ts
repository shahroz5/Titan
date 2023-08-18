import {
  CFAddress,
  CreateIssueItemsPayload,
  CustomErrors,
  HistoryAdvancedFilterPayload,
  ProductCategory,
  ProductGroup,
  RequestInvoice,
  StockReturnItem,
  StoreUser
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { itemAdaptor, requestInvoiceAdaptor } from './stock-return.entity';
import { initialState } from './stock-return.reducers';
import { StockReturnSelectors } from './stock-return.selectors';
import { StockReturnState } from './stock-return.state';
import * as selectors from './stock-return.selectors';

describe('StockReturn Selector Testing Suite', () => {
  const loadedItems: StockReturnItem[] = [
    {
      id: 1,
      itemCode: '123123123',
      lotNumber: '123132',
      mfgDate: moment(213123123),
      productCategory: 'pc',
      productGroup: 'pg',
      binCode: 'PURCFA',
      binGroupCode: 'PURCFA',
      stdValue: 123,
      stdWeight: 123,
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'verified',
      imageURL: 'www.image',
      itemDetails: {},
      availableQuantity: 123,
      availableWeight: 123,
      availableValue: 123,
      measuredQuantity: 123,
      measuredWeight: 123,
      measuredValue: 123,
      orderType: 'P',
      inventoryId: '12312312',
      productCategoryDesc: 'DESC',
      productGroupDesc: 'ASC',
      remarks: 'good',
      isStudded: true,
      thumbnailImageURL:'',
      taxDetails:{
      },
      isLoadingImage: true,
      isLoadingThumbnailImage :true
    }
  ];
  const invoiceHistory: RequestInvoice[] = [
    {
      id: 12,
      srcLocationCode: 'PNA',
      destLocationCode: 'URB',
      status: 'Verified',
      weightUnit: 'gms',
      currencyCode: 'INR',
      srcLocationDescription: 'urb',
      destLocationDescription: 'rso',
      srcDocNo: '123',
      srcFiscalYear: '2019',
      srcDocDate: moment(123123123),
      destDocNo: '123',
      destDocDate: moment(12312312),
      orderType: 'p',
      totalAvailableQuantity: 123,
      totalMeasuredQuantity: 123,
      totalAvailableValue: 123,
      totalMeasuredValue: 123,
      totalAvailableWeight: 123,
      totalMeasuredWeight: 123,
      invoiceType: 'ISSUE_TO_CFA',
      remarks: 'good',
      courierDetails: null
    }
  ];
  const itemEntity = itemAdaptor.setAll(loadedItems, {
    ...itemAdaptor.getInitialState()
  });
  const requestInvoiceEntory = requestInvoiceAdaptor.setAll(invoiceHistory, {
    ...requestInvoiceAdaptor.getInitialState()
  });
  const productCat: ProductCategory[] = [
    {
      description: 'ProductCategory',
      productCategoryCode: 'pc'
    }
  ];
  const advanceFilter: HistoryAdvancedFilterPayload = {
    docFromDate: 12312213,
    docToDate: 2123121,
    fiscalYear: '2019',
    invoiceNumber: 'INVOICE'
  };
  const productGroup: ProductGroup[] = [
    {
      description: 'ProductGroup',
      productGroupCode: 'pg'
    }
  ];
  const employeeDetails: StoreUser[] = [
    {
      empName: 'raju',
      employeeCode: '1213',
      locationCode: 'pna',
      mobileNo: '1234555556',
      isLoginActive:false,
    }
  ];
  const headerDetails: StockReturnItem = {
    id: 1,
    itemCode: '123123123',
    lotNumber: '123132',
    mfgDate: moment(213123123),
    productCategory: 'pc',
    productGroup: 'pg',
    binCode: 'PURCFA',
    binGroupCode: 'PURCFA',
    stdValue: 123,
    stdWeight: 123,
    currencyCode: 'INR',
    weightUnit: 'gms',
    status: 'verified',
    imageURL: 'www.image',
    itemDetails: {},
    availableQuantity: 123,
    availableWeight: 123,
    availableValue: 123,
    measuredQuantity: 123,
    measuredWeight: 123,
    measuredValue: 123,
    orderType: 'P',
    inventoryId: '12312312',
    productCategoryDesc: 'DESC',
    productGroupDesc: 'ASC',
    remarks: 'good',
    isStudded: true,
    thumbnailImageURL:'',
      taxDetails:{
      },
      isLoadingImage: true,
      isLoadingThumbnailImage :true
  };
  const cfaAddress: CFAddress = {
    locationCode: 'PNA',
    brandCode: 'BC',
    townCode: 123,
    stateCode: 123,
    regionCode: 'LC',
    locationTypeCode: 'PNA',
    isActive: true,
    address: 'Vijayawada',
    phoneNo: '9010462817',
    description: 'CFAAdress'
  };
  it('Should return the newRequestId ', () => {
    const state: StockReturnState = {
      ...initialState,
      newRequestId: 230
    };
    expect(StockReturnSelectors.selectNewRequestId.projector(state)).toEqual(
      230
    );
  });
  it('Should return the error ', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: StockReturnState = {
      ...initialState,
      error: error
    };
    expect(StockReturnSelectors.selectError.projector(state)).toEqual(error);
  });
  it('Should return the invoiceNumber ', () => {
    const state: StockReturnState = {
      ...initialState,
      invoiceNumber: 200
    };
    expect(
      StockReturnSelectors.selectConfirmedReturnInvoiceCfa.projector(state)
    ).toEqual(200);
  });
  it('Should return the invoiceNumber ', () => {
    const state: StockReturnState = {
      ...initialState,
      invoiceNumber: 200
    };
    expect(
      StockReturnSelectors.selectConfirmedReturnInvoiceCfa.projector(state)
    ).toEqual(200);
  });
  it('Should return the hasSearchedItem ', () => {
    const state: StockReturnState = {
      ...initialState,
      hasSearchedItem: true
    };
    expect(StockReturnSelectors.selectHasSearchResult.projector(state)).toEqual(
      true
    );
  });
  it('Should return the isLoading ', () => {
    const state: StockReturnState = {
      ...initialState,
      isLoading: true
    };
    expect(StockReturnSelectors.selectisLoading.projector(state)).toEqual(true);
  });
  it('Should return the isLoading ', () => {
    const state: StockReturnState = {
      ...initialState,
      isLoading: true
    };
    expect(StockReturnSelectors.selectisLoading.projector(state)).toEqual(true);
  });
  it('Should return the cfaAddress ', () => {
    const state: StockReturnState = {
      ...initialState,
      CFAddress: cfaAddress
    };
    expect(StockReturnSelectors.selectCFA.projector(state)).toEqual(cfaAddress);
  });
  it('Should return the totalItemCount ', () => {
    const state: StockReturnState = {
      ...initialState,
      totalItemCount: 1
    };
    expect(StockReturnSelectors.selectTotalItemCount.projector(state)).toEqual(
      1
    );
  });
  it('Should return the hasIssued ', () => {
    const state: StockReturnState = {
      ...initialState,
      hasIssued: true
    };
    expect(StockReturnSelectors.selectHasIssued.projector(state)).toEqual(true);
  });
  it('Should return the hasSearched ', () => {
    const state: StockReturnState = {
      ...initialState,
      hasSearched: true
    };
    expect(StockReturnSelectors.selectHasSearched.projector(state)).toEqual(
      true
    );
  });
  it('Should return the hasLoaded ', () => {
    const state: StockReturnState = {
      ...initialState,
      hasLoaded: true
    };
    expect(StockReturnSelectors.selectHasLoaded.projector(state)).toEqual(true);
  });
  it('Should return the hasLoaded ', () => {
    const state: StockReturnState = {
      ...initialState,
      hasLoaded: true
    };
    expect(StockReturnSelectors.selectHasLoaded.projector(state)).toEqual(true);
  });
  it('Should return the hasSelectedProductsSearch ', () => {
    const state: StockReturnState = {
      ...initialState,
      hasSelectedProductsSearch: true
    };
    expect(
      StockReturnSelectors.selecteHasSelectedProductsSearch.projector(state)
    ).toEqual(true);
  });
  it('Should return the selectedProductsSearchCount ', () => {
    const state: StockReturnState = {
      ...initialState,
      selectedProductsSearchCount: 2
    };
    expect(
      StockReturnSelectors.selectSelectedProductsSearchCount.projector(state)
    ).toEqual(2);
  });
  it('Should return the searchcount ', () => {
    const state: StockReturnState = {
      ...initialState,
      searchCount: 2
    };
    expect(StockReturnSelectors.selectSearchCount.projector(state)).toEqual(2);
  });
  it('Should return the courierDetails ', () => {
    const state: StockReturnState = {
      ...initialState,
      courierDetails: ['BLUE DART']
    };
    expect(StockReturnSelectors.selectCourierDetails.projector(state)).toEqual([
      'BLUE DART'
    ]);
  });
  it('Should return the headerLevelDetails ', () => {
    const state: StockReturnState = {
      ...initialState,
      headerLevelDetails: headerDetails
    };
    expect(
      StockReturnSelectors.selectHeaderLevelDetails.projector(state)
    ).toEqual(headerDetails);
  });
  it('Should return the productCategories ', () => {
    const state: StockReturnState = {
      ...initialState,
      productCategories: productCat
    };
    expect(
      StockReturnSelectors.selectProductCategories.projector(state)
    ).toEqual(productCat);
  });
  it('Should return the productGroups ', () => {
    const state: StockReturnState = {
      ...initialState,
      productGroups: productGroup
    };
    expect(StockReturnSelectors.selectProductGroups.projector(state)).toEqual(
      productGroup
    );
  });
  it('Should return the employeeCodes ', () => {
    const state: StockReturnState = {
      ...initialState,
      employeeCodes: ['pna', 'rso']
    };
    expect(StockReturnSelectors.selectEmployeeCodes.projector(state)).toEqual([
      'pna',
      'rso'
    ]);
  });
  it('Should return the employeeDetails ', () => {
    const state: StockReturnState = {
      ...initialState,
      employeeDetails: employeeDetails
    };
    expect(StockReturnSelectors.selectEmployeeDetails.projector(state)).toEqual(
      employeeDetails
    );
  });

  it('Should return the totalHistoryInvoiceItems ', () => {
    const state: StockReturnState = {
      ...initialState,
      totalHistoryInvoiceItems: 1
    };
    expect(
      StockReturnSelectors.selectTotalInvoiceHistoryCount.projector(state)
    ).toEqual(1);
  });

  it('Should return the isLoadingHistory ', () => {
    const state: StockReturnState = {
      ...initialState,
      isLoadingHistory: true
    };
    expect(
      StockReturnSelectors.selectIsLoadingHistory.projector(state)
    ).toEqual(true);
  });
  it('Should return the historyType ', () => {
    const state: StockReturnState = {
      ...initialState,
      historyType: 'InvoiceToCFA'
    };
    expect(StockReturnSelectors.selectHistoryType.projector(state)).toEqual(
      'InvoiceToCFA'
    );
  });
  it('Should return the advancedFilter ', () => {
    const state: StockReturnState = {
      ...initialState,
      advancedFilter: advanceFilter
    };
    expect(
      StockReturnSelectors.selectAdvancedFilterData.projector(state)
    ).toEqual(advanceFilter);
  });
  it('Should return the hasRemovedMultipleItems ', () => {
    const state: StockReturnState = {
      ...initialState,
      hasRemovedMultipleItems: true
    };
    expect(
      StockReturnSelectors.selectHasRemovedMultipleItes.projector(state)
    ).toEqual(true);
  });

  it('Should return the itemEntity', () => {
    const state: StockReturnState = {
      ...initialState,
      loadedItems: itemEntity
    };
    expect(selectors.loadedItems.projector(state)).toEqual(itemEntity);
  });

  it('Should return the loadedItems ', () => {
    expect(StockReturnSelectors.selectCFAItems.projector(itemEntity)).toEqual(
      loadedItems
    );
  });

  it('Should return the searchedItems', () => {
    expect(
      StockReturnSelectors.selectSearchedItems.projector(itemEntity)
    ).toEqual(loadedItems);
  });
  it('Should return the itemEntity', () => {
    const state: StockReturnState = {
      ...initialState,
      searchedItems: itemEntity
    };
    expect(selectors.searchedItems.projector(state)).toEqual(itemEntity);
  });

  it('Should return the sortedItems', () => {
    expect(
      StockReturnSelectors.selectSearchedItems.projector(itemEntity)
    ).toEqual(loadedItems);
  });

  //sort

  // it('Should return the itemEntity', () => {
  //   const state: StockReturnState = {
  //     ...initialState,
  //     sortedItems: itemEntity
  //   };
  //   expect(selectors.sortedItems.projector(state)).toEqual(itemEntity);
  // });

  // it('Should return the sortedItems', () => {
  //   expect(
  //     StockReturnSelectors.selectSortedItems.projector(itemEntity)
  //   ).toEqual(loadedItems);
  // });

  it('Should return the requestInvoiceEntity', () => {
    const state: StockReturnState = {
      ...initialState,
      invoiceHistory: requestInvoiceEntory
    };
    expect(selectors.invoiceHistory.projector(state)).toEqual(
      requestInvoiceEntory
    );
  });

  it('Should return the invoieHistory', () => {
    expect(
      StockReturnSelectors.selectInvoiceHistory.projector(requestInvoiceEntory)
    ).toEqual(invoiceHistory);
  });
});
