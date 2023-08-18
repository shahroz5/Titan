import { createSelector } from "@ngrx/store";
import { selectPaymentMasterState } from './payment-master.reducers';


const selectPaymentMasterList = createSelector(
  selectPaymentMasterState,
  state => state.paymentMasterList
)
const selectPaymentMaster = createSelector(
  selectPaymentMasterState,
  state => state.paymentMaster
)

const selectTotalElements = createSelector(
  selectPaymentMasterState,
  state => state.totalElements
)

const selectIsloading = createSelector(
  selectPaymentMasterState,
  state => state.isLoading
)
const selectError = createSelector(
  selectPaymentMasterState,
  state => state.error
)

const selectHasSaved = createSelector(
  selectPaymentMasterState,
  state => state.hasSaved
)
const selectHasUpdated = createSelector(
  selectPaymentMasterState,
  state => state.hasUpdated
)

export const PaymentMasterSelectors =
{
  selectPaymentMasterList,
  selectTotalElements,
  selectIsloading,
  selectError,
  selectHasSaved,
  selectHasUpdated,
  selectPaymentMaster


}
