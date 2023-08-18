import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as DiscountActions from './discount.actions';
import { DiscountState } from './discount.state';
import { DiscountSelectors } from './discount.selectors';
import {
  ApplyDiscountRequest,
  AutoDiscRequest,
  CashMemoItemDetailsResponse,
  ConfirmTransactionLevelDiscountPayload,
  DiscountsRequestPayload,
  DiscountsResponse,
  DiscountTransactionLevelRequest,
  DiscountVoucherDetailsRequestPayload,
  GepPurityConfigIdEligibleItemsRequestPayload,
  ItemLevelDiscountsDetailsRequestPayload,
  ItemLevelDiscountsRequestPayload,
  KaratOrCoinOfferEligibleItemsRequestPayload,
  LoadAppliedTransactionDiscountsRequest,
  RemoveAllAppliedTransactionLevelDiscountsPayload,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  UpdateTransactionLevelDiscountByIDPayload
} from '@poss-web/shared/models';

@Injectable()
export class DiscountFacade {
  private isLoading$ = this.store.select(DiscountSelectors.selectIsLoading);

  private isDropdownLoading$ = this.store.select(
    DiscountSelectors.selectIsDropdownLoading
  );

  private isAlreadyAddedDiscountsLoading$ = this.store.select(
    DiscountSelectors.selectIsAlreadyAddedDiscountsLoading
  );

  private isDiscountDetailsLoading$ = this.store.select(
    DiscountSelectors.selectIsDiscountDetailsLoading
  );

  private isAutoDiscLoading$ = this.store.select(
    DiscountSelectors.selectIsAutoDiscLoading
  );

  private isABDropdownLoading$ = this.store.select(
    DiscountSelectors.selectIsABDropdownLoading
  );

  private error$ = this.store.select(DiscountSelectors.selectError);

  private itemLevelDiscounts$ = this.store.select(
    DiscountSelectors.selectItemLevelDiscounts
  );

  private itemLevelDiscountsDetails$ = this.store.select(
    DiscountSelectors.selectItemLevelDiscountsDetails
  );

  private getItemLevelDiscountsRes$ = this.store.select(
    DiscountSelectors.selectGetItemLevelDiscountsRes
  );

  private saveItemLevelDiscountsRes$ = this.store.select(
    DiscountSelectors.selectSaveItemLevelDiscountsRes
  );

  private updateItemLevelDiscountsRes$ = this.store.select(
    DiscountSelectors.selectUpdateItemLevelDiscountsRes
  );

  private deleteItemLevelDiscountsRes$ = this.store.select(
    DiscountSelectors.selectDeleteItemLevelDiscountsRes
  );

  private pcDesc$ = this.store.select(DiscountSelectors.selectPcDesc);

  private pgDesc$ = this.store.select(DiscountSelectors.selectPgDesc);

  private isDescLoaded$ = this.store.select(
    DiscountSelectors.selectIsDescLoaded
  );

  private discTypes$ = this.store.select(DiscountSelectors.selectDiscountTypes);

  private availableTransactionLevelDiscount$ = this.store.select(
    DiscountSelectors.selectTransactionLevelDiscounts
  );

  private avaliableDigiDiscount$ = this.store.select(
    DiscountSelectors.selectDigiGoldDiscounts
  );

