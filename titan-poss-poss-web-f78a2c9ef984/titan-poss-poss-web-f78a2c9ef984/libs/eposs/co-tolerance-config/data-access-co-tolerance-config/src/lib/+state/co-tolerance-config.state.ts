import {
  CustomErrors,
  CoToleranceConfigResponse,
  CoToleranceWeightRange,
  CoToleranceConfigMetalType
} from '@poss-web/shared/models';

export interface CoToleranceConfigState {
  coToleranceConfigList: CoToleranceConfigResponse[];
  toleranceConfigMapping: any;
  coToleranceConfig: CoToleranceConfigResponse;
  totalElements: number;
  isLoading: boolean;
  configId: any;
  hasSaved: boolean;
  hasUpdated: boolean;
  error: CustomErrors;
  isCleared: boolean;
  rangeWeight: CoToleranceWeightRange[];
  metalType: CoToleranceConfigMetalType[];
  uniqueNameCheckCount: number;
  ruleDetailsCount: number;
}
