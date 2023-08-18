import {
  CustomErrors,
  CnValidationResponse,
  CnTypeList
} from '@poss-web/shared/models';

export interface CnValidationState {
  cnValidationList: CnValidationResponse[];
  cnValidation: CnValidationResponse;
  error: CustomErrors;
  hasSaved: boolean;
  hasUpdated: boolean;
  isLoading: boolean;
  totalElements: number;
  cnTypeList: CnTypeList[];
}
