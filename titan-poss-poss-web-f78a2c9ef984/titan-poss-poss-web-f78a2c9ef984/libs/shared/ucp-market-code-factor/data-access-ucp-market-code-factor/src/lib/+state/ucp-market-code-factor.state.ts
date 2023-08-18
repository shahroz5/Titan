import {
  CustomErrors,
  UcpMarketCode,
  UcpProductGroup,
  MarketCode
} from '@poss-web/shared/models';

export interface UcpMarketCodeFactorState {
  ucpMarketCodeList: UcpMarketCode[];
  ucpMarketCode: UcpMarketCode;
  ucpProductGroup: UcpProductGroup[];
  marketCode: MarketCode[];
  isLoading: boolean;
  error: CustomErrors;
  hasSaved: boolean;
  hasUpdated: boolean;
  totalElements: number;
}
