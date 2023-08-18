import { CustomErrors, BrandMaster } from '@poss-web/shared/models';
import { SubBrandEntity } from './subbrand.entity';

export interface SubBrandState {
  subBrandList: SubBrandEntity;
  totalElements: number;
  error: CustomErrors;
  subBrandDetails: BrandMaster;
  isLoading: boolean;
  hasUpdated: boolean;
  hasSaved: boolean;
  parentBrands: any;
  isActiveUpdated: boolean;
}
