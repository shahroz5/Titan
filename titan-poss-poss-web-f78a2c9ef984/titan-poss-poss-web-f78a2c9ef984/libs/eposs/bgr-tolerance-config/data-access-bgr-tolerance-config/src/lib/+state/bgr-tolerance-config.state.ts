import {
  CustomErrors,
  AbToleranceConfigResponse,
  AbToleranceRangeMappingResponse,
  AbToleranceWeightRange,
  AbToleranceConfigMetalType
} from '@poss-web/shared/models';

export interface BgrToleranceConfigState {
  bgrToleranceConfigList: AbToleranceConfigResponse[];
  bgrToleranceConfig: AbToleranceConfigResponse;
  toleranceConfigMapping: AbToleranceRangeMappingResponse;
  totalElements: number;
  isLoading: boolean;
  configId?: string;
  hasSaved: boolean;
  hasUpdated: boolean;
  error: CustomErrors;
  isCleared: boolean;
  rangeWeight: AbToleranceWeightRange[];
  metalType: AbToleranceConfigMetalType[];
  configIdInSlabValidationFailure: number;
}
