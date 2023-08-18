import {
  CnPriorityConfig,
  CnPriorityConfigResponse,
  CnTypeList,
  CustomErrors
} from '@poss-web/shared/models';

export interface CnPriorityConfigState {
  cnPriorityConfigList: CnPriorityConfig[];
  cnPriorityConfig: CnPriorityConfigResponse;
  error: CustomErrors;
  hasSaved: boolean;
  hasUpdated: boolean;
  isLoading: boolean;
  totalElements: number;
  cnTypeList: CnTypeList[];
}
