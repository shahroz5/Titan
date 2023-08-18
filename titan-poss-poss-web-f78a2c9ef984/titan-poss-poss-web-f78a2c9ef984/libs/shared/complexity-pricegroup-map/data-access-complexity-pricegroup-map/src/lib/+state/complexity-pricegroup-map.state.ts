import { Complexity, CustomErrors, PriceGroups, ComplexityPriceGroupDetails } from '@poss-web/shared/models';

export interface ComplexityPricegroupState {
  error: CustomErrors;
  complexityPricegroupListing: ComplexityPriceGroupDetails[];
  complexityPricegroupDetails: ComplexityPriceGroupDetails;
  totalComplexityPricegroupDetails: number;
  isLoading: boolean;
  savecomplexityPricegroup: ComplexityPriceGroupDetails;
  editcomplexityPricegroup: ComplexityPriceGroupDetails;
  complexityCode: Complexity[];
  pricegroup: PriceGroups[];
  isUploadSuccess: any;
}
