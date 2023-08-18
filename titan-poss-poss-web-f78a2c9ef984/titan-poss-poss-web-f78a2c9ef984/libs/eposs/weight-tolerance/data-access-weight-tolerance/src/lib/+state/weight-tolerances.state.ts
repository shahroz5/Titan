import {
  CustomErrors,
  ConfigDetails,
  WeightRange,
  ProductGroup,
  WeightTolerance
} from '@poss-web/shared/models';
export interface WeightToleranceState {
  configList: ConfigDetails[];
  selectedConfigIdDetails: ConfigDetails;
  totalElements: number;
  weightTolerance: WeightTolerance[];
  rangeWeight: WeightRange[];
  configId: string;
  hasSaved: boolean;
  hasUpdated: boolean;
  isLoading: boolean;
  error: CustomErrors;
  isCleared: boolean;
  productGroups: ProductGroup[];
}
