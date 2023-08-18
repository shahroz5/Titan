import {
  AirpayVendorList,
  AirpayVendorSuccessList
} from '@poss-web/shared/models';
import * as moment from 'moment';
export class AirpayConfigurationAdaptor {
  static getVendorList(data: any): AirpayVendorSuccessList {
    console.log(data, 'adaptor');
    const vendorList: AirpayVendorList[] = [];
    for (const listItem of data.results) {
      vendorList.push({
        newlyAdded:
          moment().diff(moment(listItem.createdDate), 'seconds') < 60
            ? true
            : false,
        locationCode: listItem.locationCode,
        MerchantId: listItem.MerchantId,
        Username: listItem.Username,
        Password: listItem.Password,
        SecretKey: listItem.SecretKey,
        SecretToken: listItem.SecretToken
      });
    }
    console.log(vendorList, 'vendorList in adaptor');
    return { vendorList: vendorList, count: data.totalElements };
  }
}
