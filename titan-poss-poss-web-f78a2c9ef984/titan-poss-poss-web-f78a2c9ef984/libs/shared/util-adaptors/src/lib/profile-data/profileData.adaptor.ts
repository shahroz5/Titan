import { ProfileData, StoreTypes } from '@poss-web/shared/models';

export class ProfileDataAdaptor {
  private static storetype: string[] = Array(
    StoreTypes.LargeFormatStoreType,
    StoreTypes.MediumFormatStoreType,
    StoreTypes.SmallFormatStoreType
  );

  static profileDatafromJson(profiledata: any): ProfileData {
    let roles = [];
    if (profiledata && profiledata.roles && profiledata.roles.length > 0) {
      roles = profiledata.roles.map((roleItem: any) => {
        return roleItem.roleCode;
      });
    }
    return {
      email: profiledata.emailId ? profiledata.emailId : '',
      empName: profiledata.empName ? profiledata.empName : '',
      boutiqueCode: profiledata.locationCode ? profiledata.locationCode : '',
      userType: profiledata.userType ? profiledata.userType : '',
      boutiqueDesc: profiledata.boutiqueDesc ? profiledata.boutiqueDesc : '',
      boutiqueType: profiledata.userType ? profiledata.userType : '',
      isBTQUser: profiledata.userType
        ? ProfileDataAdaptor.storetype.includes(profiledata.userType)
        : false,
      isCorpUser: profiledata.userType
        ? StoreTypes.CorporateStoreTypes === profiledata.userType
        : false,
      isRegUser: profiledata.userType
        ? StoreTypes.RegionalStoreType === profiledata.userType
        : false,
      regionCode: profiledata.regionCode ? profiledata.regionCode : '',
      isL1Boutique: profiledata.userType
        ? StoreTypes.LargeFormatStoreType === profiledata.userType
        : false,
      isL2Boutique: profiledata.userType
        ? StoreTypes.MediumFormatStoreType === profiledata.userType
        : false,
      isL3Boutique: profiledata.userType
        ? StoreTypes.SmallFormatStoreType === profiledata.userType
        : false,
      orgCode: profiledata.orgCode ? profiledata.orgCode : '',
      address: profiledata.address
        ? profiledata.address.data
          ? profiledata.address.data
          : null
        : null,
      roles: roles
    };
  }
}
