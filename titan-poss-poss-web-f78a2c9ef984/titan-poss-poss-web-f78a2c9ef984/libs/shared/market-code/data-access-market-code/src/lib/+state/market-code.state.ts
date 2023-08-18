import { CustomErrors, MarketCodeDetails } from '@poss-web/shared/models';
export interface MarketCodeState {
  error: CustomErrors;
  isLoading: boolean;
  marketCodeListing: MarketCodeDetails[];
  marketCodeDetails: MarketCodeDetails;
  totalMarketCodes: number;
  hasSavedMarketDetails: boolean;
  hasSavedMarketCodeFactors: boolean;
  hasUpdatedMarketDetails: boolean;
  hasUpdatedMarketCodeFacators: boolean;
  hasToggleButton: boolean;
}
