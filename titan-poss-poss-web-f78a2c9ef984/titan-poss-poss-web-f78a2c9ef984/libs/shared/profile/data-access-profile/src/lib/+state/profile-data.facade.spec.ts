import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ProfileDataState } from './profile-data.state';
import { ProfileDataFacade } from './profile-data.facade';

describe('Profile Facade Testing Suite', () => {
  const initialState: ProfileDataState = {
    empName: '',
    email: '',
    userType: '',
    boutiqueType: '',
    boutiqueCode: '',
    boutiqueDesc: '',
    isBTQUser: null,
    isCorpUser: null,
    isRegUser: false,
    regionCode: '',
    isL1Boutique: false,
    isL2Boutique: false,
    isL3Boutique: false,
    error: null,
    orgCode: '',
    address: null
  };

  let profileDataFacade: ProfileDataFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ProfileDataFacade]
    });

    profileDataFacade = TestBed.inject(ProfileDataFacade);
  });

  it('should access  getError() selector action', () => {
    expect(profileDataFacade.getError()).toEqual(
      profileDataFacade['selectError$']
    );
  });
  it('should access  getEmpEmail() selector action', () => {
    expect(profileDataFacade.getEmpEmail()).toEqual(
      profileDataFacade['fetchEmpEmail$']
    );
  });
  it('should access  getEmpName() selector action', () => {
    expect(profileDataFacade.getEmpName()).toEqual(
      profileDataFacade['fetchEmpName$']
    );
  });
  it('should access  getUserType() selector action', () => {
    expect(profileDataFacade.getUserType()).toEqual(
      profileDataFacade['fetchUserType$']
    );
  });
  it('should access  getBoutiqueCode() selector action', () => {
    expect(profileDataFacade.getBoutiqueCode()).toEqual(
      profileDataFacade['fetchBoutiqueCode$']
    );
  });
  it('should access  getBoutiqueDesc() selector action', () => {
    expect(profileDataFacade.getBoutiqueDesc()).toEqual(
      profileDataFacade['fetchBoutiqueDesc$']
    );
  });
  it('should access  getBoutiqueType() selector action', () => {
    expect(profileDataFacade.getBoutiqueType()).toEqual(
      profileDataFacade['fetchBoutiqueType$']
    );
  });
  it('should access  isBTQUser() selector action', () => {
    expect(profileDataFacade.isBTQUser()).toEqual(
      profileDataFacade['isBTQUser$']
    );
  });
  it('should access  isCorpUser() selector action', () => {
    expect(profileDataFacade.isCorpUser()).toEqual(
      profileDataFacade['isCorpUser$']
    );
  });
  it('should access  isRegUser() selector action', () => {
    expect(profileDataFacade.isRegUser()).toEqual(
      profileDataFacade['isRegUser$']
    );
  });
  it('should access  isL1Boutique() selector action', () => {
    expect(profileDataFacade.isL1Boutique()).toEqual(
      profileDataFacade['isL1Boutique$']
    );
  });
  it('should access  isL2Boutique() selector action', () => {
    expect(profileDataFacade.isL2Boutique()).toEqual(
      profileDataFacade['isL2Boutique$']
    );
  });
  it('should access  isL3Boutique() selector action', () => {
    expect(profileDataFacade.isL3Boutique()).toEqual(
      profileDataFacade['isL3Boutique$']
    );
  });
  it('should access  getOrgCode() selector action', () => {
    expect(profileDataFacade.getOrgCode()).toEqual(
      profileDataFacade['fetchOrgCode$']
    );
  });
  it('should access  getRegionCode() selector action', () => {
    expect(profileDataFacade.getRegionCode()).toEqual(
      profileDataFacade['fetchRegionCode$']
    );
  });
  it('should access  getUserCountryName() selector action', () => {
    expect(profileDataFacade.getUserCountryName()).toEqual(
      profileDataFacade['countryName$']
    );
  });
});
