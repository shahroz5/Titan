import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  BankDepositRequestPayload,
  GhsFileUploadResponse,
  MetalRatesRequestFormat,
  OfflineGhsEodRevenueCollection,
  ServiceFileUploadResponse
} from '@poss-web/shared/models';
import * as BodEodActions from './bod-eod.actions';
import { bodEodSelectors } from './bod-eod.selectors';
import { BodEodState } from './bod-eod.state';

@Injectable()
export class BodEodFacade {
  constructor(private store: Store<BodEodState>) {}

  /*Select from store*/
  private error$ = this.store.select(bodEodSelectors.selectError);
  private isLoading$ = this.store.select(bodEodSelectors.selectIsLoading);

  private bodProcessStatus$ = this.store.select(
    bodEodSelectors.selectBodProcessStatus
  );
  private eodProcessStatus$ = this.store.select(
    bodEodSelectors.selectEodProcessStatus
  );
  private previousdayEodStatus$ = this.store.select(
    bodEodSelectors.selectPreviousdayEodStatus
  );
  private bodBusinessDate$ = this.store.select(
    bodEodSelectors.selectBodBusinessDate
  );
  private closedBusinessDate$ = this.store.select(
    bodEodSelectors.selectClosedBusinessDate
  );

  private rateFetchAttempts$ = this.store.select(
    bodEodSelectors.selectRateFetchAttempts
  );
  private bodProcessStarted$ = this.store.select(
    bodEodSelectors.selectIsBodProcessStarted
  );
  private isEodProcessStarted$ = this.store.select(
    bodEodSelectors.selectIsEodProcessStarted
  );
  private availableMetalRates$ = this.store.select(
    bodEodSelectors.selectAvailableMetalRates
  );
  private goldRate$ = this.store.select(bodEodSelectors.selectGoldRate);
  private isGoldRateAvailable$ = this.store.select(
    bodEodSelectors.selectIsGoldRateAvailable
  );
  private metalRatesAvailableStatus$ = this.store.select(
    bodEodSelectors.selectMetalRatesAvailableStatus
  );

  private boutiquePossBodStatus$ = this.store.select(
    bodEodSelectors.selectBoutiquePossBodStatus
  );
  private ghsBodStatus$ = this.store.select(bodEodSelectors.selectGhsBodStatus);
  private getGhsOfflineBodPassword$ = this.store.select(
    bodEodSelectors.selectGhsOfflineBodPassword
  );
  private currentDayBodStatus$ = this.store.select(
    bodEodSelectors.selectCurrentDayBodStatus
  );
  private eodBusinessDate$ = this.store.select(
    bodEodSelectors.selectEodBusinessDate
  );
  private walkInDetailsStatus$ = this.store.select(
    bodEodSelectors.selectWalkInDetailsStatus
  );
  private ghsBankDepositUploadStatus$ = this.store.select(
    bodEodSelectors.selectGhsBankDepositUploadStatus
  );
  private boutiqueBankDepositStatus$ = this.store.select(
    bodEodSelectors.selectBoutiqueBankDepositStatus
  );
  private boutiqueRevenueCollectionStatus$ = this.store.select(
    bodEodSelectors.selectBoutiqueRevenueCollectionStatus
  );
  private ghsRevenueCollectionStatus$ = this.store.select(
    bodEodSelectors.selectGhsRevenueCollectionStatus
  );
  private serviceRevenueCollectionStatus$ = this.store.select(
    bodEodSelectors.selectServiceRevenueCollectionStatus
  );

  private ghsEodActivityStatus$ = this.store.select(
    bodEodSelectors.selectGhsEodActivityStatus
  );
  private boutiquePossEodActivityStatus$ = this.store.select(
    bodEodSelectors.selectBoutiquePossEodActivityStatus
  );
  private offlineGhsEodRevenueCollectionStatus$ = this.store.select(
    bodEodSelectors.selectOfflineGhsEodRevenueCollectionStatus
  );
  private bodStepsStatus$ = this.store.select(
    bodEodSelectors.selectBodStepsStatus
  );
  private eodStepsStatus$ = this.store.select(
    bodEodSelectors.selectEodStepsStatus
  );
  private offlineEghsPasswordsListing$ = this.store.select(
    bodEodSelectors.selectOfflineEghsPasswordsListing
  );
  private offlineGhsPasswordCount$ = this.store.select(
    bodEodSelectors.selectofflineGhsPasswordCount
  );
  private activeUserSessions$ = this.store.select(
    bodEodSelectors.selectActiveUserSessions
  );