  private avaliableGrnMultipleDiscount$ = this.store.select(
    DiscountSelectors.selectGrnMultipleDiscounts
  );
  private availableDvDiscounts$ = this.store.select(
    DiscountSelectors.selectSystemDvDiscounts
  );
  private availableEmployeeDiscounts$ = this.store.select(
    DiscountSelectors.selectAvailableEmployeeDiscounts
  );
  private availableTsssDiscounts$ = this.store.select(
    DiscountSelectors.selectAvailableTsssDiscounts
  );
  private availableTataEmployeeDiscount$ = this.store.select(
    DiscountSelectors.selectAvailableTataEmployeeDiscounts
  );
  private availableEmpowermentDiscounts$ = this.store.select(
    DiscountSelectors.selectAvailableEmpowermentDiscounts
  );
  private isLoadingAvailableDiscount$ = this.store.select(
    DiscountSelectors.selectIsLoadingAvailableDiscounts
  );
  private isTransactionLevelDiscountApplied$ = this.store.select(
    DiscountSelectors.selectIsTransactionLevelDiscountsApplied
  );
  private appliedTransactionLevelDiscounts$ = this.store.select(
    DiscountSelectors.selectAppliedTransactionLevelDiscounts
  );
  private appliedBillLevelTransactionLevelDiscounts$ = this.store.select(
    DiscountSelectors.selectAppliedBillLevelTransactionLevelDiscounts
  );
  private appliedEmployeeDiscounts$ = this.store.select(
    DiscountSelectors.selectAppliedEmployeeDiscounts
  );
  private appliedTSSSDiscounts$ = this.store.select(
    DiscountSelectors.selectAppliedTsssDiscounts
  );
  private appliedTataEmployeeDiscounts$ = this.store.select(
    DiscountSelectors.selectAppliedTataEmployeeDiscounts
  );
  private appliedSystemDvDiscounts$ = this.store.select(
    DiscountSelectors.selectAppliedSystemDvDiscounts
  );
  private appliedSystemGhsBonusDiscount$ = this.store.select(
    DiscountSelectors.selectAppliedSystemGhsBonusDiscounts
  );
  private appliedEmpowermentDiscount$ = this.store.select(
    DiscountSelectors.selectAppliedEmployeeDiscounts
  );

  private isAllAppliedTransactionLevelDiscountDeleted$ = this.store.select(
    DiscountSelectors.selectIsAllAppliedTransactionLevelDiscountsRemoved
  );
  private isSelectedTransactionLevelDiscountDeleted$ = this.store.select(
    DiscountSelectors.selectIsSelectedTransactionLevelDiscountRemoved
  );
  private isTransactionLevelDiscountUpdated$ = this.store.select(
    DiscountSelectors.selectIsTransactionLevelDiscountUpdated
  );
  private isRsoSelected$ = this.store.select(
    DiscountSelectors.selectIsRsoSelected
  );
  private isTransactionLevelDiscountConfirmed$ = this.store.select(
    DiscountSelectors.selectIsTransactionLevelDiscountConfirmed
  );

  private isEncircleDiscDetails$ = this.store.select(
    DiscountSelectors.selectIsEncircleDiscDetails
  );
  private tataCompanyList$ = this.store.select(
    DiscountSelectors.selectTataCompanyList
  );

  private eligibleItemsResponseForKaratOrCoinOffer$ = this.store.select(
    DiscountSelectors.selectEligibleItemsResponseForKaratOrCoinOffer
  );

  private appliedKaratorCoinOfferDiscountResponse$ = this.store.select(
    DiscountSelectors.selectAppliedKaratorCoinOfferDiscountResponse
  );

  private discountVoucherDetails$ = this.store.select(
    DiscountSelectors.selectDiscountVoucherDetails
  );
  private refreshDiscountAndOffersPanel$ = this.store.select(
    DiscountSelectors.selectRefreshDiscountsAndOffersPanel
  );

  private eligibleItemsResponseForGepPurityOffer$ = this.store.select(
    DiscountSelectors.selectEligibleItemsResponseForGepPurityOffer
  );

  private checkABCOEligibility$ = this.store.select(
    DiscountSelectors.selectCheckABCOEligibilityRes
  );
  private loadABCODiscountsRes$ = this.store.select(
    DiscountSelectors.selectLoadABCODiscountsRes
  );
  private loadNewABCODiscountsRes$ = this.store.select(
    DiscountSelectors.selectLoadNewABCODiscountsRes
  );
  private loadABCODiscountDetailsRes$ = this.store.select(
    DiscountSelectors.selectLoadABCODiscountDetailsRes
  );
  private loadABCOConfigDetailsRes$ = this.store.select(
    DiscountSelectors.selectLoadABCOConfigDetailsRes
  );
  private loadAutoDiscountsRes$ = this.store.select(
    DiscountSelectors.selectLoadAutoDiscountsRes
  );

