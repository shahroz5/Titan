import {
  CustomErrors,
  TEPProductGroupConfigDetails
} from '@poss-web/shared/models';
import {
  TepProductGroupConfigEntity,
  TepProductGroupMappingEntity
} from './tep-product-group-config.entity';

export interface TepProductGroupConfigState {
  tepProductGroupConfiglist: TepProductGroupConfigEntity;
  tepProductGroupConfigDetails: TEPProductGroupConfigDetails;
  totalElements: number;
  tepProductGroupMappinglist: TepProductGroupMappingEntity;
  tepProductGroupMappingDetails: TEPProductGroupConfigDetails;
  totalMappingElements: number;
  error: CustomErrors;
  isLoading: boolean;
  hasSaved: boolean;
  hasUpdated: boolean;
}
