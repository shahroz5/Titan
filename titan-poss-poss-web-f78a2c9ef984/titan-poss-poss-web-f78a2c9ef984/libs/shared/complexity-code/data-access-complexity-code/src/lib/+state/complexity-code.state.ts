import { CustomErrors, ComplexityCode } from '@poss-web/shared/models';

export interface ComplexityCodeState {
  compexityCodeList: ComplexityCode[];
  complexityCode: ComplexityCode;
  isLoading: boolean;
  error: CustomErrors;
  hasSaved: boolean;
  hasUpdated: boolean;
  totalElements: number;
}