  private currentDeletedDiscount$ = this.store.select(
    DiscountSelectors.selectCurrentDeletedDiscount
  );

  private selectCurrentConfirmedDiscount$ = this.store.select(
    DiscountSelectors.selectCurrentConfirmedDiscount
  );

  private selectCurrentdiscountState$ = this.store.select(
    DiscountSelectors.selectCurrentdiscountState
  );

  private getIsExcludeSlabItemAdded$ = this.store.select(
    DiscountSelectors.selectGetIsExcludeSlabItemAdded
  );

  private clearEncircle$ = this.store.select(
    DiscountSelectors.selectClearEncircleRes
  );
  private reloadDiscountsGrid$ = this.store.select(
    DiscountSelectors.selectReloadDiscountGrid
  );
  private getOrderDiscDetails$ = this.store.select(
    DiscountSelectors.selectOrderDiscDetails
  );
  private selectAppliedTransactionLevelDiscountsBykey$ = (key: string) =>
    this.store.select(
      DiscountSelectors.selectAppliedTransactionLevelDiscountsBykey(key)
    );
  private rivaahGHSDiscounts$ = this.store.select(
    DiscountSelectors.selectRivaahGHSDiscounts
  );

  private saveRivaahGHSDiscountsResponse$ = this.store.select(
    DiscountSelectors.selectSaveRivaahGHSDiscountsResponse
  );
  private enableCalculateRivaahGHSDiscounts$ = this.store.select(
    DiscountSelectors.selectEnableCalculateRivaahGHSDiscounts
  );
  private reasonForChangingDiscounts$ = this.store.select(
    DiscountSelectors.selectReasonForChangingDiscounts
  );
  private reasonForNotGivingDiscounts$ = this.store.select(
    DiscountSelectors.selectReasonForNotGivingDiscounts
  );

  constructor(private store: Store<DiscountState>) {}

  /**
   * Access for the State selectors
   */
  getIsLoading() {
    return this.isLoading$;
  }

  getConfimrationDiscountState() {
    return this.selectCurrentdiscountState$;
  }

  getIsDropdownLoading() {
    return this.isDropdownLoading$;
  }

  getIsAlreadyAddedDiscountsLoading() {
    return this.isAlreadyAddedDiscountsLoading$;
  }

  getIsDiscountDetailsLoading() {
    return this.isDiscountDetailsLoading$;
  }

  getError() {
    return this.error$;
  }

  getIsExcludeSlabItemAdded() {
    return this.getIsExcludeSlabItemAdded$;
  }

  getItemLevelDiscounts() {
    return this.itemLevelDiscounts$;
  }

  getItemLevelDiscountsDetails() {
    return this.itemLevelDiscountsDetails$;
  }

  getConfirmedDiscount() {
    return this.selectCurrentConfirmedDiscount$;
  }

  getTransactionLevelDiscountByKey(key: string) {
    return this.selectAppliedTransactionLevelDiscountsBykey$(key);
  }

  getDeletedDiscount() {
    return this.currentDeletedDiscount$;
  }

  getItemLevelDiscountsRes() {
    return this.getItemLevelDiscountsRes$;
  }

  saveItemLevelDiscountsRes() {
    return this.saveItemLevelDiscountsRes$;
  }

  updateItemLevelDiscountsRes() {
    return this.updateItemLevelDiscountsRes$;
  }

  deleteItemLevelDiscountsRes() {
    return this.deleteItemLevelDiscountsRes$;
  }

  getDiscountTypes() {
    return this.discTypes$;
  }

  getPcDesc() {
    return this.pcDesc$;
  }

  getPgDesc() {
    return this.pgDesc$;
  }

  getIsDescLoaded() {
    return this.isDescLoaded$;
  }

