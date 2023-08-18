import {
  CustomErrors,
  TEPStoneConfig,
  TEPStoneConfigDetails,
  TEPStoneConfigQualities,
  TEPStoneConfigRange,
  TEPStoneConfigStoneType
} from '@poss-web/shared/models';

import {
  TepStoneConfigDetailsEntity,
  TepStoneConfigEntity
} from './tep-stone-config.entity';

export interface TepStoneConfigState {
  tepStoneConfiglist: TepStoneConfigEntity;
  tepStoneConfigDetails: TEPStoneConfig;
  totalElements: number;
  tepStoneConfigDetailslist: TepStoneConfigDetailsEntity;
  tepStoneConfigDetailsData: TEPStoneConfigDetails;
  totalDetailsElements: number;
  tepStoneConfigStoneType: TEPStoneConfigStoneType[];
  tepStoneConfigQualities: TEPStoneConfigQualities[];
  tepStoneConfigRange: TEPStoneConfigRange[];
  error: CustomErrors;
  isLoading: boolean;
  hasSaved: boolean;
  hasUpdated: boolean;
}
