import { SubRegionEntity } from './sub-region.entity';
import { SubRegion, CustomErrors } from '@poss-web/shared/models';

export interface SubRegionState {
  regionDetailsListing: SubRegionEntity;
  subRegionDetailsListing: SubRegionEntity;
  totalSubRegionDetails: number;
  error: CustomErrors;
  isLoading: boolean;
  subRegionDetailsBySubRegionCode: SubRegion;
  saveSubRegionDetailsResponse: SubRegion;
  editSubRegionDetailsResponse: SubRegion;
  isSearchElements: boolean;
}
