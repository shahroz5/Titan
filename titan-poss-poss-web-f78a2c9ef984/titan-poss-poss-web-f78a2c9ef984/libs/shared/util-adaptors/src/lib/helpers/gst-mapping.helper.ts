import {
  GSTMappingResponse,
  GSTMappingDetails,
  Tax
} from '@poss-web/shared/models';
import { GSTMappingAdaptor } from '../configuration/gst-mapping.adaptor';

export class GSTMappingHelper {
  static getGSTMappingDetails(data: any): GSTMappingResponse {
    let gstResponse: GSTMappingResponse = null;
    const gstMappingList: GSTMappingDetails[] = [];
    for (const gstMapping of data.results) {
      gstMappingList.push(GSTMappingAdaptor.getGSTMappingDetails(gstMapping));
    }
    gstResponse = {
      gstMappingList: gstMappingList,
      totalElements: data.totalElements
    };

    return gstResponse;
  }

  static getTaxDetails(data: any): Tax[] {
    const taxDetails: Tax[] = [];
    for (const tax of data.results) {
      taxDetails.push(GSTMappingAdaptor.getTaxDetails(tax));
    }

    return taxDetails;
  }
}
