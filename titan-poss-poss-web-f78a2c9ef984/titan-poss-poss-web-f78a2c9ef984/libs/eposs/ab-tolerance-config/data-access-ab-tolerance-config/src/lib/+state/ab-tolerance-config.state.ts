import {
  CustomErrors,
  AbToleranceConfigResponse,
  AbToleranceWeightRange,
  AbToleranceConfigMetalType
} from '@poss-web/shared/models';

export interface AbToleranceConfigState {
  abToleranceConfigList: AbToleranceConfigResponse[];
  toleranceConfigMapping: any;
  abToleranceConfig: AbToleranceConfigResponse;
  totalElements: number;
  isLoading: boolean;
  configId: any;
  hasSaved: boolean;
  hasUpdated: boolean;
  error: CustomErrors;
  isCleared: boolean;
  rangeWeight: AbToleranceWeightRange[];
  metalType: AbToleranceConfigMetalType[];
  uniqueNameCheckCount: number;
  ruleDetailsCount: number;
}
