import { CmRequestList } from '@poss-web/shared/models';
import { CmRequestAdaptor } from '../cm-request/cm-request.adaptor';

export class CmRequestHelper {
  static getCmRequestList(data: any): CmRequestList[] {
    console.log('data:', data);
    if (!data) {
      return null;
    }
    const cmRequestList: CmRequestList[] = [];
    for (const cmRequest of data.results) {
      cmRequestList.push(
        CmRequestAdaptor.getCmRequestListFromJson(cmRequest, data.totalElements)
      );
    }
    console.log('cmRequestList:', cmRequestList);
    return cmRequestList;
  }
}
