import { Courier } from '@poss-web/shared/models';
import { CourierAdaptor } from '../masters/courier.adaptors';

export class CourierHelper {
  static getCouriers(data: any): Courier[] {
    const couriers: Courier[] = [];
    for (const courier of data) {
      couriers.push(CourierAdaptor.courierDataFromJson(courier));
    }
    return couriers;
  }
}
