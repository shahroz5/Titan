import {
  LovMaster,
  LoadLovListingSuccessPayload,
  LovMasterType,
  LovMasterTypeMain
} from '@poss-web/shared/models';

export class LovMasterAdaptor {
  static getLOVTypes(data: any): LovMasterType[] {
    const lovMasterListing: LovMasterType[] = [];
    for (const listItem of data.results) {
      if(listItem.lovTypeName !== "Pricing Type"){
        lovMasterListing.push({
          name: listItem.lovTypeName,
          value: listItem.lovTypeCode + '|' + listItem.baseServicePath
        });
      }
    }

    return lovMasterListing;
  }

  static getLOVTypesMain(data: any): LovMasterTypeMain[] {
    const lovMasterListing: LovMasterTypeMain[] = [];
    for (const listItem of data.results) {
      if(listItem.lovTypeName !== "Refund Paymet Mode" && listItem.lovTypeName !== "Pricing Type"){
        lovMasterListing.push({
          name: listItem.lovTypeName,
          value: listItem.lovTypeCode + '|' + listItem.baseServicePath
        });
      }
    }

    return lovMasterListing;
  }

  static getLOVTypeListing(data: any): LoadLovListingSuccessPayload {
    const lovMasterListing: LovMaster[] = [];
    for (const listItem of data.results) {
      lovMasterListing.push({
        lovType: data.lovType,
        lovName: listItem.code,
        description: listItem.value,
        isActive: listItem.isActive
      });
    }

    const LovListing: LoadLovListingSuccessPayload = {
      LovListing: lovMasterListing,
      totalElements: 1
    };
    return LovListing;
  }

  static getLOVTypeCreate(data: any): LovMaster {
    const lovMaster: LovMaster = {
      lovType: data.lovType,
      lovName: data.value,
      description: data.code,
      isActive: true
    };

    return lovMaster;
  }
}
