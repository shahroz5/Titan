import {
  CustomErrors,
  TEPValidationConfigResult
} from '@poss-web/shared/models';
import { TepValidationConfigEntity } from './tep-validation-config.entity';

export interface TepValidationConfigState {
  tepValidationConfiglist: TepValidationConfigEntity;
  tepValidationConfigDetails: TEPValidationConfigResult;
  totalElements: number;
  error: CustomErrors;
  isLoading: boolean;
  hasSaved: boolean;
  hasUpdated: boolean;
}
