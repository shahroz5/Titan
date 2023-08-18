import { CustomErrors, ItemStoneDetails } from '@poss-web/shared/models';
import { initialState } from './item-details-popup.reducer';
import { ItemDetailsPopupSelectors } from './item-details-popup.selectors';
import { ItemDetailsPopupState } from './item-details-popup.state';

describe('Testing Item Detail Popup related Selectors', () => {
  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: ItemDetailsPopupState = {
      ...initialState,
      error: error
    };
    expect(ItemDetailsPopupSelectors.selectError.projector(state)).toEqual(
      error
    );
  });

  it('Should return loading status ', () => {
    const isLoading = true;
    const state: ItemDetailsPopupState = {
      ...initialState,
      isLoading: isLoading
    };
    expect(ItemDetailsPopupSelectors.selectIsLoading.projector(state)).toEqual(
      isLoading
    );
  });

  it('Should return stone details ', () => {
    const stoneDetails: ItemStoneDetails[] = [
      {
        color: 'Blue',
        description: 'Blue Stone 1',
        noOfStones: 12,
        price: 1234,
        quality: 'A',
        ratePerCarat: 2345,
        stoneCode: 'DA',
        stoneWeight: 12.33,
        currencyCode: 'IND',
        weightUnit: 'gms'
      },
      {
        color: 'Blue',
        description: 'Blue Stone 2',
        noOfStones: 12,
        price: 1234,
        quality: 'A',
        ratePerCarat: 2345,
        stoneCode: 'DA',
        stoneWeight: 12.33,
        currencyCode: 'IND',
        weightUnit: 'gms'
      }
    ];
    const state: ItemDetailsPopupState = {
      ...initialState,
      stoneDetails: stoneDetails
    };
    expect(
      ItemDetailsPopupSelectors.selectStoneDetails.projector(state)
    ).toEqual(stoneDetails);
  });

  it('Should return Pg Desc ', () => {
    const productGroupDesc = [
      {
        code: 'Description 1',
        description: 'Description 2'
      },
      {
        code: 'Description 1',
        description: 'Description 2'
      }
    ];
    const state: ItemDetailsPopupState = {
      ...initialState,
      productGroupDesc: productGroupDesc
    };
    expect(ItemDetailsPopupSelectors.selectPgDesc.projector(state)).toEqual(
      productGroupDesc
    );
  });

  it('Should return Pc Desc ', () => {
    const productCategoryDesc = [
      {
        code: 'Description 1',
        description: 'Description 2'
      },
      {
        code: 'Description 1',
        description: 'Description 2'
      }
    ];
    const state: ItemDetailsPopupState = {
      ...initialState,
      productCategoryDesc: productCategoryDesc
    };
    expect(ItemDetailsPopupSelectors.selectPcDesc.projector(state)).toEqual(
      productCategoryDesc
    );
  });

  it('Should return Desc Loaded status as true', () => {
    const productGroupDesc = [
      {
        code: 'Description 1',
        description: 'Description 2'
      },
      {
        code: 'Description 1',
        description: 'Description 2'
      }
    ];

    const productCategoryDesc = [
      {
        code: 'Description 1',
        description: 'Description 2'
      },
      {
        code: 'Description 1',
        description: 'Description 2'
      }
    ];

    expect(
      ItemDetailsPopupSelectors.selectIsDescLoaded.projector(
        productGroupDesc,
        productCategoryDesc
      )
    ).toBeTruthy();
  });

  it('Should return Desc Loaded status as true', () => {
    const productGroupDesc = null

    const productCategoryDesc =  null

    expect(
      ItemDetailsPopupSelectors.selectIsDescLoaded.projector(
        productGroupDesc,
        productCategoryDesc
      )
    ).toBeFalsy();
  });
});