  getIsEncircleDiscDetails() {
    return this.isEncircleDiscDetails$;
  }

  getAvailableTransactionLevelDiscounts() {
    return this.availableTransactionLevelDiscount$;
  }

  getDigiDiscounts() {
    return this.avaliableDigiDiscount$;
  }

  getGrnMultipleDiscounts() {
    return this.avaliableGrnMultipleDiscount$;
  }
  getAvailableSystemDvDiscounts() {
    return this.availableDvDiscounts$;
  }
  getAvailableEmployeeDiscounts() {
    return this.availableEmployeeDiscounts$;
  }
  getAvailableTsssDiscounts() {
    return this.availableTsssDiscounts$;
  }
  getAvailableTataEmployeeDiscounts() {
    return this.availableTataEmployeeDiscount$;
  }
  getAvailableEmpowermentDiscounts() {
    return this.availableEmpowermentDiscounts$;
  }

  getIsLoadingAvailableDiscounts() {
    return this.isLoadingAvailableDiscount$;
  }
  getIsTransactionLevelDiscountApplied() {
    return this.isTransactionLevelDiscountApplied$;
  }
  getAppliedTransactionLevelDiscounts() {
    return this.appliedTransactionLevelDiscounts$;
  }
  getAppliedBillLevelTransactionLevelDiscounts() {
    return this.appliedBillLevelTransactionLevelDiscounts$;
  }
  getAppliedEmployeeLevelDiscounts() {
    return this.appliedEmployeeDiscounts$;
  }
  getAppliedTSSSLevelDiscounts() {
    return this.appliedTSSSDiscounts$;
  }
  getAppliedTataEmployeeLevelDiscounts() {
    return this.appliedTataEmployeeDiscounts$;
  }
  getAppliedSystemDvDiscounts() {
    return this.appliedSystemDvDiscounts$;
  }
  getAppliedSystemGhsDiscounts() {
    return this.appliedSystemGhsBonusDiscount$;
  }
  getAppliedEmpowermentDiscounts() {
    return this.appliedEmpowermentDiscount$;
  }
  getIsAllAppliedTransactionLevelDiscountsDeleted() {
    return this.isAllAppliedTransactionLevelDiscountDeleted$;
  }
  getIsSelectedTransactionLevelDiscountDeleted() {
    return this.isSelectedTransactionLevelDiscountDeleted$;
  }
  getIsTransactionLevelDiscountUpdated() {
    return this.isTransactionLevelDiscountUpdated$;
  }
  getIsRsoSelected() {
    return this.isRsoSelected$;
  }
  getIsTransactionLevelDiscountConfirmed() {
    return this.isTransactionLevelDiscountConfirmed$;
  }
  getTataCompanyList() {
    return this.tataCompanyList$;
  }

  getEligibleItemsResponseForKaratOrCoinOffer() {
    return this.eligibleItemsResponseForKaratOrCoinOffer$;
  }

  getEligibleItemsResponseForGepPurityOfferOffer() {
    return this.eligibleItemsResponseForGepPurityOffer$;
  }

