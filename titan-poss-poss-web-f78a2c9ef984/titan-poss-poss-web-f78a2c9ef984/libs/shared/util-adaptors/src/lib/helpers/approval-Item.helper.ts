
import { LoadRequestResponseItems, RequestApprovalsItems } from '@poss-web/shared/models';
import { ApprovalsItemAdaptor } from '../request-approvals/approvals-Item.adaptor';

export class IbtApprovalsItemsHelper {

  static getItems(data: any, isSelectedData,studdedProductGroups:string[]=[]): LoadRequestResponseItems {
    const items: RequestApprovalsItems[] = [];
    for (const item of data.results) {
      items.push(ApprovalsItemAdaptor.fromJson(item, isSelectedData,studdedProductGroups));
    }
    return {

      count: data.totalElements ? data.totalElements : 0,
      items: items
    }
  }
}
