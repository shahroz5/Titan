import { GEPProductDetails, GEPSearchResponse, HistorySearchParamDetails, ProductDetails } from '@poss-web/shared/models';
import * as moment from 'moment';
import {gepDetailsAdapter, gepCancelAdapter, GepDetailsEntity } from './gep.entity';
import { initialState } from './gep.reducer';
// you will need to assert that the store is calling the right selector function.
import * as selectors from './gep.selectors';
import { GepState } from './gep.state';

describe('Testing Gep related Selectors', () => {
  const gepInitRes=
    {
      docNo:9,
      id:'RTYUI',
      subTxnType:'NEW_GEP',
      status:'CONFIRM',
      txnType:'GEP'
    }

    const gepProductsDetails1 : GEPProductDetails = {
      id: "1",
      itemType: '',
      metalDetail: null,
      itemDetail: null,
      metalType: '',
      rate: 0,
      weight: 0,
      purity: 0,
      karatage: null,
      melted: null,
      totalValue: 0,
      totaltax: 0,
      deductions: 0,
      preMeltingDetails: {
        weight: 0,
        purity: 0,
        karatage: 0,
      },
      totalBreakUp: null,
      isSave: false,
    }

    const gepProductsDetails2 : GEPProductDetails = {
      id: "2",
      itemType: '',
      metalDetail: '',
      itemDetail: null,
      metalType: '',
      rate: 0,
      weight: 0,
      purity: 0,
      karatage: null,
      melted: null,
      totalValue: 0,
      totaltax: 0,
      deductions: 0,
      preMeltingDetails: {
        weight: 0,
        purity: 0,
        karatage: 0,
      },
      totalBreakUp: null,
      isSave: false,
    }

    const productDetailsArray = [
      gepProductsDetails1,
      gepProductsDetails2
    ];
    
    const addProductToEntities = <T extends GEPProductDetails>(
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

    const gepDetails: GepDetailsEntity  = {
      ids: [gepProductsDetails1.id, gepProductsDetails2.id],
      entities: addProductToEntities(productDetailsArray)
    };

    

  it('Should return gep item response', () => {
    const state: GepState = {
      ...initialState,
      gepItem:'any'


    };
    expect(
      selectors.GepSelector.gepItemResponse.projector(state)
    ).toEqual('any');
  });

  it('Should return gepinit item response', () => {
    const state: GepState = {
      ...initialState,
      gepInitResponse:gepInitRes

    };
    expect(
      selectors.GepSelector.selectGepInit.projector(state)
    ).toEqual(gepInitRes);
  });

  it('Should return gep response', () => {
    const state: GepState = {
      ...initialState,
      gepResponse:{
        docNo:9,
        id:'RTYUI',
        subTxnType:'NEW_GEP',
        status:'CONFIRM',
        txnType:'GEP'
      }


    };
    expect(
      selectors.GepSelector.selectGepResponse.projector(state)
    ).toEqual(gepInitRes);
  });

  it('Should return metal response', () => {
    const state: GepState = {
      ...initialState,
      metalPrice:[{
        metalName: 'J',
  offset: 9,
  karatage: 9,
  purity: 9,
  ratePerUnit: 9,
  unit: 'J',
  applicableDate: null,
  metalTypeCode: 'J',
      }]

    };
    expect(
      selectors.GepSelector.selectMetalPrice.projector(state)
    ).toEqual([{
      metalName: 'J',
offset: 9,
karatage: 9,
purity: 9,
ratePerUnit: 9,
unit: 'J',
applicableDate: null,
metalTypeCode: 'J',
    }]
);
  });

  it('Should return selectUpdatedGep item response', () => {
    const state: GepState = {
      ...initialState,
      updateGepItem:null

    };
    expect(
      selectors.GepSelector.selectUpdatedGep.projector(state)
    ).toEqual(null);
  });

  it('Should return loadGepDetailso item response', () => {
    const state: GepState = {
      ...initialState,
      loadGepDetails:null

    };
    expect(
      selectors.GepSelector.selectGepDetails .projector(state)
    ).toEqual(null);
  });

  it('Should return selectTotalBreakUp item response', () => {
    const state: GepState = {
      ...initialState,
      totalBreakUp:null

    };
    expect(
      selectors.GepSelector.selectTotalBreakUp  .projector(state)
    ).toEqual(null);
  });

  it('Should return selectCustomerDetails item response', () => {
    const state: GepState = {
      ...initialState,
      updateRso:null

    };
    expect(
      selectors.GepSelector.selectCustomerDetails  .projector(state)
    ).toEqual(null);
  });

  it('Should return selectMetalType item response', () => {
    const state: GepState = {
      ...initialState,
      metalType:null

    };
    expect(
      selectors.GepSelector.selectMetalType .projector(state)
    ).toEqual(null);
  });

  it('Should return selectItemType item response', () => {
    const state: GepState = {
      ...initialState,
      itemType:null

    };
    expect(
      selectors.GepSelector.selectItemType .projector(state)
    ).toEqual(null);
  });

  it('Should return selectItemType item response', () => {
    const state: GepState = {
      ...initialState,
      hasError:null

    };
    expect(
      selectors.GepSelector.selectHasError .projector(state)
    ).toEqual(null);
  });

  it('Should return isLoading item response', () => {
    const state: GepState = {
      ...initialState,
      isLoading:true

    };
    expect(
      selectors.GepSelector.selectIsLoaded .projector(state)
    ).toEqual(true);
  });

  it('Should return selectSummary item response', () => {
    const state: GepState = {
      ...initialState,
      summary:null

    };
    expect(
      selectors.GepSelector.selectSummary.projector(state)
    ).toEqual(null);
  });

  it('Should returnselectHoldRespone  item response', () => {
    const state: GepState = {
      ...initialState,
      holdConfirmResponse:null

    };
    expect(
      selectors.GepSelector.selectHoldRespone  .projector(state)
    ).toEqual(null);
  });

  it('Should selectdeleteGep   item response', () => {
    const state: GepState = {
      ...initialState,
      deleteGep:null

    };
    expect(
      selectors.GepSelector.selectdeleteGep .projector(state)
    ).toEqual(null);
  });

  it('Should selectloadgepitem   item response', () => {
    const state: GepState = {
      ...initialState,
      loadGepItem:null

    };
    expect(
      selectors.GepSelector.selectloadgepitem .projector(state)
    ).toEqual(null);
  });

  it('Should selecttCancelCount  item response', () => {
    const state: GepState = {
      ...initialState,
      cancelGepCount:9

    };
    expect(
      selectors.GepSelector.selecttCancelCount.projector(state)
    ).toEqual(9);
  });

  it('Should selectUploadResponse  item response', () => {
    const state: GepState = {
      ...initialState,
      preMeltingUploadResponse:null

    };
    expect(
      selectors.GepSelector.selectUploadResponse .projector(state)
    ).toEqual(null);
  });

  it('Should selectRsoResponse  item response', () => {
    const state: GepState = {
      ...initialState,
     rso:null

    };
    expect(
      selectors.GepSelector.selectRsoCancel .projector(state)
    ).toEqual(null);
  });

  it('Should selectReason item response', () => {
    const state: GepState = {
      ...initialState,
     reason:null

    };
    expect(
      selectors.GepSelector.selectRsoCancel .projector(state)
    ).toEqual(null);
  });

  it('Should selectReason item response', () => {
    const state: GepState = {
      ...initialState,
      deleteResponse:null

    };
    expect(
      selectors.GepSelector. selectDelete .projector(state)
    ).toEqual(null);
  });

  it('Should  selectRso item response', () => {
    const state: GepState = {
      ...initialState,
      updateRso:null

    };
    expect(
      selectors.GepSelector. selectRso .projector(state)
    ).toEqual(null);
  });

  it('Should  selectloadOnHol item response', () => {
    const state: GepState = {
      ...initialState,
      loadOnHold:null

    };
    expect(
      selectors.GepSelector. selectloadOnHold .projector(state)
    ).toEqual(null);
  });

  it('Should  selectloadOnHol item response', () => {
    const state: GepState = {
      ...initialState,
      saveCancelGep:null

    };
    expect(
      selectors.GepSelector. selectsaveCancelGep  .projector(state)
    ).toEqual(null);
  });

  it('Should electcountOnhold  item response', () => {
    const state: GepState = {
      ...initialState,
      countOnhold:null

    };
    expect(
      selectors.GepSelector.selectcountOnhold   .projector(state)
    ).toEqual(null);
  });

  describe('Testing Item details related Selectors', () => {
    // const itemDetailsArray = [];
    // const itemDetailsEntity = itemDetailsAdapter.setAll(itemDetailsArray, {
    //   ...itemDetailsAdapter.getInitialState()
    // });
    // it('Should return Item Entity', () => {
    //   const state: BillCancelState = {
    //     ...initialState,
    //     productDetails: itemDetailsEntity
    //   };
    //   expect(selectors.itemDetails.projector(state)).toEqual(itemDetailsEntity);
    // });

    // it('Should return Item Entity', () => {
    //   expect(
    //     selectors.BillCancelSelector.selectItemDetails.projector(
    //       itemDetailsEntity
    //     )
    //   ).toEqual(itemDetailsArray);
    // });
  });

  it('should return selectTEPHistoryResponse selector', () => {
    const gepSearchResponse:GEPSearchResponse={
      GEPList:[],
      totalElements:2
    }
    const state: GepState = {
      ...initialState,
      historyItems: gepSearchResponse
    };
    expect(
      selectors.GepSelector.selectGEPHistoryResponse.projector(state)
    ).toEqual(gepSearchResponse);
  });

  it('should return selectHistorySearchParamDetails selector', () => {
    const historySearchParamDetails : HistorySearchParamDetails = { cnDocNo:9 };
    const state: GepState = {
      ...initialState,
      historySearchParamDetails: historySearchParamDetails
    };
    expect(
      selectors.GepSelector.selectHistorySearchParamDetails.projector(state)
    ).toEqual(historySearchParamDetails);
  });

  it('Testing selectPartiallyUpdateGrfResponse selector', () => {
    const state: GepState = {
      ...initialState,
      viewGEPDeatilsResponse: null
    };
    expect(
      selectors.GepSelector.selectViewGEPResponse.projector(state)
    ).toEqual(null);
  });

  it('Should return selectRequests', () => {
    expect(
      selectors.GepSelector.selectgepDetails.projector(
        gepDetails
      )
    ).toEqual(productDetailsArray);
  });

});
