import { createSelector } from '@ngrx/store';
import { CommomStateAttributeNameEnum } from '@poss-web/shared/models';
import { selectCommonState } from './common.reducer';

export const selectGlobalAttributes = (key: CommomStateAttributeNameEnum) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.global.hasOwnProperty(key)) {
      return stateAttributes.global[key];
    }
    return null;
  });
export const selectCashMemoAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.cashMemo.hasOwnProperty(key))
      return stateAttributes.cashMemo[key];
    return null;
  });

export const selectInvoiceAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.invoice.hasOwnProperty(key))
      return stateAttributes.invoice[key];
    return null;
  });
export const selectAdvanceBookingAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.ab.hasOwnProperty(key)) return stateAttributes.ab[key];
    return null;
  });
export const selectMergeGrfAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.mergeGrf.hasOwnProperty(key))
      return stateAttributes.mergeGrf[key];
    return null;
  });
export const selectGiftCardAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.gc.hasOwnProperty(key)) return stateAttributes.gc[key];
    return null;
  });
export const selectAcceptAdvanceAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.acceptAdv.hasOwnProperty(key))
      return stateAttributes.acceptAdv[key];
    return null;
  });
export const selectGrfAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.grf.hasOwnProperty(key))
      return stateAttributes.grf[key];
    return null;
  });
export const selectTepAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.tep.hasOwnProperty(key))
      return stateAttributes.tep[key];
    return null;
  });
export const selectWalkinsAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.grf.hasOwnProperty(key))
      return stateAttributes.grf[key];
    return null;
  });
export const selectGepAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.gep.hasOwnProperty(key))
      return stateAttributes.gep[key];
    return null;
  });
export const selectGrnAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.grn.hasOwnProperty(key))
      return stateAttributes.grn[key];
    return null;
  });
export const selectFocAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.foc.hasOwnProperty(key))
      return stateAttributes.foc[key];
    return null;
  });
export const selectManualFocAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.manualFoc.hasOwnProperty(key))
      return stateAttributes.manualFoc[key];
    return null;
  });
export const selectBillCancellationAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.bill_cancellation.hasOwnProperty(key))
      return stateAttributes.bill_cancellation[key];
    return null;
  });
export const selectDiscountAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.discount.hasOwnProperty(key))
      return stateAttributes.discount[key];
    return null;
  });
export const selectInventoryAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.inventory.hasOwnProperty(key))
      return stateAttributes.inventory[key];
    return null;
  });
  export const selectCOAttributes = (key: string) =>
  createSelector(selectCommonState, stateAttributes => {
    if (stateAttributes.co.hasOwnProperty(key))
      return stateAttributes.co[key];
    return null;
  });
