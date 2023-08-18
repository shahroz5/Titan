import { CustomErrors, PIFSeries } from '@poss-web/shared/models';
export interface PIFSeriesState {
  pifSeries: PIFSeries[];
  error: CustomErrors;
  hasSaved: boolean;
  isLoading: boolean;
  totalElements: number;
}
