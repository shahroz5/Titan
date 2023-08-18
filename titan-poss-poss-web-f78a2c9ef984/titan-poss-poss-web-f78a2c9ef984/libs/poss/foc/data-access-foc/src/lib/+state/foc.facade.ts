import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { FocState } from './foc.state';
import { FocSelector } from './foc.selectors';
import {
  LoadPendingCMPayload,
  LoadPendingFocSchemesPayload,
  LoadFocItemDetailsPayload,
  IssuepPendingFocPayload,
  PendingCMResponsePayload,
  FocSchemeRequestDto,
  AddFocToCMPayload,
  CmFocPayload,
  KeepFocPendingPayload,
  OrderDetailsForFOC,
  ValidateManualFocPayload,
  AddManualFocToCMPayload,
  VerifyManualFocPayload
} from '@poss-web/shared/models';
import {
  LoadPendingFocCM,
  LoadPendingFocScheme,
  LoadFocItemDetails,
  IssuePendingFOC,
  ResetFocData,
  SetSelectedFocCM,
  // SetFocItems,
  LoadConfiguredFocSchemes,
  LoadFocSchemesAndItems,
  AddFocToCm,
  DeleteFocFromCm,
  GetFocAssignedToCm,
  KeepFocPending,
  SetKeepFocPendingTrigger,
  LoadFocSchemesForItems,
  ClearLoadFocSchemesForItems,
  SaveABFocSchemes,
  LoadABFocSchemes,
  LoadSelectedABFocSchemes,
  LoadABFocSchemesForItems,
  DeleteABFocSchemes,
  ClearABFocSchemes,
  LoadManuaFocItems,
  LoadManualFocItemDetails,
  ValidateManualFoc,
  ClearValidatedManualFoc,
  AddManualFocToCm,
  DeleteManualFocFromCm,
  GetManualFocAssignedToCm,
  VerifyManualFoc,
  ClearVerifyManualFoc,
  LoadSelectedABFocSchemesCount,
  ClearABFocSchemesCount
} from './foc.actions';

@Injectable()
export class FocFacade {
  private isLoadingPendingCM$ = this.store.select(
    FocSelector.selectIsLoadingPendingCM
  );

  private pendingCM$ = this.store.select(FocSelector.selectPendingCM);

  private isLoadingPendingSchemes$ = this.store.select(
    FocSelector.selectIsLoadingPendingScheme
  );

  private selectedCm$ = this.store.select(FocSelector.selectSelectedPendingCM);

  private pendingSchemes$ = this.store.select(
    FocSelector.selectPendingFocScheme
  );

  private isLoadingFocItemDetails$ = this.store.select(
    FocSelector.selectIsLoadingFocItemDetails
  );

  private isLoadingManualFocItemDetails$ = this.store.select(
    FocSelector.selectIsLoadingManualFocItemDetails
  );

  private hasFocItemDetails$ = this.store.select(
    FocSelector.selectHasFocItemDetails
  );

  private hasManualFocItemDetails$ = this.store.select(
    FocSelector.selectHasManualFocItemDetails
  );

  private focItemDetails$ = this.store.select(FocSelector.selectFocItemDetails);

  private manualFocItemDetails$ = this.store.select(
    FocSelector.selectManulFocItemDetails
  );

  private issuePendingFocResponse$ = this.store.select(
    FocSelector.selectIssuePendingFocResponse
  );

  private isIssuingPendingFOC$ = this.store.select(
    FocSelector.selectIsIssuingPendingFOC
  );
  private focItems$ = this.store.select(FocSelector.selectFocItems);
  // private focItemsCount$ = this.store.select(FocSelector.selecFocItemsCount);
  // private totalFocEligibleWt$ = this.store.select(
  //   FocSelector.selectTotalEligibleWt
  // );
  // private totalFocIssuingWt$ = this.store.select(
  //   FocSelector.selectTotalFocIssuingWt
  // );

  private error$ = this.store.select(FocSelector.selectError);

  private isLoading$ = this.store.select(FocSelector.selectIsLoading);

  private availableSchemes$ = this.store.select(
    FocSelector.selectAvailableSchemes
  );

  private focSchemes$ = this.store.select(FocSelector.selectFocSchemes);

  private manualFocItems$ = this.store.select(FocSelector.selectManualFocItems);

  private focAddedToCm$ = this.store.select(FocSelector.selectFocAddedToCm);

  private isFocAdded$ = this.store.select(FocSelector.selectIsFocAdded);

  private manualFocAddedToCm$ = this.store.select(
    FocSelector.selectManualFocAddedToCm
  );

