import {
  BinCode,
  Lov,
  ProductGroup,
  ProductCategory,
  StockReceiveItem
} from '@poss-web/shared/models';
// you will need to assert that the store is calling the right selector function.
import { initialState } from './stock-receive.reducer';
import * as selectors from './stock-receive.selectors';
import * as moment from 'moment';
import {
  StockReceiveCourierDetails,
  StockReceiveStock,
  CustomErrors
} from '@poss-web/shared/models';
import { stockAdapter, itemAdapter } from './stock-receive.entity';
import { StockReceiveState } from './stock-receive.state';
import { StockReceiveSelectors } from './stock-receive.selectors';

const dummyItemsResponse: StockReceiveItem[] = [
  {
    id: '23SW22',
    binCode: 'TestBinCode',
    itemCode: '1233NXB992',
    itemDetails: {},
    stdValue: 10,
    stdWeight: 10,
    lotNumber: '121212',
    mfgDate: moment(),
    status: 'issued',
    availableValue: 10,
    availableWeight: 10,
    currencyCode: 'INR',
    weightUnit: 'gms',
    imageURL: 'http://test.com',
    measuredQuantity: 10,
    measuredWeight: 10,
    binGroupCode: 'TestBinGroupCode',
    availableQuantity: 10,
    orderType: 'P',
    productCategory: 'TestProductCategory',
    productGroup: 'TestProductGroup',
    productCategoryDesc: 'TestProductCategoryDesc',
    productGroupDesc: 'TestProductGroupDesc',
    remarks: 'TestRemarks',
    isUpdating: false,
    isUpdatingSuccess: null,
    isValidating: false,
    isValidatingSuccess: null,
    isValidatingError: false,
    isStudded: true,
    thumbnailImageURL: 'dummy',
    isLoadingImage: true,
    isLoadingThumbnailImage: true
  }
];

