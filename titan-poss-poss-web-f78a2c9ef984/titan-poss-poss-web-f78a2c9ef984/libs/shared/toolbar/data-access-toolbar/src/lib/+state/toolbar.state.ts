import {
  CustomErrors,
  TransactionDetails,
  TransactionCount,
  MetalPrice,
  ToolbarConfig
} from '@poss-web/shared/models';

export interface ToolbarState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  metalPriceDetails: MetalPrice[];
  previousMetalPriceDetails: MetalPrice[];
  openOrdersResponse: TransactionDetails[];
  openOrdersCount: TransactionCount[];
  onHoldResponse: TransactionDetails[];
  onHoldCount: TransactionCount[];
  toolbarConfig: ToolbarConfig;
  confirmOrdersResponse: TransactionDetails[];
}
