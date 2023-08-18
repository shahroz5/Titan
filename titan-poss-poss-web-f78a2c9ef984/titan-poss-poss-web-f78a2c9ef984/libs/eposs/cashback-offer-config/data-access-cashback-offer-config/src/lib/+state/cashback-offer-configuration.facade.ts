import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { CashbackOfferConfigurationSelectors } from './cashback-offer-configuration.selectors';
import { CashbackOfferConfigurationState } from './cashback-offer-configuration.state';

import * as CashbckOfferConfigurationAction from './cashback-offer-configuration.actions';
import {
  UpdateBankDetailsPayload,
  SaveBankDetailsPayload,
  LoadCashbackOfferListPayload,
  OfferDetailResponse,
  SaveProductGroupPayload,
  UploadFile,
  UpdateCardDetails,
  LoadCardDetailsPayload
} from '@poss-web/shared/models';

@Injectable()
export class CashBackOfferConfigurationFacade {
  constructor(public store: Store<CashbackOfferConfigurationState>) {}

  private isLoading$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectIsloading
  );
  private error$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectError
  );
  private hasSaved$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectHasUpdated
  );

  private totalElements$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectTotalElements
  );

  private bankDetails$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectbankDetails
  );
  private cashBackOfferList$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectCashbackOfferList
  );

  private payerBank$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectPayerBank
  );

  private excludeCashback$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectExcludeCashBack
  );

  private offerDetails$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectOfferDetails
  );
  private isCleared$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectIsCleared
  );
  private isCashAmount$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectIsCashAmount
  );

  private selectedProductGroup$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectSelectedProductGroup
  );

  private isProductGroupUpdated$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectisProductGroupUpdated
  );

  private cardDetails$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectCardDetails
  );

  private fileResponse$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectisFileResponse
  );

  private offerDetailsUpdated$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectOfferDetailsUpdated
  );

  private errorLog$ = this.store.select(
    CashbackOfferConfigurationSelectors.selectErrorlog
  );
  getOfferDetailsUpdated() {
    return this.offerDetailsUpdated$;
  }
  getFileResponse() {
    return this.fileResponse$;
  }
  getCardDetails() {
    return this.cardDetails$;
  }
  getIsProductGroupUpdated() {
    return this.isProductGroupUpdated$;
  }
  getSelectedProductGroup() {
    return this.selectedProductGroup$;
  }
  getIsCashAmount() {
    return this.isCashAmount$;
  }
  getIsCleared() {
    return this.isCleared$;
  }
  getOfferDetails() {
    return this.offerDetails$;
  }
  getExcludeCashBack() {
    return this.excludeCashback$;
  }
  getpayerBank() {
    return this.payerBank$;
  }

  getCashBackOfferList() {
    return this.cashBackOfferList$;
  }
  getBankDetails() {
    return this.bankDetails$;
  }

  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getError() {
    return this.error$;
  }
  getErrorLog() {
    return this.errorLog$;
  }
  getIsloading() {
    return this.isLoading$;
  }

  loadMappedProductGroup(id: string) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.LoadMappedProductGroupById(id)
    );
  }

  updateProductGroup(saveProductGroupPayload: SaveProductGroupPayload) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.UpdateProductGroupById(
        saveProductGroupPayload
      )
    );
  }
  loadPayerBank() {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.LoadPayerBankList()
    );
  }
  loadCashBackList(
    loadCashbackOfferListPayload: LoadCashbackOfferListPayload,
    searchValue?: string
  ) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.LoadCashbackOfferList(
        loadCashbackOfferListPayload,
        searchValue
      )
    );
  }
  loadNewBankDetails() {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.LoadNewBankDetails()
    );
  }
  saveBankDetails(saveBankDetailsPayload: SaveBankDetailsPayload) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.SaveBankDetails(
        saveBankDetailsPayload
      )
    );
  }
  updateBankDetails(updateBankDetails: UpdateBankDetailsPayload) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.UpdateBankDetails(updateBankDetails)
    );
  }

  loadBankDetails(configId: string) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.LoadBankDetailsById(configId)
    );
  }

  loadOfferDetails(configId: string) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.LoadOfferDetailsById(configId)
    );
  }

  saveOfferDetails(offerDetails: OfferDetailResponse) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.UpdateOfferDetailsById(offerDetails)
    );
  }
  loadCardDetailById(loadCardDetailsPayload: LoadCardDetailsPayload) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.LoadCardDetailsById(
        loadCardDetailsPayload
      )
    );
  }

  uploadFile(uploadFile: UploadFile) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.UploadCardDetailsById(uploadFile)
    );
  }
  loadErrorLog(errorId: string) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.ErrorLogDownload(errorId)
    );
  }
  resetFileData() {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.LoadResetFileData()
    );
  }
  updateCardDetailsById(updateCardDeatils: UpdateCardDetails) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.UpdateCardDeatislById(
        updateCardDeatils
      )
    );
  }
  clearOfferDetails(offerDetailResponse: OfferDetailResponse) {
    this.store.dispatch(
      new CashbckOfferConfigurationAction.ClearOfferDetailsById(
        offerDetailResponse
      )
    );
  }
  resetIsClearedFlag() {
    this.store.dispatch(new CashbckOfferConfigurationAction.ResetIsCleared());
  }
  loadReset() {
    this.store.dispatch(new CashbckOfferConfigurationAction.LoadReset());
  }
}
