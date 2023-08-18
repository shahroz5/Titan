import * as selectors from './profile-data.selectors';
import { initialState } from './profile-data.reducer';
import { ProfileDataState } from './profile-data.state';
import { AddressData, CustomErrors } from '@poss-web/shared/models';

describe('Profile Data Selector Testing Suite', () => {
  it('Testing fetchBoutiqueCode selector', () => {
    const userBoutiqueCode = 'URB';
    const state: ProfileDataState = {
      ...initialState,
      boutiqueCode: userBoutiqueCode
    };
    expect(
      selectors.ProfileDataSelectors.fetchBoutiqueCode.projector(state)
    ).toEqual(userBoutiqueCode);
  });
  it('Testing fetchBoutiqueDesc selector', () => {
    const userBoutiqueDesc = 'URB Location';
    const state: ProfileDataState = {
      ...initialState,
      boutiqueDesc: userBoutiqueDesc
    };
    expect(
      selectors.ProfileDataSelectors.fetchBoutiqueDesc.projector(state)
    ).toEqual(userBoutiqueDesc);
  });
  it('Testing fetchBoutiqueType selector', () => {
    const userBoutiqueType = 'L1 Store';
    const state: ProfileDataState = {
      ...initialState,
      boutiqueType: userBoutiqueType
    };
    expect(
      selectors.ProfileDataSelectors.fetchBoutiqueType.projector(state)
    ).toEqual(userBoutiqueType);
  });
  it('Testing fetchEmail selector', () => {
    const userEmail = 'user@gmail.com';
    const state: ProfileDataState = {
      ...initialState,
      email: userEmail
    };
    expect(selectors.ProfileDataSelectors.fetchEmail.projector(state)).toEqual(
      userEmail
    );
  });
  it('Testing fetchEmpName selector', () => {
    const userName = 'nageshwar';
    const state: ProfileDataState = {
      ...initialState,
      empName: userName
    };
    expect(
      selectors.ProfileDataSelectors.fetchEmpName.projector(state)
    ).toEqual(userName);
  });
  it('Testing fetchUserType selector', () => {
    const type = 'Boutique User';
    const state: ProfileDataState = {
      ...initialState,
      userType: type
    };
    expect(
      selectors.ProfileDataSelectors.fetchUserType.projector(state)
    ).toEqual(type);
  });
  it('Testing isBTQUser selector', () => {
    const btqUser = true;
    const state: ProfileDataState = {
      ...initialState,
      isBTQUser: btqUser
    };
    expect(selectors.ProfileDataSelectors.isBTQUser.projector(state)).toEqual(
      btqUser
    );
  });
  it('Testing isCorpUser selector', () => {
    const corpUser = false;
    const state: ProfileDataState = {
      ...initialState,
      isCorpUser: corpUser
    };
    expect(selectors.ProfileDataSelectors.isCorpUser.projector(state)).toEqual(
      corpUser
    );
  });
  it('Testing isRegUser selector', () => {
    const regUser = false;
    const state: ProfileDataState = {
      ...initialState,
      isRegUser: regUser
    };
    expect(selectors.ProfileDataSelectors.isRegUser.projector(state)).toEqual(
      regUser
    );
  });
  it('Testing isL1Boutique selector', () => {
    const l1Boutique = true;
    const state: ProfileDataState = {
      ...initialState,
      isL1Boutique: l1Boutique
    };
    expect(
      selectors.ProfileDataSelectors.isL1Boutique.projector(state)
    ).toEqual(l1Boutique);
  });
  it('Testing isL2Boutique selector', () => {
    const l2Boutique = false;
    const state: ProfileDataState = {
      ...initialState,
      isL2Boutique: l2Boutique
    };
    expect(
      selectors.ProfileDataSelectors.isL2Boutique.projector(state)
    ).toEqual(l2Boutique);
  });
  it('Testing isL3Boutique selector', () => {
    const l3Boutique = false;
    const state: ProfileDataState = {
      ...initialState,
      isL3Boutique: l3Boutique
    };
    expect(
      selectors.ProfileDataSelectors.isL3Boutique.projector(state)
    ).toEqual(l3Boutique);
  });
  it('Testing selectError selector', () => {
    const error: Error = {
      name: 'Name',
      message: 'error message',
      stack: 'stack'
    };
    const customErrors: CustomErrors = {
      code: 'EC2',
      message: 'error occured',
      traceId: 'abcdefghijk',
      timeStamp: '',
      error: error
    };
    const state: ProfileDataState = {
      ...initialState,
      error: customErrors
    };
    expect(selectors.ProfileDataSelectors.selectError.projector(state)).toEqual(
      customErrors
    );
  });
  it('Testing fetchOrgCode selector', () => {
    const userOrgCode = 'Tanishq';
    const state: ProfileDataState = {
      ...initialState,
      orgCode: userOrgCode
    };
    expect(
      selectors.ProfileDataSelectors.fetchOrgCode.projector(state)
    ).toEqual(userOrgCode);
  });
  it('Testing fetchRegionCode selector', () => {
    const userRegionCode = 'South India';
    const state: ProfileDataState = {
      ...initialState,
      regionCode: userRegionCode
    };
    expect(
      selectors.ProfileDataSelectors.fetchRegionCode.projector(state)
    ).toEqual(userRegionCode);
  });
  it('Testing fetchCountryName selector', () => {
    const addressData: AddressData = {
      line1: 'Line1',
      line2: 'Line2',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      country: 'IND'
    };
    const state: ProfileDataState = {
      ...initialState,
      address: addressData
    };
    expect(
      selectors.ProfileDataSelectors.fetchCountryName.projector(state)
    ).toEqual(addressData.country);
  });
  it('Testing fetchCountryName selector, when address is not there', () => {
    const addressData: AddressData = null;
    const state: ProfileDataState = {
      ...initialState,
      address: addressData
    };
    expect(
      selectors.ProfileDataSelectors.fetchCountryName.projector(state)
    ).toEqual('');
  });
  it('Testing fetchCountryName selector, when address does not have country', () => {
    const addressData: AddressData = {
      line1: 'Line1',
      line2: 'Line2',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      country: null
    };
    const state: ProfileDataState = {
      ...initialState,
      address: addressData
    };
    expect(
      selectors.ProfileDataSelectors.fetchCountryName.projector(state)
    ).toEqual('');
  });
});
