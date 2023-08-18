import { createSelector } from '@ngrx/store';
import { selectNewBinRequestState } from './in-stock.reducers';
import { itemSelector } from './in-stock.entity';



const selectBinCodes = createSelector(
  selectNewBinRequestState,
  state => state.binCodes
);



const selectHasError = createSelector(
  selectNewBinRequestState,
  state => state.error
);

const selectIsLoaded = createSelector(
  selectNewBinRequestState,
  state => state.loaded
);

const selectIsLoading = createSelector(
  selectNewBinRequestState,
  state => state.isLoading
);

const History = createSelector(
  selectNewBinRequestState,
  state => state.binHistoryResponse
);
const selectBinHistory = createSelector(
  History,
  itemSelector.selectAll
);



const selectHistoryError = createSelector(
  selectNewBinRequestState,
  state => state.binHistoryError
);


const selectIsHistoryLoading = createSelector(
  selectNewBinRequestState,
  state => state.isHistoryLoading
);

const selectDocNo = createSelector(
  selectNewBinRequestState,
  state => state.docNo
);

const selectIsBinCodeReset = createSelector(
  selectNewBinRequestState,
  state => state.isBinCodeReset
);


const selectIsDocNoReset = createSelector(
  selectNewBinRequestState,
  state => state.isDocNoReset
);

const selectbinCodesCount = createSelector(
  selectNewBinRequestState,
  state => state.binCodeCount
);

const selectbinHistoryCount = createSelector(
  selectNewBinRequestState,
  state => state.binHistoryCount
);

const selectIsRequestingBin = createSelector(
  selectNewBinRequestState,
  state => state.isRequestingBin
);

const selectIsRequestedBinSuccess = createSelector(
  selectNewBinRequestState,
  state => state.isRequestedBinSuccess
);

const selectRequestBinSuccess = createSelector(
  selectNewBinRequestState,
  state => state.binRequestResponse
);

const selectHistoryFilterData = createSelector(
  selectNewBinRequestState,
  state => state.advancedFilter
);


export const InStockSelector = {

  selectBinCodes,
  selectDocNo,
  selectHasError,
  selectIsBinCodeReset,
  selectIsDocNoReset, selectIsLoaded,
  selectIsLoading,
  selectbinCodesCount,
  selectIsRequestedBinSuccess,
  selectIsRequestingBin,
  selectRequestBinSuccess,
  selectHistoryError,
  selectIsHistoryLoading,
  selectBinHistory,
  selectbinHistoryCount,
  selectHistoryFilterData,
  History
};
