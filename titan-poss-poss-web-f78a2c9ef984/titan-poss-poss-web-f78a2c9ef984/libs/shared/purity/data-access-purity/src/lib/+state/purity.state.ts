import { CustomErrors, Purity, MaterialType } from '@poss-web/shared/models';
import { PurityEntity } from './purity.entity';

export interface PurityState {
  purityList: PurityEntity;
  error: CustomErrors;
  isLoading: boolean;
  totalElements: number;
  metalType: MaterialType[];
  purity: Purity;
  hasUpdated: boolean;
  hasSaved: boolean;
  isActiveUpdated: boolean;
}
