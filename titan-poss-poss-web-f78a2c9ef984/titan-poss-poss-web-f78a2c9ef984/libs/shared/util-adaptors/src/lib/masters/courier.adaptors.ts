import { Courier } from '@poss-web/shared/models';

export class CourierAdaptor {
  static courierDataFromJson(data: any): Courier {
    return {
      address: data.address,
      contactPerson: data.contactPerson,
      courierName: data.courierName,
      isActive: data.isActive,
      mailId: data.mailId,
      mobileNumber: data.mobileNumber,
      phoneNumber: data.phoneNumber,
      stateCode: data.stateCode,
      townCode: data.townCode
    };
  }
}
