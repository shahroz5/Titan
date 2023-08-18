

import { BinCodeList, BinCodeEditModel, LocationList, LocationMappingPost, SaveBinCodeFormPayload, CustomErrors } from '@poss-web/shared/models';
import { BinEntity } from './bin.entity';


export interface BinState {
  error: CustomErrors,
  binCodeSaveNewResponses: SaveBinCodeFormPayload;
  binCodeDetailsListing: BinCodeList[];
  totalBinCodeDetails: number;
  binCodesByBinGroup: BinEntity;
  isBinCodeLoading: boolean;
  editBinCodeResponses: BinCodeEditModel;
  locationsByBinCodesAndBinGroup: LocationList[];
  locationMappingResponse: LocationMappingPost;
  isSearchElements: boolean
}
