import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as payeeBankActions from './payee-bank.action';
import { PayeeBankSelectors } from './payee-bank.selector';
import { PayeeBankState } from './payee-bank.state';
import {
  LoadPayeeBankListingPayload,
  SavePayeeBankFormPayload,
  PayeeBankGLCodePayload,
  SaveGLcodeDetails
} from '@poss-web/shared/models';

@Injectable()
export class PayeeBankFacade {
  constructor(private store: Store<PayeeBankState>) {}

  private payeeBankListing$ = this.store.select(
    PayeeBankSelectors.selectPayeeBankDetailsListing
  );

  private PayeeBankDetailsByPayeeBankName$ = this.store.select(
    PayeeBankSelectors.selectPayeeBankDetailsByBankName
  );

  private isLoading$ = this.store.select(PayeeBankSelectors.selectIsLoading);

  private isSaveBankDetailsSuccess$ = this.store.select(
    PayeeBankSelectors.selectIsSaveBankDetailsSuccess
  );
  private isEditBankDetailsSuccess$ = this.store.select(
    PayeeBankSelectors.selectIsEditBankDetailsSuccess
  );

  private isPayeeBankSaved$ = this.store.select(
    PayeeBankSelectors.selectSavePayeeBankFormResponse
  );

  private isPayeeBankEdited$ = this.store.select(
    PayeeBankSelectors.selectEditPayeeBankFormResponse
  );

  private totalPayeeBankDetails$ = this.store.select(
    PayeeBankSelectors.selectTotalPayeeBankDetailsCount
  );

  private hasError$ = this.store.select(PayeeBankSelectors.selectError);
  private glCodeDetail$ = this.store.select(
    PayeeBankSelectors.selectGlCodeDetailsLList
  );

  private glCodeDetailsSuccess$ = this.store.select(
    PayeeBankSelectors.selectEditGlCodeDetailsSuccess
  );

  private locationCodes$ = this.store.select(
    PayeeBankSelectors.selectLocationCodes
  );
  private glCodeDefaults$ = this.store.select(
    PayeeBankSelectors.selectGlCodeDefaults
  );
  private glCodeListCount$ = this.store.select(
    PayeeBankSelectors.selectGlCodeCount
  );
  private glCodeMappedLocations$ = this.store.select(
    PayeeBankSelectors.selectMappedLocations
  );
  private towns$ = this.store.select(PayeeBankSelectors.selectTowns);
  private states$ = this.store.select(PayeeBankSelectors.selectStates);
  getPayeeBankSaveResponse() {
    return this.isPayeeBankSaved$;
  }

  getPayeeBankEditResponse() {
    return this.isPayeeBankEdited$;
  }

  getisLoading() {
    return this.isLoading$;
  }
  getIsSaveBankDetailsSuccess() {
    return this.isSaveBankDetailsSuccess$;
  }

  getIsEditBankDetailsSuccess() {
    return this.isEditBankDetailsSuccess$;
  }
  getTotalPayeeBankDetails() {
    return this.totalPayeeBankDetails$;
  }

  getPayeeBankDetailsListing() {
    return this.payeeBankListing$;
  }

  getPayeeBankDetailsByPayeeBankName() {
    return this.PayeeBankDetailsByPayeeBankName$;
  }

  getError() {
    return this.hasError$;
  }
  getGlCodeDetails() {
    return this.glCodeDetail$;
  }
  getLocationCodes() {
    return this.locationCodes$;
  }
  getSaveGlCodeSuccess() {
    return this.glCodeDetailsSuccess$;
  }
  getGlCodeDefaults() {
    return this.glCodeDefaults$;
  }
  getGlCodeListCount() {
    return this.glCodeListCount$;
  }
  getGlCodeMappedLocations() {
    return this.glCodeMappedLocations$;
  }
  getTowns() {
    return this.towns$;
  }

  getStates() {
    return this.states$;
  }

  loadPayeeBankDetailsByPayeeBankName(bank: string) {
    this.store.dispatch(
      new payeeBankActions.LoadPayeeBankByPayeeBankName(bank)
    );
  }

  loadPayeeBankDetailsListing(
    loadbinGroupDetailsListingPayload: LoadPayeeBankListingPayload
  ) {
    this.store.dispatch(
      new payeeBankActions.LoadPayeeBankDetails(
        loadbinGroupDetailsListingPayload
      )
    );
  }

  editPayeeBankFormDetails(editFormDetails: SavePayeeBankFormPayload) {
    this.store.dispatch(
      new payeeBankActions.EditPayeeBankFormDetails(editFormDetails)
    );
  }

  savePayeeBankFormDetails(saveFormDetails: SavePayeeBankFormPayload) {
    this.store.dispatch(
      new payeeBankActions.SavePayeeBankFormDetails(saveFormDetails)
    );
  }

  searchPayeeBank(bankName: string) {
    this.store.dispatch(new payeeBankActions.SearchPayeebankName(bankName));
  }
  loadGlCodeDetails(payload: PayeeBankGLCodePayload) {
    this.store.dispatch(
      new payeeBankActions.LoadPayeeBankGlCodeDetails(payload)
    );
  }
  saveGlCodeDetails(payload: SaveGLcodeDetails) {
    this.store.dispatch(
      new payeeBankActions.SavePayeeBankGlCodeDetails(payload)
    );
  }
  resetGlCodeDetails() {
    this.store.dispatch(new payeeBankActions.ResetGlCodeDetails());
  }
  resetBankDetails() {
    this.store.dispatch(new payeeBankActions.ResetBankDetails());
  }

  loadLocations() {
    this.store.dispatch(new payeeBankActions.GetLocationCodes());
  }
  loadGlCodeDefaults(payload: any) {
    this.store.dispatch(new payeeBankActions.GetGlCodeIsDefaults(payload));
  }
  loadGlCodeMappedLocations(payload: PayeeBankGLCodePayload) {
    this.store.dispatch(new payeeBankActions.LoadMappedLocations(payload));
  }
  // AddGlRowData(data) {
  //   this.store.dispatch(new payeeBankActions.AddGlCodeDetails(data));
  // }
  updateGlRowData(data: { id: string; glCode: number; isDefault: boolean }) {
    this.store.dispatch(new payeeBankActions.UpdateGlCodeDetails(data));
  }
  deleteGlRowData(data: string) {
    this.store.dispatch(new payeeBankActions.DeleteGlCodeDetails(data));
  }
  loadTowns(stateId?: string) {
    this.store.dispatch(new payeeBankActions.LoadTowns(stateId));
  }

  loadStates(countryCode?: string) {
    this.store.dispatch(new payeeBankActions.LoadStates(countryCode));
  }
}
