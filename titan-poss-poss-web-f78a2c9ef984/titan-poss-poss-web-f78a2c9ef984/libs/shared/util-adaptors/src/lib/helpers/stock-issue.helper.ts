import { StockRequestNote } from '@poss-web/shared/models';
import { StockIssueAdaptor } from '../stock-issue/stock-issue-adaptor';

export class StockIssueHelper {
  static getIssues(data: any): { response: StockRequestNote[]; count: number } {
    const response: StockRequestNote[] = [];
    for (const stock of data.results) {
      response.push(StockIssueAdaptor.fromJson(stock));
    }
    return { response, count: data.totalElements };
  }
}
