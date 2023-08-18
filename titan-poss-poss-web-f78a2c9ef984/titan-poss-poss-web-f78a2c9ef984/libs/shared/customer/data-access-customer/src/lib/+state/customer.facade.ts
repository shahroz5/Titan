import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as CustomerActions from './customer.actions';
import { CustomerState } from './customer.state';
import { CustomerSelectors } from './customer.selectors';
import {
  Customers,
  CustomerInfo,
  UpdateCustomerDetail,
  SEARCH_BY_ENUM,
  PanVerificationRequestPayload,
  GstVerificationRequestPayload,
  PanFormDetailsRequestPayload
} from '@poss-web/shared/models';

@Injectable()
export class CustomerFacade {
  private countries$ = this.store.select(CustomerSelectors.fetchCountries);

  private countryCode$ = this.store.select(CustomerSelectors.selectCountryCode);

  private states$ = this.store.select(CustomerSelectors.fetchStates);

  private towns$ = this.store.select(CustomerSelectors.selectTowns);

  private catchmentList$ = this.store.select(
    CustomerSelectors.selectCatchmentArea
  );

  private pincode$ = this.store.select(CustomerSelectors.selectPincode);

  private brandDetails$ = this.store.select(
    CustomerSelectors.selectBrandDetail
  );

  private isUniqueMobile$ = this.store.select(
    CustomerSelectors.selectIsUniqueMobile
  );

  private isUniqueEmail$ = this.store.select(
    CustomerSelectors.selectIsUniqueEmail
  );

  private isLoading$ = this.store.select(CustomerSelectors.selectIsLoading);

  private isUniquePan$ = this.store.select(CustomerSelectors.selectIsUniquePan);

  private panVerificationStatus$ = this.store.select(
    CustomerSelectors.selectPanVerificationStatus
  );

  private gstVerificationStatus$ = this.store.select(
    CustomerSelectors.selectGstVerificationStatus
  );

  private emailValidationStatus$ = this.store.select(
    CustomerSelectors.selectEmailValidationStatus
  );

  private isUniquePassport$ = this.store.select(
    CustomerSelectors.selectIsUniquePassport
  );

  private isUniqueGst$ = this.store.select(CustomerSelectors.selectIsUniqueGst);

  private salutations$ = this.store.select(CustomerSelectors.selectSalutations);

  private idProofs$ = this.store.select(CustomerSelectors.selectIdProofs);

  private error$ = this.store.select(CustomerSelectors.selectError);

  private isSearchingCustomer$ = this.store.select(
    CustomerSelectors.selectIsSearchingCustomer
  );

  private isCustomerSaving$ = this.store.select(
    CustomerSelectors.selectIsCustomerSaving
  );

  private createdCustomerStatus$ = this.store.select(
    CustomerSelectors.selectCreatedCustomerStatus
  );

  private updatedCustomerStatus$ = this.store.select(
    CustomerSelectors.selectUpdatedCustomerStatus
  );

  private hasCustomerResult$ = this.store.select(
    CustomerSelectors.selectHasCustomerResult
  );

  private searchCustomerResult$ = this.store.select(
    CustomerSelectors.selectSearchCustomerResult
  );

  private searchOneTimeCustomer$ = this.store.select(
    CustomerSelectors.selectSearchOneTimeCustomer
  );

  private selectedCustomerDetail$ = this.store.select(
    CustomerSelectors.selectedCustomerDetail
  );

  private customerEncirclePoints$ = this.store.select(
    CustomerSelectors.selectCustomerEncirclePoints
  );

  private customerUlpID$ = this.store.select(
    CustomerSelectors.selectCustomerUlpID
  );

  private searchError$ = this.store.select(CustomerSelectors.selectSearchError);

  private selectedCustomer$ = this.store.select(
    CustomerSelectors.selectSelectedCustomer
  );

  private isCustomerSelected$ = this.store.select(
    CustomerSelectors.selectIsCustomerSelected
  );
  private getCustomerDetails$ = this.store.select(
    CustomerSelectors.selectGetCustomerDetails
  );

  private zones$ = this.store.select(CustomerSelectors.selectZones);

  private enableClear$ = this.store.select(CustomerSelectors.selectEnableClear);
  private enableEdit$ = this.store.select(CustomerSelectors.selectEnableEdit);
  private enableCreate$ = this.store.select(
    CustomerSelectors.selectEnableCreate
  );

  private allowedTransactionTypes$ = this.store.select(
    CustomerSelectors.selectAllowedTransactionTypes
  );

  private customerLoyaltyDetail$ = this.store.select(
    CustomerSelectors.selectedCustomerLoyaltyDetail
  );

  private rivaahCouponDetail$ = this.store.select(
    CustomerSelectors.selectRivaahCouponDetails
  );

  private verifyPanDetailsResponse$ = this.store.select(
    CustomerSelectors.selectVerifyPanDetailsResponse
  );

  constructor(private store: Store<CustomerState>) {}