  getAppliedKaratorCoinOfferDiscountResponse() {
    return this.appliedKaratorCoinOfferDiscountResponse$;
  }
  getDiscountVoucherDetails() {
    return this.discountVoucherDetails$;
  }
  getIsRefresh() {
    return this.refreshDiscountAndOffersPanel$;
  }
  getCheckABCOEligibilityRes() {
    return this.checkABCOEligibility$;
  }
  getLoadABCODiscountsRes() {
    return this.loadABCODiscountsRes$;
  }
  getLoadNewABCODiscountsRes() {
    return this.loadNewABCODiscountsRes$;
  }
  getLoadABCODiscountDetailsRes() {
    return this.loadABCODiscountDetailsRes$;
  }
  getLoadABCOConfigDetailsRes() {
    return this.loadABCOConfigDetailsRes$;
  }
  getLoadAutoDiscountsRes() {
    return this.loadAutoDiscountsRes$;
  }
  getIsAutoDiscLoading() {
    return this.isAutoDiscLoading$;
  }
  getIsABDropdownLoading() {
    return this.isABDropdownLoading$;
  }
  getIsClearEncircle() {
    return this.clearEncircle$;
  }
  getIsReloadDiscountsGrid() {
    return this.reloadDiscountsGrid$;
  }
  getOrderDiscDetails() {
    return this.getOrderDiscDetails$;
  }
  getRivaahGHSDiscounts() {
    return this.rivaahGHSDiscounts$;
  }
  getSaveRivaahGHSDiscountsResponse() {
    return this.saveRivaahGHSDiscountsResponse$;
  }
  getEnableCalculateRivaahGHSDiscounts() {
    return this.enableCalculateRivaahGHSDiscounts$;
  }
  getReasonForChangingDiscounts() {
    return this.reasonForChangingDiscounts$;
  }
  getReasonForNotGivingDiscounts() {
    return this.reasonForNotGivingDiscounts$;
  }

  clear() {
    this.store.dispatch(new DiscountActions.Clear());
  }

  clearItemLevelDiscountDetails() {
    this.store.dispatch(new DiscountActions.ClearItemLevelDiscountDetails());
  }

  setDiscountState(state: string) {
    this.store.dispatch(new DiscountActions.SetDiscountState(state));
  }
  clearUpdateItemLevelDiscountDetails() {
    this.store.dispatch(
      new DiscountActions.ClearUpdateItemLevelDiscountDetails()
    );
  }
  loadReloadDiscountsGrid(payload: boolean) {
    this.store.dispatch(new DiscountActions.RealodDiscountsGrid(payload));
  }
  loadItemLevelDiscounts(payload: ItemLevelDiscountsRequestPayload) {
    this.store.dispatch(new DiscountActions.LoadItemLevelDiscounts(payload));
  }

  loadItemLevelDiscountsDetails(
    payload: ItemLevelDiscountsDetailsRequestPayload
  ) {
    this.store.dispatch(
      new DiscountActions.LoadItemLevelDiscountsDetails(payload)
    );
  }

  loadGetItemLevelDiscounts(payload: DiscountsRequestPayload) {
    this.store.dispatch(new DiscountActions.GetItemLevelDiscounts(payload));
  }

  loadSaveItemLevelDiscounts(payload: {
    request: DiscountsRequestPayload;
    data: CashMemoItemDetailsResponse;
  }) {
    this.store.dispatch(new DiscountActions.SaveItemLevelDiscounts(payload));
  }

  saveExcludeSlabItemDiscount(payload: DiscountsRequestPayload) {
    this.store.dispatch(
      new DiscountActions.SaveExcludeSlabItemDiscount(payload)
    );
  }

  loadUpdateItemLevelDiscounts(payload: DiscountsRequestPayload) {
    this.store.dispatch(new DiscountActions.UpdateItemLevelDiscounts(payload));
  }

  loadDeleteItemLevelDiscounts(payload: {
    request: DiscountsRequestPayload;
    data: CashMemoItemDetailsResponse | DiscountsResponse[];
  }) {
    this.store.dispatch(new DiscountActions.DeleteItemLevelDiscounts(payload));
  }

  loadAvailableTransactionLevelDiscounts(
    payload: DiscountTransactionLevelRequest
  ) {
    this.store.dispatch(
      new DiscountActions.LoadTransactionLevelDiscounts(payload)
    );
  }

  loadDigiGoldDiscounts(payload: DiscountTransactionLevelRequest) {
    this.store.dispatch(new DiscountActions.LoadDigiGoldDiscounts(payload));
  }

  loadGrnMultipleDiscounts(payload: DiscountTransactionLevelRequest) {
    this.store.dispatch(new DiscountActions.LoadGrnMultipleDiscounts(payload));
  }

