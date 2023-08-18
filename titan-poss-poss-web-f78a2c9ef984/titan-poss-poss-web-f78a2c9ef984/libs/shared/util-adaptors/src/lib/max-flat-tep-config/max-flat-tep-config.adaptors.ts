import {
  GetMaxFlatTepConfigResponse,
  MaxFlatTepConfigDetails,
  MaxFlatTepConfigResults
} from '@poss-web/shared/models';

export class MaxFlatTepConfigAdaptor {
  static getConfigDetailsFromListResponse(
    data: MaxFlatTepConfigResults
  ): MaxFlatTepConfigDetails {
    if (data && data.results && data.results.length > 0) {
      return {
        type: data.results[0].configType,
        data: data.results[0].configDetails.data,
        configId: data.results[0].configId
      };
    } else {
      return {
        type: 'TEP_GLOBAL',
        data: null
      };
    }
  }

  static getConfigDetailsFromUpdateResponse(
    data: GetMaxFlatTepConfigResponse
  ): MaxFlatTepConfigDetails {
    if (data) {
      return {
        type: data.configType,
        data: data.configDetails.data,
        configId: data.configId
      };
    } else {
      return null;
    }
  }
}
