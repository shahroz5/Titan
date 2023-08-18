import { ProfileDataState } from './profile-data.state';
import { selectProfileDataState } from './profile-data.reducer';

import { createSelector } from '@ngrx/store';

const selectProfileData = createSelector(
  selectProfileDataState,
  (state: ProfileDataState) => state
);

const fetchEmail = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.email
);

const fetchEmpName = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.empName
);

const fetchUserType = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.userType
);

const fetchBoutiqueCode = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.boutiqueCode
);

const fetchBoutiqueDesc = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.boutiqueDesc
);

const fetchBoutiqueType = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.boutiqueType
);

const isBTQUser = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.isBTQUser
);

const isCorpUser = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.isCorpUser
);

const isRegUser = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.isRegUser
);

const isL1Boutique = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.isL1Boutique
);

const isL2Boutique = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.isL2Boutique
);

const isL3Boutique = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.isL3Boutique
);

const selectError = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.error
);

const fetchOrgCode = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.orgCode
);

const fetchRegionCode = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.regionCode
);
const fetchCountryName = createSelector(
  selectProfileData,
  (state: ProfileDataState) =>
    state.address ? (state.address.country ? state.address.country : '') : ''
);

const selectUserRoles = createSelector(
  selectProfileData,
  (state: ProfileDataState) => state.roles
);

const selectEmployeeSignatureDetailsResponse = createSelector(
  selectProfileData,
  state => state.cashierSignatureDetails
);

const selectUploadEmployeeSignatureResponse = createSelector(
  selectProfileData,
  state => state.uploadEmployeeSignatureResponse
);

const selectIsLoading = createSelector(
  selectProfileData,
  state => state.isLoading
);

const selectIsSignatureError = createSelector(
  selectProfileData,
  state => state.signatureError
);

export const ProfileDataSelectors = {
  fetchBoutiqueCode,
  fetchBoutiqueDesc,
  fetchBoutiqueType,
  fetchEmail,
  fetchEmpName,
  fetchUserType,
  isBTQUser,
  isCorpUser,
  isRegUser,
  isL1Boutique,
  isL2Boutique,
  isL3Boutique,
  selectError,
  fetchOrgCode,
  fetchRegionCode,
  fetchCountryName,
  selectUserRoles,
  selectEmployeeSignatureDetailsResponse,
  selectUploadEmployeeSignatureResponse,
  selectIsLoading,
  selectIsSignatureError
};