  private isManualFocAdded$ = this.store.select(
    FocSelector.selectIsManualFocAdded
  );

  private pendingFocSchemesIds$ = this.store.select(
    FocSelector.selectPendingFocSchemeIds
  );
  private isFocSchemesLoaded$ = this.store.select(
    FocSelector.selectIsFocSchemesLoaded
  );
  private keepFocPendingTrigger$ = this.store.select(
    FocSelector.selectKeepFocPendingTrigger
  );
  private isFocKeptPending$ = this.store.select(
    FocSelector.selectIsFocKeptPending
  );
  private isFocSchemesForItems$ = this.store.select(
    FocSelector.selectIsFocSchemesForItems
  );
  // AB FOC

  private ABFocSchemes$ = this.store.select(FocSelector.selectABFocSchemes);
  private ABFocSchemesForItems$ = this.store.select(
    FocSelector.selectABFocSchemesForItems
  );
  private savedABFocSchemes$ = this.store.select(
    FocSelector.selectSavedABFocSchemes
  );
  private deletedABFocSchemes$ = this.store.select(
    FocSelector.selectDeletedABFocSchemes
  );
  private selectedABFocSchemes$ = this.store.select(
    FocSelector.selectSelectedABFocSchemes
  );
  private selectedABFocSchemesCount$ = this.store.select(
    FocSelector.selectSelectedABFocSchemesCount
  );
  private isManualFocValidated$ = this.store.select(
    FocSelector.selectIsManualFocValidated
  );

  private isManualFocVerified$ = this.store.select(
    FocSelector.selectIsManualFocVerified
  );

  constructor(private store: Store<FocState>) {}

  getIsLoadingPendingCm() {
    return this.isLoadingPendingCM$;
  }
  getPendingCM() {
    return this.pendingCM$;
  }
  getSelectedCmDetails() {
    return this.selectedCm$;
  }

  getIsLoadingPendingFocScheme() {
    return this.isLoadingPendingSchemes$;
  }
  getPendingSchemes() {
    return this.pendingSchemes$;
  }

  getIsLoadingFocItemDetails() {
    return this.isLoadingFocItemDetails$;
  }

  getIsLoadingManualFocItemDetails() {
    return this.isLoadingManualFocItemDetails$;
  }
  getHasFocItemDetails() {
    return this.hasFocItemDetails$;
  }
  getHasManualFocItemDetails() {
    return this.hasManualFocItemDetails$;
  }
  getFocItemDetails() {
    return this.focItemDetails$;
  }

  getManualFocItemDetails() {
    return this.manualFocItemDetails$;
  }

  getIssuePendingFOCResponse() {
    return this.issuePendingFocResponse$;
  }
  getIsIssuingPendingFOC() {
    return this.isIssuingPendingFOC$;
  }
  getFocItems() {
    return this.focItems$;
  }
  // getTotalFocEligibleWt() {
  //   return this.totalFocEligibleWt$;
  // }
  // getTotalFocIssuingeWt() {
  //   return this.totalFocIssuingWt$;
  // }
  // getFocItemsCount() {
  //   return this.focItemsCount$;
  // }
  getError() {
    return this.error$;
  }

  getIsLoading() {
    return this.isLoading$;
  }
  getAvailableSchemes() {
    return this.availableSchemes$;
  }
  getFocSchemes() {
    return this.focSchemes$;
  }
  getFocListAddedToCM() {
    return this.focAddedToCm$;
  }
  getIsFocAdded() {
    return this.isFocAdded$;
  }

  getManualFocListAddedToCM() {
    return this.manualFocAddedToCm$;
  }

  getIsManualFocAdded() {
    return this.isManualFocAdded$;
  }
  getPendingFocSchemeIds() {
    return this.pendingFocSchemesIds$;
  }
  getIsFocSchemesLoaded() {
    return this.isFocSchemesLoaded$;
  }
  getKeepFocPendingTrigger() {
    return this.keepFocPendingTrigger$;
  }
  getIsFocKeptPending() {
    return this.isFocKeptPending$;
  }
  getIsFocSchemesForItems() {
    return this.isFocSchemesForItems$;
  }

  // AB FOC
  getABFocSchemes() {
    return this.ABFocSchemes$;
  }
  getABFocSchemesForItems() {
    return this.ABFocSchemesForItems$;
  }
  getSavedABFocSchemes() {
    return this.savedABFocSchemes$;
  }
  getDeletedABFocSchemes() {
    return this.deletedABFocSchemes$;
  }
  getSelectedABFocSchemes() {
    return this.selectedABFocSchemes$;
  }
  getSelectedABFocSchemesCount() {
    return this.selectedABFocSchemesCount$;
  }