  getCustomerLoyaltyDetail() {
    return this.customerLoyaltyDetail$;
  }

  getEnableCreate() {
    return this.enableCreate$;
  }

  getEnableEdit() {
    return this.enableEdit$;
  }

  getEnableClear() {
    return this.enableClear$;
  }

  getAllowedTransactionTypes() {
    return this.allowedTransactionTypes$;
  }

  getCountries() {
    return this.countries$;
  }

  getCountryCode() {
    return this.countryCode$;
  }

  getStates() {
    return this.states$;
  }

  getTowns() {
    return this.towns$;
  }

  getCatchmentArea() {
    return this.catchmentList$;
  }

  getPincode() {
    return this.pincode$;
  }

  getIsUniqueMobile() {
    return this.isUniqueMobile$;
  }

  getIsUniqueEmail() {
    return this.isUniqueEmail$;
  }

  getCreatedCustomerStatus() {
    return this.createdCustomerStatus$;
  }

  getUpdatedCustomerStatus() {
    return this.updatedCustomerStatus$;
  }

  getIsUniquePan() {
    return this.isUniquePan$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getpanVerificationStatus() {
    return this.panVerificationStatus$;
  }

  getgstVerificationStatus() {
    return this.gstVerificationStatus$;
  }

  getEmailValidationStatus() {
    return this.emailValidationStatus$;
  }

  getIsUniqueGst() {
    return this.isUniqueGst$;
  }

  getIsUniquePassport() {
    return this.isUniquePassport$;
  }

  getSalutations() {
    return this.salutations$;
  }

  getIdProofs() {
    return this.idProofs$;
  }

  getError() {
    return this.error$;
  }

  getIsSearchingCustomer() {
    return this.isSearchingCustomer$;
  }

  getIsCustomerSaving() {
    return this.isCustomerSaving$;
  }

  getHasCustomerResult() {
    return this.hasCustomerResult$;
  }

  getSearchCustomerResult() {
    return this.searchCustomerResult$;
  }
  getSearchOneTimeCustomer() {
    return this.searchOneTimeCustomer$;
  }
  getCustomerEncirclePoints() {
    return this.customerEncirclePoints$;
  }

  getCustomerUlpID() {
    return this.customerUlpID$;
  }

  getSearchError() {
    return this.searchError$;
  }

  getSelectSelectedCustomer() {
    return this.selectedCustomer$;
  }
  getGhsCustomerDetails() {
    return this.getCustomerDetails$;
  }
  getZones() {
    return this.zones$;
  }

  getBrandDetails() {
    return this.brandDetails$;
  }

  getSelectedCustomerDetail() {
    return this.selectedCustomerDetail$;
  }
  searchCustomer(searchBy: SEARCH_BY_ENUM, searchValue: string) {
    this.store.dispatch(
      new CustomerActions.SearchCustomer({ searchBy, searchValue })
    );
  }
  searchOneTimeCustomer(searchBy: SEARCH_BY_ENUM, searchValue: string) {
    this.store.dispatch(
      new CustomerActions.SearchOneTimeCustomer({ searchBy, searchValue })
    );
  }

  getIsCustomerSelected() {
    return this.isCustomerSelected$;
  }

  getRivaahCouponDetail() {
    return this.rivaahCouponDetail$;
  }

  getverifyPanDetailsResponse() {
    return this.verifyPanDetailsResponse$;
  }

  selectCustomer(customer: CustomerInfo) {
    this.store.dispatch(new CustomerActions.SelectCustomer(customer));
  }

  selectInternationalCustomer(passportId: string) {
    this.store.dispatch(
      new CustomerActions.SelectInternationalCustomer(passportId)
    );
  }

  selectOneTimeCustomer(customerId: string) {
    this.store.dispatch(
      new CustomerActions.SelectOneTimeCustomer(customerId)
    );
  }

  clearCustomerSearch() {
    this.store.dispatch(new CustomerActions.ClearCustomerSearch());
  }

  clearSelectedCustomer() {
    this.store.dispatch(new CustomerActions.ClearSelectedCustomer());
  }

  clearUpdatedCustomerStatus() {
    this.store.dispatch(new CustomerActions.ClearUpdatedCustomer());
  }

  clearVerificationStatus() {
    this.store.dispatch(new CustomerActions.ClearVerificationStatus());
  }

  clearPanVerificationStatus() {
    this.store.dispatch(new CustomerActions.ClearPanVerificationStatus());
  }

  clearGstVerificationStatus() {
    this.store.dispatch(new CustomerActions.ClearGSTVerificationStatus());
  }

  clearEmailValidationStatus() {
    this.store.dispatch(new CustomerActions.ClearEmailValidationStatus());
  }

  clearAllowedTransactions() {
    this.store.dispatch(new CustomerActions.ClearAllowedTransactions());
  }

  clearRivaahCouponDetail() {
    this.store.dispatch(new CustomerActions.ClearRivaahCouponDetail());
  }

  loadCountries() {
    this.store.dispatch(new CustomerActions.LoadCountries());
  }

  loadCountryCode() {
    this.store.dispatch(new CustomerActions.LoadCountryCode());
  }

  loadStates(stateCode: string) {
    this.store.dispatch(new CustomerActions.LoadStates(stateCode));
  }

  loadTowns(townCode: string) {
    this.store.dispatch(new CustomerActions.LoadTowns(townCode));
  }

  loadCatchmentArea() {
    this.store.dispatch(new CustomerActions.LoadCatchmentArea());
  }

  loadPincode(countryCode: string, pincode: string) {
    this.store.dispatch(
      new CustomerActions.LoadPincode({ countryCode, pincode })
    );
  }

  loadIsUniqueMobile(searchType: string, value: string) {
    this.store.dispatch(
      new CustomerActions.LoadCustomerUniqueMobile({ searchType, value })
    );
  }

  loadIsUniqueEmail(searchType: string, value: string) {
    this.store.dispatch(
      new CustomerActions.LoadCustomerUniqueEmail({ searchType, value })
    );
  }

  loadIsUniquePan(searchType: string, value: string) {
    this.store.dispatch(
      new CustomerActions.LoadCustomerUniquePan({ searchType, value })
    );
  }

  loadPanVerificationStatus(requestPayload: PanVerificationRequestPayload) {
    this.store.dispatch(
      new CustomerActions.PanCardVerificationStatus(requestPayload)
    );
  }

  loadGstVerificationStatus(requestPayload: GstVerificationRequestPayload) {
    this.store.dispatch(
      new CustomerActions.GstCardVerificationStatus(requestPayload)
    );
  }

  loadEmailValidationStatus(emailId: string) {
    this.store.dispatch(new CustomerActions.EmailValidationStatus(emailId));
  }

  loadIsUniqueGst(searchType: string, value: string) {
    this.store.dispatch(
      new CustomerActions.LoadCustomerUniqueGst({ searchType, value })
    );
  }

  loadIsUniquePassport(searchType: string, value: string) {
    this.store.dispatch(
      new CustomerActions.LoadCustomerUniquePassport({ searchType, value })
    );
  }

  loadSalutations(lovType: string) {
    this.store.dispatch(new CustomerActions.LoadSalutations(lovType));
  }

  loadIdProofs(lovType: string) {
    this.store.dispatch(new CustomerActions.LoadIdProofs(lovType));
  }

  saveCustomer(customerdata: Customers) {
    this.store.dispatch(
      new CustomerActions.SaveCustomerFormDetails(customerdata)
    );
  }

  updateCustomer(customerdata: any) {
    this.store.dispatch(new CustomerActions.UpdateCustomer(customerdata));
  }

  loadSelectedCustomerDetail(
    customerId: string,
    isCalledFromCustomer?: boolean
  ) {
    this.store.dispatch(
      new CustomerActions.SelectedCustomerDetail({
        customerId,
        isCalledFromCustomer
      })
    );
  }

  loadSelectedCustomer(
    customerId: string,
    enableClear: boolean = true,
    enableEdit: boolean = true,
    enableCreate: boolean = true,
    isCalledFromCustomer?: boolean
  ) {
    this.store.dispatch(
      new CustomerActions.LoadSelectedCustomer({
        customerId,
        enableClear,
        enableEdit,
        enableCreate,
        isCalledFromCustomer
      })
    );
  }

  loadZones() {
    this.store.dispatch(new CustomerActions.LoadZones());
  }

  loadBrandDetails(brandCode) {
    this.store.dispatch(new CustomerActions.LoadBrandDetails(brandCode));
  }

  loadAllowedTransactionTypes() {
    this.store.dispatch(new CustomerActions.LoadAllowedTransactionTypes());
  }

  loadGhsCustomerDetails(searchBy: SEARCH_BY_ENUM, searchValue: string) {
    this.store.dispatch(
      new CustomerActions.GetGhsCustomerDetails({ searchBy, searchValue })
    );
  }
  enableCustomerCreate() {
    this.store.dispatch(new CustomerActions.EnableCustomerCreate());
  }

  disableCustomerCreate() {
    this.store.dispatch(new CustomerActions.DisableCustomerCreate());
  }

  enableCustomerEdit() {
    this.store.dispatch(new CustomerActions.EnableCustomerEdit());
  }

  disableCustomerEdit() {
    this.store.dispatch(new CustomerActions.DisableCustomerEdit());
  }

  loadRivaahCouponDetail(customerId, sendCoupon) {
    this.store.dispatch(
      new CustomerActions.LoadRivaahCouponDetail(customerId, sendCoupon)
    );
  }

  verifyPanByNsdl(payload: PanVerificationRequestPayload) {
    this.store.dispatch(new CustomerActions.verifyPanDetails(payload));
  }

  updatePanFormDetails(payload: PanFormDetailsRequestPayload) {
    this.store.dispatch(new CustomerActions.updatePanFormDetails(payload));
  }
}
