import { F2MarginListResponse, F2MarginList } from '@poss-web/shared/models';

export class F2MarginAdaptor {
  static getF2MarginListData(data: any): F2MarginListResponse {
    const f2MarginList: F2MarginList[] = [];
    for (const listItem of data.results) {
      f2MarginList.push({
        cfa: listItem.productGroupCode,
        stoneBandFrom: listItem.fromBand,
        stoneBandTo: listItem.toBand,
        f1From: listItem.fromPrice,
        f1To: listItem.toPrice,
        margin: listItem.margin,
        id: listItem.id
      });
    }
    return {
      f2MarginList: f2MarginList,
      totalElements: data.totalElements
    };
  }
}
