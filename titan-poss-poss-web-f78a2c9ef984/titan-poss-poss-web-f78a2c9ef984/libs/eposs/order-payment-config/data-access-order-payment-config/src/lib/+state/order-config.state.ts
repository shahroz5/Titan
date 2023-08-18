import {
  CustomErrors,
  OrderPaymentConfigPayload,
  ProductGroup,
  OrderPaymentResponse
} from '@poss-web/shared/models';

export interface OrderPaymentConfigState {
  orderConfigList: OrderPaymentConfigPayload[];
  orderConfig: OrderPaymentConfigPayload;
  orderPaymentConfigDetails: OrderPaymentResponse[];
  allOrderPaymentConfigDetails: OrderPaymentResponse[];
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
