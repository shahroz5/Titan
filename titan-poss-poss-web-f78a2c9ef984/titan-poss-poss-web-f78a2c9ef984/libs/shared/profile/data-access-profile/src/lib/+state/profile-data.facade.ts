import { ProfileDataSelectors } from './profile-data.selectors';
import { ProfileDataState } from './profile-data.state';
import * as ProfileDataActions from './profile-data.actions';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class ProfileDataFacade {
  private selectError$ = this.store.select(ProfileDataSelectors.selectError);

  private fetchEmpEmail$ = this.store.select(ProfileDataSelectors.fetchEmail);

  private fetchEmpName$ = this.store.select(ProfileDataSelectors.fetchEmpName);

  private fetchUserType$ = this.store.select(
    ProfileDataSelectors.fetchUserType
  );

  private fetchBoutiqueCode$ = this.store.select(
    ProfileDataSelectors.fetchBoutiqueCode
  );

  private fetchBoutiqueDesc$ = this.store.select(
    ProfileDataSelectors.fetchBoutiqueDesc
  );

  private fetchBoutiqueType$ = this.store.select(
    ProfileDataSelectors.fetchBoutiqueType
  );

  private isBTQUser$ = this.store.select(ProfileDataSelectors.isBTQUser);

  private isCorpUser$ = this.store.select(ProfileDataSelectors.isCorpUser);

  private isRegUser$ = this.store.select(ProfileDataSelectors.isRegUser);

  private isL1Boutique$ = this.store.select(ProfileDataSelectors.isL1Boutique);

  private isL2Boutique$ = this.store.select(ProfileDataSelectors.isL2Boutique);

  private isL3Boutique$ = this.store.select(ProfileDataSelectors.isL3Boutique);

  private fetchOrgCode$ = this.store.select(ProfileDataSelectors.fetchOrgCode);

  private fetchRegionCode$ = this.store.select(
    ProfileDataSelectors.fetchRegionCode
  );

  private countryName$ = this.store.select(
    ProfileDataSelectors.fetchCountryName
  );

  private getUserRoles$ = this.store.select(
    ProfileDataSelectors.selectUserRoles
  );

  private getEmployeeSignatureDetails$ = this.store.select(
    ProfileDataSelectors.selectEmployeeSignatureDetailsResponse
  );

  private uploadSignatureResponse$ = this.store.select(
    ProfileDataSelectors.selectUploadEmployeeSignatureResponse
  );

  private isLoading$ = this.store.select(ProfileDataSelectors.selectIsLoading);

  private selectSignatureError$ = this.store.select(
    ProfileDataSelectors.selectIsSignatureError
  );

  constructor(private store: Store<ProfileDataState>) {}

  getError() {
    return this.selectError$;
  }

  getIsSignatureError() {
    return this.selectSignatureError$;
  }

  getEmpEmail() {
    return this.fetchEmpEmail$;
  }

  getEmpName() {
    return this.fetchEmpName$;
  }

  getUserType() {
    return this.fetchUserType$;
  }

  getBoutiqueCode() {
    return this.fetchBoutiqueCode$;
  }

  getBoutiqueDesc() {
    return this.fetchBoutiqueDesc$;
  }

  getBoutiqueType() {
    return this.fetchBoutiqueType$;
  }

  isBTQUser() {
    return this.isBTQUser$;
  }

  isCorpUser() {
    return this.isCorpUser$;
  }

  isRegUser() {
    return this.isRegUser$;
  }

  isL1Boutique() {
    return this.isL1Boutique$;
  }

  isL2Boutique() {
    return this.isL2Boutique$;
  }

  isL3Boutique() {
    return this.isL3Boutique$;
  }
  getOrgCode() {
    return this.fetchOrgCode$;
  }
  getRegionCode() {
    return this.fetchRegionCode$;
  }
  getUserCountryName() {
    return this.countryName$;
  }

  getUserRoles() {
    return this.getUserRoles$;
  }

  getEmployeeSignatureDetails() {
    return this.getEmployeeSignatureDetails$;
  }

  getUploadSignatureResponse() {
    return this.uploadSignatureResponse$;
  }

  isLoading() {
    return this.isLoading$;
  }

  loadEmployeeSignatureDetails(employeeCode: string) {
    this.store.dispatch(
      new ProfileDataActions.LoadEmployeeSignatureDetails(employeeCode)
    );
  }

  uploadEmployeeSignature(employeeCode: string, cashierSignature: string) {
    this.store.dispatch(
      new ProfileDataActions.UploadEmployeeSignature(
        employeeCode,
        cashierSignature
      )
    );
  }

  resetEmployeeSignatureData() {
    this.store.dispatch(
      new ProfileDataActions.LoadEmployeeSignatureDetailsSuccess(null)
    );
    this.store.dispatch(
      new ProfileDataActions.UploadEmployeeSignatureSuccess(null)
    );
  }
}