  loadAvailableEmployeeDiscounts(payload: DiscountTransactionLevelRequest) {
    this.store.dispatch(
      new DiscountActions.LoadAvailableEmployeeDiscounts(payload)
    );
  }
  loadAvailableTsssDiscounts(payload: DiscountTransactionLevelRequest) {
    this.store.dispatch(
      new DiscountActions.LoadAvailableTSSSDiscounts(payload)
    );
  }
  loadAvailableTataEmployeeDiscounts(payload: DiscountTransactionLevelRequest) {
    this.store.dispatch(
      new DiscountActions.LoadAvailableTataEmployeeDiscounts(payload)
    );
  }
  loadAvailableSystemDvDiscount(payload: DiscountTransactionLevelRequest) {
    this.store.dispatch(
      new DiscountActions.LoadAvailableSystemDvDiscounts(payload)
    );
  }
  loadAvailableEmpowermentDiscount(payload: DiscountTransactionLevelRequest) {
    this.store.dispatch(
      new DiscountActions.LoadAvailableEmpowementDiscounts(payload)
    );
  }
  applyTransactionLevelDiscounts(payload: ApplyDiscountRequest) {
    this.store.dispatch(
      new DiscountActions.ApplyDiscountAtTransactionLevel(payload)
    );
  }
  loadAppliedTransactionLevelDiscounts(
    payload: LoadAppliedTransactionDiscountsRequest
  ) {
    this.store.dispatch(
      new DiscountActions.LoadAppliedTransactionLevelDiscounts(payload)
    );
  }
  removeAllAppliedTransactionLevelDiscounts(
    payload: RemoveAllAppliedTransactionLevelDiscountsPayload
  ) {
    this.store.dispatch(
      new DiscountActions.RemoveAllAppliedTransactionLevelDiscounts(payload)
    );
  }
  removeSelectedTransactionLevelDiscount(
    payload: RemoveAppliedTransactionLevelDiscountByIDPayload
  ) {
    this.store.dispatch(
      new DiscountActions.RemoveAppliedTransactionLevelDiscountByID(payload)
    );
  }

  removeDigiDiscount(
    payload: RemoveAppliedTransactionLevelDiscountByIDPayload
  ) {
    this.store.dispatch(new DiscountActions.RemoveDigiDiscount(payload));
  }
  updateTransactionLevelDiscount(
    payload: UpdateTransactionLevelDiscountByIDPayload
  ) {
    this.store.dispatch(
      new DiscountActions.UpdateAppliedTransactionLevelDiscount(payload)
    );
  }
  confirmTransactionLevelDiscount(
    payload: ConfirmTransactionLevelDiscountPayload
  ) {
    this.store.dispatch(
      new DiscountActions.ConfirmAppliedTransactionLevelDiscount(payload)
    );
  }
  clearTransactionLevelDiscountDetails() {
    this.store.dispatch(
      new DiscountActions.ClearTransactionLevelDiscountDetails()
    );
  }

  loadPcDesc() {
    this.store.dispatch(new DiscountActions.LoadPcDesc());
  }

  loadPgDesc() {
    this.store.dispatch(new DiscountActions.LoadPgDesc());
  }
  setIsRsoSelected(isSelected: boolean) {
    this.store.dispatch(new DiscountActions.SetIsRsoSelected(isSelected));
  }

  loadDiscountTypes(discountType: string) {
    this.store.dispatch(new DiscountActions.LoadDiscountTypes(discountType));
  }

  setEncircle(data: any) {
    this.store.dispatch(new DiscountActions.SetIsEncircleDetails(data));
  }

  clearEncircleAdded() {
    this.store.dispatch(new DiscountActions.ClearIsEncircleAdded());
  }
  loadTataCompanyList(payload: string) {
    this.store.dispatch(new DiscountActions.LoadTataCompanyNameList(payload));
  }

  loadEligibleItemsForDiscountIds(
    discountType: string,
    requestPayload: KaratOrCoinOfferEligibleItemsRequestPayload
  ) {
    this.store.dispatch(
      new DiscountActions.LoadEligibleItemsForDiscountIds(
        discountType,
        requestPayload
      )
    );
  }

