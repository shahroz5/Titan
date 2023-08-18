import {
  OtherIssuedataModel,
  OtherIssueModel,
  OtherIssuesHistoryItem
} from '@poss-web/shared/models';
import { OtherIssuesAdaptor } from '../other-issues/other-issues.adaptor';

export class OtherIssuesDataHelper {
  static getOtherisssuesData(data: any): OtherIssuedataModel {
    const otherIssueData: OtherIssuedataModel = new OtherIssuedataModel();
    otherIssueData.totalElements = data.totalElements;
    for (const OtherIssue of data.results) {
      otherIssueData.issueData.push(
        OtherIssuesAdaptor.OtherIssueDatafromJson(OtherIssue)
      );
    }
    return otherIssueData;
  }
  static getOtherisssuesSearchData(data: any): OtherIssueModel[] {
    const otherIssueSearchData: OtherIssueModel[] = [];
    for (const OtherIssue of data) {
      otherIssueSearchData.push(
        OtherIssuesAdaptor.OtherIssueDatafromJson(OtherIssue)
      );
    }
    return otherIssueSearchData;
  }

  static getItems(
    data: any,
    studdedProductGroups: string[] = []
  ): { items: OtherIssuesHistoryItem[]; count: number } {
    const items: OtherIssuesHistoryItem[] = [];
    for (const item of data.results) {
      items.push(OtherIssuesAdaptor.getHistoryItem(item, studdedProductGroups));
    }

    return { items, count: data.totalElements };
  }
}
