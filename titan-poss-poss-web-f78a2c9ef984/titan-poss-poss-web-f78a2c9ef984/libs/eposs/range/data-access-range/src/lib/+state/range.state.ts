import {
  ConfigurationRanges,
  CustomErrors,
  Lov,
} from '@poss-web/shared/models';
export interface RangeState {
  error: CustomErrors;
  isLoading: boolean;
  hasSaved: boolean;
  ranges: ConfigurationRanges[];
  rangeTypes: Lov[];
}
