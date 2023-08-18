import {
  RazorpayVendorSuccessList,
  RazporVendorList
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class RazorpayVendorConfigurationAdaptor {
  static getVendorList(data: any): RazorpayVendorSuccessList {
    const vendorList: RazporVendorList[] = [];
    for (const listItem of data.results) {
      vendorList.push({
        newlyAdded:
          moment().diff(moment(listItem.createdDate), 'seconds') < 60
            ? true
            : false,
        locationCode: listItem.locationCode,
        accountId: listItem.accountId
      });
    }
    return { vendorList: vendorList, count: data.totalElements };
  }
}
