import { BrandEntity } from './brand-master.entity';
import { CustomErrors, BrandMasterDetails } from '@poss-web/shared/models';

export interface BrandMasterState {
  brandlist: BrandEntity;
  brandDetails: BrandMasterDetails;
  totalElements: number;
  error: CustomErrors;
  isLoading: boolean;
  hasSaved: boolean;
}
