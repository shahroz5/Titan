import {
  OtherDetails,
  CourierDetailsOtherIssue,
  OtherIssueModel,
  OtherIssuesHistoryItem,
  OtherReceiptsIssuesAdvanceFilterPayload,
  OtherIssuesItem,
  ProductCategory,
  ProductGroup,
  CustomErrors,
  OtherIssueTransferType,
  RequestOtherIssueStockTransferNote,
  OtherIssuesCreateStockResponse,
  OtherReceiptItem,
  AdjustmentItem,
  OtherReceiptsModel,
  Errors,
  ItemSummary
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  ItemEntity,
  AdjustmentEntity,
  OtherReceiptAdapter,
  OtherReceiptEntity,
  adjustmentAdaptor,
  itemAdapter
} from './other-receipts.entity';
import { OtherReceiptState } from './other-receipts.state';
import { initialState } from './other-receipts.reducer';
import * as selectors from './other-receipts.selector';
import { Moment } from 'moment';

describe('Other Receipt Selector Testing Suite', () => {
  const receipt2: OtherReceiptsModel = {
    id: 5260,
    transactionType: 'EXH',

    locationCode: 's',
    status: 'APVL_PENDING',
    weightUnit: 'gms',
    currencyCode: 'INR',
    carrierDetails: null,

    remarks: null,
    srcDocNo: 517,
    srcFiscalYear: null,
    srcDocDate: moment(1600692426386),
    destDocNo: null,
    destDocDate: null,
    orderType: null,
    totalAvailableQuantity: 15,
    totalMeasuredQuantity: 15,
    totalAvailableValue: 7631640,
    totalMeasuredValue: 7631640,
    totalAvailableWeight: 321.9,
    totalMeasuredWeight: 321.9
  };
  const receipt1: OtherReceiptsModel = {
    id: 5260,
    transactionType: 'EXH',

    locationCode: 's',
    status: 'APVL_PENDING',
    weightUnit: 'gms',
    currencyCode: 'INR',
    carrierDetails: null,

    remarks: null,
    srcDocNo: 517,
    srcFiscalYear: null,
    srcDocDate: moment(1600692426386),
    destDocNo: null,
    destDocDate: null,
    orderType: null,
    totalAvailableQuantity: 15,
    totalMeasuredQuantity: 15,
    totalAvailableValue: 7631640,
    totalMeasuredValue: 7631640,
    totalAvailableWeight: 321.9,
    totalMeasuredWeight: 321.9
  };

  const item1: OtherReceiptItem = {
    id: 'a',
    itemCode: '111AVSW1111',
    lotNumber: '10000AB1',
    productCategory: '',
    productCategoryDesc: '',
    productGroup: '',
    productGroupDesc: '',
    binCode: '',
    binGroupCode: '',
    orderType: null,
    itemValue: 100,

    totalQuantity: 1,
    totalValue: 100,
    totalWeight: 1,
    currencyCode: 'INR',
    weightUnit: 'gms',
    mfgDate: moment(),
    status: 'ISSUED',
    imageURL: '',
    itemDetails: { actualGoldWeight: 1, otherStoneWt: 1 },

    isUpdating: false,
    isUpdatingSuccess: true,

    isValidating: true,
    isValidatingError: false,
    isValidatingSuccess: true,
    remarks: '',
    measuredWeight: 10,
    measuredValue: 1000,
    measuredQuantity: 1,
    availableQuantity: 1,
    availableValue: 1000,
    availableWeight: 10,
    stdWeight: 10,
    stdValue: 100,
    isStudded: false,
    thumbnailImageURL:'',
    taxDetails:{},
    isLoadingImage:true,
    isLoadingThumbnailImage: true,

  };

  const item2: OtherReceiptItem = {
    id: 'b',
    itemCode: '111AVSW1111',
    lotNumber: '10000AB1',
    productCategory: '',
    productCategoryDesc: '',
    productGroup: '',
    productGroupDesc: '',
    binCode: '',
    binGroupCode: '',
    orderType: null,
    itemValue: 100,

    totalQuantity: 1,
    totalValue: 100,
    totalWeight: 1,
    currencyCode: 'INR',
    weightUnit: 'gms',
    mfgDate: moment(),
    status: 'ISSUED',
    imageURL: '',
    itemDetails: { actualGoldWeight: 1, otherStoneWt: 1 },

    isUpdating: false,
    isUpdatingSuccess: true,

    isValidating: true,
    isValidatingError: false,
    isValidatingSuccess: true,
    remarks: '',
    measuredWeight: 10,
    measuredValue: 1000,
    measuredQuantity: 1,
    availableQuantity: 1,
    availableValue: 1000,
    availableWeight: 10,
    stdWeight: 10,
    stdValue: 100,
    isStudded: false,
    thumbnailImageURL:'',
    taxDetails:{},
    isLoadingImage:true,
    isLoadingThumbnailImage: true,
  };

  const item: ItemSummary = {
    itemCode: '',
    productCategoryCode: '',
    productCategoryDesc: '',
    productGroupCode: '',
    productGroupDesc: '',
    stdValue: 1,
    isStudded: true,
    thumbnailImageURL:'',
    taxDetails:{},
    isLoadingImage:true,
    isLoadingThumbnailImage: true,
    id:''
  };

  const adjustment1: AdjustmentItem = {
    binCode: 'a',
    binGroupCode: 'a',
    destDocNo: 1,
    imageURL: '',
    itemCode: '',
    measuredQuantity: 1,
    measuredWeight: 2,
    productCategory: '',
    productCategoryId: '',
    productGroup: '',
    productGroupId: '',
    stdValue: 1,
    isStudded: false,
    thumbnailImageURL:'',
    taxDetails:{},
    isLoadingImage:true,
    isLoadingThumbnailImage: true,
    id:''
  };
  const adjustment2: AdjustmentItem = {
    binCode: 'b',
    binGroupCode: 'b',
    destDocNo: 1,
    imageURL: '',
    itemCode: '',
    measuredQuantity: 1,
    measuredWeight: 2,
    productCategory: '',
    productCategoryId: '',
    productGroup: '',
    productGroupId: '',
    stdValue: 1,
    isStudded: false,
    thumbnailImageURL:'',
    taxDetails:{},
    isLoadingImage:true,
    isLoadingThumbnailImage: true,
    id:''
  };
  const addReceiptToEntities = <T extends OtherReceiptsModel>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const addItemsToEntities = <T extends OtherReceiptItem>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const addAdjustmentElementToEntities = <T extends AdjustmentItem>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.binCode]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const receiptArray = [receipt1, receipt2];
  const itemsArray = [item1, item2];
  const adjustmentArray = [adjustment1, adjustment2];

  const receiptSTN: OtherReceiptEntity = {
    ids: [receipt1.id, receipt1.id],
    entities: addReceiptToEntities(receiptArray)
  };

  const itemsSTN: ItemEntity = {
    ids: [item1.id, item2.id],
    entities: addItemsToEntities(itemsArray)
  };

  const adjustmentSTN: AdjustmentEntity = {
    ids: [adjustment1.binCode, adjustment2.binCode],
    entities: addAdjustmentElementToEntities(adjustmentArray)
  };

  describe('Testing otherReceipt Related selectors', () => {
    it('Should return productCategories', () => {
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
      const state: OtherReceiptState = {
        ...initialState,
        productCategories: productCategories
      };
      expect(
        selectors.OtherReceiptsSelector.selectProductCategories.projector(state)
      ).toEqual(productCategories);
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
      const state: OtherReceiptState = {
        ...initialState,
        productGroups: productGroups
      };
      expect(
        selectors.OtherReceiptsSelector.selectProductGroups.projector(state)
      ).toEqual(productGroups);
    });
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: OtherReceiptState = {
        ...initialState,
        error: error
      };
      expect(
        selectors.OtherReceiptsSelector.selectError.projector(state)
      ).toEqual(error);
    });

    it('should return selectHasError selector', () => {
      const state: OtherReceiptState = {
        ...initialState,
        hasError: 'yes'
      };
      expect(
        selectors.OtherReceiptsSelector.selectHasError.projector(state)
      ).toEqual('yes');
    });

    it('should return isLoading selector', () => {
      const state: OtherReceiptState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.OtherReceiptsSelector.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('should return selectIsSearchingStocks selector', () => {
      const state: OtherReceiptState = {
        ...initialState,
        isSearchingStocks: true
      };
      expect(
        selectors.OtherReceiptsSelector.selectIsSearchingStocks.projector(state)
      ).toEqual(true);
    });

    it('should return selectHasSearchStockResults selector', () => {
      const state: OtherReceiptState = {
        ...initialState,
        hasSearchStockResults: true
      };
      expect(
        selectors.OtherReceiptsSelector.selectHasSearchStockResults.projector(
          state
        )
      ).toEqual(true);
    });
  });

  it('should return selectOtherReceiptsSTNCount selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      pendingOtherReceiptsSTNCount: 0
    };
    expect(
      selectors.OtherReceiptsSelector.selectOtherReceiptsSTNCount.projector(
        state
      )
    ).toEqual(0);
  });

  it('should return selectPendingReceiptList selector', () => {
    expect(
      selectors.OtherReceiptsSelector.selectPendingReceiptList.projector(
        receiptSTN
      )
    ).toEqual(receiptArray);
  });
  it('should return selectPendingReceiptLoanList selector', () => {
    expect(
      selectors.OtherReceiptsSelector.selectPendingReceiptLoanList.projector(
        receiptSTN
      )
    ).toEqual(receiptArray);
  });
  it('should return selectIsLoadingOtherReceiptsSTN selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isLoadingOtherReceiptList: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsLoadingOtherReceiptsSTN.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectSearchStockResults selector', () => {
    expect(
      selectors.OtherReceiptsSelector.selectSearchStockResults.projector(
        receiptSTN
      )
    ).toEqual(receiptArray);
  });

  it('should return selectNonVerifiedItems selector', () => {
    expect(
      selectors.OtherReceiptsSelector.selectNonVerifiedItems.projector(itemsSTN)
    ).toEqual(itemsArray);
  });

  it('should return selectVerifiedItems selector', () => {
    expect(
      selectors.OtherReceiptsSelector.selectVerifiedItems.projector(itemsSTN)
    ).toEqual(itemsArray);
  });

  it('should return selectIsNonVerifiedItemsLoading selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isNonVerifiedItemsLoading: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsNonVerifiedItemsLoading.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectIsVerifiedItemsLoading selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isVerifiedItemsLoading: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsVerifiedItemsLoading.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectIsItemsTotalCountLoaded selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isItemsTotalCountLoaded: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsItemsTotalCountLoaded.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectIsItemsTotalCountLoading selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isItemsTotalCountLoading: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsItemsTotalCountLoading.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectIsItemsTotalCountLoading selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isItemsTotalCountLoading: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsItemsTotalCountLoading.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectIsSearchingItems selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isSearchingItems: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsSearchingItems.projector(state)
    ).toEqual(true);
  });

  it('should return selectHasSearchedItems selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      hasSearchedItems: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectHasSearchedItems.projector(state)
    ).toEqual(true);
  });

  it('should return selectBinCodes selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      binCodes: []
    };
    expect(
      selectors.OtherReceiptsSelector.selectBinCodes.projector(state)
    ).toEqual([]);
  });

  it('should return selectRemarks selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      remarks: []
    };
    expect(
      selectors.OtherReceiptsSelector.selectRemarks.projector(state)
    ).toEqual([]);
  });

  it('should return selectSelectedStock selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      selectedStock: receipt1
    };
    expect(
      selectors.OtherReceiptsSelector.selectSelectedStock.projector(state)
    ).toEqual(receipt1);
  });

  it('should return selectNonVerifiedItemsTotalCount selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      nonVerifiedItemsTotalCount: 1
    };
    expect(
      selectors.OtherReceiptsSelector.selectNonVerifiedItemsTotalCount.projector(
        state
      )
    ).toEqual(1);
  });

  it('should return selectVerifiedItemsTotalCount selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      verifiedItemsTotalCount: 1
    };
    expect(
      selectors.OtherReceiptsSelector.selectVerifiedItemsTotalCount.projector(
        state
      )
    ).toEqual(1);
  });

  it('should return selectIsVerifyingAllItemSuccess selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isVerifyingAllItemSuccess: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsVerifyingAllItemSuccess.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectIsAssigningBinToAllItemsSuccess selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isAssigningBinToAllItemsSuccess: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsAssigningBinToAllItemsSuccess.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectConfirmedStock selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      confirmedStock: []
    };
    expect(
      selectors.OtherReceiptsSelector.selectConfirmedStock.projector(state)
    ).toEqual([]);
  });

  it('should return selectConfirmStockReceiveErrors selector', () => {
    const error: Errors = {
      errorCode: 'ERR_1',
      errorMessage: 'Error'
    };
    const state: OtherReceiptState = {
      ...initialState,
      confirmStockReceiveErrors: error
    };
    expect(
      selectors.OtherReceiptsSelector.selectConfirmStockReceiveErrors.projector(
        state
      )
    ).toEqual(error);
  });
  it('should return selectSelectedStockLoadError selector', () => {
    const error: Errors = {
      errorCode: 'ERR_1',
      errorMessage: 'Error'
    };
    const state: OtherReceiptState = {
      ...initialState,
      selectedStockLoadError: error
    };
    expect(
      selectors.OtherReceiptsSelector.selectSelectedStockLoadError.projector(
        state
      )
    ).toEqual(error);
  });

  it('should return selectIsAssigningBinToAllItems selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isAssigningBinToAllItems: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsAssigningBinToAllItems.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectOtherReceiptsDropDown selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      otherReceiptsDropdownValues: []
    };
    expect(
      selectors.OtherReceiptsSelector.selectOtherReceiptsDropDown.projector(
        state
      )
    ).toEqual([]);
  });

  it('should return selectOtherReceiptsSelectedDropDown selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      selectedDropDownForReceipts: ''
    };
    expect(
      selectors.OtherReceiptsSelector.selectOtherReceiptsSelectedDropDown.projector(
        state
      )
    ).toEqual('');
  });

  it('should return selectTotalReceiptsCount selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      totalElementsOtherReceipts: 1
    };
    expect(
      selectors.OtherReceiptsSelector.selectTotalReceiptsCount.projector(state)
    ).toEqual(1);
  });

  it('should return selectIsLoadingBinGroups selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isLoadingBinGroups: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsLoadingBinGroups.projector(state)
    ).toEqual(true);
  });

  it('should return selectIsLoadingRemarks selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isLoadingRemarks: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsLoadingRemarks.projector(state)
    ).toEqual(true);
  });
  it('should return selectIsLoadingSelectedStock selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isLoadingSelectedStock: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsLoadingSelectedStock.projector(
        state
      )
    ).toEqual(true);
  });
  it('should return selectUpdateItemSuccess selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      updateItemSuccess: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectUpdateItemSuccess.projector(state)
    ).toEqual(true);
  });

  it('should return selectAdjustmentSearchedItems selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      adjustmentSearchedItems: item
    };
    expect(
      selectors.OtherReceiptsSelector.selectAdjustmentSearchedItems.projector(
        state
      )
    ).toEqual(item);
  });

  it('should return selectItemsInCart selector', () => {
    expect(
      selectors.OtherReceiptsSelector.selectItemsInCart.projector(adjustmentSTN)
    ).toEqual(adjustmentArray);
  });

  it('should return selectCartItemIds selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      itemsInCarts: adjustmentSTN
    };
    expect(
      selectors.OtherReceiptsSelector.selectCartItemIds.projector(state)
    ).toEqual(adjustmentSTN.ids);
  });

  it('should return selectAdjustmentItemsSearchCount selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      adjustmentSearchedItemsCount: 1
    };
    expect(
      selectors.OtherReceiptsSelector.selectAdjustmentItemsSearchCount.projector(
        state
      )
    ).toEqual(1);
  });

  it('should return selectConfirmAdjustementItemsResponse selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      confirmAdjustementItemResponse: adjustment1
    };
    expect(
      selectors.OtherReceiptsSelector.selectConfirmAdjustementItemsResponse.projector(
        state
      )
    ).toEqual(adjustment1);
  });

  it('should return selectPendingReceiptADJList selector', () => {
    expect(
      selectors.OtherReceiptsSelector.selectPendingReceiptADJList.projector(
        receiptSTN
      )
    ).toEqual(receiptArray);
  });

  it('should return selectIsSearchingAdjustment selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isSearchingAdjustmentItems: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsSearchingAdjustment.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectIsLoadingAdjustment selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isLoadingAdjustment: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsLoadingAdjustment.projector(state)
    ).toEqual(true);
  });

  it('should return selectHasSearchItemInCartSearch selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      hasSearchItemInCartSearchAdjustment: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectHasSearchItemInCartSearch.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectPSVSearchedItems selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      psvSearchedItems: item
    };
    expect(
      selectors.OtherReceiptsSelector.selectPSVSearchedItems.projector(state)
    ).toEqual(item);
  });

  it('should return selectItemsInCartPSV selector', () => {
    expect(
      selectors.OtherReceiptsSelector.selectItemsInCartPSV.projector(
        adjustmentSTN
      )
    ).toEqual(adjustmentArray);
  });

  it('should return selectPSVItemsSearchCount selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      psvSearchedItemsCount: 0
    };
    expect(
      selectors.OtherReceiptsSelector.selectPSVItemsSearchCount.projector(state)
    ).toEqual(0);
  });

  it('should return selectConfirmPSVItemsResponse selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      confirmPSVItemResponse: adjustment1
    };
    expect(
      selectors.OtherReceiptsSelector.selectConfirmPSVItemsResponse.projector(
        state
      )
    ).toEqual(adjustment1);
  });

  it('should return selectIsSearchingPSV selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isSearchingPSVItems: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsSearchingPSV.projector(state)
    ).toEqual(true);
  });

  it('should return selectHasSearchedItemPSV selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      hasSearchedItemPSV: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectHasSearchedItemPSV.projector(state)
    ).toEqual(true);
  });

  it('should return selectIsLoadingPSV selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      IsLoadingPSV: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsLoadingPSV.projector(state)
    ).toEqual(true);
  });
  it('should return selectHasSearchItemInCartSearchPSV selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      hasSearchItemInCartSearchPSV: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectHasSearchItemInCartSearchPSV.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectFilterDataNonVerifiedProducts selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      filterDataNonVerifiedProducts: {}
    };
    expect(
      selectors.OtherReceiptsSelector.selectFilterDataNonVerifiedProducts.projector(
        state
      )
    ).toEqual({});
  });

  it('should return selectFilterDataVerifiedProducts selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      sortDataNonVerifiedProducts: []
    };
    expect(
      selectors.OtherReceiptsSelector.selectSortNonVerifiedProducts.projector(
        state
      )
    ).toEqual([]);
  });

  it('should return selectSortDataVerifiedProducts selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      sortDataVerifiedProducts: []
    };
    expect(
      selectors.OtherReceiptsSelector.selectSortDataVerifiedProducts.projector(
        state
      )
    ).toEqual([]);
  });

  it('should return selectItemsCountNonVerified selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      itemsCountNonVerified: 1
    };
    expect(
      selectors.OtherReceiptsSelector.selectItemsCountNonVerified.projector(
        state
      )
    ).toEqual(1);
  });

  it('should return selectItemsCountVerified selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      itemsCountVerified: 1
    };
    expect(
      selectors.OtherReceiptsSelector.selectItemsCountVerified.projector(state)
    ).toEqual(1);
  });

  it('should return selectIsNonVerifiedItemsLoaded selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isNonVerifiedItemsLoaded: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsNonVerifiedItemsLoaded.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectIsVerifiedItemsLoaded selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isVerifiedItemsLoaded: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectIsVerifiedItemsLoaded.projector(
        state
      )
    ).toEqual(true);
  });

  it('should return selectVerifyItemSuccess selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      verifyItemSuccess: true
    };
    expect(
      selectors.OtherReceiptsSelector.selectVerifyItemSuccess.projector(state)
    ).toEqual(true);
  });
  describe('Testing Other Receipts History Releated Selectors', () => {
    const state: OtherReceiptState = {
      ...initialState,
      otherReceiptsHistory: receiptSTN,
      isLoadingHistory: true,
      otherReceiptsHistoryCount: 2
    };
    // it('should return the other Issue History STNs', () => {
    //   const historySTNS = otherIssueAdapter.setAll(historySTNArray, {
    //     ...otherIssueAdapter.getInitialState()
    //   });

    //   // expect(selectors.otherIssueHistory.projector(state)).toEqual(historySTNS);
    // });
    it('should return selectPendingReceiptList selector', () => {
      expect(
        selectors.OtherReceiptsSelector.selectOtherReceiptsHistory.projector(
          receiptSTN
        )
      ).toEqual(receiptArray);
    });
    it('should return selectIsLoadingOtherReceiptsHistory', () => {
      expect(
        selectors.OtherReceiptsSelector.selectIsLoadingOtherReceiptsHistory.projector(
          state
        )
      ).toEqual(true);
    });
    it('should return selectIsLoadingOtherReceiptsHistory', () => {
      expect(
        selectors.OtherReceiptsSelector.selectOtherReceiptsHistoryCount.projector(
          state
        )
      ).toEqual(2);
    });
  });
  describe('Testing Selected Other Receipts History Selector', () => {
    const state: OtherReceiptState = {
      ...initialState,
      isLoadingSelectedHistory: false,
      hasSelectedHistory: true,
      selectedHistory: receipt1
    };
    it('should return selectOtherReceiptsHistoryCount', () => {
      expect(
        selectors.OtherReceiptsSelector.selectIsLoadingSelectedHistory.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return selectOtherReceiptsHistoryCount', () => {
      expect(
        selectors.OtherReceiptsSelector.selectHasSelectedHistory.projector(
          state
        )
      ).toEqual(true);
    });
    it('should return selectOtherReceiptsHistoryCount', () => {
      expect(
        selectors.OtherReceiptsSelector.selectSelectedHistory.projector(state)
      ).toEqual(receipt1);
    });
  });
  describe('Testing Other Receipts History Items Releated Selectors', () => {
    const state: OtherReceiptState = {
      ...initialState,
      historyItemsCount: 2,
      historyItems: itemsSTN,
      isLoadingHistoryItems: false,
      isHistoryItemsLoaded: true
    };
    // it('should return the other Issue History En', () => {
    //   const historySTNS = otherIssueAdapter.setAll(historySTNArray, {
    //     ...otherIssueAdapter.getInitialState()
    //   });

    //   // expect(selectors.otherIssueHistory.projector(state)).toEqual(historySTNS);
    // });
    it('should return selectHistoryItems selector', () => {
      expect(
        selectors.OtherReceiptsSelector.selectHistoryItems.projector(itemsSTN)
      ).toEqual(itemsArray);
    });
    it('should return selectIsLoadingHistoryItems', () => {
      expect(
        selectors.OtherReceiptsSelector.selectIsLoadingHistoryItems.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return selectIsHistoryItemsLoaded', () => {
      expect(
        selectors.OtherReceiptsSelector.selectIsHistoryItemsLoaded.projector(
          state
        )
      ).toEqual(true);
    });
  });

  describe('Testing Other Receipts History Items Total Count Related Selectors', () => {
    const state: OtherReceiptState = {
      ...initialState,
      historyItemsTotalCount: 2,
      isLoadingHistoryItemsTotalCount: false,
      isHistoryItemsTotalCountLoaded: true
    };
    it('should return selectIsHistoryItemsTotalCountLoaded', () => {
      expect(
        selectors.OtherReceiptsSelector.selectIsHistoryItemsTotalCountLoaded.projector(
          state
        )
      ).toEqual(true);
    });
    it('should return selectIsLoadingHistoryItemsTotalCount', () => {
      expect(
        selectors.OtherReceiptsSelector.selectIsLoadingHistoryItemsTotalCount.projector(
          state
        )
      ).toEqual(false);
    });
    it('should return selectHistoryItemsTotalCount', () => {
      expect(
        selectors.OtherReceiptsSelector.selectHistoryItemsTotalCount.projector(
          state
        )
      ).toEqual(2);
    });
  });
});
