import {
  CustomErrors,
  CoOrderPaymentConfigPayload,
  ProductGroup,
  CoOrderPaymentResponse
} from '@poss-web/shared/models';

export interface CoOrderPaymentConfigState {
  orderConfigList: CoOrderPaymentConfigPayload[];
  orderConfig: CoOrderPaymentConfigPayload;
  orderPaymentConfigDetails: CoOrderPaymentResponse[];
  allCoOrderPaymentConfigDetails: CoOrderPaymentResponse[];
  error: CustomErrors;
  hasSaved: boolean;
  IsUpdated: boolean;
  isLoading: boolean;
  totalElements: number;
  productGroups: ProductGroup[];

  configId: string;
  isCleared: boolean;
  ruleDetailsCount: number;
  uniqueNameCheckCount: number;
}
