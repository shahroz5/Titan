import { AbManualRequestList } from '@poss-web/shared/models';
import { AbManulRequestAdaptor } from '../ab-manual-request/ab-manual-request.adaptor';

export class AbManualRequestHelper {
  static getAbManualRequestList(data: any): AbManualRequestList[] {
    console.log('data:', data);
    if (!data) {
      return null;
    }
    const abManualRequestList: AbManualRequestList[] = [];
    for (const AbManualRequest of data.results) {
      abManualRequestList.push(
        AbManulRequestAdaptor.getAbManualRequestListFromJson(
          AbManualRequest,
          data.totalElements
        )
      );
    }
    console.log('AbManualRequestList:', abManualRequestList);
    return abManualRequestList;
  }
}