describe('Stock Receive selector Testing Suite', () => {
  const createCourier = (
    type: string,
    companyName: string,
    docketNumber: string,
    lockNumber: string,
    roadPermitNumber: string,
    employeeId: string,
    employeeMobileNumber: string,
    employeeName: string
  ): StockReceiveCourierDetails => ({
    type,
    data: {
      companyName,
      docketNumber,
      lockNumber,
      roadPermitNumber,
      employeeId,
      employeeMobileNumber,
      employeeName
    }
  });

  const createPendingSTN = (
    id: number,
    currencyCode: string,
    courierDetails: StockReceiveCourierDetails,
    courierReceivedDate: moment.Moment,
    orderType: string,
    srcDocNo: number,
    srcDocDate: moment.Moment,
    srcFiscalYear: number,
    srcLocationCode: string,
    status: string,
    destDocDate: moment.Moment,
    destDocNo: number,
    destLocationCode: string,
    totalAvailableWeight: number,
    totalAvailableQuantity: number,
    totalAvailableValue: number,
    totalMeasuredQuantity: number,
    totalMeasuredValue: number,
    totalMeasuredWeight: number,
    type: string,
    weightUnit: string,
    srcLocationDescription: string,
    destLocationDescription: string,
    reasonForDelay?: string,
    remarks?: string
  ): StockReceiveStock => {
    return {
      id,
      currencyCode,
      courierDetails,
      courierReceivedDate,
      orderType,
      srcDocNo,
      srcDocDate,
      srcFiscalYear,
      srcLocationCode,
      status,
      destDocDate,
      destDocNo,
      destLocationCode,
      totalAvailableWeight,
      totalAvailableQuantity,
      totalAvailableValue,
      totalMeasuredQuantity,
      totalMeasuredValue,
      totalMeasuredWeight,
      type,
      weightUnit,
      srcLocationDescription,
      destLocationDescription,
      reasonForDelay,
      remarks
    };
  };

  const pendingSTN1 = createPendingSTN(
    1, // id:
    'INR', //currencyCode:
    createCourier(
      '',
      'companyName',
      'docketNumber',
      'lockNumber',
      'roadPermitNumber',
      'employeeId',
      'employeeMobileNumber',
      'employeeName'
    ), //    courierDetails:
    moment(), //  courierReceivedDate:
    '', // orderType:
    123, //srcDocNo:
    moment(), //srcDocDate:
    2020, //  srcFiscalYear:
    'URB', //srcLocationCode:
    '', // status:
    moment(), //destDocDate:
    123, // destDocNo:
    'hnr', // destLocationCode:
    10.6, //totalAvailableWeight:
    2, //totalAvailableQuantity:
    10000, //totalAvailableValue:
    2, //totalMeasuredQuantity:
    10000, //totalMeasuredValue:
    10.6, //totalMeasuredWeight:
    '', // type:
    '', //  weightUnit:
    '', // srcLocationDescription:
    '', //destLocationDescription:
    '', //reasonForDelay?:
    '' // remarks?:
  );

  const pendingSTN2 = createPendingSTN(
    2, // id:
    'INR', //currencyCode:
    createCourier(
      '',
      'companyName',
      'docketNumber',
      'lockNumber',
      'roadPermitNumber',
      'employeeId',
      'employeeMobileNumber',
      'employeeName'
    ), //    courierDetails:
    moment(), //  courierReceivedDate:
    '', // orderType:
    123, //srcDocNo:
    moment(), //srcDocDate:
    2020, //  srcFiscalYear:
    'URB', //srcLocationCode:
    '', // status:
    moment(), //destDocDate:
    123, // destDocNo:
    'hnr', // destLocationCode:
    10.6, //totalAvailableWeight:
    2, //totalAvailableQuantity:
    10000, //totalAvailableValue:
    2, //totalMeasuredQuantity:
    10000, //totalMeasuredValue:
    10.6, //totalMeasuredWeight:
    '', // type:
    '', //  weightUnit:
    '', // srcLocationDescription:
    '', //destLocationDescription:
    '', //reasonForDelay?:
    '' // remarks?:
  );

  describe('Testing STN related Selectors', () => {
    const pendingSTNSArray = [pendingSTN1, pendingSTN2];
    const pendingSTNSEntity = stockAdapter.setAll(pendingSTNSArray, {
      ...stockAdapter.getInitialState()
    });

    it('Should return the Pending Factory STN Entity', () => {
      const state: StockReceiveState = {
        ...initialState,
        pendingFactorySTN: pendingSTNSEntity
      };
      expect(selectors.pendingFactorySTN.projector(state)).toEqual(
        pendingSTNSEntity
      );
    });

    it('Should return the pending Factory STN ', () => {
      expect(
        StockReceiveSelectors.selectPendingFactorySTN.projector(
          pendingSTNSEntity
        )
      ).toEqual(pendingSTNSArray);
    });

    it('Should return the pending Boutique STN Entity', () => {
      const state: StockReceiveState = {
        ...initialState,
        pendingBoutiqueSTN: pendingSTNSEntity
      };
      expect(selectors.pendingBoutiqueSTN.projector(state)).toEqual(
        pendingSTNSEntity
      );
    });

    it('Should return the pending Boutique STN', () => {
      expect(
        StockReceiveSelectors.selectPendingBoutiqueSTN.projector(
          pendingSTNSEntity
        )
      ).toEqual(pendingSTNSArray);
    });

    it('Should return the pending Merchandise STN Entity', () => {
      const state: StockReceiveState = {
        ...initialState,
        pendingMerchandiseSTN: pendingSTNSEntity
      };
      expect(selectors.pendingMerchandiseSTN.projector(state)).toEqual(
        pendingSTNSEntity
      );
    });

    it('Should return the pending Merchandise STN', () => {
      expect(
        StockReceiveSelectors.selectPendingMerchandiseSTN.projector(
          pendingSTNSEntity
        )
      ).toEqual(pendingSTNSArray);
    });

    it('Should return the pending CFA Invoice Entity', () => {
      const state: StockReceiveState = {
        ...initialState,
        pendingCFAInvoice: pendingSTNSEntity
      };
      expect(selectors.pendingCFAInvoice.projector(state)).toEqual(
        pendingSTNSEntity
      );
    });

    it('Should return the  pending CFA Invoice', () => {
      expect(
        StockReceiveSelectors.selectPendingCFAInvoice.projector(
          pendingSTNSEntity
        )
      ).toEqual(pendingSTNSArray);
    });

    it('Should return search result STN Entity', () => {
      const state: StockReceiveState = {
        ...initialState,
        searchStockResults: pendingSTNSEntity
      };
      expect(selectors.searchStockResults.projector(state)).toEqual(
        pendingSTNSEntity
      );
    });

    it('Should return search result STN', () => {
      expect(
        StockReceiveSelectors.selectSearchStockResults.projector(
          pendingSTNSEntity
        )
      ).toEqual(pendingSTNSArray);
    });

    it('Should return search result Invoice Entity', () => {
      const state: StockReceiveState = {
        ...initialState,
        searchInvoiceResults: pendingSTNSEntity
      };
      expect(selectors.searchInvoiceResults.projector(state)).toEqual(
        pendingSTNSEntity
      );
    });

    it('Should return search result Invoice', () => {
      expect(
        StockReceiveSelectors.selectSearchInvoiceResults.projector(
          pendingSTNSEntity
        )
      ).toEqual(pendingSTNSArray);
    });

    it('Should return selected STN', () => {
      const state: StockReceiveState = {
        ...initialState,
        selectedStock: pendingSTN1
      };
      expect(
        StockReceiveSelectors.selectSelectedStock.projector(state)
      ).toEqual(pendingSTN1);
    });

    it('Should return selected Invoice', () => {
      const state: StockReceiveState = {
        ...initialState,
        selectedInvoice: pendingSTN1
      };
      expect(
        StockReceiveSelectors.selectSelectedInvoice.projector(state)
      ).toEqual(pendingSTN1);
    });

    it('Should return History STN Entity', () => {
      const state: StockReceiveState = {
        ...initialState,
        stockReceiveHistory: pendingSTNSEntity
      };
      expect(selectors.stockReceiveHistory.projector(state)).toEqual(
        pendingSTNSEntity
      );
    });

    it('Should return History STN', () => {
      expect(
        StockReceiveSelectors.selectStockReceiveHistory.projector(
          pendingSTNSEntity
        )
      ).toEqual(pendingSTNSArray);
    });
  });

  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: StockReceiveState = {
      ...initialState,
      error: error
    };
    expect(StockReceiveSelectors.selectError.projector(state)).toEqual(error);
  });

  describe('Testing process status related Selectors', () => {
    it('Should return the loading status of BinGroups', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isLoadingBinGroups: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsLoadingBinGroups.projector(state)
      ).toEqual(isLoading);
    });
    it('Should return the loading status of Remarks', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isLoadingRemarks: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsLoadingRemarks.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the loading status of Factory STN ', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isLoadingPendingFactorySTN: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsLoadingPendingFactorySTN.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the loading status of Boutique STN ', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isLoadingPendingBoutiqueSTN: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsLoadingPendingBoutiqueSTN.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the loading status of Merchandise STN ', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isLoadingPendingMerchandiseSTN: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsLoadingPendingMerchandiseSTN.projector(
          state
        )
      ).toEqual(isLoading);
    });

    it('Should return the loading status of CFA Invoice', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isLoadingPendingCFAInvoice: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsLoadingPendingCFAInvoice.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the loading status of Searching STN', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isSearchingStocks: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsSearchingStocks.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the loading status of Searching Invoice', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isSearchingInvoices: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsSearchingInvoices.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the loading status of Selected Stock', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isLoadingSelectedStock: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsLoadingSelectedStock.projector(state)
      ).toEqual(isLoading);
    });
    it('Should return the loading status of Items', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isItemsLoading: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsItemsLoading.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the loading status of Item Count', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isItemsTotalCountLoading: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsItemsTotalCountLoading.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the confirmation status of STN', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isConfirmingStockReceive: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsConfirmingStockReceive.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the verifying status of items', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isVerifyingAllItem: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsVerifyingAllItem.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the assigning bin status for all items', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isAssigningBinToAllItems: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsAssigningBinToAllItems.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the loading status of Product Groups', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isLoadingProductGroups: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsLoadingProductGroups.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the loading status of Product Categories', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isLoadingProductCategories: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsLoadingProductCategories.projector(state)
      ).toEqual(isLoading);
    });

    it('Should return the loading status of stock history', () => {
      const isLoading = true;
      const state: StockReceiveState = {
        ...initialState,
        isLoadingHistory: isLoading
      };
      expect(
        StockReceiveSelectors.selectIsLoadingStockReceiveHistory.projector(
          state
        )
      ).toEqual(isLoading);
    });

    it('Should return the loaded status of STN search ', () => {
      const hasLoaded = true;
      const state: StockReceiveState = {
        ...initialState,
        hasSearchStockResults: hasLoaded
      };
      expect(
        StockReceiveSelectors.selectHasSearchStockResults.projector(state)
      ).toEqual(hasLoaded);
    });
    it('Should return the loaded status of Invoice search ', () => {
      const hasLoaded = true;
      const state: StockReceiveState = {
        ...initialState,
        hasSearchInvoiceResults: hasLoaded
      };
      expect(
        StockReceiveSelectors.selectHasSearchInvoiceResults.projector(state)
      ).toEqual(hasLoaded);
    });

    it('Should return the loaded status of Item ', () => {
      const isLoaded = true;
      const state: StockReceiveState = {
        ...initialState,
        isItemsLoaded: isLoaded
      };
      expect(
        StockReceiveSelectors.selectIsItemsLoaded.projector(state)
      ).toEqual(isLoaded);
    });

    it('Should return the loaded status of Item Count ', () => {
      const isLoaded = true;
      const state: StockReceiveState = {
        ...initialState,
        isItemsTotalCountLoaded: isLoaded
      };
      expect(
        StockReceiveSelectors.selectisItemsTotalCountLoaded.projector(state)
      ).toEqual(isLoaded);
    });

    it('Should return the Confirmation success status', () => {
      const isConfirmed = true;
      const state: StockReceiveState = {
        ...initialState,
        isConfirmStockReceiveSuccess: isConfirmed
      };
      expect(
        StockReceiveSelectors.selectIsConfirmStockReceiveSuccess.projector(
          state
        )
      ).toEqual(isConfirmed);
    });

    it('Should return the Verify all success status', () => {
      const isVerified = true;
      const state: StockReceiveState = {
        ...initialState,
        isVerifyingAllItemSuccess: isVerified
      };
      expect(
        StockReceiveSelectors.selectIsVerifyingAllItemSuccess.projector(state)
      ).toEqual(isVerified);
    });

    it('Should return the Assigning bin to all success status', () => {
      const isAssigned = true;
      const state: StockReceiveState = {
        ...initialState,
        isAssigningBinToAllItemsSuccess: isAssigned
      };
      expect(
        StockReceiveSelectors.selectIsAssigningBinToAllItemsSuccess.projector(
          state
        )
      ).toEqual(isAssigned);
    });

    it('Should return the verify item success status', () => {
      const isVerified = true;
      const state: StockReceiveState = {
        ...initialState,
        verifyItemSuccess: isVerified
      };
      expect(
        StockReceiveSelectors.selectVerifyItemSuccess.projector(state)
      ).toEqual(isVerified);
    });
    it('Should return the update item success status', () => {
      const isUpdated = true;
      const state: StockReceiveState = {
        ...initialState,
        updateItemSuccess: isUpdated
      };
      expect(
        StockReceiveSelectors.selectUpdateItemSuccess.projector(state)
      ).toEqual(isUpdated);
    });
  });
  it('Should return the item count ', () => {
    const itemsCount = 10;
    const state: StockReceiveState = {
      ...initialState,
      itemsCount: itemsCount
    };
    expect(StockReceiveSelectors.selectItemsCount.projector(state)).toEqual(
      itemsCount
    );
  });

  it('Should return the item total count ', () => {
    const totalCounts = {
      nonVerifiedItemsTotalCount: 12,
      verifiedItemsTotalCount: 33,
      isLoaded: true
    };
    const state: StockReceiveState = {
      ...initialState,
      totalCounts: totalCounts
    };
    expect(StockReceiveSelectors.selectTotalCounts.projector(state)).toEqual(
      totalCounts
    );
  });

  it('Should return bincodes', () => {
    const binCodes: BinCode[] = [
      {
        binCode: 'TEST1',
        description: 'TEST1'
      },
      {
        binCode: 'TEST2',
        description: 'TEST2'
      }
    ];
    const state: StockReceiveState = {
      ...initialState,
      binCodes: binCodes
    };
    expect(StockReceiveSelectors.selectBinCodes.projector(state)).toEqual(
      binCodes
    );
  });

  it('Should return Remarks', () => {
    const remarks: Lov[] = [
      {
        code: 'TEST1',
        value: 'TEST1',
        isActive: true
      },
      {
        code: 'TEST2',
        value: 'TEST2',
        isActive: true
      }
    ];
    const state: StockReceiveState = {
      ...initialState,
      remarks: remarks
    };
    expect(StockReceiveSelectors.selectRemarks.projector(state)).toEqual(
      remarks
    );
  });

  it('Should return productGroups', () => {
    const productGroups: ProductGroup[] = [
      {
        productGroupCode: 'TEST1',
        description: 'TEST1'
      },
      {
        productGroupCode: 'TEST2',
        description: 'TEST2'
      }
    ];
    const state: StockReceiveState = {
      ...initialState,
      productGroups: productGroups
    };
    expect(StockReceiveSelectors.selectProductGroups.projector(state)).toEqual(
      productGroups
    );
  });

  it('Should return product Groups', () => {
    const productCategories: ProductCategory[] = [
      {
        productCategoryCode: 'TEST1',
        description: 'TEST1'
      },
      {
        productCategoryCode: 'TEST2',
        description: 'TEST2'
      }
    ];
    const state: StockReceiveState = {
      ...initialState,
      productCategories: productCategories
    };
    expect(
      StockReceiveSelectors.selectProductCategories.projector(state)
    ).toEqual(productCategories);
  });

  it('Should return wherther to reset the search or not Groups', () => {
    const resetOption = { reset: true };
    const state: StockReceiveState = {
      ...initialState,
      searchReset: resetOption
    };
    expect(StockReceiveSelectors.selectSearchReset.projector(state)).toEqual(
      resetOption
    );
  });

  it('Should return total history items', () => {
    const total = 10;
    const state: StockReceiveState = {
      ...initialState,
      totalElements: total
    };
    expect(
      StockReceiveSelectors.selectHistoryTotalElements.projector(state)
    ).toEqual(total);
  });

  it('Should return  history type', () => {
    const type = 'FAC_BTQ';
    const state: StockReceiveState = {
      ...initialState,
      historyType: type
    };
    expect(StockReceiveSelectors.selectHistoryType.projector(state)).toEqual(
      type
    );
  });

  it('Should return  history advance filter data', () => {
    const advancedFilter = {
      docFromDate: 123,
      docToDate: 1212,
      stnNumber: 111,
      sourceLocationCode: 'URB',
      fiscalYear: '2020',
      docNumber: '111'
    };
    const state: StockReceiveState = {
      ...initialState,
      advancedFilter: advancedFilter
    };
    expect(
      StockReceiveSelectors.selectAdvancedFilterData.projector(state)
    ).toEqual(advancedFilter);
  });

  it('Should return confirmed stock details', () => {
    const confirmedStockData = {
      docNumber: '111'
    };
    const state: StockReceiveState = {
      ...initialState,
      confirmedStock: confirmedStockData
    };
    expect(StockReceiveSelectors.selectConfirmedStock.projector(state)).toEqual(
      confirmedStockData
    );
  });
  describe('Testing Item related Selectors', () => {
    const itemArray = dummyItemsResponse;
    const itemEntity = itemAdapter.setAll(itemArray, {
      ...itemAdapter.getInitialState()
    });
    it('Should return Item Entity', () => {
      const state: StockReceiveState = {
        ...initialState,
        items: itemEntity
      };
      expect(selectors.items.projector(state)).toEqual(itemEntity);
    });

    it('Should return Item Entity', () => {
      expect(StockReceiveSelectors.selectItems.projector(itemEntity)).toEqual(
        itemArray
      );
    });
  });
});
