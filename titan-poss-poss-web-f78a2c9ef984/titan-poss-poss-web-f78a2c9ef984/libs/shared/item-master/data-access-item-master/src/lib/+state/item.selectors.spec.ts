import * as selectors from './item.selectors';
import { initialState } from './item.reducer';
import { ItemListingState } from './item.state';
import {
  CustomErrors,
  ItemDetails,
  ListingPageData,
  ItemStones,
  ItemFilterPayload,
  Lov,
  ProductGroup
} from '@poss-web/shared/models';

describe('Item selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  const cfaData: ProductGroup[] = [
    { productGroupCode: 'abc', description: 'abc' }
  ];
  const lovData: Lov[] = [{ code: 'abc', isActive: true, value: 'abc' }];
  it('Should return the true or false', () => {
    const state: ItemListingState = {
      ...initialState,
      isLoading: true
    };
    expect(selectors.ItemSelectors.selectIsLoading.projector(state)).toEqual(
      true
    );
  });
  it('Should return the error object', () => {
    const state: ItemListingState = {
      ...initialState,
      error: {
        error: null,
        timeStamp: '',
        traceId: '',
        code: '',
        message: ''
      }
    };
    expect(selectors.ItemSelectors.selectError.projector(state)).toEqual(error);
  });
  it('Should return the listing', () => {
    const listing: ListingPageData[] = [
      {
        itemCode: 'ABC',
        description: 'ABC'
      }
    ];
    const state: ItemListingState = {
      ...initialState,
      itemListing: listing
    };
    expect(
      selectors.ItemSelectors.selectItemDetailsListing.projector(state)
    ).toEqual(listing);
  });
  it('Should return the count', () => {
    const state: ItemListingState = {
      ...initialState,
      totalItemDetails: 0
    };
    expect(
      selectors.ItemSelectors.selectTotalItemDetailsCount.projector(state)
    ).toEqual(0);
  });
  it('Should return the details by item code', () => {
    const details: ItemDetails = {
      isEditable: true,
      itemCode: 'ABC',
      description: 'ABC',
      isActive: true,
      stoneWeight: 'ABC',
      indentType: 'ABC',
      isConsignable: true,
      maxWeightDeviation: 'ABC',
      stdWeight: 'ABC',
      productCode: 'ABC',
      brandCode: 'ABC',
      productType: 'ABC',
      materialCode: 'ABC',
      supplyChainCode: 'ABC',
      itemNature: 'ABC',
      stdPrice: 'ABC',
      stoneCharges: 'ABC',
      leadTime: 'ABC',
      hsnSacCode: 'ABC',
      purity: 'ABC',
      inventoryType: 'ABC',
      CFAproductCode: 'ABC',
      complexityCode: 'ABC',
      pricingType: 'ABC',
      taxClass: 'ABC',
      findingCode: 'ABC',
      size: 'ABC',
      finishing: 'ABC',
      pricingGroupType: 'ABC',
      priceFactor: 'ABC',
      karatage: 'ABC',
      diamondKaratage: 'ABC',
      diamondClarity: 'ABC',
      diamondColour: 'ABC',
      perGram: true,
      saleable: true,
      returnable: true,
      indentable: true
    };

    const state: ItemListingState = {
      ...initialState,
      itemDetails: details
    };
    expect(
      selectors.ItemSelectors.selectItemDetailsByItemCode.projector(state)
    ).toEqual(details);
  });
  it('Should  return time formats', () => {
    const state: ItemListingState = {
      ...initialState,
      CFAproductCode: cfaData
    };
    expect(
      selectors.ItemSelectors.selectCFAproductCode.projector(state)
    ).toEqual(cfaData);
  });
  it('Should  return date formats', () => {
    const state: ItemListingState = {
      ...initialState,
      pricingType: lovData
    };
    expect(selectors.ItemSelectors.selectPricingTypes.projector(state)).toEqual(
      lovData
    );
  });
  it('Should return the item stoneData', () => {
    const stoneData: ItemStones[] = [
      {
        id: 'ABC',
        isActive: true,
        itemCode: 'ABC',
        noOfStones: 2,
        stoneCode: 'ABC'
      }
    ];
    const state: ItemListingState = {
      ...initialState,
      itemStones: stoneData
    };
    expect(selectors.ItemSelectors.selectItemStones.projector(state)).toEqual(
      stoneData
    );
  });
  it('Should return the Item filter', () => {
    const filterPayload: ItemFilterPayload = {
      fromStdValue: 10,
      fromStdWeight: 10,
      fromStoneCharges: 10,
      itemCode: 'ABC',
      pricingType: 'ABC',
      productCategoryCode: 'ABC',
      productGroupCode: 'ABC',
      toStdValue: 100,
      toStdWeight: 100,
      toStoneCharges: 100
    };
    const state: ItemListingState = {
      ...initialState,
      filterPayload: filterPayload
    };
    expect(selectors.ItemSelectors.selectItemFilter.projector(state)).toEqual(
      filterPayload
    );
  });
});
