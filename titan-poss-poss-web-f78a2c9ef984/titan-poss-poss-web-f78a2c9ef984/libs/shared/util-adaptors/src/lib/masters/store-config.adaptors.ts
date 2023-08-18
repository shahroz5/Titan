import { StoreBin } from '@poss-web/shared/models';
export class StoreConfigAdaptor {
  /* static StoreConfigDataFromJson(data: any): StoreConfig{
       return{
        address: data.address,
        brandCode:data.brandCode,
        cfaCodeValue: data.cfaCodeValue,
        cfaList: data.cfaList,
        configDetails: data.configDetails,
        contactNo: data.contactNo,
        countryCode: data.countryCode,
        description: data.description,
        factoryCodeValue: data.factoryCodeValue,
        factoryList:data.factoryList,
        fax: data.fax,
        isActive: data.isActive,
        locationCode: data.locationCode,
        locationEmail: data.locationEmail,
        locationFormat: data.locationFormat,
        locationTypeCode: data.locationTypeCode,
        ownerTypeCode: data.ownerTypeCode,
        phoneNo: data.phoneNo,
        pincode: data.pincode,
        regionCode: data.regionCode,
        registrationNo: data.registrationNo,
        stateCode: data.stateCode,
        townCode: data.townCode,
       }

  }
 */ static StoreBinDataFromJson(
    data: any
  ): StoreBin {
    return {
      binCode: data.binCode,
      binGroupCode: data.binGroupCode
    };
  }
}
