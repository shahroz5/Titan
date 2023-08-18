import { LoadRequestResponse, RequestApprovals } from '@poss-web/shared/models';
import { RequestApprovalsItemsAdaptor } from '../request-approvals/request-approvals-items.adaptor';

export class IbtRequestApprovalsItemHelper {

  static getItems(data: any): LoadRequestResponse {
    const items: RequestApprovals[] = [];
    for (const item of data.results) {
      items.push(RequestApprovalsItemsAdaptor.fromJson(item));
    }
    return {

      count: data.totalElements ? data.totalElements : 0,
      items: items
    }
  }
}
