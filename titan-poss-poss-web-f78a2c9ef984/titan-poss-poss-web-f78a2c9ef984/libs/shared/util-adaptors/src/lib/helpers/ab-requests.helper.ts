import { ABRequests, AB } from '@poss-web/shared/models';
import { ABRequestsAdaptor } from '../ab-requests/ab-requests.adaptor';

export class ABRequestsHelper {
  static getBills(data: any): ABRequests {
    const abs: AB[] = [];
    for (const bill of data.results) {
      abs.push(ABRequestsAdaptor.ABRequestsfromJson(bill));
    }
    return {
      count: data.totalElements ? data.totalElements : 0,
      results: abs
    };
  }
}
