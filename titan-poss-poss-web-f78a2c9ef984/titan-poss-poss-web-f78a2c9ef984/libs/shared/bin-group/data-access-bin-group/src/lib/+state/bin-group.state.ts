
import { BinGroupEntity } from './bin-group.entity';
import { CustomErrors,BinGroupDetails } from '@poss-web/shared/models';


export interface BinGroupState {
  error: CustomErrors;
  binGroupDetailsListing: BinGroupEntity;
  binGroupDetails: BinGroupDetails;
  totalBinGroupDetails: number;
  isLoading: boolean;
  saveBinGroupResponses: BinGroupDetails;
  editBinGroupResponses: BinGroupDetails;
  isSearchElements: boolean
}