  loadEligibleItemsForGepPurityOffer(
    requestPayload: GepPurityConfigIdEligibleItemsRequestPayload
  ) {
    this.store.dispatch(
      new DiscountActions.LoadEligibleItemsForGepPurityConfig(requestPayload)
    );
  }

  resetEligibleItemsForDiscountIds() {
    this.store.dispatch(
      new DiscountActions.LoadEligibleItemsForDiscountIdsSuccess(null)
    );
  }

  resetEligibleItemsForGepPurityOffer() {
    this.store.dispatch(
      new DiscountActions.LoadEligibleItemsForGepPurityConfigSuccess(null)
    );
  }

  applyKaratOrCoinOfferDiscount(payload: ApplyDiscountRequest) {
    this.store.dispatch(
      new DiscountActions.ApplyKaratOrCoinOfferDiscount(payload)
    );
  }

  resetAppliedKaratOrCoinOfferDiscount() {
    this.store.dispatch(
      new DiscountActions.ApplyKaratOrCoinOfferDiscountSuccess(null)
    );
  }
  loadDiscountVoucherDetails(payload: DiscountVoucherDetailsRequestPayload) {
    this.store.dispatch(
      new DiscountActions.LoadDiscountVoucherDetails(payload)
    );
  }
  setRefreshDiscountsAndOffersPanel(payload: boolean) {
    this.store.dispatch(
      new DiscountActions.RefreshDiscountsAndOffersPanel(payload)
    );
  }
  checkABCOEligibility(payload: {
    data: any;
    existingDiscounts: DiscountsResponse[];
    id: string[];
  }) {
    this.store.dispatch(new DiscountActions.CheckABCOEligibility(payload));
  }
  loadABCODiscounts(payload: DiscountsRequestPayload) {
    this.store.dispatch(new DiscountActions.LoadABCODiscounts(payload));
  }
  loadNewABCODiscounts(payload: DiscountsRequestPayload) {
    this.store.dispatch(new DiscountActions.LoadNewABCODiscounts(payload));
  }
  loadABCODiscountDetails(payload: {
    data: any;
    existingDiscounts: DiscountsResponse[];
    id: string[];
  }) {
    this.store.dispatch(new DiscountActions.LoadABCODiscountDetails(payload));
  }
  loadABCOConfigDetails(payload: DiscountsRequestPayload) {
    this.store.dispatch(new DiscountActions.LoadABCOConfigDetails(payload));
  }
  loadAutoDiscounts(payload: AutoDiscRequest) {
    this.store.dispatch(new DiscountActions.LoadAutoDiscounts(payload));
  }
  clearEncircle() {
    this.store.dispatch(new DiscountActions.ClearEncircle());
  }
  setOrderDiscDetails(discDetails) {
    this.store.dispatch(new DiscountActions.SetOrderDiscDetails(discDetails));
  }
  clearOrderDiscDetails() {
    this.store.dispatch(new DiscountActions.ClearOrderDiscDetails());
  }
  loadRivaahGHSDiscounts(payload: DiscountTransactionLevelRequest) {
    this.store.dispatch(new DiscountActions.LoadRivaahGHSDiscounts(payload));
  }
  saveRivaahGHSDiscounts(payload: ApplyDiscountRequest) {
    this.store.dispatch(new DiscountActions.SaveRivaahGHSDiscounts(payload));
  }
  setEnableCalculateRivaahGHSDiscounts(payload: boolean) {
    this.store.dispatch(
      new DiscountActions.SetEnableCalculateRivaahGHSDiscounts(payload)
    );
  }
  loadReasonForChangingDiscounts(payload: string) {
    this.store.dispatch(
      new DiscountActions.LoadReasonForChangingDiscounts(payload)
    );
  }
  loadReasonForNotGivingDiscounts(payload: string) {
    this.store.dispatch(
      new DiscountActions.LoadReasonForNotGivingDiscounts(payload)
    );
  }
}
