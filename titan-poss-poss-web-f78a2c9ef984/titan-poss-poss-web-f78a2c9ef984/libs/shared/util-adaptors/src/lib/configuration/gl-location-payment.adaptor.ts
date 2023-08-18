import {
  GLLocationPaymentList,
  SaveGlLocationPayments,
  GLLocationPaymentSuccessList,
  PaymentCodes,
  LocationCodeDetails
} from '@poss-web/shared/models';
import * as moment from 'moment';

export class GlLocationPaymentAdaptor {
  static getGlBoutiqueLocationListing(data: any): GLLocationPaymentSuccessList {
    console.log(data, 'in adap');

    const glLocationPaymentList: GLLocationPaymentList[] = [];
    for (const listItem of data.results) {
      // let i = 0;
      console.log(
        moment().diff(moment(listItem.lastModifiedDate), 'seconds'),
        'adap'
      );

      glLocationPaymentList.push({
        id: listItem.id,
        glCode: listItem.glCode ? listItem.glCode : '',
        locationCode: listItem.locationCode ? listItem.locationCode : '',
        paymentCode: listItem.paymentCode ? listItem.paymentCode : false,
        lastModified:
          moment().diff(moment(listItem.lastModifiedDate), 'seconds') < 60
            ? true
            : false
      });
      // i++;
    }
    console.log(glLocationPaymentList, 'glLocationPaymentList');

    return {
      glLocationPaymentList: glLocationPaymentList,
      count: data.totalElements
    };
  }

  static getPaymentCodes(data: any): PaymentCodes[] {
    const paymentCodeList: PaymentCodes[] = [];
    for (const item of data.results) {
      paymentCodeList.push({
        value: item.paymentCode ? item.paymentCode : '',
        description: item.description ? item.description : ''
      });
    }
    return paymentCodeList;
  }

  static getLocationDetails(data: any): LocationCodeDetails[] {
    const locationCodes: LocationCodeDetails[] = [];
    for (const detail of data.results) {
      locationCodes.push({
        locationCode: detail.locationCode,
        description: detail.description
      });
    }
    return locationCodes;
  }
}