  /*Dispatching Bod Process Actions*/

  loadPreviousDayEodStatus() {
    this.store.dispatch(new BodEodActions.PreviousDayEod());
  }
  loadRateRetryAttempts() {
    this.store.dispatch(new BodEodActions.LoadRetryAttempts());
  }
  startBodProcess() {
    this.store.dispatch(new BodEodActions.StartBodProcess());
  }
  boutiquePossBodCompletedSuccess(businessDayBodPayload) {
    this.store.dispatch(
      new BodEodActions.BoutiquePossBodCompletedSuccess(businessDayBodPayload)
    );
  }
  loadAvailableMetalRatesForBusinessDay(payload: MetalRatesRequestFormat) {
    this.store.dispatch(
      new BodEodActions.LoadAvailableMetalRatesForBusinessDay(payload)
    );
  }
  loadMetalRatesForBusinessDay(businessDate: number) {
    this.store.dispatch(
      new BodEodActions.LoadMetalRatesForBusinessDay(businessDate)
    );
  }

  checkIfBoutiquePossBodCompleted(businessDate: number) {
    this.store.dispatch(
      new BodEodActions.BoutiquePossBodCompleted(businessDate)
    );
  }
  markBodProcessCompleted() {
    this.store.dispatch(new BodEodActions.MarkBodProcessCompleted());
  }
  markEodProcessCompleted() {
    this.store.dispatch(new BodEodActions.MarkEodProcessCompleted());
  }

  partialUpdateForMetalRates(message) {
    this.store.dispatch(
      new BodEodActions.LoadAvailableMetalRatesForBusinessDayFailure(message)
    );
  }
  checkIfGhsBodCompleted(businessDate: number) {
    this.store.dispatch(new BodEodActions.GhsBodCompleted(businessDate));
  }
  generatePasswordForEghsOffline(requestPayload) {
    this.store.dispatch(
      new BodEodActions.GeneratePasswordForEghsOffline(requestPayload)
    );
  }
  loadGhsOfflineBodPasswords() {
    this.store.dispatch(new BodEodActions.LoadGhsOfflineBodPasswords());
  }
  /*Dispatching EOD Process Actions*/

  startEodProcess() {
    this.store.dispatch(new BodEodActions.StartEodProcess());
  }
  loadCurrentDayBodStatus() {
    this.store.dispatch(new BodEodActions.CurrentDayBod());
  }
  checkIfWalkinDetailsCompleted(businessDate: number) {
    this.store.dispatch(new BodEodActions.WalkinDetailsCompleted(businessDate));
  }
  checkPreviousDayGhsDepositUploaded(businessDate: number) {
    this.store.dispatch(
      new BodEodActions.PreviousDayGHSBankDepositUpload(businessDate)
    );
  }
  checkPreviousDayBankDeposit(businessDate: BankDepositRequestPayload) {
    this.store.dispatch(
      new BodEodActions.PreviousDayBankDepositCompleted(businessDate)
    );
  }
  performBoutiqueRevenueCollection(businessDate: number) {
    this.store.dispatch(
      new BodEodActions.PerformRevenueCollection(businessDate)
    );
  }
  performGhsRevenueCollection(businessDate: number) {
    this.store.dispatch(
      new BodEodActions.PerformGhsRevenueCollection(businessDate)
    );
  }
  performGhsRevenueCollectionSuccess(payload: GhsFileUploadResponse) {
    this.store.dispatch(
      new BodEodActions.PerformGhsRevenueCollectionSuccess(payload)
    );
  }
  performServiceRevenueCollection(businessDate: number) {
    this.store.dispatch(
      new BodEodActions.PerformServiceRevenueCollection(businessDate)
    );
  }
  performServiceRevenueCollectionSuccess(payload: ServiceFileUploadResponse) {
    this.store.dispatch(
      new BodEodActions.PerformServiceRevenueCollectionSuccess(payload)
    );
  }

