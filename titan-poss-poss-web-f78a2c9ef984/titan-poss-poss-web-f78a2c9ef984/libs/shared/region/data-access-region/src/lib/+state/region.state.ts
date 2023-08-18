import { RegionEntity } from './region.entity';
import { RegionsData, CustomErrors } from '@poss-web/shared/models';

export interface RegionsState {
  regionDetailsListing: RegionEntity;
  totalRegionDetails: number;
  error: CustomErrors;
  isLoading: boolean;
  regionDetailsByRegionCode: RegionsData;
  saveRegionDetailsResponse: RegionsData;
  editRegionDetailsResponse: RegionsData;
  // isSearchElements: boolean;
}
