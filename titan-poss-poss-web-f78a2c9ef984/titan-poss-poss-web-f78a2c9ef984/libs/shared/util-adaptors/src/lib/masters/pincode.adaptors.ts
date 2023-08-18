import { Pincode } from '@poss-web/shared/models';

export class PincodeDataAdaptor {
  static pincodeDataSummaryFromJson(data: any): Pincode[] {
    const pincodeData: Pincode[] = [];
    for (const pincode of data.results) {
      pincodeData.push({
        cachementArea: pincode.cachementArea,
        countryCode: pincode.countryCode,
        id: pincode.id,
        isActive: pincode.isActive,
        pincode: pincode.pincode,
        townName: pincode.townName,
        stateName: pincode.stateName,
      });
    }
    return pincodeData;
  }
}
