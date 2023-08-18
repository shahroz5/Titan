import { InStockState } from './update-hallmark.state';
import * as selectors from './update-hallmark.selectors';
import { initialBoutiqueStatisticsState } from './update-hallmark.reducers';
import * as moment from 'moment';

import { InStockAction, InStockActionTypes } from './update-hallmark.action';
import { itemAdapter } from './update-hallmark.entity';

import { EntityState } from '@ngrx/entity';
import { BinHistroyResponse } from '@poss-web/shared/models';

describe('request approval selector Testing Suite', () => {
  const dummyItemsResponse = [
    {
      id: 78,
      reqDocNo: 67,
      reqLocationCode: 'string;',
      reqDocDate: null,
      binName: 'string;',
      status: ' string;',
      requestedRemarks: 'string;',
      binGroupCode: ' string;',
      approvedRemarks: ' string;',
      reqFiscalYear: null
    }
  ];
  const addElementToEntities = <T extends BinHistroyResponse>(
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

  // const pendingSTNSArray = [pendingSTN1, pendingSTN2];

  describe('Testing Bin request count  related Selectors', () => {
    it('Should return the selected bin request items', () => {
      const bincodes = null;

      const state: InStockState = {
        ...initialBoutiqueStatisticsState,
        binCodes: null
      };
      expect(selectors.InStockSelector.selectBinCodes.projector(state)).toEqual(
        bincodes
      );
    });
  });

  it('Should return the selected bin request items', () => {
    const error = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      error: null
    };
    expect(selectors.InStockSelector.selectHasError.projector(state)).toEqual(
      error
    );
  });
  it('Should return the Loaded items', () => {
    const loaded = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      loaded: null
    };
    expect(selectors.InStockSelector.selectIsLoaded.projector(state)).toEqual(
      loaded
    );
  });
  it('Should return the selected bin request items', () => {
    const isLoading = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      isLoading: null
    };
    expect(selectors.InStockSelector.selectIsLoading.projector(state)).toEqual(
      isLoading
    );
  });
  // it('Should return the selected bin request items', () => {
  //   const binHistoryResponse = null;

  //   const state: InStockState = {
  //     ...initialBoutiqueStatisticsState,
  //     binHistoryResponse: null
  //   };
  //   expect(selectors.InStockSelector.selectBinHistory.projector(state)).toEqual(
  //     binHistoryResponse
  //   );
  // });

  it('Should return the bin history error items', () => {
    const binHistoryError = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      binHistoryError: null
    };
    expect(
      selectors.InStockSelector.selectHistoryError.projector(state)
    ).toEqual(binHistoryError);
  });

  it('Should return the selectIsHistoryLoading', () => {
    const isHistoryLoading = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      isHistoryLoading: null
    };
    expect(
      selectors.InStockSelector.selectIsHistoryLoading.projector(state)
    ).toEqual(isHistoryLoading);
  });

  it('Should return the selectDocNo', () => {
    const docNo = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      docNo: null
    };
    expect(selectors.InStockSelector.selectDocNo.projector(state)).toEqual(
      docNo
    );
  });

  it('Should return the isBinCodeReset', () => {
    const isBinCodeReset = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      isBinCodeReset: null
    };
    expect(
      selectors.InStockSelector.selectIsBinCodeReset.projector(state)
    ).toEqual(isBinCodeReset);
  });

  it('Should return the selectIsDocNoReset', () => {
    const isDocNoReset = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      isDocNoReset: null
    };
    expect(
      selectors.InStockSelector.selectIsDocNoReset.projector(state)
    ).toEqual(isDocNoReset);
  });
  it('Should return the binCodeCount', () => {
    const binCodeCount = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      binCodeCount: null
    };
    expect(
      selectors.InStockSelector.selectbinCodesCount.projector(state)
    ).toEqual(binCodeCount);
  });
  it('Should return the selectbinHistoryCount', () => {
    const binHistoryCount = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      binHistoryCount: null
    };
    expect(
      selectors.InStockSelector.selectbinHistoryCount.projector(state)
    ).toEqual(binHistoryCount);
  });
  it('Should return the selected bin request items', () => {
    const isRequestingBin = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      isRequestingBin: null
    };
    expect(
      selectors.InStockSelector.selectIsRequestingBin.projector(state)
    ).toEqual(isRequestingBin);
  });

  it('Should return the selected bin request items', () => {
    const isRequestedBinSuccess = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      isRequestedBinSuccess: null
    };
    expect(
      selectors.InStockSelector.selectIsRequestedBinSuccess.projector(state)
    ).toEqual(isRequestedBinSuccess);
  });

  it('Should return the selectRequestBinSuccess ', () => {
    const binRequestResponse = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      binRequestResponse: null
    };
    expect(
      selectors.InStockSelector.selectRequestBinSuccess.projector(state)
    ).toEqual(binRequestResponse);
  });
  it('Should return the selectHistoryFilterData', () => {
    const advancedFilter = null;

    const state: InStockState = {
      ...initialBoutiqueStatisticsState,
      advancedFilter: null
    };
    expect(
      selectors.InStockSelector.selectHistoryFilterData.projector(state)
    ).toEqual(advancedFilter);
  });
  describe('Testing Item related Selectors', () => {
    const itemArray = dummyItemsResponse;
    const itemEntity = itemAdapter.setAll(itemArray, {
      ...itemAdapter.getInitialState()
    });
    it('Should return Item Entity', () => {
      const state: InStockState = {
        ...initialBoutiqueStatisticsState,
        binHistoryResponse: itemEntity
      };
      expect(selectors.InStockSelector.History.projector(state)).toEqual(
        itemEntity
      );
    });

    it('Should return Item Entity', () => {
      expect(
        selectors.InStockSelector.selectBinHistory.projector(itemEntity)
      ).toEqual(itemArray);
    });
  });
});
