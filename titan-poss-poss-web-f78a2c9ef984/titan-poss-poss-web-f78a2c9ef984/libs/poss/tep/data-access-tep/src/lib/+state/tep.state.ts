import {
  TEPRefundStatusListEntity,
  TEPRequestStatusListEntity
} from './tep.entity';
import {
  CustomErrors,
  ABSearchValues,
  TEPDownValues,
  GetTepItemConfiguratonResponse,
  TEPSearchResponse,
  TEPList,
  HistorySearchParamDetails,
} from '@poss-web/shared/models';

export class TEPRequestState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  searchValues: ABSearchValues;
  TEPRequestStatusList: TEPRequestStatusListEntity;
  TEPRequestStatusListCount: number;
  refundDetails: any;
  searhTEPResponseCount: number;
  approvedRefundDetails: any;
  TEPRefundRequestStatusList: TEPRefundStatusListEntity;
  TEPRefundRequestStatusListCount: number;
  selectedData: any;
  historySearchParamDetails: HistorySearchParamDetails;
  historyItems: TEPSearchResponse;
  searhTEPResponse: TEPList[];
  tepItemConfiguratonResponse: GetTepItemConfiguratonResponse;
  requestStausDropDownValues: TEPDownValues;
  refundStausDropDownValues: TEPDownValues;
}
