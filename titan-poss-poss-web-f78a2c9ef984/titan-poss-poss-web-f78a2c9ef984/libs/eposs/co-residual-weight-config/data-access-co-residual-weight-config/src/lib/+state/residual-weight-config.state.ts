import {
  CustomErrors,
  ResidualWeightConfigResponse,
  ResidualWeightRange
} from '@poss-web/shared/models';

export interface ResidualWeightConfigState {
  residualWeightConfigList: ResidualWeightConfigResponse[];
  residualWeightConfig: ResidualWeightConfigResponse;
  // rangeMapping: RangeMappingResponse;
  rangeMapping: any;
  totalElements: number;
  isLoading: boolean;
  // configId: string;
  configId: any;
  hasSaved: boolean;
  hasUpdated: boolean;
  error: CustomErrors;
  isCleared: boolean;
  rangeWeight: ResidualWeightRange[];
  ruleDetailsCount: number;
}