  performGhsEodActivity(businessDate: number) {
    this.store.dispatch(new BodEodActions.GHSEodCompleted(businessDate));
  }
  performBoutiqueEodActivity(businessDate: number) {
    this.store.dispatch(
      new BodEodActions.BoutiquePossEodCompleted(businessDate)
    );
  }
  performOfflineEodGhsRevenueCollection(input: OfflineGhsEodRevenueCollection) {
    this.store.dispatch(
      new BodEodActions.PerformOfflineEodGhsRevenueCollection(input)
    );
  }

  loadActiveUserSessions() {
    this.store.dispatch(new BodEodActions.LoadActiveUserSessions());
  }
  loadClosedBod() {
    this.store.dispatch(new BodEodActions.ClosedBod());
  }
  resetState() {
    this.store.dispatch(new BodEodActions.Reset());
  }

  /*Facade Methods Exposed */

  getClosedBod() {
    return this.closedBusinessDate$;
  }
  getError() {
    return this.error$;
  }
  getIsLoading() {
    return this.isLoading$;
  }

  getBodProcessStatus() {
    return this.bodProcessStatus$;
  }
  getEodProcessStatus() {
    return this.eodProcessStatus$;
  }
  getPreviousdayEodStatus() {
    return this.previousdayEodStatus$;
  }
  getBodBusinessDate() {
    return this.bodBusinessDate$;
  }
  getRateFetchAttempts() {
    return this.rateFetchAttempts$;
  }
  isBodProcessStarted() {
    return this.bodProcessStarted$;
  }
  isEodProcessStarted() {
    return this.isEodProcessStarted$;
  }
  getAvailableMetalRates() {
    return this.availableMetalRates$;
  }
  getGoldRate() {
    return this.goldRate$;
  }
  getGoldRateAvailablityStatus() {
    return this.isGoldRateAvailable$;
  }
  getMetalRatesAvailableStatus() {
    return this.metalRatesAvailableStatus$;
  }

  getBoutiquePossBodStatus() {
    return this.boutiquePossBodStatus$;
  }
  getGhsBodStatus() {
    return this.ghsBodStatus$;
  }

  getGhsOfflineBodPassword() {
    return this.getGhsOfflineBodPassword$;
  }
  getCurrentDayBodStatus() {
    return this.currentDayBodStatus$;
  }
  getBusinessDayDate() {
    return this.eodBusinessDate$;
  }
  getEodBusinessDate() {
    return this.eodBusinessDate$;
  }
  getWalkInDetailsStatus() {
    return this.walkInDetailsStatus$;
  }
  getGhsBankDepositUploadStatus() {
    return this.ghsBankDepositUploadStatus$;
  }
  getBoutiqueBankDepositStatus() {
    return this.boutiqueBankDepositStatus$;
  }
  getBoutiqueRevenueCollectionStatus() {
    return this.boutiqueRevenueCollectionStatus$;
  }
  getGhsRevenueCollectionStatus() {
    return this.ghsRevenueCollectionStatus$;
  }
  getServiceRevenueCollectionStatus() {
    return this.serviceRevenueCollectionStatus$;
  }

  getGhsEodActivityStatus() {
    return this.ghsEodActivityStatus$;
  }
  getBoutiquePossEodActivityStatus() {
    return this.boutiquePossEodActivityStatus$;
  }
  getOfflineGhsEODrevenueCollectionStatus() {
    return this.offlineGhsEodRevenueCollectionStatus$;
  }
  getBodStepsStatus() {
    return this.bodStepsStatus$;
  }
  getEodStepsStatus() {
    return this.eodStepsStatus$;
  }
  getOfflineEghsPasswordsList() {
    return this.offlineEghsPasswordsListing$;
  }
  getOfflineGhsPasswordCount() {
    return this.offlineGhsPasswordCount$;
  }
  getActiveUserSessions() {
    return this.activeUserSessions$;
  }
}
