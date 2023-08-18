import {
  GEPProductDetails,
  CancelGepItem,
  CancelGep,
  GEPSearchResponse,
  GEPList
} from '@poss-web/shared/models';

import { GepAdaptor } from '../gep/gep.adaptor';

export class GepHelper {
  static getGeps(data: any): GEPProductDetails[] {
    const geps: GEPProductDetails[] = [];
    for (const gep of data) {
      geps.push(GepAdaptor.onHoldfromJson(gep));
    }
    return geps;
  }

  static getcancelGeps(data: any): CancelGep {
    console.log(data, 'cancel');
    const items: CancelGepItem[] = [];
    for (const item of data.results) {
      items.push(GepAdaptor.CancelfromJson(item));
    }
    return {
      results: items,
      totalElements: data.totalElements
    };
  }

  static getGEPDetails(dataList: any): GEPSearchResponse {
    if (!dataList) {
      return null;
    }
    const ABDetails: GEPList[] = [];

    for (const data of dataList.results) {
      ABDetails.push(GepAdaptor.GEPSearchList(data));
    }

    return { GEPList: ABDetails, totalElements: dataList.totalElements };
  }

  static getHistoryDetails(dataList: any): GEPSearchResponse {
    if (!dataList) {
      return null;
    }
    const ABDetails: GEPList[] = [];

    for (const data of dataList.results) {
      ABDetails.push(GepAdaptor.GEPHistoryList(data));
    }

    return { GEPList: ABDetails, totalElements: dataList.totalElements };
  }
}