  getManualFocItems() {
    return this.manualFocItems$;
  }

  getIsManualFocValidated() {
    return this.isManualFocValidated$;
  }

  getIsManualFocVerified() {
    return this.isManualFocVerified$;
  }

  loadPendingCM(payload: LoadPendingCMPayload) {
    this.store.dispatch(new LoadPendingFocCM(payload));
  }
  setSelectedFocCm(payload: PendingCMResponsePayload) {
    this.store.dispatch(new SetSelectedFocCM(payload));
  }
  loadPendingSchemes(payload: LoadPendingFocSchemesPayload) {
    this.store.dispatch(new LoadPendingFocScheme(payload));
  }

  loadFocItemDetails(payload: LoadFocItemDetailsPayload) {
    this.store.dispatch(new LoadFocItemDetails(payload));
  }

  loadManualFocItemDetails(payload: LoadFocItemDetailsPayload) {
    this.store.dispatch(new LoadManualFocItemDetails(payload));
  }

  issuePendingFoc(payload: IssuepPendingFocPayload) {
    this.store.dispatch(new IssuePendingFOC(payload));
  }

  resetFOCData() {
    this.store.dispatch(new ResetFocData());
  }
  loadAvailableSchemes() {
    this.store.dispatch(new LoadConfiguredFocSchemes());
  }
  loadFocSchemesAndItems(payload: FocSchemeRequestDto) {
    this.store.dispatch(new LoadFocSchemesAndItems(payload));
  }

  loadManualFocItems(payload: string) {
    this.store.dispatch(new LoadManuaFocItems(payload));
  }
  addFocToCm(payload: AddFocToCMPayload) {
    this.store.dispatch(new AddFocToCm(payload));
  }

  addManualFocToCm(payload: AddManualFocToCMPayload) {
    this.store.dispatch(new AddManualFocToCm(payload));
  }
  deleteFoc(payload: CmFocPayload) {
    this.store.dispatch(new DeleteFocFromCm(payload));
  }

  deleteManualFoc(payload: CmFocPayload) {
    this.store.dispatch(new DeleteManualFocFromCm(payload));
  }
  getFocAssignedToCM(payload: CmFocPayload) {
    this.store.dispatch(new GetFocAssignedToCm(payload));
  }
  getManualFocAssignedToCM(payload: CmFocPayload) {
    this.store.dispatch(new GetManualFocAssignedToCm(payload));
  }
  keepFocPending(payload: KeepFocPendingPayload) {
    this.store.dispatch(new KeepFocPending(payload));
  }
  setKeepFocTrigger(payload: boolean) {
    this.store.dispatch(new SetKeepFocPendingTrigger(payload));
  }
  loadFocSchemesForItems(payload: FocSchemeRequestDto) {
    this.store.dispatch(new LoadFocSchemesForItems(payload));
  }
  clearFocSchemesForItems() {
    this.store.dispatch(new ClearLoadFocSchemesForItems());
  }

  // AB FOC

  loadABFocSchemes(payload: FocSchemeRequestDto) {
    this.store.dispatch(new LoadABFocSchemes(payload));
  }

  loadABFocSchemesForItems(payload: FocSchemeRequestDto) {
    this.store.dispatch(new LoadABFocSchemesForItems(payload));
  }

  saveABFocSchemes(payload: OrderDetailsForFOC) {
    this.store.dispatch(new SaveABFocSchemes(payload));
  }

  loadSelectedABFocSchemes(payload: OrderDetailsForFOC) {
    this.store.dispatch(new LoadSelectedABFocSchemes(payload));
  }

  loadSelectedABFocSchemesCount(payload: OrderDetailsForFOC) {
    this.store.dispatch(new LoadSelectedABFocSchemesCount(payload));
  }

  deleteABFocSchemes(payload: OrderDetailsForFOC) {
    this.store.dispatch(new DeleteABFocSchemes(payload));
  }

  clearABFocSchemes() {
    this.store.dispatch(new ClearABFocSchemes());
  }

  clearABFocSchemesCount() {
    this.store.dispatch(new ClearABFocSchemesCount());
  }

  validateManualFoc(payload: ValidateManualFocPayload) {
    this.store.dispatch(new ValidateManualFoc(payload));
  }

  verifyManualFoc(payload: VerifyManualFocPayload) {
    this.store.dispatch(new VerifyManualFoc(payload));
  }

  clearVerifyManualFoc() {
    this.store.dispatch(new ClearVerifyManualFoc());
  }

  clearValidatedManualFoc() {
    this.store.dispatch(new ClearValidatedManualFoc());
  }
}
