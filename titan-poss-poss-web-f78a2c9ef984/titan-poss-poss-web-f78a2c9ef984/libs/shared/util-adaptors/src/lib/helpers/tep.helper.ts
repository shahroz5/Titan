import {
  TEPList,
  TEPSearchResponse
} from '@poss-web/shared/models';
import { TEPAdaptor } from '../tep/tep.adaptors';

export class TEPHelper {
  static getTEPDetails(dataList: any): TEPSearchResponse {
    if (!dataList) {
      return null;
    }
    const ABDetails: TEPList[] = [];

    for (const data of dataList.results) {
      ABDetails.push(TEPAdaptor.TEPSearchList(data));
    }

    return { TEPList: ABDetails, totalElements: dataList.totalElements };
  }

  static getHistoryDetails(dataList: any): TEPSearchResponse {
    if (!dataList) {
      return null;
    }
    const ABDetails: TEPList[] = [];

    for (const data of dataList.results) {
      ABDetails.push(TEPAdaptor.TEPHistoryList(data));
    }

    return { TEPList: ABDetails, totalElements: dataList.totalElements };
  }
}
