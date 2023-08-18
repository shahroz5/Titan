import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { passwordConfigSelectors } from './password-config.selectors';
import { PasswordConfigState } from './password-config.state';
import * as PasswordConfigActions from './password-config.actions';
import {
  MetalRatesPayload,
  GenerateBoutiquePasswordForManualBillRequest,
  GenerateBoutiquePasswordForGoldRateRequest,
  GenerateCashDepositPasswordRequest
} from '@poss-web/shared/models';

@Injectable()
export class PasswordConfigFacade {
  constructor(private store: Store<PasswordConfigState>) {}

  private hasError$ = this.store.select(passwordConfigSelectors.selectHasError);

  private isLoading$ = this.store.select(
    passwordConfigSelectors.selectIsLoading
  );

  private locationCodes$ = this.store.select(
    passwordConfigSelectors.selectLocationCodes
  );

  private documentTypes$ = this.store.select(
    passwordConfigSelectors.selectDocumentTypes
  );

  private materialPrices$ = this.store.select(
    passwordConfigSelectors.selectMaterialPrices
  );

  private generateBoutiquePasswordForManualBillResponse$ = this.store.select(
    passwordConfigSelectors.selectGenerateBoutiquePasswordResponseForManualBill
  );

  private generateBoutiquePasswordForGoldrateResponse$ = this.store.select(
    passwordConfigSelectors.selectGenerateBoutiquePasswordResponseForGoldRate
  );

  private generateCashDepositPasswordResponse$ = this.store.select(
    passwordConfigSelectors.selectGenerateCashDepositPasswordResponse
  );

  loadLocationCodes() {
    this.store.dispatch(new PasswordConfigActions.GetLocationCodes());
  }

  loadDocumentTypes(documentType: string) {
    this.store.dispatch(
      new PasswordConfigActions.GetDocumentTypes(documentType)
    );
  }

  loadMaterialPrices(materialPricesPayload: MetalRatesPayload) {
    this.store.dispatch(
      new PasswordConfigActions.GetMaterialPrices(materialPricesPayload)
    );
  }

  generateBoutiquePasswordForManualBill(
    generateBoutiquePasswordDetails: GenerateBoutiquePasswordForManualBillRequest
  ) {
    this.store.dispatch(
      new PasswordConfigActions.GenerateBoutiquePasswordForManualBill(
        generateBoutiquePasswordDetails
      )
    );
  }

  generateBoutiquePasswordForGoldRate(
    generateBoutiquePasswordDetails: GenerateBoutiquePasswordForGoldRateRequest
  ) {
    this.store.dispatch(
      new PasswordConfigActions.GenerateBoutiquePasswordForGoldRate(
        generateBoutiquePasswordDetails
      )
    );
  }

  generateCashDepositPassword(
    generateCashDepositPasswordDetails: GenerateCashDepositPasswordRequest
  ) {
    this.store.dispatch(
      new PasswordConfigActions.GenerateCashDepositPassword(
        generateCashDepositPasswordDetails
      )
    );
  }

  resetValues() {
    this.store.dispatch(new PasswordConfigActions.ResetValues());
  }

  resetPasswordValues() {
    this.store.dispatch(new PasswordConfigActions.ResetPasswordValues());
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getLocationCodes() {
    return this.locationCodes$;
  }

  getDocumentTypes() {
    return this.documentTypes$;
  }

  getMaterialPrices() {
    return this.materialPrices$;
  }

  getGenerateBoutiquePasswordForManualBillResponse() {
    return this.generateBoutiquePasswordForManualBillResponse$;
  }

  getGenerateBoutiquePasswordForGoldRateResponse() {
    return this.generateBoutiquePasswordForGoldrateResponse$;
  }

  getGenerateCashDepositPasswordResponse() {
    return this.generateCashDepositPasswordResponse$;
  }
}
